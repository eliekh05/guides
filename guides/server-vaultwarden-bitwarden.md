---
layout: default
title: "Self-Host Vaultwarden (Bitwarden) Password Manager"
parent: "Server & Self-Hosting"
nav_order: 19
---

# Self-Host Vaultwarden (Bitwarden) Password Manager

Vaultwarden is an unofficial, lightweight Bitwarden-compatible server. You host your own password manager — all your passwords stay on your own server, not Bitwarden's cloud.

---

## Requirements

- A server with Docker
- A domain name with SSL (HTTPS is required — browsers reject HTTP for password managers)
- See the **Nginx Reverse Proxy** and **Certbot SSL** guides first

---

## Install with Docker Compose

```bash
mkdir -p ~/vaultwarden && cd ~/vaultwarden
nano docker-compose.yml
```

```yaml
services:
  vaultwarden:
    image: vaultwarden/server:latest
    container_name: vaultwarden
    restart: unless-stopped
    volumes:
      - vaultwarden_data:/data
    environment:
      DOMAIN: "https://vault.yourdomain.com"
      SIGNUPS_ALLOWED: "true"   # set to false after creating your account
      ADMIN_TOKEN: "your-strong-random-token"  # openssl rand -base64 48

volumes:
  vaultwarden_data:
```

```bash
docker compose up -d
```

---

## Nginx Config

```nginx
server {
    listen 443 ssl;
    server_name vault.yourdomain.com;

    ssl_certificate /etc/letsencrypt/live/vault.yourdomain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/vault.yourdomain.com/privkey.pem;

    location / {
        proxy_pass http://localhost:80;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    location /notifications/hub {
        proxy_pass http://localhost:3012;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
    }
}
```

---

## First Login

1. Go to `https://vault.yourdomain.com`
2. **Create Account** — this is your Vaultwarden account
3. After creating your account, set `SIGNUPS_ALLOWED: "false"` in the compose file and restart

---

## Admin Panel

Access at `https://vault.yourdomain.com/admin` using your `ADMIN_TOKEN`. Lets you:
- View all users
- Send test emails
- Configure SMTP for email verification
- Enable/disable features

---

## Connect Bitwarden Apps

Use the official Bitwarden apps — browser extension, iOS, Android, desktop. When logging in, click **Self-hosted** and enter your domain `https://vault.yourdomain.com`.

---

## Backup

```bash
docker cp vaultwarden:/data ./vaultwarden-backup
```

Back up the `data/` folder — it contains your encrypted vault database.
