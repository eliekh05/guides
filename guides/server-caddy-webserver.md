---
layout: default
title: "Caddy Web Server — Automatic HTTPS Setup"
parent: "Server & Self-Hosting"
nav_order: 23
---

# Caddy Web Server — Automatic HTTPS Setup

Caddy is a web server and reverse proxy that automatically obtains and renews Let's Encrypt SSL certificates. No Certbot, no certificate management — just point it at your domain and Caddy handles everything.

---

## Install

```bash
# Ubuntu/Debian
sudo apt install -y debian-keyring debian-archive-keyring apt-transport-https curl
curl -1sLf 'https://dl.cloudsmith.io/public/caddy/stable/gpg.key' | sudo gpg --dearmor -o /usr/share/keyrings/caddy-stable-archive-keyring.gpg
curl -1sLf 'https://dl.cloudsmith.io/public/caddy/stable/debian.deb.txt' | sudo tee /etc/apt/sources.list.d/caddy-stable.list
sudo apt update && sudo apt install caddy

# macOS
brew install caddy

# Docker
docker run -d -p 80:80 -p 443:443 -v caddy_data:/data -v $(pwd)/Caddyfile:/etc/caddy/Caddyfile caddy
```

---

## The Caddyfile

Caddy is configured with a `Caddyfile`. The syntax is much simpler than Nginx.

**Serve a static site with automatic HTTPS:**
```
example.com {
    root * /var/www/html
    file_server
}
```

That is it. Caddy requests an SSL certificate, renews it automatically, and redirects HTTP to HTTPS.

**Reverse proxy to an app:**
```
example.com {
    reverse_proxy localhost:3000
}
```

**Multiple sites:**
```
app.example.com {
    reverse_proxy localhost:3000
}

api.example.com {
    reverse_proxy localhost:8080
}

static.example.com {
    root * /var/www/static
    file_server
}
```

**Add authentication:**
```
private.example.com {
    basicauth {
        admin $2a$14$Zkx19XLiW6VYouLHR5NmfOFU0z2GTNmpkT/5qqR7hx4IjWJPDhjvG
    }
    reverse_proxy localhost:3000
}
```

Generate the password hash: `caddy hash-password`

---

## Caddyfile Location

- `/etc/caddy/Caddyfile` (systemd install)
- `Caddyfile` in your current directory (manual run)

---

## Commands

```bash
sudo systemctl reload caddy     # reload config without restart
sudo systemctl restart caddy    # full restart
caddy fmt --overwrite Caddyfile # format your Caddyfile
caddy validate --config Caddyfile  # check for errors
caddy run                       # run in foreground (development)
```

---

## Local HTTPS (Development)

```bash
# Generate a trusted local certificate
caddy trust

# Serve locally with HTTPS
caddy run  # with this Caddyfile:
```

```
localhost {
    reverse_proxy localhost:3000
}
```

Caddy installs a local CA and generates a certificate — no browser warnings.

---

## Caddy vs Nginx

| Feature | Caddy | Nginx |
|---|---|---|
| Automatic HTTPS | ✅ Built-in | ❌ Needs Certbot |
| Config syntax | Simple | More verbose |
| Performance | Excellent | Excellent |
| Plugin ecosystem | Growing | Massive |
| Reload without downtime | ✅ | ✅ |
