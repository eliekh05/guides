---
layout: default
title: "Set Up CrowdSec — Collaborative Security"
parent: "Security & Apps"
nav_order: 16
---

# Set Up CrowdSec — Collaborative Security

CrowdSec is a modern security stack that analyses logs for attacks and blocks bad IPs — similar to Fail2ban but with a community intelligence layer. Blocked IPs are shared across the CrowdSec community, so you benefit from attacks detected on other servers.

---

## Install

```bash
# Ubuntu/Debian
curl -s https://packagecloud.io/install/repositories/crowdsec/crowdsec/script.deb.sh | sudo bash
sudo apt install crowdsec -y

# Fedora/RHEL
curl -s https://packagecloud.io/install/repositories/crowdsec/crowdsec/script.rpm.sh | sudo bash
sudo dnf install crowdsec -y
```

---

## Install a Bouncer (What Actually Blocks IPs)

CrowdSec detects, bouncers block. Install the firewall bouncer:

```bash
sudo apt install crowdsec-firewall-bouncer-iptables -y
```

---

## Check Status

```bash
sudo cscli status
sudo cscli decisions list         # currently blocked IPs
sudo cscli alerts list            # recent alerts
sudo cscli metrics                # detection statistics
```

---

## Install Collections (Detection Rules)

Collections are pre-packaged rules for common software:

```bash
# List installed
sudo cscli collections list

# Install common ones
sudo cscli collections install crowdsecurity/nginx
sudo cscli collections install crowdsecurity/sshd
sudo cscli collections install crowdsecurity/linux
```

---

## View and Manage Decisions

```bash
# List active bans
sudo cscli decisions list

# Manually ban an IP
sudo cscli decisions add --ip 1.2.3.4 --reason "manual ban" --duration 24h

# Unban an IP
sudo cscli decisions delete --ip 1.2.3.4

# Whitelist your own IP
sudo cscli allowlists add-item --ip YOUR.IP.HERE --duration 0 --expiry ""
```

---

## CrowdSec vs Fail2ban

| Feature | CrowdSec | Fail2ban |
|---|---|---|
| Community blocklist | ✅ Shared intelligence | ❌ Local only |
| Log parsing | Same concept | Same concept |
| Bouncer plugins | Many (nginx, cloudflare, etc.) | Limited |
| Dashboard | Online at app.crowdsec.net | None |
| Setup complexity | Slightly more | Simpler |

---

## View Your Stats Online

```bash
sudo cscli console enroll ENROLLMENT_KEY
```

Get the key at [app.crowdsec.net](https://app.crowdsec.net). View blocked IPs, attack types, and stats across all your servers from one dashboard.
