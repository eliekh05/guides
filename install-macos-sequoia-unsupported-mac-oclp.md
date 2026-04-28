---
layout: default
title: "Install macOS Sequoia on an Unsupported Mac (OpenCore Legacy Patcher)"
parent: "Installation Guides"
nav_order: 7
---

# Install macOS Sequoia on an Unsupported Mac (OpenCore Legacy Patcher)

Apple drops support for older Macs with every major macOS release. This guide uses **OpenCore Legacy Patcher (OCLP)** — the only reliable, actively maintained tool for running modern macOS on unsupported hardware. It supports Macs as old as 2007 and works all the way up to macOS Sequoia 15.

> **Most guides online are outdated.** They reference old OCLP versions, wrong steps, or macOS versions that are no longer current. This guide is written for the current state of OCLP (2.x) and macOS Sequoia 15, which is the latest version supported by OCLP. macOS Tahoe is **not yet supported** by OCLP as of early 2026 — do not attempt it.

---

## Before You Start

### Check if Your Mac is Supported

OCLP supports a wide range of Macs. The most commonly affected models that need this guide are:

**Dropped in macOS Sequoia (can use OCLP):**
- MacBook Air 2018, 2019
- MacBook Pro 2015, 2016, 2017
- MacBook 2015, 2016, 2017
- iMac 2014, 2015
- Mac mini 2014
- Mac Pro 2013

**Dropped in earlier versions (also supported by OCLP for Sequoia):**
- MacBook Pro 2008–2014
- iMac 2009–2013
- Mac mini 2009–2012
- Mac Pro 2008–2012
- MacBook Air 2010–2014

