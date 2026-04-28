# Change the Visudo Default Editor (Vim ↔ Nano)

`visudo` opens the sudoers file using a default text editor. This guide shows how to switch that editor between **vi** and **nano**.

**Requirements:** Ubuntu 10.04 or later, or macOS 10.8 or later.

---

## Steps

1. Open **Terminal**.

2. Run the following command to open the sudoers file safely:
   ```bash
   sudo visudo
   ```

3. Find the line that sets the editor. It will look like one of these:
   ```
   Defaults editor=/usr/bin/vi
   Defaults editor=/usr/bin/nano
   ```

   - To switch **to nano**, change it to:
     ```
     Defaults editor=/usr/bin/nano
     ```
   - To switch **to vi**, change it to:
     ```
     Defaults editor=/usr/bin/vi
     ```

   If neither line exists, add your preferred one.

4. Save and exit the editor:
   - **Ubuntu / Linux (nano):** Press `Ctrl+X`, then `Y`, then `Enter`.
   - **macOS (vi):** Type `:wq` and press `Enter`.

The next time you run `sudo visudo`, it will open with your chosen editor.
