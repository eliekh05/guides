---
layout: default
title: "locate and plocate — Fast File Search on Linux"
parent: "Linux"
nav_order: 37
---

# locate and plocate — Fast File Search on Linux

`locate` finds files instantly by searching a pre-built database instead of scanning the filesystem in real time like `find`. `plocate` is the modern, faster replacement for `mlocate` — it is the default on Ubuntu 22.04+ and Debian 12+.

---

## Install

```bash
# Ubuntu/Debian (22.04+ already has plocate)
sudo apt install plocate -y

# Older Ubuntu/Debian
sudo apt install mlocate -y

# Fedora/RHEL
sudo dnf install mlocate -y

# Arch
sudo pacman -S mlocate
```

---

## Update the Database

The database must be updated to reflect recent file changes. It updates automatically via a daily cron job, but you can force it manually:

```bash
sudo updatedb
```

On first install, run this before searching — the database will be empty otherwise.

---

## Basic Usage

```bash
locate filename.txt
locate "*.conf"
locate nginx
```

---

## Useful Flags

```bash
# Case-insensitive search
locate -i README

# Limit number of results
locate -n 10 "*.log"

# Count matches only
locate -c "*.py"

# Only show files that currently exist (verifies against filesystem)
locate -e filename.txt

# Search with a regex pattern
locate -r "\.log$"

# Show only files in a specific path
locate /etc/ | grep nginx
```

---

## plocate vs mlocate

`plocate` is significantly faster on large filesystems because it uses a compressed index with better algorithms. The commands are identical — `locate` on modern Ubuntu/Debian already uses plocate under the hood.

```bash
# Check which you have
locate --version
```

---

## Configure What updatedb Indexes

Edit `/etc/updatedb.conf` to control what gets indexed:

```bash
sudo nano /etc/updatedb.conf
```

```
PRUNE_BIND_MOUNTS="yes"
PRUNEFS="NFS nfs nfs4 rpc_pipefs afs binfmt_misc proc smbfs autofs iso9660 ncpfs coda devpts ftpfs devfs mfs shfs sysfs cifs lustre tmpfs usbfs udf fuse.glusterfs fuse.sshfs curlftpfs ecryptfs fusesmb fuse.gvfs-fuse-daemon"
PRUNENAMES=".git .bzr .hg .svn"
PRUNEPATHS="/tmp /var/spool /media /var/lib/os-prober /var/lib/ceph /home/.ecryptfs /var/lib/schroot"
```

- `PRUNEPATHS` — directories to exclude from indexing
- `PRUNENAMES` — directory names to exclude (like `.git`)
- `PRUNEFS` — filesystem types to skip

After changes: `sudo updatedb`

---

## locate vs find — When to Use Which

| | locate | find |
|---|---|---|
| Speed | Instant | Slower (scans disk) |
| Freshness | Database (may be 24h old) | Real-time |
| Search by name | ✅ | ✅ |
| Search by size, date, permissions | ❌ | ✅ |
| Search content of files | ❌ | ✅ (with -exec grep) |
| New files just created | ❌ (until updatedb) | ✅ |

Use `locate` for quick filename searches. Use `find` when you need real-time results or need to filter by attributes other than name.

---

## Practical Examples

```bash
# Find all nginx config files
locate nginx.conf

# Find all Python files
locate "*.py" | head -20

# Find files in /etc containing "ssh"
locate /etc/ | grep ssh

# Find all log files
locate "*.log"

# Check if a command exists anywhere on the system
locate -e /usr/bin/python3
```
