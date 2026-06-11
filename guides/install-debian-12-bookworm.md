---
layout: default
title: "Install Debian 12 (Bookworm) — Desktop and Server"
parent: "Installation Guides"
nav_order: 30
---

# Install Debian 12 (Bookworm) — Desktop and Server

Debian 12 is the most stable Linux distribution. Packages are older than Fedora or Ubuntu but never break. Supported until 2028.

---

## Download

Go to [debian.org/distrib/netinst](https://www.debian.org/distrib/netinst) and download:

- **amd64 netinst** — small installer, downloads packages during install (needs internet)
- **DVD image** — larger, installs without internet

If your WiFi card needs proprietary firmware: download the **unofficial non-free firmware** version instead.

---

## Installer Type — Graphical vs Expert

**Graphical install:** Easier, same result
**Expert install:** More control (static IP, custom partitioning, less hand-holding)

For a server, use Expert install. For a desktop, Graphical install is fine.

---

## Installation

**Hostname:** Set something meaningful (e.g., `debian-desktop` or `homeserver`)

**Domain:** Leave blank unless in a domain environment

**Root password:** Set one, or leave blank to disable root and make your user a sudo admin

**User account:** Create a regular user

**Partitioning:**
- **Guided — use entire disk with LVM** is recommended for both desktop and server
- For desktop: all files in one partition
- For server: separate `/home` is optional

**Software selection (tasksel):**
- Desktop: GNOME Desktop Environment + standard system utilities
- Server: SSH server + standard system utilities (no desktop)

---

## After Install — Enable sudo

Unlike Ubuntu, Debian does not add your user to sudo automatically if you set a root password:

```bash
su -     # switch to root
apt install sudo -y
usermod -aG sudo yourusername
exit
```

Log out and back in. Test: `sudo apt update`

---

## Non-Free Firmware and Repositories

```bash
sudo nano /etc/apt/sources.list
```

Add `contrib non-free non-free-firmware` to each line:
```
deb http://deb.debian.org/debian/ bookworm main contrib non-free non-free-firmware
deb http://security.debian.org/debian-security bookworm-security main contrib non-free non-free-firmware
deb http://deb.debian.org/debian/ bookworm-updates main contrib non-free non-free-firmware
```

```bash
sudo apt update
```

---

## Install Common Desktop Apps

```bash
# Flatpak (better app selection than Debian packages)
sudo apt install flatpak -y
flatpak remote-add --if-not-exists flathub https://dl.flathub.org/repo/flathub.flatpakrepo

# Install apps
flatpak install flathub com.visualstudio.code
flatpak install flathub org.videolan.VLC
flatpak install flathub com.spotify.Client
```
