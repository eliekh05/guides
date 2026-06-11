---
layout: default
title: "Linux Networking Commands — ip, ss, route Explained"
parent: "Networking & DNS"
nav_order: 11
---

# Linux Networking Commands — ip, ss, route Explained

The old commands (`ifconfig`, `netstat`, `route`) are deprecated but still common in guides. The modern replacements are faster and more capable. This guide covers both.

---

## Show Network Interfaces

```bash
# Modern (use this)
ip a
ip addr show
ip a show eth0              # specific interface

# Old (still works on most systems)
ifconfig
ifconfig eth0
```

---

## Enable / Disable an Interface

```bash
# Modern
sudo ip link set eth0 up
sudo ip link set eth0 down

# Old
sudo ifconfig eth0 up
sudo ifconfig eth0 down
```

---

## Set an IP Address Temporarily

```bash
# Modern (removed on reboot)
sudo ip addr add 192.168.1.100/24 dev eth0
sudo ip addr del 192.168.1.100/24 dev eth0

# Old
sudo ifconfig eth0 192.168.1.100 netmask 255.255.255.0
```

For permanent IPs see the **Set a Static IP on Linux Using Netplan** guide.

---

## Show Routing Table

```bash
# Modern
ip route
ip route show
ip route | grep default          # show default gateway

# Old
route -n
netstat -rn
```

---

## Add / Delete a Route

```bash
# Add a route
sudo ip route add 10.0.0.0/24 via 192.168.1.1

# Add default gateway
sudo ip route add default via 192.168.1.1

# Delete a route
sudo ip route del 10.0.0.0/24

# Temporary — removed on reboot. For permanent routes use Netplan.
```

---

## Show Listening Ports and Connections

```bash
# Modern (ss)
ss -tlnp                         # TCP listening ports with process
ss -ulnp                         # UDP listening ports
ss -tunap                        # all TCP/UDP connections
ss -tlnp | grep :22              # who's on port 22

# Old (netstat)
sudo netstat -tlnp               # same as ss -tlnp
sudo netstat -an | grep LISTEN
```

Flags:
- `-t` = TCP
- `-u` = UDP
- `-l` = listening
- `-n` = numeric (don't resolve hostnames)
- `-p` = show process name/PID

---

## Check What's Using a Port

```bash
sudo ss -tlnp | grep :8080
sudo lsof -i :8080              # more detail including process
sudo fuser 8080/tcp             # just the PID
```

---

## Test Connectivity

```bash
ping -c 4 google.com            # basic connectivity
ping -c 4 8.8.8.8               # IP only (tests without DNS)
traceroute google.com           # trace the route
mtr google.com                  # interactive traceroute

# Test a specific port
nc -zv google.com 443           # TCP
nc -zu 8.8.8.8 53               # UDP
telnet google.com 80            # alternative
```

---

## DNS Queries

```bash
nslookup google.com
dig google.com                  # full DNS response
dig google.com +short           # just the IP
dig @8.8.8.8 google.com         # query specific DNS server
host google.com                 # simple
```

---

## Network Namespace (Advanced)

```bash
# List namespaces (used by Docker, etc.)
ip netns list

# Show interfaces in a namespace
sudo ip netns exec myns ip a
```

---

## Old vs New Command Reference

| Task | Old | New |
|---|---|---|
| Show interfaces | `ifconfig` | `ip a` |
| Enable interface | `ifconfig eth0 up` | `ip link set eth0 up` |
| Set IP | `ifconfig eth0 IP` | `ip addr add IP/PREFIX dev eth0` |
| Show routes | `route -n` | `ip route` |
| Add route | `route add -net ...` | `ip route add ...` |
| Show connections | `netstat -tlnp` | `ss -tlnp` |
