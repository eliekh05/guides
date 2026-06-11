---
layout: default
title: "Run Linux GUI Apps in WSL2 on Windows"
parent: "Windows"
nav_order: 14
---

# Run Linux GUI Apps in WSL2 on Windows

WSL2 includes WSLg (Windows Subsystem for Linux GUI) which lets Linux applications open windows on your Windows desktop — no VNC or X server needed.

---

## Requirements

- Windows 11 (or Windows 10 build 19044+ with GPU drivers)
- WSL2 installed and updated
- An up-to-date GPU driver

---

## Update WSL

```powershell
wsl --update
wsl --shutdown
```

---

## Install and Run GUI Apps

Inside your WSL2 terminal:

```bash
# Install a GUI app
sudo apt install gedit -y       # text editor
sudo apt install nautilus -y    # Gnome file manager
sudo apt install gimp -y        # image editor
sudo apt install vlc -y         # video player
sudo apt install firefox -y     # browser

# Launch it (window appears on Windows desktop)
gedit
firefox
gimp
```

The app opens as a regular Windows window. You can minimise, resize, and use it alongside Windows apps.

---

## Fix: GUI Apps Not Appearing

```bash
# Check if WSLg is working
wsl --version   # look for "WSLg version"

# Verify DISPLAY is set
echo $DISPLAY   # should return something like :0
```

If `$DISPLAY` is empty:
```bash
export DISPLAY=$(cat /etc/resolv.conf | grep nameserver | awk '{print $2}'):0.0
```

---

## Pin Linux Apps to Windows Taskbar

1. Launch the app from WSL
2. It appears in the taskbar
3. Right-click → **Pin to taskbar**

Next time: click the pinned icon and it launches (starting WSL if needed).

---

## File Sharing Between Windows and Linux GUI Apps

GUI apps running in WSL can access Windows files via the `/mnt/c/` path.

In a file picker, type `/mnt/c/Users/YourName/` to browse Windows files from a Linux GUI app.

---

## Supported Desktop Environments

WSLg primarily supports X11 apps well. Wayland apps work partially. Full desktop environments (GNOME, KDE) can be installed but require more configuration — use [WSL utilities](https://github.com/DamionGans/ubuntu-wsl2-systemd-script) for systemd support.

---

## Performance Tip

Store files in the Linux filesystem (`~/`) for better performance with Linux GUI apps. Files on `/mnt/c/` work but are slower due to filesystem translation.