For the full list, check: [dortania.github.io/OpenCore-Legacy-Patcher/MODELS.html](https://dortania.github.io/OpenCore-Legacy-Patcher/MODELS.html)

### Hard Limits — These Cannot Be Worked Around

| Limit | Detail |
|---|---|
| **T2 chip Macs (2018–2019 MacBook Air)** | Cannot currently boot with OCLP due to a T2 firmware issue. Stuck on Sonoma for now. |
| **Less than 4 GB RAM** | macOS Sequoia requires at least 4 GB. 8 GB recommended. |
| **Intel GMA graphics** | Completely unsupported even with OCLP. |
| **32-bit CPUs** | Not supported. |

### What You Need

- A **USB drive, 32 GB or larger** (16 GB is not enough for Sequoia — it will run out of space)
- Your Mac must be on its **latest native macOS version** before starting. Update it first via System Settings → Software Update.
- A **backup** of your data (Time Machine or external drive). This process is safe but always back up before major OS changes.
- About **1–2 hours** depending on your internet speed and Mac

---

## Step 1 — Download OpenCore Legacy Patcher

Go to the official OCLP releases page:
[github.com/dortania/OpenCore-Legacy-Patcher/releases](https://github.com/dortania/OpenCore-Legacy-Patcher/releases)

Download the latest release — it will be a file called something like `OpenCore-Patcher.dmg`. Always use the latest version. Do not use older versions you may have downloaded previously.

Open the `.dmg` and drag **OpenCore Patcher** to your Applications folder.

---

## Step 2 — Create the macOS Sequoia USB Installer

1. Plug in your **32 GB+ USB drive**.
2. Open **OpenCore Patcher** from your Applications folder.
3. Click **"Create macOS Installer"**.
4. Click **"Download macOS Installer"**.
5. Select **macOS Sequoia** from the list and click Download. This downloads the full installer — about 13 GB. It may take 20–60 minutes depending on your connection.
6. Once the download finishes, OCLP will ask which drive to write it to. Select your USB drive.
7. Click **"Create Installer"** and enter your password when prompted.
8. Wait for the process to finish. This takes several minutes.

> **Note:** OCLP uses Apple's own `createinstallmedia` tool to build the USB. If you are on an older macOS version (e.g., Monterey) and OCLP says you need a newer base OS to download Sequoia, update your Mac to the latest version it can run natively first, then try again.

---

## Step 3 — Build and Install OpenCore onto the USB

OpenCore is the boot manager that tricks macOS into thinking it is running on supported hardware. It must be on your USB drive before you boot the installer.

1. Back in the OCLP main menu, click **"Build and Install OpenCore"**.
2. OCLP will automatically detect your Mac model and build a configuration tailored to it.
3. When it asks where to install OpenCore, select your **USB drive** (the same one you just created the installer on).
4. Click **Install to Disk** → select the USB → select the **EFI** partition when prompted.
5. Click **Yes** to confirm.

---

## Step 4 — Boot from the USB Drive

1. **Restart** your Mac.
2. Hold the **Option (⌥)** key immediately after you press the power button and keep holding it.
3. The startup disk picker will appear. You will see an option called **EFI Boot** — this is OpenCore. Select it and press Enter.

> **Important:** You must select **EFI Boot** (OpenCore), not the direct macOS installer entry. OpenCore needs to load first to patch the hardware checks. If you boot the installer directly without OpenCore, you will get a "This Mac is not supported" error.

4. Inside the OpenCore boot picker (grey screen with icons), select **"Install macOS Sequoia"** and press Enter.

---

## Step 5 — Install macOS Sequoia

The macOS installer will load. Follow these steps:

1. **If you want a clean install:** Open **Disk Utility** from the Utilities menu, select your internal drive, click **Erase**, format it as **APFS**, and name it `Macintosh HD`. Then quit Disk Utility and continue.
2. **If you want to upgrade (keep your files):** Skip Disk Utility and proceed directly.
3. Select **Install macOS Sequoia** and click Continue.
4. Accept the license agreement.
5. Select your internal drive and click Continue.

The installer will reboot your Mac **two or three times** during installation. Each time it reboots, you need to hold **Option (⌥)** and select **EFI Boot** again so OpenCore stays in the boot chain.

> **This is the most common mistake.** If you do not hold Option and select EFI Boot on each reboot, the Mac will try to boot normally, fail, and get stuck. Stay at the keyboard during the entire installation.

Installation takes approximately 20–40 minutes.

---

## Step 6 — Complete Setup and Install OpenCore to Your Internal Drive

After macOS Sequoia finishes installing and you reach the setup screen:

1. Go through the initial macOS setup (language, account, etc.).
2. Once at the desktop, **open OpenCore Patcher** — it should have been carried over. If not, copy it from your USB drive or re-download it.
3. Click **"Install OpenCore to Disk"**.
4. This time, select your **internal drive** (not the USB). This makes your Mac boot through OpenCore automatically every time without needing the USB drive.
5. Select the **EFI** partition on the internal drive when prompted.
6. Click **Yes** and enter your password.
7. **Reboot**.

After rebooting, your Mac should now boot directly into macOS Sequoia without needing the USB drive.

---

## Step 7 — Apply Root Patches (Critical — Do Not Skip)

Root patching is what actually makes older hardware work properly under Sequoia. Without it, you may have no GPU acceleration, broken Wi-Fi, or other issues even if the OS appears to boot.

1. Open **OpenCore Patcher**.
2. Click **"Post Install Root Patch"**.
3. Click **"Start Root Patching"** and enter your password.
4. Wait for it to complete — this takes a few minutes.
5. **Reboot** when prompted.

After this reboot, graphics acceleration, Wi-Fi, Bluetooth, and other hardware-specific features should be fully working.

> **You must repeat root patching after every macOS update.** Every time Sequoia installs an update, it restores the sealed system volume, which removes the patches. OCLP will notify you when patches need to be reapplied. This is normal — it is not a bug.

---

## Step 8 — Disable Automatic Updates (Strongly Recommended)

macOS Tahoe is not yet supported by OCLP. If your Mac auto-updates to Tahoe, it will break. Disable automatic updates now:

1. Open **System Settings** → **General** → **Software Update**.
2. Click the **(i)** button next to "Automatic Updates".
3. Turn off **"Download new updates when available"**.

You can still manually check for and install Sequoia updates — just avoid major version upgrades until OCLP officially confirms Tahoe support.

---

## After Each macOS Update

Every time a Sequoia update installs:

1. Open **OpenCore Patcher**.
2. Click **"Post Install Root Patch"**.
3. Click **"Start Root Patching"**.
4. Reboot.

This takes about 5 minutes and keeps everything working.

---

## Troubleshooting

### 🚫 Circle with a line at startup
You did not boot through OpenCore (EFI Boot). Reboot, hold Option, and select EFI Boot instead of the macOS volume directly.

### Stuck on Apple logo or progress bar during installation
The most common cause is not selecting EFI Boot after one of the installer reboots. Restart, hold Option, select EFI Boot, and let it continue.

### Wi-Fi or graphics not working after install
Root patches were not applied. Open OCLP → Post Install Root Patch → Start Root Patching → Reboot.

### OCLP says "no patches needed" but Wi-Fi is still broken
Your Mac may have a supported Wi-Fi card already. Check System Settings → Wi-Fi. If the card shows but cannot find networks, try toggling Wi-Fi off and on.

### "This Mac is not supported" error
You booted the installer directly without going through OpenCore. Always use **EFI Boot** from the Option key boot picker.

### Root patches need to be re-applied every update
This is expected behaviour — not a bug. macOS restores the system volume on every update. Just run root patches again after each update.

### Mac boots to black screen after update
Boot from the USB drive (hold Option → EFI Boot → select Sequoia), open OCLP, re-apply root patches, and reboot.

---

## What Works and What Doesn't

| Feature | Status |
|---|---|
| General macOS use, apps, Safari | ✅ Full support |
| GPU acceleration (Metal Macs 2012+) | ✅ After root patching |
| GPU acceleration (non-Metal, pre-2012) | ⚠️ Partial — some apps may not render correctly |
| Wi-Fi (most 2012–2017 Macs) | ✅ After root patching |
| Wi-Fi (2018–2019 MacBook Air T2) | ❌ Not supported yet |
| Bluetooth | ✅ Most models |
| AirDrop | ✅ Most models |
| iPhone Mirroring | ❌ Requires T2 chip |
| Apple Intelligence | ❌ Requires Apple Silicon NPU |
| macOS updates (Sequoia point updates) | ✅ Works — re-apply root patches after each one |
| Upgrading to macOS Tahoe | ❌ Not supported by OCLP yet |

---

> **Summary:** Download OCLP, use it to create a Sequoia USB installer, add OpenCore to the USB, boot holding Option → EFI Boot, install Sequoia, then move OpenCore to your internal drive, apply root patches, and disable auto-updates. Re-apply root patches after every macOS update. That is the entire process.
