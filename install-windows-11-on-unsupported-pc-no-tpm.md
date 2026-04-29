---
layout: default
title: "Install Windows 11 on Unsupported PC (No TPM, No Secure Boot)"
parent: "Installation Guides"
nav_order: 3
---

# Install Windows 11 on an Unsupported PC (No TPM / No Secure Boot)

Windows 11 requires TPM 2.0, Secure Boot, and a supported CPU. If your PC does not meet these requirements, Microsoft's installer will block you. This guide shows you how to bypass those checks and install Windows 11 anyway — using only free, official tools.

> **Note:** Windows 10 reached end of life on October 14, 2025. It no longer receives security updates. Installing Windows 11 on older hardware is a reasonable way to keep your machine supported.

> **Warning:** Installing on unsupported hardware means Microsoft does not guarantee future updates will install. Most cumulative updates have continued to work fine in practice, but major feature updates may re-check hardware requirements.

---

## Before You Start

### Check if TPM is actually off, not missing

Many PCs built after 2015 have TPM 2.0 but it is **disabled in BIOS** by default. Before using any bypass, check:

1. Press **Windows + R**, type `tpm.msc`, and press Enter.
2. If it says "Compatible TPM cannot be found", go into your BIOS/UEFI and look for:
   - **Intel:** PTT (Platform Trust Technology) — enable it
   - **AMD:** fTPM (firmware TPM) — enable it
3. Also check that **Secure Boot** is enabled in BIOS.

If enabling these in BIOS lets the Windows 11 installer pass, you do not need any bypass. If your hardware genuinely lacks TPM, continue below.

---

## What You Need

- A USB flash drive with at least **8 GB** of free space (all data will be erased)
- A PC running Windows 10 (to create the USB)
- A valid Windows 10 or 11 license (the bypass installs Windows — it does not provide a license)
- About 30–60 minutes

---

## Method 1 — Rufus (Easiest, Recommended)

Rufus is a free, open-source tool that creates a bootable USB and removes the TPM, Secure Boot, and RAM checks automatically. Verified working on Windows 11 25H2.

### Step 1 — Download the Windows 11 ISO

1. Go to [microsoft.com/software-download/windows11](https://www.microsoft.com/software-download/windows11).
2. Scroll to **Download Windows 11 Disk Image (ISO) for x64 devices**.
3. Select **Windows 11 (multi-edition ISO for x64 devices)** and click **Download Now**.
4. Choose your language and download the ISO. It is about 5–6 GB.

### Step 2 — Download Rufus

1. Go to [rufus.ie](https://rufus.ie) and download the latest version.
2. Rufus is portable — no installation needed. Just run the `.exe` file.

### Step 3 — Create the Bypassed USB

1. Plug in your USB drive.
2. Open Rufus.
3. Under **Device**, select your USB drive.
4. Under **Boot selection**, click **SELECT** and choose the Windows 11 ISO you downloaded.
5. Click **START**.
6. Rufus will show a dialog: **"Windows User Experience"**. Check the following boxes:
   - ✅ **Remove requirement for 4GB+ RAM, Secure Boot and TPM 2.0**
   - ✅ **Remove requirement for an online Microsoft account** *(optional but recommended)*
7. Click **OK** and wait for Rufus to finish (5–10 minutes).

### Step 4 — Boot from the USB and Install

1. Restart your PC and boot from the USB drive.
   - The key to press for the boot menu varies by manufacturer: usually **F12**, **F10**, **Esc**, or **Del**. It is shown briefly on screen during startup.
2. Follow the Windows setup normally.
3. When asked for a product key, click **I don't have a product key** if you are reinstalling on a previously licensed machine — Windows will activate automatically after setup.
4. Select **Custom: Install Windows only (advanced)** for a clean install.
5. Choose your drive and complete installation.

---

## Method 2 — Registry Edit During Install (No Extra Tools)

Use this if you cannot run Rufus, or if you already have a standard Windows 11 USB and do not want to recreate it.

### Step 1 — Create a Standard Windows 11 USB

Use Microsoft's Media Creation Tool from [microsoft.com/software-download/windows11](https://www.microsoft.com/software-download/windows11) to create a standard bootable USB.

### Step 2 — Boot from the USB

1. Restart and boot from the USB drive.
2. When you reach the **"Install now"** screen, press **Shift + F10** to open Command Prompt.

### Step 3 — Edit the Registry

In Command Prompt, type:

```cmd
regedit
```

Navigate to:
```
HKEY_LOCAL_MACHINE\SYSTEM\Setup
```

Right-click **Setup** → **New** → **Key** → name it **LabConfig**.

Inside **LabConfig**, create the following DWORD (32-bit) values — right-click in the right panel → **New** → **DWORD (32-bit) Value**:

| Value Name | Data |
|---|---|
| `BypassTPMCheck` | `1` |
| `BypassSecureBootCheck` | `1` |
| `BypassRAMCheck` | `1` |
| `BypassCPUCheck` | `1`  Check CPU Hard Limit section below |

4. Close Registry Editor and Command Prompt.
5. Click **Install now** and proceed normally.

---

## Method 3 — In-Place Upgrade from Windows 10 (No USB Needed)

If you want to keep your files and apps and upgrade directly from Windows 10:

1. Open Command Prompt as Administrator.
2. Run:
   ```cmd
   reg add "HKEY_LOCAL_MACHINE\SYSTEM\Setup\MoSetup" /v AllowUpgradesWithUnsupportedTPMOrCPU /t REG_DWORD /d 1 /f
   ```
3. Download the Windows 11 ISO from Microsoft (see Method 1, Step 1).
4. Mount the ISO by double-clicking it in File Explorer.
5. Run `setup.exe` from the mounted drive.
6. Choose **Keep personal files and apps** during setup.

> **Tip:** Disconnect from the internet during the upgrade. Some users on unsupported hardware have reported failures at 70–75% when connected. Reconnect after setup completes.

---

## CPU Hard Limit (Cannot Be Bypassed)

Starting with Windows 11 24H2, CPUs that do not support **SSE 4.2 instructions** cannot run Windows 11 — even with a bypass. This affects CPUs older than approximately 2008. If your CPU is that old, Windows 11 is not an option.

To check if your CPU supports SSE 4.2, search your exact CPU model on [cpu-world.com](https://www.cpu-world.com) or [ark.intel.com](https://ark.intel.com).

---

## What You Lose Without TPM and Secure Boot

| Feature | Impact |
|---|---|
| BitLocker hardware encryption | Reduced security — software encryption still works |
| Windows Hello (face/fingerprint) | May not work without TPM |
| Future major updates | Not guaranteed but usually available |
| Microsoft warranty/support | Not applicable to unsupported installs |

---

> **Summary:** For most people, **Method 1 (Rufus)** is the cleanest and fastest approach. The registry method works equally well if you prefer not to use a third-party tool. Either way, millions of PCs are running Windows 11 this way with no issues.
