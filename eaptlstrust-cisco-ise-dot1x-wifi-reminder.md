---
layout: default
title: "EAP-TLS Trust Prompt — Cisco ISE and 802.1X Wi-Fi"
parent: "Networking & DNS"
nav_order: 8
---

# EAP-TLS Trust Prompt — Cisco ISE and 802.1X Wi-Fi

When connecting to a university or company Wi-Fi network that uses **802.1X authentication with Cisco ISE**, you will see multiple prompts asking to trust a certificate or enter credentials. This happens constantly — after password changes, OS updates, certificate renewals, and sometimes for no obvious reason.

Yes, this gets asked a lot. No, it is not your email password.

---

## What Is Actually Happening

Your university or company network does not use a simple Wi-Fi password that anyone can use. Instead it uses **802.1X** — a protocol that authenticates you as an individual. **Cisco ISE** (Identity Services Engine) is the server on your organisation's side that decides who is allowed on the network.

When you connect, three things happen in order:
1. Your device and the ISE server verify each other's identity using certificates
2. You enter your credentials (username and password) so ISE can confirm who you are
3. ISE grants or denies access based on your account

---

## The Three Prompts You Will See on macOS

### Prompt 1 — Username and Password (Wi-Fi Credentials)

When you first click the network name in Wi-Fi settings, a prompt appears asking for a **username and password**.

This is asking for the **credentials your IT department gave you when you registered on the system** — your network account, not your personal email or Mac login. It is the same account you use to log into the student or staff portal, the university or company email system, or any other internal system.

It is **not**:
- Your personal Gmail, iCloud, or any personal email
- Your Mac login password
- Your phone PIN

If you do not know these credentials, contact IT — they were provided when your account was created on the system.

### Prompt 2 — "Verify Certificate" dialog

After entering your credentials, a window titled **"Verify Certificate"** or **"Authenticating to network..."** appears showing:
- The RADIUS/ISE server's hostname (something like `ise.yourdomain.com` or `radius.yourorg.edu`)
- The certificate chain — Root CA → Intermediate CA → Server certificate
- A green **"This certificate is valid"** badge if the certificate is not expired

You will see a checkbox: **"Always trust [server name]"**

**What to do:**
1. Check the server hostname belongs to your organisation — it should contain your university or company domain
2. Confirm the certificate shows **"This certificate is valid"** in green
3. Check **"Always trust"** to avoid seeing this again until the certificate renews
4. Click **Continue**

### Prompt 3 — "eaptlstrust" password prompt

Immediately after clicking Continue, a second smaller prompt appears with:
- The title **`eaptlstrust`**
- Text: *"You are making changes to your Certificate Trust Settings. Enter your password to allow this."*
- Your Mac username already filled in
- A password field
- An **"Update Settings"** button

**This is asking for your Mac login password** — the one you use to unlock your screen or log into your Mac itself. Not your network account. Not your email. Your Mac's own password.

After the certificate trust dialog, macOS needs to update the keychain certificate trust settings — that operation requires your Mac login password to authorise the change.

Enter your Mac login password and click **Update Settings**. The connection completes and you are on the network.

---

## Why It Keeps Asking

macOS forgets the trust decision in several situations:
- After a macOS update
- After the ISE server's certificate is renewed (usually annually)
- After IT pushes a new network configuration to your device
- After you removed and re-added the Wi-Fi network

**Fix for persistent prompts:**

1. Open **Keychain Access** (search with Spotlight).
2. Search for the certificate name shown in the trust prompt.
3. Double-click it → expand **Trust** → set **When using this certificate** to **Always Trust**.
4. Enter your Mac login password to confirm.

If it keeps asking even after trusting, forget the network and reconnect from scratch:
**System Settings** → **Network** → **Wi-Fi** → **Details** → **Forget This Network**, then reconnect.

> **If EAP-TLS still fails silently after reconnecting:** The client certificate must be in the **System keychain**, not the Login keychain. Open Keychain Access, find the certificate, and if it is under **login**, drag it to **System**. EAP-TLS authentication happens before you log in — the login keychain is locked at that point and the certificate is invisible to the supplicant.

---

## Windows

Windows usually handles 802.1X automatically on domain-joined machines. On a personal Windows device:

1. When prompted, enter your **network username** in the format `DOMAIN\username` or `username@yourdomain.com` — the IT-provided account, not your personal Microsoft account.
2. When asked to trust the server certificate, click **Connect** — Windows saves this automatically.

If it keeps prompting after every reboot, the ISE CA certificate is missing from your trusted store. Contact IT — they need to push it via Group Policy or provide the certificate file to import manually.

---

## Linux

Linux requires manual setup. When connecting via NetworkManager (GNOME/KDE):

1. Click the network icon → select the network name.
2. In the authentication dialog set:
   - **Security:** WPA & WPA2 Enterprise
   - **Authentication:** PEAP
   - **Inner authentication:** MSCHAPv2
   - **CA Certificate:** the certificate file from IT, or **No CA certificate** if you do not have it
   - **Username / Password:** your IT-provided network account credentials
3. Click **Connect**.

---

## If Nothing Works — Contact IT

802.1X is controlled server-side. If correct credentials still fail, the cause is almost always one of:

- Your account is locked or has expired
- Your device needs to be registered with IT before it is allowed on
- A new certificate was issued and your device has the old one
- **Clock skew** — EAP-TLS silently fails if your device's clock is significantly off from the server's. Set date and time to automatic
- **`12521 EAP-TLS failed SSL/TLS handshake`** in ISE logs — the ISE server's CA is not trusted by your device. IT needs to push the CA certificate to you

No amount of retrying fixes any of these — contact IT support.

---

> **Summary:** Three prompts, three different passwords. The Wi-Fi username and password prompt wants your **IT-provided network account credentials**. The "Verify Certificate" prompt is confirming the server is legitimate — check it, trust it, click Continue. The `eaptlstrust` prompt wants your **Mac login password** to save the trust decision to the keychain.