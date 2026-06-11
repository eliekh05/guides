---
layout: default
title: "SSH Config File — Advanced Tips"
parent: "Linux"
nav_order: 43
---

# SSH Config File — Advanced Tips

The SSH config file (`~/.ssh/config`) makes connecting to servers faster and more convenient.

---

## Basic Structure

```
Host alias
    HostName actual-server.com
    User username
    Port 22
    IdentityFile ~/.ssh/id_ed25519
```

Then just: `ssh alias`

---

## Common Options

```
# Connect through a jump host
Host internal
    HostName 10.0.0.5
    User admin
    ProxyJump jump.example.com

# Custom SSH key per host
Host github.com
    IdentityFile ~/.ssh/github_key

# Multiplex connections (reuse existing connection for speed)
Host *
    ControlMaster auto
    ControlPath ~/.ssh/sockets/%r@%h:%p
    ControlPersist 10m

# Keep connections alive
Host *
    ServerAliveInterval 60
    ServerAliveCountMax 3
    TCPKeepAlive yes

# Compress data (useful on slow connections)
Host remote-server
    Compression yes

# X11 forwarding
Host gui-server
    ForwardX11 yes
```

---

## Multiple GitHub Accounts

```
Host github-personal
    HostName github.com
    User git
    IdentityFile ~/.ssh/personal_key

Host github-work
    HostName github.com
    User git
    IdentityFile ~/.ssh/work_key
```

Use: `git clone git@github-personal:yourusername/repo.git`

---

## Connection Multiplexing

Multiplexing reuses one connection for multiple SSH sessions to the same host — no new handshake, much faster:

```bash
mkdir -p ~/.ssh/sockets

# In ~/.ssh/config:
Host *
    ControlMaster auto
    ControlPath ~/.ssh/sockets/%r@%h:%p
    ControlPersist 10m
```

---

## SSH Agent Forwarding

Let remote servers use your local SSH keys (for git operations from a remote server):

```
Host myserver
    ForwardAgent yes
```

Or on the command line: `ssh -A user@server`

---

## SOCKS Proxy Through SSH

```
Host myserver
    DynamicForward 1080
```

Connects to myserver and opens a SOCKS proxy on local port 1080.
