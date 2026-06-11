---
layout: default
title: "Network Troubleshooting on macOS and Linux"
parent: "Networking & DNS"
nav_order: 10
---

# Network Troubleshooting on macOS and Linux

A systematic approach to diagnosing network problems — from no internet to DNS failures to unreachable servers.

---

## Step 1 — Is the Interface Up?

```bash
# Linux
ip a
ip link show

# macOS
ifconfig
networksetup -listallhardwareports
```

Look for your interface (eth0, en0, wlan0, etc.). Check it shows an IP address and `state UP`.

---

## Step 2 — Can You Reach the Gateway?

Find your gateway:
```bash
# Linux
ip route | grep default        # e.g. "default via 192.168.1.1"

# macOS
netstat -rn | grep default
route -n get default
```

Ping the gateway:
```bash
ping -c 4 192.168.1.1
```

If this fails: the problem is between you and your router — cable, WiFi, or local network config.

---

## Step 3 — Can You Reach the Internet by IP?

```bash
ping -c 4 1.1.1.1
ping -c 4 8.8.8.8
```

If this works but Step 4 fails: DNS is broken.
If this fails: routing or firewall issue.

---

## Step 4 — Does DNS Work?

```bash
nslookup google.com
dig google.com
host google.com
```

Check which DNS server is being used:
```bash
cat /etc/resolv.conf             # Linux
scutil --dns | grep nameserver   # macOS
```

Manually test with a known good DNS server:
```bash
dig @8.8.8.8 google.com          # test against Google DNS
dig @1.1.1.1 google.com          # test against Cloudflare DNS
```

---

## Step 5 — Check Firewall

```bash
# Linux
sudo ufw status
sudo iptables -L -n
sudo nft list ruleset

# macOS
sudo /usr/libexec/ApplicationFirewall/socketfilterfw --getglobalstate
```

---

## Step 6 — Check If a Port is Open

```bash
# Test TCP port
nc -zv hostname 443
nc -zv 192.168.1.100 22

# Test UDP port
nc -zvu hostname 53

# Check what is listening locally
ss -tlnp         # Linux
sudo lsof -iTCP -sTCP:LISTEN    # macOS
```

---

## Step 7 — Trace the Route

```bash
traceroute google.com            # macOS and Linux
traceroute -T google.com         # TCP-based (better through firewalls)
mtr google.com                   # live continuous traceroute
```

Where the route stops or shows high latency is where the problem is.

---

## Reset Network Stack

**Linux:**
```bash
sudo systemctl restart NetworkManager    # restart NetworkManager
sudo ip link set eth0 down && sudo ip link set eth0 up   # restart interface
sudo dhclient -r eth0 && sudo dhclient eth0              # release and renew DHCP
```

**macOS:**
```bash
# Renew DHCP
ipconfig set en0 DHCP

# Flush DNS
sudo dscacheutil -flushcache; sudo killall -HUP mDNSResponder

# Restart network interface
sudo ifconfig en0 down && sudo ifconfig en0 up

# Reset all network settings (nuclear — removes all saved WiFi etc.)
sudo rm /Library/Preferences/SystemConfiguration/NetworkInterfaces.plist
sudo rm /Library/Preferences/SystemConfiguration/preferences.plist
# Then restart
```

---

## Quick Diagnosis Flowchart

```
No internet?
├── Can ping 192.168.1.1? → No → Check cable/WiFi, check IP address
├── Can ping 1.1.1.1? → No → Check routing, check firewall
├── Can ping 1.1.1.1 but not google.com → DNS broken
│   └── Fix: change DNS to 1.1.1.1 or 8.8.8.8
└── Can ping google.com but browser fails → Check proxy, browser settings
```
