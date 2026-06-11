---
layout: default
title: "macOS Keychain — "Wants to Use Your Confidential Information""
parent: "macOS"
nav_order: 24
---

# macOS Keychain — "Wants to Use Your Confidential Information"

When an app on your Mac shows a popup like:

> **"[App Name] wants to use your confidential information stored in "[something]" in your keychain."**

People panic. It sounds like the app is trying to steal data. It is not.

---

## What This Actually Means

Your Mac stores passwords, tokens, and credentials in a secure database called the Keychain. When an app needs to access something stored there — a saved login, an authentication token — macOS stops it and asks your permission first.

The word "confidential" is Apple's wording for anything stored in the keychain. It does not mean the app is doing something shady. It means macOS is doing its job.

The password it asks for is your **Mac login password** — the same one you use to unlock your screen. Not your email. Not an app password. Your Mac's own password.

---

## What to Do

Click **Allow** if you recognise the app name and you were just doing something that makes sense — logging in, pushing to GitHub, opening your email.

Click **Always Allow** to grant permanent access so the popup never appears for this app again. Fine for apps you trust and use regularly.

Click **Deny** if the popup shows up for no reason and the app name looks unfamiliar. Then check what is running on your Mac.

---

## Why It Keeps Appearing

- You recently **changed your Mac login password** — apps lose keychain access when the password changes and need to re-authenticate
- Your **keychain is locked** — open Keychain Access (search with Spotlight), select the login keychain, choose Keychain Access → Unlock Keychain
- The **app was reinstalled or updated** — macOS revokes automatic access after reinstalls. Click Always Allow once and it stops

---

> **Summary:** The popup wants your **Mac login password**. Click Allow if you recognise the app. This is macOS working correctly — not a breach, not an attack.
