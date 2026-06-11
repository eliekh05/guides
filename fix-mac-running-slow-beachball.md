---
layout: default
title: "Fix Mac Running Slow or Constant Beachball"
parent: "System & Users"
nav_order: 16
---

# Fix Mac Running Slow or Constant Beachball

The spinning beachball (officially the "spinning wait cursor") appears when macOS is waiting for something and has no time left to animate the cursor normally. Here is how to find what is causing it and fix it.

---

## Step 1 — Find the Culprit in Activity Monitor

Open **Activity Monitor** (Applications → Utilities → Activity Monitor).

**Check CPU tab first:**
- Sort by **% CPU** descending
- Any process above 80–100% when things feel slow is likely the issue
- Note the process name

**Then check Memory tab:**
- Look at the **Memory Pressure** graph at the bottom
- **Red pressure** = you are out of RAM and Mac is swapping to disk — this is the #1 cause of beachball
- Check **Swap Used** — anything above 1–2 GB means you need more RAM or fewer apps open

**Common CPU culprits:**

| Process | What it means | Fix |
|---|---|---|
| `mds_stores` | Spotlight indexing | Wait — it stops on its own after indexing |
| `kernel_task` | Thermal throttling | Mac is overheating — clean vents, improve airflow |
| `backupd` | Time Machine backup running | Normal — wait for it to finish |
| A browser tab | Heavy webpage or video | Close unused tabs |
| Any app at 100%+ | App is stuck | Force quit it |

---

## Step 2 — Force Quit Stuck Apps

If a specific app is causing the beachball:

- **Command + Option + Escape** → select the app → **Force Quit**
- Or right-click the app in the Dock → **Force Quit**

---

## Step 3 — Free Up RAM

If memory pressure is yellow or red:

**Quit apps you are not using:**
```bash
# See what is using the most RAM
top -o MEM
```

**Clear inactive memory (temporary fix):**
```bash
sudo purge
```

This frees cached memory. The effect is temporary but immediate.

**Long-term:** if you are regularly hitting red memory pressure with your normal workload, you need more RAM or a Mac with more memory.

---

## Step 4 — Check and Fix Disk Issues

A slow or failing SSD causes persistent beachball regardless of RAM and CPU.

```bash
# Check disk health
diskutil info / | grep "SMART Status"
```

Should say `Verified`. If it says `Failing`, back up immediately.

**Run First Aid:**
1. Open **Disk Utility** → select your drive → **First Aid** → **Run**.
2. Fix any errors found.

**Check available space:**
```bash
df -h
```

macOS needs at least 10–15 GB free to function smoothly. If your drive is almost full, clear space:
- Empty Trash
- Delete unused apps
- Move large files to external storage
- Run `brew cleanup` if you use Homebrew

---

## Step 5 — Disable Login Items and Background Apps

Apps that launch at startup and run in the background compete for RAM and CPU.

1. **System Settings** → **General** → **Login Items & Extensions**.
2. Under **Open at Login**, remove anything you do not need at startup.
3. Also check **Allow in Background** — disable anything unnecessary.

---

## Step 6 — Reset SMC (Thermal / Fan Issues)

If the Mac feels hot and `kernel_task` is using high CPU, the SMC is managing thermals. Resetting it can resolve incorrect thermal readings:

See the **Reset NVRAM and SMC** guide for the exact steps for your Mac model.

---

## Step 7 — Check for Malware

Legitimate malware is rare on Mac but does exist. If CPU usage is high with no obvious app causing it:

```bash
# Check for unusual processes
ps aux | sort -k 3 -r | head -20
```

Or use **Malwarebytes for Mac** (free scan) — the most reliable free scanner for macOS.

---

## Step 8 — Reinstall macOS (Last Resort)

If nothing above helps and the Mac was fast before:

1. Boot into Recovery Mode (hold **Command + R** on Intel, hold power on Apple Silicon).
2. Select **Reinstall macOS**.
3. This reinstalls the OS without deleting your files.

If it is still slow after reinstall, the hardware is at fault (RAM, SSD, or thermal paste worn out on older Intel Macs).

---

## Quick Diagnostic

```bash
# One-liner to see top CPU users right now
ps aux --sort=-%cpu | head -10

# One-liner to see top RAM users right now  
ps aux --sort=-%mem | head -10

# Check system load average (1m, 5m, 15m)
uptime
```

Load average above the number of CPU cores = system is overloaded.