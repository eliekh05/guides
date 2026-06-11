---
layout: default
title: "IPv6 Basics on Linux"
parent: "Networking & DNS"
nav_order: 22
---

# IPv6 Basics on Linux

IPv6 is the successor to IPv4. While IPv4 uses 32-bit addresses (192.168.1.1), IPv6 uses 128-bit addresses (2001:db8::1). Most Linux systems have IPv6 enabled by default even if you do not use it.

---

## Check IPv6 Addresses

```bash
ip -6 addr                  # all IPv6 addresses
ip -6 addr show eth0        # specific interface
curl -6 ifconfig.me         # your public IPv6
```

---

## Types of IPv6 Addresses

| Prefix | Type | Equivalent |
|---|---|---|
| `::1` | Loopback | 127.0.0.1 |
| `fe80::/10` | Link-local (auto-assigned, not routable) | 169.254.x.x |
| `fd00::/8` | Unique local (private network) | 192.168.x.x |
| `2001::/16` | Global unicast (public internet) | Public IPv4 |

---

## Test IPv6 Connectivity

```bash
ping6 google.com            # ping via IPv6
ping6 ::1                   # ping loopback
curl -6 https://google.com  # HTTP via IPv6
```

---

## Configure a Static IPv6 Address (Netplan)

```bash
sudo nano /etc/netplan/01-netcfg.yaml
```

```yaml
network:
  version: 2
  ethernets:
    eth0:
      addresses:
        - 192.168.1.100/24          # IPv4 (existing)
        - 2001:db8::100/64          # IPv6 (new)
      routes:
        - to: default
          via: 192.168.1.1          # IPv4 gateway
        - to: "::/0"
          via: "2001:db8::1"        # IPv6 gateway
      nameservers:
        addresses: [1.1.1.1, 2606:4700:4700::1111]   # IPv4 and IPv6 DNS
```

```bash
sudo netplan apply
```

---

## Disable IPv6 (If Causing Issues)

```bash
sudo nano /etc/sysctl.d/99-disable-ipv6.conf
```

```
net.ipv6.conf.all.disable_ipv6 = 1
net.ipv6.conf.default.disable_ipv6 = 1
```

```bash
sudo sysctl -p /etc/sysctl.d/99-disable-ipv6.conf
```

To re-enable, remove the file and reboot.

---

## Firewall Rules for IPv6

`ufw` manages IPv4 and IPv6 rules together. Confirm:
```bash
cat /etc/default/ufw | grep IPV6
# Should show: IPV6=yes
```

`iptables` IPv6 rules need a separate command:
```bash
sudo ip6tables -A INPUT -m state --state ESTABLISHED,RELATED -j ACCEPT
sudo ip6tables -A INPUT -p tcp --dport 22 -j ACCEPT
sudo ip6tables -A INPUT -j DROP
```
