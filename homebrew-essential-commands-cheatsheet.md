---
layout: default
title: "Homebrew Essential Commands Cheatsheet"
parent: "Package Managers (All OSes)"
nav_order: 4
---

# Homebrew Essential Commands Cheatsheet

A complete reference for the Homebrew commands you actually use day to day — installing, updating, fixing, and managing packages. All commands work on both macOS and Linux.

---

## Installing and Removing

```bash
# Install a package (formula)
brew install wget

# Install a macOS app (cask)
brew install --cask firefox

# Uninstall a package
brew uninstall wget

# Uninstall a package and all its dependencies
brew uninstall --force wget

# Reinstall a broken or corrupt package
brew reinstall wget
```

---

## Searching

```bash
# Search for a package
brew search python

# Get detailed info about a package (version, dependencies, options)
brew info python

# Show what a package depends on
brew deps python

# Show what packages depend on a specific package
brew uses --installed python
```

---

## Updating and Upgrading

```bash
# Update Homebrew and the list of available packages
brew update

# Upgrade all installed packages to latest versions
brew upgrade

# Upgrade a specific package only
brew upgrade wget

# See what packages are outdated before upgrading
brew outdated

# Prevent a package from being upgraded
brew pin wget

# Allow a pinned package to be upgraded again
brew unpin wget
```

---

## Checking and Fixing

```bash
# Check for problems in your Homebrew installation
brew doctor

# Check if a specific package is properly linked
brew link --check wget

# Fix broken links for a package
brew link wget

# Fix broken links, overwriting any conflicts
brew link --overwrite wget

# Unlink a package (make it unavailable without uninstalling)
brew unlink wget
```

---

## Cleaning Up

```bash
# Remove old versions of installed packages (safe to run regularly)
brew cleanup

# See what would be removed before actually cleaning
brew cleanup --dry-run

# Remove everything cleanup would remove, including cached downloads
brew cleanup -s

# Remove all cached downloads
rm -rf $(brew --cache)
```

---

## Listing and Inspecting

```bash
# List all installed formulas
brew list

# List all installed casks
brew list --cask

# List installed packages with their versions
brew list --versions

# See where a package is installed
brew --prefix wget

# See where the Homebrew bin directory is
brew --prefix

# Show the full dependency tree of a package
brew deps --tree wget
```

---

## Services (Background Processes)

Some Homebrew packages run as background services (databases, web servers, etc.):

```bash
# List all services and their status
brew services list

# Start a service
brew services start postgresql

# Stop a service
brew services stop postgresql

# Restart a service
brew services restart postgresql

# Start a service now and also on login
brew services start --now postgresql
```

---

## Taps (Third-Party Repositories)

```bash
# Add a third-party repository
brew tap hashicorp/tap

# Install a formula from a tap
brew install hashicorp/tap/terraform

# List all taps
brew tap

# Remove a tap
brew untap hashicorp/tap
```

---

## Troubleshooting Quick Commands

```bash
# Reinstall Xcode Command Line Tools (after macOS updates)
xcode-select --install

# Reset Homebrew to a clean state
brew update-reset

# Force update everything
brew update && brew upgrade && brew cleanup

# Check what is using a port (e.g. port 5432 for PostgreSQL)
lsof -i :5432

# Export all installed packages to a file
brew bundle dump --file=~/Brewfile

# Install all packages from a Brewfile
brew bundle install --file=~/Brewfile
```

---

## Brewfile — Save and Restore Your Packages

A Brewfile is a list of all your Homebrew packages that you can use to quickly set up a new Mac identically.

**Generate a Brewfile from your current install:**
```bash
brew bundle dump --file=~/Brewfile
```

**Install everything from a Brewfile on a new Mac:**
```bash
brew bundle install --file=~/Brewfile
```

**Check which Brewfile packages are not currently installed:**
```bash
brew bundle check --file=~/Brewfile
```
