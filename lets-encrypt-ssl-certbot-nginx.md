---
layout: default
title: "Free SSL with Let's Encrypt and Certbot (Nginx)"
parent: "Server & Self-Hosting"
nav_order: 7
---

# Free SSL with Let's Encrypt and Certbot (Nginx)

Let's Encrypt provides free SSL certificates. Certbot is the tool that requests, installs, and auto-renews them.

---

## Requirements

- A domain name pointing to your server's IP
- Nginx already configured for that domain (see the **Set Up Nginx as a Reverse Proxy** guide)
- Port 80 open in your firewall

---

## Install Certbot

```bash
sudo apt install certbot python3-certbot-nginx -y     # Ubuntu/Debian
sudo dnf install certbot python3-certbot-nginx -y     # Fedora/RHEL
```

---

## Get a Certificate and Auto-Configure Nginx

```bash
sudo certbot --nginx -d example.com -d www.example.com
```

Certbot will:
1. Verify you own the domain (by serving a file on port 80)
2. Issue the certificate
3. Automatically modify your Nginx config to use HTTPS
4. Set up HTTP → HTTPS redirect

That is all. Your site is now HTTPS.

---

## Multiple Domains

```bash
sudo certbot --nginx \
  -d example.com \
  -d www.example.com \
  -d api.example.com
```

---

## Certificate Only (No Auto-Config)

If you want to manage Nginx config yourself:

```bash
sudo certbot certonly --nginx -d example.com
```

Certificates are saved to `/etc/letsencrypt/live/example.com/`:
- `fullchain.pem` — the certificate (use this for `ssl_certificate`)
- `privkey.pem` — the private key (use this for `ssl_certificate_key`)

Manual Nginx SSL config:
```nginx
server {
    listen 443 ssl;
    server_name example.com;

    ssl_certificate /etc/letsencrypt/live/example.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/example.com/privkey.pem;
    include /etc/letsencrypt/options-ssl-nginx.conf;
    ssl_dhparam /etc/letsencrypt/ssl-dhparams.pem;

    location / {
        proxy_pass http://localhost:3000;
    }
}

server {
    listen 80;
    server_name example.com;
    return 301 https://$host$request_uri;
}
```

---

## Auto-Renewal

Certbot installs a systemd timer or cron job automatically. Verify it:

```bash
sudo systemctl status certbot.timer     # systemd
sudo crontab -l | grep certbot          # cron fallback

# Test renewal without actually renewing
sudo certbot renew --dry-run
```

Certificates auto-renew 30 days before expiry.

---

## Renew Manually

```bash
sudo certbot renew
sudo systemctl reload nginx
```

---

## Check Expiry

```bash
sudo certbot certificates
```

---

## Common Errors

**`Domain not yet configured`** — DNS not pointing to this server yet. Check `dig example.com` returns your server IP.

**`Connection refused on port 80`** — firewall is blocking port 80:
```bash
sudo ufw allow 80
sudo ufw allow 443
```

**`Certificate is not yet due for renewal`** — less than 30 days until expiry, Certbot skips it. Use `--force-renewal` to renew anyway:
```bash
sudo certbot renew --force-renewal
```
