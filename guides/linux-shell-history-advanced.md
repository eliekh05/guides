---
layout: default
title: "Advanced Shell History in bash and zsh"
parent: "Linux"
nav_order: 44
---

# Advanced Shell History in bash and zsh

The shell history is more powerful than most people know.

---

## History Configuration

Add to `~/.bashrc` or `~/.zshrc`:

```bash
# Size
HISTSIZE=100000           # in-memory history
HISTFILESIZE=100000       # file history (bash)
SAVEHIST=100000           # file history (zsh)

# Location
HISTFILE=~/.zsh_history   # zsh
# bash uses ~/.bash_history by default

# Remove duplicates
HISTCONTROL=ignoreboth    # bash: ignore duplicates and lines starting with space
setopt HIST_IGNORE_DUPS   # zsh
setopt HIST_IGNORE_SPACE  # zsh: ignore commands starting with space

# Share history between sessions (zsh)
setopt SHARE_HISTORY

# Add timestamps
HISTTIMEFORMAT="%Y-%m-%d %H:%M:%S "  # bash
setopt EXTENDED_HISTORY               # zsh: saves timestamps
```

---

## Search History

```bash
# Interactive search (Ctrl+R)
# Type a substring, it finds the most recent match
# Press Ctrl+R again for the next match

# Non-interactive search
history | grep "docker"
history | grep "git push"

# Show all git commands from last session
history | grep "^git" | tail -20

# Show commands with timestamps (after HISTTIMEFORMAT set)
history | head -20
```

---

## History Expansion

```bash
!!             # repeat last command
sudo !!        # run last command with sudo
!git           # repeat last command starting with "git"
!42            # repeat command number 42
!?search?      # repeat last command containing "search"
!^             # first argument of last command
!$             # last argument of last command
!:2            # second argument of last command
^old^new       # replace "old" with "new" in last command
```

---

## atuin — Supercharged History

atuin replaces shell history with a SQLite database, adding sync across machines and better search:

```bash
curl --proto '=https' --tlsv1.2 -LsSf https://setup.atuin.sh | sh

# Bind Ctrl+R to atuin (in ~/.zshrc or ~/.bashrc)
eval "$(atuin init zsh)"    # zsh
eval "$(atuin init bash)"   # bash
```

Features:
- Full-text search
- Filter by directory, exit code, hostname
- Sync history across machines
- Import existing history

---

## Delete Specific History Entries

```bash
# Bash: delete line N from history
history -d 123

# Remove all lines matching pattern
history | grep "secret" | awk '{print $1}' | xargs -I {} history -d {}

# Zsh: interactively edit history
fc -W; nano ~/.zsh_history; fc -R

# Clear all history
history -c        # bash (current session)
rm ~/.bash_history  # bash (file)
rm ~/.zsh_history   # zsh
```
