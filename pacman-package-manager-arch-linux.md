---
layout: default
title: "pacman — Package Manager for Arch Linux"
parent: "Package Managers (All OSes)"
nav_order: 10
---

# pacman — Package Manager for Arch Linux

`pacman` is the package manager for Arch Linux and all Arch-based distributions (Manjaro, EndeavourOS, Garuda, etc.). It is fast, simple, and works with both the official Arch repositories and the AUR (Arch User Repository).

---

## Essential Commands

### Update the package database and upgrade all packages

```bash
sudo pacman -Syu
```

Always run this before installing anything. `-S` syncs, `-y` refreshes the database, `-u` upgrades.

### Install a package

```bash
sudo pacman -S wget
```

Install multiple packages:

```bash
sudo pacman -S wget curl git vim
```

### Remove a package

```bash
sudo pacman -R wget
```

Remove a package and all its dependencies not needed by anything else:

```bash
sudo pacman -Rs wget
```

Remove a package, dependencies, and its configuration files:

```bash
sudo pacman -Rns wget
```

### Search for a package

```bash
pacman -Ss python  # Search in repositories
pacman -Qs python  # Search only in installed packages
```

### Get info about a package

```bash
pacman -Si python   # Info from repository
pacman -Qi python   # Info for installed package
```

### List all installed packages

```bash
pacman -Q
```

List installed packages with their versions:

```bash
pacman -Q | less
```

List only explicitly installed packages (not dependencies):

```bash
pacman -Qe
```

---

## Cleaning Up

```bash
# Remove cached package versions that are no longer installed
sudo pacman -Sc

# Remove ALL cached packages (frees the most space)
sudo pacman -Scc

# Remove orphaned packages (installed as dependencies but no longer needed)
sudo pacman -Rns $(pacman -Qtdq)
```

---

## The AUR (Arch User Repository)

The AUR contains community-maintained packages not in the official repos. You need an AUR helper to install from it — `yay` is the most popular.

### Install yay

```bash
sudo pacman -S --needed git base-devel
git clone https://aur.archlinux.org/yay.git
cd yay
makepkg -si
```

### Use yay to install AUR packages

```bash
yay -S google-chrome
yay -S visual-studio-code-bin
```

`yay` uses the same syntax as `pacman` and also works for official repo packages:

```bash
yay -Syu          # Update everything including AUR packages
yay -Ss keyword   # Search official repos and AUR
yay -R package    # Remove a package
```

> **Note:** AUR helpers like `yay` are not officially supported by Arch Linux. Always check the PKGBUILD of AUR packages before installing — it is a shell script that runs on your machine.

---

## pacman.conf — Key Settings

The main config file is `/etc/pacman.conf`. Useful options:

```
# Enable colored output
Color

# Show download progress bar
ILoveCandy  # (optional Easter egg — changes the progress bar)

# Enable parallel downloads (faster)
ParallelDownloads = 5
```

Edit with:
```bash
sudo nano /etc/pacman.conf
```

---

## Common Errors and Fixes

### `error: failed to synchronize all databases`

Your package database is out of date or mirrors are slow:
```bash
sudo pacman -Syy  # Force refresh the database
```

Or update your mirrors:
```bash
sudo pacman -S reflector
sudo reflector --country 'YOUR_COUNTRY' --latest 10 --sort rate --save /etc/pacman.d/mirrorlist
sudo pacman -Syyu
```

### `error: target not found`

The package does not exist in the official repos. Search the AUR instead:
```bash
yay -Ss package_name
```

### `conflicting files` error

A file already exists where pacman wants to install:
```bash
sudo pacman -S --overwrite '*' package_name
```

Only use this if you understand what is being overwritten.

### Database is locked

```bash
sudo rm /var/lib/pacman/db.lck
```

### Keyring issues after a long time without updates

```bash
sudo pacman -Sy archlinux-keyring
sudo pacman -Su
```

---

## pacman Flag Reference

| Flag | Meaning |
|---|---|
| `-S` | Sync (install/upgrade from repo) |
| `-R` | Remove |
| `-Q` | Query (search installed packages) |
| `-U` | Upgrade (install from local file) |
| `-D` | Database (modify install reason) |
| `-y` | Refresh database |
| `-u` | Upgrade all outdated packages |
| `-s` | Search |
| `-i` | Show info |
| `-n` | Also remove config files |
| `-c` | Clean cache |
