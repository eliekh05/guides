---
layout: default
title: "Check Disk Space on macOS and Linux"
parent: "macOS & Linux"
nav_order: 16
---

# Check Disk Space on macOS and Linux

---

## macOS

### In Finder
Click the **Apple menu ()** → **About This Mac** → **More Info** → **Storage**.

Or in Finder: hold **Option (⌥)** and click the **Go** menu → **Computer** → right-click your drive → **Get Info**.

### In Terminal

```bash
# Disk usage summary for all mounted volumes
df -h

# How much space a specific folder uses
du -sh ~/Downloads
du -sh ~/Desktop

# Top 10 largest folders in your home directory
du -sh ~/* | sort -rh | head -10

# Find the largest files on the whole system
sudo du -sh /* 2>/dev/null | sort -rh | head -20
```

### Free up space quickly

```bash
# Clear Homebrew cache
brew cleanup -s

# Clear system and user caches
sudo rm -rf ~/Library/Caches/*
sudo rm -rf /Library/Caches/*
```

---

## Linux

```bash
# Disk usage for all mounted filesystems
df -h

# Size of a specific folder
du -sh /var/log

# Find the largest directories from root
sudo du -sh /* 2>/dev/null | sort -rh | head -20

# Find files over 1 GB
sudo find / -type f -size +1G 2>/dev/null

# Interactive disk usage browser (install first)
sudo apt install ncdu -y    # Ubuntu/Debian
sudo dnf install ncdu -y    # Fedora

ncdu /    # Browse disk usage interactively
```

`ncdu` is the most useful tool here — it lets you navigate into folders, see what is using space, and delete things directly from the interface.

### Free up space on Ubuntu/Debian

```bash
# Remove old packages
sudo apt autoremove -y
sudo apt clean

# Remove old kernels (keeps current + one previous)
sudo apt autoremove --purge -y

# Clean journal logs older than 7 days
sudo journalctl --vacuum-time=7d
```