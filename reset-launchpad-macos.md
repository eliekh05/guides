---
layout: default
title: "Reset Launchpad on macOS"
parent: "System & Users"
nav_order: 18
---

# Reset Launchpad on macOS

Launchpad gets cluttered with ghost icons from deleted apps, broken installs, or apps that no longer exist. This guide covers how to reset it back to default — the right method depending on your macOS version.

---

## Method 1 — Terminal Command (macOS Ventura and earlier)

```bash
defaults write com.apple.dock ResetLaunchPad -bool true; killall Dock
```

The Dock restarts, Launchpad resets to default layout — Apple apps on the first page, third-party apps on subsequent pages.

> This command does **not** delete your apps. It only resets the icon layout and removes ghost icons from deleted apps.

---

## Method 2 — Delete the Launchpad Database (macOS Sequoia 15.2+)

The `defaults write` command stopped working reliably on macOS Sequoia 15.2+. Use this instead:

```bash
sudo find /private/var/folders/ -type d -name com.apple.dock.launchpad -exec rm -rf {} + 2>/dev/null; killall Dock
```

This finds and deletes the Launchpad database files directly, then restarts the Dock which rebuilds them fresh.

---

## Method 3 — Delete the Database Files Manually

If neither command above works:

1. Open **Finder** → press **Command + Shift + G** → go to:
   ```
   ~/Library/Application Support/Dock/
   ```
2. Delete all `.db` files in that folder.
3. Restart your Mac or run `killall Dock` in Terminal.

---

## Reset Rows and Columns to Default

If you changed the grid size and want to go back to the default (5 rows × 7 columns):

```bash
defaults write com.apple.dock springboard-rows -int 5
defaults write com.apple.dock springboard-columns -int 7
killall Dock
```

---

## Fix Ghost Icons That Won't Go Away

If a specific app icon persists in Launchpad but the app is gone:

1. Hold **Option (⌥)** key in Launchpad — icons will wiggle and show an **×** button.
2. Click **×** on the ghost icon to remove it.

If the × does not appear, the app still has a partially installed receipt. Reset with Method 2 above.

---

## macOS Tahoe (26) — Launchpad Removed

Apple removed Launchpad in macOS Tahoe 26. If you upgraded from Sequoia and miss it, a Terminal workaround existed in early betas but was blocked in later updates. Use **Spotlight (Command + Space)** or the **Applications folder** to find and open apps instead.

---

> **Note:** After any reset, macOS rebuilds the Launchpad database on next open. The first open after a reset may take a few extra seconds.
