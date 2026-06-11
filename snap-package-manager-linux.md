---
layout: default
title: "snap — Package Manager on Linux"
parent: "Package Managers (All OSes)"
nav_order: 13
---

# snap — Package Manager on Linux

Snaps are self-contained packages that include all dependencies and work across Linux distributions. They are maintained by Canonical (Ubuntu's parent company) and pre-installed on Ubuntu.

---

## Install snap (non-Ubuntu)

**Debian:**
```bash
sudo apt install snapd -y
sudo systemctl enable --now snapd.socket
sudo ln -s /var/lib/snapd/snap /snap   # for classic snap support
```

**Fedora:**
```bash
sudo dnf install snapd -y
sudo systemctl enable --now snapd.socket
sudo ln -s /var/lib/snapd/snap /snap
```

**Arch:**
```bash
sudo pacman -S snapd
sudo systemctl enable --now snapd.socket
sudo ln -s /var/lib/snapd/snap /snap
```

---

## Basic Commands

```bash
# Search for a snap
snap find firefox

# Install a snap
sudo snap install firefox

# Install in classic mode (unrestricted, like a normal app)
sudo snap install code --classic

# Remove a snap
sudo snap remove firefox

# Update all snaps
sudo snap refresh

# Update a specific snap
sudo snap refresh firefox

# List installed snaps
snap list

# Info about a snap
snap info firefox
```

---

## View Running Snap Services

```bash
snap services                        # list all snap services
sudo snap start/stop/restart service-name
```

---

## Revert to Previous Version

Snap keeps the previous version and you can roll back:

```bash
sudo snap revert firefox
snap list --all firefox     # see all installed versions
```

---

## Free Up Disk Space

Snap keeps old versions. Remove them:

```bash
# Remove old snap versions (keep current + 2)
snap list --all | awk '/disabled/{print $1, $3}' | while read snapname revision; do
  sudo snap remove "$snapname" --revision="$revision"
done
```

---

## snap vs Flatpak vs apt

| | snap | Flatpak | apt/dnf |
|---|---|---|---|
| Made by | Canonical (Ubuntu) | Community/Fedora | Distro maintainers |
| Sandboxed | Yes | Yes | No |
| Works on all distros | Yes | Yes | Distro-specific |
| Desktop apps | Yes | Yes (better) | Yes |
| Server/CLI apps | Yes | No | Yes |
| Startup speed | Slower (mounts) | Fast | Fast |
| Auto-updates | Yes (background) | Manual | Manual |

---

## Disable snap on Ubuntu (if you prefer Flatpak)

```bash
sudo systemctl disable --now snapd
sudo apt purge snapd -y
sudo apt-mark hold snapd

# Block future reinstall
sudo tee /etc/apt/preferences.d/nosnap.pref << 'SNAP'
Package: snapd
Pin: release a=*
Pin-Priority: -10
SNAP
```

Then install Flatpak as the alternative.
