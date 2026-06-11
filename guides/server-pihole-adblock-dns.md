---
layout: default
title: "Set Up Pi-hole — Network-Wide Ad Blocking"
parent: "Server & Self-Hosting"
nav_order: 15
---

# Set Up Pi-hole — Network-Wide Ad Blocking

Pi-hole is a DNS server that blocks ads, tracking, and malware domains for every device on your network — no browser extensions needed. It runs on a Raspberry Pi, any Linux machine, or in Docker.

---

## Install Pi-hole

**Direct install (recommended):**
```bash
curl -sSL https://install.pi-hole.net | bash
```

The installer walks you through interface selection, upstream DNS, and admin password.

**Docker (easier to manage):**
```bash
mkdir -p ~/pihole/etc-pihole ~/pihole/etc-dnsmasq.d
docker run -d \
  --name pihole \
  -p 53:53/tcp -p 53:53/udp \
  -p 8080:80 \
  -e TZ=America/New_York \
  -e WEBPASSWORD=yourpassword \
  -v ~/pihole/etc-pihole:/etc/pihole \
  -v ~/pihole/etc-dnsmasq.d:/etc/dnsmasq.d \
  --restart unless-stopped \
  pihole/pihole:latest
```

Access the admin interface at `http://YOUR_SERVER_IP/admin`.

---

## Point Your Router at Pi-hole

For network-wide blocking, set your router's DNS server to your Pi-hole's IP address. Location varies by router — look for **DHCP settings** or **DNS settings** in your router admin interface.

Pi-hole's IP on the network:
```bash
ip a | grep "inet " | grep -v 127
```

---

## Add Blocklists

Pi-hole includes a default blocklist. Add more:

1. Admin interface → **Adlists**
2. Add list URLs. Recommended lists:
   - `https://raw.githubusercontent.com/StevenBlack/hosts/master/hosts` (default)
   - `https://someonewhocares.org/hosts/zero/hosts`
   - `https://raw.githubusercontent.com/hagezi/dns-blocklists/main/adblock/multi.txt`
3. Click **Add** then **Update Gravity** to apply

---

## Whitelist a Blocked Domain

If a site breaks, whitelist it:

```bash
pihole -w domain.com
# or in the admin UI: Whitelist → Add
```

---

## Common Pi-hole Commands

```bash
pihole status           # check if running
pihole -g               # update gravity (refresh blocklists)
pihole -w domain.com    # whitelist a domain
pihole -b domain.com    # blacklist a domain
pihole -c               # chronometer (stats)
pihole restartdns       # restart DNS service
pihole -d               # generate debug log
```

---

## Update Pi-hole

```bash
pihole -up
```

---

## Useful Stats

Admin interface → Dashboard shows:
- Total queries today
- Queries blocked (%)
- Top blocked domains
- Top clients
