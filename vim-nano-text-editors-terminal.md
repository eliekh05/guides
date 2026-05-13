---
layout: default
title: "vim and nano — Terminal Text Editors"
parent: "macOS & Linux"
nav_order: 35
---

# vim and nano — Terminal Text Editors

Two text editors you will encounter in Terminal. nano is simple and beginner-friendly. vim is powerful but has a learning curve — mainly relevant because it is the default editor on many systems and knowing how to exit it is essential.

---

## nano — The Simple One

Open or create a file:
```bash
nano filename.txt
nano /etc/hosts          # with sudo if needed: sudo nano /etc/hosts
```

### Keyboard shortcuts

| Action | Shortcut |
|---|---|
| Save | Ctrl + O, then Enter |
| Exit | Ctrl + X |
| Save and exit | Ctrl + O → Enter → Ctrl + X |
| Search | Ctrl + W |
| Search and replace | Ctrl + \\ |
| Cut line | Ctrl + K |
| Paste | Ctrl + U |
| Go to line number | Ctrl + _ |
| Undo | Alt + U |
| Select all | Alt + A |

Shortcuts are shown at the bottom of the nano screen. `^` means Ctrl, `M-` means Alt.

---

## vim — The Powerful One

### The most important thing: how to exit

If you accidentally opened vim, press `Esc` then type:
- `:q` — quit (if no changes)
- `:q!` — force quit without saving
- `:wq` — save and quit
- `:x` — save and quit (same as :wq)
- `ZZ` — save and quit (shortcut)

### Modes

vim has three main modes:
- **Normal mode** — navigate and give commands (default when you open vim)
- **Insert mode** — type text
- **Command mode** — run commands (`:` commands)

Press `i` to enter Insert mode. Press `Esc` to return to Normal mode.

### Basic navigation (Normal mode)

```
h, j, k, l     left, down, up, right (or arrow keys)
w               jump forward one word
b               jump back one word
0               go to start of line
$               go to end of line
gg              go to first line
G               go to last line
:42             go to line 42
Ctrl+d          scroll down half page
Ctrl+u          scroll up half page
```

### Editing (Normal mode)

```
i               insert before cursor
a               insert after cursor
o               open new line below and insert
dd              delete current line
yy              copy (yank) current line
p               paste after cursor
u               undo
Ctrl+r          redo
x               delete character under cursor
```

### Search in vim

```
/pattern        search forward
?pattern        search backward
n               next match
N               previous match
```

### Save and quit commands

```
:w              save
:wq             save and quit
:q!             quit without saving
:%s/old/new/g   replace all occurrences of "old" with "new"
```

---

## Change the Default Editor

Many tools use `$EDITOR`. Set it to nano if you keep accidentally getting vim:

```bash
echo 'export EDITOR="nano"' >> ~/.zprofile
echo 'export VISUAL="nano"' >> ~/.zprofile
source ~/.zprofile
```

For git specifically:
```bash
git config --global core.editor "nano"
```

For `visudo` (change the sudo editor):
```bash
sudo update-alternatives --config editor   # Ubuntu/Debian
```
