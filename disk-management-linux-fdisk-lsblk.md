---
layout: default
title: "Disk Management on Linux (lsblk, fdisk, mkfs, mount)"
parent: "System & Users"
nav_order: 20
---

# Disk Management on Linux (lsblk, fdisk, mkfs, mount)

---

## See All Disks and Partitions

```bash
lsblk                          # tree view of all block devices
lsblk -f                       # include filesystem type and UUID
lsblk -o NAME,SIZE,TYPE,FSTYPE,MOUNTPOINT

fdisk -l                       # detailed partition table (needs sudo)
sudo fdisk -l /dev/sda         # specific disk

df -h                          # mounted filesystems and usage
du -sh /path/to/folder         # size of a specific folder
```

---

## Partition a Disk

> ⚠️ **Partitioning erases data.** Triple-check you have the right disk with `lsblk` before proceeding.

```bash
sudo fdisk /dev/sdb            # interactive partition editor
```

Inside fdisk:
- `p` — print current partition table
- `n` — new partition
- `d` — delete partition
- `t` — change partition type (82=Linux swap, 83=Linux, 8e=LVM)
- `w` — write changes and exit
- `q` — quit without saving

**For GPT disks (recommended for disks over 2 TB or UEFI systems), use gdisk or parted:**
```bash
sudo parted /dev/sdb
```

---

## Format a Partition

```bash
# ext4 (standard Linux filesystem)
sudo mkfs.ext4 /dev/sdb1

# With a label
sudo mkfs.ext4 -L "MyDisk" /dev/sdb1

# XFS (better for large files and databases)
sudo mkfs.xfs /dev/sdb1

# FAT32 (compatible with Windows/macOS)
sudo mkfs.vfat -F 32 /dev/sdb1

# exFAT (better for large files than FAT32)
sudo mkfs.exfat /dev/sdb1
```

---

## Mount a Partition

```bash
# Create a mount point
sudo mkdir -p /mnt/data

# Mount
sudo mount /dev/sdb1 /mnt/data

# Mount with specific filesystem type
sudo mount -t ext4 /dev/sdb1 /mnt/data

# Unmount
sudo umount /mnt/data

# Show all mounts
mount | grep /dev/sdb
```

---

## Auto-Mount at Boot (/etc/fstab)

Find the UUID first (safer than using /dev/sdb1 which can change):
```bash
lsblk -f | grep sdb1
# or
sudo blkid /dev/sdb1
```

Edit fstab:
```bash
sudo nano /etc/fstab
```

Add a line:
```
UUID=abc123-def456  /mnt/data  ext4  defaults  0  2
```

Format: `device  mountpoint  filesystem  options  dump  pass`

Test before rebooting:
```bash
sudo mount -a      # mounts everything in fstab
sudo systemctl daemon-reload
```

---

## Resize a Partition

**Extend an ext4 filesystem after enlarging the partition:**
```bash
sudo resize2fs /dev/sdb1
```

**Check filesystem before resize:**
```bash
sudo e2fsck -f /dev/sdb1
```

**Extend an XFS filesystem:**
```bash
sudo xfs_growfs /mnt/data
```

---

## LVM — Logical Volume Manager

LVM lets you resize volumes without repartitioning.

```bash
# Show LVM volumes
sudo pvs                     # physical volumes
sudo vgs                     # volume groups
sudo lvs                     # logical volumes

# Extend a logical volume by 10G
sudo lvextend -L +10G /dev/vg0/lv-data
sudo resize2fs /dev/vg0/lv-data    # resize filesystem after extending
```

---

## Check and Repair Filesystem

```bash
# Must unmount first (or use recovery mode for root)
sudo umount /dev/sdb1
sudo e2fsck -f /dev/sdb1       # check and repair ext4

# Force check on next reboot (for root filesystem)
sudo touch /forcefsck
```

---

## SMART Disk Health

```bash
sudo apt install smartmontools -y

# Quick check
sudo smartctl -H /dev/sda

# Full info
sudo smartctl -a /dev/sda

# Long self-test
sudo smartctl -t long /dev/sda
```
