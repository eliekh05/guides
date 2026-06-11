---
layout: default
title: "Set Up DNS over HTTPS (DoH) on Linux and macOS"
parent: "Networking & DNS"
nav_order: 20
---

# Set Up DNS over HTTPS (DoH) on Linux and macOS

Standard DNS queries are unencrypted — your ISP and network can see every domain you look up. DNS over HTTPS encrypts DNS queries inside HTTPS, preventing eavesdropping.

---

## Option 1 — systemd-resolved with DoH (Ubuntu 22.04+)

```bash
sudo nano /etc/systemd/resolved.conf
```

Add or uncomment:
```ini
[Resolve]
DNS=1.1.1.1
FallbackDNS=8.8.8.8
DNSOverTLS=yes
DNSSEC=yes
```

Restart:
```bash
sudo systemctl restart systemd-resolved
resolvectl status | grep "DNS over TLS"
```

---

## Option 2 — dnscrypt-proxy

`dnscrypt-proxy` supports both DNS over HTTPS and DNS over TLS and works on all distros.

```bash
sudo apt install dnscrypt-proxy -y

sudo nano /etc/dnscrypt-proxy/dnscrypt-proxy.toml
```

Key settings:
```toml
listen_addresses = ['127.0.0.1:53']
server_names = ['cloudflare', 'google']
require_dnssec = true
require_nolog = true   # only use privacy-respecting servers
```

```bash
sudo systemctl enable --now dnscrypt-proxy
```

Update your DNS to use localhost:
```bash
echo "nameserver 127.0.0.1" | sudo tee /etc/resolv.conf
```

---

## Option 3 — AdGuard Home with DoH

If you have AdGuard Home set up, DoH is built in:

**Settings → DNS settings → Upstream DNS servers:**
```
https://1.1.1.1/dns-query
https://dns.google/dns-query
```

---

## Option 4 — macOS Built-In DoH (Ventura+)

macOS Ventura added system-wide DoH support. Create a configuration profile:

The easiest method is using Apple's profile tool or [paulmillr/encrypted-dns](https://github.com/paulmillr/encrypted-dns) — a collection of ready-made `.mobileconfig` files for Cloudflare, NextDNS, Google, and others.

Download and open the profile → System Settings → Privacy & Security → Profiles → install.

---

## Verify DoH is Working

```bash
# Check if your DNS traffic is encrypted
curl -sI https://1.1.1.1/cdn-cgi/trace | grep dnssec

# Use a DNS test site
# Visit: https://1.1.1.1/help
# Should show "Using DNS over HTTPS: Yes"

# Or use the test:
dig whoami.cloudflare.com @1.1.1.1 TXT
```
