---
layout: default
title: "Resize a VM Disk in Proxmox"
parent: "Installation Guides"
nav_order: 24
---

# Resize a VM Disk in Proxmox

Expanding a VM disk in Proxmox is a two-step process that most guides only half-explain: first resize the virtual disk in Proxmox, then grow the partition and filesystem inside the VM.

> ⚠️ Always take a snapshot before resizing. Shrinking a disk is not supported — you can only expand.

---

## Step 1 — Expand the Disk in Proxmox

**Via the Web UI:**
1. Select the VM → **Hardware** tab
2. Select the disk you want to expand
3. Click **Disk Action** → **Resize**
4. Enter how much to add (e.g. `20` to add 20 GB)
5. Click **Resize disk**

**Via the Proxmox shell:**
```bash
qm resize VMID virtio0 +20G      # add 20GB to virtio0
qm resize VMID scsi0 +20G        # for SCSI disk
```

Replace `VMID` with your VM's ID number and `virtio0`/`scsi0` with your disk name.

---

## Step 2 — Expand Inside the VM (Linux)

Log into the VM and run:

### Check the current state

```bash
lsblk                   # see disk and partition layout
df -h                   # see filesystem usage
```

### For a simple partition + ext4 (most common)

```bash
# Install growpart if not present
sudo apt install cloud-guest-utils -y    # Ubuntu/Debian
sudo dnf install cloud-utils-growpart -y # Fedora/RHEL

# Grow the partition (replace sda and 1 with your disk and partition number)
sudo growpart /dev/sda 1

# Resize the ext4 filesystem
sudo resize2fs /dev/sda1

# Verify
df -h
```

### For LVM

```bash
# Grow the physical volume
sudo pvresize /dev/sda3

# Extend the logical volume
sudo lvextend -l +100%FREE /dev/ubuntu-vg/ubuntu-lv

# Resize the filesystem
sudo resize2fs /dev/ubuntu-vg/ubuntu-lv
```

### For XFS filesystem

```bash
sudo growpart /dev/sda 1
sudo xfs_growfs /          # grow XFS on mounted filesystem
```

### For Btrfs

```bash
sudo growpart /dev/sda 1
sudo btrfs filesystem resize max /
```

---

## Step 2 (Windows VM)

For a Windows VM, the disk expansion is done inside Windows:

1. Open **Disk Management** (right-click Start → Disk Management)
2. Right-click the volume you want to expand
3. Select **Extend Volume**
4. Follow the wizard

---

## Troubleshooting

### growpart says "NOCHANGE: partition 1 is size X. it cannot be grown"
The partition is already at the maximum size. The disk was expanded in Proxmox but the partition table was not updated. Check if there is unallocated space after the partition with `lsblk`. If not, the Proxmox resize may not have saved — try again.

### resize2fs says "Nothing to do"
The partition needs to be grown first with `growpart` before `resize2fs`. Do them in order.

### Cannot resize — snapshot blocking
Proxmox cannot resize a disk that has snapshots. Delete all snapshots first, then resize.
