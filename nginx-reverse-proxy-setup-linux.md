---
layout: default
title: "Set Up Nginx as a Reverse Proxy on Linux"
parent: "Server & Self-Hosting"
nav_order: 6
---

# Set Up Nginx as a Reverse Proxy on Linux

A reverse proxy sits in front of your application and forwards requests to it. This lets you run multiple apps on one server, add SSL, and handle domain routing — all through Nginx.

---

## Install Nginx

```bash
sudo apt update && sudo apt install nginx -y     # Ubuntu/Debian
sudo dnf install nginx -y                         # Fedora/RHEL
sudo systemctl enable --now nginx
```

Test: open `http://YOUR_SERVER_IP` — you should see the Nginx welcome page.

---

## Basic Config File Structure

All site configs go in `/etc/nginx/sites-available/` — then symlinked to `/etc/nginx/sites-enabled/` to activate.

```bash
sudo nano /etc/nginx/sites-available/myapp
```

---

## Reverse Proxy Config

```nginx
server {
    listen 80;
    server_name myapp.example.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

Replace `localhost:3000` with your app's actual address and port.

Enable it:
```bash
sudo ln -s /etc/nginx/sites-available/myapp /etc/nginx/sites-enabled/
sudo nginx -t         # test config for errors
sudo systemctl reload nginx
```

---

## Serve Static Files

```nginx
server {
    listen 80;
    server_name static.example.com;

    root /var/www/mysite;
    index index.html;

    location / {
        try_files $uri $uri/ =404;
    }
}
```

```bash
sudo mkdir -p /var/www/mysite
sudo chown -R www-data:www-data /var/www/mysite
```

---

## Multiple Apps on One Server

```nginx
# App 1 — myapp.example.com → port 3000
server {
    listen 80;
    server_name myapp.example.com;
    location / {
        proxy_pass http://localhost:3000;
    }
}

# App 2 — api.example.com → port 8080
server {
    listen 80;
    server_name api.example.com;
    location / {
        proxy_pass http://localhost:8080;
    }
}
```

---

## Useful Commands

```bash
sudo nginx -t                        # test config syntax
sudo systemctl reload nginx          # apply config changes (no downtime)
sudo systemctl restart nginx         # full restart
sudo tail -f /var/log/nginx/error.log    # watch errors
sudo tail -f /var/log/nginx/access.log  # watch requests
```

---

## Next Step — Add SSL with Certbot

After Nginx is configured, add free SSL with Let's Encrypt — see the **Let's Encrypt SSL with Certbot** guide.
