---
layout: default
title: "macOS Network Diagnostics and Troubleshooting"
parent: "macOS"
nav_order: 43
---

# macOS Network Diagnostics and Troubleshooting

---

## Quick Checks

```bash
# Your IP address
ipconfig getifaddr en0    # en0 = WiFi on most Macs
ipconfig getifaddr en1    # en1 = Ethernet sometimes

# Public IP
curl ifconfig.me

# Test internet
ping -c 4 8.8.8.8         # ping by IP (no DNS needed)
ping -c 4 google.com      # ping by domain (tests DNS too)

# DNS lookup
nslookup google.com
dig google.com +short
```

---

## Flush DNS Cache

```bash
# macOS Ventura and later
sudo dscacheutil -flushcache; sudo killall -HUP mDNSResponder

# macOS Monterey and earlier
sudo killall -HUP mDNSResponder
```

---

## Check WiFi Details

```bash
# Current WiFi network info
/System/Library/PrivateFrameworks/Apple80211.framework/Versions/Current/Resources/airport -I

# Scan for nearby networks
/System/Library/PrivateFrameworks/Apple80211.framework/Versions/Current/Resources/airport -s
```

From the menu bar: hold **Option** and click the WiFi icon — shows IP, router, signal strength, channel, and security type.

---

## Check Routing

```bash
netstat -rn | grep default   # default gateway
route get google.com          # how a specific address is routed
traceroute google.com         # trace each hop
```

---

## Check Open Ports and Connections

```bash
sudo lsof -i                 # all network connections
sudo lsof -i :8080           # who is listening on port 8080
sudo lsof -i TCP             # TCP connections only
netstat -an | grep LISTEN    # listening ports
```

---

## macOS Network Diagnostics App

**Hold Option** and click the WiFi menu bar icon → **Open Wireless Diagnostics**

This runs automated tests and generates a detailed report.

Also available: Wireless Diagnostics → Window menu:
- **Scan** — detailed channel and signal scan
- **Performance** — live signal quality graph
- **Info** — security, channel, PHY mode

---

## Renew DHCP Lease

```bash
sudo ipconfig set en0 DHCP
```

Or: System Settings → Network → WiFi → Details → TCP/IP → Renew DHCP Lease.

---

## Reset Network Settings

```bash
# Remove all network preferences (nuclear option)
sudo rm /Library/Preferences/SystemConfiguration/com.apple.airport.preferences.plist
sudo rm /Library/Preferences/SystemConfiguration/com.apple.network.identification.plist
sudo rm /Library/Preferences/SystemConfiguration/NetworkInterfaces.plist
sudo rm /Library/Preferences/SystemConfiguration/preferences.plist
# Restart Mac after this
```

---

## Test a Specific Port

```bash
nc -zv google.com 443      # test port 443 TCP
nc -zv google.com 22       # test SSH
nc -zu 8.8.8.8 53          # test DNS (UDP)
```
