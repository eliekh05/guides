---
layout: default
title: "winget — Package Manager for Windows"
parent: "Package Managers (All OSes)"
nav_order: 11
---

# winget — Package Manager for Windows

`winget` (Windows Package Manager) is Microsoft's official package manager, built into Windows 10 (1809+) and Windows 11. It lets you install, update, and remove software from the command line without hunting for download pages or clicking through installers. Packages come from the Microsoft Store and the official winget community repository — all scanned for malware.

---

## Check if winget is Installed

Open **Command Prompt** or **PowerShell** and run:

```
winget --version
```

If you see a version number, you are ready. If not, install it from the Microsoft Store by searching for **App Installer**, or download from [github.com/microsoft/winget-cli/releases](https://github.com/microsoft/winget-cli/releases).

---

## Essential Commands

### Install a package

```
winget install Mozilla.Firefox
winget install Google.Chrome
winget install Microsoft.VisualStudioCode
winget install 7zip.7zip
```

### Install silently (no prompts, no windows)

```
winget install Mozilla.Firefox --silent
```

### Search for a package

```
winget search firefox
winget search "visual studio"
```

### Get info about a package

```
winget show Mozilla.Firefox
```

### Upgrade a specific package

```
winget upgrade Mozilla.Firefox
```

### Upgrade ALL installed packages at once

```
winget upgrade --all
```

This is one of winget's most useful features — update every app on your system with one command.

### Remove a package

```
winget uninstall Mozilla.Firefox
```

### List all installed apps (including non-winget apps)

```
winget list
```

---

## Finding the Right Package ID

Package IDs are in `Publisher.AppName` format. If you are not sure of the exact ID:

```
winget search firefox
```

Look for the **ID** column in the output — use that for install/upgrade/uninstall.

---

## Export and Import (Backup Your App List)

Export a list of all installed apps:

```
winget export -o apps.json
```

Install everything from the list on a new machine:

```
winget import -i apps.json --ignore-unavailable
```

This is the fastest way to set up a new Windows PC with all your apps.

---

## Popular Packages Reference

```
winget install Microsoft.VisualStudioCode
winget install Git.Git
winget install Python.Python.3.12
winget install OpenJS.NodeJS.LTS
winget install Google.Chrome
winget install Mozilla.Firefox
winget install 7zip.7zip
winget install VideoLAN.VLC
winget install Notepad++.Notepad++
winget install Discord.Discord
winget install Spotify.Spotify
winget install GitHub.GitHubDesktop
winget install Postman.Postman
winget install Docker.DockerDesktop
winget install Microsoft.WindowsTerminal
winget install JanDeDobbeleer.OhMyPosh
```

---

## Common Errors and Fixes

### `No package found matching input criteria`

The package ID is wrong or does not exist in winget. Search first:
```
winget search appname
```

### `Installer hash does not match`

The downloaded installer's checksum failed — could be a network issue or the package was updated. Try again:
```
winget install PACKAGE.ID --force
```

### `Another version already installed`

winget found a version already installed but cannot upgrade it. Try:
```
winget upgrade PACKAGE.ID --force
```

### `Requires administrator privileges`

Run Command Prompt or PowerShell as Administrator (right-click → Run as administrator), then retry.

### winget is very slow to search

Run this to refresh the source:
```
winget source update
```
