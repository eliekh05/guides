---
layout: default
title: "Nginx Basics on Linux"
parent: "Networking & DNS"
nav_order: 13
---

# Nginx Basics on Linux

Nginx is a web server and reverse proxy. This guide covers installation, serving static files, reverse proxying to another service, and SSL with Let's Encrypt.

---

## Install

```bash
sudo apt install nginx -y        # Ubuntu/Debian
sudo dnf install nginx -y        # Fedora/RHEL
sudo pacman -S nginx             # Arch
```

```bash
sudo systemctl enable --now nginx
```

Check it is running:
```bash
systemctl status nginx
curl localhost
```

---

## File Locations

| Path | What it is |
|---|---|
| `/etc/nginx/nginx.conf` | Main config |
| `/etc/nginx/sites-available/` | Available site configs |
| `/etc/nginx/sites-enabled/` | Active site configs (symlinks to sites-available) |
| `/var/www/html/` | Default web root |
| `/var/log/nginx/access.log` | Access logs |
| `/var/log/nginx/error.log` | Error logs |

---

## Serve Static Files

Create `/etc/nginx/sites-available/mysite`:

```nginx
server {
    listen 80;
    server_name mysite.com www.mysite.com;

    root /var/www/mysite;
    index index.html;

    location / {
        try_files $uri $uri/ =404;
    }
}
```

Enable it:
```bash
sudo ln -s /etc/nginx/sites-available/mysite /etc/nginx/sites-enabled/
sudo nginx -t                    # test config for errors
sudo systemctl reload nginx
```

---

## Reverse Proxy

Forward requests from port 80 to an app running on port 3000:

```nginx
server {
    listen 80;
    server_name myapp.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

---

## SSL with Let's Encrypt (Certbot)

```bash
sudo apt install certbot python3-certbot-nginx -y

# Get and install certificate (replaces Nginx config automatically)
sudo certbot --nginx -d mysite.com -d www.mysite.com

# Test auto-renewal
sudo certbot renew --dry-run
```

Certbot sets up automatic renewal via a systemd timer or cron.

---

## Common Commands

```bash
sudo nginx -t                    # test config syntax
sudo systemctl reload nginx      # reload config without dropping connections
sudo systemctl restart nginx     # full restart
sudo nginx -s reload             # alternative reload
tail -f /var/log/nginx/error.log # watch error log
```

---

## Security Headers

Add inside `server {}` block:

```nginx
add_header X-Frame-Options "SAMEORIGIN";
add_header X-Content-Type-Options "nosniff";
add_header X-XSS-Protection "1; mode=block";
add_header Strict-Transport-Security "max-age=31536000; includeSubDomains";
```
