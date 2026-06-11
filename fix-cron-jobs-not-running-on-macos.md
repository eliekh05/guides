---
layout: default
title: "Fix cron Jobs Not Running"
parent: "Task Scheduling"
nav_order: 1
---

# Fix cron Jobs Not Running on macOS

`cron` is a classic Unix tool for scheduling tasks. It still exists on macOS but has several limitations that cause jobs to silently fail. This guide explains why, and gives you working solutions.

---

## Why cron Jobs Fail on macOS

### 1. The Mac was asleep
`cron` requires the system to be awake at the exact scheduled time. If your Mac is asleep, the job is **skipped entirely** — it does not run when the Mac wakes up.

### 2. No PATH or shell environment
Just like `launchd`, `cron` runs with a minimal environment. Commands like `brew`, `python3`, or scripts that rely on your `.zshrc` setup will fail with "command not found".

### 3. Full Disk Access not granted
Since macOS Catalina, `cron` (and the `crontab` process) needs Full Disk Access to read or write to protected folders. Without it, jobs that touch files in Desktop, Documents, Downloads, etc. will fail silently.

### 4. cron is not recommended by Apple
Apple officially deprecated `cron` in favor of `launchd`. While `cron` still works for simple tasks, it will never run missed jobs after a sleep, does not integrate with macOS power management, and gets no active development.

---

## Fix 1 — Use Full Paths in Your cron Commands

Replace every command with its full path:

```bash
# Wrong — may fail in cron
0 9 * * * brew update

# Correct
0 9 * * * /opt/homebrew/bin/brew update       # Apple Silicon
0 9 * * * /usr/local/bin/brew update          # Intel Mac
```

To find the full path of any command:
```bash
which brew
which python3
which node
```

---

## Fix 2 — Grant Full Disk Access to cron

1. Open **System Settings** → **Privacy & Security** → **Full Disk Access**.
2. Click the **+** button.
3. Press **Command (⌘) + Shift + G** to open the Go to Folder dialog.
4. Type `/usr/sbin/` and press Enter.
5. Select **cron** and click **Open**.
6. Make sure the toggle next to `cron` is **on**.

---

## Fix 3 — Add a Shell and PATH to Your crontab

At the top of your crontab, explicitly define the shell and PATH:

```bash
SHELL=/bin/zsh
PATH=/opt/homebrew/bin:/usr/local/bin:/usr/bin:/bin:/usr/sbin:/sbin

# Your jobs below
0 9 * * * /path/to/your/script.sh
```

Open your crontab to edit it:
```bash
crontab -e
```

---

## Fix 4 — Add Logging to See What Is Failing

Redirect output to a log file so you can see what is happening:

```bash
0 9 * * * /path/to/script.sh >> /tmp/myjob.log 2>&1
```

- `>>` appends output to the log file
- `2>&1` redirects error messages to the same log

After the scheduled time, check the log:
```bash
cat /tmp/myjob.log
```

---

## Fix 5 — Switch to launchd for Reliable Scheduling

If your job must run even after the Mac wakes from sleep, use `launchd` instead of `cron`. `launchd` is macOS-native, integrates with power management, and can run missed jobs on wake.

Create a plist file at `~/Library/LaunchAgents/com.yourname.yourjob.plist`:

```xml
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN"
  "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
    <key>Label</key>
    <string>com.yourname.yourjob</string>

    <key>EnvironmentVariables</key>
    <dict>
        <key>PATH</key>
        <string>/opt/homebrew/bin:/usr/local/bin:/usr/bin:/bin:/usr/sbin:/sbin</string>
    </dict>

    <key>ProgramArguments</key>
    <array>
        <string>/bin/zsh</string>
        <string>/Users/yourname/scripts/yourscript.zsh</string>
    </array>

    <key>StartCalendarInterval</key>
    <dict>
        <key>Hour</key>
        <integer>9</integer>
        <key>Minute</key>
        <integer>0</integer>
    </dict>

    <key>StandardOutPath</key>
    <string>/tmp/yourjob.log</string>
    <key>StandardErrorPath</key>
    <string>/tmp/yourjob-error.log</string>
</dict>
</plist>
```

Load it:
```bash
launchctl load ~/Library/LaunchAgents/com.yourname.yourjob.plist
```

See the companion guide **"Fix launchd / plist Scripts Not Running (macOS)"** for more detail on launchd troubleshooting.

---

## cron vs launchd — Quick Comparison

| Feature | cron | launchd |
|---|---|---|
| Runs missed jobs after sleep | ❌ No | ✅ Yes |
| Loads PATH automatically | ❌ No | ❌ No (must set manually) |
| GUI tools available | Some | Lingon X |
| Apple recommended | ❌ Deprecated | ✅ Yes |
| Easy to set up quickly | ✅ Yes | ❌ More verbose |

For simple one-off tests, `cron` is fine. For anything that needs to run reliably on a Mac, use `launchd`.
