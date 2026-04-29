---
layout: default
title: "Clone a Drive Using Disk Utility (macOS)"
parent: "System & Users"
nav_order: 4
---

# Clone a Drive Using Disk Utility (macOS)

Disk Utility's Restore feature lets you clone one drive to another — copying everything exactly, sector by sector. This is useful for migrating to a new drive, creating a full backup, or duplicating a setup to another machine.

---

## What You Need

- The **source drive** (the one you want to clone from)
- The **destination drive** (the one you want to clone to — all data on it will be erased)
- Both drives connected to your Mac at the same time

---

## Step 1 — Format the Destination Drive

The destination drive must be erased and formatted before cloning.

1. Open **Disk Utility** (Applications → Utilities → Disk Utility, or search with Spotlight).
2. Select the **destination drive** from the left panel — make sure you select the drive itself, not a volume under it.
3. Click **Erase** at the top of the window.
4. Set the **Format** to **Mac OS Extended (Journaled)**.
5. Click **Erase** and wait for it to finish. The drive will remount automatically.

---

## Step 2 — Restore (Clone) the Source to Destination

1. In Disk Utility, select the **destination drive** in the left panel (the one you just erased).
2. Click **Restore** at the top of the window.
3. In the **Restore** dialog:
   - **Source:** drag and drop the **source drive** (the one you are cloning from) from the left panel into the Source field.
   - **Destination:** the destination drive should already be filled in since you selected it before clicking Restore.
4. Click **Restore** and enter your password when prompted.
5. Wait for the process to complete — this can take anywhere from a few minutes to several hours depending on how much data is on the source drive.

> **Warning:** The destination drive will be completely overwritten. All existing data on it will be lost.

---

## Step 3 — Shrink the Image to Minimum Size (Optional)

If you cloned to a DMG image file instead of a physical drive, you can compact it to remove unused space:

```bash
hdiutil resize -sectors min /path/to/yourimage.dmg
```

Replace `/path/to/yourimage.dmg` with the actual path to your image file.

---

## Troubleshooting

### The Restore button is greyed out
Make sure you selected the **destination drive** in the left panel before clicking Restore, not the source.

### Source or destination not showing in Disk Utility
Go to **View** → **Show All Devices** to make sure all connected drives are visible.

### Clone fails partway through
The source drive may have errors. Run **First Aid** on the source drive first: select it in Disk Utility → click **First Aid** → **Run**.

### Destination drive not recognised after cloning
Eject and reconnect it. If it still does not appear, try the Restore process again.

---

> **Note:** For cloning a startup drive (the drive macOS is currently running from), you need to boot from an external drive or macOS Recovery first, then run Disk Utility from there. Disk Utility cannot clone a drive that is actively in use as the boot volume.
