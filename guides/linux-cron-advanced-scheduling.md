---
layout: default
title: "Advanced cron Scheduling Patterns on Linux"
parent: "Task Scheduling"
nav_order: 7
---

# Advanced cron Scheduling Patterns on Linux

Beyond the basics, cron supports patterns that most guides never explain clearly.

---

## Crontab Field Review

```
MIN  HOUR  DOM  MON  DOW  COMMAND
 *    *     *    *    *   /path/to/command
```

- `MIN` 0–59, `HOUR` 0–23, `DOM` 1–31, `MON` 1–12, `DOW` 0–7 (0 and 7 = Sunday)

---

## Advanced Patterns

```bash
# Every 15 minutes between 9am and 5pm weekdays
*/15 9-17 * * 1-5 /path/to/job.sh

# First and last weekday of the month (approximate)
0 9 1-7,22-31 * 1 /path/to/job.sh

# Every 2 hours
0 */2 * * * /path/to/job.sh

# Twice a day at 6am and 6pm
0 6,18 * * * /path/to/job.sh

# Every quarter hour only on weekends
*/15 * * * 6,7 /path/to/job.sh

# On the 1st of January every year
0 0 1 1 * /path/to/yearly.sh

# Every 5 minutes but only in June and December
*/5 * * 6,12 * /path/to/job.sh
```

---

## Multiple Values, Ranges, and Steps

```
,  = list of values:    1,15,30 = at minute 1, 15, and 30
-  = range:             1-5     = Monday through Friday
/  = step:              */10    = every 10 units
```

Examples:
```bash
# At minutes 0, 15, 30, 45 every hour
0,15,30,45 * * * * /job.sh

# Every hour from 8am to 5pm
0 8-17 * * * /job.sh

# Every 10 minutes from minute 0 to 59
*/10 * * * * /job.sh
```

---

## Run After Reboot

```bash
@reboot /path/to/startup.sh
```

Runs once when the system starts. Useful for launching services that are not managed by systemd.

---

## Environment Setup

```bash
# Full crontab with environment
SHELL=/bin/bash
PATH=/opt/homebrew/bin:/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin
MAILTO=""
HOME=/home/youruser

0 2 * * * /home/youruser/scripts/backup.sh >> /var/log/backup.log 2>&1
```

---

## Use systemd Timers Instead for Complex Schedules

For anything that needs:
- Accurate tracking of missed runs (cron skips if machine was off)
- Dependencies on other services
- Logging via journald

See the **systemd Service Management** guide — timers are the modern alternative.

---

## Quick Pattern Generator

Use [crontab.guru](https://crontab.guru) to build and verify any schedule visually.
