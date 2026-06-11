---
layout: default
title: "Fix Safari Cannot Move File After Download"
parent: "System & Users"
nav_order: 3
---

# Fix Safari "Cannot Move File" Error After Download (macOS)

If Safari shows an error saying it cannot move a file after downloading, the issue is usually that your **Downloads folder does not have full Read & Write access** for all users.

---

## Steps

1. Open **Finder** and navigate to your **Downloads** folder (usually in your home folder or the sidebar).

2. **Right-click** the Downloads folder and select **Get Info** (or select it and press **Command (⌘) + I**).

3. Scroll down to the **Sharing & Permissions** section at the bottom. Click the **arrow** to expand it if it is collapsed.

4. Click the **padlock icon** and enter your login password to unlock changes.

5. Click the **+** (Add) button to add users:
   - Go to **Users & Groups** and add **all users** listed there, one by one.

6. Once all users are in the list, set each one's permission to **Read & Write**.

7. Click the **gear icon (⚙)** at the bottom of the Sharing & Permissions section and select **Apply to Enclosed Items...** to make sure subfolders and files inside Downloads also get updated.

8. Close the Get Info window and try downloading again in Safari.

---

> **Note:** This is required because Safari moves the downloaded file from a temporary location into your Downloads folder. If it lacks write permission, the move fails.

🎉 **Done!** Safari should now be able to save downloaded files without errors.
