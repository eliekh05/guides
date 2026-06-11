---
layout: default
title: "Set Up Uptime Kuma — Self-Hosted Monitoring"
parent: "Server & Self-Hosting"
nav_order: 17
---

# Set Up Uptime Kuma — Self-Hosted Monitoring

Uptime Kuma is a self-hosted monitoring tool with a clean UI. It monitors websites, services, ports, and Docker containers, and sends alerts when things go down.

---

## Install with Docker

```bash
docker run -d \
  --name uptime-kuma \
  -p 3001:3001 \
  -v uptime-kuma:/app/data \
  --restart unless-stopped \
  louislam/uptime-kuma:latest
```

Open `http://YOUR_IP:3001` and create your admin account.

---

## Add a Monitor

1. Click **+ Add New Monitor**
2. Choose monitor type:
   - **HTTP(s)** — checks a URL
   - **TCP Port** — checks if a port is open
   - **Ping** — ICMP ping
   - **DNS** — checks DNS resolution
   - **Docker Container** — checks if a container is running
   - **Keyword** — checks that a URL returns specific text
3. Set URL/host, check interval, and timeout
4. Click **Save**

---

## Set Up Notifications

1. **Settings → Notifications → Setup Notification**
2. Supported channels include Telegram, Discord, Slack, email, Pushover, ntfy, and many more
3. Click **Test** to verify before saving

---

## Status Page

Uptime Kuma can generate a public status page:

1. **Status Page → New Status Page**
2. Name it and add monitors
3. Share the URL — visitors see uptime history without admin access

---

## Docker Compose

```yaml
services:
  uptime-kuma:
    image: louislam/uptime-kuma:latest
    container_name: uptime-kuma
    ports:
      - "3001:3001"
    volumes:
      - uptime-kuma:/app/data
    restart: unless-stopped

volumes:
  uptime-kuma:
```

---

## Backup

```bash
# Copy the data volume
docker cp uptime-kuma:/app/data ./uptime-kuma-backup
```

---

## Update

```bash
docker pull louislam/uptime-kuma:latest
docker stop uptime-kuma
docker rm uptime-kuma
# Re-run the docker run command above
```
