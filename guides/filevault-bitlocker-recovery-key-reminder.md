---
layout: default
title: "FileVault / BitLocker Recovery Key Prompt — What It Means"
parent: "macOS"
nav_order: 28
---

# FileVault / BitLocker Recovery Key Prompt — What It Means

After a macOS update, a hardware change, or sometimes for no obvious reason, your Mac shows a screen at startup asking for a **FileVault recovery key**. On Windows the same thing happens with **BitLocker**.

Most people have no idea what this key is or where it went.

---

## What Is a Recovery Key

FileVault (macOS) and BitLocker (Windows) are full-disk encryption — everything on your drive is encrypted so nobody can read your files without authenticating. The recovery key is a long alphanumeric code generated when encryption was first turned on. It is a backup way to unlock the drive if the normal login method fails.

---

## Why It Is Asking

**macOS / FileVault reasons:**
- A macOS major version update
- You changed your Apple ID password and the Secure Token association broke
- You added or removed a user account
- Hardware was replaced — new logic board, new SSD
- Too many failed login attempts

**Windows / BitLocker reasons:**
- A BIOS/UEFI firmware update
- Hardware change — new CPU, RAM, or motherboard
- TPM chip encountered an error
- Secure Boot settings changed

---

## Where to Find the Recovery Key

**macOS FileVault:**
If you saved it to your Apple ID when FileVault was set up:
1. Go to [iforgot.apple.com](https://iforgot.apple.com) from another device
2. Sign in with your Apple ID
3. Follow the steps to retrieve the FileVault recovery key

If you saved it as a printed or written key — find that paper. Apple Support cannot recover it for you if you do not have it.

**Windows BitLocker:**
- If the device is joined to a Microsoft account: go to [account.microsoft.com/devices/recoverykey](https://account.microsoft.com/devices/recoverykey)
- If it is work/school managed: contact your IT department — they have the key
- If you saved it to a USB or printed it: find that

---

## If You Cannot Find the Key

If you cannot find the FileVault recovery key and cannot log in normally, the drive cannot be unlocked. This is by design — the encryption is working as intended. The only option is to erase the drive and reinstall macOS, losing all data that was not backed up.

This is why backing up with Time Machine before updates matters.

---

## Prevent This From Happening Again

Save the recovery key somewhere you will actually find it. A password manager, a printed paper in a safe, iCloud — whatever you will reliably have access to when the screen appears and you cannot log into anything.

---

> **Summary:** The recovery key is a backup code for your encrypted drive. Find it in your Apple ID account at iforgot.apple.com (macOS) or account.microsoft.com (Windows). If you cannot find it, the drive cannot be unlocked without erasing it.
