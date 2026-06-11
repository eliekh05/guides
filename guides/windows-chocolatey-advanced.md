---
layout: default
title: "Chocolatey Package Manager — Advanced Usage"
parent: "Windows"
nav_order: 16
---

# Chocolatey Package Manager — Advanced Usage

Chocolatey is the Windows package manager. Beyond the basics, it supports versioning, configuration management, and scripting.

---

## Install Chocolatey

Run PowerShell as Administrator:

```powershell
Set-ExecutionPolicy Bypass -Scope Process -Force
[System.Net.ServicePointManager]::SecurityProtocol = [System.Net.ServicePointManager]::SecurityProtocol -bor 3072
iex ((New-Object System.Net.WebClient).DownloadString('https://community.chocolatey.org/install.ps1'))
```

---

## Essential Commands

```powershell
choco install googlechrome        # install
choco install googlechrome -y     # install without prompt
choco uninstall googlechrome      # remove
choco upgrade googlechrome        # upgrade one package
choco upgrade all                 # upgrade everything
choco list                        # list installed packages
choco search "code editor"        # search
choco info vscode                 # package info and version history
```

---

## Install Multiple Packages

```powershell
choco install -y git vscode googlechrome firefox 7zip vlc notepadplusplus
```

---

## Pin a Package Version (Prevent Upgrades)

```powershell
choco pin add -n googlechrome
choco pin list
choco pin remove -n googlechrome
```

---

## Install a Specific Version

```powershell
choco install git --version=2.42.0 -y
```

---

## Packages Config File

Create a `packages.config` XML file to install everything at once:

```xml
<?xml version="1.0" encoding="utf-8"?>
<packages>
  <package id="git" />
  <package id="vscode" />
  <package id="7zip" />
  <package id="googlechrome" />
  <package id="firefox" />
  <package id="vlc" />
  <package id="notepadplusplus" />
</packages>
```

```powershell
choco install packages.config -y
```

---

## Export Installed Packages

```powershell
choco export packages.config
```

Generates a `packages.config` from currently installed packages. Use to replicate setup on a new machine.

---

## Chocolatey GUI

```powershell
choco install chocolateygui -y
```

Opens a graphical interface for searching, installing, and updating packages.

---

## Winget vs Chocolatey

| Feature | Winget | Chocolatey |
|---|---|---|
| Built into Windows | Yes (Win 11) | No |
| Package count | Large | Larger |
| Non-app software | Limited | Good |
| Enterprise features | Basic | Advanced (licensed) |
| Scripting | PowerShell | PowerShell |

Use **winget** for most things. Use **Chocolatey** when winget does not have the package you need.
