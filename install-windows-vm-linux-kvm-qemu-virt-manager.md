---
layout: default
title: "Install Windows as a VM on Linux (KVM/QEMU with virt-manager)"
parent: "Installation Guides"
nav_order: 19
---

# Install Windows as a VM on Linux (KVM/QEMU with virt-manager)

KVM (Kernel-based Virtual Machine) is Linux's built-in hypervisor — faster and more efficient than VirtualBox or VMware on Linux. Combined with virt-manager for a GUI, it is the best way to run Windows VMs on Linux. The only catch is VirtIO drivers — Windows does not ship with them and without them you will see no disk and no network during installation.

---

## Requirements

- A Linux host with **Intel VT-x** or **AMD-V** enabled in BIOS
- At least **8 GB RAM**
- At least **60 GB free disk space** for the VM
- A **Windows ISO** (see below for where to get it)
- The **VirtIO drivers ISO** (free, from the Fedora project)

---

## Step 1 — Check Virtualisation Support

```bash
kvm-ok
```

If it says `KVM acceleration can be used`, you are ready. If not, enable VT-x or AMD-V in your BIOS settings.

---

## Step 2 — Install KVM and virt-manager

**Ubuntu / Debian:**
```bash
sudo apt update
sudo apt install -y qemu-kvm libvirt-daemon-system libvirt-clients \
  bridge-utils virt-manager ovmf swtpm swtpm-tools
```

**Fedora:**
```bash
sudo dnf install -y @virtualization
```

**Arch:**
```bash
sudo pacman -S qemu libvirt virt-manager ovmf swtpm bridge-utils
```

Add your user to the required groups and start libvirt:

```bash
sudo usermod -aG kvm,libvirt $(whoami)
sudo systemctl enable --now libvirtd
```

**Log out and back in** for group changes to take effect.

---

## Step 3 — Download the Windows ISO and VirtIO Drivers

