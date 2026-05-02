---
layout: default
title: "Fix Windows Update Stuck or Failing"
parent: "System & Users"
nav_order: 8
---

# Fix Windows Update Stuck or Failing

Windows Update failing is one of the most searched Windows problems. The fixes vary depending on the exact symptom — stuck downloading, stuck installing, rolling back, or showing an error code. Work through these in order from simplest to most involved.

---

## Step 0 — Check Disk Space First

Windows Update silently fails if your C: drive has less than 10 GB free. Feature updates (like 22H2, 23H2, 24H2) need 20–30 GB of working space.

Check free space in File Explorer. If low, open **Disk Cleanup** (search in Start menu), run it, and also click **Clean up system files** for more space.

---

## Step 1 — Run the Windows Update Troubleshooter

Windows has a built-in troubleshooter that fixes the most common causes automatically:

**Windows 11:**
Settings → System → Troubleshoot → Other troubleshooters → Windows Update → **Run**

**Windows 10:**
Settings → Update & Security → Troubleshoot → Additional troubleshooters → Windows Update → **Run the troubleshooter**

Let it run and apply all fixes it finds. Restart and try Windows Update again.

---

## Step 2 — Reset the Windows Update Cache

Corrupted download cache is one of the most common causes of stuck or failed updates. This clears it completely and forces a fresh download.

Open **Command Prompt as Administrator** (right-click Start → Terminal/Command Prompt → Run as administrator):

```cmd
net stop wuauserv
net stop cryptsvc
net stop bits
net stop msiserver

ren C:\Windows\SoftwareDistribution SoftwareDistribution.old
ren C:\Windows\System32\catroot2 catroot2.old

net start wuauserv
net start cryptsvc
net start bits
net start msiserver
```

Restart your PC and run Windows Update again.

---

## Step 3 — Run DISM and SFC (Fix Corrupted System Files)

> **Always run DISM before SFC.** DISM repairs the Windows image that SFC uses as a reference. Running SFC first when the image is corrupted will not fix anything.

Open **Command Prompt as Administrator** and run these in order:

```cmd
DISM /Online /Cleanup-Image /CheckHealth
DISM /Online /Cleanup-Image /ScanHealth
DISM /Online /Cleanup-Image /RestoreHealth
```

Wait for each to complete. `RestoreHealth` downloads replacement files from Microsoft — it needs internet and can take 10–30 minutes.

Then run SFC:

```cmd
sfc /scannow
```

Restart after both complete. Try Windows Update again.

---

## Step 4 — Manually Install the Update

If a specific update keeps failing, install it manually:

1. Note the KB number of the failing update (e.g. `KB5031354`) — visible in **Settings → Windows Update → View update history**.
2. Go to [catalog.update.microsoft.com](https://catalog.update.microsoft.com).
3. Search for the KB number.
4. Download the `.msu` file matching your Windows version and architecture (x64 for most PCs).
5. Run the downloaded file to install it.

---

## Step 5 — Fix Network and Proxy Issues

VPNs and manual proxy settings silently break Windows Update — it cannot reach Microsoft's servers.

1. Disconnect from any VPN.
2. Go to **Settings → Network & Internet → Proxy** and make sure **Use a proxy server** is off.
3. Open Command Prompt as Administrator and reset network settings:

```cmd
netsh winsock reset
netsh winhttp reset proxy
ipconfig /flushdns
```

Restart and try again.

---

## Step 6 — Fix Update Services

If Windows Update services are stopped or set to disabled:

Open **Command Prompt as Administrator**:

```cmd
sc config wuauserv start= auto
sc config bits start= auto
sc config cryptsvc start= auto
sc config trustedinstaller start= auto

net start wuauserv
net start bits
net start cryptsvc
```

---

## Step 7 — Use the Modern Update Command (usoclient)

`wuauclt` is deprecated on Windows 10 and 11. Use `usoclient` to force Windows to scan and install updates:

Open **Command Prompt as Administrator**:

```cmd
usoclient StartScan
usoclient StartDownload
usoclient StartInstall
```

Or force the full cycle in one line:
```cmd
usoclient ScanInstallWait
```

---

## Step 8 — In-Place Upgrade Repair (Last Resort Before Reinstall)

If DISM and SFC cannot repair the system, an in-place upgrade reinstalls Windows over itself — keeping all your files, apps, and settings — while replacing all system files with fresh copies.

1. Download the **Windows 11 Media Creation Tool** from [microsoft.com/software-download/windows11](https://microsoft.com/software-download/windows11) (or Windows 10 equivalent).
2. Run it and select **Upgrade this PC now**.
3. Choose **Keep personal files and apps**.
4. Let it run — this takes 30–60 minutes and reboots several times.

This is not a reinstall. Your files and apps are preserved.

---

## Common Error Codes

| Error Code | Meaning | Fix |
|---|---|---|
| `0x80070002` | File not found — corrupted cache | Step 2 (reset cache) |
| `0x80070422` | Windows Update service stopped | Step 6 (fix services) |
| `0x800f0922` | Insufficient space or VPN issue | Step 0 (disk space) + Step 5 (network) |
| `0x80190001` | Network/connection error | Step 5 (network fix) |
| `0x8024402F` | Cannot connect to Windows Update | Step 5 (network fix) |
| `0x800f081f` | DISM source not found | Step 3 (DISM with internet) |
| `0x80073701` | Component store corruption | Step 3 (DISM + SFC) |

---

## If the Update Keeps Rolling Back

"Undoing changes made to your computer" appears and the update never completes:

1. Pause updates for 1 week in Settings → Windows Update to stop the retry loop.
2. Run Step 3 (DISM + SFC) to repair system files.
3. Run Step 2 (clear cache).
4. Resume updates.

If a specific update keeps rolling back after everything else, wait — Microsoft sometimes issues a patch for failed updates within a few days. Newer cumulative updates supersede older ones, so if a later update installs successfully, the earlier failed one may disappear from your history.