---
layout: default
title: "macOS Activity Monitor Explained"
parent: "System & Users"
nav_order: 11
---

# macOS Activity Monitor Explained

Activity Monitor shows everything running on your Mac and what resources it is using. Most people open it when something is slow, see a wall of numbers, and close it again. This guide explains what actually matters.

---

## Open Activity Monitor

Search with Spotlight: **Activity Monitor** or go to Applications → Utilities → Activity Monitor.

---

## CPU Tab

Shows what is using your processor.

**% CPU** — how much CPU each process uses. 100% means one full core. On an 8-core Mac, total can reach 800%.

**What to look for:**
- Any process above 80–100% when things feel slow is likely the culprit
- `kernel_task` using high CPU is a thermal throttling mechanism — it is protecting your Mac from overheating, not causing the problem. Check if the Mac is hot.
- `mds_stores` or `mdworker` — Spotlight is indexing. This slows down after a new macOS install or drive connection. It will stop on its own.
- `WindowServer` — handles all screen rendering. High usage means a lot is happening on screen, or a GPU issue.

**At the bottom:**
- **System** — CPU used by macOS itself
- **User** — CPU used by your apps
- **Idle** — free CPU. Higher is better.

---

## Memory Tab

**Memory Used** — total RAM in use. This alone is not a problem — macOS fills RAM deliberately.

**What actually matters:**

- **Memory Pressure** (the graph at the bottom) — this is the real indicator
  - **Green** — plenty of RAM, no issue
  - **Yellow** — RAM is getting full, macOS is managing it
  - **Red** — RAM is full, Mac is swapping to disk — this is why things are slow

- **Swap Used** — how much disk space macOS is using as overflow RAM. Any swap means you are out of RAM. More swap = slower performance.

**App Memory** — RAM actively used by apps
**Wired Memory** — RAM macOS cannot move, reserved by the system
**Compressed** — RAM that has been compressed to save space (this is normal and good)

---

## Disk Tab

Shows read and write activity on your storage.

- High disk activity when things feel slow usually means swap usage (see Memory tab) or an app writing/reading a lot of data
- `backupd` — Time Machine backup running
- `mds_stores` — Spotlight indexing

---

## Network Tab

Shows which apps are sending and receiving data.

- Useful for finding apps that are unexpectedly using bandwidth
- Sort by **Bytes Sent** or **Bytes Rcvd** to find the biggest users

---

## Energy Tab

Shows battery impact per app — useful on MacBooks.

- **Energy Impact** — current power draw
- **Avg Energy Impact** — average over the last 8 hours
- High energy impact from a background app you do not use = quit it

---

## How to Quit a Problem Process

1. Select the process in the list
2. Click the **X** button in the top left of Activity Monitor
3. Choose **Quit** (graceful) or **Force Quit** (immediate)

> Never force quit `kernel_task`, `WindowServer`, `Dock`, or `Finder` — these are core system processes.

---

## Quick Diagnosis

| Symptom | Check |
|---|---|
| Everything slow | Memory tab — is pressure red? Is swap > 1GB? |
| Fan running loud | CPU tab — what's using 100%+ CPU? |
| Battery draining fast | Energy tab — what has high avg energy impact? |
| Internet slow | Network tab — what app is using bandwidth? |
| Disk light always on | Disk tab — what is reading/writing constantly? |
