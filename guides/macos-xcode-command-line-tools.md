---
layout: default
title: "Xcode Command Line Tools — Install and Manage"
parent: "macOS"
nav_order: 46
---

# Xcode Command Line Tools — Install and Manage

Xcode Command Line Tools (CLT) provides compilers, Git, and developer tools without installing the full Xcode app (which is 15GB+). Required for Homebrew and many developer tools.

---

## Install

```bash
xcode-select --install
```

A dialog appears. Click **Install**. Download takes 5–15 minutes depending on internet speed.

---

## Verify Installation

```bash
xcode-select -p
# Should print: /Library/Developer/CommandLineTools

gcc --version
git --version
clang --version
```

---

## Install Full Xcode Instead

If you develop iOS/macOS apps or need the full SDK:

1. App Store → search "Xcode" → Get
2. Or: `xcode-select --install` then accept the license

After installing full Xcode, run:
```bash
sudo xcode-select --switch /Applications/Xcode.app/Contents/Developer
sudo xcodebuild -license accept
```

---

## Update Command Line Tools

CLT updates appear in:
**System Settings → General → Software Update**

Or via Terminal:
```bash
softwareupdate --list | grep "Command Line"
softwareupdate -i "Command Line Tools for Xcode-15.x"
```

---

## Switch Between CLT and Full Xcode

```bash
# Use Command Line Tools only
sudo xcode-select --switch /Library/Developer/CommandLineTools

# Use full Xcode
sudo xcode-select --switch /Applications/Xcode.app/Contents/Developer

# Check current
xcode-select -p
```

---

## Fix: "Invalid active developer path" Error

If you get this error after a macOS update:

```bash
sudo xcode-select --reset
# or
xcode-select --install
```

---

## Fix: Git "xcrun: error"

```bash
xcode-select --install
sudo xcode-select --reset
```

---

## Check Version

```bash
pkgutil --pkg-info=com.apple.pkg.CLTools_Executables | grep version
```

---

## Uninstall

```bash
sudo rm -rf /Library/Developer/CommandLineTools
```

Then reinstall with `xcode-select --install` if needed.
