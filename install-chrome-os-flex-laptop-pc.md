---
layout: default
title: "Install Chrome OS Flex on Any Laptop or PC"
parent: "Installation Guides"
nav_order: 13
---

# Install Chrome OS Flex on Any Laptop or PC

Chrome OS Flex is Google's free, lightweight operating system designed for older PCs and Macs that can no longer run modern Windows or macOS well. It replaces your existing OS completely and turns almost any Intel or AMD laptop from the last 15 years into something fast, secure, and easy to use.

This replaced the old Brunch framework method — Chrome OS Flex is the official, maintained path and it actually works.

> **Note:** Chrome OS Flex replaces your entire operating system. Everything on the drive will be erased. Back up your files before proceeding.

---

## Is Your Hardware Compatible?

Chrome OS Flex runs on most Intel and AMD 64-bit laptops and desktops from 2010 onwards. Requirements:

- 64-bit Intel or AMD processor
- At least **4 GB RAM** (2 GB minimum, 4 GB strongly recommended)
- At least **16 GB storage** (internal drive)
- Intel integrated graphics, or AMD/Nvidia GPU — most work

**It does NOT support:**
- ARM processors (Raspberry Pi, Apple Silicon Macs, Snapdragon laptops)
- Intel Atom Z-series (some very old netbooks)
- 32-bit only CPUs

### Check the Certified Models List

Google maintains an official certified models list at [support.google.com/chromeosflex/answer/11513094](https://support.google.com/chromeosflex/answer/11513094).

**Important:** Not being on the list does not mean it will not work. The list only covers models Google has personally tested. Thousands of unlisted models run Chrome OS Flex perfectly. Test from USB first (Step 4) before committing to installation.

Certified status meanings:

| Status | What it means |
|---|---|
| **Certified** | Fully tested, everything expected to work |
| **Certified with caveats** | Works, but specific hardware may not (e.g. Wi-Fi, audio) |
| **End of support** | No longer receiving updates — do not install |

---

## What You Need

- A USB drive with at least **8 GB** of free space (all data will be erased)
- A second computer with **Google Chrome** installed (to create the USB)
- Your target laptop/PC

---

## Step 1 — Install the Chromebook Recovery Utility

On the computer you will use to create the USB (not the target machine):

1. Open **Google Chrome**.
2. Go to the Chrome Web Store and search for **Chromebook Recovery Utility**, or go directly to [chrome.google.com/webstore/detail/chromebook-recovery-utili/pocpnlppkickgojjlmhdmidojbmbodfm](https://chrome.google.com/webstore/detail/chromebook-recovery-utili/pocpnlppkickgojjlmhdmidojbmbodfm).
3. Click **Add to Chrome** → **Add extension**.

---

## Step 2 — Create the Chrome OS Flex USB Installer

1. Plug in your USB drive.
2. Click the Chromebook Recovery Utility icon in your Chrome extensions.
3. Click **Get started**.
4. Click **Select a model from a list** (do not type your device name).
5. Under **Manufacturer**, select **Google Chrome OS Flex**.
6. Under **Product**, select **Chrome OS Flex**.
7. Click **Continue**.
8. Select your USB drive from the dropdown — double-check you have the right drive.
9. Click **Continue** → **Create now**.

The utility will download Chrome OS Flex and write it to the USB. This takes about 10–15 minutes depending on your internet speed. Do not remove the USB until it says it is done.

---

## Step 3 — Boot from the USB Drive

1. Plug the USB into your target laptop/PC.
2. Restart the machine and boot from the USB. The key to open the boot menu varies:
   - **Dell:** F12
   - **HP:** F9 or Esc
   - **Lenovo:** F12 or F1
   - **Asus:** Esc or F8
   - **Acer:** F12 or F2
   - **Surface:** Hold Volume Down + Power
   - **Mac (Intel):** Hold Option (⌥)
3. Select your USB drive from the boot menu.

If you do not see a boot menu option, you may need to enter BIOS/UEFI settings (usually F2 or Del) and disable **Secure Boot**, then try again.

---

## Step 4 — Test Before Installing (Do Not Skip)

Chrome OS Flex boots into a live environment first — it does not touch your internal drive until you explicitly choose to install. **Use this to test everything before committing.**

Check the following in the live session:

- **Wi-Fi** — can you connect and stay connected? Try disconnecting and reconnecting.
- **Trackpad** — does two-finger scrolling work? Pinch to zoom?
- **Keyboard** — do brightness keys, volume keys, and function keys work?
- **Webcam** — open the Camera app and check it works.
- **Audio** — play something and check speakers and microphone.
- **Sleep/wake** — close the lid and reopen it. Does it wake properly? Does Wi-Fi reconnect?

If critical hardware (Wi-Fi, trackpad) does not work in the live session, it will not work after installation either. For most machines everything works fine.

---

## Step 5 — Install Chrome OS Flex

Once you are happy everything works:

1. At the bottom right of the Chrome OS Flex screen, click the clock/tray area.
2. Select **Install CloudReady** or **Install Chrome OS Flex** (the label varies by version).
3. Read the warning — **this will erase your entire internal drive**.
4. Click **Install Chrome OS Flex** to confirm.
5. The installation takes 10–20 minutes. The machine will reboot automatically when done.
6. Remove the USB drive when prompted.

---

## Step 6 — Initial Setup

After installation, Chrome OS Flex will boot to a setup screen:

1. Select your language and keyboard layout.
2. Connect to Wi-Fi.
3. Sign in with a Google account or create one.
4. Complete the setup and you are done.

---

## What Chrome OS Flex Can and Cannot Do

| Feature | Supported |
|---|---|
| Google Chrome browser | ✅ |
| Google Drive, Docs, Sheets, Gmail | ✅ |
| Android apps (Play Store) | ❌ Not supported on Flex |
| Linux apps (via Crostini) | ✅ On most hardware |
| Windows apps | ❌ Not natively — use Linux or web alternatives |
| Offline use | ✅ Many apps work offline |
| Automatic updates | ✅ Google pushes updates automatically |
| Software update lifespan | Until 2030 for most models |

---

## Reverting Back to Windows or macOS

Chrome OS Flex completely replaces your OS. To go back:

**Windows:** Create a Windows USB installer using [Microsoft's Media Creation Tool](https://www.microsoft.com/software-download/windows10) and reinstall Windows from USB.

**Mac (Intel):** Boot into macOS Recovery (hold Cmd+R at startup) and reinstall macOS, or use a macOS USB installer.

---

## Troubleshooting

### Wi-Fi not connecting after installation
Some Broadcom Wi-Fi chips are not fully supported. Try using a USB Wi-Fi adapter (most work plug-and-play). You can also check if Linux apps can access the network via the Crostini terminal.

### Screen brightness keys do not work
This is a known issue on some older HP and Acer models. It is cosmetic — brightness still adjusts in Settings → Display.

### Boot menu does not appear, goes straight to old OS
Secure Boot may be blocking the USB. Enter BIOS (F2/Del at startup) and disable Secure Boot.

### "ChromeOS is missing or damaged" on first boot after install
The installation did not complete fully. Re-create the USB and try the installation again from Step 2.

### Trackpad two-finger scroll not working
Some older Synaptics touchpads (pre-2014) only support basic pointing. This cannot be fixed — it is a hardware limitation.