**Windows 11 ISO:**
Go to [microsoft.com/software-download/windows11](https://www.microsoft.com/software-download/windows11) and download the 64-bit ISO.

**VirtIO Drivers ISO:**
Download the latest stable ISO from:
```
https://fedorapeople.org/groups/virt/virtio-win/direct-downloads/stable-virtio/virtio-win.iso
```

Move both ISOs somewhere accessible:
```bash
sudo mv ~/Downloads/Win11_*.iso /var/lib/libvirt/images/
sudo mv ~/Downloads/virtio-win.iso /var/lib/libvirt/images/
```

---

## Step 4 — Enable XML Editing in virt-manager

Before creating the VM:

1. Open **virt-manager**.
2. Go to **Edit** → **Preferences**.
3. Check **Enable XML editing**.

This lets you make the Hyper-V optimisations later.

---

## Step 5 — Create the Windows VM

In virt-manager, click the **Create a new virtual machine** button (computer icon):

1. **Step 1:** Select **Local install media (ISO image or CDROM)** → **Forward**
2. **Step 2:** Click **Browse** → **Browse Local** and select your Windows ISO. Make sure virt-manager detects it as Windows 11. → **Forward**
3. **Step 3:** Set RAM (minimum 4096 MB, 8192 MB recommended) and CPUs (2–4) → **Forward**
4. **Step 4:** Create a new disk — set size to 64 GB minimum → **Forward**
5. **Step 5 (final):**
   - Give the VM a name
   - ✅ Check **Customize configuration before install**
   - Click **Finish**

---

## Step 6 — Configure VM Hardware

The customisation window opens. Make these changes:

### Overview
- **Chipset:** Q35
- **Firmware:** UEFI x86_64: `/usr/share/OVMF/OVMF_CODE_4M.fd` (or similar path)

### CPUs
- Click on **CPUs**
- Set **Configuration** → **Model** to `host-passthrough`

### Disk
- Click on your disk (**VirtIO Disk 1** or **SATA Disk 1**)
- Change **Disk bus** from SATA to **VirtIO**
- Set **Cache mode** to `none`
- Set **Discard mode** to `unmap`

### Add TPM (Required for Windows 11)
- Click **Add Hardware** → **TPM**
- **Backend:** Emulated Device
- **Model:** TIS
- **Version:** 2.0
- Click **Finish**

### Add VirtIO Drivers CD Drive
- Click **Add Hardware** → **Storage**
- **Device type:** CDROM device
- Click **Manage** and select `virtio-win.iso`
- Click **Finish**

### Network
- Click on **NIC**
- Change **Device model** to `virtio`

### Add Hyper-V Enlightenments (Improves Performance)

Click the **XML** tab for the VM overview and find the `<features>` section. Add the Hyper-V block inside it:

```xml
<hyperv>
  <relaxed state="on"/>
  <vapic state="on"/>
  <spinlocks state="on" retries="8191"/>
  <vendor_id state="on" value="KVM Hv"/>
  <vpindex state="on"/>
  <runtime state="on"/>
  <synic state="on"/>
  <stimer state="on">
    <direct state="on"/>
  </stimer>
  <frequencies state="on"/>
  <reset state="on"/>
  <tlbflush state="on"/>
</hyperv>
```

Click **Apply**.

---

## Step 7 — Install Windows

Click **Begin Installation**. The VM will start and boot from the Windows ISO.

1. Select language, time, keyboard → **Next** → **Install now**
2. Enter a product key or **I don't have a product key**
3. Select **Windows 11 Pro** → **Next**
4. Accept the license → **Custom: Install Windows only**

### No disk visible? Load the VirtIO storage driver:

1. Click **Load driver**
2. Click **Browse**
3. Navigate to the VirtIO CD drive → `vioscsi` → `w11` → `amd64`
4. Click **OK** → select **Red Hat VirtIO SCSI pass-through controller** → **Next**

Your virtual disk will now appear. Select it and click **Next**.

### Skip the Microsoft account requirement:

When you reach **"Let's connect you to a network"**, press **Shift + F10** and run:

```cmd
oobe\bypassnro
```

The VM restarts. Select **I don't have internet** → create a local account.

> On Windows 11 24H2+, use this instead:
> ```cmd
> start ms-cxh:localonly
> ```

---

## Step 8 — Install VirtIO Guest Tools

After reaching the Windows desktop:

1. Open **File Explorer** → find the VirtIO CD drive.
2. Run `virtio-win-guest-tools.exe` from the root of the drive.
3. Install everything → **Finish** → **Restart**.

After restarting, all drivers (network, display, balloon memory) will be working.

---

## Step 9 — Performance Tuning

### Disable Windows platform clock (reduces CPU overhead):

Open PowerShell as Administrator in the Windows VM:
```powershell
bcdedit /set useplatformclock No
```
Restart the VM.

### Enable Remote Desktop for daily use:

RDP is significantly faster than the virt-manager console.

In Windows: Settings → System → Remote Desktop → **Enable Remote Desktop**.

Connect from Linux using Remmina or any RDP client.

---

## Troubleshooting

### No drives visible during Windows install
Did not load the VirtIO storage driver. Click **Load driver** → navigate to `vioscsi\w11\amd64` on the VirtIO ISO.

### No network after Windows install
VirtIO network driver is missing. Open **Device Manager** (right-click Start) → find the unknown Ethernet device → **Update driver** → **Browse my computer** → select `NetKVM\w11\amd64` on the VirtIO CD.

### TPM not found error during Windows 11 install
Go back to VM hardware settings and add a TPM 2.0 device (see Step 6).

### VM is very slow
- Make sure CPU is set to `host-passthrough`
- Make sure disk bus is VirtIO not SATA
- Make sure KVM is actually enabled (`kvm-ok`)
- Add the Hyper-V enlightenments from Step 6

### Windows activation fails after cloning a VM
Each VM needs its own hardware ID. This is expected — use a fresh Windows install for each VM rather than cloning activated ones.
