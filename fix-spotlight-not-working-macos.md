---
layout: default
title: "Fix Spotlight Not Working or Showing Wrong Results (macOS)"
parent: "System & Users"
nav_order: 15
---

# Fix Spotlight Not Working or Showing Wrong Results (macOS)

Spotlight stops working or shows stale results after macOS updates, migrating from another Mac, or when the index gets corrupted. The fix is always some form of reindex — the question is how deep a reindex you need.

---

## Fix 1 — Restart Spotlight's Process (Quickest)

Sometimes Spotlight's background process (`mds`) gets stuck. Kill it and it restarts automatically:

```bash
sudo killall mds
```

Wait 30 seconds and try Spotlight again. If results look right, done.

---

## Fix 2 — Reindex via System Settings (No Terminal)

1. Open **System Settings** → **Siri & Spotlight** → **Spotlight Privacy**.
2. Click **+** and add your **Macintosh HD** (your main drive).
3. Wait 5 seconds.
4. Select it in the list and click **−** to remove it.
5. Click **Done** and quit System Settings.

Spotlight will start reindexing immediately. A progress bar appears in the Spotlight window while it works. This takes 15–60 minutes depending on drive size.

---

## Fix 3 — Reindex via Terminal (Faster, More Reliable)

```bash
sudo mdutil -E /
```

This erases the existing index and forces a complete rebuild. Enter your password when prompted. Indexing starts immediately in the background.

To check indexing status:
```bash
mdutil -s /
```

Output will say `Indexing enabled` with a percentage, or `Indexing enabled` when complete.

---

## Fix 4 — Full Nuclear Reindex (For Persistent Corruption)

If Fix 3 does not resolve it, the index database files themselves are corrupted. Delete them manually:

```bash
sudo mdutil -i off /
sudo rm -rf /.Spotlight-V100
sudo rm -rf /.Spotlight-V200
sudo mdutil -i on /
sudo mdutil -E /
```

This completely wipes all Spotlight data and starts from scratch. Takes longer than Fix 3 but resolves deeper corruption.

---

## Fix 5 — Restart SystemUIServer

If Spotlight opens but the window is blank or frozen:

```bash
killall SystemUIServer
```

SystemUIServer manages the Spotlight UI. Killing it restarts it immediately — no reboot needed.

---

## Fix 6 — Check Spotlight Privacy Exclusions

If certain folders or files are not appearing in results, they may have been added to the Privacy exclusion list.

1. **System Settings** → **Siri & Spotlight** → **Spotlight Privacy**.
2. Check if your home folder or any important folder is listed.
3. Select it and click **−** to remove the exclusion.

---

## Fix 7 — Check Disk for Errors

A failing drive causes repeated Spotlight index corruption. Before spending more time reindexing:

1. Open **Disk Utility** → select your main drive → **First Aid** → **Run**.
2. If it finds errors it cannot fix, the drive needs attention — backup everything first.

---

## mds_stores Using High CPU After a Reindex

`mds_stores` appearing at 100%+ CPU in Activity Monitor after a reindex is normal — Spotlight is actively indexing. It will calm down after indexing completes. Give it time. If it is still high after several hours, run Fix 4.

---

## Quick Reference

| Problem | Fix |
|---|---|
| Spotlight not opening | Fix 5 — restart SystemUIServer |
| Results missing or wrong | Fix 2 or Fix 3 — reindex |
| Results wrong after migration | Fix 4 — full nuclear reindex |
| Specific folder not appearing | Fix 6 — check Privacy exclusions |
| mds_stores high CPU | Normal during indexing — wait it out |
| Repeated corruption | Fix 7 — check disk with First Aid |