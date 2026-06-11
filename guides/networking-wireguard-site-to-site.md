---
layout: default
title: "WireGuard Site-to-Site VPN"
parent: "Networking & DNS"
nav_order: 24
---

# WireGuard Site-to-Site VPN

A site-to-site VPN connects two entire networks — devices on Site A can reach devices on Site B as if they were on the same LAN. This covers two routers/servers running WireGuard.

---

## Architecture

```
Site A (192.168.1.0/24)         Site B (192.168.2.0/24)
WireGuard IP: 10.0.0.1 -------> WireGuard IP: 10.0.0.2
```

Both sites have a WireGuard server. Each acts as both server and peer.

---

## Site A Configuration

```bash
sudo nano /etc/wireguard/wg0.conf
```

```ini
[Interface]
Address = 10.0.0.1/30
PrivateKey = SITE_A_PRIVATE_KEY
ListenPort = 51820
PostUp = iptables -A FORWARD -i wg0 -j ACCEPT; iptables -t nat -A POSTROUTING -o eth0 -j MASQUERADE
PostDown = iptables -D FORWARD -i wg0 -j ACCEPT; iptables -t nat -D POSTROUTING -o eth0 -j MASQUERADE

[Peer]
PublicKey = SITE_B_PUBLIC_KEY
Endpoint = SITE_B_PUBLIC_IP:51820
AllowedIPs = 10.0.0.2/32, 192.168.2.0/24    # WireGuard IP + Site B's LAN
PersistentKeepalive = 25
```

---

## Site B Configuration

```ini
[Interface]
Address = 10.0.0.2/30
PrivateKey = SITE_B_PRIVATE_KEY
ListenPort = 51820
PostUp = iptables -A FORWARD -i wg0 -j ACCEPT; iptables -t nat -A POSTROUTING -o eth0 -j MASQUERADE
PostDown = iptables -D FORWARD -i wg0 -j ACCEPT; iptables -t nat -D POSTROUTING -o eth0 -j MASQUERADE

[Peer]
PublicKey = SITE_A_PUBLIC_KEY
Endpoint = SITE_A_PUBLIC_IP:51820
AllowedIPs = 10.0.0.1/32, 192.168.1.0/24    # WireGuard IP + Site A's LAN
PersistentKeepalive = 25
```

---

## Route Traffic From Each LAN Through WireGuard

Devices on each LAN need to know how to reach the other network. Two options:

**Option 1 — Static route on each router:**

On Site A's router, add route: destination `192.168.2.0/24` via `192.168.1.WG_SERVER_IP`
On Site B's router, add route: destination `192.168.1.0/24` via `192.168.2.WG_SERVER_IP`

**Option 2 — Set the WireGuard server as the default gateway:**

On devices that need site-to-site access, change their default gateway to the WireGuard server.

---

## Enable IP Forwarding on Both Servers

```bash
echo "net.ipv4.ip_forward=1" | sudo tee -a /etc/sysctl.conf
sudo sysctl -p
```

---

## Start and Test

```bash
sudo systemctl enable --now wg-quick@wg0

# Test from Site A — ping a device on Site B's LAN
ping 192.168.2.100

# Check the connection
sudo wg show
```

---

## Open Firewall

```bash
sudo ufw allow 51820/udp
```
