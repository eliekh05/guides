---
layout: default
title: "Install and Use Homebrew on Linux"
parent: "Package Managers (All OSes)"
nav_order: 7
---

# Install and Use Homebrew on Linux

Homebrew is not just for macOS — it works on Linux too and gives you access to thousands of packages that may not be in your distro's official repositories, or gives you newer versions than `apt` or `dnf` provides. It runs entirely in your home directory so it never conflicts with system packages and does not require root.

---

## Why Use Homebrew on Linux?

- Get newer versions of tools than your distro ships (newer Git, Python, Node, etc.)
- Access packages not available in your distro's repos
- Installs to `~/.linuxbrew` — no root required, no system conflicts
- Same commands on Linux and macOS — useful if you switch between both

---

## Requirements

- Linux (Ubuntu, Debian, Fedora, Arch, etc.)
- `bash` or `zsh`
- `curl` or `wget`
- `git`

---

## Step 1 — Install Dependencies

**Ubuntu / Debian:**
```bash
sudo apt update
sudo apt install build-essential curl git procps file -y
```

**Fedora / RHEL / CentOS:**
```bash
sudo dnf groupinstall "Development Tools"
sudo dnf install curl git procps-ng -y
```

**Arch Linux:**
```bash
sudo pacman -S base-devel curl git
```

---

## Step 2 — Install Homebrew

Run the official installer:

```bash
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
```

The installer will guide you through the process and tell you what to do. It does not require root for the installation itself — only for the dependencies step above.

---

## Step 3 — Add Homebrew to Your PATH

After installation, the installer will print two commands to run. They look like this:

```bash
echo 'eval "$(/home/linuxbrew/.linuxbrew/bin/brew shellenv)"' >> ~/.bashrc
eval "$(/home/linuxbrew/.linuxbrew/bin/brew shellenv)"
```

Copy and run the exact commands printed by your installer (they may differ slightly based on your username). Then reload your shell:

```bash
source ~/.bashrc
# or if using zsh:
source ~/.zshrc
```

Verify:
```bash
brew --version
```

---

## Step 4 — Install GCC (Recommended)

Homebrew on Linux works better with GCC installed:

```bash
brew install gcc
```

---

## Using Homebrew on Linux

All commands are identical to macOS:

```bash
# Install a package
brew install wget

# Update and upgrade
brew update && brew upgrade

# Search
brew search python

# Remove
brew uninstall wget

# Check for issues
brew doctor
```

---

## When to Use Homebrew vs apt/dnf/pacman

| Situation | Use |
|---|---|
| Installing system tools (nginx, postgresql as services) | `apt` / `dnf` / `pacman` |
| Need a newer version than your distro ships | Homebrew |
| Need a package not in your distro's repos | Homebrew |
| Installing developer tools (Node, Python, Go, Rust) | Homebrew or language-specific version managers |
| Setting up a consistent environment across Linux + macOS | Homebrew |

---

## Uninstall Homebrew on Linux

```bash
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/uninstall.sh)"
```

This removes Homebrew and everything installed through it cleanly.
