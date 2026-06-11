---
layout: default
title: "Join Linux to a Windows Active Directory Domain (realm + SSSD)"
parent: "Networking & DNS"
nav_order: 10
---

# Join Linux to a Windows Active Directory Domain (realm + SSSD)

Joining a Linux machine to a Windows Active Directory domain lets AD users log in with their domain credentials instead of local accounts. The standard method uses `realmd` to handle the join and `SSSD` to handle ongoing authentication.

> **Before you start:** Your Linux machine must use the AD domain controller as its DNS server. Most join failures are DNS issues. Kerberos authentication depends entirely on proper DNS resolution.

---

## Requirements

- A working Active Directory domain
- DNS pointing to your AD domain controller
- An AD admin account (or an account with permission to join computers)
- Time synchronized between Linux and AD (Kerberos fails if clocks differ by more than 5 minutes)

---

## Step 1 — Set DNS to Point to the Domain Controller

```bash
# Check current DNS
resolvectl status | grep "DNS Servers"
cat /etc/resolv.conf

# Temporarily set DNS (replace with your DC's IP)
echo "nameserver 192.168.1.10" | sudo tee /etc/resolv.conf

# Verify DNS resolves your domain
nslookup corp.example.com
```

For a permanent DNS change, edit your Netplan config — see the **Set a Static IP on Linux Using Netplan** guide.

---

## Step 2 — Sync Time

```bash
sudo timedatectl set-ntp true
sudo systemctl restart systemd-timesyncd
timedatectl status
```

---

## Step 3 — Install Required Packages

**Ubuntu / Debian:**
```bash
sudo apt update
sudo apt install -y realmd sssd sssd-tools libnss-sss libpam-sss \
  adcli samba-common-bin oddjob oddjob-mkhomedir packagekit
```

**Fedora / RHEL / CentOS:**
```bash
sudo dnf install -y realmd sssd sssd-tools adcli samba-common-tools \
  oddjob oddjob-mkhomedir
```

---

## Step 4 — Discover the Domain

```bash
sudo realm discover corp.example.com
```

Replace `corp.example.com` with your actual domain. Expected output:

```
corp.example.com
  type: kerberos
  realm-name: CORP.EXAMPLE.COM
  domain-name: corp.example.com
  configured: no
  server-software: active-directory
  client-software: sssd
  required-package: sssd-tools
  required-package: sssd
  ...
```

If this fails, the problem is DNS — fix Step 1 first.

---

## Step 5 — Join the Domain

```bash
sudo realm join --user=Administrator corp.example.com
```

Enter the AD Administrator password when prompted.

**Join and place in a specific Organizational Unit (OU):**
```bash
sudo realm join --user=Administrator \
  --computer-ou="OU=LinuxServers,DC=corp,DC=example,DC=com" \
  corp.example.com
```

**Verify the join:**
```bash
realm list
```

Output should show `configured: kerberos-member`.

---

## Step 6 — Enable Home Directory Auto-Creation

Without this, AD users who log in will get an error because their home directory doesn't exist:

```bash
sudo pam-auth-update --enable mkhomedir
```

Or manually add to `/etc/pam.d/common-session`:
```
session required pam_mkhomedir.so skel=/etc/skel/ umask=0022
```

---

## Step 7 — Test AD User Login

```bash
# Check if AD user is recognized (use full domain format)
id john@corp.example.com

# Or if use_fully_qualified_names is disabled:
id john

# Check if you can get a Kerberos ticket
kinit john@CORP.EXAMPLE.COM
klist
```

---

## Step 8 — Allow AD Users to sudo (Optional)

```bash
sudo visudo
```

Add:
```
# Allow specific AD user
john@corp.example.com ALL=(ALL:ALL) ALL

# Allow entire AD group
%domain\ admins@corp.example.com ALL=(ALL:ALL) ALL
```

Note: spaces in group names must be escaped with `\ `.

---

## SSSD Configuration

The main config is at `/etc/sssd/sssd.conf` — must be `0600` permissions and owned by `root:root`:

```bash
sudo chmod 600 /etc/sssd/sssd.conf
sudo chown root:root /etc/sssd/sssd.conf
```

**Useful settings to add/change in `/etc/sssd/sssd.conf`:**

```ini
[domain/corp.example.com]
# Login with just username (not user@domain)
use_fully_qualified_names = False

# Cache credentials for offline login
cache_credentials = True

# Restrict who can log in (AD group)
ad_access_filter = memberOf=CN=LinuxUsers,OU=Groups,DC=corp,DC=example,DC=com

# Home directory format
override_homedir = /home/%u
```

Restart SSSD after changes:
```bash
sudo systemctl restart sssd
```

---

## Leave the Domain

```bash
sudo realm leave corp.example.com
```

---

## Troubleshooting

### `realm discover` returns nothing
DNS is wrong. Confirm `nslookup corp.example.com` returns your DC's IP.

### `realm join` fails with "Message stream modified"
Known issue with Windows Server 2025 and older realm/adcli versions. Update packages:
```bash
sudo apt update && sudo apt upgrade realmd adcli -y
```

### SSSD not starting after join
Check permissions:
```bash
sudo chmod 600 /etc/sssd/sssd.conf
sudo systemctl restart sssd
sudo systemctl status sssd
```

### AD users can be looked up but can't login
Home directory doesn't exist. Enable `mkhomedir` (Step 6).

### Clock skew error
Time difference between Linux and DC is too large. Sync NTP (Step 2).

### Check SSSD logs
```bash
sudo tail -f /var/log/sssd/sssd_corp.example.com.log
```
