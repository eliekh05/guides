---
layout: default
title: "Flatpak — Install and Use on Linux"
parent: "Package Managers (All OSes)"
nav_order: 12
---

# Flatpak — Install and Use on Linux

Flatpak is a universal package format for Linux. Apps are sandboxed, work on any distro, and are distributed through Flathub — the central Flatpak repository with thousands of apps.

---

## Install Flatpak

**Ubuntu / Debian / Linux Mint:**
```bash
sudo apt install flatpak -y
sudo apt install gnome-software-plugin-flatpak -y   # for GUI software centre integration
```

**Fedora:** (pre-installed on Fedora Workstation)
```bash
sudo dnf install flatpak -y
```

**Arch:**
```bash
sudo pacman -S flatpak
```

---

## Add Flathub Repository

```bash
flatpak remote-add --if-not-exists flathub https://dl.flathub.org/repo/flathub.flatpakrepo
```

**Restart your session** after adding Flathub — Flatpak apps need a new login session to appear in app launchers.

---

## Install Apps

```bash
# Search for an app
flatpak search firefox

# Install from Flathub
flatpak install flathub org.mozilla.firefox
flatpak install flathub com.spotify.Client
flatpak install flathub com.visualstudio.code

# Install without prompt
flatpak install -y flathub org.mozilla.firefox
```

---

## Run Apps

```bash
flatpak run org.mozilla.firefox
flatpak run com.spotify.Client
```

Installed Flatpak apps also appear in your application launcher (GNOME Activities, KDE app menu, etc.).

---

## Manage Installed Apps

```bash
flatpak list                        # list installed Flatpak apps
flatpak list --app                  # apps only (not runtimes)
flatpak info org.mozilla.firefox    # details about an app

flatpak update                      # update all installed apps
flatpak update org.mozilla.firefox  # update specific app

flatpak uninstall org.mozilla.firefox
flatpak uninstall --unused          # remove unused runtimes to free space
```

---

## Permissions and Sandbox

Flatpak apps are sandboxed — they cannot access most of the filesystem by default. View and change permissions:

```bash
# Install Flatseal for a GUI permission manager
flatpak install flathub com.github.tchx84.Flatseal

# View permissions from CLI
flatpak info --show-permissions org.mozilla.firefox

# Override a permission
flatpak override --user --filesystem=home org.mozilla.firefox    # allow access to home
flatpak override --user --filesystem=/mnt/data org.mozilla.firefox  # specific path

# Reset permissions to defaults
flatpak override --user --reset org.mozilla.firefox
```

---

## Free Up Disk Space

Flatpak keeps old app versions and runtimes. Clean them up:

```bash
flatpak uninstall --unused          # remove unused runtimes
flatpak repair                      # repair broken installations
```

---

## Popular Apps on Flathub

```bash
flatpak install flathub com.spotify.Client
flatpak install flathub com.discordapp.Discord
flatpak install flathub org.videolan.VLC
flatpak install flathub org.gimp.GIMP
flatpak install flathub org.inkscape.Inkscape
flatpak install flathub com.obsproject.Studio
flatpak install flathub com.visualstudio.code
flatpak install flathub com.jetbrains.IntelliJ-IDEA-Community
flatpak install flathub io.github.prateekmedia.appimagepool
```
