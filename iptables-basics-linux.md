---
layout: default
title: "iptables Basics on Linux"
parent: "Server & Self-Hosting"
nav_order: 11
---

# iptables Basics on Linux

`iptables` is the traditional Linux firewall. On modern systems (Ubuntu 22.04+, Debian 12+) it is replaced by `nftables`, but iptables commands still work via a compatibility layer. UFW is simpler for most use cases — use iptables when you need finer control or understand what UFW is doing underneath.

---

## Check Current Rules

```bash
sudo iptables -L                    # list all rules (readable)
sudo iptables -L -n -v              # with packet counts, numeric IPs
sudo iptables -L -n -v --line-numbers   # with line numbers (for deletion)
```

Three default chains:
- **INPUT** — incoming traffic to this machine
- **OUTPUT** — outgoing traffic from this machine
- **FORWARD** — traffic passing through (routing, NAT)

---

## Default Policies

```bash
# Secure defaults — deny everything, allow explicitly
sudo iptables -P INPUT DROP
sudo iptables -P FORWARD DROP
sudo iptables -P OUTPUT ACCEPT
```

---

## Allow Rules

```bash
# Allow established connections (needed for responses to work)
sudo iptables -A INPUT -m state --state ESTABLISHED,RELATED -j ACCEPT

# Allow loopback (localhost)
sudo iptables -A INPUT -i lo -j ACCEPT

# Allow SSH
sudo iptables -A INPUT -p tcp --dport 22 -j ACCEPT

# Allow HTTP and HTTPS
sudo iptables -A INPUT -p tcp --dport 80 -j ACCEPT
sudo iptables -A INPUT -p tcp --dport 443 -j ACCEPT

# Allow from specific IP
sudo iptables -A INPUT -s 192.168.1.50 -j ACCEPT

# Allow from subnet
sudo iptables -A INPUT -s 192.168.1.0/24 -j ACCEPT

# Allow specific port from specific IP
sudo iptables -A INPUT -s 10.0.0.5 -p tcp --dport 5432 -j ACCEPT
```

---

## Deny/Drop Rules

```bash
# Drop (silently ignore)
sudo iptables -A INPUT -s 1.2.3.4 -j DROP

# Reject (sends back an error message)
sudo iptables -A INPUT -s 1.2.3.4 -j REJECT

# Block a port
sudo iptables -A INPUT -p tcp --dport 23 -j DROP
```

---

## Delete Rules

```bash
# By line number (get numbers from --line-numbers)
sudo iptables -D INPUT 3

# By rule content (same as add but with -D)
sudo iptables -D INPUT -p tcp --dport 80 -j ACCEPT

# Flush all rules in a chain
sudo iptables -F INPUT

# Flush ALL rules everywhere (resets to empty)
sudo iptables -F
```

---

## NAT (for routing/VMs)

```bash
# Enable NAT masquerade (used for VMs/containers)
sudo iptables -t nat -A POSTROUTING -s 10.10.0.0/24 -o eth0 -j MASQUERADE

# Enable IP forwarding
echo 1 | sudo tee /proc/sys/net/ipv4/ip_forward

# Make IP forwarding permanent
echo "net.ipv4.ip_forward=1" | sudo tee -a /etc/sysctl.conf
sudo sysctl -p
```

---

## Save and Restore Rules

iptables rules are lost on reboot without saving.

**Ubuntu/Debian:**
```bash
sudo apt install iptables-persistent -y
sudo netfilter-persistent save
sudo netfilter-persistent reload
```

Rules are saved to `/etc/iptables/rules.v4` and loaded at boot automatically.

**Manual save/restore:**
```bash
sudo iptables-save > /etc/iptables/rules.v4
sudo iptables-restore < /etc/iptables/rules.v4
```

---

## View NAT Rules

```bash
sudo iptables -t nat -L -n -v
```

---

## iptables vs nftables vs UFW

| | iptables | nftables | UFW |
|---|---|---|---|
| Complexity | Medium | Higher | Low |
| Modern | ❌ Legacy | ✅ Current | ✅ |
| Available | All distros | Debian 12+, Ubuntu 22.04+ | Ubuntu/Debian |
| Best for | Scripting, compatibility | New setups | Human-friendly rules |

For most users: use UFW. For servers requiring specific NAT rules: use iptables or nftables directly.
