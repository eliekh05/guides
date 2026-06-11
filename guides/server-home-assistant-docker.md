---
layout: default
title: "Run Home Assistant in Docker"
parent: "Server & Self-Hosting"
nav_order: 27
---

# Run Home Assistant in Docker

Home Assistant is a home automation platform. Running it in Docker is simpler than the full HAOS image and works on any Linux server.

---

## Docker Compose

```yaml
services:
  homeassistant:
    container_name: homeassistant
    image: ghcr.io/home-assistant/home-assistant:stable
    restart: unless-stopped
    privileged: true
    network_mode: host        # required for device discovery
    volumes:
      - ./config:/config
      - /etc/localtime:/etc/localtime:ro
    environment:
      - TZ=America/New_York   # your timezone
```

```bash
docker compose up -d
```

Open `http://YOUR_SERVER_IP:8123` and create your account.

---

## First Setup

1. Create account (admin user)
2. Set location — used for sunrise/sunset automations
3. Home Assistant scans your network and shows discovered devices
4. Add integrations: Settings → Devices & Services → Add Integration

---

## Common Integrations

Search for these in **Settings → Devices & Services → Add Integration:**

- **HACS** (Home Assistant Community Store) — add community integrations
- **Google Cast** — control Chromecast, Google Home
- **HomeKit** — control Apple HomeKit devices and expose HA to iOS
- **MQTT** — for DIY devices (ESP8266, Zigbee bridges)
- **Zigbee2MQTT** — Zigbee devices
- **Z-Wave** — Z-Wave devices
- **Shelly** — Shelly smart plugs and switches
- **Philips Hue** — Hue lights

---

## Access from Outside Your Network

**Option 1 — Nabu Casa ($6.50/month)**
Settings → Home Assistant Cloud. Provides instant remote access, no port forwarding needed.

**Option 2 — Nginx + Certbot**
See the **Nginx Reverse Proxy** and **Certbot SSL** guides. Point a domain at port 8123.

**Option 3 — Tailscale**
Install Tailscale on your server and phone. Access via Tailscale IP from anywhere.

---

## Backup

Settings → System → Backups → Create Backup

Backups include configuration, automations, and history. Download them manually or configure automatic cloud backup.

---

## Update

```bash
docker pull ghcr.io/home-assistant/home-assistant:stable
docker compose down && docker compose up -d
```

Or from the HA UI: Settings → System → Updates
