---
layout: default
title: "Install ChromeOS with Brunch Framework"
parent: "Installation Guides"
nav_order: 1
---

# ChromeOS with Brunch Framework – Laptop Installation Guide

This guide explains how to install **ChromeOS with the Brunch Framework** on a laptop (bare metal).
It works on most modern Intel-based laptops with **UEFI firmware**.

---

## 🧩 About ChromeOS and Brunch

The **Brunch Framework** allows you to run official ChromeOS images on normal laptops —
similar to how **OpenCore Legacy Patcher (OCLP)** enables macOS on unsupported Macs.

**Key Features:**

* Full **Google Play Store** access
* **Linux (Crostini)** support
* Access to ChromeOS features like **Android apps**, **Google Assistant**, and Linux containers

> 💡 **Note:** Some older laptops may have limited hardware support. Check community forums if features like Wi-Fi or GPU acceleration don’t work out of the box.

---

> ⚠️ **Important:** Installing ChromeOS with Brunch will **erase all data** on your internal storage. Back up important files before proceeding.

---

## 🧰 Requirements

* **Wi-Fi connection** (recommended)
* **ChromeOS Recovery Image:** [https://cros.download/recovery](https://cros.download/recovery)
* **Torrent client:** [Free Download Manager](https://freedownloadmanager.org) or any client supporting `.torrent` or magnet links
* **Brunch Framework:** [https://github.com/sebanc/brunch](https://github.com/sebanc/brunch)
* **Ubuntu ISO:** [https://ubuntu.com/download/desktop](https://ubuntu.com/download/desktop) (any recent version)
* **Balena Etcher:** [https://etcher.balena.io/#download-etcher](https://etcher.balena.io/#download-etcher)
* **USB drive:** at least 16 GB
* **UEFI system** (recommended; enable in BIOS if available)

> 💡 **Note:** This guide assumes **UEFI mode**. Some steps may not work on Legacy BIOS systems.

---

## 💡 Part 1: Choosing the Right ChromeOS Firmware

Each ChromeOS image corresponds to a specific hardware generation (“board”).
Choose the one that matches your laptop’s CPU generation.

| CPU Generation      | Recommended Board Name | Example Device          |
| ------------------- | ---------------------- | ----------------------- |
| 6th–8th Gen Intel   | Eve, Nami              | Pixelbook, Acer Spin 13 |
| 9th–10th Gen Intel  | Hatch                  | ASUS Flip C436          |
| 11th Gen Intel      | Volteer                | Lenovo ThinkPad C13     |
| 12th–13th Gen Intel | Brya                   | HP Dragonfly Chromebook |

> 💡 **Note:** The table is **for guidance only** and may not be fully accurate. Laptop variations may require trial and error to find a firmware that boots correctly.

---

## 🔧 Part 2: Prepare the Ubuntu USB

You can create the bootable USB on **Windows, macOS, or Linux**:

1. Download the Ubuntu ISO using your torrent client.
2. Open **Balena Etcher**, click **Flash from File**, and select the Ubuntu ISO.
3. Click **Select Target**, choose your USB drive, and press **Flash**.

   * On **macOS**, enter your admin password.
   * On **Windows**, approve the UAC prompt.
   * On **Linux**, enter your sudo password.

> 💡 **Tip:** Double-check the selected USB drive to avoid accidentally erasing another drive.

---

## 💻 Part 3: Boot from USB

1. Insert the USB drive into your laptop.
2. Power on and enter the **Boot Menu** (often `F12`, `F9`, `ESC`, or `DEL`).
3. Select your USB drive and press **Enter**.
4. At the GRUB menu, choose **Try or Install Ubuntu**.
5. Select **Try Ubuntu** (you do not need to install it).

---

## ⚙️ Part 4: Install ChromeOS with Brunch Framework

> ⚠️ **Warning:** This process will erase **all data** on your internal drive. Verify your target drive carefully.

1. Extract the **Brunch Framework ZIP** you downloaded from GitHub.

2. Extract the `.bin.zip` file from the ChromeOS Recovery image using your GUI archive manager.

3. Copy the extracted `.bin` file to your **Brunch folder**.

4. Open **Terminal** and navigate to your Brunch folder:

   ```bash
   cd /path/to/BRUNCH_FOLDER
   ```

5. **Check your internal storage device** before running the installer:

   ```bash
   lsblk
   ```

   Identify your internal drive (NVMe or SATA SSD/HDD) by its size and name (`/dev/nvme0n1` or `/dev/sda`).

6. Run the ChromeOS installer as root:

   ```bash
   sudo bash chromeos-install.sh -src YOUR_CHROMEOS_FIRMWARE.bin -dst /dev/YOUR_INTERNAL_STORAGE
   ```

7. When prompted, type `Y` to confirm erasing your internal drive.

8. Wait until you see **“Success”**.

9. Reboot or power off your laptop.

10. Remove the USB drive.

11. Power on — ChromeOS should start. Complete the on-screen setup.

> 💡 **Tip:** Triple-check the destination drive to avoid wiping the wrong device.

> 💡 **Tip:** If the system doesn’t boot, try a different firmware matching your CPU generation.

---

## ✅ Congratulations!

You’ve successfully installed **ChromeOS with Brunch Framework** on your laptop!
Enjoy the **speed, simplicity, and full functionality** of ChromeOS. 🎉
