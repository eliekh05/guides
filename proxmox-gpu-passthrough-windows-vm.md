---
layout: default
title: "Proxmox GPU Passthrough to a Windows VM"
parent: "Installation Guides"
nav_order: 22
---

# Proxmox GPU Passthrough to a Windows VM

GPU passthrough lets a Proxmox VM claim a physical GPU directly — giving near-native gaming and GPU compute performance inside the VM. This is one of the most searched homelab topics and also one of the most misguided by outdated guides. This guide is accurate for **Proxmox VE 8 and 9**.

> **This is advanced.** If you have not already done a basic Windows VM in Proxmox, do that first — see the **Install Windows 11 as a VM in Proxmox** guide.

---

## What You Need

- A motherboard and CPU that support **IOMMU** (Intel VT-d or AMD IOMMU)
- A **discrete GPU** to pass through (separate from whatever drives your Proxmox display)
- Proxmox installed in **UEFI mode** (not legacy BIOS)
- A second GPU or integrated graphics for the Proxmox host display, OR a headless server where you access everything remotely

> **Single GPU passthrough** (where the host has no other display output) is possible but significantly more complex. This guide assumes you have a dedicated GPU for passthrough and separate graphics for the host.

---

## Step 1 — Enable IOMMU in BIOS

Restart your server and enter BIOS setup. Find and enable:

**Intel systems:**
- **VT-d** — must be explicitly **Enabled** (not Auto)
- **Intel Virtualization Technology** — must be Enabled

**AMD systems:**
- **IOMMU** or **AMD-Vi** — must be explicitly **Enabled** (not Auto)
- **SVM Mode** — must be Enabled

Also enable:
- **Above 4G Decoding** — required for GPUs with more than 4 GB VRAM
- **Resizable BAR / Smart Access Memory** — enable unless your GPU is AMD Vega or earlier (those have issues with it)

> **Disable CSM/Legacy Boot** — legacy boot interferes with GPU passthrough on many systems.

---

## Step 2 — Enable IOMMU in the Proxmox Bootloader

### Check which bootloader Proxmox is using

```bash
ls /etc/kernel/proxmox-boot-uuids 2>/dev/null && echo "systemd-boot" || echo "GRUB"
```

### If using GRUB:

```bash
nano /etc/default/grub
```

Find `GRUB_CMDLINE_LINUX_DEFAULT` and add the IOMMU flags:

**Intel:**
```
GRUB_CMDLINE_LINUX_DEFAULT="quiet intel_iommu=on iommu=pt"
```

**AMD:**
```
GRUB_CMDLINE_LINUX_DEFAULT="quiet iommu=pt"
```

> **Correct for AMD:** `amd_iommu=on` is **not needed and not valid** on modern kernels — AMD IOMMU is enabled by default. Many guides incorrectly include it. `iommu=pt` (passthrough mode) is all you need.

Apply and reboot:
```bash
update-grub
reboot
```

### If using systemd-boot:

```bash
nano /etc/kernel/cmdline
```

**Intel:**
```
root=ZFS=rpool/ROOT/pve-1 boot=zfs intel_iommu=on iommu=pt
```

**AMD:**
```
root=ZFS=rpool/ROOT/pve-1 boot=zfs iommu=pt
```

Apply and reboot:
```bash
proxmox-boot-tool refresh
reboot
```

---

## Step 3 — Verify IOMMU Is Active

After rebooting:

```bash
dmesg | grep -e DMAR -e IOMMU | head -5
```

You should see lines containing `IOMMU enabled` or `DMAR: IOMMU enabled`. If nothing appears, IOMMU is not active — check your BIOS settings.

---

## Step 4 — Load VFIO Modules

VFIO is the kernel framework that lets VMs claim PCI devices.

```bash
nano /etc/modules
```

Add these lines:

```
vfio
vfio_iommu_type1
vfio_pci
```

> **Do not add `vfio_virqfd`** — it was removed as a separate module in Proxmox VE 8 (kernel 6.2+). Adding it causes a module load error.

Update initramfs and reboot:

```bash
update-initramfs -u -k all
reboot
```

---

## Step 5 — Check IOMMU Groups

After rebooting, verify your GPU is in its own IOMMU group (or shares only with its own audio/USB functions):

```bash
for d in /sys/kernel/iommu_groups/*/devices/*; do
  n=${d#*/iommu_groups/*}; n=${n%%/*}
  printf 'IOMMU Group %s ' "$n"
  lspci -nns "${d##*/}"
done | grep -i "vga\|display\|3d\|audio\|nvidia\|amd\|radeon\|intel" | sort -V
```

You will see output like:
```
IOMMU Group 14 01:00.0 VGA compatible controller [0300]: NVIDIA Corporation GA104 [RTX 3070] [10de:2484]
IOMMU Group 14 01:00.1 Audio device [0403]: NVIDIA Corporation GA104 High Definition Audio [10de:228b]
```

The GPU (VGA) and its HDMI audio (Audio) being in the same group is fine and expected. Other devices in the same group are a problem — see the ACS override troubleshooting section at the end.

Note the **PCI IDs** (the numbers in brackets like `10de:2484` and `10de:228b`) — you need them in the next step.

---

## Step 6 — Bind the GPU to VFIO

Tell the kernel to give the GPU to VFIO instead of the host driver.

### Method A — via vfio.conf (Recommended)

