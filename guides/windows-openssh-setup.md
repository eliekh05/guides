---
layout: default
title: "Set Up OpenSSH on Windows"
parent: "Windows"
nav_order: 15
---

# Set Up OpenSSH on Windows

Windows includes a built-in OpenSSH client and server. The client lets you SSH into Linux servers from PowerShell. The server lets you SSH into your Windows machine.

---

## Install OpenSSH

**Check if already installed:**
```powershell
Get-WindowsCapability -Online | Where-Object Name -like 'OpenSSH*'
```

**Install client and server:**
```powershell
Add-WindowsCapability -Online -Name OpenSSH.Client~~~~0.0.1.0
Add-WindowsCapability -Online -Name OpenSSH.Server~~~~0.0.1.0
```

Or: Settings → Optional features → Add a feature → search "OpenSSH"

---

## Enable SSH Server

```powershell
# Start the service
Start-Service sshd

# Set to auto-start
Set-Service -Name sshd -StartupType Automatic

# Allow through firewall (already done automatically)
Get-NetFirewallRule -Name *ssh*
```

---

## Connect to Another Machine

```powershell
# SSH into a Linux server
ssh username@server-ip

# SSH into another Windows machine with SSH server enabled
ssh username@windows-machine-ip
```

---

## Set Up SSH Keys (No Password Login)

```powershell
# Generate a key pair
ssh-keygen -t ed25519 -C "your@email.com"
# Keys saved to: C:\Users\YourName\.ssh\

# Copy public key to Linux server
type $env:USERPROFILE\.ssh\id_ed25519.pub | ssh user@server "cat >> ~/.ssh/authorized_keys"
```

For Windows-to-Windows SSH with keys, the authorized_keys file location differs for admin users:

**For standard users:** `C:\Users\Username\.ssh\authorized_keys`
**For administrators:** `C:\ProgramData\ssh\administrators_authorized_keys`

Set correct permissions on the administrators file:
```powershell
# Fix permissions on the admin authorized_keys
icacls "C:\ProgramData\ssh\administrators_authorized_keys" /inheritance:r /grant "SYSTEM:R" /grant "Administrators:R"
```

---

## SSH Config for Multiple Hosts

Create `C:\Users\YourName\.ssh\config`:

```
Host myserver
    HostName 192.168.1.100
    User ubuntu
    IdentityFile ~/.ssh/id_ed25519

Host work
    HostName work.example.com
    User john
    Port 2222
```

Then just: `ssh myserver` or `ssh work`

---

## SCP — Copy Files

```powershell
# Copy file to remote server
scp C:\file.txt user@server:/home/user/

# Copy from remote server
scp user@server:/home/user/file.txt C:\

# Copy entire directory
scp -r C:\folder user@server:/home/user/
```
