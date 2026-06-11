---
layout: default
title: "QuickLook Plugins for macOS"
parent: "macOS"
nav_order: 35
---

# QuickLook Plugins for macOS

QuickLook lets you preview files by pressing Space in Finder. By default it works for images, PDFs, and common documents. Plugins extend it to code files, archives, fonts, and more.

---

## Install via Homebrew

```bash
# Code files with syntax highlighting
brew install --cask qlcolorcode

# Markdown files
brew install --cask qlmarkdown

# Source code files
brew install --cask qlstephen       # plain text files without extension

# JSON files
brew install --cask quicklook-json

# .app directories
brew install --cask apparency

# Zip/archive contents
brew install --cask betterzip       # paid, but best
brew install --cask suspicious-package  # .pkg installer contents

# CSV files
brew install --cask quicklook-csv

# WebP images
brew install --cask webpquicklook

# Fonts
brew install --cask qlimagesize     # image size and resolution
```

---

## After Installing

On macOS Catalina and later, run:

```bash
qlmanage -r        # reset QuickLook manager
qlmanage -r cache  # clear QuickLook cache
```

If plugins do not work: **System Settings → Privacy & Security → scroll down** — you may need to allow each plugin.

---

## macOS Ventura and Later — Security Requirement

Plugins must be explicitly allowed:

1. Install the plugin
2. Press Space on a file it should handle
3. When it does not work, check System Settings → Privacy & Security for a prompt to allow the extension
4. Allow it

---

## Manual Installation

Some plugins are `.qlgenerator` files. Install by placing them in:
```
~/Library/QuickLook/       # user only
/Library/QuickLook/        # all users (needs sudo)
```

Then run `qlmanage -r`.

---

## Useful Quick Look Shortcuts

| Shortcut | Action |
|---|---|
| **Space** | Open/close QuickLook |
| **Arrow keys** | Navigate to next/previous file |
| **Cmd + Enter** | Open file in default app |
| **Cmd + L** | Lock screen (while QuickLook open) |
| **Fullscreen button** | Expand to full screen |
