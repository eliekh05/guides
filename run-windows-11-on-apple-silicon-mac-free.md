---
layout: default
title: "Run Windows 11 on Apple Silicon Mac for Free (M1 / M2 / M3 / M4)"
parent: "Installation Guides"
nav_order: 4
---

# Run Windows 11 on Apple Silicon Mac for Free (M1 / M2 / M3 / M4)

Boot Camp is gone on Apple Silicon Macs. You cannot install Windows natively or dual-boot it. The only supported path is **virtualization** — running Windows inside macOS as a virtual machine. This guide covers two completely free options: **VMware Fusion** (easiest, best performance) and **UTM** (free and open-source).

> **Important:** Apple Silicon Macs can only run **Windows 11 ARM** — not the standard x86 version. Windows 11 ARM includes a built-in emulation layer that runs most regular Windows apps, but some software (especially antivirus, low-level utilities, and older games) may not work.

---

## Which Option Should You Choose?

| | VMware Fusion | UTM |
|---|---|---|
| Cost | Free (personal use) | Free |
| Setup difficulty | Medium | Medium–Hard |
| Performance | Excellent | Good |
| 3D / DirectX | DirectX 11 via Metal | No GPU acceleration |
| Good for | Productivity, apps, dev | Tinkering, lightweight use |

**Recommendation:** Use **VMware Fusion** for most users. Use **UTM** if you want fully open-source software or VMware's registration process is a barrier.

---

## Option A — VMware Fusion (Free, Best Performance)

VMware Fusion is now free for personal use after Broadcom acquired VMware. It supports DirectX 11 via Apple's Metal graphics API and delivers very good performance on all M-series Macs.

### Step 1 — Register and Download VMware Fusion

