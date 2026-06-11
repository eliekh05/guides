---
layout: default
title: "SSH Tunneling and Port Forwarding"
parent: "Networking & DNS"
nav_order: 12
---

# SSH Tunneling and Port Forwarding

SSH can forward traffic through encrypted tunnels — useful for accessing services behind firewalls, exposing local services remotely, or bypassing network restrictions.

---

## Local Port Forwarding

Forward a port on your local machine to a port on or through a remote server.

```bash
ssh -L local_port:destination:destination_port user@ssh_server
```

**Example — access a remote database locally:**
```bash
ssh -L 5432:localhost:5432 user@db-server.com
```
Now `psql -h localhost -p 5432` connects to the remote database as if it were local.

**Example — access a service behind a firewall:**
```bash
ssh -L 8080:internal-server:80 user@jump-server.com
```
Now `http://localhost:8080` shows the internal server's web interface.

**Run in background:**
```bash
ssh -L 5432:localhost:5432 -N -f user@server.com
# -N = no remote command, -f = go to background
```

---

## Remote Port Forwarding (Reverse Tunnel)

Expose a local service to the remote server. Useful for making something on your laptop accessible from a server.

```bash
ssh -R remote_port:localhost:local_port user@ssh_server
```

**Example — expose your local web server to the remote machine:**
```bash
ssh -R 8080:localhost:3000 user@server.com
```
Now `http://server.com:8080` serves your local port 3000.

**GatewayPorts — allow external access (needs server config):**

On the server, add to `/etc/ssh/sshd_config`:
```
GatewayPorts yes
```
Without this, the remote port only binds to localhost on the server.

---

## Dynamic Port Forwarding (SOCKS Proxy)

Turn your SSH connection into a SOCKS5 proxy. All traffic through the proxy is routed via the remote server.

```bash
ssh -D 1080 user@server.com
ssh -D 1080 -N -f user@server.com    # background
```

Configure your browser or system to use SOCKS5 proxy at `localhost:1080`.

---

## Jump Hosts (ProxyJump)

Connect to a server through an intermediate jump host:

```bash
ssh -J jumpuser@jump-host.com targetuser@target-server.com
```

Or configure in `~/.ssh/config`:
```
Host target
    HostName 10.0.0.5
    User targetuser
    ProxyJump jumpuser@jump-host.com
```

Then just: `ssh target`

---

## Keep Tunnels Alive

SSH tunnels drop on idle connections. Add to `~/.ssh/config` or the specific host:

```
Host *
    ServerAliveInterval 60
    ServerAliveCountMax 3
```

---

## Persistent Tunnel with autossh

`autossh` restarts SSH tunnels when they fail:

```bash
sudo apt install autossh -y

# Persistent reverse tunnel
autossh -M 0 -N -R 2222:localhost:22 user@server.com \
  -o ServerAliveInterval=30 -o ServerAliveCountMax=3
```

As a systemd service — create `/etc/systemd/system/tunnel.service`:

```ini
[Unit]
Description=SSH Tunnel
After=network.target

[Service]
User=yourusername
ExecStart=/usr/bin/autossh -M 0 -N -L 5432:localhost:5432 user@server.com \
    -o ServerAliveInterval=30 -o ServerAliveCountMax=3
Restart=always
RestartSec=10

[Install]
WantedBy=multi-user.target
```

```bash
sudo systemctl enable --now tunnel
```

---

## Quick Reference

| Type | Command | Use case |
|---|---|---|
| Local forward | `ssh -L local:dest:port user@server` | Access remote service locally |
| Remote forward | `ssh -R remote:local:port user@server` | Expose local service remotely |
| Dynamic (SOCKS) | `ssh -D 1080 user@server` | Route traffic through server |
| Jump host | `ssh -J jump user@target` | Connect via intermediate host |
