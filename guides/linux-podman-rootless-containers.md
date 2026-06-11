---
layout: default
title: "Podman — Rootless Containers on Linux"
parent: "Linux"
nav_order: 39
---

# Podman — Rootless Containers on Linux

Podman runs containers without a daemon and without root. It is Docker-compatible — most Docker commands work with `podman` instead of `docker`.

---

## Install

```bash
sudo apt install podman -y          # Ubuntu/Debian
sudo dnf install podman -y          # Fedora/RHEL (included by default)
sudo pacman -S podman               # Arch
brew install podman && podman machine init && podman machine start  # macOS
```

---

## Docker Compatibility

```bash
# Most docker commands work with podman
podman pull nginx
podman run -d -p 8080:80 nginx
podman ps
podman logs CONTAINER
podman exec -it CONTAINER bash
podman stop CONTAINER
podman rm CONTAINER

# Create an alias so existing scripts work
alias docker=podman
```

---

## Rootless — Key Difference From Docker

Docker runs a daemon as root. Podman runs containers as your current user. This means:

- No `sudo` needed for most commands
- Compromised container cannot easily escalate to root
- Ports below 1024 require extra configuration

```bash
# Run as regular user — no sudo
podman run -d -p 8080:80 nginx

# Allow binding to port 80 as regular user (if needed)
sudo sysctl -w net.ipv4.ip_unprivileged_port_start=80
```

---

## Podman Compose

```bash
pip install podman-compose --break-system-packages
# or
sudo dnf install podman-compose

podman-compose up -d
podman-compose down
```

Uses the same `docker-compose.yml` format.

---

## Run as a systemd User Service

```bash
# Generate systemd service from a running container
podman generate systemd --name mycontainer --files --new

# Install and start as user service
mkdir -p ~/.config/systemd/user/
mv container-mycontainer.service ~/.config/systemd/user/
systemctl --user enable --now container-mycontainer

# Run at boot without login
loginctl enable-linger $(whoami)
```

---

## Podman Pods (Group Containers)

Pods share a network namespace — containers inside can reach each other on localhost:

```bash
# Create a pod
podman pod create --name myapp -p 8080:80

# Add containers to it
podman run -d --pod myapp nginx
podman run -d --pod myapp mybackend

# Manage the pod
podman pod start myapp
podman pod stop myapp
podman pod ps
```

---

## Useful Differences From Docker

| Feature | Docker | Podman |
|---|---|---|
| Daemon | Required | None |
| Root required | Yes | No (rootless) |
| systemd integration | Extra setup | Native |
| Docker Compose | `docker compose` | `podman-compose` |
| Image compatibility | ✅ | ✅ (same registries) |
