---
layout: default
title: "\"Your Connection Is Not Private\" — What It Actually Means"
parent: "Networking & DNS"
nav_order: 14
---

# "Your Connection Is Not Private" — What It Actually Means

When your browser shows a big red warning that says **"Your connection is not private"** or **"Your connection is not secure"**, most people immediately think their computer has been hacked or infected with a virus.

It has not.

---

## What This Warning Actually Means

Every website that uses HTTPS has an SSL certificate — a file that proves the site is who it says it is and that your connection is encrypted. Your browser checks this certificate every time you connect to a site.

The warning appears when the certificate check fails. That is it. Your computer is fine.

---

## The Most Common Reasons

**The certificate expired.** SSL certificates have an expiry date. When a website owner forgets to renew it, everyone gets this warning. Nothing is wrong with your machine — the site's certificate is just out of date.

**Self-signed certificate.** Some devices and services generate their own certificate instead of getting one from a trusted authority. Your router admin page, Proxmox, TrueNAS, and many other self-hosted services do this. Your browser has no way to verify self-signed certificates so it warns you. If you know you are connecting to your own device or a trusted internal service, clicking through is fine.

**You are on a captive portal.** Hotel WiFi, airport WiFi, university networks — when you first connect they intercept your connection to show you a login or terms page. During this interception your browser detects a certificate mismatch and shows the warning. Clicking through takes you to the login page.

**Your system clock is wrong.** SSL certificate validation depends on your device's clock being accurate. If your clock is significantly off, even a perfectly valid certificate appears expired. Fix: set your date and time to automatic.

---

## When to Proceed and When to Stop

**Safe to proceed:**
- You are connecting to your own device — home router, Proxmox, NAS, local server
- You are on a captive portal (hotel, airport, university WiFi)
- You are a developer connecting to a local test server

**Do not proceed:**
- You are on a public website you use for banking, shopping, email, or any login
- The site name in the URL looks wrong or misspelled
- You did not type the address yourself and were redirected there

---

## How to Proceed Past the Warning

**Chrome:** Click **Advanced** → **Proceed to [site] (unsafe)**

**Firefox:** Click **Advanced** → **Accept the Risk and Continue**

**Safari:** Click **Show Details** → **visit this website**

---

> **Summary:** This warning means the site's SSL certificate could not be verified — not that your computer is infected. On your own devices and internal tools it is expected and safe to click through.
