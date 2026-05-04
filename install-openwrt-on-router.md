---
layout: default
title: "Install OpenWrt on a Router"
parent: "Installation Guides"
nav_order: 23
---

# Install OpenWrt on a Router

OpenWrt is open-source Linux firmware for routers. It replaces the manufacturer's locked-down firmware with a fully configurable system — real firewall rules, WireGuard VPN, network-wide ad blocking, VLANs, and regular security updates long after the manufacturer stops caring about your hardware.

> ⚠️ **Flashing the wrong firmware can permanently brick your router.** Read this entire guide before doing anything. The hardware check in Step 1 is not optional.

---

## Why OpenWrt?

- Regular security updates — stock firmware often goes unpatched for years
- Network-wide ad blocking with AdGuard Home or Adblock
- WireGuard VPN on the router — all devices protected without per-device setup
- VLAN support — isolate IoT devices, guests, and your main network
- Full SSH access and package management via `opkg`
- Keeps older hardware useful and secure

---

## Step 1 — Check Your Router is Supported (Non-Negotiable)

Go to the OpenWrt Table of Hardware and find your router's device page. The URL is: **openwrt.org/toh**

Search for your **exact model** and — critically — your **hardware version**. The version number is on a sticker on the bottom of the router (e.g. "Ver 2.0" or "v4").

> **The same model can have completely different hardware in different versions.** A TP-Link Archer C7 v2 and v5 have different chips and need different firmware files. Getting this wrong = bricked router.

Look for:
- **Supported current release** — can install latest OpenWrt
- **Supported** — works but may be on an older release
- **End of Life** — no longer receiving updates, avoid if possible
- **Not supported** — stop here, do not attempt

The most compatible hardware in 2025–2026 uses MediaTek Filogic (MT7981B, MT7986A) or Qualcomm IPQ806x chipsets. Well-supported models include:

| Router | Why it's recommended |
|---|---|
| GL.iNet GL-MT6000 (Flint 2) | Wi-Fi 6, 2.5G Ethernet, ships with OpenWrt-based firmware |
| Linksys E8450 / Belkin RT3200 | Wi-Fi 6, 512MB RAM, strong community support |
| Netgear Nighthawk R7800 | Excellent long-term support, fast CPU |
| TP-Link Archer C7 v2/v5 | Budget-friendly, well-documented |

---

## Step 2 — Download the Correct Firmware

On your router's OpenWrt device page, find the firmware section. Download the file labelled:

- **"Firmware OpenWrt Install"** or **"factory"** — use this for your **first install** from stock firmware
- **"Firmware OpenWrt Upgrade"** or **"sysupgrade"** — use this only when **updating an existing OpenWrt install**

Do not rename the file. Do not download the sysupgrade image for a first install.

Save the file to your Desktop.

---

## Step 3 — Prepare for the Flash

1. **Connect your computer to a LAN port on the router** with an Ethernet cable — not via Wi-Fi, and not the WAN/Internet port.
2. **Disconnect your computer from Wi-Fi** — you want the only connection to be the Ethernet cable to the router.
3. The router should be connected to the internet via its WAN port (your modem/ISP connection) as normal.

---

## Step 4 — Flash via the Router's Web Interface (Standard Method)

This works for most routers and is the safest approach.

1. Open a browser and go to your router's admin page — usually `192.168.0.1` or `192.168.1.1`. Check the sticker on the router if unsure.
2. Log in with the router's admin credentials.
3. Find the **Firmware Upgrade** or **Firmware Update** section. Location varies by manufacturer:
   - TP-Link: Advanced → System Tools → Firmware Upgrade
   - Netgear: Advanced → Administration → Firmware Update
   - ASUS: Administration → Firmware Upgrade
   - Linksys: Connectivity → Router Firmware Update
4. Upload the **factory/install** OpenWrt firmware file you downloaded.
5. Confirm the flash. **Do not interrupt power during flashing** — this takes 2–5 minutes.
6. The router will reboot into OpenWrt.

---

## Step 5 — First Login to OpenWrt

After the flash, your router's IP will change. OpenWrt uses `192.168.1.1` by default.

Open a browser and go to: **http://192.168.1.1**

The OpenWrt LuCI web interface will load.

- **Default username:** `root`
- **Default password:** *(blank — no password by default)*

**Set a root password immediately:**
Go to **System** → **Administration** → **Router Password** → set a strong password → **Save**.

---

## Step 6 — Configure Basic Settings

### Set your timezone

**System** → **System** → **General Settings** → **Timezone** → set yours → **Save & Apply**.

### Configure your WAN connection

Go to **Network** → **Interfaces** → click **Edit** on the WAN interface.

Most home connections use DHCP (automatic IP from ISP). If your ISP uses PPPoE (common with DSL/fibre in some regions), select PPPoE and enter your ISP username and password.

Click **Save & Apply**.

### Check internet is working

Open a terminal (SSH into the router):
```bash
ssh root@192.168.1.1
ping -c 3 1.1.1.1
```

---

## Step 7 — Update Package Lists and Upgrade

```bash
ssh root@192.168.1.1
opkg update
opkg list-upgradable | cut -f 1 -d ' ' | xargs opkg upgrade
```

---

## Step 8 — Install Useful Packages

```bash
# AdGuard Home — network-wide ad blocking
opkg install adguardhome

# WireGuard VPN
opkg install wireguard-tools luci-proto-wireguard

# Statistics and traffic monitoring
opkg install luci-app-statistics collectd

# USB storage support
opkg install kmod-usb-storage block-mount
```

Packages are managed via LuCI at **System** → **Software**, or via `opkg` on the command line.

---

## Restore Stock Firmware (If Needed)

If you want to go back to the manufacturer's firmware:

1. Download the stock firmware for your router from the manufacturer's website.
2. In OpenWrt LuCI, go to **System** → **Backup/Flash Firmware** → **Flash new firmware image**.
3. Upload the stock firmware and flash it.

> Some routers require using a recovery mode (holding a reset button during boot, or using TFTP) to flash stock firmware. Check your router's OpenWrt device page for specific recovery instructions.

---

## Troubleshooting

### Router is not responding after flash (possible brick)

Do not panic. Most "bricks" are recoverable.

1. Try a factory reset: hold the router's reset button for 15–30 seconds with it powered on.
2. Try accessing the OpenWrt failsafe mode: power cycle the router and watch for a rapidly flashing LED, then press the reset button once. Connect via Ethernet and access `192.168.1.1`.
3. Check your router's OpenWrt device page for TFTP recovery instructions — most routers have a TFTP recovery mode.

### Cannot access 192.168.1.1 after flash

Your computer may still have an IP address from the old firmware. Release and renew:
```bash
# macOS/Linux
sudo dhclient -r eth0 && sudo dhclient eth0

# Windows
ipconfig /release && ipconfig /renew
```

### Wi-Fi not working after flash

OpenWrt disables Wi-Fi by default on first boot for security. Enable it in LuCI: **Network** → **Wireless** → click **Enable** on each radio → **Save & Apply**.

### Packages fail to install

Run `opkg update` first to refresh the package list, then try installing again.
