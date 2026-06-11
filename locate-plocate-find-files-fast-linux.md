---
layout: default
title: "locate and plocate — Find Files Fast on Linux"
parent: "Linux"
nav_order: 37
---

# locate and plocate — Find Files Fast on Linux

`locate` finds files instantly by searching a pre-built database instead of scanning the filesystem in real time. It is orders of magnitude faster than `find` for simple filename searches. `plocate` is the modern replacement for `mlocate` — it is the default on Ubuntu 22.04+, Debian 12+, Fedora 36+.

---

## Install

```bash
sudo apt install plocate -y      # Ubuntu 22.04+ / Debian 12+
sudo dnf install plocate -y      # Fedora 36+
sudo pacman -S plocate           # Arch
```

On older Ubuntu/Debian if you need mlocate:
```bash
sudo apt install mlocate -y
```

---

## Build / Update the Database

The database is built automatically after install and updated daily by a systemd timer. Build it manually for first use or after creating new files:

```bash
sudo updatedb
```

Check when it was last updated:
```bash
ls -la /var/lib/plocate/plocate.db
```

---

## Basic Search

```bash
locate filename.txt              # find any file named filename.txt
locate "*.conf"                  # find all .conf files
locate nginx                     # find anything with "nginx" in the path
locate /etc/nginx                # narrow to a specific path prefix
```

---

## Useful Options

```bash
locate -i filename               # case-insensitive search
locate -c filename               # count matches without listing them
locate -l 10 filename            # show only first 10 results
locate -b filename               # match only the basename (not full path)
locate -b '\filename.txt'        # exact basename match (backslash = exact)
locate -e filename               # only show files that actually exist right now
locate -r '\.conf$'              # regex: files ending in .conf
```

---

## plocate-Specific: Multiple Patterns (AND logic)

plocate matches files that contain ALL patterns — unlike mlocate which matches ANY:

```bash
plocate nginx conf               # files with both "nginx" AND "conf" in path
plocate usr lib python           # files with all three strings in path
```

This is a key difference from mlocate where each pattern is treated separately.

---

## Exclude Paths from the Database

Edit `/etc/updatedb.conf` to stop indexing specific paths or filesystem types:

```bash
sudo nano /etc/updatedb.conf
```

```
PRUNE_BIND_MOUNTS="yes"
PRUNEFS="NFS nfs nfs4 rpc_pipefs afs binfmt_misc proc smbfs autofs iso9660 ncpfs coda devpts ftpfs devfs mfs shfs sysfs cifs lustre tmpfs usbfs udf fuse.glusterfs fuse.sshfs curlftpfs ceph fuse.ceph fuse.rozofs ecryptfs fusesmb"
PRUNENAMES=".git .hg .svn .bzr"
PRUNEPATHS="/tmp /var/spool /media /var/lib/os-prober /var/lib/ceph /home/.ecryptfs /var/lib/schroot"
```

After editing:
```bash
sudo updatedb
```

---

## locate vs find — When to Use Which

| | locate | find |
|---|---|---|
| Speed | Instant (searches database) | Slower (scans filesystem) |
| Files created since last updatedb | Not found | Found |
| Search by permissions, size, date | No | Yes |
| Complex conditions | No | Yes |
| Best for | Quick filename searches | Detailed or real-time searches |

---

## Troubleshooting

### locate returns nothing for a file you just created
The database has not been updated since you created it. Run:
```bash
sudo updatedb
```

### "command not found: locate"
Install plocate: `sudo apt install plocate`

### locate shows files that no longer exist
Use `-e` to filter to only existing files:
```bash
locate -e filename
```

### Enable daily auto-update (if not already running)
```bash
sudo systemctl enable --now plocate-updatedb.timer
sudo systemctl status plocate-updatedb.timer
```
