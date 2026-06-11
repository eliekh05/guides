---
layout: default
title: "SSH Config — Manage Multiple Servers"
parent: "Linux"
nav_order: 42
---

# SSH Config — Manage Multiple Servers

Instead of typing `ssh -i ~/.ssh/mykey -p 2222 user@192.168.1.100` every time, the `~/.ssh/config` file lets you type `ssh myserver`.

---

## Create the Config File

```bash
nano ~/.ssh/config
chmod 600 ~/.ssh/config
```

---

## Basic Example

```
Host myserver
    HostName 192.168.1.100
    User ubuntu
    IdentityFile ~/.ssh/id_ed25519

Host vps
    HostName 203.0.113.45
    User root
    Port 2222
    IdentityFile ~/.ssh/vps_key
```

Now connect with:
```bash
ssh myserver
ssh vps
```

---

## All Useful Options

```
Host workserver
    HostName work.example.com
    User john
    Port 22
    IdentityFile ~/.ssh/work_key
    ServerAliveInterval 60          # send keepalive every 60s
    ServerAliveCountMax 3           # disconnect after 3 missed keepalives
    ForwardAgent yes                # forward SSH agent to remote

Host bastion
    HostName bastion.example.com
    User admin
    IdentityFile ~/.ssh/id_ed25519

Host internal
    HostName 10.0.0.5
    User admin
    ProxyJump bastion               # SSH through bastion host first
    IdentityFile ~/.ssh/id_ed25519

Host dev-*
    User developer
    IdentityFile ~/.ssh/dev_key
    StrictHostKeyChecking no        # skip host key check (trusted network only)
```

---

## Apply Settings to All Hosts

```
Host *
    ServerAliveInterval 60
    ServerAliveCountMax 3
    AddKeysToAgent yes
    IdentityFile ~/.ssh/id_ed25519
```

Put this at the bottom of the file — `Host *` applies to everything that does not match a more specific entry above it.

---

## Useful Options Reference

| Option | What it does |
|---|---|
| `HostName` | Actual hostname or IP |
| `User` | Username on remote |
| `Port` | SSH port (default 22) |
| `IdentityFile` | Path to private key |
| `ProxyJump` | Connect through a jump/bastion host |
| `ForwardAgent` | Forward SSH agent (use keys from local machine on remote) |
| `ServerAliveInterval` | Keepalive ping interval in seconds |
| `ServerAliveCountMax` | How many missed keepalives before disconnect |
| `StrictHostKeyChecking no` | Skip host key verification |
| `AddKeysToAgent yes` | Add key to SSH agent automatically |
| `LocalForward` | Forward a local port to the remote |
| `RemoteForward` | Forward a remote port to local |
| `DynamicForward` | SOCKS proxy |

---

## Port Forwarding via Config

```
Host tunnel
    HostName server.example.com
    User admin
    LocalForward 8080 localhost:80     # local:8080 → remote:80
    LocalForward 5432 localhost:5432   # local:5432 → remote postgres
```

Connect with `ssh tunnel` and then access `localhost:8080` locally.
