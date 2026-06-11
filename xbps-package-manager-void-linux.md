---
layout: default
title: "xbps — Package Manager for Void Linux"
parent: "Package Managers (All OSes)"
nav_order: 9
---

# xbps — Package Manager for Void Linux

XBPS (X Binary Package System) is the package manager for Void Linux. Unlike apt, pacman, or dnf which are all derived from or inspired by earlier systems, XBPS was designed and implemented from scratch in C by the Void Linux team. It is fast, transactional (if something breaks mid-install it rolls back cleanly), and uses RSA-signed packages for security.

The main difference from other package managers is that **XBPS is not one command — it is a collection of separate tools**, each with a specific job. Once you understand that, it clicks.

---

## The Core Commands

Most general package management is done with these commands:

- `xbps-query` — searches for and displays information about packages
- `xbps-install` — installs and updates packages, and syncs repository indexes
- `xbps-remove` — removes installed packages, and can also remove orphaned packages and cached files
- `xbps-reconfigure` — runs configuration steps for installed packages
- `xbps-alternatives` — lists or sets alternatives provided by installed packages

---

## Essential Commands

### Sync repositories and update everything

```bash
sudo xbps-install -Su
```

`-S` syncs the repository index. `-u` upgrades all outdated packages. Always sync before upgrading.

> **Important:** XBPS must use a separate transaction to update itself. If your update includes the xbps package, you will need to run the above command a second time to apply the rest of the updates.

### Install a package

```bash
sudo xbps-install -S package-name
```

Always include `-S` to sync first — without it you might install an outdated version.

### Install multiple packages

```bash
sudo xbps-install -S git vim curl wget
```

### Install temporarily for evaluation

```bash
sudo xbps-install -A package-name
```

`-A` marks the package as an automatic dependency. The package and its dependencies will be removed automatically when `xbps-remove -o` is run — useful for trying something without permanently adding it to your install.

### Remove a package

```bash
sudo xbps-remove package-name
```

### Remove a package and its now-unneeded dependencies

```bash
sudo xbps-remove -R package-name
```

### Remove orphaned packages and clean cache

```bash
sudo xbps-remove -Oo
```

`-O` removes obsolete cached packages. `-o` removes orphaned packages (installed as dependencies but no longer needed by anything).

---

## Searching

### Search repositories for a package

```bash
xbps-query -Rs search-term
```

`-R` searches remote repositories. Without `-R`, it only searches locally installed packages.

### Search locally installed packages

```bash
xbps-query -s pattern
```

### Get detailed info about a package

```bash
xbps-query -R package-name      # from repo
xbps-query package-name         # if installed
```

### List all installed packages

```bash
xbps-query -l
```

### Find which package provides a specific file

```bash
xbps-query -Ro /usr/bin/filename
```

### List files provided by an installed package

```bash
xbps-query -f package-name
```

---

## Non-Free and Multilib Repositories

Void Linux only includes free software by default. To enable non-free software:

```bash
sudo xbps-install -S void-repo-nonfree
sudo xbps-install -S
```

For 32-bit compatibility on 64-bit systems:

```bash
sudo xbps-install -S void-repo-multilib
sudo xbps-install -S void-repo-multilib-nonfree
```

List all active repositories:

```bash
xbps-query -L
```

---

## Holding Packages (Prevent Updates)

To prevent a package from being updated:

```bash
sudo xbps-pkgdb -m hold package-name
```

To remove the hold:

```bash
sudo xbps-pkgdb -m unhold package-name
```

---

## Fixing and Maintaining

### Check package database integrity

```bash
sudo xbps-pkgdb -a
```

### Reconfigure a package (useful after config file changes)

```bash
sudo xbps-reconfigure -f package-name
```

### Find processes using outdated binaries after an update

XBPS does not restart services when they are updated. Use `xcheckrestart` from the `xtools` package to find processes running different versions than what is on disk:

```bash
sudo xbps-install -S xtools
xcheckrestart
```

Any process listed needs a restart to use the updated version.

---

## xlocate — Find Files Across All Packages

`xlocate` works like `locate`, but for files in the Void package repositories. Install `xtools` to get it:

```bash
sudo xbps-install -S xtools
xlocate -S                    # Update the xlocate database
xlocate filename-or-pattern   # Find which package provides a file
```

---

## Kernel Management

Old kernels are not removed automatically when new ones are installed — this is intentional to allow rollback. However, this will eventually fill up `/boot`. Remove old kernels with `vkpurge`:

```bash
vkpurge list                    # List removable kernels
sudo vkpurge rm all             # Remove all removable old kernels
sudo vkpurge rm 6.1.*           # Remove kernels matching a pattern
```

---

## Quick Reference

| Task | Command |
|---|---|
| Sync + upgrade all | `sudo xbps-install -Su` |
| Install a package | `sudo xbps-install -S pkg` |
| Install temporarily | `sudo xbps-install -A pkg` |
| Remove a package | `sudo xbps-remove pkg` |
| Remove + deps | `sudo xbps-remove -R pkg` |
| Remove orphans + cache | `sudo xbps-remove -Oo` |
| Search repos | `xbps-query -Rs term` |
| Search installed | `xbps-query -s term` |
| Package info | `xbps-query -R pkg` |
| List installed | `xbps-query -l` |
| List repos | `xbps-query -L` |
| Hold package | `sudo xbps-pkgdb -m hold pkg` |
| Check integrity | `sudo xbps-pkgdb -a` |
| Find file in repos | `xlocate filename` |
| Find what owns file | `xbps-query -Ro /path/to/file` |
