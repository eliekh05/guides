---
layout: default
title: "Set Up UFW Firewall on Linux"
parent: "Security & Apps"
nav_order: 7
---

# Set Up UFW Firewall on Linux

UFW (Uncomplicated Firewall) is the standard firewall tool on Ubuntu and Debian. It wraps iptables/nftables in simple commands. This guide covers setup, common rules, and the Docker bypass problem most guides ignore.

---

## Install and Enable

```bash
sudo apt install ufw -y          # Ubuntu/Debian
sudo dnf install epel-release && sudo dnf install ufw -y   # Fedora/RHEL
sudo pacman -S ufw               # Arch
```

**Before enabling — allow SSH so you don't lock yourself out:**
```bash
sudo ufw allow ssh               # allows port 22
# Or for a custom SSH port:
sudo ufw allow 2222/tcp
```

Set default policies:
```bash
sudo ufw default deny incoming
sudo ufw default allow outgoing
```

Enable UFW:
```bash
sudo ufw enable
```

---

## Common Rules

```bash
# Allow specific ports
sudo ufw allow 80/tcp            # HTTP
sudo ufw allow 443/tcp           # HTTPS
sudo ufw allow 8006/tcp          # Proxmox web UI

# Allow a range
sudo ufw allow 1000:2000/tcp

# Allow from specific IP only
sudo ufw allow from 192.168.1.50 to any port 22

# Allow from subnet
sudo ufw allow from 192.168.1.0/24

# Deny a port
sudo ufw deny 23/tcp

# Delete a rule (by number)
sudo ufw status numbered
sudo ufw delete 3

# Delete by rule content
sudo ufw delete allow 80/tcp
```

---

## Check Status

```bash
sudo ufw status verbose
sudo ufw status numbered         # shows rules with numbers for easy deletion
```

---

## The Docker Bypass Problem

**Docker bypasses UFW completely.** When you run `-p 8080:80`, Docker inserts iptables rules directly into PREROUTING — before UFW processes anything. Port 8080 is open to the internet even if UFW blocks it.

**Fix — add to `/etc/ufw/after.rules`:**

```bash
sudo nano /etc/ufw/after.rules
```

Add at the end of the file:

```
# BEGIN UFW AND DOCKER
*filter
:ufw-user-forward - [0:0]
:DOCKER-USER - [0:0]
-A DOCKER-USER -j ufw-user-forward
-A DOCKER-USER -j RETURN -s 10.0.0.0/8
-A DOCKER-USER -j RETURN -s 172.16.0.0/12
-A DOCKER-USER -j RETURN -s 192.168.0.0/16
-A DOCKER-USER -j DROP
COMMIT
# END UFW AND DOCKER
```

Then reload:
```bash
sudo ufw reload
```

Now explicitly allow Docker container ports through UFW:
```bash
sudo ufw route allow proto tcp from any to any port 8080
```

---

## Reset UFW

```bash
sudo ufw reset       # removes all rules, disables UFW
```

---

## Logging

```bash
sudo ufw logging on          # enable logging
sudo ufw logging medium      # log level: off, low, medium, high, full
sudo tail -f /var/log/ufw.log
```
