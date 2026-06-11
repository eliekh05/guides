---
layout: default
title: "iTerm2 — Features You Should Be Using"
parent: "macOS"
nav_order: 47
---

# iTerm2 — Features You Should Be Using

iTerm2 is the best terminal emulator for macOS. Most people use only 10% of what it can do.

---

## Install

```bash
brew install --cask iterm2
```

---

## Split Panes

| Shortcut | Action |
|---|---|
| Cmd+D | Split vertically (side by side) |
| Cmd+Shift+D | Split horizontally (top/bottom) |
| Cmd+Option+Arrow | Navigate between panes |
| Cmd+Shift+Enter | Maximise/restore current pane |
| Cmd+W | Close pane or tab |

---

## Profiles — Multiple Appearances

Create different profiles for different contexts (work server, personal server, local terminal):

**Preferences → Profiles → + (new profile)**

Assign:
- Different background colour
- Different font
- Custom working directory
- SSH command to auto-connect

Then open any profile: **Profiles → (profile name)** or set a keyboard shortcut.

---

## Triggers — React to Terminal Output

Triggers fire when text matching a pattern appears. Useful for alerts on error messages:

**Preferences → Profiles → Advanced → Triggers → + (add)**

Examples:
- Pattern: `ERROR` → Action: **Bounce Dock Icon** or **Send Notification**
- Pattern: `Build succeeded` → Action: **Notify**
- Pattern: `\$ ` → Action: **Set Title to "idle"**

---

## Password Manager

Store SSH passwords (for servers that do not support keys):

**Window → Password Manager** → + → add server and password

When you need it: **Window → Password Manager** → click password → it types automatically.

---

## Shell Integration

Install iTerm2 shell integration to unlock:
- Click to jump between command outputs
- ⌘⇧↑/↓ to navigate between prompts
- Drag and drop status bar widgets
- See each command's exit code

```bash
curl -L https://iterm2.com/shell_integration/install_shell_integration.sh | bash
source ~/.iterm2_shell_integration.bash   # or .zsh
```

---

## Instant Replay

**Cmd+Option+B** — replay terminal output like a video. Scrub back through what happened even without scrollback.

---

## Command History

**Cmd+Shift+;** — opens a searchable popup of recent commands. Different from shell history — it shows commands across all panes.

---

## Coprocess — Background Commands

Run a command whose input/output is piped to the terminal:

**Shell → Run Coprocess** — useful for logging sessions or piping output.

---

## Find with Regex

**Cmd+F** opens find. Enable regex by clicking the icon in the find bar. Matches are highlighted and can be copied.

---

## tmux Integration

```bash
# Start tmux inside iTerm2 with native pane integration
tmux -CC new
# or attach to existing:
tmux -CC attach
```

Tmux panes appear as native iTerm2 panes that you can resize with the mouse.
