---
layout: default
title: "Time Machine — Complete Setup and Restore Guide"
parent: "macOS"
nav_order: 21
---

# Time Machine — Complete Setup and Restore Guide

---

## Set Up Time Machine

1. Connect an external drive (USB, Thunderbolt, or NAS).
2. **System Settings → General → Time Machine**.
3. Click **Add Backup Disk**.
4. Select your external drive.
5. Optionally enable **Encrypt Backup** — recommended.
6. Click **Done**.

Time Machine starts the first backup automatically (usually within a few minutes). The first backup takes a long time — subsequent ones are fast because only changed files are backed up.

---

## What Gets Backed Up

Time Machine backs up everything by default including apps, settings, documents, photos, and system files.

**Exclude folders you do not need backed up:**
1. System Settings → Time Machine → **Options**.
2. Click **+** and add folders to exclude — good candidates:
   - Downloads (if you re-download things)
   - Virtual machine disk files (very large)
   - `node_modules/`, `.venv/`, `.gradle/` — they rebuild from config files

---

## Backup Schedule

Time Machine backs up:
- Every hour for the past 24 hours
- Once a day for the past month
- Once a week for all previous months

It automatically deletes the oldest backups when the drive fills up.

---

## Restore Individual Files

1. Open the folder in Finder that contained the file.
2. Click the **Time Machine** icon in the menu bar → **Enter Time Machine**.
3. Use the timeline on the right to go back in time.
4. Navigate to the file → click **Restore**.

The file is restored to its original location. If the original location still has a file with the same name, you are asked whether to keep both.

---

## Restore Your Entire Mac

For a full system restore after a hardware failure, new Mac, or after erasing:

1. Start your Mac in **Recovery Mode**:
   - **Intel Mac:** hold **Cmd + R** during startup
   - **Apple Silicon:** hold **power button** until startup options appear → **Options**
2. Select **Restore From Time Machine**.
3. Select your Time Machine backup drive.
4. Choose the backup to restore from (usually the latest).
5. Select your destination disk.
6. Click **Restore** and wait — this takes 30 minutes to several hours depending on how much data you have.

---

## Restore to a New Mac (Migration Assistant)

When setting up a new Mac, you can restore from Time Machine during the initial setup:

1. During macOS Setup Assistant, when asked **How do you want to transfer your information**, select **From a Mac, Time Machine backup, or Startup disk**.
2. Connect your Time Machine drive.
3. Select the backup.
4. Choose what to transfer (everything, or specific categories).

You can also run Migration Assistant later: **Applications → Utilities → Migration Assistant**.

---

## Check Backup Status

```bash
# Check when last backup happened
tmutil latestbackup

# List all backups
tmutil listbackups

# Show backup destination
tmutil destinationinfo
```

---

## Force a Backup Now

```bash
tmutil startbackup
```

Or from the menu bar: click Time Machine icon → **Back Up Now**.

---

## Backup Verification

Occasionally verify your backup is healthy:

```bash
sudo tmutil verifychecksums /Volumes/YOUR_BACKUP_DRIVE
```

Also open Disk Utility → select your Time Machine drive → **First Aid** → **Run** to check the drive itself.
