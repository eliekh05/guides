---
layout: default
title: "nmap — Network Scanning and Port Discovery"
parent: "Networking & DNS"
nav_order: 16
---

# nmap — Network Scanning and Port Discovery

nmap discovers hosts and services on a network. Essential for checking what is exposed, auditing firewalls, and understanding what is running on your servers.

> **Only scan networks and hosts you own or have explicit permission to scan.** Scanning someone else's network without permission is illegal in most jurisdictions.

---

## Install

```bash
sudo apt install nmap -y     # Ubuntu/Debian
sudo dnf install nmap -y     # Fedora/RHEL
brew install nmap            # macOS
```

---

## Basic Scans

```bash
# Scan a single host — top 1000 ports
nmap 192.168.1.1

# Scan a range
nmap 192.168.1.1-50

# Scan an entire subnet
nmap 192.168.1.0/24

# Scan multiple hosts
nmap 192.168.1.1 192.168.1.5 192.168.1.10

# Scan a specific port
nmap -p 80 192.168.1.1

# Scan specific ports
nmap -p 22,80,443,8080 192.168.1.1

# Scan all 65535 ports
nmap -p- 192.168.1.1
```

---

## Scan Types

```bash
# TCP SYN scan (default, fast, stealth)
sudo nmap -sS 192.168.1.1

# TCP connect scan (no raw socket needed)
nmap -sT 192.168.1.1

# UDP scan (much slower)
sudo nmap -sU 192.168.1.1

# Combined TCP + UDP
sudo nmap -sS -sU 192.168.1.1
```

---

## Service and Version Detection

```bash
# Detect service versions
nmap -sV 192.168.1.1

# OS detection (needs sudo)
sudo nmap -O 192.168.1.1

# Aggressive scan: version + OS + scripts + traceroute
sudo nmap -A 192.168.1.1
```

---

## Host Discovery

```bash
# Ping scan only (no port scan) — find live hosts
nmap -sn 192.168.1.0/24

# Scan without ping (treat host as up even if it blocks ping)
nmap -Pn 192.168.1.1
```

---

## Output Formats

```bash
# Normal output to file
nmap -oN scan.txt 192.168.1.0/24

# XML output
nmap -oX scan.xml 192.168.1.0/24

# All formats at once
nmap -oA scan 192.168.1.0/24    # creates scan.nmap, scan.xml, scan.gnmap
```

---

## Practical Examples

```bash
# Check what ports are open on your own server
nmap -sS -sV -p- yourserver.com

# Quick LAN scan to find all devices
sudo nmap -sn 192.168.1.0/24

# Find all SSH servers on the network
nmap -p 22 --open 192.168.1.0/24

# Check if a specific service is running
nmap -p 443 --open 192.168.1.0/24

# Firewall audit — compare what should be open vs what is
nmap -p 1-1024 yourserver.com
```

---

## NSE Scripts (Nmap Scripting Engine)

```bash
# Check for common vulnerabilities
sudo nmap --script vuln 192.168.1.1

# Check SSL certificate
nmap --script ssl-cert -p 443 192.168.1.1

# Check HTTP headers
nmap --script http-headers -p 80,443 192.168.1.1

# Enumerate SMB shares
nmap --script smb-enum-shares -p 445 192.168.1.1
```
