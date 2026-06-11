---
layout: default
title: "Run macOS from an External USB Drive"
parent: "Installation Guides"
nav_order: 31
---

# Run macOS from an External USB Drive

You can install and run a full macOS on an external SSD or USB drive. Useful for testing a new macOS version before upgrading, recovering from a bad internal drive, or having a clean portable macOS.

---

## Requirements

- External SSD (512GB minimum, SSD strongly recommended — USB flash drives are too slow)
- USB 3.0 or Thunderbolt connection
- About 2–3 hours

---

## Create a Bootable macOS Installer

First download the macOS installer from the App Store (search "macOS Sequoia" or the version you want).

Format your external drive:
1. Open **Disk Utility**
2. Select your external drive → **Erase**
3. Format: **APFS**, Scheme: **GUID Partition Map**
4. Name it "MyVolume"

Create the installer USB:
```bash
# macOS Sequoia
sudo /Applications/Install\ macOS\ Sequoia.app/Contents/Resources/createinstallmedia --volume /Volumes/MyVolume
```

---

## Install macOS to the External Drive

1. Restart your Mac
2. **Intel Mac:** Hold Option at boot → select the USB installer
3. **Apple Silicon:** Hold power button → Options → continue to boot menu → select USB
4. Open **Disk Utility** → format the external SSD as APFS
5. Close Disk Utility
6. Select **Install macOS** → choose your external SSD as the destination

Installation takes 30–60 minutes and reboots several times.

---

## Boot from the External macOS

**Intel Mac:** Hold **Option** at startup → select the external drive

**Apple Silicon:** Hold **power button** → select the external macOS in the boot menu

Set as default boot disk: System Settings → General → Startup Disk → select external drive → Restart

---

## Performance Expectations

- **USB 3.0 flash drive:** Unusably slow. Do not attempt.
- **USB 3.0 SSD enclosure:** Usable, noticeable lag
- **USB 3.1 Gen 2 or Thunderbolt SSD:** Fast, close to internal speed

---

## Use Case — Test New macOS Before Upgrading

Install the new macOS on an external drive and test your apps and workflow before committing to upgrading your internal drive. If anything breaks, just boot back from your internal macOS.
