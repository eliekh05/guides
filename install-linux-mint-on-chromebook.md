---
layout: default
title: "Install Linux on a Chromebook (Replacing ChromeOS)"
parent: "Installation Guides"
nav_order: 5
---

# Install Linux on a Chromebook (Replacing or Dual Booting ChromeOS)

> ⚠️ **GalliumOS is dead.** It was officially discontinued in December 2022. The project's own wiki advises users to migrate away due to security vulnerabilities from an unpatched kernel and no updates since Ubuntu 18.04 LTS reached end of life in May 2023. Do not install GalliumOS — it is actively unsafe. This guide uses **Linux Mint XFCE** instead, which is the current recommended replacement, supported until 2029.

This guide covers two approaches:
- **Option A — Built-in Linux (Crostini):** Run Linux apps inside ChromeOS without modifying anything. Easiest and safest.
- **Option B — Full Linux with MrChromebox firmware:** Replace ChromeOS entirely with Linux Mint. Best performance, full OS.

---

## Option A — Linux Apps Inside ChromeOS (No Installation Needed)

Modern Chromebooks (2019+) have Linux built in. This runs a Debian container alongside ChromeOS — no firmware changes, no risk, fully reversible.

1. Go to **Settings** → **Advanced** → **Developers** → **Linux development environment**.
2. Click **Turn On** and follow the setup wizard.
3. A Debian-based container installs automatically (takes a few minutes).
4. Open the **Terminal** app that appears in your launcher.
5. You now have full `apt` access — install anything from Debian repositories:
   ```bash
   sudo apt update && sudo apt upgrade -y
   sudo apt install firefox-esr gimp vlc -y
   ```

Linux apps appear in your ChromeOS app launcher and open like any other app. Files are shared between ChromeOS and Linux via the Files app.

**Limitations:** The container has no direct hardware access, no GPU acceleration, and cannot run system-level tools. For most people this is enough.

---

## Option B — Full Linux Mint (Replaces ChromeOS)

This completely replaces ChromeOS with Linux Mint XFCE — a full desktop OS. You lose ChromeOS permanently (though you can restore it with a recovery USB).

### Hardware Requirements

Most Intel Chromebooks from 2012 onwards are supported. ARM Chromebooks have very limited support — check [mrchromebox.tech/supported-devices](https://mrchromebox.tech/supported-devices) before proceeding.

**Confirmed working well:**
- Intel Haswell, Broadwell, Skylake, Kabylake (2013–2017)
- Intel Apollo Lake, Gemini Lake (2017–2019)
- Intel Ice Lake, Tiger Lake (2020–2021)

### What You Need

- The Chromebook
- A USB drive (8 GB+)
- A second device to download files
- A screwdriver to remove the write-protect screw on some models (check mrchromebox.tech for your model)

---

### Step 1 — Check Your Device on MrChromebox

Go to [mrchromebox.tech/supported-devices](https://mrchromebox.tech/supported-devices) and find your Chromebook model. Note:
- Whether it requires a **write-protect screw removal**
- What firmware options are available (**UEFI Full ROM** is what you want)

If your device shows **UEFI Full ROM** as available, you can proceed.

---

### Step 2 — Enable Developer Mode

1. Shut down the Chromebook.
2. Hold **Esc + Refresh** and press **Power**.
3. At the Recovery screen, press **Ctrl + D**.
4. Press **Enter** to confirm turning off OS verification.
5. Wait 5–10 minutes for it to transition. The Chromebook will restart.
6. Press **Ctrl + D** at the "OS verification is OFF" screen to boot.
7. Complete the basic ChromeOS setup (just enough to get to a browser).

---

### Step 3 — Remove Write Protect (If Required)

Some Chromebooks have a physical write-protect screw that must be removed before firmware can be flashed. Check mrchromebox.tech for your specific model. If your model does not require this, skip to Step 4.

If required: power off, remove the bottom cover, find and remove the write-protect screw, and reassemble.

---

### Step 4 — Flash MrChromebox UEFI Firmware

1. On the Chromebook, press **Ctrl + Alt + T** to open Crosh.
2. Type `shell` and press Enter.
3. Run the MrChromebox firmware utility:
   ```bash
   cd; curl -LO mrchromebox.tech/firmware-util.sh && sudo bash firmware-util.sh
   ```
4. Select option **2 — Install/Update UEFI (Full ROM) Firmware**.
5. Follow the prompts. It will ask to back up your stock firmware to a USB drive — do this.
6. Confirm the flash. It takes about a minute.
7. Power off when done.

---

### Step 5 — Create a Linux Mint USB

On another computer:

1. Go to [linuxmint.com/download.php](https://linuxmint.com/download.php).
2. Download **Linux Mint 22.3 "Zena" — XFCE edition** (lightest, fastest on Chromebook hardware).
3. Flash it to your USB drive with [balenaEtcher](https://etcher.balena.io).

---

### Step 6 — Install Linux Mint

1. Insert the USB into the Chromebook.
2. Power on — with MrChromebox UEFI firmware installed, it will boot from USB automatically if no internal OS is detected.
3. Select **Start Linux Mint** at the boot menu.
4. Once the live desktop loads, double-click **Install Linux Mint**.
5. Choose your language and keyboard layout.
6. Check **Install multimedia codecs**.
7. On the installation type screen, select **Erase disk and install Linux Mint**.
8. Set your time zone, name, username, and password.
9. Click **Install Now** and wait (15–25 minutes).
10. Restart when prompted. Remove the USB.

---

### Step 7 — First Setup in Linux Mint

Linux Mint will boot to a full desktop. After login:

**Update the system:**
```bash
sudo apt update && sudo apt upgrade -y
```

**Fix Wi-Fi if not connecting** (some Broadcom chips):
```bash
sudo apt install broadcom-sta-dkms -y
sudo modprobe wl
```

**Enable touchpad tap-to-click:**
Go to **Menu** → **Settings** → **Mouse and Touchpad** → **Touchpad** tab → enable **Tap touchpad to click**.

---

## Restoring ChromeOS

If you want ChromeOS back:

1. On another computer, go to [chromeos.google.com/recovery](https://chromeos.google.com/recovery).
2. Install the **Chromebook Recovery Utility** extension in Chrome.
3. Create a recovery USB for your specific Chromebook model.
4. Insert the USB into your Chromebook and power on while holding **Esc + Refresh + Power**.
5. ChromeOS will restore from the USB.

Note: This also restores the stock firmware — you will need to re-flash MrChromebox firmware if you want Linux again.

---

## Troubleshooting

### Chromebook boots to black screen after firmware flash
Hold the power button for 10 seconds to force off. Try booting with the USB inserted. If it still fails, use the ChromeOS recovery USB to restore stock firmware and try again.

### Wi-Fi not working after Linux Mint install
Most Broadcom chips need the `broadcom-sta-dkms` package (see Step 7). Use a USB ethernet adapter for temporary internet to download the driver.

### Touchpad not working properly
Linux Mint's touchpad support on Chromebooks is generally good but some models need kernel parameters. Run `dmesg | grep touch` to identify your touchpad model and search for Linux-specific fixes for it.

### Keys not mapped correctly (brightness, volume)
ChromeOS keyboard mapping differs from standard PC. Install `chromebook-function-keys` or use the **Keyboard** settings in Linux Mint to remap function keys.
