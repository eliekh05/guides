# Fix: Internet Works But Browser Says "Server Not Found" (macOS)

If apps like Mail, Spotify, or the App Store work fine, but your browser shows "Server Not Found", "This site can't be reached", or similar errors — your internet connection is fine. The problem is with **DNS** (the system that translates domain names like `google.com` into IP addresses).

---

## Step 1 — Flush the DNS Cache

The most common cause is a stale or corrupted DNS cache. Run the following in Terminal:

```bash
sudo dscacheutil -flushcache; sudo killall -HUP mDNSResponder
```

Enter your login password when prompted. Then **restart your browser** (not just a new tab — quit and reopen it).

If that does not fix it, continue to the steps below.

---

## Step 2 — Clear the Browser's Own DNS Cache

Browsers cache DNS entries independently of macOS. Even after flushing the system cache, the browser may still use its own stale records.

**Chrome / Brave / Edge:**
1. In the address bar, go to: `chrome://net-internals/#dns`
2. Click **Clear host cache**.
3. Then go to: `chrome://net-internals/#sockets`
4. Click **Flush socket pools**.

**Firefox:**
1. In the address bar, go to: `about:networking#dns`
2. Click **Clear DNS Cache**.

**Safari:**
Safari uses the system DNS cache. Flushing the macOS cache (Step 1) is sufficient. You can also go to **Develop** → **Empty Caches** in the menu bar. If the Develop menu is not visible, enable it in **Safari Settings** → **Advanced** → **Show Develop menu**.

---

## Step 3 — Change Your DNS Server

Your ISP's DNS server may be slow or unresponsive. Switching to a public DNS server often resolves persistent issues.

1. Open **System Settings** → **Network**.
2. Select your active connection (Wi-Fi or Ethernet) and click **Details**.
3. Go to the **DNS** tab.
4. Click **+** and add one of the following:

**Cloudflare (fast, privacy-focused):**
```
1.1.1.1
1.0.0.1
```

**Google:**
```
8.8.8.8
8.8.4.4
```

5. Remove any existing DNS entries that are not working (select them and click **−**).
6. Click **OK**, then flush the DNS cache again (Step 1) and test your browser.

---

## Step 4 — Restart mDNSResponder

`mDNSResponder` is the macOS service that handles DNS lookups. Restarting it can clear issues that a cache flush alone does not fix:

```bash
sudo killall -HUP mDNSResponder
```

---

## Step 5 — Check for a Proxy or VPN Conflict

A misconfigured proxy or VPN can intercept DNS requests and cause browser-only failures.

1. Open **System Settings** → **Network** → **Details** (for your active connection) → **Proxies**.
2. Make sure **no proxy settings are enabled** unless you intentionally use one.
3. If you use a VPN, try disconnecting it and testing your browser again.

---

## Step 6 — Renew Your DHCP Lease

Your IP address and DNS assignment from your router may be stale.

1. Open **System Settings** → **Network**.
2. Select your active connection and click **Details**.
3. Go to the **TCP/IP** tab.
4. Click **Renew DHCP Lease**.
5. Wait a few seconds and test your browser.

---

## Quick Checklist

| Check | Command / Location |
|---|---|
| Flush DNS cache | `sudo dscacheutil -flushcache; sudo killall -HUP mDNSResponder` |
| Clear browser DNS cache | `chrome://net-internals/#dns` or Firefox `about:networking#dns` |
| Change DNS server | System Settings → Network → Details → DNS |
| Restart mDNSResponder | `sudo killall -HUP mDNSResponder` |
| Disable proxy | System Settings → Network → Details → Proxies |
| Renew DHCP lease | System Settings → Network → Details → TCP/IP |

---

> **Note:** If none of the above works, try a different browser to confirm the issue is not specific to one app. If the second browser also fails, the problem is at the system level. Try restarting your router and modem, then repeat the steps above.
