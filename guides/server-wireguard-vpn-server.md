---
layout: default
title: "Set Up WireGuard VPN Server on Linux"
parent: "Server & Self-Hosting"
nav_order: 21
---

# Set Up WireGuard VPN Server on Linux

WireGuard is a modern, fast, and simple VPN. Setting up a VPN server lets you access your home network remotely, route all your internet traffic through a server, and securely connect multiple sites.

---

## Install WireGuard

```bash
sudo apt install wireguard -y     # Ubuntu/Debian
sudo dnf install wireguard-tools -y  # Fedora/RHEL
sudo pacman -S wireguard-tools    # Arch
```

---

## Generate Server Keys

```bash
cd /etc/wireguard
umask 077
wg genkey | tee server_private.key | wg pubkey > server_public.key
cat server_private.key    # save this
cat server_public.key     # share this with clients
```

---

## Server Config (/etc/wireguard/wg0.conf)

```bash
sudo nano /etc/wireguard/wg0.conf
```

```ini
[Interface]
Address = 10.0.0.1/24
ListenPort = 51820
PrivateKey = YOUR_SERVER_PRIVATE_KEY

# Enable NAT (replace eth0 with your network interface)
PostUp = iptables -A FORWARD -i %i -j ACCEPT; iptables -A FORWARD -o %i -j ACCEPT; iptables -t nat -A POSTROUTING -o eth0 -j MASQUERADE
PostDown = iptables -D FORWARD -i %i -j ACCEPT; iptables -D FORWARD -o %i -j ACCEPT; iptables -t nat -D POSTROUTING -o eth0 -j MASQUERADE

# Client peer — add one block per client
[Peer]
PublicKey = CLIENT_PUBLIC_KEY
AllowedIPs = 10.0.0.2/32
```

Enable IP forwarding:
```bash
echo "net.ipv4.ip_forward=1" | sudo tee -a /etc/sysctl.conf
sudo sysctl -p
```

Start and enable:
```bash
sudo systemctl enable --now wg-quick@wg0
```

---

## Generate Client Keys

```bash
wg genkey | tee client_private.key | wg pubkey > client_public.key
```

## Client Config

```ini
[Interface]
Address = 10.0.0.2/24
PrivateKey = CLIENT_PRIVATE_KEY
DNS = 1.1.1.1

[Peer]
PublicKey = SERVER_PUBLIC_KEY
Endpoint = YOUR_SERVER_IP:51820
AllowedIPs = 0.0.0.0/0    # route ALL traffic through VPN
# AllowedIPs = 10.0.0.0/24  # or just route to VPN network
PersistentKeepalive = 25
```

---

## Add Clients Easily with wg-easy

`wg-easy` is a Docker container that provides a web UI for managing WireGuard clients:

```bash
docker run -d \
  --name wg-easy \
  --restart unless-stopped \
  -e WG_HOST=YOUR_SERVER_IP \
  -e PASSWORD=yourpassword \
  -v ~/.wg-easy:/etc/wireguard \
  -p 51820:51820/udp \
  -p 51821:51821/tcp \
  --cap-add NET_ADMIN \
  --cap-add SYS_MODULE \
  --sysctl net.ipv4.ip_forward=1 \
  ghcr.io/wg-easy/wg-easy:latest
```

Access at `http://YOUR_IP:51821`. Generate QR codes for phone clients.

---

## Open Firewall

```bash
sudo ufw allow 51820/udp
```

---

## Manage the Server

```bash
sudo wg show                     # show current connections
sudo wg showconf wg0             # show current config
sudo systemctl restart wg-quick@wg0  # restart WireGuard
```
