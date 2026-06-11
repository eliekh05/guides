---
layout: default
title: "Fix Time Machine Backup Failing or Not Running"
parent: "System & Users"
nav_order: 9
---

# Fix Time Machine Backup Failing or Not Running

---

## Fix 1 — Reset Time Machine connection to the drive

The most common fix. Time Machine loses track of the backup destination after macOS updates.

1. Open **System Settings** → **General** → **Time Machine**.
2. Click your backup disk → **Remove Backup Disk**.
3. Click **Add Backup Disk** and re-select the same drive.
4. Click **Back Up Now**.

---

## Fix 2 — Force a backup from Terminal

```bash
tmutil startbackup
```

Watch it run:
```bash
tmutil status
```

---

## Fix 3 — Clear the Time Machine lock file

If Time Machine says "Backup in progress" but nothing is happening, a stale lock file is the cause:

```bash
sudo rm -rf /Volumes/YOUR_BACKUP_DRIVE/Backups.backupdb/.inProgress
```

Replace `YOUR_BACKUP_DRIVE` with your actual backup drive name. Then try again.

---

## Fix 4 — Delete the corrupted snapshot and start fresh

If backups keep failing mid-way:

```bash
# List local snapshots
tmutil listlocalsnapshots /

# Delete a specific failing snapshot (replace date)
tmutil deletelocalsnapshots 2025-05-01

# Or delete ALL local snapshots
tmutil deletelocalsnapshots /
```

---

## Fix 5 — Repair the backup disk

1. Open **Disk Utility** (Applications → Utilities → Disk Utility).
2. Select your **Time Machine backup drive** from the left panel.
3. Click **First Aid** → **Run**.
4. After it completes, try the backup again.

---

## Fix 6 — Check available space

Time Machine needs free space on both your Mac and the backup drive.

```bash
df -h
```

If the backup drive is full, Time Machine should automatically delete old backups — but if that mechanism is broken:

```bash
# List all backups
tmutil listbackups

# Delete the oldest backup manually (replace path with actual path from listbackups)
sudo tmutil delete /Volumes/BackupDrive/Backups.backupdb/MyMac/2024-01-01-120000
```

---

## Fix 7 — Reset Time Machine completely (last resort)

Keeps your existing backups but resets all settings:

```bash
sudo defaults delete /Library/Preferences/com.apple.TimeMachine.plist
```

Restart your Mac, then re-add your backup disk.

---

## Common error messages

| Error | Fix |
|---|---|
| "Backup disk not available" | Fix 1 — re-add the disk |
| "Backup in progress" stuck | Fix 3 — delete lock file |
| "Not enough space" | Fix 6 — delete old backups |
| Backup completes but files missing | Fix 5 — run First Aid on backup drive |
| Backup fails every time at same % | Fix 4 — delete corrupted snapshot |
