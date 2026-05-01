---
layout: default
title: "Install Proxmox on a Laptop (WiFi Only) via Debian 13"
parent: "Installation Guides"
nav_order: 6
---

# Install Proxmox on a Laptop (WiFi Only) via Debian 13

The official Proxmox ISO installer assumes you have an Ethernet connection and will fail or leave you with a broken network setup on a WiFi-only laptop. This guide skips the Proxmox ISO entirely and installs Proxmox on top of **Debian 13 (Trixie)** — the current stable release — using `apt`. You get the same full Proxmox VE with no subscription required, and WiFi working from the start.

> **Why not the Proxmox ISO?** The Proxmox ISO does not include WiFi drivers or `wpa_supplicant`. It expects Ethernet during installation and sets up a Linux bridge (`vmbr0`) that is incompatible with WiFi by default. This method avoids all of that.

---

## What You Need

- A laptop with a working WiFi card (most Intel and Realtek cards work out of the box on Debian)
- A USB drive (8 GB minimum) to install Debian from
- Your WiFi network name (SSID) and password
- At least **4 GB RAM** and **32 GB storage** recommended
- Another device to download files and flash the USB from

---

## Part 1 — Install Debian 13 (Trixie)

### Step 1 — Download Debian 13

Go to [debian.org/distrib/netinst](https://www.debian.org/distrib/netinst) and download the **amd64 netinst ISO** (the small installer, about 650 MB). Make sure you are downloading Debian 13 — the page will show the current stable version.

> **Always check [debian.org/releases](https://www.debian.org/releases) to confirm the current stable version before downloading.** At the time of writing this guide, the current stable release is **Debian 13 (Trixie) 13.4**.

### Step 2 — Flash the USB Drive

Download [balenaEtcher](https://etcher.balena.io) on your current machine, open it, select the Debian ISO and your USB drive, and click Flash.

### Step 3 — Boot from USB

Restart your laptop and boot from the USB drive. The key to open the boot menu varies by manufacturer — usually **F12**, **F10**, **Esc**, or **Del**. It is shown briefly on screen at startup.

### Step 4 — Install Debian

When the Debian installer loads:

1. Select **Graphical Install** (easier) or **Install** (text-based, both work).
2. Choose your language, location, and keyboard layout.
3. **Network setup:** The installer will detect your WiFi card and ask for your network. Select your WiFi SSID and enter the password. If your card is not detected, try the non-free firmware ISO instead (link is on the same Debian download page — labelled "unofficial non-free").
4. **Hostname:** Set it to something simple like `proxmox` — you will reference this later.
5. **Domain name:** Leave blank or use `local`.
6. Set a **root password** — remember this, you will need it.
7. Create a **regular user** for yourself as well.
8. **Partitioning:** Choose **Guided — use entire disk** unless you have specific needs. Accept the defaults.
9. **Software selection:** On the tasksel screen, **uncheck everything except "SSH server" and "standard system utilities"**. You do not want a desktop environment — Proxmox has its own web interface.
10. Install GRUB to the primary drive when prompted.
11. Reboot when installation finishes. Remove the USB drive.

### Step 5 — Log In and Get Your IP Address

Log in as **root** with the password you set.

Find your WiFi interface name and current IP:

```bash
ip a
```

Look for an interface named something like `wlan0`, `wlp2s0`, or `wlp0s20f3`. Note the IP address next to `inet` — you will use this to access Proxmox from your browser later.

---

## Part 2 — Prepare Debian for Proxmox

### Step 6 — Set a Static Hostname and /etc/hosts

Proxmox requires your hostname to resolve to your machine's IP — not `127.0.0.1`. Replace `YOUR_IP` with the IP from the previous step and `proxmox` with whatever hostname you chose:

```bash
hostnamectl set-hostname proxmox
```

Edit `/etc/hosts`:

```bash
nano /etc/hosts
```

Make sure it looks like this (replace `192.168.1.100` with your actual IP):

```
127.0.0.1       localhost
192.168.1.100   proxmox.local proxmox

# The following lines are desirable for IPv6 capable hosts
::1             localhost ip6-localhost ip6-loopback
ff02::1         ip6-allnodes
ff02::2         ip6-allrouters
```

Save with **Ctrl+X → Y → Enter**.

Verify it resolves correctly:

```bash
hostname --ip-address
```

It should return your actual IP, not `127.0.0.1`. If it returns `127.0.0.1`, fix the `/etc/hosts` file before continuing — Proxmox installation will fail otherwise.

### Step 7 — Update Debian

```bash
apt update && apt full-upgrade -y
```

Reboot after:

```bash
reboot
```

Log back in as root.

---

## Part 3 — Install Proxmox VE

### Step 8 — Add the Proxmox GPG Key

```bash
wget https://enterprise.proxmox.com/debian/proxmox-release-trixie.gpg \
  -O /etc/apt/trusted.gpg.d/proxmox-release-trixie.gpg

chmod +r /etc/apt/trusted.gpg.d/proxmox-release-trixie.gpg
```

### Step 9 — Add the Proxmox No-Subscription Repository

This is the free repo — no license needed. It receives the same packages as the enterprise repo, just slightly earlier in the release cycle.

```bash
echo "deb [arch=amd64] http://download.proxmox.com/debian/pve trixie pve-no-subscription" \
  > /etc/apt/sources.list.d/pve-install-repo.list
```

### Step 10 — Update and Install the Proxmox Kernel

```bash
apt update && apt full-upgrade -y
apt install proxmox-default-kernel -y
reboot
```

After rebooting, log back in as root. You are now running the Proxmox kernel.

Verify:

```bash
uname -r
```

You should see something like `6.8.12-4-pve` or similar — the `-pve` suffix confirms the Proxmox kernel is active.

### Step 11 — Install Proxmox VE

```bash
apt install proxmox-ve postfix open-iscsi chrony -y
```

During installation, **Postfix** (mail server) will ask how to configure itself. For most home lab setups, select **No configuration** and press Enter. You can configure it properly later if needed.

### Step 12 — Remove the Debian Kernel and os-prober

The Debian default kernel is no longer needed and os-prober can cause issues with VM disk partitions being detected as bootable drives:

```bash
apt remove linux-image-amd64 'linux-image-6.*' -y
update-grub
apt remove os-prober -y
```

> **Note:** The `linux-image-6.*` pattern removes any Debian 6.x kernels. If the command shows nothing to remove, that is fine.

---

## Part 4 — Configure WiFi for Proxmox

Proxmox uses `ifupdown` for networking, not NetworkManager. Your Debian WiFi connection may have been managed by `wpa_supplicant` already — we just need to make it permanent and compatible with Proxmox's networking stack.

### Step 13 — Find Your WiFi Interface Name

```bash
ip a
```

Look for the wireless interface — it will be something like `wlan0`, `wlp2s0`, or `wlp0s20f3`. Note the exact name — you will use it in the next step.

### Step 14 — Configure WiFi in /etc/network/interfaces

Edit the network interfaces file:

```bash
nano /etc/network/interfaces
```

Replace the entire contents with the following. Substitute `wlp2s0` with your actual interface name, and fill in your WiFi credentials:

```
auto lo
iface lo inet loopback

# WiFi — replace wlp2s0 with your interface name
auto wlp2s0
iface wlp2s0 inet dhcp
    wpa-ssid "YOUR_WIFI_SSID"
    wpa-psk "YOUR_WIFI_PASSWORD"
    pre-up rfkill unblock all
    pre-up ip link set wlp2s0 up

# Internal VM bridge — no physical port, uses NAT via WiFi
auto vmbr0
iface vmbr0 inet static
    address 10.10.100.1/24
    bridge-ports none
    bridge-stp off
    bridge-fd 0
    post-up echo 1 > /proc/sys/net/ipv4/ip_forward
    post-up iptables -t nat -A POSTROUTING -s '10.10.100.0/24' -o wlp2s0 -j MASQUERADE
    post-down iptables -t nat -D POSTROUTING -s '10.10.100.0/24' -o wlp2s0 -j MASQUERADE
```

Save with **Ctrl+X → Y → Enter**.

> **Why `vmbr0` has no bridge port:** WiFi access points reject bridged frames with unknown MAC addresses, so you cannot bridge WiFi like Ethernet. Instead, `vmbr0` is an internal virtual bridge and NAT routes traffic from VMs through the WiFi interface to the internet. Your VMs will have internet access but will be on their own `10.10.100.x` subnet.

### Step 15 — Install dnsmasq for VM DHCP

This gives your VMs automatic IP addresses on the `10.10.100.x` subnet:

```bash
apt install dnsmasq -y
```

Edit the dnsmasq config:

```bash
nano /etc/dnsmasq.conf
```

Scroll to the bottom and add these lines:

```
interface=vmbr0
dhcp-range=10.10.100.10,10.10.100.200,24h
dhcp-option=3,10.10.100.1
server=1.1.1.1
server=8.8.8.8
dhcp-leasefile=/var/lib/misc/dnsmasq.leases
```

Save and restart dnsmasq:

```bash
systemctl restart dnsmasq
systemctl enable dnsmasq
```

### Step 16 — Apply the Network Configuration

```bash
systemctl restart networking
```

Test that WiFi is connected:

```bash
ping -c 3 8.8.8.8
```

If ping works, your host has internet. If not, check your SSID and password in `/etc/network/interfaces` and run `systemctl restart networking` again.

---

## Part 5 — Laptop-Specific Settings

### Step 17 — Prevent Sleep When Lid is Closed

By default, closing a laptop lid suspends it — which kills your Proxmox server. Fix this:

```bash
nano /etc/systemd/logind.conf
```

Find and set these lines (uncomment them if they start with `#`):

```
HandleLidSwitch=ignore
HandleLidSwitchExternalPower=ignore
HandleLidSwitchDocked=ignore
LidSwitchIgnoreInhibited=no
```

Apply the change:

```bash
systemctl restart systemd-logind
```

---

## Part 6 — Access the Proxmox Web Interface

### Step 18 — Open Proxmox in a Browser

From another device on the same network, open a browser and go to:

```
https://YOUR_LAPTOP_IP:8006
```

Replace `YOUR_LAPTOP_IP` with the IP address you noted earlier (the one from `ip a`).

Your browser will show a certificate warning — this is normal. Proxmox uses a self-signed certificate by default. Click **Advanced** → **Proceed** (or equivalent in your browser).

Log in with:
- **Username:** `root`
- **Password:** your Debian root password
- **Realm:** Linux PAM standard authentication

### Step 19 — Disable the Subscription Nag (Optional)

Proxmox shows a popup on login saying you have no subscription check [proxmox-no-subscription-repo-setup](proxmox-no-subscription-repo-setup) guide to remove it
```

The popup will be gone after a browser refresh. This edit is cosmetic only and does not affect functionality.

---

## Troubleshooting

### WiFi connects but VMs have no internet
Make sure IP forwarding and NAT are active:
```bash
echo 1 > /proc/sys/net/ipv4/ip_forward
iptables -t nat -L -n -v
```
You should see a MASQUERADE rule for `10.10.100.0/24`. If not, bring `vmbr0` down and up again:
```bash
ifdown vmbr0 && ifup vmbr0
```

### Can't reach Proxmox web UI on port 8006
Check if the service is running:
```bash
systemctl status pveproxy
```
Check the port is listening:
```bash
ss -tlnp | grep 8006
```
If nothing is listening, Proxmox did not install correctly — re-run `apt install proxmox-ve -y`.

### hostname --ip-address returns 127.0.0.1
Your `/etc/hosts` file is wrong. Make sure the line with your actual IP comes before the `127.0.1.1` line, and that your hostname matches exactly.

### WiFi card not detected during Debian install
Download the **non-free firmware** ISO from the Debian download page (labelled "unofficial non-free"). It includes proprietary drivers for Broadcom, Realtek, and other WiFi chips that require firmware blobs.

---

> **Summary:** Install Debian 13 (Trixie) with WiFi working, add the Proxmox no-subscription repo, install `proxmox-ve`, configure a NAT bridge so VMs can reach the internet through WiFi, and prevent the lid from putting the laptop to sleep. That is everything needed for a fully functional Proxmox home lab on a laptop with no Ethernet.
