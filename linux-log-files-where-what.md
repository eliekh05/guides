---
layout: default
title: "Linux Log Files — Where They Are and What They Mean"
parent: "Linux"
nav_order: 44
---

# Linux Log Files — Where They Are and What They Mean

When something breaks on Linux, logs tell you why. Knowing where to look saves hours of guessing.

---

## Key Log Locations

| Log | What it contains |
|---|---|
| `/var/log/syslog` | General system messages (Ubuntu/Debian) |
| `/var/log/messages` | General system messages (RHEL/Fedora/Arch) |
| `/var/log/auth.log` | Authentication, sudo, SSH logins (Debian/Ubuntu) |
| `/var/log/secure` | Authentication (RHEL/Fedora) |
| `/var/log/kern.log` | Kernel messages |
| `/var/log/dmesg` | Boot and hardware messages |
| `/var/log/boot.log` | Boot sequence |
| `/var/log/cron` | Cron job execution |
| `/var/log/mail.log` | Mail server logs |
| `/var/log/nginx/access.log` | Nginx requests |
| `/var/log/nginx/error.log` | Nginx errors |
| `/var/log/apache2/access.log` | Apache requests |
| `/var/log/apache2/error.log` | Apache errors |
| `/var/log/mysql/error.log` | MySQL errors |
| `/var/log/postgresql/` | PostgreSQL logs |
| `/var/log/fail2ban.log` | Fail2ban ban activity |
| `/var/log/ufw.log` | UFW firewall activity |

---

## Reading Logs

```bash
# View a log file
cat /var/log/syslog
less /var/log/syslog        # scrollable view, press q to quit

# Show last 50 lines
tail -50 /var/log/syslog

# Follow a log in real time
tail -f /var/log/nginx/error.log

# Follow multiple logs at once
tail -f /var/log/nginx/error.log /var/log/auth.log

# Search for errors
grep "error" /var/log/syslog
grep -i "failed" /var/log/auth.log

# Show entries from last hour
journalctl --since "1 hour ago"
```

---

## journalctl — systemd Journal (Modern Systems)

Most modern distributions use systemd's journal instead of or alongside traditional log files:

```bash
journalctl                              # all logs
journalctl -f                           # follow in real time
journalctl -n 100                       # last 100 lines
journalctl -p err                       # errors only
journalctl -p err -b                    # errors from current boot
journalctl -u nginx                     # logs for nginx service only
journalctl -u nginx -f                  # follow nginx logs
journalctl --since "2026-05-01"
journalctl --since yesterday
journalctl --disk-usage                 # how much space logs use
```

---

## Check Recent Failed Logins

```bash
lastb                           # failed login attempts
last                            # successful logins
last -a | head -20              # recent logins with hostname
```

---

## Clear Old Logs

```bash
# Clear journal logs older than 30 days
sudo journalctl --vacuum-time=30d

# Keep only last 500MB of journal
sudo journalctl --vacuum-size=500M

# Rotate and compress log files
sudo logrotate -f /etc/logrotate.conf
```

---

## logrotate — Automatic Log Rotation

Configuration files in `/etc/logrotate.d/`. Example for a custom app:

```bash
sudo nano /etc/logrotate.d/myapp
```

```
/var/log/myapp/*.log {
    daily
    rotate 14
    compress
    delaycompress
    missingok
    notifempty
    create 644 myuser mygroup
}
```

---

## Monitor Logs for Keywords

```bash
# Alert when "critical" appears in syslog
tail -f /var/log/syslog | grep --line-buffered "critical"

# Log all SSH failures to a separate file
grep "Failed password" /var/log/auth.log >> /root/ssh-failures.log
```
