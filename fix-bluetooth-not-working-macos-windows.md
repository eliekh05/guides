---
layout: default
title: "Fix Bluetooth Not Working on macOS and Windows"
parent: "System & Users"
nav_order: 19
---

# Fix Bluetooth Not Working on macOS and Windows

---

## macOS

### Fix 1 — Toggle Bluetooth Off and On

Click the Bluetooth icon in the menu bar → turn off → wait 5 seconds → turn back on. Fixes roughly a third of cases.

### Fix 2 — Forget and Re-Pair the Device

1. **System Settings** → **Bluetooth**.
2. Click **(i)** next to the device → **Forget This Device**.
3. Put the device back into pairing mode.
4. Re-pair it.

### Fix 3 — Reset the Bluetooth Module

**macOS Ventura and later:**
Hold **Shift + Option (⌥)** and click the Bluetooth icon in the menu bar → **Reset the Bluetooth module** → confirm.

**macOS Monterey and earlier:**
Hold **Shift + Option (⌥)** and click Bluetooth icon → **Debug** → **Reset the Bluetooth module**.

### Fix 4 — Delete Bluetooth Preference Files

Open **Finder** → **Command + Shift + G** → navigate to `/Library/Preferences/` and delete:
- `com.apple.Bluetooth.plist`

Then navigate to `~/Library/Preferences/` and delete:
- `com.apple.Bluetooth.plist`

Restart your Mac. macOS recreates these files fresh.

### Fix 5 — Reset NVRAM

**Intel Mac:** Restart holding **Option + Command + P + R** for 20 seconds.
**Apple Silicon:** Standard restart — NVRAM resets automatically.

See the **Reset NVRAM and SMC** guide for full instructions.

---

## Windows

### Fix 1 — Toggle Bluetooth

**Settings** → **Bluetooth & devices** → toggle off → wait 5 seconds → toggle back on.

### Fix 2 — Run the Bluetooth Troubleshooter

**Settings** → **System** → **Troubleshoot** → **Other troubleshooters** → **Bluetooth** → **Run**.

### Fix 3 — Restart Bluetooth Services

Open **Command Prompt as Administrator**:
```cmd
net stop bthserv
net start bthserv
```

### Fix 4 — Update or Reinstall Bluetooth Driver

1. Right-click Start → **Device Manager** → expand **Bluetooth**.
2. Right-click your adapter → **Update driver** → **Search automatically**.
3. If that fails: right-click → **Uninstall device** → check **Delete the driver software** → **Uninstall** → restart Windows.

### Fix 5 — Disable Fast Startup

Fast Startup leaves Bluetooth in a bad state between sessions:

1. **Control Panel** → **Power Options** → **Choose what the power buttons do**.
2. Click **Change settings that are currently unavailable**.
3. Uncheck **Turn on fast startup** → **Save changes**.
4. Do a full restart (not shutdown).

---

## Quick Reference

| Symptom | macOS Fix | Windows Fix |
|---|---|---|
| Device won't connect | Fix 2 — forget and re-pair | Fix 2 — remove and re-pair |
| Bluetooth greyed out | Fix 3 — reset module | Fix 4 — reinstall driver |
| Stopped after OS update | Fix 4 — delete prefs | Fix 4 — update driver |
| Drops after sleep/wake | Fix 3 — reset module | Fix 5 — disable fast startup |
