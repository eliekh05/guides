---
layout: default
title: "Limit Resources with cgroups and systemd"
parent: "System & Users"
nav_order: 32
---

# Limit Resources with cgroups and systemd

cgroups control how much CPU, memory, and I/O a process or group of processes can use. systemd manages cgroups automatically — you can set limits per service.

---

## Limit a systemd Service

Edit or create a drop-in override:

```bash
sudo systemctl edit myservice
```

This opens an editor. Add limits:

```ini
[Service]
MemoryMax=512M
CPUQuota=50%
IOWeight=100
```

Save, then reload:
```bash
sudo systemctl daemon-reload
sudo systemctl restart myservice
```

---

## Common Resource Limits

```ini
[Service]
# Memory
MemoryMax=1G             # hard limit — OOM kills if exceeded
MemoryHigh=800M          # soft limit — process gets throttled
MemorySwapMax=0          # disable swap for this service

# CPU
CPUQuota=50%             # max 50% of one CPU core
CPUWeight=100            # relative weight (default 100)
AllowedCPUs=0,1          # pin to specific CPU cores

# I/O
IOWeight=100             # relative I/O weight
IOReadBandwidthMax=/dev/sda 50M   # max 50MB/s read
IOWriteBandwidthMax=/dev/sda 50M  # max 50MB/s write
```

---

## Check Current Resource Usage Per Service

```bash
systemctl status myservice           # shows cgroup path and limits
systemd-cgtop                        # top-like view of cgroup usage
cat /sys/fs/cgroup/system.slice/myservice.service/memory.current  # raw bytes used
```

---

## Limit a One-off Command (systemd-run)

Run any command in a temporary cgroup with limits:

```bash
# Run with 512MB memory limit and 25% CPU
sudo systemd-run --scope -p MemoryMax=512M -p CPUQuota=25% /path/to/command
```

---

## Set Limits for a User Session

All processes from a user login are in the same cgroup. Limit them:

```bash
sudo systemctl edit user-1000.slice
```

```ini
[Slice]
MemoryMax=4G
CPUQuota=200%    # 2 full cores
```

---

## ulimit vs cgroups

`ulimit` sets per-process limits (open files, processes, stack size). cgroups set limits per group of processes (memory, CPU, I/O). For production services, cgroups via systemd is the right tool.
