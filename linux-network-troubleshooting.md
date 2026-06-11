---
layout: default
title: "Network Troubleshooting on Linux"
parent: "Networking & DNS"
nav_order: 13
---

# Network Troubleshooting on Linux

A systematic approach to diagnosing network problems — from physical layer to application.

---

## Step 1 — Is the Interface Up?

```bash
ip a
```

Look for your interface (eth0, ens3, wlan0, etc.). It should show `UP` and have an IP address. If it shows `DOWN`:

```bash
sudo ip link set eth0 up
```

---

## Step 2 — Do You Have an IP Address?

```bash
ip a show eth0
```

If no IP address is assigned, DHCP may have failed:

```bash
sudo dhclient eth0                      # request a DHCP lease (Debian/Ubuntu)
sudo nmcli connection up "connection"   # NetworkManager
sudo systemctl restart networking       # restart networking entirely
```

---

## Step 3 — Can You Reach the Gateway?

```bash
ip route | grep default                 # find your gateway IP
ping -c 4 192.168.1.1                   # ping the gateway (replace with your IP)
```

If this fails — problem is between you and the router. Check cable, WiFi connection, or interface configuration.

---

## Step 4 — Can You Reach the Internet by IP?

```bash
ping -c 4 8.8.8.8
```

If this works but Step 5 does not — it is a DNS problem.
If this fails but Step 3 works — problem is between your router and the internet.

---

## Step 5 — Does DNS Work?

```bash
ping -c 4 google.com
nslookup google.com
dig google.com +short
```

If DNS fails but pinging by IP works:

```bash
# Check current DNS servers
cat /etc/resolv.conf
resolvectl status

# Test a specific DNS server
dig @8.8.8.8 google.com +short

# Temporarily set DNS
echo "nameserver 8.8.8.8" | sudo tee /etc/resolv.conf
```

For permanent DNS fix see the **Set a Static IP on Linux Using Netplan** guide.

---

## Diagnose Packet Loss and Latency

```bash
ping -c 20 google.com               # look for packet loss in output
mtr google.com                      # interactive traceroute shows per-hop loss
traceroute google.com               # trace each hop to destination
```

---

## Check Listening Services

```bash
ss -tlnp                            # what's listening on which port
ss -tlnp | grep :80                 # is port 80 open?
sudo lsof -i :80                    # what process is on port 80
```

---

## Test a Remote Port

```bash
nc -zv google.com 443               # can I reach port 443?
nc -zv google.com 22                # can I reach SSH?
nc -zv -w 5 192.168.1.100 8006      # with 5 second timeout
```

---

## Check Firewall

```bash
sudo ufw status                     # UFW
sudo iptables -L -n -v              # iptables rules
sudo firewall-cmd --list-all        # firewalld (Fedora/RHEL)
```

---

## Check for Duplicate IPs (ARP)

```bash
sudo arping -I eth0 192.168.1.100   # check if an IP is already in use
arp -a                              # show ARP cache
```

---

## DNS Flush

```bash
# Ubuntu/Debian with systemd-resolved
sudo resolvectl flush-caches
sudo systemctl restart systemd-resolved

# Older systems
sudo systemd-resolve --flush-caches
```

---

## Read Network Logs

```bash
journalctl -u NetworkManager -f     # NetworkManager logs
journalctl -u networking -f         # Debian networking service
dmesg | grep -i eth                 # kernel messages about ethernet
dmesg | grep -i wifi                # kernel messages about WiFi
```

---

## Reset Network Configuration

```bash
# Restart NetworkManager (most distros)
sudo systemctl restart NetworkManager

# Restart Debian/Ubuntu networking
sudo systemctl restart networking

# Restart specific interface via NetworkManager
sudo nmcli connection down "connection-name"
sudo nmcli connection up "connection-name"
```

---

## Bandwidth Test

```bash
# Install iperf3 on both machines
sudo apt install iperf3 -y

# On server machine
iperf3 -s

# On client machine
iperf3 -c server-ip
```

---

## Quick Diagnostic Checklist

```bash
# Run all at once for a quick overview
echo "=== Interfaces ===" && ip a
echo "=== Routes ===" && ip route
echo "=== DNS ===" && cat /etc/resolv.conf
echo "=== Gateway ping ===" && ping -c 2 $(ip route | grep default | awk '{print $3}')
echo "=== Internet ping ===" && ping -c 2 8.8.8.8
echo "=== DNS test ===" && dig google.com +short
```
