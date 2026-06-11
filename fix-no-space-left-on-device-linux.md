---
layout: default
title: "Fix 'No Space Left on Device' on Linux"
parent: "System & Users"
nav_order: 26
---

# Fix "No Space Left on Device" on Linux

This error appears when a filesystem is full. The fix depends on what filled it up. Work through these in order.

---

## Step 1 — Find Which Filesystem Is Full

```bash
df -h
```

Look for a filesystem at 100% or close. Note the mount point — usually `/`, `/var`, or `/boot`.

---

## Step 2 — Find What Is Using the Space

```bash
# Find largest folders (from root)
sudo du -sh /* 2>/dev/null | sort -rh | head -20

# Drill down into the largest folder
sudo du -sh /var/* | sort -rh | head -20
sudo du -sh /var/log/* | sort -rh | head -10
```

**Common culprits:**

```bash
# Large log files
sudo du -sh /var/log/*

# Docker images and containers
docker system df
docker system prune -a

# Old kernels (Ubuntu/Debian)
dpkg --list | grep linux-image
sudo apt autoremove

# Journal logs
journalctl --disk-usage
sudo journalctl --vacuum-size=200M

# Package cache
du -sh /var/cache/apt/
sudo apt clean
```

---

## Step 3 — Quick Cleanup

```bash
# Remove old kernels and unused packages
sudo apt autoremove -y
sudo apt clean
sudo apt autoclean

# Clear journal logs older than 7 days
sudo journalctl --vacuum-time=7d

# Clear thumbnail cache
rm -rf ~/.cache/thumbnails/*

# Empty Trash
rm -rf ~/.local/share/Trash/files/*

# Clear temp files
sudo rm -rf /tmp/*
sudo rm -rf /var/tmp/*
```

---

## Step 4 — Find Large Files

```bash
# Files over 1GB
sudo find / -type f -size +1G 2>/dev/null

# Files over 500MB in /var
sudo find /var -type f -size +500M 2>/dev/null

# Largest files anywhere
sudo find / -type f -printf '%s %p\n' 2>/dev/null | sort -rn | head -20
```

---

## Special Case — `/boot` Is Full

`/boot` fills up when old kernels are not removed. The partition is small (usually 500MB–1GB).

```bash
# List installed kernels
dpkg --list | grep linux-image

# See which kernel you're running (don't remove this one)
uname -r

# Remove old kernels
sudo apt autoremove -y

# If autoremove doesn't work, manually remove old ones
sudo dpkg --purge linux-image-OLD-VERSION
```

---

## Special Case — Inode Limit Reached

Sometimes `df -h` shows space available but you still get the error. The inode table may be full:

```bash
df -i
```

If a filesystem shows 100% under `IUse%` — you have run out of inodes (too many small files).

Find directories with huge numbers of files:
```bash
sudo find / -xdev -type d -printf '%h\n' 2>/dev/null | sort | uniq -c | sort -rn | head -20
```

Common cause: mail spool, temp files, or a runaway process creating files. Delete the unnecessary files or directories.

---

## Prevent It From Happening Again

```bash
# Add to root's crontab to auto-clean journal weekly
sudo crontab -e
# Add:
0 3 * * 0 journalctl --vacuum-size=500M
0 3 * * 0 apt-get clean -y
```

---

## Check Disk Health While You're At It

If the disk filled up suspiciously fast or you see I/O errors:
```bash
sudo smartctl -H /dev/sda
```
