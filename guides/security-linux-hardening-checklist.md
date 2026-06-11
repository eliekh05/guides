---
layout: default
title: "Linux Server Security Hardening Checklist"
parent: "Security & Apps"
nav_order: 14
---

# Linux Server Security Hardening Checklist

A practical checklist for securing a fresh Linux server. Work through these in order.

---

## 1. Update Everything First

```bash
sudo apt update && sudo apt full-upgrade -y
sudo apt autoremove -y
```

---

## 2. Create a Non-Root User With sudo

```bash
adduser yourusername
usermod -aG sudo yourusername
```

Do everything as this user from now on. Disable root SSH login in the next step.

---

## 3. Harden SSH

```bash
sudo nano /etc/ssh/sshd_config.d/99-hardening.conf
```

```
PermitRootLogin no
PasswordAuthentication no
PubkeyAuthentication yes
X11Forwarding no
AllowUsers yourusername
ClientAliveInterval 300
ClientAliveCountMax 0
```

```bash
sudo sshd -t && sudo systemctl restart sshd
```

See the **Harden SSH Server** guide for full details.

---

## 4. Set Up UFW Firewall

```bash
sudo ufw default deny incoming
sudo ufw default allow outgoing
sudo ufw allow ssh
sudo ufw enable
sudo ufw status
```

Only add rules for services you actually run.

---

## 5. Install and Configure Fail2ban

```bash
sudo apt install fail2ban -y
sudo systemctl enable --now fail2ban
```

Create `/etc/fail2ban/jail.local`:
```ini
[DEFAULT]
bantime = 3600
maxretry = 3
backend = systemd

[sshd]
enabled = true
```

See the **Protect SSH with Fail2ban** guide.

---

## 6. Disable Unused Services

```bash
# List all running services
systemctl list-units --type=service --state=running

# Disable what you do not need
sudo systemctl disable --now apache2    # if not using Apache
sudo systemctl disable --now cups       # if no printer
```

---

## 7. Automatic Security Updates

```bash
sudo apt install unattended-upgrades -y
sudo dpkg-reconfigure unattended-upgrades
```

Choose "Yes" to enable automatic security updates.

---

## 8. Secure Shared Memory

```bash
sudo nano /etc/fstab
```

Add:
```
tmpfs /run/shm tmpfs defaults,noexec,nosuid 0 0
```

---

## 9. Limit su Access

```bash
sudo dpkg-statoverride --update --add root sudo 4750 /bin/su
```

Only members of the `sudo` group can use `su`.

---

## 10. Check for SUID Files

```bash
find / -perm -4000 -type f 2>/dev/null
```

Review the list. Any unexpected SUID binaries are a red flag.

---

## 11. Audit Listening Services

```bash
ss -tlnp
```

Review every listening service. If you do not recognise it or do not need it, stop and disable it.

---

## 12. Log Monitoring

```bash
# Watch for failed SSH logins
grep "Failed password" /var/log/auth.log | tail -20

# Watch in real time
sudo journalctl -f -u sshd
```

---

## 13. Run Lynis Security Audit

```bash
sudo apt install lynis -y
sudo lynis audit system
```

Lynis gives you a score and specific recommendations for your system.
