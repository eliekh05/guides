---
layout: default
title: "Set a Static IP Address on macOS"
parent: "Networking & DNS"
nav_order: 3
---

# Set a Static IP Address on macOS

There are two different things people mean when they say "static IP on Mac" and most guides only explain one of them:

- **Mac-side static IP** — you configure the IP directly on your Mac. It will use that IP regardless of what your router says.
- **Router-side DHCP reservation** — your router always assigns the same IP to your Mac based on its MAC address. The Mac itself stays on DHCP.

**Router-side reservation is almost always better** for home and small office use — it is simpler, less prone to conflicts, and does not require you to touch your Mac's settings. But if you do not have access to your router, or you need a specific IP range, the Mac-side method is the right approach.

---

## Option A — Router-Side DHCP Reservation (Recommended)

Your router assigns IPs via DHCP. Most routers let you "reserve" an IP so the same device always gets the same address.

### Step 1 — Find Your Mac's MAC Address

1. Open **System Settings** → **Network**.
2. Select your active connection (Wi-Fi or Ethernet).
3. Click **Details** (or **Advanced** on older macOS).
4. Go to the **Hardware** tab.
5. Note the **MAC Address** — it looks like `a1:b2:c3:d4:e5:f6`.

### Step 2 — Set the Reservation in Your Router

Log into your router (usually at `192.168.1.1` or `192.168.0.1` in a browser). The exact location varies by router brand, but look for:

- **DHCP Reservations** or **Static DHCP**
- **Address Reservation**
- **IP & MAC Binding**

Add a reservation with your Mac's MAC address and the IP you want. Save and apply. Your Mac will get that IP on the next DHCP renewal (or after reconnecting to Wi-Fi).

---

## Option B — Static IP Configured on the Mac

Use this if you do not have router access, you are on a network you do not control, or you need guaranteed IP independence.

### Step 1 — Note Your Current Network Settings

Before changing anything, note your current values. Open **System Settings** → **Network** → select your connection → **Details** → **TCP/IP** tab:

- Current IP address (e.g. `192.168.1.45`)
- Subnet mask (usually `255.255.255.0`)
- Router/Gateway (e.g. `192.168.1.1`)

Also note your DNS from the **DNS** tab (usually your router's IP or something like `1.1.1.1`).

### Step 2 — Choose a Static IP

Pick an IP in your network's range that is **outside your router's DHCP pool**. For most home networks (192.168.1.x):

- Router's DHCP pool is typically `192.168.1.100` to `192.168.1.200`
- Safe static IP range: `192.168.1.2` to `192.168.1.99`

Choose something like `192.168.1.10` — just make sure no other device is already using it.

### Step 3 — Configure the Static IP

1. Open **System Settings** → **Network**.
2. Select your active connection (Wi-Fi or Ethernet).
3. Click **Details**.
4. Go to the **TCP/IP** tab.
5. Change **Configure IPv4** from **Using DHCP** to **Manually**.
6. Fill in:
   - **IP Address:** your chosen static IP (e.g. `192.168.1.10`)
   - **Subnet Mask:** `255.255.255.0` (for most home networks)
   - **Router:** your gateway IP (e.g. `192.168.1.1`)
7. Go to the **DNS** tab.
8. Click **+** and add at least one DNS server:
   - Use your router's IP (e.g. `192.168.1.1`), or
   - Use a public DNS like `1.1.1.1` (Cloudflare) or `8.8.8.8` (Google)
9. Click **OK** → **Apply**.

### Step 4 — Test the Connection

Open Terminal and run:

```bash
ping -c 4 google.com
```

If it responds, your static IP and DNS are working correctly.

If ping fails, double-check the Router field — it must be your actual gateway IP, not your static IP.

---

## Revert to DHCP

If you want to go back to automatic IP assignment:

1. **System Settings** → **Network** → select connection → **Details** → **TCP/IP**.
2. Change **Configure IPv4** back to **Using DHCP**.
3. Click **OK** → **Apply**.

---

## Troubleshooting

### Internet works but websites do not load
DNS is missing or wrong. Go to the **DNS** tab in network settings and add `1.1.1.1` and `8.8.8.8`.

### IP address conflict warning
Another device on the network already uses the IP you chose. Pick a different one. To find which IPs are in use, run in Terminal:
```bash
arp -a
```
This lists all devices and their IPs on your local network.

### Mac keeps reverting to DHCP
Some VPNs and network management tools override manual network settings. Check if any VPN or network management software is installed.

### No internet after setting static IP
The Router (gateway) field is wrong. Open Terminal and run:
```bash
netstat -nr | grep default
```
The IP next to `default` is your gateway. Use that value in the Router field.
