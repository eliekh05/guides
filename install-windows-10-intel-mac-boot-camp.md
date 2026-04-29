---
layout: default
title: "Install Windows 10 on Intel Mac with Boot Camp"
parent: "Installation Guides"
nav_order: 11
---

# Install Windows 10 on Intel Mac with Boot Camp

Boot Camp lets you install Windows natively on an Intel Mac — not in a virtual machine, but directly on the hardware. This gives you full performance with no virtualisation overhead. You choose at startup whether to boot into macOS or Windows.

> **Intel Mac only.** Boot Camp is not available on Apple Silicon Macs (M1/M2/M3/M4). If you have Apple Silicon, see the VMware Fusion or UTM guides instead.

> **Windows 11 is not supported via Boot Camp.** Intel Macs lack TPM 2.0 and Secure Boot, which Windows 11 requires. Boot Camp officially supports Windows 10 only. If you need Windows 11 on a Mac, use VMware Fusion or Parallels Desktop instead.

---

## Requirements

- An Intel Mac running macOS Monterey, Ventura, Sonoma, or Sequoia — Boot Camp Assistant is present on all of these on Intel Macs
- At least **64 GB free disk space** for Windows (128 GB recommended)
- At least **8 GB RAM**
- A USB drive is **not required** — Boot Camp handles the Windows installer automatically
- A Windows 10 ISO (see Step 1)
- A valid Windows 10 license, or use it unactivated

---

## Step 1 — Download the Windows 10 ISO

1. Go to [microsoft.com/software-download/windows10ISO](https://www.microsoft.com/software-download/windows10ISO).
2. Select **Windows 10** → choose your edition and language → click **Confirm** → download the **64-bit Download**. About 5 GB.

---

## Step 2 — Open Boot Camp Assistant

1. Open **Finder** → **Applications** → **Utilities** → **Boot Camp Assistant**, or search with Spotlight.
2. Click **Continue** on the introduction screen.

---

## Step 3 — Select the ISO and Partition Size

1. Under **Select Tasks**, make sure both options are checked:
   - **Create a Windows 10 or later install disk**
   - **Install Windows 10 or later version**
2. In the **Windows ISO Image** field, click **Choose** and select the Windows 10 ISO you downloaded.
3. Drag the divider to set how much space to give Windows. Minimum 64 GB, 128 GB recommended.
4. Click **Install**.

Boot Camp will partition your drive and restart your Mac into the Windows installer automatically. This takes a few minutes.

---

## Step 4 — Install Windows

Your Mac will restart and boot directly into the Windows installer.

1. Select your language, time, and keyboard layout → **Next**.
2. Click **Install now**.
3. Enter a product key or click **I don't have a product key** to skip (you can activate later).
4. Select **Windows 10 Pro** (recommended) or **Windows 10 Home** and click **Next**.
5. Accept the license agreement.
6. Select **Custom: Install Windows only (advanced)**.
7. You will see several partitions. Select the one labelled **BOOTCAMP**.
   > **Important:** Do not select or format any other partition. Selecting the wrong partition will erase macOS.
8. Click **Next**. Windows will install and restart several times — leave it running.

---

## Step 5 — Complete Windows Setup

After the final restart, Windows Setup will ask you to configure it:

- **Region and keyboard:** select yours.
- **Network:** connect to Wi-Fi or Ethernet.
- **Microsoft account:** sign in or choose **Offline account** for a local account.
- **Privacy settings:** choose your preferences.

When you reach the Windows desktop, proceed to Step 6.

---

## Step 6 — Install Boot Camp Drivers (Critical)

Without Boot Camp drivers, your Mac's trackpad, keyboard backlight, Wi-Fi, audio, and screen brightness controls will not work properly in Windows.

1. When you first log into Windows, a Boot Camp installer should launch automatically from the taskbar. Follow it through if it does.
2. If it does not launch automatically:
   - Open **File Explorer** and look for a **OSXRESERVED** or **Boot Camp** drive.
   - Open it and run **Setup.exe** inside the **BootCamp** folder.
3. Follow the installer → **Next** → **Install** → **Finish** → **Restart**.

After restarting, all Mac hardware will work correctly in Windows — trackpad gestures, Wi-Fi, audio, and brightness controls.

---

## Switching Between macOS and Windows

**At startup:** Hold the **Option (⌥)** key immediately after pressing the power button. Select **Macintosh HD** for macOS or **Windows** for Windows.

**From macOS:** Go to **System Settings** → **General** → **Startup Disk** → select **Windows** → **Restart**.

**From Windows:** Click the Boot Camp icon in the Windows system tray → **Restart in macOS**.

---

## Removing Windows and Boot Camp

1. Boot into **macOS**.
2. Open **Boot Camp Assistant**.
3. Select **Remove Windows 10 or later version** and click **Continue**.
4. Boot Camp will remove the Windows partition and restore your full disk to macOS.

---

## Troubleshooting

### Wi-Fi not working in Windows after install
Boot Camp drivers were not installed. Go back to Step 6. Use your iPhone's Personal Hotspot via USB for temporary internet if needed.

### Windows won't boot — goes straight to macOS
Hold **Option (⌥)** at startup and manually select the Windows partition.

### "Windows cannot be installed to this disk" error
You selected the wrong partition. Select only the partition labelled **BOOTCAMP**.

### Trackpad not working properly in Windows
Install Boot Camp drivers (Step 6). Trackpad settings appear in Windows Control Panel → Boot Camp after installation.

### Boot Camp Assistant says "Your disk is not formatted correctly"
Your Mac's drive needs to be a single GUID partition. Use Disk Utility to consolidate any extra partitions first.
