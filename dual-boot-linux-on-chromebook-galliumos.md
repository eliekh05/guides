---
layout: default
title: "Dual Boot Linux on a Chromebook (GalliumOS via chrx)"
parent: "Installation Guides"
nav_order: 5
---

# Dual Boot Linux on a Chromebook (GalliumOS via chrx)

Chromebooks run ChromeOS — a locked-down Linux-based system. This guide shows how to add a full Linux OS alongside ChromeOS so you can choose which one to boot at startup, without losing ChromeOS or your data in the cloud.

The method uses **chrx** (Chromebook Unix), a command-line installer that runs entirely from within ChromeOS. No USB drive required for the dual-boot setup.

> **Warning:** This process will wipe all **local** data on your Chromebook. Data synced to your Google account (Drive, settings, etc.) is not affected. Back up any local files before starting.

---

## Before You Start

### Check Hardware Compatibility

Not all Chromebooks support this. Check the official compatibility list first:

1. On your Chromebook, press **Ctrl + Alt + T** to open Crosh (the ChromeOS terminal).
2. Type `shell` and press Enter.
3. Type the following and press Enter:
   ```bash
   crossystem hwid
   ```
4. Note your Hardware ID (HWID) — it looks like `DEVICE_CODENAME A1B-C2D`.
5. Check your HWID at [wiki.galliumos.org/Hardware_Compatibility](https://wiki.galliumos.org/Hardware_Compatibility).

If your device is listed with **chrx** support, you can proceed. If it shows **ISO only**, you need a USB drive method instead (see the end of this guide). If it shows **Incompatible**, Linux dual-boot is not supported on your hardware.

### What Processors Are Supported

| CPU Type | Support Level |
|---|---|
| Intel Haswell / Broadwell / Skylake / Kabylake | ✅ Excellent |
| Intel Baytrail / Braswell | ✅ Good |
| AMD Stoney Ridge | ✅ Good |
| ARM (Rockchip, MediaTek, Qualcomm) | ⚠️ Limited — most features work, slower |

Intel-based Chromebooks have the best Linux support and the most driver compatibility.

---

## Step 1 — Enable Developer Mode

Developer Mode is required to install any alternative OS. It disables ChromeOS's verified boot and allows low-level access.

1. **Turn off** your Chromebook completely.
2. Hold **Esc + Refresh (F3)** and press the **Power** button.
3. Your Chromebook will boot into Recovery Mode showing a screen that says **"ChromeOS is missing or damaged."** — this is normal.
4. Press **Ctrl + D**.
5. A prompt will appear: **"To turn OS verification OFF, press ENTER."** Press **Enter**.
6. The Chromebook will restart. This takes 5–10 minutes and will show **"Preparing system for Developer Mode."**
7. After it finishes, you will see a screen saying **"OS verification is OFF"** on every boot. Press **Ctrl + D** to continue booting normally, or wait 30 seconds and it will proceed automatically.
8. Go through the ChromeOS setup process again and sign into your Google account.

---

## Step 2 — Open the ChromeOS Terminal

1. Press **Ctrl + Alt + T** to open a Crosh terminal.
2. Type `shell` and press Enter.

You are now in a bash shell inside ChromeOS.

---

## Step 3 — Run the chrx Installer (Phase 1)

Copy and paste the following command exactly:

```bash
cd ; curl -Os https://chrx.org/go && sh go
```

The installer will:
- Detect your hardware
- Show you your device's compatibility
- Ask how much space to allocate to Linux vs ChromeOS

**Recommended allocation:** Give Linux at least **9 GB**. chrx will suggest a split — for most Chromebooks with 16 GB storage, something like 9 GB Linux / 5 GB ChromeOS works well. All your data lives in Google Drive so ChromeOS does not need much local space.

Follow the on-screen prompts. When it is done, it will ask you to **reboot**. Do so.

---

## Step 4 — Run chrx Again (Phase 2)

After rebooting, you will be back at the **"OS verification is OFF"** screen. Press **Ctrl + D** to boot into ChromeOS.

1. Sign in again and open Crosh: **Ctrl + Alt + T** → type `shell` → Enter.
2. Run the same command again:
   ```bash
   cd ; curl -Os https://chrx.org/go && sh go
   ```
3. This time, Phase 2 begins — the actual Linux installation. This downloads and installs GalliumOS. It takes 10–30 minutes depending on your internet speed.
4. When complete, chrx will tell you to reboot again.

---

## Step 5 — Boot into Linux

After the final reboot:

1. You will see the **"OS verification is OFF"** screen.
2. Press **Ctrl + L** to boot into **Linux (GalliumOS)**.
3. Press **Ctrl + D** (or wait) to boot into **ChromeOS**.

**Default GalliumOS login:**
- Username: `chrx`
- Password: `chrx`

> **Change your password immediately** — open a terminal and run:
> ```bash
> passwd
> ```

---

## Step 6 — First Setup in GalliumOS

GalliumOS is based on Xubuntu (Ubuntu 18.04 LTS). Standard Ubuntu/Debian commands work.

### Update the system:
```bash
sudo apt update && sudo apt upgrade -y
```

### Install common apps:
```bash
sudo apt install firefox vlc gimp libreoffice -y
```

### Fix audio if not working:
GalliumOS ships with Chromebook-specific audio patches. If audio is not working:
```bash
sudo apt install galliumos-braswell   # For Braswell CPUs
# or
sudo apt install galliumos-skylake    # For Skylake CPUs
```
Check [wiki.galliumos.org](https://wiki.galliumos.org) for your specific hardware package.

---

## Removing Linux and Going Back to ChromeOS Only

If you want to undo everything and restore ChromeOS:

1. Boot into ChromeOS (**Ctrl + D** at startup).
2. Go to **Settings** → **About ChromeOS** → **Powerwash** to factory reset.

Or use a ChromeOS recovery USB:
1. On another computer, go to [google.com/chromeos/recovery](https://google.com/chromeos/recovery).
2. Download the recovery tool and create a USB for your Chromebook model.
3. Boot the Chromebook from the USB while holding **Esc + Refresh + Power**.

---

## Alternative: Linux Apps Inside ChromeOS (No Dual Boot)

If your goal is just to run Linux apps without replacing ChromeOS, modern Chromebooks (2019+) support **Linux (Beta)** built in — no Developer Mode needed:

1. Go to **Settings** → **Advanced** → **Developers** → **Linux development environment**.
2. Click **Turn On** and follow the setup wizard.
3. A Debian-based Linux container installs automatically.
4. Open the **Terminal** app to use it.

This is much simpler and safer. The trade-off is it runs in a container (slightly limited) rather than as a full OS.

---

## USB Install Method (ISO — Full Replace, No Dual Boot)

If your Chromebook is not supported by chrx, or you want to replace ChromeOS entirely:

1. Check [wiki.galliumos.org/Hardware_Compatibility](https://wiki.galliumos.org/Hardware_Compatibility) for your hardware's **CPU family**.
2. Download the matching GalliumOS ISO from [galliumos.org/download](https://galliumos.org/download).
3. Flash it to a USB drive using [balenaEtcher](https://etcher.balena.io).
4. Enable Developer Mode (Step 1 above) and enable UEFI/Legacy firmware using [MrChromebox's firmware utility](https://mrchromebox.tech/#fwscript).
5. Boot from the USB by pressing **Ctrl + L** at startup, then selecting the USB device.
6. Install GalliumOS from the live desktop using the **Install GalliumOS** shortcut.

> **Note:** This replaces ChromeOS entirely. The process is more complex and requires running a firmware script that modifies your Chromebook's BIOS. Only do this if you are comfortable with the risk and have confirmed your hardware is supported.
