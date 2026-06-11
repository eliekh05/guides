---
layout: default
title: "Check Hardware Information on Linux"
parent: "System & Users"
nav_order: 24
---

# Check Hardware Information on Linux

---

## CPU

```bash
lscpu                            # full CPU info
cat /proc/cpuinfo               # raw CPU info
lscpu | grep "Model name"       # CPU model only
nproc                           # number of CPU cores
```

---

## RAM

```bash
free -h                          # memory usage (human readable)
cat /proc/meminfo               # raw memory info
vmstat -s | head -5             # memory statistics
```

---

## Disks

```bash
lsblk                            # all block devices (disks, partitions)
lsblk -f                         # with filesystem info
df -h                            # mounted filesystems and usage
fdisk -l                         # partition tables (needs sudo)
hdparm -I /dev/sda               # detailed disk info
```

---

## GPU

```bash
lspci | grep -i vga              # GPU info
lspci | grep -i "3d\|display\|vga"
nvidia-smi                       # NVIDIA GPU status (if Nvidia)
rocm-smi                         # AMD GPU status (if AMD with ROCm)
glxinfo | grep "OpenGL renderer" # OpenGL renderer
```

---

## All PCI Devices

```bash
lspci                            # all PCI devices
lspci -v                         # verbose
lspci | grep -i network          # network cards
lspci | grep -i audio            # audio cards
lspci | grep -i usb              # USB controllers
```

---

## USB Devices

```bash
lsusb                            # all USB devices
lsusb -t                         # tree format
lsusb -v                         # verbose (detailed)
```

---

## System Information

```bash
uname -a                         # kernel version and architecture
uname -r                         # kernel version only
hostnamectl                      # hostname, OS, kernel
cat /etc/os-release              # OS details
lsb_release -a                   # Ubuntu/Debian distribution info
cat /proc/version                # kernel compile info
uptime                           # system uptime and load
```

---

## Motherboard / BIOS

```bash
sudo dmidecode -t baseboard      # motherboard info
sudo dmidecode -t bios           # BIOS info
sudo dmidecode -t processor      # CPU info from BIOS
sudo dmidecode -t memory         # RAM slot info
sudo dmidecode | head -50        # general system info
```

Install if missing:
```bash
sudo apt install dmidecode -y
```

---

## Temperatures and Sensors

```bash
sudo apt install lm-sensors -y
sudo sensors-detect              # auto-detect sensors (run once)
sensors                          # show current temperatures

# For modern systems (alternative)
sudo apt install inxi -y
inxi -F                          # full system info including temps
```

---

## All-in-One Summary

```bash
# Install inxi for a comprehensive one-command summary
sudo apt install inxi -y

inxi -F                          # full system info
inxi -C                          # CPU info
inxi -G                          # GPU info
inxi -D                          # disk info
inxi -N                          # network info
inxi -m                          # memory info
```

---

## Kernel Modules (Drivers)

```bash
lsmod                            # loaded kernel modules
modinfo module_name              # info about a specific module
modprobe module_name             # load a module
rmmod module_name                # remove a module
```
