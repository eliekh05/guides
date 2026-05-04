---
layout: default
title: "Fix Windows 11 Slow Boot"
parent: "System & Users"
nav_order: 12
---

# Fix Windows 11 Slow Boot

---

## Fix 1 — Disable Startup Apps

The most common cause. Apps that launch at startup slow down the boot process significantly.

1. Press **Ctrl + Shift + Esc** to open Task Manager.
2. Click the **Startup apps** tab.
3. Sort by **Startup impact** — look for High impact apps you do not need at startup.
4. Right-click → **Disable** for anything you do not need immediately on login.

Common unnecessary startup items: Spotify, Discord, Teams, OneDrive (if you do not use it), Skype, game launchers.

---

## Fix 2 — Disable Fast Startup (Fixes Slow Boot Paradox)

Fast Startup is supposed to make Windows boot faster but on many systems it actually causes longer boot times, update hangs, and driver issues.

1. Open **Control Panel** → **Power Options** → **Choose what the power buttons do**.
2. Click **Change settings that are currently unavailable**.
3. Uncheck **Turn on fast startup**.
4. Click **Save changes**.

Restart and check if boot time improves.

---

## Fix 3 — Run SFC and DISM

Corrupted system files cause slow boots. Fix them:

Open **Command Prompt as Administrator**:

```cmd
DISM /Online /Cleanup-Image /RestoreHealth
sfc /scannow
```

Restart after both complete.

---

## Fix 4 — Adjust Virtual Memory

If you have limited RAM, Windows using the wrong page file settings can slow boot:

1. Search **Adjust the appearance and performance of Windows** in Start menu.
2. Click **Advanced** tab → **Virtual memory** → **Change**.
3. Uncheck **Automatically manage paging file size**.
4. Select your C: drive → **System managed size** → **Set** → **OK**.
5. Restart.

---

## Fix 5 — Check SSD Health

A failing or degraded SSD slows everything — boot, app launches, and file access.

Open **PowerShell as Administrator**:

```powershell
Get-PhysicalDisk | Select FriendlyName, HealthStatus, OperationalStatus
```

If HealthStatus shows anything other than **Healthy**, the drive is failing.

Also check with:
```cmd
wmic diskdrive get status
```

---

## Fix 6 — Update or Roll Back Display / Storage Drivers

Bad drivers slow the boot process significantly — especially display and storage drivers.

1. Press **Windows + X** → **Device Manager**.
2. Expand **Display adapters** — right-click your GPU → **Update driver**.
3. Expand **Disk drives** — right-click your SSD → **Update driver**.
4. If boot was fast before a recent driver update, right-click → **Properties** → **Driver** tab → **Roll Back Driver**.

---

## Fix 7 — Clean Boot to Find the Culprit

If none of the above work, a third-party service or app is causing the slow boot.

1. Press **Windows + R** → type `msconfig` → Enter.
2. **Services** tab → check **Hide all Microsoft services** → **Disable all**.
3. **Startup** tab → **Open Task Manager** → disable all startup items.
4. Click **OK** → **Restart**.

If Windows boots fast in clean boot, re-enable services and startup items in batches to find the culprit.

---

## Measure Actual Boot Time

```cmd
# Check last boot time
systeminfo | find "Boot Time"

# Or in PowerShell
(Get-Date) - (gcim Win32_OperatingSystem).LastBootUpTime
```

For detailed boot analysis, open **Event Viewer** → **Applications and Services Logs** → **Microsoft** → **Windows** → **Diagnostics-Performance** → **Operational**. Event ID **100** shows total boot time.
