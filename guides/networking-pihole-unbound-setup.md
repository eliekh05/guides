---
layout: default
title: "Pi-hole with Unbound — Recursive DNS Setup"
parent: "Networking & DNS"
nav_order: 18
---

# Pi-hole with Unbound — Recursive DNS Setup

By default Pi-hole forwards DNS queries to an upstream resolver (Cloudflare, Google). With Unbound, Pi-hole queries DNS root servers directly — no third party sees your DNS requests.

---

## Install Unbound

```bash
sudo apt install unbound -y
```

---

## Configure Unbound for Pi-hole

Create `/etc/unbound/unbound.conf.d/pi-hole.conf`:

```bash
sudo nano /etc/unbound/unbound.conf.d/pi-hole.conf
```

Paste:

```yaml
server:
    verbosity: 0
    interface: 127.0.0.1
    port: 5335
    do-ip4: yes
    do-udp: yes
    do-tcp: yes
    do-ip6: no

    prefer-ip6: no
    harden-glue: yes
    harden-dnssec-stripped: yes
    use-caps-for-id: no
    edns-buffer-size: 1472
    prefetch: yes
    num-threads: 1

    private-address: 192.168.0.0/16
    private-address: 169.254.0.0/16
    private-address: 172.16.0.0/12
    private-address: 10.0.0.0/8
    private-address: fd00::/8
    private-address: fe80::/10
```

Start and test:
```bash
sudo systemctl enable --now unbound
dig pi-hole.net @127.0.0.1 -p 5335    # should return an answer
```

---

## Point Pi-hole at Unbound

In Pi-hole admin: **Settings → DNS**

- Uncheck all upstream DNS providers
- Under **Custom 1 (IPv4):** enter `127.0.0.1#5335`
- Click **Save**

---

## Verify

```bash
# Query through the full stack
dig pi-hole.net @127.0.0.1

# Check unbound is resolving
dig example.com @127.0.0.1 -p 5335
```

---

## Troubleshoot

```bash
# Check unbound is running
sudo systemctl status unbound

# Check unbound logs
sudo journalctl -u unbound -f

# Verify listening on 5335
sudo ss -tlnp | grep 5335
```
