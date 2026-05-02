---
layout: default
title: "Take Screenshots on macOS and Linux"
parent: "macOS & Linux"
nav_order: 15
---

# Take Screenshots on macOS and Linux

---

## macOS

| Shortcut | What it captures |
|---|---|
| **Cmd + Shift + 3** | Entire screen |
| **Cmd + Shift + 4** | Drag to select an area |
| **Cmd + Shift + 4, then Space** | Click a window to capture just that window |
| **Cmd + Shift + 5** | Opens screenshot toolbar with all options + screen recording |

Adding **Ctrl** to any shortcut copies to clipboard instead of saving to Desktop.

Screenshots save to the Desktop as `.png` by default.

### Change the save location

Press **Cmd + Shift + 5** → click **Options** → **Other Location** → choose a folder.

---

## Linux (GNOME — Ubuntu, Fedora, Pop!_OS)

| Shortcut | What it captures |
|---|---|
| **Print Screen** | Entire screen |
| **Shift + Print Screen** | Drag to select area |
| **Alt + Print Screen** | Active window only |

Screenshots save to `~/Pictures/Screenshots/`.

### Install a more capable tool

```bash
sudo apt install flameshot -y   # Ubuntu/Debian
sudo dnf install flameshot -y   # Fedora
```

Run it:
```bash
flameshot gui
```

Flameshot lets you annotate, draw arrows, blur areas, and copy directly to clipboard — much better than the default tool.

---

## Linux (terminal — no GUI)

```bash
# Install scrot
sudo apt install scrot -y

# Full screen, saved to current folder
scrot screenshot.png

# 5-second delay then capture
scrot -d 5 screenshot.png

# Select area interactively
scrot -s screenshot.png
```