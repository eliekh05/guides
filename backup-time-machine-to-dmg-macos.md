---
layout: default
title: "Back Up Using Time Machine to a DMG File (macOS)"
parent: "System & Users"
nav_order: 5
---

# Back Up Using Time Machine to a DMG File (macOS)

By default, Time Machine backs up to a physical external drive. But you can also point Time Machine at a **DMG disk image file** — useful if you want to store your backup on a network share, inside a folder on a larger drive, or keep it as a portable file you can move around.

---

## Step 1 — Create a Blank DMG in Disk Utility

1. Open **Disk Utility** (Applications → Utilities → Disk Utility).
2. In the menu bar, go to **File** → **New Image** → **Blank Image**.
3. Configure the image:
   - **Save As:** give it a name like `TimeMachineBackup`
   - **Where:** choose where to save it (external drive, NAS mount, or local folder)
   - **Size:** set it larger than the data you want to back up — at least 1.5× your Mac's used storage
   - **Format:** `Mac OS Extended (Journaled)`
   - **Encryption:** optional but recommended for sensitive data
   - **Image Format:** `sparse bundle disk image` (this grows dynamically as backup data fills it)
4. Click **Save**. Disk Utility will create and mount the DMG automatically.

---

## Step 2 — Find the Volume Name

Once the DMG is mounted, it will appear as a drive in Disk Utility and on your Desktop. Note the volume name — you will need it in the next step. It will be something like `TimeMachineBackup` or whatever you named it.

You can also check it from Terminal:

```bash
ls /Volumes/
```

Your mounted DMG will appear in the list.

---

## Step 3 — Set the DMG as the Time Machine Destination

Open **Terminal** and run:

```bash
sudo tmutil setdestination /Volumes/TimeMachineBackup
```

Replace `TimeMachineBackup` with the actual name of your mounted DMG volume from Step 2.

Enter your password when prompted.

---

## Step 4 — Start the Backup

1. Open **System Settings** → **General** → **Time Machine** (or **System Preferences** → **Time Machine** on older macOS).
2. Your DMG should now appear as the selected backup disk.
3. Click **Back Up Now** to start the first backup, or let it run automatically.

---

## Important Notes

### You must mount the DMG before each backup
Time Machine cannot back up to the DMG if it is not mounted. Before each backup session, double-click the DMG file to mount it, then let Time Machine run.

To automate this, you can create a Login Item or a launchd plist that mounts the DMG on startup — see the **Fix launchd / plist Scripts Not Running** guide for how to schedule tasks automatically.

### Sparse bundle vs sparse image
Use **sparse bundle** (not sparse image or read/write image) — it stores the backup in small band files, which makes the overall file more resilient to corruption and easier to copy incrementally over a network.

### Encrypted DMG
If you enabled encryption when creating the DMG, you will need to enter the DMG password each time you mount it before Time Machine can back up to it.

---

## Troubleshooting

### "Time Machine could not complete the backup"
The DMG is probably not mounted. Mount it by double-clicking the `.sparsebundle` file, then try the backup again.

### Time Machine destination missing after restart
The DMG is not set to auto-mount on login. Add it to your Login Items: **System Settings** → **General** → **Login Items** → click **+** and add the DMG file.

### The DMG is full
Open Disk Utility, select the mounted DMG, and use **Images** → **Resize** to increase its size. Sparse bundles expand dynamically up to their maximum size — you can increase the maximum if needed.
