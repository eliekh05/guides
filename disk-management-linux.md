---
layout: default
title: "Disk Management on Linux"
parent: "System & Users"
nav_order: 21
---

# Disk Management on Linux

---

## Check Disk Space

```bash
df -h                           # disk usage of all mounted filesystems
df -h /                         # root filesystem only
du -sh /var/log                 # size of a specific directory
du -sh ~/*                      # size of each item in home folder
du -sh * | sort -rh | head -10  # top 10 largest items in current folder
ncdu /                          # interactive disk usage browser (install: apt install ncdu)
```

---

## List Disks and Partitions

```bash
lsblk                           # tree view of all block devices
lsblk -f                        # includes filesystem type and UUID
fdisk -l                        # detailed partition info (requires sudo)
sudo fdisk -l /dev/sda          # specific drive
parted -l                       # alternative to fdisk
```

---

## Mount and Unmount

```bash
# Mount a drive
sudo mount /dev/sdb1 /mnt

# Mount with filesystem type specified
sudo mount -t ext4 /dev/sdb1 /mnt
sudo mount -t ntfs /dev/sdb1 /mnt

# Unmount
sudo umount /mnt
sudo umount /dev/sdb1

# List all mounted filesystems
mount | column -t
```

---

## Auto-Mount at Boot (/etc/fstab)

Find the UUID of a partition:
```bash
blkid /dev/sdb1
```

Add to `/etc/fstab`:
```
UUID=your-uuid-here  /mnt/data  ext4  defaults  0  2
```

Test fstab without rebooting:
```bash
sudo mount -a
```

---

## Format a Drive

```bash
# Create ext4 filesystem
sudo mkfs.ext4 /dev/sdb1

# Create NTFS (for Windows compatibility)
sudo mkfs.ntfs /dev/sdb1

# Create FAT32
sudo mkfs.vfat -F 32 /dev/sdb1

# Create exFAT (cross-platform, large files)
sudo mkfs.exfat /dev/sdb1
```

> ⚠️ This permanently destroys all data on the partition.

---

## Partition a Drive with fdisk

```bash
sudo fdisk /dev/sdb
```

Inside fdisk:
- `p` — print current partition table
- `n` — new partition
- `d` — delete partition
- `t` — change partition type
- `w` — write changes and exit
- `q` — quit without saving

---

## Check and Repair Filesystem

```bash
# Run fsck on unmounted filesystem
sudo fsck /dev/sdb1

# Force check (even if marked clean)
sudo fsck -f /dev/sdb1

# Schedule check on next reboot (ext4)
sudo tune2fs -C 1 /dev/sda1
```

Never run fsck on a mounted filesystem.

---

## SMART Status (Disk Health)

```bash
sudo apt install smartmontools -y
sudo smartctl -a /dev/sda          # full SMART report
sudo smartctl -H /dev/sda          # health status only
sudo smartctl -t short /dev/sda    # run short self-test
```

---

## LVM (Logical Volume Manager)

```bash
pvs              # list physical volumes
vgs              # list volume groups
lvs              # list logical volumes

# Extend a logical volume
sudo lvextend -L+10G /dev/vg0/lv_home
sudo resize2fs /dev/vg0/lv_home     # resize ext4 to fill new space
```
