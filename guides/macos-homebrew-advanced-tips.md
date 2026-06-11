---
layout: default
title: "Homebrew Advanced Tips and Troubleshooting"
parent: "macOS"
nav_order: 34
---

# Homebrew Advanced Tips and Troubleshooting

---

## Pin a Package Version

Prevent a package from upgrading:

```bash
brew pin package-name       # pin current version
brew unpin package-name     # allow upgrades again
brew list --pinned          # see pinned packages
```

---

## Install a Specific Version

```bash
# Search for available versions
brew search python

# Install a specific formula version
brew install python@3.11

# Switch active version (for packages that support it)
brew unlink python@3.12
brew link python@3.11
```

---

## Install from a URL (Older Formula)

```bash
brew install https://raw.githubusercontent.com/Homebrew/homebrew-core/COMMIT_HASH/Formula/package.rb
```

---

## Diagnose Problems

```bash
brew doctor              # check for issues
brew config              # Homebrew configuration info
brew --env               # environment variables Homebrew uses
```

---

## Clean Up Disk Space

```bash
brew cleanup             # remove old versions and cache
brew cleanup --dry-run   # see what would be removed
brew cleanup -s          # also remove cached downloads
du -sh $(brew --cache)   # see how much cache is using
```

---

## Useful Homebrew Commands

```bash
brew list                # all installed packages
brew list --casks        # installed casks only
brew list --formulae     # installed formulae only
brew leaves              # packages not required by anything else
brew deps package        # dependencies of a package
brew uses --installed package  # what depends on this package
brew info package        # info, version, options
brew home package        # open package homepage
```

---

## Tap a Third-Party Repository

```bash
brew tap user/repo
brew install user/repo/package

# List active taps
brew tap

# Remove a tap
brew untap user/repo
```

---

## Fix "Permission denied" Errors

```bash
# Fix Homebrew directory permissions
sudo chown -R $(whoami) /opt/homebrew    # Apple Silicon
sudo chown -R $(whoami) /usr/local       # Intel Mac

# Or just reinstall Homebrew
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
```

---

## Update Homebrew Itself

```bash
brew update             # fetch latest package info
brew upgrade            # upgrade all packages
brew upgrade package    # upgrade specific package
```

---

## Services (Background Daemons)

```bash
brew services list           # all managed services
brew services start nginx    # start service
brew services stop nginx     # stop service
brew services restart nginx  # restart service
brew services run nginx      # start without autostart on login
```
