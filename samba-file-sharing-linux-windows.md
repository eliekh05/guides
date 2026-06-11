---
layout: default
title: "Samba File Sharing Between Linux and Windows"
parent: "Server & Self-Hosting"
nav_order: 8
---

# Samba File Sharing Between Linux and Windows

Samba implements the SMB protocol on Linux — the same protocol Windows uses for file sharing. With Samba you can share Linux folders and access them from Windows, macOS, or other Linux machines exactly like a network drive.

---

## Install Samba

```bash
sudo apt install samba samba-common -y     # Ubuntu/Debian
sudo dnf install samba samba-client -y     # Fedora/RHEL
sudo pacman -S samba                        # Arch

sudo systemctl enable --now smbd nmbd
```

---

## Create a Shared Folder

```bash
sudo mkdir -p /srv/shared
sudo chmod 2777 /srv/shared           # sticky bit + full permissions
sudo chown nobody:nogroup /srv/shared
```

---

## Configure a Share

Edit `/etc/samba/smb.conf`:

```bash
sudo nano /etc/samba/smb.conf
```

Add at the end of the file:

```ini
[SharedFolder]
   comment = Shared Files
   path = /srv/shared
   browsable = yes
   writable = yes
   guest ok = yes
   read only = no
   create mask = 0664
   directory mask = 2775
```

For a **password-protected share** (replace `guest ok = yes` with):
```ini
[SecureShare]
   path = /srv/secure
   valid users = john
   writable = yes
   read only = no
   browsable = yes
```

---

## Test Config and Restart

```bash
testparm                               # validate smb.conf
sudo systemctl restart smbd nmbd
```

---

## Create a Samba User (For Password-Protected Shares)

The Samba user must exist as a Linux user first:

```bash
sudo useradd -M john                   # create linux user without home dir
sudo smbpasswd -a john                 # set Samba password
sudo smbpasswd -e john                 # enable the account
```

---

## Open Firewall

```bash
sudo ufw allow samba                   # UFW
sudo firewall-cmd --add-service=samba --permanent && sudo firewall-cmd --reload  # firewalld
```

---

## Connect From Windows

Open File Explorer → address bar → type:
```
\\SERVER_IP\SharedFolder
```

Or map as a network drive: right-click **This PC** → **Map network drive** → enter `\\SERVER_IP\SharedFolder`.

---

## Connect From macOS

Finder → **Go** → **Connect to Server** → enter:
```
smb://SERVER_IP/SharedFolder
```

---

## Connect From Linux

```bash
# Mount temporarily
sudo mount -t cifs //SERVER_IP/SharedFolder /mnt/shared \
  -o username=john,password=yourpassword

# Mount permanently via /etc/fstab
//SERVER_IP/SharedFolder  /mnt/shared  cifs  username=john,password=pass,iocharset=utf8  0  0

# Install client tools if needed
sudo apt install cifs-utils -y
```

---

## Common Issues

**Share not visible in network browser** — nmbd is not running: `sudo systemctl start nmbd`

**Access denied** — wrong Samba password or user not enabled: `sudo smbpasswd -e username`

**Cannot write files** — check directory permissions: `ls -la /srv/shared` — should show `drwxrwxrwt`

**SELinux blocking (Fedora/RHEL)**:
```bash
sudo setsebool -P samba_export_all_rw 1
sudo chcon -R -t samba_share_t /srv/shared
```
