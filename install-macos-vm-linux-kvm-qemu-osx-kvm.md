---
layout: default
title: "Install macOS as a VM on Linux (KVM/QEMU with OSX-KVM)"
parent: "Installation Guides"
nav_order: 18
---

# Install macOS as a VM on Linux (KVM/QEMU with OSX-KVM)

Running macOS on Linux uses KVM (Kernel-based Virtual Machine) with OpenCore as the bootloader — the same bootloader used for Hackintosh installs. The OSX-KVM project on GitHub wraps everything together with scripts that handle most of the complexity. This guide uses that project.

> **Legal note:** Apple's EULA restricts macOS to Apple hardware. This guide is for developers, testers, and security researchers. These setups are sometimes called "Virtual Hackintosh" systems and are not intended to replace genuine Apple hardware.

---

## Requirements

- A Linux host (Ubuntu, Debian, Fedora, Arch — any modern distro)
- CPU with **Intel VT-x** or **AMD-V** enabled in BIOS
- At least **8 GB RAM** (plan to give the VM 4–6 GB)
- At least **100 GB free disk space**
- `git`, `python3`, `qemu-system-x86_64`, and `libvirt` installed

> **AMD CPUs work but need extra configuration.** See the AMD section at the end.

---

## Step 1 — Install Dependencies

**Ubuntu / Debian:**
```bash
sudo apt update
sudo apt install -y qemu-kvm qemu-utils libvirt-daemon-system \
  libvirt-clients bridge-utils virt-manager python3 git \
  ovmf swtpm swtpm-tools
```

**Fedora:**
```bash
sudo dnf install -y qemu-kvm libvirt virt-manager \
  python3 git edk2-ovmf swtpm
```

**Arch:**
```bash
sudo pacman -S qemu libvirt virt-manager python git ovmf swtpm
```

Enable and start libvirt:
```bash
sudo systemctl enable --now libvirtd
sudo usermod -aG kvm,libvirt $(whoami)
```

**Log out and back in** for the group changes to take effect.

---

## Step 2 — Enable MSR (Required for macOS)

macOS requires access to CPU Model Specific Registers. Enable this:

```bash
# Load the KVM module with MSR access enabled
sudo modprobe kvm
echo 1 | sudo tee /sys/module/kvm/parameters/ignore_msrs

# Make it permanent across reboots
echo "options kvm ignore_msrs=1" | sudo tee /etc/modprobe.d/kvm.conf
```

---

## Step 3 — Clone OSX-KVM

```bash
git clone --depth 1 --recursive https://github.com/kholia/OSX-KVM.git
cd OSX-KVM
```

---

## Step 4 — Download the macOS Installer

```bash
./fetch-macOS-v2.py
```

A menu will appear with macOS versions. Select the version you want — for Sequoia (15), choose that option. The script downloads a recovery image from Apple's servers directly (~700 MB).

After downloading, convert the image:

```bash
qemu-img convert BaseSystem.dmg -O raw BaseSystem.img
```

---

## Step 5 — Create the VM Disk

Create a virtual disk where macOS will be installed:

```bash
qemu-img create -f qcow2 mac_hdd_ng.img 128G
```

128 GB is a comfortable size. You can increase or decrease this — macOS itself needs about 20 GB minimum but 50+ GB is recommended for actual use.

---

## Step 6 — Boot the macOS Installer

Run the boot script:

```bash
./OpenCore-Boot.sh
```

A QEMU window will open and show the OpenCore boot picker. Select **macOS Base System** and press Enter.

The macOS installer will load — this takes several minutes on first boot.

---

## Step 7 — Install macOS

1. When the macOS Utilities screen appears, open **Disk Utility**.
2. Select **QEMU HARDDISK** (your virtual disk) from the left panel.
3. Click **Erase**:
   - **Name:** `Macintosh HD`
   - **Format:** `APFS`
   - **Scheme:** `GUID Partition Map`
4. Click **Erase** and close Disk Utility.
5. Select **Install macOS** and follow the installer.
6. The VM will reboot several times during installation — each time, select your macOS disk (not the installer) in the OpenCore picker.

Installation takes 30–60 minutes.

---

## Step 8 — Complete macOS Setup

After installation, macOS Setup Assistant will run. Complete it normally. You can skip the Apple ID sign-in if you just want a local account.

---

## Step 9 — Use virt-manager for Easier Management (Optional)

The default QEMU window works but virt-manager gives you a proper GUI. Set up file permissions first:

```bash
sudo setfacl -m u:libvirt-qemu:rx /home/$USER
sudo setfacl -R -m u:libvirt-qemu:rx /home/$USER/OSX-KVM
```

Edit the libvirt XML file:
```bash
sed "s/CHANGEME/$USER/g" macOS-libvirt-Catalina.xml > macOS.xml
virt-xml-validate macOS.xml
virsh --connect qemu:///system define macOS.xml
```

The VM will now appear in virt-manager.

---

## AMD CPU — Extra Configuration

macOS does not officially support AMD and will kernel panic during boot without patching. Open `OpenCore-Boot.sh` in a text editor and find the `-cpu` line. Change it to:

```bash
-cpu Penryn,kvm=on,vendor=GenuineIntel,+invtsc,vmware-cpuid-freq=on,+ssse3,+sse4.2,+popcnt,+avx,+avx2,+aes,+xsave,+xsaveopt,check
```

Also add these flags to the QEMU command:

```bash
-cpu Penryn,kvm=on,vendor=GenuineIntel,...
```

AMD Ryzen 5000 series and newer generally work well. Older AMD CPUs may have more issues.

---

## Improve Performance

**Give the VM more RAM and CPU in the boot script:**

Edit `OpenCore-Boot.sh` and change:
```bash
ALLOCATED_RAM="8192"   # 8 GB
CPU_SOCKETS="1"
CPU_CORES="4"
CPU_THREADS="8"
```

**Enable CPU host passthrough for best performance** (Intel only, AMD may cause issues):

In the `-cpu` line, change to:
```bash
-cpu host,kvm=on,vendor=GenuineIntel,...
```

---

## Troubleshooting

### OpenCore boot picker does not appear — black screen
MSR is not enabled. Run:
```bash
echo 1 | sudo tee /sys/module/kvm/parameters/ignore_msrs
```

### macOS installer crashes or kernel panics immediately
On AMD: the CPU flags are wrong. Use the AMD configuration above.

### Stuck at Apple logo after installer reboots
Select the correct boot entry in OpenCore — choose your `Macintosh HD` volume, not the installer volume.

### Very slow performance
Make sure KVM is actually enabled:
```bash
kvm-ok
```
If it says KVM is not available, virtualisation is not enabled in BIOS, or the KVM modules are not loaded.

### macOS installed but boots from installer every time
After installation, copy the OpenCore EFI to the macOS drive's EFI partition. From a Terminal inside macOS, run the provided `copy-efi.sh` script in the OSX-KVM folder.
