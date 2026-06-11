---
layout: default
title: "macOS Terminal Keyboard Shortcuts"
parent: "macOS"
nav_order: 43
---

# macOS Terminal Keyboard Shortcuts

---

## Cursor Movement

| Shortcut | Action |
|---|---|
| **Ctrl + A** | Move cursor to beginning of line |
| **Ctrl + E** | Move cursor to end of line |
| **Ctrl + F** | Move forward one character |
| **Ctrl + B** | Move backward one character |
| **Alt + F** | Move forward one word |
| **Alt + B** | Move backward one word |

---

## Editing

| Shortcut | Action |
|---|---|
| **Ctrl + D** | Delete character under cursor |
| **Ctrl + H** | Delete character before cursor (backspace) |
| **Ctrl + K** | Delete from cursor to end of line |
| **Ctrl + U** | Delete from cursor to beginning of line |
| **Ctrl + W** | Delete word before cursor |
| **Alt + D** | Delete word after cursor |
| **Ctrl + Y** | Paste last deleted text |
| **Ctrl + T** | Transpose two characters |

---

## History

| Shortcut | Action |
|---|---|
| **Ctrl + P** or **↑** | Previous command |
| **Ctrl + N** or **↓** | Next command |
| **Ctrl + R** | Search backward through history |
| **Ctrl + G** | Cancel history search |
| **!!** | Repeat last command |
| **!string** | Repeat last command starting with "string" |
| **!$** | Last argument of previous command |

---

## Control

| Shortcut | Action |
|---|---|
| **Ctrl + C** | Cancel current command |
| **Ctrl + Z** | Suspend current command (resume with `fg`) |
| **Ctrl + D** | Exit shell (when line is empty) |
| **Ctrl + L** | Clear screen |
| **Ctrl + S** | Pause output (freeze terminal) |
| **Ctrl + Q** | Resume output (unfreeze terminal) |

---

## Terminal App (macOS)

| Shortcut | Action |
|---|---|
| **Cmd + T** | New tab |
| **Cmd + W** | Close tab |
| **Cmd + N** | New window |
| **Cmd + Shift + ]** | Next tab |
| **Cmd + Shift + [** | Previous tab |
| **Cmd + K** | Clear to start (harder clear) |
| **Cmd + +** / **Cmd + -** | Increase/decrease font size |
| **Cmd + 0** | Reset font size |
| **Cmd + F** | Find in output |

---

## Useful Tricks

```bash
# Ctrl + R — search history interactively
# Type part of a command, keeps finding matches as you type
# Press Enter to run, Ctrl+G to cancel, Ctrl+R again for next match

# !$ — use last argument of previous command
ls /very/long/path/to/folder
cd !$                    # cd /very/long/path/to/folder

# !! — repeat last command
cat /etc/hosts
sudo !!                  # sudo cat /etc/hosts

# Alt + . — insert last argument of previous command
```
