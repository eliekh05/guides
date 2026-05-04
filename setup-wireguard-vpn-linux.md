---
layout: default
title: "Set Up WireGuard VPN on Linux"
parent: "Networking & DNS"
nav_order: 6
---

# Set Up WireGuard VPN on Linux

WireGuard is the fastest, simplest VPN protocol available. This guide covers setting up a WireGuard **server** on a Linux VPS and connecting a **client** (your laptop or desktop).

---

## Install WireGuard

**Ubuntu / Debian:**
```bash
sudo apt update && sudo apt install wireguard -y
```

**Fedora:**
```bash
sudo dnf install wireguard-tools -y
```

**Arch:**
```bash
sudo pacman -S wireguard-tools
```

---

## Server Setup

### 1 — Generate server keys

```bash
wg genkey | tee /etc/wireguard/server_private.key | wg pubkey > /etc/wireguard/server_public.key
chmod 600 /etc/wireguard/server_private.key
```

### 2 — Find your server's network interface

```bash
ip route | grep default
```

Note the interface name — usually `eth0`, `ens3`, or `enp1s0`.

### 3 — Create the server config

```bash
sudo nano /etc/wireguard/wg0.conf
```

```ini
[Interface]
Address = 10.0.0.1/24
ListenPort = 51820
PrivateKey = PASTE_SERVER_PRIVATE_KEY_HERE

# Enable NAT so clients can reach the internet
PostUp = iptables -A FORWARD -i wg0 -j ACCEPT; iptables -A FORWARD -o wg0 -j ACCEPT; iptables -t nat -A POSTROUTING -o eth0 -j MASQUERADE
PostDown = iptables -D FORWARD -i wg0 -j ACCEPT; iptables -D FORWARD -o wg0 -j ACCEPT; iptables -t nat -D POSTROUTING -o eth0 -j MASQUERADE
```

Replace `eth0` with your actual interface name. Replace `PASTE_SERVER_PRIVATE_KEY_HERE` with the contents of:
```bash
cat /etc/wireguard/server_private.key
```

### 4 — Enable IP forwarding

```bash
echo "net.ipv4.ip_forward=1" | sudo tee -a /etc/sysctl.conf
sudo sysctl -p
```

### 5 — Start WireGuard

```bash
sudo systemctl enable --now wg-quick@wg0
sudo wg show
```

---

## Client Setup

### 1 — Generate client keys (run on the client machine)

```bash
wg genkey | tee client_private.key | wg pubkey > client_public.key
```

### 2 — Add the client to the server config

On the **server**, edit `/etc/wireguard/wg0.conf` and add:

```ini
[Peer]
PublicKey = PASTE_CLIENT_PUBLIC_KEY_HERE
AllowedIPs = 10.0.0.2/32
```

Restart WireGuard on the server:
```bash
sudo systemctl restart wg-quick@wg0
```

### 3 — Create the client config

On the **client**, create `/etc/wireguard/wg0.conf`:

```ini
[Interface]
Address = 10.0.0.2/24
PrivateKey = PASTE_CLIENT_PRIVATE_KEY_HERE
DNS = 1.1.1.1

[Peer]
PublicKey = PASTE_SERVER_PUBLIC_KEY_HERE
Endpoint = YOUR_SERVER_IP:51820
AllowedIPs = 0.0.0.0/0
PersistentKeepalive = 25
```

- `AllowedIPs = 0.0.0.0/0` — routes ALL traffic through VPN
- Change to `10.0.0.0/24` if you only want to reach the VPN network, not tunnel all traffic

### 4 — Connect

```bash
sudo wg-quick up wg0
```

Disconnect:
```bash
sudo wg-quick down wg0
```

Enable auto-connect on boot:
```bash
sudo systemctl enable wg-quick@wg0
```

---

## Check the Connection

```bash
sudo wg show
curl ifconfig.me    # Should show your server's IP if routing all traffic
```

---

## Open the Firewall Port on the Server

```bash
# UFW (Ubuntu)
sudo ufw allow 51820/udp
sudo ufw reload

# firewalld (Fedora)
sudo firewall-cmd --add-port=51820/udp --permanent
sudo firewall-cmd --reload
```
