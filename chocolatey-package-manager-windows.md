---
layout: default
title: "Chocolatey — Package Manager for Windows"
parent: "Package Managers (All OSes)"
nav_order: 12
---

# Chocolatey — Package Manager for Windows

Chocolatey is a community-driven package manager for Windows with over 9,000 packages. It pre-dates winget by many years and has a larger package library, including many enterprise tools, older software versions, and developer utilities not available in winget.

---

## winget vs Chocolatey — When to Use Which

| | winget | Chocolatey |
|---|---|---|
| Made by | Microsoft | Community/Chocolatey Inc. |
| Package count | ~3,000 | ~9,000 |
| Requires admin | Sometimes | Yes (always) |
| Free | Yes | Free community tier |
| Best for | Consumer apps, Microsoft Store apps | Developer tools, enterprise, older versions |

You can use both — they install to different locations and do not conflict. Many people use winget for consumer apps and Chocolatey for developer tools.

---

## Step 1 — Install Chocolatey

Open **PowerShell as Administrator** (right-click Start → Windows PowerShell (Admin)):

```powershell
Set-ExecutionPolicy Bypass -Scope Process -Force
[System.Net.ServicePointManager]::SecurityProtocol = [System.Net.ServicePointManager]::SecurityProtocol -bor 3072
iex ((New-Object System.Net.WebClient).DownloadString('https://community.chocolatey.org/install.ps1'))
```

Close and reopen PowerShell as Administrator. Verify:

```
choco --version
```

---

## Essential Commands

All Chocolatey commands must be run in **PowerShell or Command Prompt as Administrator**.

### Install a package

```
choco install firefox
choco install googlechrome
choco install vscode
choco install git
```

### Install silently without confirmation prompts

```
choco install firefox -y
```

### Install a specific version

```
choco install python --version=3.11.0
```

### Search for a package

```
choco search python
choco search "visual studio"
```

### Get info about a package

```
choco info firefox
```

### Upgrade a package

```
choco upgrade firefox
```

### Upgrade ALL packages

```
choco upgrade all -y
```

### Remove a package

```
choco uninstall firefox
```

### List installed packages

```
choco list --local-only
```

---

## Install Multiple Packages at Once

```
choco install git vscode nodejs python firefox googlechrome 7zip vlc -y
```

---

## Packages File (chocolatey.config)

Create a `packages.config` file to install many apps at once — useful for new machine setup:

```xml
<?xml version="1.0" encoding="utf-8"?>
<packages>
  <package id="git" />
  <package id="vscode" />
  <package id="nodejs" />
  <package id="python" version="3.12.0" />
  <package id="firefox" />
  <package id="7zip" />
  <package id="vlc" />
</packages>
```

Install all from the file:

```
choco install packages.config -y
```

---

## Popular Packages Reference

```
choco install git -y
choco install vscode -y
choco install nodejs -y
choco install python -y
choco install googlechrome -y
choco install firefox -y
choco install 7zip -y
choco install vlc -y
choco install discord -y
choco install spotify -y
choco install postman -y
choco install docker-desktop -y
choco install notepadplusplus -y
choco install putty -y
choco install winscp -y
choco install wireshark -y
choco install virtualbox -y
choco install obs-studio -y
```

---

## Common Errors and Fixes

### `Access to the path is denied`

You are not running as Administrator. Right-click PowerShell → Run as Administrator.

### `The package was not found`

The package ID is slightly different. Search first:
```
choco search appname
```

### `Checksum mismatch`

The installer file was updated but the Chocolatey package has not caught up. Try:
```
choco install package --ignore-checksums
```

Use with caution — only do this for packages you trust.

### Chocolatey prompts for confirmation on every package

Add `-y` to all install/upgrade commands, or set it as default:
```
choco feature enable -n allowGlobalConfirmation
```
