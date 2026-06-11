---
layout: default
title: "Windows Registry — Basics and Useful Tweaks"
parent: "Windows"
nav_order: 11
---

# Windows Registry — Basics and Useful Tweaks

The Windows Registry stores system and application settings. Direct edits can break Windows — always back up before changing anything.

---

## Open Registry Editor

Press **Win+R** → type `regedit` → Enter

---

## Back Up Before Editing

**File → Export** → save the entire registry (or just the key you are editing) to a `.reg` file. Restore by double-clicking the `.reg` file.

---

## Registry Structure

```
HKEY_LOCAL_MACHINE (HKLM)    — system-wide settings
HKEY_CURRENT_USER (HKCU)     — current user settings
HKEY_CLASSES_ROOT (HKCR)     — file associations
HKEY_USERS (HKU)             — all user profiles
HKEY_CURRENT_CONFIG (HKCC)   — current hardware profile
```

---

## Useful Tweaks

**Disable lock screen (Windows 11):**
```
HKLM\SOFTWARE\Policies\Microsoft\Windows\Personalization
New DWORD: NoLockScreen = 1
```

**Set DNS over HTTPS (DoH):**
```
HKLM\SYSTEM\CurrentControlSet\Services\Dnscache\Parameters
New DWORD: EnableAutoDoh = 2
```

**Disable automatic restart after updates:**
```
HKLM\SOFTWARE\Policies\Microsoft\Windows\WindowsUpdate\AU
New DWORD: NoAutoRebootWithLoggedOnUsers = 1
```

**Add "Open PowerShell here" to right-click menu:**
```
HKCR\Directory\Background\shell
Create key: OpenPSHere
Default value: Open PowerShell Here

Inside: shell\OpenPSHere\command
Default value: powershell.exe -NoExit -Command "cd '%V'"
```

---

## Edit Registry via PowerShell (Automatable)

```powershell
# Read a value
Get-ItemProperty -Path "HKCU:\Software\Microsoft\Windows\CurrentVersion\Explorer\Advanced" -Name "HideFileExt"

# Set a value
Set-ItemProperty -Path "HKCU:\Software\Microsoft\Windows\CurrentVersion\Explorer\Advanced" -Name "HideFileExt" -Value 0

# Create a new key
New-Item -Path "HKLM:\SOFTWARE\Policies\Microsoft\Windows\Personalization" -Force

# Create a new DWORD value
New-ItemProperty -Path "HKLM:\SOFTWARE\Policies\Microsoft\Windows\Personalization" -Name "NoLockScreen" -Value 1 -PropertyType DWORD
```

---

## Apply `.reg` Files

Create a `.reg` file with a text editor:

```reg
Windows Registry Editor Version 5.00

[HKEY_CURRENT_USER\Software\Microsoft\Windows\CurrentVersion\Explorer\Advanced]
"HideFileExt"=dword:00000000
"LaunchTo"=dword:00000001
```

Double-click to import. The `dword:` prefix means DWORD (32-bit integer) in hex.
