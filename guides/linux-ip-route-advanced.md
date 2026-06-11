---
layout: default
title: "Advanced IP Routing on Linux"
parent: "Networking & DNS"
nav_order: 23
---

# Advanced IP Routing on Linux

Beyond basic routing, Linux supports policy routing, multiple routing tables, and traffic shaping.

---

## View Routing Tables

```bash
ip route                          # main routing table
ip route show table all           # all routing tables
ip route show table local         # local/loopback routes
```

---

## Add and Delete Static Routes

```bash
# Add a route (temporary — removed on reboot)
sudo ip route add 10.0.0.0/24 via 192.168.1.1 dev eth0

# Add default gateway
sudo ip route add default via 192.168.1.1

# Delete a route
sudo ip route del 10.0.0.0/24

# Flush all routes (careful!)
sudo ip route flush table main
```

---

## Check Route for a Specific Destination

```bash
ip route get 8.8.8.8           # which route would be used to reach 8.8.8.8
ip route get 192.168.1.50      # route to LAN host
```

---

## Permanent Routes with Netplan (Ubuntu/Debian)

```yaml
network:
  version: 2
  ethernets:
    eth0:
      routes:
        - to: 10.0.0.0/8
          via: 192.168.1.1
        - to: 0.0.0.0/0
          via: 192.168.1.1    # default route
```

---

## Policy Routing (Multiple Routing Tables)

Useful when a machine has multiple network interfaces and you need traffic from each interface to go back through that same interface:

```bash
# Create a new routing table (add to /etc/iproute2/rt_tables)
echo "100 custom_table" | sudo tee -a /etc/iproute2/rt_tables

# Add a route to the custom table
sudo ip route add default via 192.168.2.1 table custom_table

# Add a rule: traffic from 192.168.2.x uses the custom table
sudo ip rule add from 192.168.2.0/24 table custom_table

# View rules
ip rule list
```

---

## Enable IP Forwarding (Routing Between Interfaces)

```bash
# Temporary
echo 1 > /proc/sys/net/ipv4/ip_forward

# Permanent
echo "net.ipv4.ip_forward = 1" | sudo tee -a /etc/sysctl.d/99-routing.conf
sudo sysctl -p /etc/sysctl.d/99-routing.conf
```

---

## Source NAT (MASQUERADE)

Make traffic from one network appear to come from your machine:

```bash
sudo iptables -t nat -A POSTROUTING -s 10.0.0.0/24 -o eth0 -j MASQUERADE
```

This is what WireGuard and OpenVPN use to let VPN clients reach the internet.

---

## traceroute and mtr

```bash
traceroute google.com          # trace hops to a destination
traceroute -T -p 443 google.com  # TCP traceroute on port 443
mtr google.com                  # live updating traceroute
mtr --report google.com         # generate a report
```
