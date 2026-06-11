---
layout: default
title: "Better Terminal Apps for macOS — iTerm2, Warp, Ghostty"
parent: "macOS"
nav_order: 47
---

# Better Terminal Apps for macOS — iTerm2, Warp, Ghostty

macOS Terminal.app works but has limitations. These are the alternatives worth considering.

---

## iTerm2 — The Classic Choice

**Download:** [iterm2.com](https://iterm2.com)
**Cost:** Free

The most feature-complete Terminal replacement for macOS. Has been the default choice for developers for years.

**Features that matter:**
- Split panes — divide the window horizontally and vertically
- Tab support with customizable colors and badges
- Search through scrollback with regex
- Trigger system — run actions when output matches a pattern
- Instant replay — replay terminal output like a video
- Shell integration — shows current directory and command in the title bar
- tmux integration — works natively with tmux sessions
- Excellent font rendering and color support

**Install via Homebrew:**
```bash
brew install --cask iterm2
```

**Key shortcuts:**
- `Cmd+D` — split vertically
- `Cmd+Shift+D` — split horizontally
- `Cmd+Option+Arrow` — move between panes
- `Cmd+F` — search scrollback
- `Cmd+;` — autocomplete from history

---

## Warp — AI-Integrated Terminal

**Download:** [warp.dev](https://www.warp.dev)
**Cost:** Free (Warp Basic), $15/month (Warp AI with full features)

A newer terminal built in Rust with GPU rendering and built-in AI assistance. The main differentiator is that commands and their output are treated as blocks — you can select, copy, and share entire command-output pairs.

**Features:**
- AI command suggestions (type what you want to do, get the command)
- Input editor at the bottom — edit commands like a proper text editor
- Command blocks — select and share entire command+output sections
- Built-in workflows — save and share multi-step commands
- Very fast rendering
- Works with existing shells (zsh, bash, fish)

**Install:**
```bash
brew install --cask warp
```

---

## Ghostty — Fast and Modern

**Download:** [ghostty.org](https://ghostty.org)
**Cost:** Free, open-source

A newer terminal emulator by Mitchell Hashimoto (creator of Vagrant and Terraform). Written in Zig, native on macOS (and Linux), extremely fast, minimal dependencies.

**Features:**
- Very fast — GPU-accelerated rendering
- Native macOS look and feel
- Split panes
- Multiple windows and tabs
- Clean default config — works well out of the box
- Small binary, fast startup

**Install:**
```bash
brew install --cask ghostty
```

---

## Which One to Choose

| | iTerm2 | Warp | Ghostty |
|---|---|---|---|
| Speed | Good | Very good | Excellent |
| AI features | No | Yes | No |
| Split panes | Yes | Yes | Yes |
| tmux integration | Excellent | Basic | Basic |
| Customization | Extensive | Moderate | Minimal |
| Best for | Power users, tmux users | AI-assisted workflows | Fast, minimal setup |
| macOS native look | No | No | Yes |

**If you use tmux heavily:** iTerm2
**If you want AI help with commands:** Warp
**If you want fast and minimal:** Ghostty
**If you are happy with Terminal.app:** stay there

---

## Oh My Zsh — Enhance Any Terminal

Regardless of which terminal app you use, Oh My Zsh adds themes, plugins, and autocompletion:

```bash
sh -c "$(curl -fsSL https://raw.githubusercontent.com/ohmyzsh/ohmyzsh/master/tools/install.sh)"
```

Popular plugins to add in `~/.zshrc`:
```bash
plugins=(git brew macos sudo zsh-autosuggestions zsh-syntax-highlighting)
```

Install community plugins:
```bash
brew install zsh-autosuggestions zsh-syntax-highlighting
```
