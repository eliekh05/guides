---
layout: default
title: "Enable and Configure macOS Firewall"
parent: "Security & Apps"
nav_order: 5
---

# Enable and Configure macOS Firewall

macOS has a built-in application firewall. The GUI in System Settings is minimal — it only lets you turn it on and block incoming connections per app. The real control is via `socketfilterfw` in Terminal.

---

## Enable via System Settings

1. **System Settings** → **Network** → **Firewall**.
2. Toggle **Firewall** to **On**.

**Options:**
- **Block all incoming connections** — blocks everything except basic internet services. Very strict. Breaks file sharing, screen sharing, and some apps.
- **Automatically allow built-in software** — Apple apps bypass the firewall. On by default.
- **Automatically allow downloaded signed software** — signed apps bypass the firewall. On by default.
- **Enable stealth mode** — Mac does not respond to ping or port scans. Good for public Wi-Fi.

---

## Enable Stealth Mode (Recommended for Public Wi-Fi)

1. System Settings → Network → Firewall → **Options**.
2. Check **Enable stealth mode**.

Or via Terminal:
```bash
sudo /usr/libexec/ApplicationFirewall/socketfilterfw --setstealthmode on
```

---

## Control the Firewall via Terminal (socketfilterfw)

```bash
# Check current status
sudo /usr/libexec/ApplicationFirewall/socketfilterfw --getglobalstate

# Enable the firewall
sudo /usr/libexec/ApplicationFirewall/socketfilterfw --setglobalstate on

# Disable the firewall
sudo /usr/libexec/ApplicationFirewall/socketfilterfw --setglobalstate off

# Enable stealth mode
sudo /usr/libexec/ApplicationFirewall/socketfilterfw --setstealthmode on

# Block all incoming connections
sudo /usr/libexec/ApplicationFirewall/socketfilterfw --setblockall on

# List all rules (which apps are allowed or blocked)
sudo /usr/libexec/ApplicationFirewall/socketfilterfw --listapps
```

---

## Allow or Block a Specific App

```bash
# Allow an app through the firewall
sudo /usr/libexec/ApplicationFirewall/socketfilterfw --add /Applications/AppName.app

# Block an app
sudo /usr/libexec/ApplicationFirewall/socketfilterfw --blockapp /Applications/AppName.app

# Remove a rule
sudo /usr/libexec/ApplicationFirewall/socketfilterfw --remove /Applications/AppName.app
```

---

## Recommended Settings for Most Users

```bash
# Enable firewall
sudo /usr/libexec/ApplicationFirewall/socketfilterfw --setglobalstate on

# Enable stealth mode
sudo /usr/libexec/ApplicationFirewall/socketfilterfw --setstealthmode on

# Allow signed apps automatically (keeps things working)
sudo /usr/libexec/ApplicationFirewall/socketfilterfw --setallowsigned on
sudo /usr/libexec/ApplicationFirewall/socketfilterfw --setallowsignedapp on
```

---

> **Note:** macOS's firewall only controls **incoming** connections. It does not block apps from making outgoing connections. For outbound control (blocking apps from phoning home), use a third-party tool like **Little Snitch** or **Lulu** (free).
