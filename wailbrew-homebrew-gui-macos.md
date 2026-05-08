---
layout: default
title: "WailBrew — Homebrew GUI for macOS"
parent: "Package Managers (All OSes)"
nav_order: 8
---

# WailBrew — Homebrew GUI for macOS

WailBrew is a free, open-source graphical interface for Homebrew. Instead of typing `brew install`, `brew upgrade`, or `brew list` in Terminal, you do everything from a clean visual app. It is built with Go, Wails, and React — runs natively on macOS with no Electron overhead.

> **Homebrew must already be installed** before WailBrew will work. See the existing Homebrew guides on this site if you have not installed it yet.

---

## Download WailBrew

Go to [wailbrew.app](https://www.wailbrew.app) and download the latest version.

- **Apple Silicon (M1/M2/M3/M4):** download the `arm64` build
- **Intel Mac:** download the `x86_64` build

Minimum macOS version: **macOS 11 Big Sur** or later.

Drag the app to your Applications folder and open it. If macOS says it cannot be opened because Apple cannot verify it, right-click → **Open** → **Open** — this is because WailBrew is not distributed through the App Store.

---

## What WailBrew Can Do

| Feature | How it works in WailBrew |
|---|---|
| **View installed packages** | Dashboard shows all installed formulas and casks |
| **Search for packages** | Search bar at the top — finds both formulas and casks |
| **Install a package** | Search → click the package → Install |
| **Uninstall a package** | Select from installed list → Uninstall |
| **Update a package** | Select it → Update, or update all at once |
| **View package details** | Click any package — shows version, dependencies, description |
| **See available updates** | Updates tab shows everything that has a newer version |
| **Real-time output** | Installation/update progress streams live so you can see what is happening |

---

## WailBrew vs Terminal — When to Use Which

WailBrew is best for:
- Browsing and discovering packages visually
- Seeing what is installed at a glance
- One-off installs and removals without memorising package names
- Batch updates when you want to see progress clearly

Terminal is still better for:
- Scripted installs (Brewfile, automated setups)
- Pinning specific package versions
- Tapping third-party repositories
- Anything requiring `brew services` (start/stop background services)

---

## Troubleshooting

### "Homebrew not found" when opening WailBrew

WailBrew cannot find your Homebrew installation. This usually means Homebrew is installed but not in the expected location.

**Apple Silicon:** Homebrew should be at `/opt/homebrew/bin/brew`
**Intel Mac:** Homebrew should be at `/usr/local/bin/brew`

Check in Terminal:
```bash
which brew
```

If `brew` works in Terminal but not in WailBrew, your PATH is set in `~/.zprofile` but WailBrew (as a GUI app) does not load shell profiles. This is a known limitation of macOS GUI apps — they do not inherit your terminal PATH.

Fix: create a symlink so WailBrew can find Homebrew regardless of PATH:

```bash
# Apple Silicon
sudo ln -sf /opt/homebrew/bin/brew /usr/local/bin/brew

# Intel — already in the right place
```

### Packages install but WailBrew list does not update

Click the **Refresh** button or restart WailBrew. The installed list is cached and needs a manual refresh after Terminal-based changes.

### WailBrew says "permission error"

Do not run WailBrew with `sudo` or as root. Homebrew is designed to run as your regular user — running it with elevated privileges breaks ownership. See the **Fix Homebrew Permission Errors** guide.

### App is slow on first launch

WailBrew is querying your full Homebrew installation on launch. If you have 100+ packages installed, the first load takes a few extra seconds. Subsequent opens are faster.

---

## Similar Apps

| App | Notes |
|---|---|
| **WailBrew** | Modern, actively maintained, free |
| **Cakebrew** | Older, less actively maintained |
| **Cork** | Paid (~$5), polished UI, available on App Store |

WailBrew is the best free option currently available. Cork is worth considering if you want App Store convenience and automatic updates.
