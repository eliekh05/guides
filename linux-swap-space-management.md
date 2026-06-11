---
layout: default
title: "Manage Swap Space on Linux"
parent: "System & Users"
nav_order: 27
---

# Manage Swap Space on Linux

Swap is disk space used as overflow when RAM is full. Modern Linux can use either a swap partition or a swap file — swap files are easier to create and resize.

---

## Check Current Swap

```bash
swapon --show               # detailed swap info
free -h                     # shows swap alongside RAM
cat /proc/swaps             # raw swap info
```

---

## Create a Swap File

```bash
# 1. Create the file (2GB example)
sudo fallocate -l 2G /swapfile

# If fallocate isn't available:
sudo dd if=/dev/zero of=/swapfile bs=1M count=2048

# 2. Set correct permissions (readable by root only)
sudo chmod 600 /swapfile

# 3. Format as swap
sudo mkswap /swapfile

# 4. Enable the swap file
sudo swapon /swapfile

# 5. Verify
swapon --show
free -h
```

---

## Make Swap Permanent

Add to `/etc/fstab` so it activates at boot:

```bash
sudo nano /etc/fstab
```

Add this line:
```
/swapfile  none  swap  sw  0  0
```

---

## Resize Swap

To change swap size, disable it, delete the file, and recreate:

```bash
sudo swapoff /swapfile
sudo rm /swapfile
# Create new size (e.g., 4GB)
sudo fallocate -l 4G /swapfile
sudo chmod 600 /swapfile
sudo mkswap /swapfile
sudo swapon /swapfile
```

---

## Disable Swap Temporarily

```bash
sudo swapoff /swapfile          # disable specific swap file
sudo swapoff -a                 # disable ALL swap
```

---

## Swappiness — How Aggressively Linux Uses Swap

Swappiness (0–100) controls how readily Linux moves RAM contents to swap. Default is 60.

```bash
# Check current swappiness
cat /proc/sys/vm/swappiness
sysctl vm.swappiness

# Change temporarily
sudo sysctl vm.swappiness=10

# Change permanently
sudo nano /etc/sysctl.conf
# Add or modify:
vm.swappiness=10
```

Recommended values:
- `10` — for desktops and workstations (use RAM more, swap less)
- `1` — for servers with enough RAM (almost never swap)
- `60` — default (balanced)

---

## Swap Partition vs Swap File

| | Swap Partition | Swap File |
|---|---|---|
| Performance | Slightly better | Barely noticeable difference |
| Flexibility | Fixed size | Easy to resize |
| Setup | Done during install | Create anytime |
| Modern recommendation | Both work fine | Swap file is simpler |

---

## When Do You Need Swap?

- **Desktop with 8GB+ RAM:** Swap rarely needed but useful as a safety net (1–2GB)
- **Server:** Set swap = RAM size or double RAM as a safety buffer
- **Low RAM (2–4GB):** Swap is important — set to 2× RAM
- **SSD storage:** Avoid heavy swap use — it wears the drive. Keep swappiness low (10).
