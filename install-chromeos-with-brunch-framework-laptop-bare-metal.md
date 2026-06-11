---
layout: default
title: "Install ChromeOS with Brunch Framework on a Laptop"
parent: "Installation Guides"
nav_order: 1
---

# Install ChromeOS with Brunch Framework on a Laptop (Bare Metal)

> ⚠️ **Read this before starting.** Brunch is still technically working but is increasingly unreliable on newer Chrome OS versions and has no active developer support. Issues reported on GitHub as recently as 2026 are going unanswered. If your goal is simply to run ChromeOS on a PC laptop, **[Chrome OS Flex](install-chrome-os-flex-laptop-pc)** is the official, maintained, and far easier alternative. Use Brunch only if you specifically need Google Play Store or Android app support, which Chrome OS Flex does not have.

> **Hardware requirement:** Brunch only supports **Intel 8th gen or newer**, or **AMD Ryzen**. Older Intel CPUs are not supported — use Chrome OS Flex instead.

> ⚠️ **Installing ChromeOS with Brunch will erase all data on your internal storage.** Back up everything first.

---

## Why Use Brunch Instead of Chrome OS Flex?

| Feature | Brunch | Chrome OS Flex |
|---|---|---|
| Google Play Store / Android apps | ✅ Yes | ❌ No |
| Linux (Crostini) | ✅ Yes | ✅ Yes |
| Official Google support | ❌ No | ✅ Yes |
| Works on older Intel CPUs (pre-8th gen) | ❌ No | ✅ Yes |
| Ease of setup | Hard | Easy |
| Actively maintained | ⚠️ Barely | ✅ Yes |

If you do not need Android apps, use Chrome OS Flex. If you do, continue with this guide.

---

## Requirements

- **Intel 8th gen+ or AMD Ryzen CPU** (check with `lscpu` in Linux or Task Manager → CPU on Windows)
- **UEFI firmware** (must be enabled in BIOS — Legacy BIOS is not supported)
- **16 GB+ USB drive** (for the Ubuntu live environment)
- **Wi-Fi or Ethernet** connection
- **ChromeOS Recovery Image** — download from [cros.download/recovery](https://cros.download/recovery)
- **Brunch Framework** — download latest release from [github.com/sebanc/brunch/releases](https://github.com/sebanc/brunch/releases)
- **Ubuntu ISO** — [ubuntu.com/download/desktop](https://ubuntu.com/download/desktop)
- **balenaEtcher** — [etcher.balena.io](https://etcher.balena.io)

---

## Part 1 — Choose the Right ChromeOS Recovery Image

Each ChromeOS image is built for specific hardware. Choose based on your CPU generation:

| CPU Generation | Board Name to Use | Notes |
|---|---|---|
| 8th–10th Gen Intel | `hatch` | Most compatible for this range |
| 11th Gen Intel | `volteer` | |
| 12th–13th Gen Intel | `brya` | |
| AMD Ryzen | `guybrush` or `zork` | Try both if one does not boot |

> **Note:** These are starting points. If one board does not boot, try another from the same generation. Community forums like [r/Brunch](https://reddit.com/r/Brunch) have per-model recommendations.

At [cros.download/recovery](https://cros.download/recovery), search for your board name and download the latest `.bin.zip` file.

---

## Part 2 — Create a Bootable Ubuntu USB

1. Download the Ubuntu ISO and open **balenaEtcher**.
2. Select the Ubuntu ISO → select your USB drive → click **Flash**.
3. Wait for it to finish.

---

## Part 3 — Boot from the USB

1. Insert the USB into your laptop.
2. Restart and enter the boot menu — usually **F12**, **F9**, **Esc**, or **Del** depending on your manufacturer.
3. Select the USB drive.
4. At the GRUB menu, select **Try or Install Ubuntu**.
5. Select **Try Ubuntu** — do not install it.

---

## Part 4 — Install ChromeOS with Brunch

> ⚠️ **Triple-check the destination drive.** The next step will erase it completely. Run `lsblk` to identify your internal drive by size.

1. Download the **Brunch Framework ZIP** from GitHub into the Ubuntu live session (use Firefox in Ubuntu).

2. Extract the Brunch ZIP — right-click → Extract Here.

3. Extract the ChromeOS `.bin.zip` file — right-click → Extract Here.

4. Copy the `.bin` file into the Brunch folder.

5. Open **Terminal** (Ctrl+Alt+T in Ubuntu) and navigate to the Brunch folder:
   ```bash
   cd ~/Downloads/brunch_folder_name
   ```

6. Check your internal drive:
   ```bash
   lsblk
   ```
   Identify it by size — usually `/dev/nvme0n1` (NVMe SSD) or `/dev/sda` (SATA).

7. Run the installer:
   ```bash
   sudo bash chromeos-install.sh -src YOUR_RECOVERY_FILE.bin -dst /dev/YOUR_DRIVE
   ```
   Replace `YOUR_RECOVERY_FILE.bin` with the actual filename and `/dev/YOUR_DRIVE` with your internal drive.

8. Type `Y` when prompted to confirm.

9. Wait for **"Installation complete"** — do not interrupt this.

10. Shut down. Remove the USB drive. Power on.

---

## Part 5 — First Boot and Setup

ChromeOS will take a few minutes on the first boot as it expands the partition. If it boots to a ChromeOS setup screen, everything worked. Sign in with your Google account.

If it does not boot (black screen or boot loop):
- Try a different board image (same CPU generation, different board name)
- Make sure UEFI is enabled and Secure Boot is disabled in BIOS
- Check [github.com/sebanc/brunch/issues](https://github.com/sebanc/brunch/issues) for your specific symptom

---

> **Summary:** Brunch is for people who specifically need Android apps on a non-Chromebook PC. It is harder to set up, less reliable than Chrome OS Flex, and barely maintained. If you just want ChromeOS on a laptop, use Chrome OS Flex instead — it takes 20 minutes and just works.
