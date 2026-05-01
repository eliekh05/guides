---
layout: default
title: "MacPorts — Install and Use on macOS"
parent: "Package Managers (All OSes)"
nav_order: 8
---

# MacPorts — Install and Use on macOS

MacPorts is an alternative to Homebrew for macOS. It compiles software from source rather than installing pre-built binaries, which means better customisation and sometimes better compatibility — especially for older software or scientific packages. It has been around since 2002 and maintains over 25,000 ports.

---

## Homebrew vs MacPorts — When to Use Which

| | Homebrew | MacPorts |
|---|---|---|
| Installation method | Pre-built binaries (faster) | Compiles from source (slower, more compatible) |
| Number of packages | ~8,000 formulae | ~25,000 ports |
| Install location | `/opt/homebrew` or `/usr/local` | `/opt/local` |
| Conflict with system libs | Possible | Isolated — uses its own copies of everything |
| Best for | General use, developer tools | Scientific software, older packages, strict isolation |
| Speed of installs | Fast | Slow (compiling takes time) |

**Use MacPorts if:** you need a package not in Homebrew, you need strict library isolation, or you are installing scientific or research software.

**Use Homebrew if:** you want fast installs and a larger community.

You can run both at the same time — they install to different directories and do not conflict.

---

## Step 1 — Install Xcode Command Line Tools

MacPorts requires Xcode CLT:

```bash
xcode-select --install
```

---

## Step 2 — Download and Install MacPorts

1. Go to [macports.org/install.php](https://www.macports.org/install.php).
2. Download the `.pkg` installer for your macOS version.
3. Open the `.pkg` and follow the installer.
4. Open a new Terminal window — MacPorts adds itself to your PATH automatically.

Verify:
```bash
port version
```

---

## Essential Commands

### Install a package

```bash
sudo port install wget
```

MacPorts requires `sudo` — unlike Homebrew, it installs to a system directory.

### Search for a package

```bash
port search python
port search --name python  # Search by name only
```

### Get info about a package

```bash
port info python312
```

### Update MacPorts and all ports

```bash
sudo port selfupdate
sudo port upgrade outdated
```

### List installed ports

```bash
port installed
```

### Remove a package

```bash
sudo port uninstall wget
```

### Remove a package and everything it depends on (if nothing else needs it)

```bash
sudo port uninstall --follow-dependencies wget
```

### Clean up old versions

```bash
sudo port reclaim
```

---

## Variants — Customise What Gets Compiled

MacPorts supports variants — optional features you enable or disable at compile time:

```bash
# See available variants for a port
port variants python312

# Install with a specific variant enabled
sudo port install python312 +universal

# Install with a variant disabled
sudo port install ffmpeg -x11
```

Common variants:
- `+universal` — build for both Intel and Apple Silicon
- `+quartz` — use native macOS rendering instead of X11
- `+ssl` — enable SSL support

---

## Fix: port command not found after install

If `port` is not found after installing MacPorts:

```bash
echo 'export PATH="/opt/local/bin:/opt/local/sbin:$PATH"' >> ~/.zprofile
source ~/.zprofile
```

---

## Uninstall MacPorts

```bash
sudo port -fp uninstall --follow-dependencies installed
sudo rm -rf /opt/local /Applications/DarwinPorts /Applications/MacPorts /Library/LaunchDaemons/org.macports.* /Library/Receipts/DarwinPorts*.pkg /Library/Receipts/MacPorts*.pkg /Library/StartupItems/DarwinPortsStartup /Library/Tcl/darwinports1.0 /Library/Tcl/macports1.0 ~/.macports
```
