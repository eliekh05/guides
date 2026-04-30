---
layout: default
title: "apt — Package Manager for Ubuntu and Debian"
parent: "Package Managers (All OSes)"
nav_order: 9
---

# apt — Package Manager for Ubuntu and Debian

`apt` (Advanced Package Tool) is the default package manager on Ubuntu, Debian, Linux Mint, Pop!_OS, and all Debian-based distributions. It manages software installation, updates, and removal from official repositories. This guide covers everything you actually use day to day.

---

## Essential Commands

### Update the package list (always run this before installing anything)

```bash
sudo apt update
```

This does not install anything — it just refreshes the list of available packages and versions.

### Install a package

```bash
sudo apt install wget
```

Install multiple packages at once:

```bash
sudo apt install wget curl git vim -y
```

The `-y` flag automatically answers yes to all prompts.

### Remove a package

```bash
sudo apt remove wget
```

Remove a package AND its configuration files:

```bash
sudo apt purge wget
```

Remove a package, its config files, and any dependencies no longer needed:

```bash
sudo apt purge wget && sudo apt autoremove

# You can use sudo apt autoremove --purge to remove config files like sudo apt purge wget
```

### Upgrade all installed packages

```bash
sudo apt update && sudo apt upgrade -y
```

### Full system upgrade (includes packages that require removing old ones)

```bash
sudo apt update && sudo apt full-upgrade -y
```

Use `full-upgrade` on major Ubuntu/Debian version upgrades. Use regular `upgrade` for day-to-day updates.

---

## Searching and Getting Info

```bash
# Search for a package
apt search python3

# Get details about a package (version, description, dependencies)
apt show python3

# List all installed packages
apt list --installed

# Check if a specific package is installed
apt list --installed | grep wget

# List packages that have available upgrades
apt list --upgradable
```

---

## Cleaning Up

```bash
# Remove packages that were installed as dependencies but are no longer needed
sudo apt autoremove  

# You can use sudo apt autoremove --purge to remove config files like sudo apt purge wget

# Remove downloaded package files from cache (frees disk space)
sudo apt clean

# Remove old cached package files but keep the current versions
sudo apt autoclean
```

Run `autoremove` regularly — after major upgrades it often frees several hundred MB.

---

## Adding External Repositories (PPAs)

Some software is not in the official Ubuntu/Debian repos. You can add third-party repositories:

### Ubuntu PPA (Personal Package Archive)

```bash
sudo add-apt-repository ppa:deadsnakes/ppa
sudo apt update
sudo apt install python3.12
```

### Manual repository (using signed keys — the modern method)

```bash
# Download and install the signing key
curl -fsSL https://example.com/repo.key | sudo gpg --dearmor -o /etc/apt/keyrings/example.gpg

# Add the repository
echo "deb [arch=amd64 signed-by=/etc/apt/keyrings/example.gpg] https://repo.example.com/apt stable main" | sudo tee /etc/apt/sources.list.d/example.list

# Update and install
sudo apt update
sudo apt install example-package
```

---

## apt vs apt-get

You may see guides using `apt-get` instead of `apt`. Both work but:

- `apt` is the modern, user-friendly interface (recommended for interactive use)
- `apt-get` is the older version with more predictable output (better for scripts)

For day-to-day use, `apt` is the right choice.

---

## Common Errors and Fixes

### `E: Unable to acquire the lock`

Another apt process is running. Wait for it to finish. If you are sure nothing is running:
```bash
sudo rm /var/lib/apt/lists/lock
sudo rm /var/cache/apt/archives/lock
sudo rm /var/lib/dpkg/lock-frontend
sudo dpkg --configure -a
```

### `E: Package 'X' has no installation candidate`

The package is not in your current repos. Either add the right repo or check the exact package name with `apt search`.

### `dpkg was interrupted` error

```bash
sudo dpkg --configure -a
sudo apt install -f
```

### `Hash Sum mismatch` error

```bash
sudo rm -rf /var/lib/apt/lists/*
sudo apt update
```

### Package held back during upgrade

```bash
sudo apt install PACKAGE_NAME  # Force upgrade of the specific package
# or
sudo apt full-upgrade  # Allows dependency changes
```
