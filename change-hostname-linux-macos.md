---
layout: default
title: "Change Hostname on Linux and macOS"
parent: "System & Users"
nav_order: 25
---

# Change Hostname on Linux and macOS

---

## Linux

### Check current hostname

```bash
hostname
hostnamectl
cat /etc/hostname
```

### Change hostname permanently

**Method 1 — hostnamectl (modern, recommended):**

```bash
sudo hostnamectl set-hostname newhostname
```

**Method 2 — edit files directly:**

```bash
# Edit hostname file
sudo nano /etc/hostname
# Replace the current hostname with the new one. Save and exit.

# Edit hosts file
sudo nano /etc/hosts
# Find the line with your old hostname (usually 127.0.1.1 oldhostname)
# Change it to 127.0.1.1 newhostname
```

### Apply without rebooting

```bash
sudo hostname newhostname
# Or restart the hostname service
sudo systemctl restart systemd-hostnamed
```

### Verify

```bash
hostname
hostnamectl status
```

---

## macOS

### Check current hostname

```bash
hostname
scutil --get HostName
scutil --get LocalHostName
scutil --get ComputerName
```

macOS has three separate "names":
- **HostName** — used by the command line
- **LocalHostName** — used for Bonjour/mDNS (what you see on the network as `name.local`)
- **ComputerName** — display name shown in System Settings

### Change via System Settings (Easiest)

**System Settings → General → About → Name** — change the name here.

This updates the ComputerName. The LocalHostName updates automatically based on it.

### Change via Terminal

```bash
# Change all three
sudo scutil --set HostName newhostname
sudo scutil --set LocalHostName newhostname
sudo scutil --set ComputerName "New Computer Name"

# Flush DNS to apply
dscacheutil -flushcache
```

### Verify

```bash
scutil --get HostName
scutil --get LocalHostName
scutil --get ComputerName
```

---

## Proxmox / Server Hostname Change

For Proxmox or any server where the hostname must match DNS and `/etc/hosts`:

```bash
# 1. Change hostname
sudo hostnamectl set-hostname proxmox.local

# 2. Update /etc/hosts — critical for Proxmox
sudo nano /etc/hosts
# Change the line that maps your IP to the old hostname:
# FROM: 192.168.1.100  oldname.local oldname
# TO:   192.168.1.100  proxmox.local proxmox

# 3. Verify resolution
hostname --fqdn
hostname --ip-address      # must return actual IP, not 127.x.x.x
```
