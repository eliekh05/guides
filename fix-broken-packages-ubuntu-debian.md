---
layout: default
title: "Fix Broken Packages on Ubuntu and Debian"
parent: "Package Managers (All OSes)"
nav_order: 12
---

# Fix Broken Packages on Ubuntu and Debian

---

## Quick Fix — Most Cases

```bash
sudo apt --fix-broken install
sudo dpkg --configure -a
sudo apt update && sudo apt upgrade -y
```

Run these three in order. This resolves most broken package situations.

---

## Common Error Messages

### `dpkg was interrupted`

```bash
sudo dpkg --configure -a
sudo apt install -f
```

### `E: Unmet dependencies`

```bash
sudo apt --fix-broken install
```

### `dpkg: error: dpkg status database is locked`

Another apt/dpkg process is running. Wait for it, or if nothing is running:

```bash
sudo rm /var/lib/dpkg/lock
sudo rm /var/lib/dpkg/lock-frontend
sudo rm /var/cache/apt/archives/lock
sudo dpkg --configure -a
```

### `Hash Sum mismatch`

Repository cache is corrupted:

```bash
sudo rm -rf /var/lib/apt/lists/*
sudo apt update
```

### `Package X has no installation candidate`

The package does not exist in your current sources. Check the package name or add the right repository.

### `Unable to correct problems, you have held broken packages`

```bash
sudo apt-get check                  # shows which packages are broken
sudo apt --fix-broken install
sudo apt autoremove
```

---

## Force Remove a Broken Package

If a package is stuck and blocking everything:

```bash
sudo dpkg --remove --force-remove-reinstreq packagename
sudo dpkg --purge --force-remove-reinstreq packagename    # also removes config
```

Then:
```bash
sudo apt --fix-broken install
sudo apt update
```

---

## Reconfigure a Misbehaving Package

If a package installed but behaves incorrectly:

```bash
sudo dpkg-reconfigure packagename
```

---

## Full Cleanup and Repair Sequence

For persistent problems, run this full sequence:

```bash
# 1. Remove locks
sudo rm -f /var/lib/dpkg/lock /var/lib/dpkg/lock-frontend
sudo rm -f /var/cache/apt/archives/lock /var/lib/apt/lists/lock

# 2. Reconfigure interrupted installs
sudo dpkg --configure -a

# 3. Fix broken dependencies
sudo apt --fix-broken install -y

# 4. Clean cache
sudo apt clean
sudo rm -rf /var/lib/apt/lists/*

# 5. Refresh and upgrade
sudo apt update
sudo apt upgrade -y

# 6. Remove orphaned packages
sudo apt autoremove -y
```

---

## Check Package Database Integrity

```bash
sudo dpkg --audit                   # show packages in bad state
sudo apt-cache check                # check cache integrity
```

---

## Reinstall a Package

If a package is installed but broken:

```bash
sudo apt reinstall packagename
sudo apt install --reinstall packagename    # older apt syntax
```
