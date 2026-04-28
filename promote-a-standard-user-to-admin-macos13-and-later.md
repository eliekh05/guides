---
layout: default
title: "Promote User to Admin (macOS 13 and Later)"
parent: "System & Users"
nav_order: 2
---

# Promote a Standard User to Admin (macOS 13 and Later)

This guide explains how to grant administrator privileges to a standard user account on macOS 13 (Ventura) and later. It is useful when system groups have been removed or the account was set up without admin rights.

---

## Prerequisites

- Your Mac must be updated to the latest compatible macOS version before starting.
- You will need access to Recovery Mode.

---

## Steps

### 1 — Boot into Recovery Mode

Restart your Mac and hold **Command (⌘) + R** immediately after it powers on. When prompted, select your user account and enter your login password.

### 2 — Open Terminal from Recovery Mode

In the menu bar, go to **Utilities → Terminal**.

### 3 — Remove the Setup Done Flag

Run the following command to trigger the macOS Setup Assistant on the next boot:

```bash
cd /Volumes/Macintosh\ HD/var/db && rm .AppleSetupDone
```

If the combined command does not work, run each part separately:

```bash
cd /
cd Volumes/
cd Macintosh\ HD
cd var/db
rm .AppleSetupDone
```

### 4 — Reboot and Complete Setup

Restart your Mac. The **Setup Assistant** will launch automatically. Follow the on-screen instructions. When you reach the user creation step, create a new **Admin** account and finish setup.

### 5 — Promote Your Standard User to Admin

1. Open **System Settings**.
2. Go to **Users & Groups**.
3. Locate your **Standard User** in the list.
4. Hover over the user and click the **ⓘ** (info) button next to their name.
5. Toggle **Allow user to administer this computer** to **On**.
6. Enter your current login password to confirm.

---

🎉 **Done!** Your account now has administrator privileges on macOS 13 and later.
