---
layout: default
title: "systemd Service Management on Linux"
parent: "Server & Self-Hosting"
nav_order: 22
---

# systemd Service Management on Linux

`systemctl` is the main tool for managing services on all modern Linux distributions.

---

## Essential Commands

```bash
# Start/stop/restart
sudo systemctl start nginx
sudo systemctl stop nginx
sudo systemctl restart nginx
sudo systemctl reload nginx          # reload config without restart (if supported)

# Enable/disable at boot
sudo systemctl enable nginx          # start on boot
sudo systemctl disable nginx         # don't start on boot
sudo systemctl enable --now nginx    # enable AND start immediately

# Check status
systemctl status nginx
systemctl is-active nginx           # returns "active" or "inactive"
systemctl is-enabled nginx          # returns "enabled" or "disabled"
```

---

## List Services

```bash
systemctl list-units --type=service           # all loaded services
systemctl list-units --type=service --state=running  # running only
systemctl list-units --type=service --state=failed   # failed services
systemctl list-unit-files --type=service      # all installed services
```

---

## View Logs for a Service

```bash
journalctl -u nginx                           # all logs
journalctl -u nginx -f                        # follow in real time
journalctl -u nginx --since "1 hour ago"      # recent logs
journalctl -u nginx -n 50                     # last 50 lines
journalctl -u nginx --since today             # today only
journalctl -p err -u nginx                    # errors only
```

---

## Write a Service File

Service files live in `/etc/systemd/system/`. Create `/etc/systemd/system/myapp.service`:

```bash
sudo nano /etc/systemd/system/myapp.service
```

```ini
[Unit]
Description=My Application
Documentation=https://example.com
After=network.target

[Service]
Type=simple
User=myuser
Group=mygroup
WorkingDirectory=/opt/myapp
ExecStart=/usr/bin/python3 /opt/myapp/app.py
ExecReload=/bin/kill -HUP $MAINPID
Restart=on-failure
RestartSec=5
StandardOutput=journal
StandardError=journal
Environment=NODE_ENV=production

[Install]
WantedBy=multi-user.target
```

Enable and start it:
```bash
sudo systemctl daemon-reload
sudo systemctl enable --now myapp
```

---

## Service Types

| Type | When to use |
|---|---|
| `simple` | Process stays running (most common) |
| `forking` | Process forks to background (old daemons) |
| `oneshot` | Runs once then exits (scripts, init tasks) |
| `notify` | Process notifies systemd when ready |
| `idle` | Like simple but waits for jobs to finish |

---

## Timers (systemd alternative to cron)

Create `/etc/systemd/system/backup.timer`:

```ini
[Unit]
Description=Run backup daily

[Timer]
OnCalendar=daily
Persistent=true

[Install]
WantedBy=timers.target
```

Create `/etc/systemd/system/backup.service`:

```ini
[Unit]
Description=Daily Backup

[Service]
Type=oneshot
ExecStart=/usr/local/bin/backup.sh
```

```bash
sudo systemctl daemon-reload
sudo systemctl enable --now backup.timer
systemctl list-timers               # see all timers and next run time
```

---

## Troubleshoot a Failing Service

```bash
# 1. Check status for quick info
systemctl status myapp

# 2. View recent logs
journalctl -u myapp -n 50

# 3. Run ExecStart manually to see raw error
systemctl cat myapp | grep ExecStart
# Copy the command and run it directly as the service user

# 4. Check for permission issues
sudo -u myuser /path/to/command

# 5. Validate service file syntax
systemd-analyze verify /etc/systemd/system/myapp.service
```

---

## System State

```bash
systemctl poweroff              # shut down
systemctl reboot                # reboot
systemctl suspend               # suspend
systemctl hibernate             # hibernate
systemctl rescue                # rescue mode (single user)
```
