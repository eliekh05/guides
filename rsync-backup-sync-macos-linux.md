---
layout: default
title: "Backup and Sync Files with rsync (macOS and Linux)"
parent: "macOS & Linux"
nav_order: 23
---

# Backup and Sync Files with rsync (macOS and Linux)

`rsync` is the best tool for backing up and syncing files on macOS and Linux. It only copies files that have changed (not everything every time), preserves permissions and timestamps, works over SSH to remote servers, and can exclude folders you do not want.

---

## Basic Syntax

```bash
rsync [options] source/ destination/
```

> **The trailing slash matters.** `source/` means "copy the contents of source". `source` (no slash) means "copy the folder itself into destination".

---

## Essential Flags

| Flag | What it does |
|---|---|
| `-a` | Archive mode — preserves permissions, timestamps, symlinks, owner, group |
| `-v` | Verbose — shows each file being copied |
| `-z` | Compress data during transfer (useful over slow networks) |
| `-P` | Show progress per file + keep partially transferred files |
| `--delete` | Delete files in destination that no longer exist in source |
| `--dry-run` | Preview what would happen without actually copying anything |
| `--exclude` | Skip specific files or folders |

---

## Common Use Cases

### Copy a folder to a backup drive

```bash
rsync -av ~/Documents/ /Volumes/BackupDrive/Documents/
```

### Preview before running (dry run)

Always do this first for destructive operations:

```bash
rsync -av --dry-run ~/Documents/ /Volumes/BackupDrive/Documents/
```

### Mirror a folder (delete files removed from source)

```bash
rsync -av --delete ~/Documents/ /Volumes/BackupDrive/Documents/
```

> **Warning:** `--delete` removes files from the destination that are no longer in the source. If you accidentally deleted something from the source, it will also be deleted from the backup. Use with care.

### Copy to a remote server over SSH

```bash
rsync -avz ~/Documents/ user@server.com:/home/user/backup/
```

### Copy from a remote server to local

```bash
rsync -avz user@server.com:/home/user/files/ ~/Downloads/from-server/
```

### Show progress for large files

```bash
rsync -av --progress ~/Documents/ /Volumes/BackupDrive/Documents/
```

### Exclude specific folders

```bash
rsync -av --exclude='node_modules' --exclude='.git' ~/Projects/ /Volumes/BackupDrive/Projects/
```

### Exclude using a file

Create `~/.rsync-exclude`:
```
node_modules/
.git/
*.log
.DS_Store
__pycache__/
.venv/
```

Then:
```bash
rsync -av --exclude-from='~/.rsync-exclude' ~/Projects/ /Volumes/BackupDrive/Projects/
```

---

## Scheduled Backups with cron

Back up Documents every night at 2 AM:

```bash
crontab -e
```

Add:
```
0 2 * * * rsync -a --delete ~/Documents/ /Volumes/BackupDrive/Documents/ >> ~/rsync-backup.log 2>&1
```

> **macOS note:** The drive must be mounted and your Mac must be awake at 2 AM. If you cannot guarantee this, use a launchd plist instead — see the **Fix launchd / plist Scripts Not Running** guide.

---

## Scheduled Backups with launchd (macOS — More Reliable)

Create `~/Library/LaunchAgents/com.backup.daily.plist`:

```xml
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
    <key>Label</key>
    <string>com.backup.daily</string>
    <key>ProgramArguments</key>
    <array>
        <string>/usr/bin/rsync</string>
        <string>-a</string>
        <string>--delete</string>
        <string>/Users/YOURUSERNAME/Documents/</string>
        <string>/Volumes/BackupDrive/Documents/</string>
    </array>
    <key>StartCalendarInterval</key>
    <dict>
        <key>Hour</key>
        <integer>2</integer>
        <key>Minute</key>
        <integer>0</integer>
    </dict>
    <key>StandardOutPath</key>
    <string>/tmp/rsync-backup.log</string>
    <key>StandardErrorPath</key>
    <string>/tmp/rsync-backup-error.log</string>
</dict>
</plist>
```

Replace `YOURUSERNAME` with your actual username. Load it:

```bash
launchctl load ~/Library/LaunchAgents/com.backup.daily.plist
```

---

## Useful One-Liners

```bash
# Check what has changed between source and destination (without copying)
rsync -av --dry-run --itemize-changes ~/Documents/ /Volumes/Backup/Documents/

# Copy only files modified in the last 7 days
rsync -av --update ~/Documents/ /Volumes/Backup/Documents/

# Copy and limit bandwidth to 1 MB/s (useful for background backups)
rsync -av --bwlimit=1000 ~/Documents/ /Volumes/Backup/Documents/

# Resume an interrupted transfer
rsync -avP ~/LargeFiles/ /Volumes/Backup/LargeFiles/
```

---

## Understanding the Output

When using `--itemize-changes`, rsync shows a code before each file:

```
>f+++++++++ newfile.txt        # New file being sent
>f.s....... changedfile.txt    # File size changed
.f..t...... touchedfile.txt    # Timestamp changed only
*deleting   oldfile.txt        # File deleted (with --delete)
```

---

## Troubleshooting

### rsync: command not found (macOS)

macOS includes rsync but it may be an old version. Install the current one:

```bash
brew install rsync
```

### Permission denied errors

Add `sudo` if copying system files, or fix ownership of the destination:

```bash
sudo chown -R $(whoami) /path/to/destination/
```

### Transfer is slow over SSH

Add `-z` for compression:
```bash
rsync -avz user@server:/path/ ~/local/
```

Or specify a faster SSH cipher:
```bash
rsync -avz -e "ssh -c aes128-gcm@openssh.com" user@server:/path/ ~/local/
```