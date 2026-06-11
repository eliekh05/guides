---
layout: default
title: "Portainer — Docker GUI Management"
parent: "Server & Self-Hosting"
nav_order: 18
---

# Portainer — Docker GUI Management

Portainer is a web-based Docker management interface. Instead of remembering Docker CLI commands, you manage containers, images, volumes, and networks through a browser.

---

## Install Portainer

```bash
docker volume create portainer_data

docker run -d \
  --name portainer \
  --restart always \
  -p 9000:9000 \
  -v /var/run/docker.sock:/var/run/docker.sock \
  -v portainer_data:/data \
  portainer/portainer-ce:latest
```

Open `http://YOUR_IP:9000` and create your admin password.

---

## What Portainer Can Do

- **Containers** — start, stop, restart, remove, view logs, exec into shell
- **Images** — pull, build, remove, inspect layers
- **Volumes** — create, remove, browse contents
- **Networks** — create, remove, inspect
- **Stacks** — deploy Docker Compose files from the UI
- **App Templates** — one-click deploy of popular self-hosted apps

---

## Deploy a Stack (Compose) from UI

1. **Stacks → Add stack**
2. Paste your `docker-compose.yml` content
3. Add environment variables in the UI
4. Click **Deploy the stack**

---

## View Container Logs

Containers → click container name → **Logs**

Set log lines, enable auto-refresh, or download logs.

---

## Exec Into a Container

Containers → click container → **Console** → Connect

Gives you a terminal inside the container — same as `docker exec -it container bash`.

---

## Portainer Agent (Remote Hosts)

Manage multiple Docker hosts from one Portainer instance:

On the remote host:
```bash
docker run -d \
  --name portainer_agent \
  --restart always \
  -v /var/run/docker.sock:/var/run/docker.sock \
  -v /var/lib/docker/volumes:/var/lib/docker/volumes \
  -p 9001:9001 \
  portainer/agent:latest
```

In Portainer: **Environments → Add environment → Agent** → enter remote host IP and port 9001.
