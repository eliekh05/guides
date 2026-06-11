---
layout: default
title: "NFS File Sharing Between Linux Machines"
parent: "Server & Self-Hosting"
nav_order: 9
---

# NFS File Sharing Between Linux Machines

NFS (Network File System) shares directories between Linux/Unix machines. Faster than Samba for Linux-to-Linux transfers, no Windows compatibility.

---

## Server Setup

### Install NFS server

```bash
sudo apt install nfs-kernel-server -y     # Ubuntu/Debian
sudo dnf install nfs-utils -y              # Fedora/RHEL
sudo systemctl enable --now nfs-server
```

### Create and configure a share

```bash
sudo mkdir -p /srv/nfs/shared
sudo chown nobody:nogroup /srv/nfs/shared
sudo chmod 755 /srv/nfs/shared
```

Edit `/etc/exports`:

```bash
sudo nano /etc/exports
```

Add a line:
```
/srv/nfs/shared    192.168.1.0/24(rw,sync,no_subtree_check)
```

Format: `path  who_can_access(options)`

**Common options:**
- `rw` — read/write
- `ro` — read-only
- `sync` — write to disk before responding (safer)
- `async` — faster but less safe
- `no_subtree_check` — improves reliability
- `no_root_squash` — let remote root access as root (risky)
- `root_squash` — map remote root to nobody (default, safer)

**Allow a specific IP only:**
```
/srv/nfs/shared    192.168.1.50(rw,sync,no_subtree_check)
```

**Allow multiple clients:**
```
/srv/nfs/shared    192.168.1.0/24(rw,sync) 10.0.0.0/8(ro,sync)
```

Apply the exports:
```bash
sudo exportfs -a
sudo systemctl restart nfs-server
```

---

## Open Firewall

```bash
sudo ufw allow from 192.168.1.0/24 to any port nfs    # UFW
sudo firewall-cmd --add-service=nfs --permanent && sudo firewall-cmd --reload  # firewalld
```

---

## Client Setup

### Install NFS client

```bash
sudo apt install nfs-common -y      # Ubuntu/Debian
sudo dnf install nfs-utils -y       # Fedora/RHEL
```

### Mount temporarily

```bash
sudo mkdir -p /mnt/nfs
sudo mount SERVER_IP:/srv/nfs/shared /mnt/nfs
```

### Mount permanently via /etc/fstab

```bash
sudo nano /etc/fstab
```

Add:
```
SERVER_IP:/srv/nfs/shared  /mnt/nfs  nfs  defaults,_netdev  0  0
```

`_netdev` tells the system to wait for network before mounting.

Test:
```bash
sudo mount -a
df -h | grep nfs
```

---

## Verify Exports

From server:
```bash
exportfs -v                            # list active exports
showmount -e localhost                 # show what's exported
```

From client:
```bash
showmount -e SERVER_IP                 # see available shares
```

---

## NFS vs Samba

| | NFS | Samba |
|---|---|---|
| Linux to Linux | ✅ Best choice | Works |
| Linux to Windows | ❌ Needs extra setup | ✅ Native |
| Linux to macOS | ✅ Works | ✅ Works |
| Performance | Better | Slightly slower |
| Setup complexity | Similar | Similar |
