---
layout: default
title: "Set Up Jellyfin Media Server"
parent: "Server & Self-Hosting"
nav_order: 20
---

# Set Up Jellyfin Media Server

Jellyfin is a free, self-hosted media server — your own Netflix. Stream movies, TV shows, music, and photos to any device on your network or over the internet.

---

## Install with Docker Compose

```bash
mkdir -p ~/jellyfin && cd ~/jellyfin
nano docker-compose.yml
```

```yaml
services:
  jellyfin:
    image: jellyfin/jellyfin:latest
    container_name: jellyfin
    restart: unless-stopped
    ports:
      - "8096:8096"
    volumes:
      - ./config:/config
      - ./cache:/cache
      - /path/to/your/media:/media:ro   # your media folder, read-only
    environment:
      - JELLYFIN_PublishedServerUrl=http://YOUR_SERVER_IP:8096
```

```bash
docker compose up -d
```

Open `http://YOUR_SERVER_IP:8096` to complete setup.

---

## Setup Wizard

1. Language and username/password
2. **Add media library** — point to `/media` (or wherever your media is mounted)
3. Choose library type: Movies, TV Shows, Music, Books, Photos
4. Let Jellyfin scan and identify your media (takes a few minutes)

---

## Media Naming Convention

Jellyfin identifies media based on file names. Use these formats:

**Movies:** `Movie Title (Year)/Movie Title (Year).mkv`
```
/media/movies/The Matrix (1999)/The Matrix (1999).mkv
```

**TV Shows:** `Show Name/Season 01/Show Name - S01E01 - Episode Title.mkv`
```
/media/tv/Breaking Bad/Season 01/Breaking Bad - S01E01 - Pilot.mkv
```

---

## Hardware Acceleration (Transcoding)

Transcoding lets Jellyfin convert video on-the-fly for devices that cannot play the original format. Without hardware acceleration this is CPU-intensive.

**Intel Quick Sync (most modern Intel CPUs):**
Add to docker-compose.yml under `jellyfin`:
```yaml
devices:
  - /dev/dri:/dev/dri
```

In Jellyfin: **Dashboard → Playback → Transcoding → Hardware acceleration: Intel Quick Sync Video**

**Nvidia:**
Requires `nvidia-container-toolkit`. Add:
```yaml
deploy:
  resources:
    reservations:
      devices:
        - driver: nvidia
          count: 1
          capabilities: [gpu]
```

---

## Access From Outside Your Network

Point Nginx at port 8096 with SSL — see the **Nginx Reverse Proxy** and **Certbot SSL** guides.

---

## Client Apps

Download the Jellyfin app from:
- iOS / Android: Jellyfin app (App Store / Play Store)
- Roku, Fire TV: search "Jellyfin"
- Apple TV: Infuse or Swiftfin
- Smart TV: Jellyfin for Kodi plugin, or browser
- Windows/macOS: Jellyfin Media Player
