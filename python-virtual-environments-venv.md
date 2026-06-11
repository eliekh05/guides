---
layout: default
title: "Python Virtual Environments (venv)"
parent: "Linux"
nav_order: 48
---

# Python Virtual Environments (venv)

A virtual environment is an isolated Python installation for a project. Packages installed inside it do not affect your system Python or other projects. Essential for any real Python work.

---

## Why Use a Virtual Environment?

Without virtual environments, every project shares the same Python packages. If Project A needs requests 2.28 and Project B needs requests 2.31, they conflict. With virtual environments, each project has its own isolated packages.

---

## Create and Use a Virtual Environment

```bash
# Create a virtual environment in your project folder
cd myproject
python3 -m venv .venv

# Activate it (macOS / Linux)
source .venv/bin/activate

# Activate it (Windows)
.venv\Scripts\activate

# You are now inside the virtual environment
# Your prompt changes to show (.venv)
(.venv) $

# Install packages — goes into .venv, not system Python
pip install requests flask numpy

# Deactivate when done
deactivate
```

---

## Working with Requirements

```bash
# Save all installed packages to a file
pip freeze > requirements.txt

# Install all packages from requirements.txt (for others to reproduce your environment)
pip install -r requirements.txt

# Install a specific version
pip install requests==2.28.0

# Install latest
pip install requests

# Upgrade a package
pip install --upgrade requests

# Uninstall
pip uninstall requests
```

---

## Check What is Installed

```bash
pip list                            # all installed packages
pip show requests                   # info about a specific package
pip list --outdated                 # packages with newer versions available
```

---

## Always Add .venv to .gitignore

```bash
echo ".venv" >> .gitignore
```

Never commit the `.venv` folder. It is large, platform-specific, and other developers recreate it from `requirements.txt`.

---

## pyenv — Multiple Python Versions

If you need different Python versions per project, use pyenv instead of system Python:

```bash
brew install pyenv

# Install a Python version
pyenv install 3.12.4

# Set global default
pyenv global 3.12.4

# Set version per project
cd myproject
pyenv local 3.11.9   # creates .python-version file
```

Then create virtual environments as normal — they will use the pyenv-managed Python version.

---

## Common Issues

### "python3 -m venv" fails with error
```bash
# Ubuntu/Debian sometimes need this
sudo apt install python3-venv -y
```

### pip installs packages globally even with venv active
Check the venv is actually active — your prompt should show `(.venv)`. Also check `which pip` — it should point inside your `.venv` folder.

### Virtual environment has wrong Python version
Delete and recreate using the correct version:
```bash
rm -rf .venv
python3.12 -m venv .venv    # explicitly use Python 3.12
```
