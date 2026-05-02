---
layout: default
title: "Install Windows 11 as a VM in Proxmox"
parent: "Installation Guides"
nav_order: 16
---

# Install Windows 11 as a VM in Proxmox

Installing Windows 11 in Proxmox is more involved than Linux VMs because Windows 11 requires TPM 2.0, Secure Boot, and UEFI — and Windows does not ship with the VirtIO drivers that Proxmox uses for storage and networking. Without loading those drivers during setup, Windows cannot see your virtual disk and the installer shows no drives at all.

This guide covers the complete setup including VirtIO drivers, the TPM requirement, bypassing the Microsoft account requirement, and installing the QEMU Guest Agent for full integration.

---

## What You Need

- A working Proxmox installation
- A **Windows 11 ISO** — download from [microsoft.com/software-download/windows11](https://www.microsoft.com/software-download/windows11)
- The **VirtIO drivers ISO** — download the latest stable from [pve.proxmox.com/wiki/Windows_VirtIO_Drivers](https://pve.proxmox.com/wiki/Windows_VirtIO_Drivers) (direct link to latest: `https://fedorapeople.org/groups/virt/virtio-win/direct-downloads/stable-virtio/virtio-win.iso`)
- At least **4 GB RAM** allocated to the VM (8 GB recommended)
- At least **64 GB storage** for the VM disk

---

## Step 1 — Upload Both ISOs to Proxmox

1. In the Proxmox web UI, go to your storage (usually **local**) → **ISO Images** → **Upload**.
2. Upload both the **Windows 11 ISO** and the **virtio-win ISO**.
3. Wait for both uploads to complete.

---

## Step 2 — Create the VM

In the Proxmox web UI, click **Create VM** in the top right.

### General Tab
- **Name:** `windows11` (or anything you like)
- **VM ID:** leave as default

### OS Tab
- **ISO image:** select your Windows 11 ISO
- **Guest OS Type:** Microsoft Windows
- **Version:** 11/2022/2025
- ✅ **Add additional drive for VirtIO drivers** — check this box. It will appear as an option here.
- Select the **virtio-win ISO** for the additional drive

### System Tab
- **Machine:** q35
- **BIOS:** OVMF (UEFI) — **not** SeaBIOS
- ✅ **Add EFI Disk** — check this and select your storage
- ✅ **Add TPM** — check this, select your storage, version **v2.0**
- ✅ **Qemu Agent** — enable this

### Disks Tab
- **Bus/Device:** SCSI
- **Storage:** select your storage
- **Disk size:** 64 GB minimum, 100 GB recommended
- **Cache:** Write back (better performance) or No cache (safer)
- ✅ **Discard** — enable for thin provisioning/TRIM support
- ✅ **IO Thread** — enable for better performance

### CPU Tab
- **Cores:** 2 minimum, 4 recommended
- **Type:** host (best performance)

### Memory Tab
- **Memory:** 4096 MB minimum, 8192 MB recommended

### Network Tab
- **Model:** VirtIO (paravirtualized) — not E1000 or RTL8139

### Confirm Tab
- Do **not** check **Start after created** — you need to verify settings first
- Click **Finish**

---

## Step 3 — Verify Boot Order

Before starting:

1. Select your new VM → **Hardware** → confirm both CD drives are there:
   - CD Drive 0: Windows 11 ISO
   - CD Drive 1: virtio-win ISO

2. Go to **Options** → **Boot Order** — make sure the Windows 11 CD drive is first.

---

## Step 4 — Start the VM and Install Windows

1. Select your VM and click **Start**, then click **Console** to open the display.
2. Press any key when prompted to boot from CD — do this quickly.
3. Work through the Windows installer:
   - Language, time, keyboard → **Next**
   - Click **Install now**
   - Enter a product key or click **I don't have a product key**
   - Select **Windows 11 Pro** → **Next**
   - Accept the license → **Next**
   - Select **Custom: Install Windows only (advanced)**

### Load the VirtIO Storage Driver (Critical Step)

At the disk selection screen, **no drives will be shown** — this is expected. Click **Load driver**:

1. Click **Browse**
2. Navigate to the VirtIO CD drive (usually D: or E:)
3. Open the folder: `vioscsi` → `w11` → `amd64`
4. Click **OK**
5. Select **Red Hat VirtIO SCSI pass-through controller** → **Next**

Your virtual disk will now appear. Select it and click **Next**.

Windows will install and reboot several times. The VM will reboot automatically — leave it running.

---

## Step 5 — Complete Windows Setup

After installation, Windows will start the OOBE (Out of Box Experience) setup.

### Skip the Microsoft Account Requirement

Windows 11 forces a Microsoft account during setup. To use a local account instead:

When you reach the **"Let's connect you to a network"** screen, press **Shift + F10** to open Command Prompt, then run:

```cmd
oobe\bypassnro
```

The VM will restart and you will now have an **"I don't have internet"** option. Click it and create a local account.

> **Note:** On Windows 11 24H2 and later, `OOBE\BYPASSNRO` no longer works. Use this instead at the Shift+F10 command prompt:
> ```cmd
> start ms-cxh:localonly
> ```

Complete the rest of setup normally.

---

## Step 6 — Install VirtIO Guest Tools (Essential)

After reaching the Windows desktop:

1. Open **File Explorer** → find the VirtIO CD drive (D: or E:).
2. Run **`virtio-win-guest-tools.exe`** from the root of the VirtIO disc — this installs everything at once: network drivers, balloon driver, QEMU agent, display driver.
3. Follow the installer → **Next** → **Install** → **Finish**.
4. Restart the VM.

After restarting:
- The VM's IP address will appear in the Proxmox summary tab
- Shutdown/restart from Proxmox will work cleanly
- Memory ballooning will be active

---

## Step 7 — Switch to RDP for Daily Use

The Proxmox noVNC console is fine for setup but slow for daily use. RDP is significantly faster, supports clipboard, and gives proper resolution.

1. In Windows, search for **Remote Desktop settings** → enable **Remote Desktop**.
2. Find your VM's IP address in the Proxmox summary tab.
3. From another machine, open Remote Desktop Connection (Windows) or Microsoft Remote Desktop (macOS/iOS) and connect to the VM's IP.

---

## Step 8 — Take a Snapshot

Before installing any software, take a clean snapshot:

In Proxmox, select your VM → **Snapshots** → **Take Snapshot** → name it `clean-install` → **Take Snapshot**.

If anything breaks later, you can restore to this state in seconds.

---

## Troubleshooting

### No drives visible during Windows install
You did not load the VirtIO storage driver. Click **Load driver** and navigate to `vioscsi\w11\amd64` on the VirtIO ISO.

### No network adapter in Windows
The VirtIO network driver is missing. Open **Device Manager** (press Shift+F10 during setup → type `devmgmt.msc`). Under **Other devices**, right-click the unknown network adapter → **Update driver** → **Browse my computer** → point it to the VirtIO CD → `NetKVM\w11\amd64`.

### Mouse pointer is offset in console
Install VirtIO Guest Tools (Step 6). The QEMU display driver fixes mouse alignment.

### Windows says TPM not found
Make sure you enabled **Add TPM v2.0** in the System tab when creating the VM. If the VM already exists, go to **Hardware** → **Add** → **TPM State** → select v2.0.

### VM stuck in restart loop during setup
Wait — Windows 11 reboots 2–3 times during installation. Leave it running for at least 15 minutes before assuming something is wrong.

### OOBE/BYPASSNRO not working (Windows 11 24H2+)
Use `start ms-cxh:localonly` at the Shift+F10 command prompt instead.