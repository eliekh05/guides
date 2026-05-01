---
layout: default
title: "Fix a systemd Service Not Starting on Linux"
parent: "macOS & Linux"
nav_order: 12
---

# Fix a systemd Service Not Starting on Linux

When a systemd service fails to start, it almost always fails silently — `systemctl start myservice` returns nothing useful and the service just shows as `failed`. This guide shows how to find the actual error, fix the most common causes, and verify the service is running correctly.

---

## Step 1 — Check the Service Status

```bash
systemctl status myservice
```

Replace `myservice` with your service name (without the `.service` extension). This shows:
- Whether it is `active`, `failed`, or `inactive`
- The last few log lines
- The exit code if it failed

If the status shows the error clearly, you can skip to the relevant fix below. If not, continue to Step 2.

---

## Step 2 — Read the Full Logs

```bash
journalctl -u myservice
```

This shows the complete history of the service. To see only the most recent attempt:

```bash
journalctl -u myservice --since "5 minutes ago"
```

To watch logs in real time as you try to start it:

```bash
journalctl -u myservice -f
```

In another terminal, start the service and watch what happens:

```bash
systemctl start myservice
```

The log will show the exact error — read it carefully.

---

## Step 3 — Run the ExecStart Command Directly

The most useful debugging technique: copy the `ExecStart` line from the service file and run it manually in the terminal. This shows you the raw error output that systemd swallows.

Find the ExecStart line:
```bash
systemctl cat myservice | grep ExecStart
```

Copy everything after `ExecStart=` and run it directly as root:
```bash
sudo /path/to/your/command --with-flags
```

The error will print to your terminal immediately — no log parsing needed.

---

## Common Errors and Fixes

### "No such file or directory"

The path in `ExecStart` is wrong or the binary does not exist.

```bash
# Check the binary exists and is executable
which mycommand
ls -la /path/to/binary
```

Fix the path in the service file:
```bash
systemctl edit myservice --full
```

---

### "Permission denied"

The service is running as the wrong user, or the binary/file it needs is not accessible to that user.

Check what user the service runs as:
```bash
systemctl cat myservice | grep User
```

If no `User=` is set, it runs as root. If it runs as a specific user, that user needs read/execute access to the binary and any files it touches.

Fix by either:
- Adding `User=root` to the `[Service]` section if root access is needed
- Fixing file permissions: `chmod +x /path/to/binary`
- Adding the service user to the right group: `usermod -aG groupname serviceuser`

---

### "Exit code 1" or "Exit code 127"

Exit code 127 specifically means "command not found". The binary path is wrong or not in PATH.

systemd services do not inherit your shell's PATH. Always use full paths in service files:

```ini
[Service]
ExecStart=/usr/bin/python3 /home/user/myscript.py
```

Never rely on PATH-dependent commands like `python3 script.py` — always use `/usr/bin/python3`.

---

### "Failed to start: Unit not found"

The service file does not exist or has the wrong name.

```bash
# Find the service file
find /etc/systemd /lib/systemd /usr/lib/systemd -name "myservice.service" 2>/dev/null

# List all services
systemctl list-unit-files | grep myservice
```

If the file exists but systemd does not see it:
```bash
systemctl daemon-reload
systemctl start myservice
```

---

### "Timeout waiting for response"

The service started but took too long and systemd killed it.

Add or increase the timeout in the service file:
```ini
[Service]
TimeoutStartSec=120
```

Or disable the timeout entirely (not recommended for production):
```ini
[Service]
TimeoutStartSec=infinity
```

---

### "Service is masked"

A masked service cannot be started at all — it is intentionally blocked.

```bash
systemctl unmask myservice
systemctl start myservice
```

---

## Edit a Service File

To edit the service file without overwriting the original:
```bash
systemctl edit myservice
```

This creates a drop-in override file at `/etc/systemd/system/myservice.service.d/override.conf`. Safer than editing the original.

To edit the full service file directly:
```bash
systemctl edit myservice --full
```

After any edit:
```bash
systemctl daemon-reload
systemctl restart myservice
```

---

## Writing a Service File from Scratch

If you are creating your own service, here is a complete working template:

```ini
[Unit]
Description=My Service Description
After=network.target

[Service]
Type=simple
User=myuser
WorkingDirectory=/home/myuser/myapp
ExecStart=/usr/bin/python3 /home/myuser/myapp/main.py
Restart=on-failure
RestartSec=5
StandardOutput=journal
StandardError=journal

[Install]
WantedBy=multi-user.target
```

Save it to `/etc/systemd/system/myservice.service`, then:

```bash
systemctl daemon-reload
systemctl enable myservice
systemctl start myservice
systemctl status myservice
```

---

## Service Types

The `Type=` value in `[Service]` is a common source of failures:

| Type | When to use it |
|---|---|
| `simple` | The process stays running (most common) |
| `forking` | The process forks to background (old-style daemons) |
| `oneshot` | Runs once and exits (scripts, tasks) |
| `notify` | Service notifies systemd when ready (advanced) |
| `idle` | Like simple but waits until all other jobs finish |

Using the wrong type causes systemd to report the service as failed even when it is actually working.

---

## Enable a Service to Start on Boot

```bash
systemctl enable myservice
```

Start it now and enable it for boot in one command:
```bash
systemctl enable --now myservice
```

Check that it is enabled:
```bash
systemctl is-enabled myservice
```
