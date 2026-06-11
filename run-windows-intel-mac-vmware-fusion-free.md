---
layout: default
title: "Run Windows 11 on Intel Mac with VMware Fusion (Free)"
parent: "Installation Guides"
nav_order: 10
---

# Run Windows 11 on Intel Mac with VMware Fusion (Free)

VMware Fusion is now completely free for personal use after Broadcom acquired VMware in 2024. On Intel Macs, it can run the standard x86 Windows 11 — no ARM version needed, no workarounds. This is the most straightforward way to run Windows on an Intel Mac.

> **Intel Mac only.** If you have an Apple Silicon Mac (M1/M2/M3/M4), see the guide *Run Windows 11 on Apple Silicon Mac for Free* instead — it covers VMware Fusion and UTM for ARM.

---

## Requirements

- An Intel Mac running macOS 13 (Ventura) or later — VMware Fusion Pro 25H2 requires macOS Ventura as the minimum host OS
- At least **8 GB RAM** (16 GB recommended — plan to give Windows 4–6 GB)
- At least **60 GB free disk space**
- A free Broadcom account to download VMware Fusion
- A Windows 11 license (or use it unactivated for evaluation — minor cosmetic limitations apply)

---

## Step 1 — Download VMware Fusion

1. Go to [support.broadcom.com](https://support.broadcom.com) and create a free account.
2. Once logged in, go to **My Downloads** and search for **VMware Fusion**.
3. Select the latest version of **VMware Fusion for macOS** and download it.
4. Open the `.dmg` and drag VMware Fusion to your Applications folder.
5. Open VMware Fusion. When asked for a license key, select **Use for Personal Use** — no key required. Despite the label, this unlocks the full free version for both personal and commercial use as of November 2024.

---

## Step 2 — Download the Windows 11 ISO

1. Go to [microsoft.com/software-download/windows11](https://www.microsoft.com/software-download/windows11).
2. Scroll to **Download Windows 11 Disk Image (ISO) for x64 devices**.
3. Select **Windows 11 (multi-edition ISO for x64 devices)**, click **Download Now**, choose your language, and download. About 5–6 GB.

---

## Step 3 — Create the Windows 11 Virtual Machine

1. Open **VMware Fusion**.
2. Click **+** → **New Virtual Machine**.
3. Choose **Install from disc or image** and click **Continue**.
4. Click **Choose a disc or disc image** and select your Windows 11 ISO.
5. VMware will detect it as Windows 11 automatically.
6. You may see **Easy Install** — fill in your name and optionally a Windows product key (you can skip this and activate later).
7. Click **Continue** → **Finish**.

---

## Step 4 — Configure VM Settings (Before First Boot)

Before starting the VM, click **Customize Settings**:

- **Processors & Memory:** set RAM to at least **4096 MB** (4 GB), ideally **6144 MB** (6 GB). Set CPU cores to **2–4**.
- **Hard Disk:** the default 60 GB is fine. Increase if you plan to install large apps.
- **Display:** enable **Accelerate 3D Graphics** for better performance.
- **Network Adapter:** leave as **NAT** — shares your Mac's internet connection.

Close settings and click **Start** to boot.

---

## Step 5 — Install Windows 11

Windows 11 installs automatically with Easy Install. The VM will reboot a few times — leave it running. When it finishes, Windows will boot to the desktop. Sign in with a Microsoft account or choose **Offline account** for a local account.

---

## Step 6 — Install VMware Tools

VMware Tools installs display drivers, enables clipboard sharing, and improves mouse behaviour.

1. In the VMware Fusion menu bar, go to **Virtual Machine** → **Install VMware Tools**.
2. A disc mounts inside Windows. Open it in File Explorer.
3. Run **setup.exe** → **Next** → **Next** → **Install** → **Finish**.
4. Restart Windows when prompted.

After restarting, the display will auto-scale to fit the VMware Fusion window and clipboard sharing between macOS and Windows will work.

---

## Shared Folder Between macOS and Windows

1. In VMware Fusion, go to **Virtual Machine** → **Settings** → **Sharing**.
2. Enable **Share Mac folder with Windows** and add the folders you want to share.
3. Inside Windows, shared folders appear under **Network** → **vmware-host** → **Shared Folders** in File Explorer, or as a mapped Z: drive.

---

## Useful Settings

| Setting | Where to find it |
|---|---|
| Run Windows in full screen | View → Full Screen, or press Ctrl+Command+F |
| Run Windows in a separate window | View → Single Window |
| Pause the VM | Virtual Machine → Pause |
| Suspend to save state | Virtual Machine → Suspend |
| Take a snapshot before risky changes | Virtual Machine → Snapshots → Take Snapshot |

---

## Troubleshooting

### Windows 11 says "This PC doesn't meet requirements"
On Intel Mac, this should not happen in VMware Fusion as it passes the hardware checks automatically. If you see it, make sure the ISO is Windows 11 (not Windows 10) and that VMware detected it correctly during VM creation.

### Display stays small after VMware Tools install
Go to **View** → **Fit Guest to Window** or resize the VMware Fusion window — the guest display should follow.

### No sound in Windows
Go to **Virtual Machine** → **Settings** → **Sound Card** and make sure it is connected.

### Network not working in Windows
Go to **Virtual Machine** → **Settings** → **Network Adapter** → confirm it is set to **NAT** and the adapter is connected.
