---
layout: default
title: "Install Ubuntu Server 24.04 LTS — Complete Guide"
parent: "Installation Guides"
nav_order: 28
---

# Install Ubuntu Server 24.04 LTS — Complete Guide

Ubuntu Server 24.04 LTS is supported until 2029 (standard) and 2034 (extended). It is the most common choice for self-hosted services.

---

## Download

Go to [ubuntu.com/download/server](https://ubuntu.com/download/server) and download Ubuntu Server 24.04.x LTS.

Flash to USB with balenaEtcher.

---

## Boot and Install

Boot from USB. The installer is text-based.

**Language:** English (recommended even if you do not use English — better compatibility with guides)

**Keyboard layout:** choose yours

**Installation type:** Ubuntu Server (not minimised)

**Network:** Configure your network interface. For a server, set a **static IP**:
- Subnet: `192.168.1.0/24`
- Address: `192.168.1.100` (a free IP on your network)
- Gateway: your router IP (usually `192.168.1.1`)
- Name servers: `1.1.1.1,8.8.8.8`

**Storage:** Use entire disk unless you have specific needs. If using LVM (recommended), select "Use entire disk with LVM".

**User:** Create a non-root user with a strong password. This is your primary login.

**SSH:** Check "Install OpenSSH server". This is how you will access the server after installation.

**Snaps:** Skip all snap packages during install — install them manually later if needed.

Confirm and install. Reboot when complete.

---

## First Login

SSH in from another machine:
```bash
ssh yourusername@192.168.1.100
```

---

## First Steps After Install

```bash
# Update
sudo apt update && sudo apt full-upgrade -y

# Install essential tools
sudo apt install -y curl wget git htop nano ufw fail2ban

# Enable firewall
sudo ufw allow ssh
sudo ufw enable

# Check disk layout
lsblk
df -h
```

---

## Optional — Extend LVM to Use Full Disk

Ubuntu server sometimes does not use the full disk by default:

```bash
# Check if there is free space in the volume group
sudo vgs

# Extend the logical volume and resize filesystem in one step
sudo lvextend -l +100%FREE --resizefs /dev/ubuntu-vg/ubuntu-lv

# Verify
df -h
```

---

## Set Time Zone

```bash
sudo timedatectl set-timezone Your/Timezone
timedatectl                    # verify
```

---

## Disable Root Login via SSH

```bash
sudo nano /etc/ssh/sshd_config
# Set: PermitRootLogin no
sudo systemctl restart sshd
```

---

## Static IP Verification

```bash
ip a                           # confirm your static IP
cat /etc/netplan/*.yaml        # view Netplan config
```
