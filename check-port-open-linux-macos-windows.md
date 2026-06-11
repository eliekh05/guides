---
layout: default
title: "Check If a Port is Open (Linux, macOS, Windows)"
parent: "Networking & DNS"
nav_order: 12
---

# Check If a Port is Open (Linux, macOS, Windows)

---

## Check What is Listening Locally

```bash
# Linux — modern
ss -tlnp                        # TCP listening ports with process names
ss -tulnp                       # TCP and UDP
ss -tlnp | grep :80             # check if port 80 is listening

# Linux — older systems
netstat -tlnp
netstat -tlnp | grep :80

# macOS
sudo lsof -i TCP -sTCP:LISTEN   # all listening TCP ports
sudo lsof -i :8080              # specific port
sudo lsof -i :80 -i :443        # multiple ports

# Windows (PowerShell)
netstat -ano | findstr :80
Get-NetTCPConnection -State Listen
```

---

## Test a Remote Port

```bash
# nc (netcat) — macOS and Linux
nc -zv hostname 443             # TCP test
nc -zv -u hostname 53          # UDP test
nc -zv 192.168.1.100 22        # test SSH

# telnet
telnet hostname 80

# curl (HTTP/HTTPS)
curl -v https://example.com     # shows connection details

# nmap
nmap -p 80,443 example.com      # scan specific ports
nmap -p 1-1000 192.168.1.100   # scan range
```

---

## Windows — Test a Remote Port

```powershell
# PowerShell
Test-NetConnection example.com -Port 443
Test-NetConnection 192.168.1.100 -Port 22

# Telnet (enable first in Windows Features)
telnet hostname port
```

---

## What is Using a Port

```bash
# Linux — find process using port 8080
sudo ss -tlnp | grep :8080
sudo fuser 8080/tcp             # just the PID
sudo lsof -i :8080              # process name + PID

# macOS
sudo lsof -i :8080

# Kill the process using a port
sudo kill $(sudo lsof -t -i:8080)
```

---

## Open a Port in the Firewall

**UFW (Ubuntu/Debian):**
```bash
sudo ufw allow 8080/tcp
sudo ufw allow 443
sudo ufw reload
```

**firewalld (Fedora/RHEL):**
```bash
sudo firewall-cmd --add-port=8080/tcp --permanent
sudo firewall-cmd --reload
```

**macOS:**
```bash
sudo /usr/libexec/ApplicationFirewall/socketfilterfw --add /path/to/app
```

---

## Common Port Numbers

| Port | Service |
|---|---|
| 22 | SSH |
| 25 | SMTP |
| 53 | DNS |
| 80 | HTTP |
| 443 | HTTPS |
| 3306 | MySQL |
| 5432 | PostgreSQL |
| 6379 | Redis |
| 8006 | Proxmox web UI |
| 8080 | HTTP alt / dev servers |
| 27017 | MongoDB |
