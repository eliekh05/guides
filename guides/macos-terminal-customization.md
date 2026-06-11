---
layout: default
title: "Customize the macOS Terminal — Colors, Fonts, Prompt"
parent: "macOS"
nav_order: 39
---

# Customize the macOS Terminal — Colors, Fonts, Prompt

---

## Change the Terminal Theme

**Terminal app:**
Terminal → Settings → Profiles tab. Click the **+** to add a new profile or select one of the built-in themes. Popular ones: Pro, Homebrew, Ocean.

**iTerm2:**
Preferences → Profiles → Colors. Import a colour scheme from [iterm2colorschemes.com](https://iterm2colorschemes.com/).

---

## Install a Better Font

Fonts with ligatures and icons make the terminal look significantly better.

```bash
# JetBrains Mono — clean, popular
brew install --cask font-jetbrains-mono

# Fira Code — ligatures for code
brew install --cask font-fira-code

# Meslo Nerd Font — icons for Oh My Zsh/Powerlevel10k
brew install --cask font-meslo-lg-nerd-font
```

Set the font in Terminal: Settings → Profiles → Text → Font.

---

## Customize the Shell Prompt (Without Oh My Zsh)

The prompt is controlled by `PS1` (bash) or `PROMPT` (zsh).

Add to `~/.zshrc`:

```bash
# Simple coloured prompt: username @ hostname : directory $
PROMPT="%F{cyan}%n%f@%F{green}%m%f:%F{yellow}%~%f $ "

# With git branch
autoload -Uz vcs_info
precmd() { vcs_info }
zstyle ':vcs_info:git:*' formats ' (%b)'
PROMPT="%F{cyan}%n%f:%F{yellow}%~%f%F{magenta}${vcs_info_msg_0_}%f $ "
```

zsh prompt codes: `%n` = username, `%m` = hostname, `%~` = path, `%F{color}` = foreground colour, `%f` = reset colour.

---

## Aliases for a Better Experience

Add to `~/.zshrc`:

```bash
# Better ls
alias ls='ls -G'                  # colorized
alias ll='ls -lah'                # long format, human sizes, hidden files
alias la='ls -A'                  # show hidden, not . and ..

# Easier navigation
alias ..='cd ..'
alias ...='cd ../..'
alias ~='cd ~'

# Quick edit config files
alias zshrc='nano ~/.zshrc && source ~/.zshrc'

# Confirm before dangerous operations
alias rm='rm -i'
alias cp='cp -i'
alias mv='mv -i'

# Show PATH one per line
alias path='echo $PATH | tr ":" "\n"'
```

---

## Use lsd or eza Instead of ls

Modern alternatives to `ls` with icons and colors:

```bash
brew install lsd     # ls with icons
# or
brew install eza     # maintained replacement for exa

# In ~/.zshrc:
alias ls='lsd'
alias ll='lsd -lah'
alias lt='lsd --tree'
```

---

## Add Syntax Highlighting to Less

```bash
brew install source-highlight

# In ~/.zshrc:
export LESSOPEN="| /opt/homebrew/bin/src-hilite-lesspipe.sh %s"
export LESS="-R"
```

Now `less file.py` shows syntax-highlighted Python.

---

## iTerm2 Specific Features

**Split panes:** Cmd+D (vertical), Cmd+Shift+D (horizontal)
**Tab management:** Cmd+T (new tab), Cmd+Option+Arrow (move between panes)
**Instant replay:** Cmd+Option+B — rewind terminal output like a video
**Broadcast input:** type in one pane and all panes receive it (useful for multiple servers)
