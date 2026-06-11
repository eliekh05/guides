---
layout: default
title: "Protect SSH with Fail2ban on Linux"
parent: "Security & Apps"
nav_order: 8
---

# Protect SSH with Fail2ban on Linux

Fail2ban watches your logs for failed login attempts and automatically bans IPs that exceed a threshold. It does not replace a firewall — it sits on top of one, adding ban rules automatically.

---

## Install

```bash
sudo apt install fail2ban -y     # Ubuntu/Debian
sudo dnf install fail2ban -y     # Fedora/RHEL
sudo pacman -S fail2ban          # Arch
```

```bash
sudo systemctl enable --now fail2ban
```

---

## Configure SSH Protection

**Never edit `/etc/fail2ban/jail.conf` directly** — it gets overwritten on updates. Create a local override:

```bash
sudo nano /etc/fail2ban/jail.local
```

Paste:

```ini
[DEFAULT]
bantime  = 3600         # ban for 1 hour
findtime = 600          # within 10 minutes
maxretry = 3            # after 3 failures
backend  = systemd      # works on all modern distros

[sshd]
enabled  = true
port     = ssh          # or 2222 if you changed the SSH port
logpath  = %(sshd_log)s
maxretry = 3
bantime  = 7200         # ban SSH attackers for 2 hours
```

Restart:
```bash
sudo systemctl restart fail2ban
```

---

## Check Status

```bash
sudo fail2ban-client status          # list all active jails
sudo fail2ban-client status sshd     # see sshd jail: banned IPs, stats
sudo tail -f /var/log/fail2ban.log   # watch bans in real time
```

---

## Manually Ban / Unban IPs

```bash
# Ban an IP
sudo fail2ban-client set sshd banip 1.2.3.4

# Unban an IP
sudo fail2ban-client set sshd unbanip 1.2.3.4

# List banned IPs
sudo fail2ban-client get sshd banned
```

---

## Whitelist Your Own IP

Add to `[DEFAULT]` in `jail.local`:

```ini
ignoreip = 127.0.0.1/8 ::1 192.168.1.0/24 YOUR.IP.HERE
```

Restart fail2ban after changes.

---

## Protect Nginx, Apache, or Other Services

```ini
[nginx-http-auth]
enabled  = true
logpath  = /var/log/nginx/error.log
maxretry = 5

[apache-auth]
enabled  = true
logpath  = /var/log/apache2/error.log
maxretry = 5
```

---

## Fix: Fail2ban Not Banning When Docker is Running

Docker-bound services run in the FORWARD chain. Fail2ban bans in the INPUT chain — bans have no effect on Docker-exposed ports.

Fix in `jail.local`:
```ini
[DEFAULT]
chain = DOCKER-USER
```

Or use the Docker-specific action:
```ini
banaction = iptables-multiport
```

---

## Fail2ban vs CrowdSec

Fail2ban is reactive — it bans after it sees failures in your logs. CrowdSec is collaborative — it shares attack intelligence across a community and blocks known bad IPs proactively. For a homelab, Fail2ban is simpler. For a public-facing server, CrowdSec is more effective.
