---
layout: default
title: "Install Fedora Linux Workstation"
parent: "Installation Guides"
nav_order: 29
---

# Install Fedora Linux Workstation

Fedora is a desktop Linux distribution with the latest software. It gets major releases every 6 months and supports each release for 13 months.

---

## Download

Go to [fedoraproject.org](https://fedoraproject.org) → **Download Fedora Workstation**

Download the ISO and flash with balenaEtcher.

---

## Install

Boot from USB. Fedora uses the Anaconda graphical installer.

**Language and keyboard:** Select yours

**Installation Destination:**
- Click your disk
- Choose **Automatic** for simple setup or **Custom** to configure partitions
- For UEFI systems, Fedora creates an EFI partition, a `/boot` partition, and a root BTRFS filesystem automatically

**Software Selection:** Fedora Workstation with GNOME (default)

**Network:** Fedora can configure network during install if needed

**Root and User:**
- Enable root account if you want (optional on Fedora)
- Create a user and check **Make this user administrator**

Click **Begin Installation** and wait.

---

## First Steps After Install

```bash
# Update all packages
sudo dnf update -y

# Enable RPM Fusion (third-party packages including Nvidia drivers and codecs)
sudo dnf install https://download1.rpmfusion.org/free/fedora/rpmfusion-free-release-$(rpm -E %fedora).noarch.rpm
sudo dnf install https://download1.rpmfusion.org/nonfree/fedora/rpmfusion-nonfree-release-$(rpm -E %fedora).noarch.rpm

# Install multimedia codecs
sudo dnf groupupdate multimedia --setopt="install_weak_deps=False" --exclude=PackageKit-gstreamer-plugin
sudo dnf groupupdate sound-and-video

# Enable Flathub for Flatpak apps
flatpak remote-add --if-not-exists flathub https://dl.flathub.org/repo/flathub.flatpakrepo
```

---

## Install Common Apps

```bash
# Via dnf
sudo dnf install vim git curl wget htop gnome-tweaks

# Via Flatpak (better isolation and more up-to-date)
flatpak install flathub com.spotify.Client
flatpak install flathub com.discordapp.Discord
flatpak install flathub org.videolan.VLC
flatpak install flathub com.visualstudio.code
```

---

## Nvidia Drivers (If You Have Nvidia GPU)

```bash
# Install after enabling RPM Fusion (above)
sudo dnf install akmod-nvidia xorg-x11-drv-nvidia-cuda
sudo reboot
# After reboot:
nvidia-smi   # verify driver loaded
```

---

## GNOME Tweaks and Extensions

```bash
sudo dnf install gnome-tweaks gnome-extensions-app

# Enable via browser (install extension): extensions.gnome.org
```

Popular extensions: Dash to Dock, AppIndicator, Blur my Shell, Pop Shell (tiling)
