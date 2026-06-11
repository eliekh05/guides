---
layout: default
title: "Run a Script at Startup or Login on macOS"
parent: "Task Scheduling"
nav_order: 5
---

# Run a Script at Startup or Login on macOS

There are three ways to run something automatically on macOS. Each one runs at a different time and in a different context — picking the wrong one is why scripts that work in Terminal silently fail when automated.

---

## Which Method to Use

| Method | When it runs | Runs as | Best for |
|---|---|---|---|
| **Login Items** | After you log in, as your user | Your user | Opening apps, simple scripts |
| **launchd User Agent** | After you log in, as your user | Your user | Scripts, scheduled tasks, persistent daemons |
| **launchd System Daemon** | At boot, before login | root | System-level tasks, server processes |

---

## Method 1 — Login Items (Easiest, Apps Only)

Best for launching apps or simple scripts at login. No Terminal required.

1. **System Settings** → **General** → **Login Items & Extensions**.
2. Under **Open at Login**, click **+**.
3. Select your app or script.

For scripts, wrap them in an `.app` first — see the **Create a .app Shortcut on macOS** guide.

---

## Method 2 — launchd User Agent (Recommended for Scripts)

LaunchAgents run after you log in, as your own user. They can run on a schedule or be triggered by events.

### Create the plist file

Create a file at `~/Library/LaunchAgents/com.yourname.scriptname.plist`:

```xml
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN"
  "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
    <key>Label</key>
    <string>com.yourname.scriptname</string>

    <key>ProgramArguments</key>
    <array>
        <string>/bin/zsh</string>
        <string>/Users/yourname/scripts/myscript.zsh</string>
    </array>

    <!-- Run once at login -->
    <key>RunAtLoad</key>
    <true/>

    <!-- Optional: also run on a schedule (9 AM daily) -->
    <key>StartCalendarInterval</key>
    <dict>
        <key>Hour</key>
        <integer>9</integer>
        <key>Minute</key>
        <integer>0</integer>
    </dict>

    <!-- Log output for debugging -->
    <key>StandardOutPath</key>
    <string>/tmp/myscript.log</string>
    <key>StandardErrorPath</key>
    <string>/tmp/myscript-error.log</string>

    <key>EnvironmentVariables</key>
    <dict>
        <key>PATH</key>
        <string>/opt/homebrew/bin:/usr/local/bin:/usr/bin:/bin:/usr/sbin:/sbin</string>
    </dict>
</dict>
</plist>
```

Replace `yourname` and `scriptname` with your own values. Replace the script path with your actual script path.

### Load it

```bash
launchctl load ~/Library/LaunchAgents/com.yourname.scriptname.plist
```

### Verify it loaded

```bash
launchctl list | grep com.yourname.scriptname
```

The three columns are: PID, exit code, label. Exit code `0` = ran successfully.

### Unload it

```bash
launchctl unload ~/Library/LaunchAgents/com.yourname.scriptname.plist
```

### Reload after changes

```bash
launchctl unload ~/Library/LaunchAgents/com.yourname.scriptname.plist
launchctl load ~/Library/LaunchAgents/com.yourname.scriptname.plist
```

---

## Method 3 — launchd System Daemon (Boot-time, Runs as Root)

System Daemons run at boot before any user logs in. Use this only when you need something to run system-wide or before login.

Place the plist in `/Library/LaunchDaemons/` (not your home folder). The plist format is identical to Method 2 except:
- Add `<key>UserName</key><string>youruser</string>` if you want it to run as a specific user rather than root
- Load it with: `sudo launchctl load /Library/LaunchDaemons/com.yourname.daemon.plist`

---

## Common Issues

### Script works in Terminal but not in launchd

launchd does not load your shell profile, so commands like `brew`, `python3`, `node` are not found.

Fix: use full paths in your script and set PATH in the plist `EnvironmentVariables` key (as shown above).

### Script needs Full Disk Access

Since macOS Catalina, scripts that access Desktop, Documents, Downloads, or iCloud via launchd need Full Disk Access granted to `/bin/zsh`:

**System Settings → Privacy & Security → Full Disk Access → + → /bin/zsh**

### Check what went wrong

```bash
cat /tmp/myscript-error.log
```

---

## Remove a Login Item or Agent

**Login Items (Method 1):**
System Settings → General → Login Items → select it → click **−**

**launchd Agent (Method 2):**
```bash
launchctl unload ~/Library/LaunchAgents/com.yourname.scriptname.plist
rm ~/Library/LaunchAgents/com.yourname.scriptname.plist
```
