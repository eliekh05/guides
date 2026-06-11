---
layout: default
title: "cron — Schedule Tasks on Linux and macOS"
parent: "Task Scheduling"
nav_order: 2
---

# cron — Schedule Tasks on Linux and macOS

cron runs commands automatically on a schedule. This guide covers the syntax, common patterns, and the mistakes that cause cron jobs to silently fail.

---

## Edit Your Cron Jobs

```bash
crontab -e          # edit your cron jobs
crontab -l          # list your cron jobs
crontab -r          # remove all your cron jobs
sudo crontab -e     # edit root's cron jobs
```

---

## Cron Syntax

```
* * * * * command
│ │ │ │ │
│ │ │ │ └── Day of week (0-7, 0 and 7 = Sunday)
│ │ │ └──── Month (1-12)
│ │ └────── Day of month (1-31)
│ └──────── Hour (0-23)
└────────── Minute (0-59)
```

`*` means every.

---

## Examples

```bash
# Every minute
* * * * * /path/to/script.sh

# Every hour at minute 0
0 * * * * /path/to/script.sh

# Every day at 2:30 AM
30 2 * * * /path/to/script.sh

# Every Monday at 9 AM
0 9 * * 1 /path/to/script.sh

# Every 15 minutes
*/15 * * * * /path/to/script.sh

# Every day at midnight and noon
0 0,12 * * * /path/to/script.sh

# First day of every month at midnight
0 0 1 * * /path/to/script.sh

# Weekdays at 8 AM
0 8 * * 1-5 /path/to/script.sh
```

---

## Shortcuts

```bash
@reboot     # run once at startup
@hourly     # run once an hour (= 0 * * * *)
@daily      # run once a day (= 0 0 * * *)
@weekly     # run once a week (= 0 0 * * 0)
@monthly    # run once a month (= 0 0 1 * *)
```

```bash
@reboot /path/to/script.sh
@daily /path/to/backup.sh
```

---

## Why Cron Jobs Silently Fail (Most Common Issues)

### 1. No PATH set
cron has a minimal PATH. Commands like `python3`, `node`, `brew` are not found.

Fix — use full paths:
```bash
0 2 * * * /usr/bin/python3 /home/user/script.py
0 2 * * * /opt/homebrew/bin/brew upgrade
```

Find the full path of a command:
```bash
which python3
```

### 2. Script not executable
```bash
chmod +x /path/to/script.sh
```

### 3. No output — you don't know if it worked
Redirect output to a log file:
```bash
0 2 * * * /path/to/script.sh >> /tmp/myscript.log 2>&1
```

`2>&1` captures both stdout and stderr.

### 4. Environment differences
Set variables explicitly in the crontab:
```bash
PATH=/usr/local/bin:/usr/bin:/bin
HOME=/home/youruser
0 2 * * * script.sh
```

---

## System-Wide Cron (Linux)

Drop scripts into these directories — no crontab needed:

```
/etc/cron.hourly/
/etc/cron.daily/
/etc/cron.weekly/
/etc/cron.monthly/
```

Scripts must be executable and not have a file extension (no `.sh`).

---

## macOS Cron Notes

cron works on macOS but `launchd` is preferred for better reliability. If your cron job needs to access Desktop, Documents, or Downloads, Terminal (and therefore cron's shell) needs **Full Disk Access** in System Settings → Privacy & Security.
