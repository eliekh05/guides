---
layout: default
title: "Manage Log Files with logrotate on Linux"
parent: "System & Users"
nav_order: 33
---

# Manage Log Files with logrotate on Linux

`logrotate` automatically rotates, compresses, and deletes log files on a schedule. Without it, log files grow indefinitely and fill your disk.

---

## How It Works

logrotate runs daily via cron or systemd timer. It reads config files in `/etc/logrotate.d/` and `/etc/logrotate.conf` to decide what to do with each log.

---

## Check What logrotate Manages

```bash
ls /etc/logrotate.d/     # per-application configs
cat /etc/logrotate.conf  # global defaults
```

---

## Create a logrotate Config

```bash
sudo nano /etc/logrotate.d/myapp
```

```
/var/log/myapp/*.log {
    daily               # rotate daily
    missingok           # do not error if log is missing
    rotate 14           # keep 14 days of logs
    compress            # compress rotated logs with gzip
    delaycompress       # compress the previous rotation, not the current one
    notifempty          # do not rotate if file is empty
    create 0640 appuser appgroup   # create new log with these permissions
    postrotate
        systemctl reload myapp > /dev/null 2>&1 || true
    endscript
}
```

---

## Common Options

```
daily / weekly / monthly   — rotation frequency
rotate N                   — keep N old logs
size 100M                  — rotate when file exceeds 100MB (instead of time-based)
compress                   — gzip compressed logs
delaycompress              — delay compression one rotation (so process can finish writing)
missingok                  — no error if log file is missing
notifempty                 — skip if file is empty
copytruncate               — copy then truncate (for apps that keep file open)
dateext                    — use date as suffix instead of numbers
dateformat -%Y%m%d         — format for dateext
maxage 30                  — delete logs older than 30 days regardless of count
```

---

## Test Your Config

```bash
# Dry run — shows what would happen
sudo logrotate --debug /etc/logrotate.d/myapp

# Force rotation now (even if not due)
sudo logrotate --force /etc/logrotate.d/myapp
```

---

## Run Manually

```bash
# Run all configured logrotate
sudo logrotate /etc/logrotate.conf

# Run with verbose output
sudo logrotate -v /etc/logrotate.conf
```

---

## View Rotation Status

```bash
cat /var/lib/logrotate/status
# or
cat /var/lib/logrotate.status
```

Shows last rotation date for each log file.

---

## System Logs (rsyslog / journald)

System logs in `/var/log/syslog`, `/var/log/auth.log` etc. are managed by the `rsyslog` logrotate config already in `/etc/logrotate.d/rsyslog`.

Journal logs are managed separately:
```bash
sudo journalctl --vacuum-time=30d
sudo journalctl --vacuum-size=500M
```
