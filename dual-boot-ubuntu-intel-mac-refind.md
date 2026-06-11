---
layout: default
title: "Dual Boot Ubuntu on an Intel Mac (with rEFInd)"
parent: "Installation Guides"
nav_order: 14
---

# Dual Boot Ubuntu on an Intel Mac (with rEFInd)

Most guides for this skip the rEFInd step entirely, which is exactly why people end up with GRUB hijacking their boot and losing access to macOS. This guide covers the complete process — partition, install rEFInd first, install Ubuntu, fix Wi-Fi if needed — for Intel Macs running macOS Ventura or earlier.

> **Intel Mac only.** This does not work on Apple Silicon (M1/M2/M3/M4). Those Macs cannot dual-boot Linux natively.

> **Back up your Mac with Time Machine before starting.** Partitioning always carries risk.

---

## Why rEFInd?

Apple's built-in boot picker (hold Option at startup) is too basic — it often cannot see Linux partitions at all. GRUB, the Linux bootloader, installs itself in a way that frequently hijacks the entire boot process and leaves macOS inaccessible.

**rEFInd** is an open-source EFI boot manager that sits between the firmware and all your operating systems. It shows a clean boot menu at every startup with icons for each OS and always lets you reach both macOS and Ubuntu. It is the only reliable dual-boot solution on Intel Macs.

---

## Requirements

- An Intel Mac (2009–2021)
- macOS installed and working
- At least **30 GB free space** to give Ubuntu (50 GB+ recommended)
- A USB drive with at least **8 GB** for the Ubuntu installer
- FileVault must be **disabled** — encryption prevents partition resizing

### Disable FileVault

Go to **System Settings** → **Privacy & Security** → **FileVault** → **Turn Off FileVault**. Decryption may take a while. Do not proceed until it completes.

---

## Step 1 — Download Ubuntu

