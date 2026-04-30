---
layout: default
title: "Show Hidden Files and Folders on macOS"
parent: "macOS & Linux"
nav_order: 9
---

# Show Hidden Files and Folders on macOS

Files and folders whose names start with a `.` are hidden by default on macOS. System files, configuration files, and developer tools like `.ssh`, `.zshrc`, and `.DS_Store` are all hidden this way. Here are all the ways to reveal them.

---

## In Finder — Keyboard Shortcut (Quickest)

Press **Command (⌘) + Shift + .** (period) while a Finder window is open.

Hidden files and folders will appear greyed out. Press the same shortcut again to hide them.

This is a toggle — works instantly with no settings to change.

---

## In Finder — Make Hidden Files Permanently Visible

If you want hidden files always visible without pressing the shortcut every time:

1. Open **Terminal** (Applications → Utilities → Terminal).
2. Run:
   ```bash
   defaults write com.apple.Finder AppleShowAllFiles true
   killall Finder
   ```
3. Finder will restart and show all hidden files from now on.

To hide them again:
```bash
defaults write com.apple.Finder AppleShowAllFiles false
killall Finder
```

---

## In Terminal — Show Hidden Files in a Folder Listing

The `ls` command hides dotfiles by default. Add the `-a` flag to show everything:

```bash
ls -a ~/
```

To also show details (permissions, size, dates):
```bash
ls -la ~/
```

Common hidden folders you will see:
- `.ssh` — SSH keys and config
- `.zshrc` / `.bash_profile` — shell configuration
- `.DS_Store` — Finder metadata (safe to ignore)
- `.Trash` — deleted files
- `.config` — app config files

---

## Access the Hidden ~/Library Folder

The `~/Library` folder is hidden by default but is not a dotfile — it needs a different method.

**In Finder:**
Hold **Option (⌥)** and click the **Go** menu in the menu bar. **Library** appears as an option while Option is held.

**In Terminal:**
```bash
open ~/Library
```

**Make it permanently visible:**
```bash
chflags nohidden ~/Library
```

To hide it again:
```bash
chflags hidden ~/Library
```

---

## In the Open/Save Dialog (In Any App)

When any open or save dialog is open, press **Command + Shift + .** to toggle hidden files — the same shortcut as in Finder. Useful when you need to navigate to a hidden folder while saving a file.

---

## Show System Files (Beyond Just Dotfiles)

macOS also hides system-level files using a different mechanism. To show everything including those:

```bash
defaults write com.apple.Finder AppleShowAllFiles true
defaults write NSGlobalDomain AppleShowAllExtensions true
killall Finder
```

> **Note:** Revealing system files shows a lot of things you should not modify. Only do this if you know what you are looking for.
