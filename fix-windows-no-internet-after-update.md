---
layout: default
title: "Fix Windows 11 No Internet After Update"
parent: "Windows"
nav_order: 7
---

# Fix Windows 11 No Internet After Update

After a Windows update, network adapters sometimes lose their settings or drivers get corrupted. Here is how to fix it.

---

## Fix 1 — Reset Network Stack

Open **Command Prompt as Administrator** and run all of these:

```cmd
netsh winsock reset
netsh int ip reset
netsh int tcp reset
ipconfig /release
ipconfig /flushdns
ipconfig /renew
```

Restart your PC and test.

---

## Fix 2 — Reinstall Network Adapter Driver

1. Right-click Start → **Device Manager**.
2. Expand **Network adapters**.
3. Right-click your adapter → **Uninstall device**.
4. Check **Attempt to remove the driver for this device**.
5. Click **Uninstall**.
6. Restart Windows — it reinstalls the driver automatically.

---

## Fix 3 — Run Network Troubleshooter

**Settings → System → Troubleshoot → Other troubleshooters → Internet Connections → Run**

---

## Fix 4 — Reset TCP/IP and Winsock More Thoroughly

```cmd
netsh int ip reset resetlog.txt
netsh winsock reset catalog
netsh advfirewall reset
```

Restart after running these.

---

## Fix 5 — Check DHCP Service Is Running

```cmd
sc query dhcp
net start dhcp
```

Or in **Services** (`services.msc`): find **DHCP Client** → make sure it is **Running** and set to **Automatic**.

---

## Fix 6 — Roll Back Network Driver

If a specific driver update broke connectivity:

1. **Device Manager** → **Network adapters** → right-click your adapter → **Properties**.
2. **Driver** tab → **Roll Back Driver** (if available).

---

## Fix 7 — Update or Manually Install the Driver

If rolling back is not available and the automatically reinstalled driver still does not work:

1. Note your adapter name from Device Manager.
2. Go to your laptop/motherboard manufacturer's website and download the network driver manually.
3. Install it.

---

## Fix 8 — Reset Network Settings Completely

**Settings → Network & Internet → Advanced network settings → Network reset**

This removes all network adapters and resets all networking components. You will need to re-enter WiFi passwords.
