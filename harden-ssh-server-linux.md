---
layout: default
title: "Harden SSH Server on Linux"
parent: "Security & Apps"
nav_order: 9
---

# Harden SSH Server on Linux

A default SSH install accepts password logins and allows root access — both are unnecessary attack surfaces. This guide locks SSH down to keys-only, disables root login, and applies other hardening steps.

> **Before starting:** Make sure you have a working SSH key set up and can log in with it. If you disable password auth without a working key, you will be locked out.

---

## The Config File

All SSH server settings live in:
```
/etc/ssh/sshd_config
```

On modern systems, drop-in files in `/etc/ssh/sshd_config.d/` override the main file. Using drop-ins is cleaner — create `/etc/ssh/sshd_config.d/99-hardening.conf`.

---

## Essential Hardening Settings

```bash
sudo nano /etc/ssh/sshd_config.d/99-hardening.conf
```

Paste:

```
# Disable root login
PermitRootLogin no

# Keys only — no passwords
PasswordAuthentication no
PubkeyAuthentication yes
AuthenticationMethods publickey

# Disable other auth methods
KbdInteractiveAuthentication no
ChallengeResponseAuthentication no
UsePAM yes

# Disconnect idle sessions after 5 minutes
ClientAliveInterval 300
ClientAliveCountMax 0

# Only allow specific users (optional but recommended)
AllowUsers yourusername

# Disable X11 forwarding (not needed on servers)
X11Forwarding no

# Restrict to IPv4 if you do not use IPv6
#AddressFamily inet

# Change SSH port (optional — reduces noise in logs)
#Port 2222
```

Apply:
```bash
sudo sshd -t              # test config for errors — ALWAYS do this first
sudo systemctl restart sshd
```

---

## Verify You Can Still Log In

**Before closing your current SSH session**, open a second terminal and test logging in. If it works, you are good. If it does not, fix the config in the existing session.

---

## Disable Password Auth System-Wide (Ubuntu/Debian)

Ubuntu enables password auth by default in a separate file. Override it:

```bash
sudo nano /etc/ssh/sshd_config.d/50-cloud-init.conf
```

If `PasswordAuthentication yes` is there, change it to `no`, or delete the file if you have no cloud-init dependency.

---

## Use Ed25519 Keys (More Secure Than RSA)

If you have not set up keys yet:

```bash
ssh-keygen -t ed25519 -C "your@email.com"
ssh-copy-id -i ~/.ssh/id_ed25519.pub user@server
```

---

## 2FA on SSH (Optional but Strong)

Install Google Authenticator for time-based OTP:

```bash
sudo apt install libpam-google-authenticator -y
google-authenticator       # run as the user who will SSH in
```

Edit `/etc/pam.d/sshd` — add at the top:
```
auth required pam_google_authenticator.so
```

In sshd_config:
```
AuthenticationMethods publickey,keyboard-interactive
KbdInteractiveAuthentication yes
```

Restart sshd. Now login requires both your SSH key AND a TOTP code.

---

## Quick Checklist

| Setting | Command to verify |
|---|---|
| Root login disabled | `grep PermitRootLogin /etc/ssh/sshd_config*` |
| Password auth off | `grep PasswordAuthentication /etc/ssh/sshd_config*` |
| Key auth enabled | `grep PubkeyAuthentication /etc/ssh/sshd_config*` |
| Fail2ban watching SSH | `sudo fail2ban-client status sshd` |
| UFW allowing SSH | `sudo ufw status` |
