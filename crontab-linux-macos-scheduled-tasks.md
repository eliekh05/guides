---
layout: default
title: "cron and crontab — Schedule Tasks on Linux and macOS"
parent: "Task Scheduling"
nav_order: 6
---

# cron and crontab — Schedule Tasks on Linux and macOS

---

## Edit Your Crontab

```bash
crontab -e          # edit your personal crontab
crontab -l          # list your current crontab
crontab -r          # remove your crontab (careful — no confirmation)
```

For system-wide tasks:
```bash
sudo crontab -e     # root's crontab
```

Or place scripts in:
- `/etc/cron.hourly/`
- `/etc/cron.daily/`
- `/etc/cron.weekly/`
- `/etc/cron.monthly/`

---

## Crontab Syntax

```
┌───────────── minute (0 - 59)
│ ┌───────────── hour (0 - 23)
│ │ ┌───────────── day of month (1 - 31)
│ │ │ ┌───────────── month (1 - 12)
│ │ │ │ ┌───────────── day of week (0 - 7) (0 and 7 = Sunday)
│ │ │ │ │
* * * * * command
```

---

## Common Schedule Examples

```
# Every minute
* * * * * /path/to/script.sh

# Every 5 minutes
*/5 * * * * /path/to/script.sh

# Every hour (at minute 0)
0 * * * * /path/to/script.sh

# Every day at 2:30 AM
30 2 * * * /path/to/script.sh

# Every Monday at 9 AM
0 9 * * 1 /path/to/script.sh

# Every weekday (Mon-Fri) at 8 AM
0 8 * * 1-5 /path/to/script.sh

# Every 15 minutes
*/15 * * * * /path/to/script.sh

# First day of every month at midnight
0 0 1 * * /path/to/script.sh

# Every Sunday at 3 AM
0 3 * * 0 /path/to/script.sh

# Twice a day (8 AM and 8 PM)
0 8,20 * * * /path/to/script.sh
```

---

## Shortcuts

```
@reboot     run once at startup
@daily      same as: 0 0 * * *
@hourly     same as: 0 * * * *
@weekly     same as: 0 0 * * 0
@monthly    same as: 0 0 1 * *
@yearly     same as: 0 0 1 1 *
```

```
@reboot /path/to/startup-script.sh
@daily /path/to/backup.sh
```

---

## Always Use Full Paths

cron does not load your shell PATH. Commands that work in Terminal often fail in cron.

**Wrong:**
```
* * * * * python3 script.py
```

**Correct:**
```
* * * * * /usr/bin/python3 /home/user/scripts/script.py
```

Find the full path of any command:
```bash
which python3
which brew
which node
```

---

## Capture Output and Errors

By default, cron emails output to the local user (which usually goes nowhere). Redirect to a log file:

```bash
# Redirect both stdout and stderr to a log
0 2 * * * /path/to/backup.sh >> /var/log/backup.log 2>&1

# Suppress all output
0 2 * * * /path/to/backup.sh > /dev/null 2>&1
```

---

## Environment Variables in Crontab

```
# Set PATH at top of crontab
PATH=/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin:/opt/homebrew/bin

# Set email for output
MAILTO=admin@example.com

# Or silence email
MAILTO=""
```

---

## Debug Cron Issues

```bash
# Check if cron is running
systemctl status cron           # Ubuntu/Debian
systemctl status crond          # Fedora/RHEL

# Check cron logs
grep CRON /var/log/syslog       # Ubuntu/Debian
journalctl -u cron              # systemd systems

# Test your script manually as if cron ran it
env -i PATH=/usr/local/sbin:/usr/local/bin:/usr/bin:/bin /path/to/script.sh
```

---

## macOS Cron Notes

cron works on macOS but `launchd` is the preferred macOS method — see the **Run a Script at Startup or Login on macOS** guide.

If using cron on macOS and the script accesses Desktop/Documents/Downloads, Terminal and cron need Full Disk Access in **System Settings → Privacy & Security → Full Disk Access**.
