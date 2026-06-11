---
layout: default
title: "Disk Utility Advanced — APFS, Fusion, RAID"
parent: "macOS"
nav_order: 37
---

# Disk Utility Advanced — APFS, RAID, and Repair

Beyond the basics, Disk Utility manages complex storage setups.

---

## APFS vs HFS+ — Which Format to Use

| Format | Use for |
|---|---|
| **APFS** | All internal SSDs (default, fast snapshots, space sharing) |
| **APFS (Encrypted)** | Internal SSD with encryption (same as FileVault) |
| **APFS (Case-sensitive)** | Developer tools that require case sensitivity |
| **Mac OS Extended (HFS+)** | External HDDs shared with older Macs |
| **ExFAT** | External drives shared with Windows |
| **MS-DOS (FAT32)** | USB sticks for maximum compatibility, 4GB file size limit |

---

## APFS Volumes — Multiple Volumes Sharing Space

APFS lets multiple volumes share the same space pool. Unlike partitions, if one volume needs more space it automatically takes it from the pool.

**Create a new APFS volume:**

1. Select the APFS container in Disk Utility
2. **Edit → Add APFS Volume**
3. Name it and choose format
4. Set optional size limits (not required — volumes share by default)

**Use case:** Separate volumes for macOS, Data, and a scratch disk — all sharing one physical SSD without wasting space.

---

## APFS Snapshots

Time Machine and software updates use APFS snapshots:

```bash
# List snapshots
tmutil listlocalsnapshots /

# Mount a snapshot to browse it
tmutil localsnapshots /

# Delete a specific snapshot
tmutil deletelocalsnapshots 2025-01-15-120000
```

---

## First Aid

Run First Aid on any drive to check and repair filesystem errors:

1. Disk Utility → select the volume or container
2. Click **First Aid → Run**

For a disk that cannot be unmounted (like the startup drive), boot into Recovery Mode (Cmd+R on Intel, hold power on Apple Silicon) and run First Aid from there.

---

## Create a RAM Disk (Fast Temp Storage)

```bash
diskutil erasevolume HFS+ "RamDisk" $(hdiutil attach -nomount ram://2097152)
# Creates a 1GB RAM disk mounted at /Volumes/RamDisk
```

Everything on it is gone when you unmount or restart. Use for build caches and temp files that do not need to be fast on disk.

---

## RAID (Software RAID)

Disk Utility can create software RAID sets:

**View → Show All Devices** first to see all disks.

- **RAID 0 (Striped)** — speed, no redundancy (data lost if one disk fails)
- **RAID 1 (Mirrored)** — redundancy, keeps working if one disk dies
- **JBOD (Concatenated)** — multiple disks appear as one, no redundancy

1. Select the first disk in the RAID set
2. **File → RAID Assistant**
3. Follow the wizard

---

## diskutil Commands

```bash
diskutil list              # list all disks and partitions
diskutil info /dev/disk0   # detailed info
diskutil eraseDisk APFS "MyDisk" /dev/disk2  # format a disk
diskutil unmountDisk /dev/disk2              # unmount
diskutil eject /dev/disk2                    # eject
```