```bash
nano /etc/modprobe.d/vfio.conf
```

Add (replacing with your actual PCI IDs from Step 5):
```
options vfio-pci ids=10de:2484,10de:228b
```

### Blacklist the GPU's host driver

Create a blacklist file so the host never loads its own driver for the passed-through GPU:

**NVIDIA:**
```bash
echo "blacklist nouveau" > /etc/modprobe.d/blacklist-gpu.conf
echo "blacklist nvidia" >> /etc/modprobe.d/blacklist-gpu.conf
echo "blacklist nvidiafb" >> /etc/modprobe.d/blacklist-gpu.conf
```

**AMD:**
```bash
echo "blacklist amdgpu" > /etc/modprobe.d/blacklist-gpu.conf
echo "blacklist radeon" >> /etc/modprobe.d/blacklist-gpu.conf
```

> **Exception:** If your AMD system uses iGPU (integrated graphics) for the host display and a discrete AMD GPU for passthrough, do **not** blacklist `amdgpu` — it will break your host display. Use the softdep method instead.

### softdep method (AMD systems with both iGPU and dGPU)

```bash
echo "softdep amdgpu pre: vfio-pci" > /etc/modprobe.d/amdgpu.conf
```

This ensures `vfio-pci` loads before `amdgpu`, so it claims the discrete GPU first, leaving `amdgpu` for the integrated GPU.

Update initramfs and reboot:
```bash
update-initramfs -u -k all
reboot
```

### Verify the GPU is bound to VFIO

```bash
lspci -k | grep -A 3 "VGA\|3D"
```

Look for:
```
Kernel driver in use: vfio-pci
```

If it still shows `nvidia`, `amdgpu`, or `nouveau`, the blacklist or vfio.conf is not being applied. Check your files and rerun `update-initramfs -u -k all`.

---

## Step 7 — Configure the VM for GPU Passthrough

Create or edit a Windows VM. In the Proxmox web UI, go to the VM's **Hardware** tab.

**Required VM settings:**
- **Machine:** q35
- **BIOS:** OVMF (UEFI)
- **Display:** set to **none** (after GPU passthrough, the GPU handles display)
- **Memory Ballooning:** **disable this** — GPU passthrough requires fixed memory. The PVE usage graph will show 100% memory allocation — this is normal, not a problem.

**Add the GPU:**
1. Click **Add** → **PCI Device**
2. Select your GPU from the dropdown
3. Check **All Functions** (includes the HDMI audio controller)
4. Check **PCI-Express**
5. **Uncheck ROM-Bar** — this resolves stability issues on many systems
6. **Uncheck Primary GPU** — unless this is a single-GPU setup

**Add RAM:**
Set RAM to a fixed amount — no ballooning. Example: 8192 MB.

---

## Step 8 — Hide the Hypervisor from NVIDIA (If Using NVIDIA GPU)

NVIDIA drivers detect they are in a VM and refuse to install. Hide this:

Edit the VM config file on the Proxmox shell:

```bash
nano /etc/pve/qemu-server/VMID.conf
```

Find the `cpu:` line and change it to:

```
cpu: host,hidden=1,flags=+pcid
```

This hides the KVM hypervisor signature from the NVIDIA driver.

> **AMD GPUs generally do not need this.** Only NVIDIA consumer cards (GeForce) require it.

---

## Step 9 — Install Windows and NVIDIA/AMD Drivers in the VM

1. Start the VM — it will display through the passed-through GPU. Connect a monitor to the GPU.
2. Install Windows as normal (see the Windows VM in Proxmox guide for the VirtIO driver steps).
3. After Windows is installed and you are at the desktop, install your GPU drivers:
   - **NVIDIA:** download and install from [nvidia.com/drivers](https://www.nvidia.com/drivers)
   - **AMD:** download and install from [amd.com/support](https://www.amd.com/support)
4. Restart the VM. DirectX and GPU acceleration should now be available.

---

## Troubleshooting

### GPU still shows `nvidia` or `amdgpu` as kernel driver (not `vfio-pci`)

The blacklist or vfio.conf is not being applied early enough. Run:
```bash
update-initramfs -u -k all
reboot
```

### VM starts but monitor stays black

- Make sure the monitor is plugged into the passed-through GPU, not the host GPU
- Remove the ROM-Bar check in the PCI device config
- Try adding a display device (VirtIO or Bochs) temporarily during setup, then remove it after drivers are installed

### NVIDIA Code 43 error in Windows Device Manager

The hypervisor is not hidden. Add `cpu: host,hidden=1` to the VM config (Step 8).

### AMD GPU reset bug (RX 5xxx, 6xxx, 7xxx)

Some AMD GPUs fail to reset properly between VM shutdowns. Install the `vendor-reset` kernel module:
```bash
apt install vendor-reset -y
```

Also set `reset_method=device_specific` for the GPU in the VFIO config.

### IOMMU groups are not isolated (GPU shares a group with other devices)

If other unrelated devices share your GPU's IOMMU group, you have two options:
1. Try a different PCIe slot for the GPU
2. Use the ACS override (adds `pcie_acs_override=downstream,multifunction` to kernel cmdline)

> **ACS override warning:** This forces devices into separate IOMMU groups by disabling isolation checks. It means VMs can potentially access each other's DMA space. Only use it in a trusted homelab environment, never in production.
