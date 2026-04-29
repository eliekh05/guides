---
layout: default
title: "Fix 'Operation Not Permitted' in Terminal (macOS)"
parent: "macOS & Linux"
nav_order: 8
---

# Fix "Operation Not Permitted" in Terminal (macOS)

Since macOS Catalina, Terminal commands that access certain files or folders produce this error even when run with `sudo`. The error looks like this:

```
operation not permitted
zsh: operation not permitted
ls: .: Operation not permitted
```

This is **not** a password problem or a permissions problem on the files themselves. It is macOS's privacy system blocking Terminal from accessing protected locations.

---

## Why This Happens

macOS Catalina (10.15) introduced a privacy restriction called **Full Disk Access**. Without it, Terminal — and any shell running inside it — cannot access:

- `~/Desktop`
- `~/Documents`
- `~/Downloads`
- Time Machine backups
- Mail data
- iCloud Drive contents
- Some system folders

This applies even if you are running `sudo` as root. The restriction is at the OS privacy layer, above file permissions entirely.

---

## Fix 1 — Grant Terminal Full Disk Access (Fixes Most Cases)

1. Open **System Settings** → **Privacy & Security** → **Full Disk Access**.
2. Click the **+** button.
3. Navigate to **Applications** → **Utilities** → select **Terminal**.
4. Click **Open**.
5. Make sure the toggle next to **Terminal** is **on**.
6. Quit Terminal completely and reopen it.

If you use a different terminal app (iTerm2, Warp, Ghostty, etc.), add that app instead of Terminal — or add both.

---

## Fix 2 — Grant Full Disk Access to the Shell Itself

If Fix 1 did not help, the shell binary itself may need access (this is needed when scripts run outside of Terminal.app, such as via SSH or cron):

1. Open **System Settings** → **Privacy & Security** → **Full Disk Access**.
2. Click **+**.
3. Press **Command (⌘) + Shift + G** to open the Go to Folder dialog.
4. Type `/bin/` and press **Enter**.
5. Select **zsh** (or **bash** if you use bash) and click **Open**.
6. Enable the toggle next to it.

---

## Fix 3 — Fix for Scripts That Run via SSH or Automation

If you are hitting this error when running scripts remotely via SSH or via launchd/cron (not inside Terminal.app), the parent process needs Full Disk Access — not just Terminal. Options:

- Add `/bin/zsh` or `/bin/bash` to Full Disk Access (Fix 2 above)
- Add your SSH client or the app triggering the script
- For launchd scripts, wrap the script in an Automator app and give the Automator app Full Disk Access

---

## Fix 4 — Unlock a Specific Locked File

If the error is about a specific file rather than a folder, it may be locked:

```bash
chflags nouchg /path/to/file
```

Then try your command again. To unlock an entire folder recursively:

```bash
chflags -R nouchg /path/to/folder
```

---

## Fix 5 — Reset User Permissions (For Persistent Permission Errors)

If you are getting permission denied errors across many files and folders and the above fixes did not help, your user's home directory permissions may be broken:

```bash
sudo diskutil resetUserPermissions / $(id -u)
```

If this returns **Error -69841**, first run:

```bash
chflags -R nouchg ~
sudo diskutil resetUserPermissions / $(id -u)
```

Restart your Mac after this completes.

---

## Fix 6 — Temporarily Disable SIP (Last Resort)

If you need to access truly protected system paths (not just user data), you can temporarily disable SIP. See the **Disable and Enable SIP** guide for full instructions.

After doing what you need, re-enable SIP immediately.

> **Only do this if you understand what you are accessing and why.** SIP protects your system — disabling it for casual use is not recommended.

---

## Quick Reference

| Symptom | Fix |
|---|---|
| `operation not permitted` in Desktop/Documents/Downloads | Fix 1 — give Terminal Full Disk Access |
| Error in script running via SSH or cron | Fix 2 — give `/bin/zsh` Full Disk Access |
| Specific file locked | Fix 4 — `chflags nouchg` |
| Errors across many files after a migration or restore | Fix 5 — `diskutil resetUserPermissions` |
| Protected system path (`/System`, `/usr`) | Fix 6 — disable SIP temporarily |

---

> **Note:** After granting Full Disk Access to Terminal, you may need to restart Terminal for the changes to take effect. If the error persists, log out and back into your macOS user account.
