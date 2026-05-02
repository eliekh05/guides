---
layout: default
title: "Set Up WSL2 and Fix Common Problems"
parent: "Installation Guides"
nav_order: 17
---

# Set Up WSL2 and Fix Common Problems

WSL2 (Windows Subsystem for Linux 2) lets you run a full Linux environment directly inside Windows — no VM, no dual boot. It is genuinely useful but has several well-known problems that trip up almost everyone: slow filesystem when working on Windows files, broken DNS, VPN conflicts, and networking that works differently from native Linux. This guide covers setup and all the common fixes.

---

## Install WSL2

Open **PowerShell as Administrator** and run:

```powershell
wsl --install
```

This installs WSL2 with Ubuntu as the default distribution. Restart when prompted.

After restart, Ubuntu will finish setting up — create a username and password when asked.

### Install a Different Distribution

```powershell
# List available distributions
wsl --list --online

# Install a specific one
wsl --install -d Debian
wsl --install -d kali-linux
wsl --install -d openSUSE-42
```

### Check WSL Version

```powershell
wsl --status
wsl --list --verbose
```

Make sure your distro shows **VERSION: 2**. If it shows 1, upgrade it:

```powershell
wsl --set-version Ubuntu 2
wsl --set-default-version 2
```

---

## The Most Important Thing to Know — Filesystem Location

**This is what trips up most people.** WSL2 has two filesystems and they perform very differently:

| Location | Speed | Use for |
|---|---|---|
| `~/` inside WSL (the Linux filesystem) | Fast | Your code, projects, scripts |
| `/mnt/c/` (your Windows C: drive from inside WSL) | Very slow | Accessing Windows files occasionally |

If your code is in `C:\Users\yourname\Projects` and you access it via `/mnt/c/Users/yourname/Projects` inside WSL, everything will be slow — `npm install` can take 10x longer, `git status` crawls, and build tools struggle.

**The fix:** keep your project files inside the Linux filesystem (`~/projects`), not on the Windows drive. Access them from Windows using the `\\wsl$\Ubuntu\home\yourname\` path in File Explorer.

---

## Configure WSL2 Resource Limits

By default, WSL2 can use all your RAM and CPU. On a machine with 16 GB RAM, WSL may grab 8 GB and leave Windows starved. Create a config file to set limits.

Create or edit `C:\Users\yourname\.wslconfig` in Notepad:

```ini
[wsl2]
memory=4GB
processors=4
swap=2GB
```

Adjust to your system. Apply changes:

```powershell
wsl --shutdown
```

Then reopen WSL.

---

## Fix DNS Not Working in WSL2

DNS breaking in WSL2 is one of the most common issues — especially after VPN connections. You see errors like `Temporary failure in name resolution` or websites not loading.

### Fix 1 — Switch to Mirrored Networking (Windows 11 Only)

The modern fix. Edit `C:\Users\yourname\.wslconfig`:

```ini
[wsl2]
networkingMode=mirrored
```

Run `wsl --shutdown` and reopen WSL. Mirrored mode makes WSL share Windows' network stack directly, fixing most VPN and DNS issues at once.

### Fix 2 — Set a Static DNS (Works on Windows 10 and 11)

Inside WSL, edit `/etc/resolv.conf`:

```bash
sudo nano /etc/resolv.conf
```

Replace everything with:

```
nameserver 1.1.1.1
nameserver 8.8.8.8
```

Then prevent WSL from overwriting it on restart:

```bash
sudo nano /etc/wsl.conf
```

Add:

```ini
[network]
generateResolvConf = false
```

Save, then run `wsl --shutdown` from PowerShell and reopen WSL.

---

## Fix VPN Breaking WSL2 Networking

When a VPN is active on Windows, WSL2 often loses internet entirely. Mirrored networking (Fix 1 above) resolves this on Windows 11. On Windows 10, or if mirrored mode does not work:

Edit `C:\Users\yourname\.wslconfig`:

```ini
[wsl2]
networkingMode=mirrored
dnsTunneling=true
firewall=true
```

Run `wsl --shutdown` and reopen.

If still broken, check that your VPN software has a setting for "Allow local network access" or "Split tunneling" and enable it.

---

## Fix Slow WSL2 Performance

### If `/mnt/c` is slow (expected — see Filesystem section above)

Move your projects to the Linux filesystem:

```bash
# Copy a project from Windows to Linux filesystem
cp -r /mnt/c/Users/yourname/myproject ~/myproject
cd ~/myproject
```

Access it from Windows Explorer: type `\\wsl$\Ubuntu\home\yourname\myproject` in the address bar.

### If the Linux filesystem itself is slow

The WSL2 virtual disk (`.vhdx` file) may be fragmented or need optimization:

```powershell
# Shut down WSL first
wsl --shutdown

# Find the VHDX file location
# Usually: C:\Users\yourname\AppData\Local\Packages\CanonicalGroupLimited.Ubuntu...\LocalState\ext4.vhdx

# Compact the VHDX (run in PowerShell as Admin)
Optimize-VHD -Path "C:\path\to\ext4.vhdx" -Mode Full
```

---

## Access Windows Files from WSL

```bash
# Access C: drive
ls /mnt/c/

# Access a specific Windows folder
cd /mnt/c/Users/yourname/Desktop
```

## Access WSL Files from Windows

In File Explorer address bar, type:
```
\\wsl$\Ubuntu\home\yourname
```

Or in PowerShell:
```powershell
explorer.exe \\wsl$\Ubuntu\home\yourname
```

You can also pin this to Quick Access in File Explorer.

---

## Run Windows Commands from WSL

```bash
# Open a Windows app from WSL
explorer.exe .          # Open current folder in File Explorer
notepad.exe file.txt    # Open a file in Notepad
cmd.exe /c dir          # Run a Windows cmd command
```

## Run WSL Commands from Windows PowerShell

```powershell
# Run a command in WSL
wsl ls -la

# Run a specific script
wsl bash ~/scripts/myscript.sh

# Run as a specific distro
wsl -d Ubuntu ls -la
```

---

## Useful WSL Management Commands

```powershell
# Shut down all WSL instances
wsl --shutdown

# List installed distributions
wsl --list --verbose

# Set default distribution
wsl --set-default Ubuntu

# Uninstall a distribution
wsl --unregister Ubuntu

# Export a distribution to a backup file
wsl --export Ubuntu C:\backup\ubuntu.tar

# Import a distribution from backup
wsl --import Ubuntu C:\WSL\Ubuntu C:\backup\ubuntu.tar --version 2

# Update WSL itself
wsl --update
```

---

## Troubleshooting

### `wsl: command not found` in PowerShell
WSL is not installed. Run `wsl --install` as Administrator.

### WSL2 feature not available
Go to **Settings → Apps → Optional Features → More Windows features** and enable:
- **Windows Subsystem for Linux**
- **Virtual Machine Platform**

Restart and try again.

### `Error 0x80370102` — virtualisation not enabled
Enable Intel VT-x or AMD-V in your BIOS/UEFI settings.

### WSL opens but immediately closes
Your Linux installation may be corrupted. Unregister and reinstall:
```powershell
wsl --unregister Ubuntu
wsl --install -d Ubuntu
```

### Docker Desktop conflicts with WSL2
Docker Desktop uses WSL2 as its backend. If Docker is installed, it may manage WSL resources. In Docker Desktop settings, go to **Resources → WSL Integration** and configure which distros Docker connects to.