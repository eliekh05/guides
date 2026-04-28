# Fix "App Is Damaged and Can't Be Opened" (macOS)

This error does **not** mean the app is actually broken. macOS has a security system called **Gatekeeper** that blocks apps downloaded from outside the App Store. When it cannot verify the app's origin, it refuses to open it and shows this message.

**Requirements:** macOS 10.15 (Catalina) or later.

---

## Why This Happens

When you download a file from the internet, macOS silently attaches an invisible tag called a **quarantine attribute** (`com.apple.quarantine`) to it. This tag tells Gatekeeper to check the app before allowing it to run. If the app is not notarized by Apple or comes from an unrecognized developer, Gatekeeper blocks it entirely.

> **Only do this for apps you trust and downloaded from a known, legitimate source.**

---

## Fix 1 — Right-Click to Open (Quickest)

This works for most cases and does not require Terminal.

1. Do **not** double-click the app. Instead, **right-click** (or Control-click) the app icon.
2. Select **Open** from the menu.
3. A new dialog will appear with an **Open** button. Click it.
4. The app will open and macOS will remember your choice.

If this does not work, continue to Fix 2.

---

## Fix 2 — Remove the Quarantine Attribute via Terminal

1. Open **Terminal** (Applications → Utilities → Terminal).

2. Type the following command but **do not press Enter yet**:
   ```bash
   xattr -r -d com.apple.quarantine
   ```

3. Add a space after the command, then **drag and drop the app** from Finder directly into the Terminal window. This fills in the correct path automatically.

4. The final command will look something like this:
   ```bash
   xattr -r -d com.apple.quarantine /Applications/AppName.app
   ```

5. Press **Enter**. No confirmation message will appear — that is normal.

6. Try opening the app again.

---

## Fix 3 — Allow the App in Privacy & Security Settings (macOS Ventura and Later)

After a blocked launch attempt, macOS sometimes shows an option to approve the app manually.

1. Open **System Settings** → **Privacy & Security**.
2. Scroll down to the **Security** section.
3. You should see a message like *"AppName was blocked from use because it is not from an identified developer."*
4. Click **Open Anyway** and enter your login password.

---

## What the Flags Mean

| Flag | What it does |
|---|---|
| `-r` | Applies the command recursively to all files inside the app bundle |
| `-d` | Deletes the specified attribute |
| `com.apple.quarantine` | The attribute name Gatekeeper uses to track downloaded files |

---

> **Note:** If the app continues to fail after these steps, the file may genuinely be corrupted. Delete it and re-download it from the official source.
