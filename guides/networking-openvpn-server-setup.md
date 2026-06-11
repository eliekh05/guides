---
layout: default
title: "Set Up OpenVPN Server on Linux"
parent: "Networking & DNS"
nav_order: 21
---

# Set Up OpenVPN Server on Linux

OpenVPN is the most widely supported VPN protocol — every platform has a client. It is more complex to set up than WireGuard but more compatible.

---

## Easiest Setup — openvpn-install Script

The community-maintained `openvpn-install` script handles all configuration:

```bash
curl -O https://raw.githubusercontent.com/angristan/openvpn-install/master/openvpn-install.sh
chmod +x openvpn-install.sh
sudo bash openvpn-install.sh
```

The script asks:
- IP address (auto-detected)
- Port (default: 1194 UDP)
- DNS provider (Cloudflare, Google, Pi-hole, etc.)
- First client name

It installs OpenVPN, generates all certificates, and creates a `.ovpn` client config file.

---

## Add More Clients

Run the script again:
```bash
sudo bash openvpn-install.sh
```

Select **Add a new client** and enter a name. A new `.ovpn` file is created.

---

## Transfer Client Config to Your Device

```bash
# Copy to local machine
scp user@server:/root/client.ovpn ~/

# Or display contents to copy-paste
cat /root/client.ovpn
```

---

## Connect With OpenVPN Client

**macOS/Windows:** Install [Tunnelblick](https://tunnelblick.net/) or [OpenVPN Connect](https://openvpn.net/vpn-client/)

**Linux:**
```bash
sudo apt install openvpn -y
sudo openvpn --config client.ovpn
```

**iOS/Android:** Install OpenVPN Connect from App Store / Play Store

---

## Manual Setup (Without Script)

If you want to understand the setup:

```bash
sudo apt install openvpn easy-rsa -y

# Set up PKI
make-cadir ~/openvpn-ca && cd ~/openvpn-ca
./easyrsa init-pki
./easyrsa build-ca nopass
./easyrsa gen-dh
./easyrsa build-server-full server nopass
./easyrsa build-client-full client1 nopass
openvpn --genkey secret ta.key
```

Server config (`/etc/openvpn/server.conf`):
```
port 1194
proto udp
dev tun
ca /etc/openvpn/ca.crt
cert /etc/openvpn/server.crt
key /etc/openvpn/server.key
dh /etc/openvpn/dh.pem
tls-auth /etc/openvpn/ta.key 0
server 10.8.0.0 255.255.255.0
push "redirect-gateway def1 bypass-dhcp"
push "dhcp-option DNS 1.1.1.1"
keepalive 10 120
cipher AES-256-GCM
persist-key
persist-tun
status /var/log/openvpn-status.log
verb 3
```

---

## Open Firewall

```bash
sudo ufw allow 1194/udp
```

Enable IP forwarding:
```bash
echo "net.ipv4.ip_forward=1" | sudo tee -a /etc/sysctl.conf
sudo sysctl -p
```
