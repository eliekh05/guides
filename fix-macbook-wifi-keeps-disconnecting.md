---
layout: default
title: "Fix MacBook Wi-Fi Keeps Disconnecting"
parent: "Networking & DNS"
nav_order: 5
---

# Fix MacBook Wi-Fi Keeps Disconnecting

MacBook Wi-Fi dropping repeatedly is one of the most common and frustrating Mac problems. It has several different causes — each with a different fix. Work through these in order from most to least common.

---

## Fix 1 — Renew DHCP Lease (Most Common Cause)

A stale DHCP lease causes the router to stop recognising your Mac, dropping the connection at the IP level even though Wi-Fi appears connected.

1. Open **System Settings** → **Network** → **Wi-Fi** → **Details**.
2. Go to the **TCP/IP** tab.
3. Click **Renew DHCP Lease**.
4. Click **OK**.

Test for a few minutes. If disconnections stop, this was the cause.

---

## Fix 2 — Switch to 5GHz Band

If your router broadcasts both 2.4GHz and 5GHz on the same network name, macOS often connects to the congested 2.4GHz band. The 2.4GHz band is shared with microwaves, Bluetooth, and neighbouring networks — causing drops even when signal looks strong.

**Check which band you're on:**
Hold **Option (⌥)** and click the Wi-Fi icon in your menu bar. Look for **Channel** — channels 1–13 are 2.4GHz, channels 36+ are 5GHz.

**Fix:** Log into your router settings and split the two bands into separate network names — e.g. `HomeWifi` (2.4GHz) and `HomeWifi_5G` (5GHz). Connect your Mac to the 5GHz network.

---

## Fix 3 — Delete Saved Wi-Fi Network Profile (Fixes Corrupted Profiles)

macOS stores Wi-Fi profiles that can become corrupted after a router firmware update, password change, or macOS update. A corrupted profile causes connect-then-drop loops.

1. Go to **System Settings** → **Network** → **Wi-Fi**.
2. Click **Details** next to your network name.
3. Click **Forget This Network**.
4. Reconnect by selecting the network and entering the password fresh.

---

## Fix 4 — Create a New Network Location

If Fix 3 did not help, your entire network configuration may be corrupted. Creating a new Location gives macOS a completely fresh set of network settings.

1. Open **System Settings** → **Network**.
2. Click the **Location** dropdown at the top → **Edit Locations**.
3. Click **+** → name it something like `Home` → click **Done**.
4. Select the new location.
5. Connect to your Wi-Fi network — macOS will treat it as a first-time connection.

---

## Fix 5 — Flush DNS Cache and Remove Old Keychain Entry

A corrupted DNS cache or outdated Wi-Fi password stored in Keychain can cause connection timeouts that look like disconnections.

**Flush DNS:**
```bash
sudo dscacheutil -flushcache; sudo killall -HUP mDNSResponder
```

**Remove old Keychain entry:**
1. Open **Keychain Access** (search with Spotlight).
2. Search for your Wi-Fi network name.
3. Delete any entries for it.
4. Reconnect to Wi-Fi and enter the password fresh — it will save a clean entry.

---

## Fix 6 — Disable Wi-Fi Power Nap and Power Saving

macOS throttles Wi-Fi when the Mac is idle or on battery, which can cause drops.

1. Open **System Settings** → **Battery**.
2. Click **Options** (or scroll to find advanced settings).
3. Disable **Enable Power Nap**.
4. On MacBooks, also try: go to **Wi-Fi Details** → **Hardware** tab → set **Configure IPv6** to **Link-local only** (reduces background IPv6 probing that can destabilise connections).

---

## Fix 7 — Reset Wi-Fi Module via Terminal

This clears the Wi-Fi module's state without rebooting:

```bash
sudo ifconfig en0 down
sudo ifconfig en0 up
```

Or turn Wi-Fi off and on via menu bar. For a deeper reset:

```bash
sudo networksetup -setairportpower en0 off
sudo networksetup -setairportpower en0 on
```

---

## Fix 8 — Check for Software Conflicts

VPNs, firewalls, and network monitoring apps can intercept Wi-Fi traffic and cause drops. If you installed any of these around the time problems started:

1. Temporarily disable or uninstall the app.
2. Test Wi-Fi stability for 30 minutes.
3. If drops stop, the app is the cause — check for an update or contact the developer.

Common culprits: Little Snitch, Lulu, Cisco AnyConnect, old versions of Norton or McAfee.

---

## Fix 9 — Run Apple Wireless Diagnostics

macOS has a built-in tool that scans for Wi-Fi problems:

1. Hold **Option (⌥)** and click the **Wi-Fi icon** in the menu bar.
2. Select **Open Wireless Diagnostics**.
3. Click **Continue** and let it run.
4. Go to **Window** → **Scan** to see all nearby networks and identify channel congestion.
5. Go to **Window** → **Performance** to watch signal strength and transmit rate in real time.

The tool will flag specific issues it finds and suggest fixes.

---

## Fix 10 — Reset NVRAM and SMC

If nothing above has worked, the Wi-Fi card's stored settings or power management firmware may be corrupted. See the **Reset NVRAM and SMC** guide for full instructions — resetting both often resolves persistent Wi-Fi hardware issues.

---

## Troubleshooting Quick Reference

| Symptom | Most Likely Cause | Fix |
|---|---|---|
| Drops every few minutes | Stale DHCP lease | Fix 1 |
| Slow then drops | 2.4GHz congestion | Fix 2 |
| Connects then immediately drops | Corrupted network profile | Fix 3 |
| Drops after macOS update | Corrupted network config | Fix 4 |
| Drops overnight or when idle | Power Nap/power saving | Fix 6 |
| Drops only when VPN active | Software conflict | Fix 8 |
| Random drops, no pattern | Multiple causes | Work through all fixes |
