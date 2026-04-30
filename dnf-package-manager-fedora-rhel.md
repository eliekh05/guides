---
layout: default
title: "dnf — Package Manager for Fedora and RHEL"
parent: "Package Managers (All OSes)"
nav_order: 13
---

# dnf — Package Manager for Fedora and RHEL

`dnf` (Dandified YUM) is the default package manager on Fedora, Red Hat Enterprise Linux (RHEL), CentOS Stream, AlmaLinux, and Rocky Linux. It replaced the older `yum` command — if you see guides using `yum`, the same commands work with `dnf` on modern systems.

---

## Essential Commands

### Update package list and upgrade all packages

```bash
sudo dnf upgrade --refresh
```

### Install a package

```bash
sudo dnf install wget
```

Install multiple packages:

```bash
sudo dnf install wget curl git vim -y
```

### Remove a package

```bash
sudo dnf remove wget
```

Remove a package and orphaned dependencies:

```bash
sudo dnf remove wget && sudo dnf autoremove
```

### Search for a package

```bash
dnf search python
dnf search --all python  # Search in descriptions too
```

### Get info about a package

```bash
dnf info python3
```

### List installed packages

```bash
dnf list installed
dnf list installed | grep python
```

### Check for available upgrades

```bash
dnf check-update
```

---

## Cleaning Up

```bash
# Remove cached package data
sudo dnf clean all

# Remove packages that were installed as dependencies but are no longer needed
sudo dnf autoremove
```

---

## Adding Extra Repositories

### RPM Fusion (most important third-party repo for Fedora)

RPM Fusion provides packages that Fedora cannot include for legal reasons — codecs, proprietary drivers, etc.

```bash
sudo dnf install \
  https://download1.rpmfusion.org/free/fedora/rpmfusion-free-release-$(rpm -E %fedora).noarch.rpm \
  https://download1.rpmfusion.org/nonfree/fedora/rpmfusion-nonfree-release-$(rpm -E %fedora).noarch.rpm
```

After adding RPM Fusion, install multimedia codecs:

```bash
sudo dnf install ffmpeg vlc gstreamer1-plugins-{bad-*,good-*,base} gstreamer1-plugin-openh264 -y
```

### EPEL (Extra Packages for Enterprise Linux — for RHEL/CentOS/AlmaLinux/Rocky)

```bash
sudo dnf install epel-release
sudo dnf upgrade --refresh
```

### Add a custom repository

```bash
sudo dnf config-manager --add-repo https://repo.example.com/example.repo
sudo dnf update
```

---

## Package Groups

dnf can install groups of related packages at once:

```bash
# List available groups
dnf grouplist

# Install a group
sudo dnf groupinstall "Development Tools"
sudo dnf groupinstall "Fedora Workstation"

# Remove a group
sudo dnf groupremove "Development Tools"
```

---

## dnf History — Undo and Redo

dnf keeps a full transaction history and can undo any install or upgrade:

```bash
# See transaction history
dnf history

# Undo the last transaction
sudo dnf history undo last

# Undo a specific transaction (use the number from history list)
sudo dnf history undo 15
```

This is one of dnf's most useful features — if an upgrade breaks something, you can roll it back entirely.

---

## Common Errors and Fixes

### `Error: Failed to download metadata for repo`

Repo server is down or network issue:
```bash
sudo dnf clean all
sudo dnf upgrade --refresh
```

### `Nothing to do` when you expect updates

Your repos are up to date. Force a cache refresh:
```bash
sudo dnf upgrade --refresh
```

### Package conflicts during upgrade

```bash
sudo dnf upgrade --allowerasing
```

This allows removing conflicting packages to resolve the upgrade. Read the summary carefully before confirming.

### `GPG key retrieval failed`

The repo's signing key is not trusted. Import it:
```bash
sudo rpm --import https://repo.example.com/RPM-GPG-KEY
```

Or disable GPG check for a specific repo (not recommended for production):
```bash
sudo dnf install package --nogpgcheck
```

### `[Errno 14] HTTPS Error 404`

The repo URL is wrong or the package has been moved. Check that the `.repo` file in `/etc/yum.repos.d/` has the correct URL.
