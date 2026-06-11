---
layout: default
title: "Read and Manage System Logs with journalctl"
parent: "Server & Self-Hosting"
nav_order: 23
---

# Read and Manage System Logs with journalctl

`journalctl` reads logs from systemd's journal — the central log system on all modern Linux distributions. It replaces checking scattered log files in `/var/log/`.

---

## Basic Usage

```bash
journalctl                          # all logs (oldest first, opens in pager)
journalctl -r                       # newest first
journalctl -f                       # follow in real time (like tail -f)
journalctl -n 50                    # last 50 lines
```

---

## Filter by Service

```bash
journalctl -u nginx                 # all nginx logs
journalctl -u nginx -f              # follow nginx logs
journalctl -u nginx -n 100         # last 100 lines for nginx
journalctl -u nginx -u mysql       # multiple services
```

---

## Filter by Time

```bash
journalctl --since "1 hour ago"
journalctl --since today
journalctl --since "2025-01-15 09:00:00"
journalctl --until "2025-01-15 10:00:00"
journalctl --since "2025-01-15 09:00:00" --until "2025-01-15 10:00:00"
journalctl --since yesterday
```

---

## Filter by Priority

```bash
journalctl -p err                   # errors and above
journalctl -p warning               # warnings and above
journalctl -p debug                 # everything including debug

# Priority levels: emerg, alert, crit, err, warning, notice, info, debug
```

---

## Filter by Boot

```bash
journalctl -b                       # current boot
journalctl -b -1                    # previous boot
journalctl -b -2                    # two boots ago
journalctl --list-boots             # list all recorded boots
```

---

## Filter by Process / PID

```bash
journalctl _PID=1234
journalctl _COMM=nginx              # by process name
journalctl _UID=1000                # by user ID
```

---

## Output Formats

```bash
journalctl -o short                 # default
journalctl -o verbose               # all fields
journalctl -o json                  # JSON
journalctl -o json-pretty           # formatted JSON
journalctl -o cat                   # message only, no metadata
```

---

## Kernel Messages

```bash
journalctl -k                       # kernel messages (like dmesg)
journalctl -k -b                    # kernel messages from current boot
dmesg                               # also shows kernel ring buffer
dmesg | tail -20                    # last 20 kernel messages
dmesg -T                            # with human-readable timestamps
```

---

## Manage Journal Size

```bash
# Check current disk usage
journalctl --disk-usage

# Vacuum old logs
journalctl --vacuum-time=7d         # delete logs older than 7 days
journalctl --vacuum-size=500M       # keep only 500MB of logs

# Rotate logs now
sudo journalctl --rotate
```

---

## Persistent Logs

By default, journals may not persist across reboots on some distros. Enable persistent storage:

```bash
sudo mkdir -p /var/log/journal
sudo systemd-tmpfiles --create --prefix /var/log/journal
sudo systemctl restart systemd-journald
```

Or edit `/etc/systemd/journald.conf`:
```
[Journal]
Storage=persistent
```

---

## Practical Debugging Examples

```bash
# What crashed on last boot?
journalctl -b -1 -p err

# Did SSH fail recently?
journalctl -u sshd --since "30 minutes ago"

# What was happening when the system rebooted unexpectedly?
journalctl -b -1 | tail -50

# Find OOM (out of memory) kills
journalctl -k | grep -i "killed process"

# All failed services since boot
systemctl --failed
```

---

## Traditional Log Files

Some services still write to `/var/log/` directly alongside or instead of the journal:

| File | Contents |
|---|---|
| `/var/log/syslog` | General system messages (Debian/Ubuntu) |
| `/var/log/messages` | General system messages (RHEL/Fedora) |
| `/var/log/auth.log` | Authentication events (Debian/Ubuntu) |
| `/var/log/secure` | Authentication events (RHEL/Fedora) |
| `/var/log/kern.log` | Kernel messages |
| `/var/log/apt/` | apt package manager activity |
| `/var/log/nginx/` | Nginx access and error logs |

```bash
tail -f /var/log/syslog
cat /var/log/auth.log | grep "Failed"
```
