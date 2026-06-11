---
layout: default
title: "macOS Screen Sharing and Remote Login (SSH and VNC)"
parent: "macOS"
nav_order: 22
---

# macOS Screen Sharing and Remote Login (SSH and VNC)

macOS has built-in screen sharing and remote access. No third-party software needed.

---

## SSH Remote Login (Terminal Access)

### Enable on the Mac you want to access remotely

**System Settings → General → Sharing → Remote Login → On**

Note your Mac's IP address shown there or run:
```bash
ipconfig getifaddr en0    # WiFi
ipconfig getifaddr en1    # Ethernet
```

### Connect from another machine

```bash
ssh yourusername@YOUR_MAC_IP
```

### Only allow specific users

In Remote Login settings, change **Allow access for:** from **All users** to specific users you add to the list.

---

## Screen Sharing (VNC — See and Control the Desktop)

### Enable on the Mac you want to access

**System Settings → General → Sharing → Screen Sharing → On**

Click **i** next to Screen Sharing to set a password or restrict to specific users.

### Connect from another Mac

**Finder → Go → Connect to Server → `vnc://YOUR_MAC_IP`**

Or from the network browser in Finder — your Mac will appear under Locations if on the same network.

### Connect from Windows or Linux

Use any VNC client — **TigerVNC** (free), **RealVNC Viewer** (free), or **Remmina** (Linux).

Server address: `YOUR_MAC_IP:5900`

### Connect from iPhone or iPad

Use **Jump Desktop** (paid) or **VNC Viewer** (free) from the App Store.

---

## Apple Remote Desktop Alternative (Third Party)

For better performance than VNC, use:
- **Screen Sharing** built into macOS — simple, works well on the same network
- **Jump Desktop** — fast, works over internet
- **Chrome Remote Desktop** — free, works anywhere

---

## iCloud Remote Desktop (Apple Silicon, macOS Sequoia+)

On macOS Sequoia and later with Apple Silicon, you can connect to your Mac remotely through iCloud without being on the same network:

**System Settings → General → Sharing → Remote Desktop → turn on**

Then connect from the Finder sidebar under Locations on another Mac signed into the same iCloud account.

---

## Remote Management via Terminal Only (No GUI)

For servers and headless Macs, SSH is all you need. Useful commands once connected:

```bash
# Restart
sudo shutdown -r now

# Shut down
sudo shutdown -h now

# Open an app
open -a "Safari"

# Run a script
bash ~/scripts/myscript.sh

# Check what apps are running
ps aux | grep -v grep | grep -E "Safari|Chrome"
```

---

## Security Tips

- **Use SSH keys** instead of passwords for Remote Login — see **Set Up SSH Keys from Scratch** guide
- **Disable Remote Login** when not in use: `sudo systemsetup -setremotelogin off`
- **Firewall** should be enabled when exposing SSH to the internet: System Settings → Network → Firewall → On
- **Change SSH port** from 22 to reduce automated attacks — see the **Harden SSH Server** guide
