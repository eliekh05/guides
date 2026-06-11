---
layout: default
title: "Gatekeeper — \"Apple Cannot Verify This App\" Reminder"
parent: "macOS"
nav_order: 29
---

# Gatekeeper — "Apple Cannot Verify This App" Reminder

When you try to open an app on macOS and get:

> **"[App Name] cannot be opened because Apple cannot verify it is free from malware."**

or

> **"[App Name] is damaged and can't be opened."**

This is Gatekeeper — macOS's built-in control that checks whether apps are notarised by Apple before running them.

---

## What Gatekeeper Is Doing

Every app on the Mac App Store and most apps downloaded from developer websites are "notarised" — the developer submitted them to Apple, Apple scanned them for malware, and Apple cryptographically signed off that the app is clean.

Gatekeeper checks for that signature when you open an app. If it is missing — because the app was not notarised, or because the file got flagged during download — Gatekeeper blocks it.

This does not mean the app is malware. It means Apple has not verified it. There is a difference.

---

## When It Is Safe to Open Anyway

You downloaded the app directly from the developer's official website, the developer is well-known, and the file came from a URL you typed yourself or a link from the official docs. In this case, Gatekeeper is being overly cautious and you can override it.

Examples where this is normal and expected: open-source apps, small utilities, developer tools, and apps distributed outside the App Store.

---

## How to Open It Anyway

**Method 1 — Right-click:**
Right-click the app → **Open** → click **Open** in the dialog that appears. You only need to do this once — macOS remembers your choice.

**Method 2 — System Settings:**
If the right-click method does not show the Open option, go to:
**System Settings → Privacy & Security → scroll down**

You will see a message saying "[App Name] was blocked" with an **Open Anyway** button. Click it, enter your Mac login password, and it opens.

---

## "The App Is Damaged and Can't Be Opened"

This version of the error usually means the app was quarantined — macOS tagged it as downloaded from the internet and something went wrong with the quarantine flag. Fix it in Terminal:

```bash
xattr -rd com.apple.quarantine /Applications/AppName.app
```

Replace `AppName.app` with the actual app name.

---

## When to Actually Be Careful

If you got a link to an app from a pop-up, an unexpected email, or a website you do not know — do not override Gatekeeper. In that case the warning is doing its job.

---

> **Summary:** This warning means the app was not notarised by Apple — not that it is infected. Right-click → Open to bypass it for apps you trust and downloaded from official sources.
