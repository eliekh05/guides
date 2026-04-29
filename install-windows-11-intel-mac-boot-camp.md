---
layout: default
title: "Install Windows 11 on Intel Mac with Boot Camp"
parent: "Installation Guides"
nav_order: 11
---

# Install Windows 11 on Intel Mac with Boot Camp

Boot Camp lets you install Windows natively on an Intel Mac — not in a virtual machine, but directly on the hardware. This gives you full performance with no virtualisation overhead. You choose at startup whether to boot into macOS or Windows.

> **Intel Mac only.** Boot Camp was removed on Apple Silicon Macs (M1/M2/M3/M4). It only works on Intel Macs. If you have Apple Silicon, see the VMware Fusion or UTM guides instead.

---

## Requirements

- An Intel Mac running **macOS Monterey, Ventura, or Sonoma** (Boot Camp Assistant is not available on Sequoia)
- At least **64 GB free disk space** for Windows (128 GB recommended)
- At least **8 GB RAM**
- A USB drive is **not required** — Boot Camp handles the Windows installer automatically
- A Windows 11 ISO (see Step 1)
- A valid Windows 11 license, or use it unactivated

---

## Step 1 — Download the Windows 11 ISO

1. Go to [microsoft.com/software-download/windows11](https://www.microsoft.com/software-download/windows11).
2. Scroll to **Download Windows 11 Disk Image (ISO) for x64 devices**.
3. Select **Windows 11 (multi-edition ISO for x64 devices)** → **Download Now** → choose your language → download. About 5–6 GB.

---

## Step 2 — Open Boot Camp Assistant

1. Open **Finder** → **Applications** → **Utilities** → **Boot Camp Assistant**.
   Or search with Spotlight: **Boot Camp Assistant**.
2. Click **Continue** on the introduction screen.

---

## Step 3 — Select the ISO and Partition Size

1. Under **Select Tasks**, make sure both options are checked:
   - **Create a Windows 10 or later install disk** (it will say Windows 10 but works for Windows 11)
   - **Install Windows 10 or later version**
2. In the **Windows ISO Image** field, click **Choose** and select the Windows 11 ISO you downloaded.
3. At the bottom, drag the divider to set how much space to give Windows. Minimum 64 GB, recommended 128 GB or more.
4. Click **Install**.

Boot Camp will partition your drive and restart your Mac into the Windows installer automatically. This takes a few minutes.

---

## Step 4 — Install Windows

Your Mac will restart and boot directly into the Windows installer from the partition Boot Camp created.

1. Select your language, time, and keyboard layout → **Next**.
2. Click **Install now**.
3. Enter a product key or click **I don't have a product key** to skip (you can activate later).
4. Select **Windows 11 Pro** (recommended) and click **Next**.
5. Accept the license agreement.
6. Select **Custom: Install Windows only (advanced)**.
7. You will see several partitions. Select the one labelled **BOOTCAMP** — it is the one you allocated in Step 3.
   > **Important:** Do not select or format any other partition. Selecting the wrong partition will erase macOS.
8. Click **Next**. Windows will install and restart several times. Leave it running.

---

## Step 5 — Complete Windows Setup

After the final restart, Windows Setup will ask you to configure it:

- **Region and keyboard:** select yours.
- **Network:** connect to Wi-Fi or Ethernet.
- **Microsoft account:** sign in or choose **Sign-in options** → **Offline account** for a local account.
- **Privacy settings:** choose your preferences.
- **PIN:** set up a Windows Hello PIN.

When you reach the Windows desktop, proceed to Step 6.

---

## Step 6 — Install Boot Camp Drivers (Critical)

Without Boot Camp drivers, your Mac's trackpad, keyboard backlight, Wi-Fi, audio, and screen brightness controls will not work properly in Windows.

1. When you first log into Windows, a Boot Camp installer should launch automatically from the taskbar. If it does, follow it through.
2. If it does not launch automatically:
   - Open **File Explorer** and look for a **OSXRESERVED** drive or **Boot Camp** drive.
   - Open it and run **Setup.exe** inside the **BootCamp** folder.
3. Follow the installer → **Next** → **Install** → **Finish** → **Restart**.

After restarting, all Mac hardware will work correctly in Windows — trackpad gestures, Wi-Fi, audio, and brightness.

---

## Switching Between macOS and Windows

### At startup:
Hold the **Option (⌥)** key immediately after pressing the power button. A startup disk picker will appear — select **Macintosh HD** for macOS or **Windows** (EFI Boot) for Windows.

### From macOS:
Go to **System Settings** → **General** → **Startup Disk** → select **Windows** → **Restart**.

### From Windows:
Click the Boot Camp icon in the Windows system tray (bottom right) → **Restart in macOS**.

---

## Removing Windows and Boot Camp

If you want to go back to macOS only:

1. Boot into **macOS**.
2. Open **Boot Camp Assistant**.
3. Select **Remove Windows 10 or later version** and click **Continue**.
4. Boot Camp will remove the Windows partition and restore your full disk to macOS.
5. 
---

## Troubleshooting

### Wi-Fi not working in Windows after install
Boot Camp drivers were not installed. Go back to Step 6 and install them. Use your iPhone's Personal Hotspot via USB (Personal Hotspot → USB only) to get temporary internet if needed to download drivers.

### Windows won't boot — goes straight to macOS
Hold **Option (⌥)** at startup and manually select the Windows partition.

### "Windows cannot be installed to this disk" error
You selected the wrong partition. Look for the one specifically labelled **BOOTCAMP** and select only that one.

### Trackpad not working properly in Windows
Install Boot Camp drivers (Step 6). After installation, trackpad settings appear in Windows Control Panel → Boot Camp.

### Boot Camp Assistant says "Your disk is not formatted correctly"
Your Mac's drive needs to be a single GUID partition. If you have multiple partitions from previous installs, use Disk Utility to consolidate them first.
