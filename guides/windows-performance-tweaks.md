---
layout: default
title: "Windows 11 Performance Tweaks"
parent: "Windows"
nav_order: 12
---

# Windows 11 Performance Tweaks

---

## Disable Startup Programs

**Task Manager (Ctrl+Shift+Esc) → Startup apps**

Right-click and Disable anything you do not need at startup. Focus on programs with High startup impact.

---

## Set Power Plan to High Performance

```powershell
# Set High Performance plan
powercfg /setactive 8c5e7fda-e8bf-4a96-9a85-a6e23a8c635c

# Or Ultimate Performance (enables on some systems)
powercfg -duplicatescheme e9a42b02-d5df-448d-aa00-03f14749eb61
```

Or: Settings → System → Power → Power mode → Best Performance

---

## Disable Visual Effects

**Search: "Adjust the appearance and performance of Windows"**

Select **Adjust for best performance** or manually uncheck:
- Animate controls and elements inside windows
- Animate windows when minimizing and maximizing
- Fade or slide menus into view
- Show shadows under windows

---

## Disable Transparency

Settings → Personalisation → Colours → Transparency effects → Off

Reduces GPU load, makes taskbar and Start menu feel snappier.

---

## Clean Up Storage

```powershell
# Run Disk Cleanup as admin
cleanmgr /sageset:1 /d C:
cleanmgr /sagerun:1

# Clear Windows Update cache
net stop wuauserv
Remove-Item "C:\Windows\SoftwareDistribution\Download" -Recurse -Force
net start wuauserv
```

Settings → System → Storage → Temporary files → check items and Remove files

---

## Disable Windows Search Indexing (Low-RAM Systems)

Services → Windows Search → Startup type: Disabled

Reduces disk I/O constantly. Search still works but is slower.

---

## Adjust Virtual Memory

If you have low RAM:

Search: "Adjust the appearance and performance of Windows" → Advanced → Virtual memory → Change

Uncheck "Automatically manage" → Custom size:
- Initial size: 1.5x RAM in MB (e.g., 6144 for 4GB RAM)
- Maximum size: 3x RAM in MB (e.g., 12288 for 4GB RAM)

---

## Disable Unnecessary Services

Open Services (services.msc). Set these to **Manual** if you do not use them:

- **Print Spooler** — disable if no printer
- **Fax** — almost never needed
- **Windows Error Reporting** — disable for privacy
- **Xbox Game Bar, Xbox Live** — disable if not gaming

---

## Game Mode

Settings → Gaming → Game Mode → On

Prioritises CPU and GPU resources for the focused game. Also useful for video rendering.

---

## StorSense (SSD Health)

Windows monitors SSD health via SMART:

```powershell
# Check NVMe SSD health
Get-PhysicalDisk | Get-StorageReliabilityCounter | Select DeviceId, Temperature, Wear
```

Settings → System → Storage → Drive health (if supported by your drive)
