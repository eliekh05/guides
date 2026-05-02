---
layout: default
title: "Fix 'python: command not found' on macOS"
parent: "macOS & Linux"
nav_order: 13
---

# Fix "python: command not found" on macOS

Since macOS 12.3 (Monterey), typing `python` in Terminal gives `zsh: command not found: python`. Apple removed Python 2 entirely and did not create a `python` alias for Python 3. Every tutorial that says to type `python` is assuming an older Mac or Linux. This guide explains what actually happened and the right fix depending on what you are trying to do.

---

## Why This Happens

Apple shipped Python 2 as part of macOS until macOS 12.3 Monterey (released March 2022), when it was removed permanently. Python 3 is available but only as `python3`, not `python`. There is no `python` command by default.

Check what you actually have:

```bash
python3 --version
which python3
```

If this returns a version number, Python 3 is installed — you just need to use the right command or create an alias.

---

## Quick Fix — Use `python3` Instead of `python`

The simplest solution: just type `python3` instead of `python` whenever a guide or tutorial says `python`.

```bash
python3 myscript.py        # instead of: python myscript.py
python3 -m pip install X   # instead of: pip install X
```

For `pip`, use `pip3`:
```bash
pip3 install requests
```

This is the correct approach for one-off use.

---

## Fix — Create a Permanent `python` Alias (Quick)

If you want `python` to work the same as `python3` permanently:

```bash
echo 'alias python=python3' >> ~/.zprofile
echo 'alias pip=pip3' >> ~/.zprofile
source ~/.zprofile
```

Test:
```bash
python --version
```

> **Note:** This alias is convenient but not ideal for development projects. If you install multiple Python versions later, the alias always points to `python3` regardless of which version that resolves to. For serious development, use pyenv (below).

---

## Fix — Install Python Properly for Development (Recommended)

If you are writing code or installing packages, do not use the system Python at `/usr/bin/python3`. That version is Apple's internal copy and should not be modified. Install your own:

### Option A — From python.org (Simplest)

1. Go to [python.org/downloads/macos](https://www.python.org/downloads/macos/).
2. Download the latest macOS installer.
3. Run the `.pkg` file and follow the installer.
4. After installation, `python3` and `pip3` will work.

The installer also creates a `python3.12` (or current version) command.

### Option B — Via Homebrew

```bash
brew install python
```

After installation:
```bash
python3 --version  # shows Homebrew's Python
which python3      # shows /opt/homebrew/bin/python3
```

### Option C — Via pyenv (Best for Multiple Versions)

pyenv lets you install and switch between any Python version. See the **Manage Multiple Python and Node Versions** guide for full instructions.

```bash
brew install pyenv
pyenv install 3.12.4
pyenv global 3.12.4
```

After setup, `python` and `python3` both work.

---

## Fix — Reinstall Python After a macOS Update Broke It

macOS updates sometimes remove or break the Xcode Command Line Tools Python:

```bash
# Check if CLT Python exists
ls /usr/bin/python3

# Reinstall Xcode CLT (restores /usr/bin/python3)
xcode-select --install
```

If you had Python installed from python.org or Homebrew and it disappeared:

```bash
# Check all python3 locations
which -a python3

# Reinstall via Homebrew
brew reinstall python

# Or reinstall from python.org
# Download and run the installer again — it will replace the broken version
```

---

## Understand the Different Python Installations on macOS

This is where most confusion comes from. There can be several Python 3 installations on a Mac at once:

| Location | What it is | Should you use it? |
|---|---|---|
| `/usr/bin/python3` | Apple's system Python (Xcode CLT) | No — reserved for macOS tools |
| `/opt/homebrew/bin/python3` | Homebrew Python (Apple Silicon) | Yes — for general use |
| `/usr/local/bin/python3` | Homebrew Python (Intel Mac) | Yes — for general use |
| `/Library/Frameworks/Python.framework/...` | python.org installer | Yes — for general use |
| `~/.pyenv/shims/python3` | pyenv-managed Python | Yes — for development |

The `which python3` command shows which one is active in your PATH. If you have multiple and things are behaving unexpectedly:

```bash
which -a python3  # shows ALL installed python3 versions in PATH order
```

---

## Fix pip: command not found

Same root cause as `python`. The fix is identical:

```bash
# Use pip3 instead
pip3 install requests

# Or create an alias
echo 'alias pip=pip3' >> ~/.zprofile
source ~/.zprofile
```

If `pip3` is also missing:

```bash
# Install pip for the current Python
python3 -m ensurepip --upgrade

# Or upgrade if already installed
python3 -m pip install --upgrade pip
```

---

## Use Virtual Environments for Projects

Once you have Python working, always use virtual environments for projects. This isolates packages so they do not conflict between projects:

```bash
# Create a virtual environment in your project folder
cd myproject
python3 -m venv .venv

# Activate it
source .venv/bin/activate

# Now 'python' and 'pip' work without aliases
python --version
pip install requests

# Deactivate when done
deactivate
```

The `.venv` folder is local to your project. Add it to `.gitignore` — do not commit it.