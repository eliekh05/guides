---
layout: default
title: "Set Up Two-Factor Authentication on Linux"
parent: "Security & Apps"
nav_order: 15
---

# Set Up Two-Factor Authentication on Linux

Add TOTP (Time-based One-Time Password) two-factor authentication to SSH and sudo logins.

---

## Install Google Authenticator PAM

```bash
sudo apt install libpam-google-authenticator -y
```

---

## Configure for Your User

Run as the user who will log in:

```bash
google-authenticator
```

Answer the prompts:
- **Do you want authentication tokens to be time-based?** → y
- Scan the QR code with your authenticator app (Google Authenticator, Authy, 1Password, etc.)
- Write down the emergency scratch codes
- **Do you want me to update your "~/.google_authenticator" file?** → y
- **Do you want to disallow multiple uses of the same token?** → y
- **Do you want to increase the time window?** → n
- **Do you want to enable rate limiting?** → y

---

## Enable 2FA for SSH

Edit `/etc/pam.d/sshd`:

```bash
sudo nano /etc/pam.d/sshd
```

Add at the top:
```
auth required pam_google_authenticator.so
```

Edit `/etc/ssh/sshd_config`:

```bash
sudo nano /etc/ssh/sshd_config
```

Add or change:
```
ChallengeResponseAuthentication yes
AuthenticationMethods publickey,keyboard-interactive
```

Restart SSH:
```bash
sudo systemctl restart sshd
```

Now login requires both your SSH key AND a TOTP code.

---

## Enable 2FA for sudo

Edit `/etc/pam.d/sudo`:

```bash
sudo nano /etc/pam.d/sudo
```

Add:
```
auth required pam_google_authenticator.so
```

Now every `sudo` command asks for a TOTP code.

---

## Exclude Specific Users (Allow Access Without 2FA)

In `/etc/pam.d/sshd`, replace the line with:

```
auth required pam_google_authenticator.so nullok
```

`nullok` allows users who have not set up 2FA to log in without it. Remove `nullok` once all users are enrolled.

---

## Backup Codes

The `google-authenticator` setup gives you 5 emergency scratch codes. Store them securely — if you lose your phone, these are your only way in without the TOTP code.

---

## Other TOTP Tools

- **FreeOTP** — fully open source
- **Aegis** — Android, open source, encrypted backup
- **Authy** — cross-platform, cloud backup
- **1Password** — if you already use it for passwords
