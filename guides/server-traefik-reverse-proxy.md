---
layout: default
title: "Traefik — Automatic Reverse Proxy for Docker"
parent: "Server & Self-Hosting"
nav_order: 26
---

# Traefik — Automatic Reverse Proxy for Docker

Traefik automatically detects Docker containers and routes traffic to them based on labels — no manual config file editing for each new service.

---

## Why Traefik Over Nginx

With Nginx, adding a new service requires editing nginx.conf and reloading. With Traefik, you add labels to your `docker-compose.yml` and Traefik picks up the routing instantly.

---

## Setup with Docker Compose

Create a `traefik` folder:

```bash
mkdir -p ~/traefik && cd ~/traefik
touch acme.json && chmod 600 acme.json
```

`docker-compose.yml`:

```yaml
services:
  traefik:
    image: traefik:v3.0
    container_name: traefik
    restart: unless-stopped
    command:
      - "--api.dashboard=true"
      - "--providers.docker=true"
      - "--providers.docker.exposedbydefault=false"
      - "--entrypoints.web.address=:80"
      - "--entrypoints.websecure.address=:443"
      - "--certificatesresolvers.letsencrypt.acme.tlschallenge=true"
      - "--certificatesresolvers.letsencrypt.acme.email=your@email.com"
      - "--certificatesresolvers.letsencrypt.acme.storage=/acme.json"
      - "--entrypoints.web.http.redirections.entrypoint.to=websecure"
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - /var/run/docker.sock:/var/run/docker.sock:ro
      - ./acme.json:/acme.json
    labels:
      - "traefik.enable=true"
      - "traefik.http.routers.dashboard.rule=Host(`traefik.yourdomain.com`)"
      - "traefik.http.routers.dashboard.entrypoints=websecure"
      - "traefik.http.routers.dashboard.tls.certresolver=letsencrypt"
      - "traefik.http.routers.dashboard.service=api@internal"

networks:
  default:
    name: traefik-network
    external: true
```

Create the shared network:
```bash
docker network create traefik-network
docker compose up -d
```

---

## Add a Service to Traefik

In any other service's `docker-compose.yml`:

```yaml
services:
  myapp:
    image: myapp:latest
    networks:
      - traefik-network
    labels:
      - "traefik.enable=true"
      - "traefik.http.routers.myapp.rule=Host(`app.yourdomain.com`)"
      - "traefik.http.routers.myapp.entrypoints=websecure"
      - "traefik.http.routers.myapp.tls.certresolver=letsencrypt"
      - "traefik.http.services.myapp.loadbalancer.server.port=3000"

networks:
  traefik-network:
    external: true
```

Deploy it and Traefik automatically picks it up, gets an SSL certificate, and routes `app.yourdomain.com` to port 3000 of the container.

---

## Middleware Examples

**Basic auth:**
```yaml
labels:
  - "traefik.http.middlewares.auth.basicauth.users=admin:$$apr1$$hash"
  - "traefik.http.routers.myapp.middlewares=auth"
```

**Rate limiting:**
```yaml
labels:
  - "traefik.http.middlewares.ratelimit.ratelimit.average=100"
  - "traefik.http.middlewares.ratelimit.ratelimit.burst=50"
```

**Redirect to HTTPS (automatic with the entrypoints config above).**
