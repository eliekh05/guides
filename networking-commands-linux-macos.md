---
layout: default
title: "Essential Networking Commands (macOS and Linux)"
parent: "Networking & DNS"
nav_order: 9
---

# Essential Networking Commands (macOS and Linux)

---

## Check IP Address

```bash
# Linux
ip a
ip addr show
ip a show eth0          # specific interface

# macOS
ifconfig
ifconfig en0            # specific interface (en0 = ethernet, en1 = wifi usually)

# Both
hostname -I             # Linux only — shows all IPs
curl ifconfig.me        # your public IP
```

---

## Check Connectivity

```bash
ping google.com                  # basic connectivity test
ping -c 4 google.com             # send exactly 4 pings then stop
ping -c 4 8.8.8.8               # ping by IP (tests DNS separately)
traceroute google.com            # trace the route packets take (Linux)
traceroute google.com            # macOS also uses traceroute
mtr google.com                   # interactive traceroute (install: brew/apt install mtr)
```

---

## Check Open Ports and Connections

```bash
# Linux — modern (preferred)
ss -tlnp                         # TCP listening ports with process names
ss -tunap                        # all TCP/UDP connections
ss -tlnp | grep :22              # check if SSH is listening

# Linux — older systems
netstat -tlnp                    # same as ss -tlnp
netstat -an | grep :80           # connections on port 80

# macOS
sudo lsof -i                     # all network connections
sudo lsof -i :8080               # what's using port 8080
sudo lsof -i TCP                 # TCP connections only
```

---

## DNS Lookup

```bash
nslookup google.com              # basic DNS lookup
dig google.com                   # detailed DNS info
dig google.com A                 # A record (IPv4)
dig google.com MX                # mail records
dig google.com +short            # just the answer
dig @8.8.8.8 google.com          # query specific DNS server

host google.com                  # simple lookup
```

---

## Route and Gateway

```bash
# Linux
ip route
ip route show
ip route | grep default          # show default gateway

# macOS
route -n get default
netstat -rn | grep default

# Add a route (Linux)
sudo ip route add 10.0.0.0/24 via 192.168.1.1
```

---

## Check Network Interface Status

```bash
# Linux
ip link show                     # all interfaces
ip link set eth0 up              # bring interface up
ip link set eth0 down            # bring interface down

# macOS
ifconfig en0 | grep status
sudo ifconfig en0 up
sudo ifconfig en0 down
```

---

## Bandwidth and Traffic

```bash
# Install on Linux
sudo apt install nload iftop nethogs -y

nload                            # bandwidth per interface
iftop                            # traffic per connection
nethogs                          # bandwidth per process (like top for network)
```

---

## Test a Port

```bash
# Test if a port is open on a remote host
nc -zv google.com 443            # TCP test
nc -zv -u 8.8.8.8 53            # UDP test
telnet google.com 80             # alternative

# Check if a port is open locally
ss -tlnp | grep :80
```

---

## Network Config Files

| OS | Network config location |
|---|---|
| Ubuntu (Netplan) | `/etc/netplan/*.yaml` |
| Debian 12+ (Netplan) | `/etc/netplan/*.yaml` |
| Debian (interfaces) | `/etc/network/interfaces` |
| Fedora/RHEL | `/etc/NetworkManager/` |
| Arch | `/etc/netctl/` or NetworkManager |
| macOS | System Settings → Network |
