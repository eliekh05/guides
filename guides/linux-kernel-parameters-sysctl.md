---
layout: default
title: "Tune Linux Kernel Parameters with sysctl"
parent: "System & Users"
nav_order: 31
---

# Tune Linux Kernel Parameters with sysctl

`sysctl` reads and writes kernel parameters at runtime. Useful for networking performance, security hardening, and memory management.

---

## Read Current Value

```bash
sysctl vm.swappiness
sysctl net.ipv4.ip_forward
sysctl -a                    # all parameters
sysctl -a | grep "net.core"  # filter
```

---

## Set Temporarily (Lost on Reboot)

```bash
sudo sysctl vm.swappiness=10
sudo sysctl net.ipv4.ip_forward=1
```

---

## Set Permanently

Edit `/etc/sysctl.conf` or create a file in `/etc/sysctl.d/`:

```bash
sudo nano /etc/sysctl.d/99-custom.conf
```

Add your settings:
```
# Reduce swap usage
vm.swappiness = 10

# Enable IP forwarding (needed for routing/NAT)
net.ipv4.ip_forward = 1

# Increase max file handles
fs.file-max = 2097152

# Network performance
net.core.rmem_max = 134217728
net.core.wmem_max = 134217728
```

Apply without reboot:
```bash
sudo sysctl -p /etc/sysctl.d/99-custom.conf
```

---

## Common Parameters

### Memory
```
vm.swappiness = 10            # prefer RAM over swap (0-100, default 60)
vm.dirty_ratio = 15           # max % RAM used for dirty pages before writeback
vm.overcommit_memory = 1      # allow overcommit (needed for Redis, some apps)
```

### Networking
```
net.ipv4.ip_forward = 1                  # enable IP routing/NAT
net.ipv4.tcp_syncookies = 1              # protect against SYN flood attacks
net.ipv4.conf.all.accept_redirects = 0  # ignore ICMP redirects (security)
net.ipv4.tcp_fin_timeout = 30           # faster TIME_WAIT cleanup
net.core.somaxconn = 65535              # max connections in listen queue
net.ipv4.tcp_max_syn_backlog = 65535    # SYN backlog size
```

### Security
```
kernel.dmesg_restrict = 1    # restrict dmesg to root
kernel.kptr_restrict = 2     # hide kernel pointers
net.ipv4.conf.all.rp_filter = 1   # enable reverse path filtering
```

### File Handles
```
fs.file-max = 2097152         # max open file handles system-wide
fs.inotify.max_user_watches = 524288   # needed for VSCode, Webpack
```

---

## View Current Limits

```bash
ulimit -n              # per-process file descriptor limit
cat /proc/sys/fs/file-nr   # current open files: used / unused / max
```
