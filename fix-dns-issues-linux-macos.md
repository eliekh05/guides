---
layout: default
title: "Fix DNS Issues on Linux and macOS"
parent: "Networking & DNS"
nav_order: 11
---

# Fix DNS Issues on Linux and macOS

DNS problems cause websites to fail even when your internet connection is working. Here is how to diagnose and fix them.

---

## Check If DNS is the Problem

```bash
# If this works but google.com does not resolve:
ping 1.1.1.1          # works = internet is fine
ping google.com       # fails = DNS is broken
```

---

## macOS — Flush DNS Cache

```bash
sudo dscacheutil -flushcache; sudo killall -HUP mDNSResponder
```

This resolves most DNS issues on macOS after network changes or updates.

---

## macOS — Change DNS Server

1. **System Settings** → **Network** → select connection → **Details** → **DNS** tab
2. Click **+** and add:
   - `1.1.1.1` (Cloudflare)
   - `8.8.8.8` (Google)
3. Click **OK** → **Apply**

Or via Terminal:
```bash
# Set DNS for Wi-Fi interface
sudo networksetup -setdnsservers Wi-Fi 1.1.1.1 8.8.8.8

# Set for Ethernet
sudo networksetup -setdnsservers Ethernet 1.1.1.1 8.8.8.8

# Reset to automatic (DHCP-provided DNS)
sudo networksetup -setdnsservers Wi-Fi empty
```

---

## Linux — Check Current DNS

```bash
cat /etc/resolv.conf
resolvectl status                  # systemd-resolved (Ubuntu 18.04+)
```

---

## Linux — Flush DNS Cache

**systemd-resolved (Ubuntu, Debian 12+, Fedora):**
```bash
sudo systemd-resolve --flush-caches
resolvectl flush-caches
```

**nscd:**
```bash
sudo systemctl restart nscd
```

**dnsmasq:**
```bash
sudo systemctl restart dnsmasq
```

---

## Linux — Change DNS Server

**systemd-resolved (Ubuntu 18.04+):**

```bash
sudo nano /etc/systemd/resolved.conf
```

Set:
```
[Resolve]
DNS=1.1.1.1 8.8.8.8
FallbackDNS=1.0.0.1 8.8.4.4
```

```bash
sudo systemctl restart systemd-resolved
```

**Netplan (static network config):**

Add to your `.sources` or `.yaml` file in `/etc/netplan/`:
```yaml
nameservers:
  addresses:
    - 1.1.1.1
    - 8.8.8.8
```

```bash
sudo netplan apply
```

---

## Test a Specific DNS Server

```bash
dig @1.1.1.1 google.com              # test Cloudflare
dig @8.8.8.8 google.com              # test Google
nslookup google.com 1.1.1.1          # alternative
```

If these work but your normal DNS does not, the problem is with your current DNS server (usually your router or ISP DNS).

---

## Common DNS Problem Causes

| Symptom | Likely Cause | Fix |
|---|---|---|
| All sites fail, ping by IP works | DNS broken | Flush cache or change DNS server |
| Specific sites fail | DNS filtering or ISP blocking | Use 1.1.1.1 or 8.8.8.8 |
| Sites fail after VPN disconnects | VPN changed DNS and did not revert | Restart network or flush cache |
| Slow to load sites | DNS server is slow | Switch to Cloudflare (1.1.1.1) |
| Internal hostnames fail | DNS server does not know them | Use split DNS or add entries to /etc/hosts |

---

## /etc/hosts — Override DNS for Specific Domains

Add entries to resolve names locally without DNS:

```bash
sudo nano /etc/hosts   # Linux
sudo nano /private/etc/hosts  # macOS
```

```
192.168.1.100   myserver.local
192.168.1.200   nas.local
```

Flush DNS after editing: `sudo dscacheutil -flushcache; sudo killall -HUP mDNSResponder`