1. Go to [support.broadcom.com](https://support.broadcom.com).
2. Create a free account (required — there is no way around this).
3. After logging in, go to **My Downloads**.
4. Search for **VMware Fusion**.
5. Select the latest version for macOS and download it.
6. Open the `.dmg` and drag VMware Fusion to your Applications folder.

### Step 2 — Get the Windows 11 ARM ISO

Microsoft does not sell Windows 11 ARM directly to individuals, but it is available free through the **Windows Insider Preview** program.

1. Go to [microsoft.com/en-us/software-download/windowsinsiderpreviewARM64](https://www.microsoft.com/en-us/software-download/windowsinsiderpreviewARM64).
2. Sign in with a free Microsoft account.
3. Join the **Windows Insider Program** if prompted — choose the **Release Preview** channel (most stable).
4. Select **Windows 11 Client ARM64 Insider Preview** and download the ISO. It is about 5–6 GB.

> **Alternative:** Some versions of VMware Fusion have a **"Get Windows"** button built into the new VM wizard that downloads the ISO for you automatically. Try this first when creating a new VM — it saves steps.

### Step 3 — Create the Windows 11 Virtual Machine

1. Open **VMware Fusion**.
2. Click **+** → **New Virtual Machine**.
3. Choose **Install from disc or image** and click **Continue**.
4. Drag your Windows 11 ARM ISO into the window, or click **Choose a disc or disc image** to locate it.
5. VMware will detect it as Windows 11 ARM automatically.
6. Click **Continue** → **Finish**.
7. VMware may ask to confirm firmware settings — accept the defaults (UEFI with Secure Boot enabled).

### Step 4 — Install Windows

1. The VM will start and boot into the Windows installer automatically.
2. Select your language and keyboard layout.
3. Click **Install now**.
4. When asked for a product key, click **I don't have a product key** — you can activate later with a Windows 11 license, or use it unactivated for evaluation (minor cosmetic limitations apply).
5. Select **Windows 11 Pro** and click **Next**.
6. Accept the license agreement.
7. Choose **Custom: Install Windows only**.
8. Select the virtual disk and click **Next**. Installation takes 10–20 minutes.

### Step 5 — Install VMware Tools (Important)

After Windows finishes installing and you reach the desktop:

1. In the VMware Fusion menu bar, go to **Virtual Machine** → **Install VMware Tools**.
2. A disc image will mount inside Windows. Open it in File Explorer.
3. Run **setup.exe** and follow the prompts.
4. Restart the VM when prompted.

VMware Tools installs drivers for display scaling, clipboard sharing between macOS and Windows, and better mouse integration.

### Step 6 — Configure for Best Performance (Optional)

1. Shut down the Windows VM.
2. In VMware Fusion, select the VM and click **Settings** (the wrench icon).
3. Under **Processors & Memory**: allocate at least **4 GB RAM** (8 GB recommended if your Mac has 16 GB+) and **4 CPU cores**.
4. Under **Display**: enable **Accelerate 3D Graphics** for better performance.
5. Start the VM again.

---

## Option B — UTM (Fully Free and Open-Source)

UTM is a free macOS app that wraps QEMU. It is a good option if you want entirely open-source software or prefer not to register with Broadcom. Performance is slightly lower than VMware Fusion, and there is no 3D/DirectX acceleration.

### Step 1 — Download UTM

- **Free version:** [mac.getutm.app](https://mac.getutm.app) — download and drag to Applications.
- **Mac App Store version:** $9.99 — same app, gets automatic updates.

### Step 2 — Get the Windows 11 ARM ISO

Use the same Microsoft Insider Preview method from **Option A, Step 2** above.

Alternatively, use **CrystalFetch** (free Mac App Store app) which automates the ISO download for you:
1. Install CrystalFetch from the Mac App Store.
2. Open it, select **Windows 11 ARM64**, and click Download.
3. It will download the official ISO directly from Microsoft.

### Step 3 — Create the Virtual Machine

1. Open **UTM** and click **+** (Create a New Virtual Machine).
2. Select **Virtualize** (not Emulate — this runs natively on ARM for full speed).
3. Select **Windows**.
4. Check **Import VHDX Image** — leave this unchecked unless you have an existing VHDX.
5. Under **Boot ISO Image**, click **Browse** and select your Windows 11 ARM ISO.
6. Click **Continue**.
7. Set **Memory** to at least 4096 MB (4 GB). 8 GB is better.
8. Set **CPU Cores** to 4.
9. Set **Storage** to at least 64 GB.
10. Click **Continue** → **Save**.

### Step 4 — Install Windows

1. Click the **Play** button to start the VM.
2. When you see "Press any key to boot from CD/DVD..." — click inside the VM window and press any key quickly.
3. The Windows installer will start. Follow the same steps as Option A, Step 4.
4. Installation takes 15–25 minutes.

### Step 5 — Install SPICE Guest Tools

After Windows is installed and you are at the desktop:

1. In UTM's toolbar, click the drive icon and select **Install Guest Tools** — this mounts the SPICE tools disc inside Windows.
2. In Windows, open File Explorer → This PC, and run the `spice-guest-tools` installer from the mounted drive.
3. Restart the VM.

SPICE tools enable clipboard sharing and better display resolution support.

### Step 6 — Fix Network if Not Working

Some users find that network stops working after installing guest tools. If this happens:

1. Shut down the VM.
2. In UTM, click **Edit** (the sliders icon) on your VM.
3. Go to **Network** → change **Network Mode** from **Shared Network** to **Emulated VLAN**.
4. Start the VM again.

---

## Shared Folder Between macOS and Windows

### VMware Fusion:
Go to **Settings** → **Sharing** → enable **Share Mac folder with Windows** and choose a folder.

### UTM:
1. In UTM settings for the VM, go to **Shared Directory** and select a macOS folder.
2. Inside Windows, open File Explorer. The shared folder appears as a network drive under **\\mac\Shared**.

---

## Limitations on Apple Silicon

| Feature | Works? |
|---|---|
| Standard Windows x86 apps | ✅ Most work via ARM emulation |
| Office, browsers, productivity apps | ✅ Yes |
| DirectX 11 games (VMware) | ✅ Many work |
| DirectX 12 games | ❌ Not supported |
| Antivirus software | ⚠️ Varies by vendor |
| Windows Hello | ❌ No biometric hardware |
| Native dual boot | ❌ Not possible on Apple Silicon |

---

> **Summary:** VMware Fusion is the better choice for most people — more polished, better performance, and DirectX 11 support. UTM is the right pick if you want fully open-source software and do not mind a slightly more manual process. Both are completely free.
