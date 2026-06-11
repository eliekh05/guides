---
layout: default
title: "Fix Keychain Local Items Password Prompt"
parent: "Security & Apps"
nav_order: 2
---

# Fix Mac Repeatedly Asking for Keychain "Local Items" Password (macOS)

If your Mac keeps showing a popup asking for the **"Local Items"** keychain password — especially after a macOS update — the keychain cache has likely become corrupted. This is a known issue and not a sign of a security problem.

**Requirements:** macOS 10.11 (El Capitan) or later.

---

## Why This Happens

macOS stores passwords and credentials in a system called **Keychain**. The "Local Items" keychain is a special encrypted keychain tied to your user account. After a macOS update or a password change, the cache for this keychain can go out of sync, causing the repeated password prompt — even if you enter the correct password.

---

## Fix 1 — Clear the Keychain Cache via Terminal (Recommended First Step)

1. Open **Terminal** (Applications → Utilities → Terminal).

2. Run the following command to navigate to the Keychains folder:
   ```bash
   cd ~/Library/Keychains
   ```

3. List the contents:
   ```bash
   ls
   ```

4. You will see a folder with a long random name made of letters and numbers (e.g., `A1B2C3D4-1234-ABCD-5678-EF90GH12IJ34`). Navigate into it:
   ```bash
   cd A1B2C3D4-1234-ABCD-5678-EF90GH12IJ34
   ```
   Replace the folder name with the one you see on your Mac.

5. Delete the local keychain cache files:
   ```bash
   rm -f LocalItems.db LocalItems.db-shm LocalItems.db-wal
   ```

6. Restart your Mac.

macOS will recreate these files automatically on next login. The repeated password prompt should stop.

---

## Fix 2 — Reset the Default Keychain via Keychain Access

> **Warning:** This will remove saved passwords from your login keychain. Make sure iCloud Keychain is enabled first so your passwords are backed up, or note any important passwords before proceeding.

1. Open **Keychain Access** (Applications → Utilities → Keychain Access, or search with Spotlight).

2. In the menu bar, go to **Keychain Access** → **Preferences** (or **Settings** on macOS Ventura and later).

3. Click **Reset My Default Keychains**.

4. Enter your account login password when prompted and click **OK**.

5. Log out and log back in.

Your login keychain will be recreated fresh and synced with your current password.

---

## Fix 3 — Re-sync the Keychain Password After a Password Change

If you recently changed your Mac login password, the keychain may still be using the old one.

1. When you see the "Local Items" password prompt, try entering your **old password** (the one before the change).
2. If that works, macOS will offer to update the keychain password. Accept and enter your new password.

If you cannot remember the old password, use Fix 2 above to reset the keychain entirely.

---

> **Note:** If the prompt continues after all fixes, try booting in Safe Mode (hold **Shift** at startup) and logging in once. This can clear additional caches that normal booting does not.
