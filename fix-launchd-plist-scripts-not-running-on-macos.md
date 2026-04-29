---
layout: default
title: "Fix launchd / plist Scripts Not Running"
parent: "Task Scheduling"
nav_order: 2
---

# Fix launchd / plist Scripts Not Running on macOS

`launchd` is macOS's built-in task scheduler — the replacement for `cron`. It is used to run scripts automatically on a schedule or at login. However, it is notoriously difficult to get working because it runs in a completely different environment from your Terminal. Scripts that work perfectly in Terminal often fail silently under `launchd` for reasons that are hard to diagnose.

This guide explains why this happens and how to fix it.

**Requirements:** macOS 10.10 (Yosemite) or later.

---

## Why launchd Scripts Fail Silently

There are three main reasons a script that works in Terminal will fail under `launchd`:

1. **No PATH** — `launchd` does not load your shell's PATH. Commands like `brew`, `python3`, `node`, or any tool installed in `/usr/local/bin` or `/opt/homebrew/bin` are not found unless you specify their full path.

2. **No shell environment** — `launchd` does not source your `.zshrc`, `.zprofile`, or `.bash_profile`. Environment variables you set there are not available.

3. **No disk access** — since macOS Catalina, scripts launched by `launchd` are blocked from accessing protected folders (Desktop, Documents, Downloads, etc.) unless the terminal or interpreter has been granted Full Disk Access.

---

## Fix 1 — Use Full Paths for Every Command

In your script, replace every command with its full path. Do not rely on PATH being set.

To find the full path of any command, run in Terminal:
```bash
which brew
which python3
which node
```

Then in your script, replace:
```bash
brew update
```
With:
```bash
/opt/homebrew/bin/brew update   # Apple Silicon Mac
# or
/usr/local/bin/brew update      # Intel Mac
```

**Common full paths:**

| Command | Apple Silicon | Intel Mac |
|---|---|---|
| `brew` | `/opt/homebrew/bin/brew` | `/usr/local/bin/brew` |
| `python3` | `/opt/homebrew/bin/python3` | `/usr/local/bin/python3` |
| `node` | `/opt/homebrew/bin/node` | `/usr/local/bin/node` |
| `git` | `/usr/bin/git` | `/usr/bin/git` |
| `rsync` | `/usr/bin/rsync` | `/usr/bin/rsync` |

---

## Fix 2 — Set PATH Inside the plist

You can define environment variables directly in your plist file so `launchd` has them available:

```xml
<key>EnvironmentVariables</key>
<dict>
    <key>PATH</key>
    <string>/opt/homebrew/bin:/usr/local/bin:/usr/bin:/bin:/usr/sbin:/sbin</string>
</dict>
```

Add this block inside the main `<dict>` of your plist, alongside your `Label` and `ProgramArguments`.

---

## Fix 3 — Grant Full Disk Access to Terminal (or bash/zsh)

If your script accesses protected folders (Desktop, Documents, Downloads, Pictures), you need to give the shell interpreter Full Disk Access.

1. Open **System Settings** → **Privacy & Security** → **Full Disk Access**.
2. Click the **+** button.
3. Navigate to `/bin/` and add **zsh** (or **bash** if your script uses bash).
4. Make sure the toggle next to it is **on**.

> **Note:** This gives Full Disk Access to ALL scripts run by that shell, not just yours. Only do this if you trust the scripts running on your machine.

Alternatively, wrap your shell script in an **Automator app** and give the Automator app Full Disk Access instead. This limits the access to one specific automation.

---

## Fix 4 — Add Logging to Diagnose the Problem

`launchd` gives no error output by default. Add log output to your plist to capture what is going wrong:

```xml
<key>StandardOutPath</key>
<string>/tmp/my-script.log</string>
<key>StandardErrorPath</key>
<string>/tmp/my-script-error.log</string>
```

After your script runs (or fails to run), check the logs:
```bash
cat /tmp/my-script.log
cat /tmp/my-script-error.log
```

Any errors — including "command not found" — will appear there.

---

## Fix 5 — Load and Verify the plist

After creating or editing a plist in `~/Library/LaunchAgents/`, load it with:

```bash
launchctl load ~/Library/LaunchAgents/com.yourname.yourscript.plist
```

To check if it loaded successfully:
```bash
launchctl list | grep com.yourname.yourscript
```

The output shows three columns: PID, exit code, and label. An exit code of `0` means it ran successfully. Any other number indicates an error — check your log files.

To unload and reload after making changes:
```bash
launchctl unload ~/Library/LaunchAgents/com.yourname.yourscript.plist
launchctl load ~/Library/LaunchAgents/com.yourname.yourscript.plist
```

---

## Example plist With All Fixes Applied

```xml
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN"
  "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
    <key>Label</key>
    <string>com.yourname.yourscript</string>

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
    <string>/tmp/yourscript.log</string>
    <key>StandardErrorPath</key>
    <string>/tmp/yourscript-error.log</string>

    <key>RunAtLoad</key>
    <false/>
</dict>
</plist>
```

Replace `yourname` and `yourscript` with your actual username and script name.

---

> **Tip:** The free app **Lingon X** provides a GUI for creating and managing launchd plists, which can make initial setup easier before you understand the XML format.
