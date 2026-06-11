---
layout: default
title: "Clean Install Windows 11"
parent: "Installation Guides"
nav_order: 32
---

# Clean Install Windows 11

---

## Create Installation Media

1. Download the **Media Creation Tool** from [microsoft.com/en-us/software-download/windows11](https://www.microsoft.com/en-us/software-download/windows11)
2. Run it → **Create installation media** → USB flash drive (8GB minimum)
3. Or download the ISO directly and flash with Rufus

---

## Boot from USB

Restart and boot from USB. Keys: F12 (Dell/Lenovo), F9 (HP), Esc (Asus)

---

## Installation

**Language and keyboard:** Choose yours

**Install type:** Always choose **Custom: Install Windows only** — this gives you a clean install, not an upgrade

**Partition:** If reinstalling on the same drive:
- Delete all existing partitions (data is lost)
- Select the unallocated space
- Click Next — Windows creates its own partitions

**Wait:** Installation takes 15–30 minutes

---

## First Boot — Skip or Minimise Telemetry

When Windows asks for setup:

**No internet yet:** Press **Shift+F10** to open Command Prompt, then type:
```cmd
oobe\bypassnro
```
This restarts the setup and lets you skip the "Let's connect to a network" requirement, allowing a local account setup.

**Privacy settings:** Turn off everything Microsoft suggests turning on — location, diagnostics, advertising ID, tailored experience. These are all optional.

---

## After Install

```powershell
# Check for updates
winget upgrade --all

# Install essentials
winget install -e --id 7zip.7zip
winget install -e --id VideoLAN.VLC
winget install -e --id Notepad++.Notepad++
winget install -e --id Microsoft.VisualStudioCode
```

---

## Activate Windows

```powershell
# Check activation status
slmgr /xpr
```

If you have a product key:
Settings → System → Activation → Change product key

---

## Bypass TPM and Secure Boot Check

For installing on unsupported hardware, modify the registry during setup:

1. At the "Let's connect you to a network" screen, press **Shift+F10**
2. Type `regedit`
3. Navigate to `HKEY_LOCAL_MACHINE\SYSTEM\Setup`
4. Create key **LabConfig** inside Setup
5. Inside LabConfig, add DWORD values:
   - `BypassTPMCheck = 1`
   - `BypassSecureBootCheck = 1`
   - `BypassRAMCheck = 1`
6. Close registry, continue setup

See the **Install Windows 11 on Unsupported PC** guide for a full walkthrough.
