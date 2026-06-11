---
layout: default
title: "Understanding .zshrc, .zprofile, and Shell Config Files on macOS"
parent: "macOS"
nav_order: 27
---

# Understanding .zshrc, .zprofile, and Shell Config Files on macOS

When you see instructions like `echo 'export PATH=...' >> ~/.zprofile` or `source ~/.zshrc` and have no idea what that means or what it did — this guide explains everything. What these files are, what they do, when they load, how to create them, how to edit them, and how to see what is already in them.

---

## What These Files Are

When you open Terminal, macOS runs the **zsh** shell (default since macOS Catalina). Before giving you a prompt, zsh reads a few text files to set up your environment — your PATH, aliases, prompts, and other settings. These are plain text files that live in your home folder.

The main ones:

| File | When it loads | What to put in it |
|---|---|---|
| `~/.zprofile` | Once, when a new terminal window opens | PATH, environment variables, version managers (pyenv, fnm, nvm) |
| `~/.zshrc` | Every time a new shell starts (including subshells) | Aliases, functions, prompt customisation, anything interactive |
| `~/.zshenv` | Every single time zsh runs (including scripts) | Rarely needed — only for variables scripts need |

<br>

> **Simple rule:** Put `export PATH=...` and tool setup lines in `~/.zprofile`. Put `alias` lines and functions in `~/.zshrc`.

> **On macOS specifically:** Every new terminal window is treated as a login shell, so both `.zprofile` and `.zshrc` load every time you open a terminal. In practice, both files work for most things — but following the convention above keeps things clean and avoids subtle bugs.

---

## The ~ Symbol

`~` means your **home folder** — the folder named after your username. So `~/.zprofile` means `/Users/yourname/.zprofile`.

These files start with a `.` which makes them **hidden** by default. They exist — you just cannot see them in Finder without pressing **Command + Shift + .** to show hidden files.

---

## Check What Files Already Exist

```bash
ls -la ~ | grep "\.z"
```

You might see `.zprofile`, `.zshrc`, `.zsh_history`, or none of these. That is fine — they are created the first time something writes to them, or you can create them manually.

---

## View What Is Already In a File

```bash
cat ~/.zprofile
cat ~/.zshrc
```

If the file does not exist, you will see `No such file or directory` — that is normal.

---

## Create or Edit These Files

Use `nano` — the simplest terminal text editor:

```bash
nano ~/.zprofile
```

If the file does not exist, nano creates it. Type your content, then:
- **Ctrl + O** → Enter to save
- **Ctrl + X** to exit

---

## Add Something to a File Without Opening It

The `>>` operator appends a line to a file (creates it if it does not exist):

```bash
echo 'export EDITOR="nano"' >> ~/.zprofile
```

This is what install scripts do when they say "run this command to add Homebrew to your PATH" — they are appending a line to your config file.

> **`>>` appends. `>` overwrites.** Always use `>>` when adding to a config file.

---

## Apply Changes Without Restarting Terminal

After editing a config file, reload it:

```bash
source ~/.zprofile
source ~/.zshrc
```

Or just open a new terminal window — it loads both files fresh.

---

## What Happens When Terminal Opens — Step by Step

1. You open Terminal or a new tab
2. zsh starts as a **login shell**
3. `/etc/zprofile` loads first (system-wide, you do not edit this)
4. `~/.zprofile` loads — your PATH and environment variables are set
5. `/etc/zshrc` loads (system-wide)
6. `~/.zshrc` loads — your aliases, functions, and prompt are set
7. You see the prompt and can type

This is why changes to `.zprofile` take effect in new terminal windows but not in the current one — the current window already ran through steps 1–7. `source ~/.zprofile` manually reruns step 4.

---

## Common Things People Add

### Add a folder to PATH (so commands in that folder work)

```bash
# In ~/.zprofile
export PATH="/usr/local/myapp/bin:$PATH"
```

The `:$PATH` at the end is critical — it appends your new folder to the existing PATH rather than replacing it entirely.

### Set a default text editor

```bash
# In ~/.zprofile
export EDITOR="nano"
export VISUAL="nano"
```

### Add Homebrew (Apple Silicon)

```bash
# In ~/.zprofile
eval "$(/opt/homebrew/bin/brew shellenv)"
```

### Add Homebrew (Intel Mac)

```bash
# In ~/.zprofile
eval "$(/usr/local/bin/brew shellenv)"
```

### Add an alias

```bash
# In ~/.zshrc
alias ll='ls -la'
alias gs='git status'
```

### Add a function

```bash
# In ~/.zshrc
mkcd() {
    mkdir -p "$1" && cd "$1"
}
```

---

## Terminal History

zsh saves every command you type to a history file so you can recall them later.

**The history file:** `~/.zsh_history`

**Navigate history in Terminal:**
- **Up arrow** — go back through previous commands one by one
- **Down arrow** — go forward
- **Ctrl + R** — search through history — type part of a command and it finds it
- `history` — print all saved history to the screen
- `history | grep brew` — search history for commands containing "brew"

**Make history better** — add to `~/.zshrc`:

```bash
# Save 10,000 commands instead of the default 500
HISTSIZE=10000
SAVEHIST=10000
HISTFILE=~/.zsh_history

# Share history across multiple terminal windows
setopt SHARE_HISTORY

# Do not save duplicate commands
setopt HIST_IGNORE_DUPS

# Do not save commands that start with a space (useful for passwords)
setopt HIST_IGNORE_SPACE
```

---

## View and Search History

```bash
# Print entire history
history

# Show last 20 commands
history | tail -20

# Search for a specific command
history | grep python

# Run a previous command by number
!42

# Run the last command that started with "git"
!git

# Show the last command without running it
!git:p
```

---

## Clear History

```bash
# Clear history for the current session
history -p

# Delete the history file entirely (permanent)
rm ~/.zsh_history
```

---

## The Complete Load Order (for Reference)

```
/etc/zshenv        ← system, always loads
~/.zshenv          ← yours, always loads (rarely used)
/etc/zprofile      ← system login config
~/.zprofile        ← your PATH and env vars ← EDIT THIS for PATH/tools
/etc/zshrc         ← system interactive config
~/.zshrc           ← your aliases/functions ← EDIT THIS for aliases
/etc/zlogin        ← system, after login
~/.zlogin          ← yours, rarely used
```

On macOS, every terminal window is a login shell — so this entire chain runs every time you open a new terminal window.
