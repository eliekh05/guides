---
layout: default
title: "Set Up Tailscale — Zero-Config Mesh VPN"
parent: "Server & Self-Hosting"
nav_order: 24
---

# Set Up Tailscale — Zero-Config Mesh VPN

Tailscale creates an encrypted mesh network between your devices over the internet. Unlike WireGuard which requires a server and manual configuration, Tailscale connects devices directly — your laptop talks to your homelab server without port forwarding or a VPN server.

---

## Install

**Linux:**
```bash
curl -fsSL https://tailscale.com/install.sh | sh
```

**macOS:**
```bash
brew install tailscale
# or download from tailscale.com
```

**Windows:** Download from [tailscale.com/download](https://tailscale.com/download)

---

## Connect a Device

```bash
sudo tailscale up
```

A browser opens asking you to log in with Google, GitHub, or Microsoft. After login the device is connected.

```bash
tailscale ip          # your Tailscale IP (always 100.x.x.x)
tailscale status      # see all connected devices
```

---

## Connect All Your Devices

Install Tailscale on every device — laptop, phone, server, Raspberry Pi. They all appear on your Tailscale admin dashboard and can reach each other using their Tailscale IP addresses.

---

## SSH Between Devices

Once two devices are on Tailscale:

```bash
ssh user@100.x.x.x    # use Tailscale IP
```

Or with MagicDNS:
```bash
ssh user@hostname      # use device name from Tailscale admin
```

---

## Enable MagicDNS

MagicDNS lets you use device names instead of IPs:

1. Go to [login.tailscale.com](https://login.tailscale.com)
2. **DNS → Enable MagicDNS**

Now `ssh user@myserver` works if `myserver` is the device's name in Tailscale.

---

## Use as Exit Node (Route All Traffic)

Make one device (a VPS or always-on server) route all internet traffic for other devices:

**On the exit node:**
```bash
sudo tailscale up --advertise-exit-node
echo 'net.ipv4.ip_forward = 1' | sudo tee -a /etc/sysctl.d/99-tailscale.conf
sudo sysctl -p /etc/sysctl.d/99-tailscale.conf
```

In the Tailscale admin: approve the exit node.

**On devices that want to use it:**
```bash
sudo tailscale up --exit-node=IP_OF_EXIT_NODE
```

---

## Subnet Router (Access Devices Without Tailscale)

Make a server advertise your local network so other Tailscale devices can reach everything on your LAN:

```bash
sudo tailscale up --advertise-routes=192.168.1.0/24
```

Approve in Tailscale admin. Now `192.168.1.x` is reachable from anywhere on your Tailscale network.

---

## Tailscale vs WireGuard

| | Tailscale | WireGuard |
|---|---|---|
| Setup | 2 minutes | 20–60 minutes |
| Server required | No (peer-to-peer) | Yes |
| NAT traversal | Automatic | Manual port forwarding |
| Config management | Web UI | Manual files |
| Free tier | 3 users, 100 devices | Self-hosted, unlimited |
| Open source | Partially | Fully |
