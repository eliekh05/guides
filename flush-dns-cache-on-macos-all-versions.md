# Flush DNS Cache on macOS (All Versions)

The DNS flush command changes with almost every major macOS release. Most guides online are outdated — you run the command, nothing happens, and you assume it did not work. This guide lists the correct command for every macOS version in one place.

Flushing the DNS cache fixes issues like:
- Websites not loading after a DNS change
- Old IP addresses being cached for a domain
- Browser showing a site that no longer exists at that address
- Intermittent "Server Not Found" errors

---

## How to Flush DNS

1. Open **Terminal** (Applications → Utilities → Terminal).
2. Find your macOS version below and run the matching command.
3. Enter your login password when prompted (nothing will appear as you type).
4. You will see a confirmation message or the prompt will simply return.

---

## Commands by macOS Version

### macOS 15 (Sequoia) and macOS 14 (Sonoma)
```bash
sudo dscacheutil -flushcache; sudo killall -HUP mDNSResponder
```

### macOS 13 (Ventura)
```bash
sudo dscacheutil -flushcache; sudo killall -HUP mDNSResponder
```

### macOS 12 (Monterey)
```bash
sudo dscacheutil -flushcache; sudo killall -HUP mDNSResponder
```

### macOS 11 (Big Sur)
```bash
sudo dscacheutil -flushcache; sudo killall -HUP mDNSResponder
```

### macOS 10.15 (Catalina)
```bash
sudo dscacheutil -flushcache; sudo killall -HUP mDNSResponder
```

### macOS 10.14 (Mojave)
```bash
sudo dscacheutil -flushcache; sudo killall -HUP mDNSResponder
```

### macOS 10.13 (High Sierra)
```bash
sudo killall -HUP mDNSResponder
```

### macOS 10.12 (Sierra)
```bash
sudo killall -HUP mDNSResponder
```

### macOS 10.11 (El Capitan)
```bash
sudo dscacheutil -flushcache; sudo killall -HUP mDNSResponder
```

### macOS 10.10 (Yosemite)
```bash
sudo discoveryutil mdnsflushcache; sudo discoveryutil udnsflushcaches
```

### macOS 10.9 (Mavericks) and earlier
```bash
sudo dscacheutil -flushcache
```

---

## How to Find Your macOS Version

Click the **Apple menu ()** → **About This Mac**. The version name and number are shown at the top.

---

## What These Commands Do

| Command | What it does |
|---|---|
| `dscacheutil -flushcache` | Clears the DNS client cache |
| `killall -HUP mDNSResponder` | Restarts the mDNSResponder service, which handles DNS resolution |

Running both together (separated by `;`) ensures both the cache and the service are reset. On some versions only one is needed, but running both is always safe.

---

> **Note:** After flushing, close and reopen your browser. Browsers maintain their own DNS cache separately from macOS, and a browser restart is needed for the flush to fully take effect. In Chrome, you can also navigate to `chrome://net-internals/#dns` and click **Clear host cache**.