Go to [ubuntu.com/download/desktop](https://ubuntu.com/download/desktop) and download the latest LTS release (the 64-bit `.iso` file). Ubuntu 24.04 LTS as of 2026.

---

## Step 2 — Create a Bootable Ubuntu USB

Download [balenaEtcher](https://etcher.balena.io) on your Mac. Open it, select the Ubuntu ISO, select your USB drive, and click **Flash**.

---

## Step 3 — Create a Partition for Ubuntu

1. Open **Disk Utility** (Applications → Utilities → Disk Utility).
2. Select your Mac's internal drive from the left panel.
3. Click **Partition** at the top.
4. Click **+** to add a new partition.
5. Set the size (30 GB minimum, 50 GB+ recommended).
6. Set the format to **MS-DOS (FAT)** — Ubuntu's installer will format it properly.
7. Name it `UBUNTU` so you can identify it later.
8. Click **Apply** and confirm.

---

## Step 4 — Disable SIP and Install rEFInd

rEFInd must be installed before Ubuntu. Installing Ubuntu first almost always results in GRUB overwriting the EFI partition and breaking macOS boot.

### Disable SIP

1. Restart your Mac and hold **Command (⌘) + R** to boot into Recovery Mode.
2. Go to **Utilities** → **Terminal**.
3. Run:
   ```bash
   csrutil disable
   ```
4. Restart back into macOS.

### Install rEFInd

1. Go to [rodsbooks.com/refind/getting.html](https://www.rodsbooks.com/refind/getting.html) and download the **Binary zip file**.
2. Extract the zip on your Mac Desktop.
3. Open **Terminal** (Applications → Utilities → Terminal).
4. Drag the `refind-install` file from the extracted folder into the Terminal window (this fills in the path automatically).
5. Press **Enter**.
6. Enter your password when prompted.

rEFInd is now installed. On the next restart you should see the rEFInd boot menu with an Apple logo.

### Re-enable SIP

1. Restart and hold **Command + R** to enter Recovery Mode again.
2. Open Terminal and run:
   ```bash
   csrutil enable
   ```
3. Restart.

---

## Step 5 — Install Ubuntu

1. Plug in your Ubuntu USB drive.
2. Restart your Mac. The rEFInd boot menu will appear.
3. Select the USB drive entry (it may show as **Boot EFI** or have a Ubuntu icon).
4. Ubuntu will boot to a live desktop. Click **Install Ubuntu**.
5. Choose your language and keyboard layout.
6. On the **Updates and other software** screen, choose your preferences and click **Continue**.
7. On the **Installation type** screen — this is critical:
   - Select **Something else** (not "Install alongside" — that option often gets the partition wrong on Macs).
8. In the partition table, find the partition you created in Step 3 (labelled `UBUNTU`, listed as `free space` or `FAT32`).
9. Click on it → click **Change**:
   - **Use as:** `Ext4 journaling file system`
   - **Format:** check the box
   - **Mount point:** `/`
10. Find the **EFI partition** — it is typically a small (200–500 MB) `fat32` partition. Do **not** format it. Set **Use as: EFI System Partition** if prompted.
11. Click **Install Now** → **Continue**.
12. Set your time zone, name, username, and password.
13. Wait for installation to complete — 10–20 minutes.
14. Click **Restart Now** when prompted. Remove the USB drive.

---

## Step 6 — First Boot and Choosing Your OS

After restarting, the rEFInd menu will show icons for both macOS and Ubuntu.

- **Boot macOS:** select the Apple logo
- **Boot Ubuntu:** select the Ubuntu entry

If rEFInd does not appear and the Mac boots straight into macOS, hold **Option (⌥)** at startup to access the boot picker manually and select rEFInd from there.

---

## Step 7 — Fix Wi-Fi on Mac in Ubuntu (If Not Working)

Wi-Fi is the most common issue when running Linux on a Mac. Most Macs use **Broadcom** Wi-Fi chips which require a proprietary driver.

### Check what's happening

Open Terminal in Ubuntu and run:
```bash
lspci | grep Network
```

If you see `Broadcom` in the output, you need the `broadcom-sta` driver.

### Fix with ethernet or iPhone hotspot first

You need internet to download the driver. Connect via:
- USB ethernet adapter
- iPhone: Settings → Personal Hotspot → enable **USB only**, connect with Lightning/USB-C cable

### Install the driver

```bash
sudo apt update
sudo apt install broadcom-sta-dkms -y
sudo modprobe -r b43 ssb wl brcmfmac brcmsmac bcma
sudo modprobe wl
```

Restart Ubuntu. Wi-Fi should now appear in the network menu.

If `broadcom-sta-dkms` doesn't fix it, try:
```bash
sudo apt install firmware-b43-installer -y
sudo reboot
```

---

## Step 8 — Fix GRUB Hijacking macOS Boot (If It Happens)

If Ubuntu's GRUB overwrites rEFInd and you can no longer reach macOS:

1. Boot into macOS by holding **Option (⌥)** at startup and selecting **Macintosh HD**.
2. Once in macOS, open Terminal and reinstall rEFInd (repeat Step 4 above).

rEFInd will restore itself as the primary boot manager and both OSes will be accessible again.

---

## Removing Ubuntu and Restoring Mac-Only Boot

1. Boot into macOS.
2. Open **Disk Utility** → select the Ubuntu partition → click **Erase** → format as **APFS** or **Mac OS Extended**.
3. To remove rEFInd, run in Terminal:
   ```bash
   sudo rm -rf /EFI/refind
   sudo bless --setBoot --folder /System/Library/CoreServices
   ```
4. Restart — Mac will boot directly into macOS.

---

## Troubleshooting

### rEFInd menu does not appear at startup
Hold **Option (⌥)** at boot and select the rEFInd entry manually. Then open Terminal in macOS and re-run the rEFInd installer to make it the default.

### macOS disappeared from rEFInd after installing Ubuntu
GRUB hijacked the EFI boot order. Boot into macOS via Option key and reinstall rEFInd.

### Ubuntu installer shows no partitions or wrong disk
Make sure you selected **Something else** in Step 5 and are looking at the correct drive.

### Ubuntu boots but no display / black screen
Some Intel Macs need the `nomodeset` kernel parameter for the first boot. In GRUB, press **e** on the Ubuntu entry, find the line starting with `linux`, add `nomodeset` at the end, and press **F10** to boot. Install proprietary GPU drivers after booting.

### FileVault keeps re-enabling after macOS updates
macOS updates sometimes suggest re-enabling FileVault. Keep it off while you have Ubuntu dual-booted — enabling it can break the partition scheme.
