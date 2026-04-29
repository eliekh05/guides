---
layout: default
title: "Reset macOS Dock to Default"
parent: "macOS & Linux"
nav_order: 6
---

# Reset macOS Dock to Default

If your Dock is cluttered, broken, or just not how you want it, this command resets it completely back to Apple's factory default — the same layout you get on a brand new Mac.

---

## Steps

1. Open **Terminal** (Applications → Utilities → Terminal).

2. Copy and paste the following command and press **Enter**:

   ```bash
   defaults delete com.apple.dock; killall Dock
   ```

3. The Dock will disappear for a second and relaunch automatically with its default layout.

That is it — no restart needed.

---

## What This Does

| Part | What it does |
|---|---|
| `defaults delete com.apple.dock` | Deletes your entire Dock preferences file, reverting every setting to Apple's defaults |
| `killall Dock` | Immediately restarts the Dock process so the changes take effect |

---

## What Gets Reset

- All apps you added to the Dock are removed
- All apps Apple includes by default come back (Finder, Safari, Mail, etc.)
- Dock size, position, and magnification revert to defaults
- Any folders or stacks you pinned are removed

---

> **Note:** This cannot be undone. If you want to save your current Dock layout before resetting, take a screenshot of it first so you can manually rebuild it afterwards.
