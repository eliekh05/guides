---
layout: default
title: "Force Delete Files That Won't Delete on macOS"
parent: "System & Users"
nav_order: 6
---

# Force Delete Files That Won't Delete on macOS

"The item can't be moved to the Trash because it can't be deleted." — macOS shows this for several different reasons and each one has a different fix. This guide covers all of them in order from most to least common.

---

## Fix 1 — Force Empty Trash

If files are stuck in the Trash:

1. Hold **Option (⌥)** and click the Trash icon in the Dock.
2. Or hold **Option** while clicking **Finder** → **Empty Trash** in the menu bar.

The Option key tells macOS to skip the "file is in use" check and delete regardless.

---

## Fix 2 — File Is In Use — Find and Quit the App Using It

macOS will not delete a file that is open in any app.

**Find what is using the file:**
1. Open **Activity Monitor** (Applications → Utilities → Activity Monitor).
2. Go to **File** → **Open Files and Ports** or use the search bar to search for the filename.
3. Quit the process that has the file open.

Or use Terminal to find and kill the process:
```bash
lsof /path/to/file
```

This shows which process has the file open. Note the PID (process ID) and kill it:
```bash
kill -9 PID_NUMBER
```

Then delete the file normally.

---

## Fix 3 — Delete via Terminal

Finder sometimes refuses to delete files that Terminal can remove without issue:

```bash
rm /path/to/file
```

For a folder and everything inside it:
```bash
rm -rf /path/to/folder
```

> **Warning:** `rm -rf` deletes permanently with no Trash. Double-check the path before running.

**Tip:** Instead of typing the path, drag the file from Finder directly into the Terminal window to auto-fill the correct path.

---

## Fix 4 — File Is Locked — Remove the Lock Flag

macOS has a "locked" flag that prevents deletion. To remove it:

```bash
chflags nouchg /path/to/file
```

For a folder recursively:
```bash
chflags -R nouchg /path/to/folder
```

Then try deleting again. You can also unlock files in Finder: right-click the file → **Get Info** → uncheck **Locked**.

---

## Fix 5 — Wrong Permissions — Take Ownership

If the file is owned by another user or by root, you may not have permission to delete it:

```bash
sudo chown $(whoami) /path/to/file
sudo rm /path/to/file
```

For a folder:
```bash
sudo chown -R $(whoami) /path/to/folder
sudo rm -rf /path/to/folder
```

---

## Fix 6 — File Name Has Special Characters

Files with invisible characters, spaces, or special symbols in their name can be impossible to delete by name. Use the inode number instead:

```bash
# Get the inode number
ls -i /path/to/problematic/folder/

# Delete by inode (replace 12345 with actual inode number)
find /path/to/folder -inum 12345 -delete
```

---

## Fix 7 — File Is in Use by macOS Itself

Some files are held open by macOS system processes. Restart your Mac and try deleting immediately on next login before opening any apps.

If that does not work, boot into **Safe Mode** (hold Shift at startup on Intel, or hold power until you see options on Apple Silicon) and delete from there — Safe Mode disables most background processes.

---

## Fix 8 — Protected by SIP (System Files)

Files inside `/System`, `/usr/bin`, `/sbin`, and other system paths are protected by SIP (System Integrity Protection). You cannot delete them even with `sudo`.

You should almost never need to delete system files. If you genuinely need to:
1. Boot into Recovery Mode and disable SIP (see the **Disable and Enable SIP** guide).
2. Delete the file.
3. Re-enable SIP immediately.

---

## Fix 9 — External Drive File Permissions Issue

Files copied from NTFS drives, network shares, or external drives sometimes have permissions that prevent deletion on APFS:

```bash
sudo rm -rf /path/to/file
```

If the external drive is NTFS, macOS mounts it read-only by default. You may need to install **Paragon NTFS** or **Tuxera NTFS** for write access, or delete the file on a Windows machine.

---

## Quick Reference

| Error / Situation | Fix |
|---|---|
| File stuck in Trash | Fix 1 — Option + Empty Trash |
| "File is in use" | Fix 2 — find and quit the app |
| Finder refuses, no error | Fix 3 — delete via Terminal |
| File shows lock icon | Fix 4 — `chflags nouchg` |
| "Permission denied" | Fix 5 — `sudo chown` then `sudo rm` |
| Weird filename / won't type | Fix 6 — delete by inode |
| System file | Fix 8 — disable SIP temporarily |
