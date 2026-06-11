---
layout: default
title: "Recover Deleted Files on macOS"
parent: "System & Users"
nav_order: 10
---

# Recover Deleted Files on macOS

---

## Option 1 — Check the Trash First

Open the **Trash** in your Dock. If the file is there, right-click it → **Put Back**.

---

## Option 2 — Restore from Time Machine

If Time Machine is set up, this is the most reliable recovery method.

1. Navigate in Finder to the **folder** where the file was.
2. Click the **Time Machine** icon in the menu bar → **Enter Time Machine**.
3. Use the timeline on the right to go back to before the deletion.
4. Select the file → click **Restore**.

If Time Machine is not running, see the **Fix Time Machine Backup Failing** guide to get it set up.

---

## Option 3 — Recover from a Local Snapshot (No External Drive Needed)

macOS takes local Time Machine snapshots even without an external backup drive. These are stored on your Mac itself.

Check if snapshots exist:
```bash
tmutil listlocalsnapshots /
```

If you see entries like `com.apple.TimeMachine.2025-05-04-120000`, mount one:

```bash
# Mount a snapshot (replace the date with one from the list above)
tmutil localsnapshot /Volumes/com.apple.TimeMachine.2025-05-04-120000
```

Or use **Enter Time Machine** from the menu bar — it will show local snapshots even without an external drive connected.

---

## Option 4 — Check iCloud Drive

If the file was in your Desktop or Documents folder and iCloud Drive sync is on, check [icloud.com](https://icloud.com) → **iCloud Drive**. iCloud keeps recently deleted files for 30 days.

Also check: **iCloud.com** → your account icon → **Recently Deleted**.

---

## Option 5 — Check the `.Trash` Folder Directly

Sometimes files appear deleted but are still in a hidden Trash folder:

```bash
ls -la ~/.Trash/
```

If the file is there, move it back:
```bash
mv ~/.Trash/yourfile.txt ~/Desktop/
```

For external drives, Trash is stored at:
```bash
ls /Volumes/DRIVENAME/.Trashes/
```

---

## Option 6 — TestDisk (Free, No Install Required via Homebrew)

If none of the above work and the file was recently deleted, TestDisk can scan the disk for recoverable data:

```bash
brew install testdisk
sudo testdisk
```

Select your drive → **Analyse** → **Advanced** → **Undelete**. This works best the sooner you run it after deletion — the longer you wait and use the drive, the lower the chance of recovery.

---

## What Does NOT Work

- **`rm` from Terminal** bypasses Trash entirely — files deleted with `rm` are much harder to recover
- SSD TRIM means deleted files on SSDs are erased quickly — recovery window is shorter than on HDDs
- If the drive has been heavily used since deletion, most recovery options will not find the file

---

> **Prevention:** Time Machine is the only reliable safety net. Set it up with any external drive — even a cheap USB drive works.
