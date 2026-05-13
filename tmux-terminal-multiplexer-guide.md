---
layout: default
title: "tmux — Terminal Multiplexer Guide"
parent: "macOS & Linux"
nav_order: 30
---

# tmux — Terminal Multiplexer Guide

tmux lets you split your terminal into panes, run multiple sessions at once, and keep sessions running after you disconnect from SSH. Essential for server work.

---

## Install

```bash
sudo apt install tmux -y     # Ubuntu/Debian
sudo dnf install tmux -y     # Fedora
sudo pacman -S tmux          # Arch
brew install tmux            # macOS
```

---

## The Prefix Key

tmux uses a **prefix key** before every command. Default is **Ctrl+B**. Press it, release, then press the command key.

Throughout this guide: `prefix` = Ctrl+B

---

## Sessions

```bash
tmux                              # start new unnamed session
tmux new -s mysession             # start named session
tmux ls                           # list sessions
tmux attach -t mysession          # attach to a session
tmux attach                       # attach to last session
tmux kill-session -t mysession    # kill a session
```

**Inside tmux:**
- `prefix d` — detach (session keeps running in background)
- `prefix $` — rename current session
- `prefix s` — list and switch sessions

---

## Windows (Tabs)

- `prefix c` — create new window
- `prefix ,` — rename current window
- `prefix n` — next window
- `prefix p` — previous window
- `prefix 0-9` — switch to window by number
- `prefix &` — kill current window
- `prefix w` — list all windows

---

## Panes (Split Screen)

- `prefix %` — split vertically (side by side)
- `prefix "` — split horizontally (top and bottom)
- `prefix arrow keys` — move between panes
- `prefix z` — zoom current pane (toggle fullscreen)
- `prefix x` — kill current pane
- `prefix !` — break pane into its own window
- `prefix {` / `prefix }` — swap pane left/right
- `prefix q` — show pane numbers briefly

**Resize panes:**
- `prefix Ctrl+arrow` — resize in arrow direction

---

## Copy Mode (Scroll)

- `prefix [` — enter copy mode (can scroll up with arrow keys or PageUp)
- `q` — exit copy mode
- In copy mode: space to start selection, enter to copy
- `prefix ]` — paste copied text

---

## Useful Shortcuts Reference

| Action | Shortcut |
|---|---|
| New window | `prefix c` |
| Split vertical | `prefix %` |
| Split horizontal | `prefix "` |
| Switch pane | `prefix arrow` |
| Detach session | `prefix d` |
| List sessions | `prefix s` |
| Zoom pane | `prefix z` |
| Kill pane | `prefix x` |
| Scroll mode | `prefix [` |

---

## ~/.tmux.conf (Useful Config)

```bash
nano ~/.tmux.conf
```

```
# Change prefix to Ctrl+A (screen-style)
unbind C-b
set-option -g prefix C-a
bind-key C-a send-prefix

# Enable mouse support
set -g mouse on

# Start windows and panes at 1 not 0
set -g base-index 1
setw -g pane-base-index 1

# Increase history
set -g history-limit 10000

# Easy pane splitting with | and -
bind | split-window -h
bind - split-window -v

# Reload config
bind r source-file ~/.tmux.conf \; display "Reloaded"
```

Apply changes without restarting:
```bash
tmux source-file ~/.tmux.conf
# or inside tmux: prefix r (if you added the bind above)
```

---

## Keep SSH Sessions Alive

The main reason to use tmux on a server: when your SSH connection drops, everything inside tmux keeps running. Reconnect and reattach:

```bash
ssh user@server
tmux attach
```

All your windows, panes, and running processes are exactly as you left them.
