---
layout: default
title: "Manage Multiple Python and Node Versions with Homebrew"
parent: "Package Managers (All OSes)"
nav_order: 6
---

# Manage Multiple Python and Node Versions with Homebrew

Running multiple versions of Python or Node.js on the same Mac is one of the most common developer needs and one of the most confusing things to set up. This guide covers how to do it cleanly with Homebrew tools — no `nvm` scripts that break your PATH, no `pyenv` black boxes.

---

## Python — Multiple Versions with pyenv

`pyenv` lets you install and switch between any Python version with one command. It is the standard tool and works alongside Homebrew perfectly.

### Install pyenv

```bash
brew install pyenv
```

Add pyenv to your shell (paste into Terminal and press Enter):

```bash
echo 'export PYENV_ROOT="$HOME/.pyenv"' >> ~/.zprofile
echo 'export PATH="$PYENV_ROOT/bin:$PATH"' >> ~/.zprofile
echo 'eval "$(pyenv init -)"' >> ~/.zprofile
source ~/.zprofile
```

### Install Python versions

```bash
# See all available versions
pyenv install --list

# Install specific versions
pyenv install 3.12.4
pyenv install 3.11.9
pyenv install 3.10.14
```

### Switch between versions

```bash
# Set global default (used everywhere)
pyenv global 3.12.4

# Set version for current folder only (saved in .python-version file)
pyenv local 3.11.9

# Set version for current terminal session only
pyenv shell 3.10.14

# Check active version
python --version
pyenv version
```

### List installed versions

```bash
pyenv versions
```

### Remove a version

```bash
pyenv uninstall 3.10.14
```

---

## Node.js — Multiple Versions with fnm

`fnm` (Fast Node Manager) is the modern replacement for `nvm`. It is faster, written in Rust, and works properly with Homebrew without polluting your PATH.

### Install fnm

```bash
brew install fnm
```

Add fnm to your shell:

```bash
echo 'eval "$(fnm env --use-on-cd)"' >> ~/.zprofile
source ~/.zprofile
```

### Install Node versions

```bash
# Install latest LTS
fnm install --lts

# Install specific version
fnm install 20
fnm install 18.19.0
fnm install 22
```

### Switch between versions

```bash
# Use a version for current session
fnm use 20

# Set global default
fnm default 20

# Auto-switch based on .nvmrc or .node-version file in project folder
# (enabled automatically by --use-on-cd in setup above)
```

### List installed versions

```bash
fnm list
fnm list-remote  # See all available versions
```

### Set version per project

Create a `.node-version` file in your project folder:

```bash
echo "20" > .node-version
```

fnm will automatically switch to Node 20 whenever you `cd` into that folder.

---

## Using Different Versions Per Project (Python + Node Together)

For a project that needs Python 3.11 and Node 18:

```bash
cd ~/myproject

# Set Python version for this project
pyenv local 3.11.9

# Set Node version for this project
echo "18" > .node-version

# Verify
python --version   # Should show 3.11.x
node --version     # Should show 18.x
```

Both files (`.python-version` and `.node-version`) should be committed to your project's git repo so everyone on the team uses the same versions automatically.

---

## Troubleshooting

### `python` still points to system Python
pyenv is not loaded in your shell. Run `source ~/.zprofile` and try again. If that fails, check that the pyenv lines are actually in `~/.zprofile`:
```bash
cat ~/.zprofile | grep pyenv
```

### `fnm use` resets after opening a new terminal
The `eval "$(fnm env --use-on-cd)"` line is not in your profile. Add it and run `source ~/.zprofile`.

### pip installs packages globally instead of in a virtual environment
Always create a virtual environment for projects:
```bash
python -m venv .venv
source .venv/bin/activate
pip install requests
```

### Node version does not switch automatically per project
Make sure you used `--use-on-cd` when setting up fnm, and that a `.node-version` file exists in the project folder.
