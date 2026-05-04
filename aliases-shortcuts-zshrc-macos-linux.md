---
layout: default
title: "Aliases and Shortcuts in .zshrc (macOS and Linux)"
parent: "macOS & Linux"
nav_order: 20
---

# Aliases and Shortcuts in .zshrc (macOS and Linux)

Aliases let you type short commands instead of long ones. You define them in `~/.zshrc` (zsh, default on macOS) or `~/.bashrc` (bash, default on many Linux distros).

---

## Open Your Config File

```bash
nano ~/.zshrc       # macOS and zsh Linux
nano ~/.bashrc      # bash Linux
```

---

## Create an Alias

Basic syntax:
```bash
alias shortname='full command here'
```

Examples:
```bash
# Navigation
alias ..='cd ..'
alias ...='cd ../..'
alias home='cd ~'
alias desk='cd ~/Desktop'

# ls shortcuts
alias ll='ls -la'
alias la='ls -a'
alias l='ls -lh'

# Git shortcuts
alias gs='git status'
alias ga='git add .'
alias gc='git commit -m'
alias gp='git push'
alias gl='git log --oneline -10'
alias gpl='git pull'

# Safety nets
alias rm='rm -i'          # Ask before deleting
alias cp='cp -i'          # Ask before overwriting
alias mv='mv -i'          # Ask before overwriting

# Shortcuts for common tasks
alias update='sudo apt update && sudo apt upgrade -y'   # Linux
alias brewup='brew update && brew upgrade && brew cleanup'  # macOS
alias ip='curl ifconfig.me'       # Show public IP
alias localip='ipconfig getifaddr en0'  # macOS local IP

# Reload config without restarting terminal
alias reload='source ~/.zshrc'
```

---

## Apply Changes

After editing, reload:
```bash
source ~/.zshrc
```

---

## Create Functions (for Commands with Arguments)

Aliases do not take arguments cleanly. Use functions instead:

```bash
# Make a folder and cd into it at the same time
mkcd() {
    mkdir -p "$1" && cd "$1"
}

# Search for text in files
findtext() {
    grep -r "$1" .
}

# Extract any archive type
extract() {
    case "$1" in
        *.tar.gz)  tar -xzf "$1" ;;
        *.tar.bz2) tar -xjf "$1" ;;
        *.tar.xz)  tar -xJf "$1" ;;
        *.zip)     unzip "$1" ;;
        *.gz)      gunzip "$1" ;;
        *.7z)      7z x "$1" ;;
        *)         echo "Unknown format: $1" ;;
    esac
}

# Quick git commit with message
commit() {
    git add . && git commit -m "$1"
}
```

Usage:
```bash
mkcd new-project
extract archive.tar.gz
commit "fix login bug"
```

---

## Add to PATH

If a tool keeps saying "command not found" after install:

```bash
# Add a folder to PATH permanently
export PATH="$HOME/.local/bin:$PATH"
export PATH="/opt/homebrew/bin:$PATH"    # macOS Apple Silicon
```

---

## Useful Environment Variables

```bash
# Set default text editor
export EDITOR="nano"
export VISUAL="nano"

# Colourful ls output
export CLICOLOR=1
export LSCOLORS=GxFxCxDxBxegedabagaced

# Increase history size
export HISTSIZE=10000
export HISTFILESIZE=10000
```

---

## View All Active Aliases

```bash
alias
```

---

## Remove an Alias for Current Session

```bash
unalias gs
```

To remove permanently, delete it from `~/.zshrc` and run `source ~/.zshrc`.
