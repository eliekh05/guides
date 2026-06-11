---
layout: default
title: "Extend and Resize LVM Volumes on Linux"
parent: "System & Users"
nav_order: 30
---

# Extend and Resize LVM Volumes on Linux

LVM (Logical Volume Manager) lets you resize volumes without repartitioning physical disks. This guide covers the most common task: extending a logical volume after adding disk space.

---

## Check Current LVM Layout

```bash
pvs        # physical volumes
vgs        # volume groups
lvs        # logical volumes
lsblk      # all block devices
df -h      # filesystem usage
```

---

## Extend a VM/Cloud Disk Partition First

If you expanded a virtual disk (in Proxmox, AWS, etc.), the partition size has not changed yet:

```bash
# Find your device
lsblk

# Resize the partition to fill available space (interactive)
sudo parted /dev/sda

# Inside parted:
(parted) resizepart 2 100%
(parted) quit

# Resize the physical volume
sudo pvresize /dev/sda2
```

---

## Extend the Logical Volume

```bash
# Extend by 10GB
sudo lvextend -L +10G /dev/ubuntu-vg/ubuntu-lv

# Extend to use ALL available space in the volume group
sudo lvextend -l +100%FREE /dev/ubuntu-vg/ubuntu-lv

# Find your logical volume path
lvdisplay | grep "LV Path"
```

---

## Resize the Filesystem

After extending the LV, resize the filesystem:

```bash
# ext4
sudo resize2fs /dev/ubuntu-vg/ubuntu-lv

# xfs (XFS can only grow, not shrink)
sudo xfs_growfs /dev/ubuntu-vg/ubuntu-lv
# Or use the mount point:
sudo xfs_growfs /
```

---

## Do It All In One Command (ext4 only)

```bash
sudo lvextend -l +100%FREE --resizefs /dev/ubuntu-vg/ubuntu-lv
```

The `--resizefs` flag extends the LV and resizes the filesystem in one step.

---

## Verify

```bash
df -h
lvs
```

---

## Shrink an LVM Volume (ext4 only, risky)

> Never shrink XFS — it is not supported.

```bash
# Unmount first
sudo umount /data

# Check filesystem
sudo e2fsck -f /dev/vg0/lv-data

# Shrink filesystem (must be smaller than new LV size)
sudo resize2fs /dev/vg0/lv-data 20G

# Shrink logical volume
sudo lvreduce -L 20G /dev/vg0/lv-data

# Remount
sudo mount /dev/vg0/lv-data /data
```
