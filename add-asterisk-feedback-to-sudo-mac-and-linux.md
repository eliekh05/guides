---
layout: default
title: "Add Asterisk Feedback to Sudo"
parent: "macOS & Linux"
nav_order: 2
---

# Add Asterisk Feedback to Sudo (Mac and Linux)

By default, `sudo` does not show any characters when you type your password. This guide enables asterisk (`*`) feedback so you can see how many characters you have typed.

**Requirements:** Ubuntu 10.04 or later, or macOS 10.8 or later.

---

## Steps

1. Open **Terminal**.

2. Run the following command to open the sudoers file safely:
   ```bash
   sudo visudo
   ```

3. Find the line that reads:
   ```
   Defaults env_reset
   ```
   Replace it with:
   ```
   Defaults env_reset,pwfeedback
   ```
   If the line does not exist, add the new line instead.

4. Save and exit the editor:
   - **Ubuntu / Linux (nano):** Press `Ctrl+X`, then `Y`, then `Enter`.
   - **macOS (vi):** Type `:wq` and press `Enter`.

Password asterisks will now appear whenever you are prompted for your `sudo` password.
