---
layout: default
title: "Audit Linux Security with Lynis"
parent: "Security & Apps"
nav_order: 18
---

# Audit Linux Security with Lynis

Lynis is a security auditing tool for Linux and macOS. It scans your system and gives a hardening score with specific recommendations.

---

## Install

```bash
sudo apt install lynis -y       # Ubuntu/Debian
sudo dnf install lynis -y       # Fedora/RHEL
brew install lynis              # macOS
```

Or download directly:
```bash
git clone https://github.com/CISOfy/lynis
cd lynis && sudo ./lynis audit system
```

---

## Run an Audit

```bash
sudo lynis audit system
```

The scan takes 2–5 minutes. Output shows:
- Tests performed and their results
- **Warnings** — issues that need attention
- **Suggestions** — improvements to make
- **Hardening index** — score out of 100

---

## Understand the Output

```
[WARNING] Found one or more settins in /etc/sysctl.conf that should be hardened
[SUGGESTION] Consider hardening system services [BOOT-5122]
[OK] Firewall seems to be active
```

Each finding has a test ID (like `BOOT-5122`). Look it up:
```bash
lynis show details BOOT-5122
```

---

## Common Findings and Fixes

**"No password set for single user mode"**
```bash
sudo passwd root    # set a root password
```

**"Kernel parameters inconsistent with sysctl settings"**
```bash
sudo sysctl -p      # reload sysctl config
```

**"Failed to determine available memory"**
Usually harmless on cloud instances or containers.

**"Found no password for GRUB boot loader"**
```bash
# Set a GRUB password
grub-mkpasswd-pbkdf2
# Add to /etc/grub.d/40_custom:
set superusers="admin"
password_pbkdf2 admin GENERATED_HASH
sudo update-grub
```

---

## Quick Audit (Non-Root)

```bash
lynis audit system --quick --no-colors 2>&1 | grep -E "WARNING|SUGGESTION|Hardening"
```

---

## Regular Scanning

Add to cron for weekly audits:
```bash
sudo crontab -e
# Add:
0 3 * * 0 /usr/bin/lynis audit system --quick --log-file /var/log/lynis-$(date +%Y%m%d).log
```

---

## macOS Audit

```bash
sudo lynis audit system
```

Works on macOS too. Checks macOS-specific things like:
- FileVault encryption
- Firewall status
- System Integrity Protection (SIP)
- Gatekeeper settings
