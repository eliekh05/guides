---
layout: default
title: "Set Up AdGuard Home — DNS Ad Blocking"
parent: "Server & Self-Hosting"
nav_order: 16
---

# Set Up AdGuard Home — DNS Ad Blocking

AdGuard Home is an alternative to Pi-hole with a more modern web interface, built-in DNS-over-HTTPS and DNS-over-TLS support, and parental controls. No separate database required.

---

## Install (Docker)

```bash
mkdir -p ~/adguard/work ~/adguard/conf
docker run -d \
  --name adguardhome \
  -p 53:53/tcp -p 53:53/udp \
  -p 3000:3000/tcp \
  -v ~/adguard/work:/opt/adguardhome/work \
  -v ~/adguard/conf:/opt/adguardhome/conf \
  --restart unless-stopped \
  adguard/adguardhome:latest
```

Open `http://YOUR_IP:3000` to complete setup.

---

## Install (Direct)

```bash
curl -fsSL https://raw.githubusercontent.com/AdguardTeam/AdGuardHome/master/scripts/install.sh | sh -s -- -v
```

---

## Configure DNS-over-HTTPS

1. **Settings → DNS settings → Upstream DNS servers**
2. Add: `https://1.1.1.1/dns-query` (Cloudflare) or `https://dns.google/dns-query`
3. Enable **Parallel requests** for faster resolution

---

## Add Blocklists

**Settings → Filters → DNS blocklists → Add blocklist**

Recommended:
- AdGuard Base filter (included)
- `https://raw.githubusercontent.com/hagezi/dns-blocklists/main/adblock/multi.txt`
- `https://raw.githubusercontent.com/StevenBlack/hosts/master/hosts`

Click **Update filters** after adding.

---

## Whitelist Domains

**Filters → Custom filtering rules → Add**

```
@@||domain.com^     # whitelist (the @@ prefix allows)
||domain.com^       # block
```

---

## Enable DHCP (Optional)

AdGuard Home can replace your router as the DHCP server — every device gets AdGuard as its DNS automatically:

**Settings → DHCP settings → Enable DHCP server**

Only do this if Pi-hole/AdGuard is on a stable machine that is always on.

---

## AdGuard vs Pi-hole

| Feature | Pi-hole | AdGuard Home |
|---|---|---|
| Interface | Older, functional | Modern, polished |
| DNS-over-HTTPS | Requires separate setup | Built-in |
| DNS-over-TLS | Requires setup | Built-in |
| Parental controls | Basic | Built-in |
| Performance | Good | Slightly better |
| Community | Very large | Growing |
