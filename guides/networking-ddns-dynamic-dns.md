---
layout: default
title: "Dynamic DNS — Access Your Home Server With a Domain"
parent: "Networking & DNS"
nav_order: 19
---

# Dynamic DNS — Access Your Home Server With a Domain

Most home internet connections have a dynamic IP that changes occasionally. Dynamic DNS (DDNS) automatically updates a domain name to point to your current IP address.

---

## Free DDNS Providers

- **DuckDNS** — duckdns.org — completely free, simple, reliable
- **No-IP** — noip.com — free (must confirm monthly)
- **Dynu** — dynu.com — free tier available
- **Cloudflare** — if you own a domain on Cloudflare, use their API

---

## DuckDNS Setup

1. Go to [duckdns.org](https://www.duckdns.org)
2. Sign in with Google/GitHub
3. Create a subdomain (you get `yourname.duckdns.org`)
4. Copy your token

**Auto-update on Linux (cron):**
```bash
mkdir -p ~/duckdns
nano ~/duckdns/duck.sh
```

```bash
#!/bin/bash
echo url="https://www.duckdns.org/update?domains=YOURDOMAIN&token=YOURTOKEN&ip=" | curl -k -o ~/duckdns/duck.log -K -
```

```bash
chmod +x ~/duckdns/duck.sh
crontab -e
# Add:
*/5 * * * * ~/duckdns/duck.sh >/dev/null 2>&1
```

**Docker (automated):**
```bash
docker run -d \
  --name duckdns \
  --restart unless-stopped \
  -e TOKEN=your-token \
  -e SUBDOMAINS=yoursubdomain \
  lscr.io/linuxserver/duckdns:latest
```

---

## Cloudflare DDNS (If You Own a Domain)

If your domain is on Cloudflare, use [cloudflare-ddns](https://github.com/timothymiller/cloudflare-ddns):

```bash
docker run -d \
  --name cloudflare-ddns \
  --restart unless-stopped \
  -v /path/to/config.json:/app/config.json \
  timothymiller/cloudflare-ddns:latest
```

`config.json`:
```json
{
  "cloudflare": [
    {
      "authentication": {
        "api_token": "YOUR_CF_TOKEN"
      },
      "zone_id": "YOUR_ZONE_ID",
      "subdomains": [
        {"name": "home", "proxied": false}
      ]
    }
  ],
  "a": true,
  "aaaa": false,
  "purgeUnknownRecords": false,
  "ttl": 300
}
```

---

## Port Forwarding

After setting up DDNS, configure your router to forward traffic to your server:

1. Log into your router admin (usually 192.168.1.1)
2. Find **Port Forwarding** or **NAT**
3. Forward external port 80 and 443 to your server's internal IP
4. Your domain now reaches your server
