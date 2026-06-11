---
layout: default
title: "Install TrueNAS SCALE on Bare Metal"
parent: "Installation Guides"
nav_order: 21
---

# Install TrueNAS SCALE on Bare Metal

TrueNAS SCALE is a free, open-source NAS (Network Attached Storage) operating system built on Linux. It turns any PC into a full-featured file server with a polished web UI, ZFS storage, Docker app support, and SMB/NFS sharing. This guide covers bare metal installation — not in a VM.

> **TrueNAS SCALE vs CORE:** SCALE is Linux-based (Debian), supports Docker/Kubernetes apps, and is the current recommended version. CORE is FreeBSD-based, older, but still maintained. This guide covers SCALE.

---

## Hardware Requirements

- **CPU:** Any 64-bit Intel or AMD CPU (2012 or later recommended)
- **RAM:** 8 GB minimum, **16 GB strongly recommended** for ZFS
- **Boot drive:** A separate USB drive or SSD just for the OS (16 GB minimum, 32 GB recommended) — **not** one of your storage drives
- **Storage drives:** At least one drive for data. ZFS works best with drives in pairs for mirroring.
- **Network:** Ethernet (TrueNAS is a server — Wi-Fi is not recommended)

> **ZFS and RAM:** ZFS uses RAM aggressively for caching. The more RAM, the better performance. 8 GB works but 32 GB+ is where it shines.

---

## Step 1 — Download TrueNAS SCALE

Go to [truenas.com/download-truenas-scale](https://www.truenas.com/download-truenas-scale/) and download the latest stable ISO.

---

## Step 2 — Create a Bootable USB

Flash the ISO to a USB drive using [balenaEtcher](https://etcher.balena.io).

> **This USB is just for installation.** After installing, TrueNAS boots from a separate boot drive, not this USB.

---

## Step 3 — Boot and Install

1. Insert the USB into your server machine.
2. Boot from the USB (press F12, F9, or Del at startup for the boot menu).
3. TrueNAS loads a text-based installer.
4. Select **Install/Upgrade**.
5. **Select the boot drive** — choose your dedicated OS drive (NOT your storage drives). TrueNAS will erase it completely.
6. Set a **root password** when prompted.
7. Select **Boot via UEFI** (recommended for modern hardware).
8. Confirm and let installation complete (5–10 minutes).
9. Remove the USB when prompted and reboot.

---

## Step 4 — Access the Web UI

After booting, TrueNAS shows its IP address on the console screen.

Open a browser on another machine on the same network and go to:
```
http://TRUENAS_IP_ADDRESS
```

Log in with:
- **Username:** `admin` (TrueNAS SCALE 22.12+) or `root`
- **Password:** whatever you set during installation

---

## Step 5 — Set Up Storage

### Create a Pool (ZFS storage)

1. Go to **Storage** → **Create Pool**.
2. Give the pool a name (e.g. `tank` is traditional).
3. Select your storage drives.
4. Choose a layout:

| Layout | What it is | Use when |
|---|---|---|
| **Stripe** | No redundancy, full capacity | Never for important data |
| **Mirror** | 2+ drives, full redundancy | 2 drives, home use |
| **RAIDZ1** | 3+ drives, 1 drive failure tolerance | 3–5 drives |
| **RAIDZ2** | 4+ drives, 2 drive failure tolerance | 6+ drives, production |

5. Click **Create Pool**.

---

## Step 6 — Create a Dataset and Share

### Create a Dataset (folder)

1. **Datasets** → **Add Dataset**.
2. Name it (e.g. `media`, `documents`, `backups`).
3. Leave defaults unless you need specific settings.

### Share via SMB (Windows/macOS/Linux file sharing)

1. **Shares** → **Windows (SMB) Shares** → **Add**.
2. Select the path to your dataset.
3. Give it a name.
4. Click **Save** → **Enable Service** when prompted.

Access it from Windows: open File Explorer → type `\\TRUENAS_IP\sharename` in the address bar.
Access it from macOS: Finder → **Go** → **Connect to Server** → `smb://TRUENAS_IP/sharename`.

---

## Step 7 — Create Users

Do not use root for file access. Create dedicated users:

1. **Credentials** → **Local Users** → **Add**.
2. Set a username and password.
3. Go back to your SMB share → **Edit** → set the correct permissions for that user.

---

## Apps (Docker via TrueNAS Apps)

TrueNAS SCALE has a built-in app catalogue powered by Docker:

1. Go to **Apps** → **Discover Apps**.
2. Browse or search — Plex, Nextcloud, Jellyfin, Home Assistant, and many more are available with one-click installs.
3. Click an app → **Install** → configure the settings → **Install**.

---

## Troubleshooting

### Cannot reach the web UI
Check the IP shown on the TrueNAS console. Make sure you are on the same network. Try `http://` not `https://` on first access.

### Drives not showing during pool creation
TrueNAS only shows drives that are not already in a pool. If a drive shows as used, it may have an existing partition — it needs to be wiped first.

### SMB share not accessible from Windows
Make sure the SMB service is running: **System** → **Services** → **SMB** should be running. Also check Windows can reach the IP: open Command Prompt and run `ping TRUENAS_IP`.

### After update, cannot log in
TrueNAS SCALE 22.12+ changed the default admin account from `root` to `admin`. Try both usernames.
