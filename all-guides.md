# macOS & Linux Guides

A collection of clear, practical guides for problems that are hard to find solutions for online.

---

## Table of Contents

### macOS & Linux

- [Sudo Password Reminder](#sudo-password-reminder)
- [Add Asterisk Feedback to Sudo (Mac and Linux)](#add-asterisk-feedback-to-sudo-mac-and-linux)
- [Change the Visudo Default Editor (Vim ↔ Nano)](#change-the-visudo-default-editor-vim--nano)
### macOS — System & Users

- [Promote a Standard User to Admin (macOS 12 and Earlier)](#promote-a-standard-user-to-admin-macos-12-and-earlier)
- [Promote a Standard User to Admin (macOS 13 and Later)](#promote-a-standard-user-to-admin-macos-13-and-later)
- [Fix Safari "Cannot Move File" Error After Download (macOS)](#fix-safari-cannot-move-file-error-after-download-macos)
### macOS — Homebrew & Package Management

- [Fix curl Errors on macOS (After Reinstalling Homebrew)](#fix-curl-errors-on-macos-after-reinstalling-homebrew)
- [Fix Homebrew / Commands Not Found After New Shell Session (macOS)](#fix-homebrew--commands-not-found-after-new-shell-session-macos)
### macOS — Security & App Issues

- [Fix "App Is Damaged and Can't Be Opened" (macOS)](#fix-app-is-damaged-and-cant-be-opened-macos)
- [Fix Mac Repeatedly Asking for Keychain "Local Items" Password (macOS)](#fix-mac-repeatedly-asking-for-keychain-local-items-password-macos)
- [Reset NVRAM and SMC on Mac (All Models)](#reset-nvram-and-smc-on-mac-all-models)
### macOS — Networking & DNS

- [Flush DNS Cache on macOS (All Versions)](#flush-dns-cache-on-macos-all-versions)
- [Fix: Internet Works But Browser Says "Server Not Found" (macOS)](#fix:-internet-works-but-browser-says-server-not-found-macos)
### macOS — Task Scheduling

- [Fix cron Jobs Not Running on macOS](#fix-cron-jobs-not-running-on-macos)
- [Fix launchd / plist Scripts Not Running on macOS](#fix-launchd--plist-scripts-not-running-on-macos)
### macOS & Linux — Shared Fixes

- [Fix SSH "Bad Permissions" / "Unprotected Private Key File" Error (macOS and Linux)](#fix-ssh-bad-permissions--unprotected-private-key-file-error-macos-and-linux)
- [Fix Broken File Permissions After Copying Between Drives (macOS and Linux)](#fix-broken-file-permissions-after-copying-between-drives-macos-and-linux)

---

---

# macOS & Linux


# Sudo Password Reminder

> **Important:** All `sudo` commands require your **Mac or Linux login password** — the same password you use to log into your computer.

Yes, this gets asked a lot. No, it is not your email password.

This is **not** your email password. It does not matter which email service you use — not Gmail, not Outlook, not Yahoo, not iCloud, not Zoho, not Proton Mail. None of them.

It is the password you type when your computer starts up or wakes from sleep. The one that unlocks your screen. That one.

If you have never set one or you are not sure what it is, check with whoever set up your machine.


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


---

# macOS — System & Users


# Promote a Standard User to Admin (macOS 12 and Earlier)

This guide explains how to grant administrator privileges to a standard user account on macOS 12 (Monterey) and earlier. It is useful when system groups have been removed or the account was set up without admin rights.

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

1. Open **System Preferences**.
2. Go to **Users & Groups**.
3. Click the padlock icon and enter your password to unlock settings.
4. Select your **Standard User** from the list.
5. Check **Allow user to administer this computer**.

---

🎉 **Done!** Your account now has administrator privileges on macOS 12 and earlier.


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


---

# macOS — Homebrew & Package Management


# Fix curl Errors on macOS (After Reinstalling Homebrew)

This guide covers how to resolve `curl`-related errors that can appear after uninstalling and reinstalling Homebrew on macOS.

> **Note:** Some of these steps take a long time to complete. Be patient and do not cancel them mid-way.

---

## Step 1 — Rebuild curl from Source

1. Clone the curl repository:
   ```bash
   git clone https://github.com/curl/curl.git && cd curl
   ```

2. Try building with CMake from the terminal:
   ```bash
   cmake .
   ```

   If this fails, continue to **Step 2** to use the CMake GUI instead.

---

## Step 2 — Build curl Using the CMake GUI (if Step 1 failed)

1. Download the official [CMake GUI for macOS](https://cmake.org/download/).
2. Move it to your **Applications** folder and open it.
3. Click **Browse Source** and navigate to the folder where you cloned the curl repository (usually in your home directory). Select it and click **Open**.
4. Click **Browse Build**, then click **Make New Folder**, name it `Build`, and select it.
5. Click **Configure** → **Next** and wait for it to finish.
   - If you see an SSL-related error, uncheck the SSL option and click **Configure** again.
6. Click **Generate**, then **Configure** once more.
7. Open Terminal, navigate to the `Build` folder you created, and run:
   ```bash
   sudo make all && sudo make install
   ```

---

## Step 3 — Fix Homebrew if curl Issues Persist

If the steps above did not resolve the problem, the issue may be with Homebrew itself.

### Navigate to the Homebrew bin directory

```bash
cd /usr/local/Homebrew/bin/
```

### Update and restore Homebrew

```bash
brew update-reset && brew update && brew bundle
# Run brew bundle from the directory where your Brewfile is saved
```

---

## Common Errors and Fixes

### HOMEBREW_CELLAR path mismatch

If you see this warning:

> *Your HOMEBREW_PREFIX is set to /usr/local but HOMEBREW_CELLAR is set to /usr/local/Homebrew/Cellar...*

Run:
```bash
echo $HOMEBREW_CELLAR
sudo mv /usr/local/Homebrew/Cellar /usr/local/Cellar
brew update && brew doctor
```

---

### Symlink error — directory not writable

If you see an error like:

> *Error: Could not symlink /usr/local/share/PACKAGE_NAME — not writable*

Run (replacing `PACKAGE_NAME` with the actual package name from the error):
```bash
sudo chown -R $(whoami) /usr/local/share/PACKAGE_NAME
brew link PACKAGE_NAME
brew bundle
# Run brew bundle from the directory where your Brewfile is saved
```

---

## Reinstall Homebrew from Scratch

If nothing above works, do a clean reinstall of Homebrew:

```bash
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install.sh)"
```

---

🎉 **Done!** Your Homebrew installation should now be working correctly.


# Fix Homebrew / Commands Not Found After New Shell Session (macOS)

After installing Homebrew or a tool via Homebrew, you may find that the command works in one Terminal window but not in a new one — or disappears entirely after a restart. This happens because the command's location is not in your **PATH**, or the file where you added it is not being loaded correctly.

---

## Why This Happens

When you open a new Terminal session on macOS, the shell reads one or more configuration files to set up your environment (including PATH). The problem is that **which file gets loaded depends on the shell and how the terminal was opened**, and these files are not interchangeable.

macOS has used **zsh** as the default shell since macOS Catalina (10.15). If you are on an older Mac or switched manually, you may still be using **bash**.

---

## Which File Should You Edit?

### If you use zsh (default on macOS Catalina and later):

| File | When it loads |
|---|---|
| `~/.zprofile` | At login (when you open a new Terminal window or tab) |
| `~/.zshrc` | Every time a new interactive shell starts |

**Rule of thumb:** Put `export PATH=...` lines in `~/.zprofile`. Put aliases and shell functions in `~/.zshrc`.

### If you use bash (macOS Mojave and earlier, or manually switched):

| File | When it loads |
|---|---|
| `~/.bash_profile` | At login |
| `~/.bashrc` | For interactive non-login shells |

**Rule of thumb:** Put `export PATH=...` lines in `~/.bash_profile`. Many people also add `source ~/.bashrc` inside `~/.bash_profile` to make both load together.

---

## Fix — Add Homebrew to Your PATH

### Apple Silicon Macs (M1, M2, M3, M4)

Homebrew installs to `/opt/homebrew/` on Apple Silicon. Add it to your PATH:

```bash
echo 'eval "$(/opt/homebrew/bin/brew shellenv)"' >> ~/.zprofile
source ~/.zprofile
```

### Intel Macs

Homebrew installs to `/usr/local/` on Intel Macs:

```bash
echo 'eval "$(/usr/local/bin/brew shellenv)"' >> ~/.zprofile
source ~/.zprofile
```

After running these commands, open a new Terminal window and test:
```bash
brew --version
```

---

## Fix — Add Any Custom Path

If you need to add a specific folder (not just Homebrew) to your PATH:

```bash
echo 'export PATH="/your/custom/path:$PATH"' >> ~/.zprofile
source ~/.zprofile
```

Replace `/your/custom/path` with the actual directory. The `:$PATH` at the end preserves all the existing paths — never leave that out.

---

## Diagnose What Is Happening

### Check your current PATH:
```bash
echo $PATH
```

### Check which shell you are using:
```bash
echo $SHELL
```

### Check if a file exists and what is in it:
```bash
cat ~/.zprofile
cat ~/.zshrc
cat ~/.bash_profile
```

### Check where a command is installed:
```bash
which brew
which python3
which node
```

If `which` returns nothing, the tool is either not installed or its folder is not in your PATH.

---

## Common Mistakes

**Putting PATH exports in the wrong file:**
Adding an `export PATH=` line to `~/.zshrc` instead of `~/.zprofile` can work but may cause unexpected behavior if the shell is launched in non-interactive mode (as `launchd` scripts do).

**Using `source` on the wrong file:**
If you edited `~/.zprofile` but ran `source ~/.zshrc`, your changes will not take effect. Always `source` the file you edited, or simply open a new Terminal window.

**Not reloading the file after editing:**
After editing any config file, either run `source ~/.zprofile` (or whichever file you edited), or open a new Terminal window. Changes do not apply to the current session automatically.

---

> **Note:** If you switched from bash to zsh (or vice versa) at some point, you may have PATH exports in both `~/.bash_profile` and `~/.zprofile` that conflict. Check both files and consolidate everything into the correct one for your current shell.


---

# macOS — Security & App Issues


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


# Reset NVRAM and SMC on Mac (All Models)

This guide covers when and how to reset **NVRAM** and **SMC** on every Mac model. Most online guides mix up the two or are outdated. The process varies significantly depending on whether your Mac uses an Intel chip, a T2 chip, or Apple Silicon (M1/M2/M3/M4).

---

## What Are NVRAM and SMC?

**NVRAM** (Non-Volatile RAM) stores user-facing settings that persist between reboots:
- Speaker volume
- Screen resolution
- Startup disk selection
- Time zone
- Kernel panic logs

Reset NVRAM when you have: wrong startup disk, display/resolution issues, audio not working, time zone resetting, or a blinking question mark at startup.

**SMC** (System Management Controller) controls low-level hardware on **Intel Macs only**:
- Fan speed and temperature management
- Battery charging
- Sleep and wake behavior
- Keyboard backlights and status LEDs
- Power button response

Reset SMC when you have: fans running at full speed for no reason, battery not charging correctly, Mac not waking from sleep, overheating under light load, or display backlight issues.

> **Apple Silicon Macs (M1/M2/M3/M4) do not have an SMC.** Those functions are handled by the chip itself. See the Apple Silicon section below.

---

## How to Find Your Mac's Chip Type

Click the **Apple menu ()**  → **About This Mac**.

- If it says **Apple M1**, **M2**, **M3**, or **M4** → you have Apple Silicon.
- If it says **Intel Core i5**, **i7**, **i9**, etc. → you have an Intel Mac.
- Intel Macs from 2018 or later also have a **T2 Security Chip**. Check [Apple's T2 Mac list](https://support.apple.com/en-us/103265) if unsure.

---

## Reset NVRAM

### Intel Macs (all Intel models, with or without T2)

1. Shut down your Mac completely.
2. Press the power button, then **immediately** hold:
   **Option (⌥) + Command (⌘) + P + R**
3. Keep holding for about **20 seconds**, or until you hear the startup chime **twice** (on Macs with a chime).
4. Release the keys and let the Mac boot normally.
5. After booting, check **System Settings** and reconfigure volume, display resolution, and time zone if needed.

### Apple Silicon Macs (M1, M2, M3, M4)

NVRAM resets automatically on every restart on Apple Silicon Macs — no key combination is needed or supported. If you are experiencing persistent issues, a normal restart is sufficient.

If you still want to force a reset via Terminal:
```bash
sudo nvram -c
```
Then restart your Mac.

---

## Reset SMC

### Apple Silicon Macs (M1, M2, M3, M4)

There is no SMC on Apple Silicon Macs. To approximate an SMC reset:

1. Shut down the Mac completely.
2. Wait **30 seconds**.
3. Press the power button to turn it back on.

### Intel MacBooks with T2 Chip (MacBook Air/Pro from 2018–2020, some 2021)

1. Shut down the Mac.
2. Press and hold the **right-side Shift key**, **left-side Control key**, and **left-side Option key** simultaneously.
3. While holding all three, also press and hold the **power button**.
4. Hold all four keys for **10 seconds**, then release everything.
5. Press the power button normally to turn the Mac back on.

### Intel MacBooks without T2 Chip (MacBook Air/Pro 2017 and earlier)

1. Shut down the Mac.
2. Press and hold **Shift (left) + Control (left) + Option (left) + Power button** simultaneously for **10 seconds**.
3. Release all keys.
4. Press the power button to turn the Mac on.

### Intel Desktop Macs (iMac, Mac mini, Mac Pro)

1. Shut down the Mac.
2. Unplug the power cable from the back of the Mac (or from the wall).
3. Wait **15 seconds**.
4. Plug the power cable back in.
5. Wait **5 seconds**, then press the power button to turn the Mac on.

---

## When to Reset Which

| Symptom | Reset NVRAM | Reset SMC |
|---|---|---|
| Wrong startup disk | ✅ | |
| Display resolution issues | ✅ | |
| Time zone keeps resetting | ✅ | |
| Audio not working | ✅ | |
| Blinking question mark at boot | ✅ | |
| Fans running at full speed | | ✅ |
| Battery not charging | | ✅ |
| Mac won't wake from sleep | | ✅ |
| Overheating under light load | | ✅ |
| Keyboard backlight not working | | ✅ |
| Mac randomly shuts down | | ✅ |

> Resetting either is safe and will not delete your files, apps, or personal data.


---

# macOS — Networking & DNS


# Flush DNS Cache on macOS (All Versions)

The DNS flush command changes with almost every major macOS release. Most guides online are outdated — you run the command, nothing happens, and you assume it did not work. This guide lists the correct command for every macOS version in one place.

Flushing the DNS cache fixes issues like:
- Websites not loading after a DNS change
- Old IP addresses being cached for a domain
- Browser showing a site that no longer exists at that address
- Intermittent "Server Not Found" errors

---

## How to Flush DNS

1. Open **Terminal** (Applications → Utilities → Terminal).
2. Find your macOS version below and run the matching command.
3. Enter your login password when prompted (nothing will appear as you type).
4. You will see a confirmation message or the prompt will simply return.

---

## Commands by macOS Version

### macOS 15 (Sequoia) and macOS 14 (Sonoma)
```bash
sudo dscacheutil -flushcache; sudo killall -HUP mDNSResponder
```

### macOS 13 (Ventura)
```bash
sudo dscacheutil -flushcache; sudo killall -HUP mDNSResponder
```

### macOS 12 (Monterey)
```bash
sudo dscacheutil -flushcache; sudo killall -HUP mDNSResponder
```

### macOS 11 (Big Sur)
```bash
sudo dscacheutil -flushcache; sudo killall -HUP mDNSResponder
```

### macOS 10.15 (Catalina)
```bash
sudo dscacheutil -flushcache; sudo killall -HUP mDNSResponder
```

### macOS 10.14 (Mojave)
```bash
sudo dscacheutil -flushcache; sudo killall -HUP mDNSResponder
```

### macOS 10.13 (High Sierra)
```bash
sudo killall -HUP mDNSResponder
```

### macOS 10.12 (Sierra)
```bash
sudo killall -HUP mDNSResponder
```

### macOS 10.11 (El Capitan)
```bash
sudo dscacheutil -flushcache; sudo killall -HUP mDNSResponder
```

### macOS 10.10 (Yosemite)
```bash
sudo discoveryutil mdnsflushcache; sudo discoveryutil udnsflushcaches
```

### macOS 10.9 (Mavericks) and earlier
```bash
sudo dscacheutil -flushcache
```

---

## How to Find Your macOS Version

Click the **Apple menu ()** → **About This Mac**. The version name and number are shown at the top.

---

## What These Commands Do

| Command | What it does |
|---|---|
| `dscacheutil -flushcache` | Clears the DNS client cache |
| `killall -HUP mDNSResponder` | Restarts the mDNSResponder service, which handles DNS resolution |

Running both together (separated by `;`) ensures both the cache and the service are reset. On some versions only one is needed, but running both is always safe.

---

> **Note:** After flushing, close and reopen your browser. Browsers maintain their own DNS cache separately from macOS, and a browser restart is needed for the flush to fully take effect. In Chrome, you can also navigate to `chrome://net-internals/#dns` and click **Clear host cache**.


# Fix: Internet Works But Browser Says "Server Not Found" (macOS)

If apps like Mail, Spotify, or the App Store work fine, but your browser shows "Server Not Found", "This site can't be reached", or similar errors — your internet connection is fine. The problem is with **DNS** (the system that translates domain names like `google.com` into IP addresses).

---

## Step 1 — Flush the DNS Cache

The most common cause is a stale or corrupted DNS cache. Run the following in Terminal:

```bash
sudo dscacheutil -flushcache; sudo killall -HUP mDNSResponder
```

Enter your login password when prompted. Then **restart your browser** (not just a new tab — quit and reopen it).

If that does not fix it, continue to the steps below.

---

## Step 2 — Clear the Browser's Own DNS Cache

Browsers cache DNS entries independently of macOS. Even after flushing the system cache, the browser may still use its own stale records.

**Chrome / Brave / Edge:**
1. In the address bar, go to: `chrome://net-internals/#dns`
2. Click **Clear host cache**.
3. Then go to: `chrome://net-internals/#sockets`
4. Click **Flush socket pools**.

**Firefox:**
1. In the address bar, go to: `about:networking#dns`
2. Click **Clear DNS Cache**.

**Safari:**
Safari uses the system DNS cache. Flushing the macOS cache (Step 1) is sufficient. You can also go to **Develop** → **Empty Caches** in the menu bar. If the Develop menu is not visible, enable it in **Safari Settings** → **Advanced** → **Show Develop menu**.

---

## Step 3 — Change Your DNS Server

Your ISP's DNS server may be slow or unresponsive. Switching to a public DNS server often resolves persistent issues.

1. Open **System Settings** → **Network**.
2. Select your active connection (Wi-Fi or Ethernet) and click **Details**.
3. Go to the **DNS** tab.
4. Click **+** and add one of the following:

**Cloudflare (fast, privacy-focused):**
```
1.1.1.1
1.0.0.1
```

**Google:**
```
8.8.8.8
8.8.4.4
```

5. Remove any existing DNS entries that are not working (select them and click **−**).
6. Click **OK**, then flush the DNS cache again (Step 1) and test your browser.

---

## Step 4 — Restart mDNSResponder

`mDNSResponder` is the macOS service that handles DNS lookups. Restarting it can clear issues that a cache flush alone does not fix:

```bash
sudo killall -HUP mDNSResponder
```

---

## Step 5 — Check for a Proxy or VPN Conflict

A misconfigured proxy or VPN can intercept DNS requests and cause browser-only failures.

1. Open **System Settings** → **Network** → **Details** (for your active connection) → **Proxies**.
2. Make sure **no proxy settings are enabled** unless you intentionally use one.
3. If you use a VPN, try disconnecting it and testing your browser again.

---

## Step 6 — Renew Your DHCP Lease

Your IP address and DNS assignment from your router may be stale.

1. Open **System Settings** → **Network**.
2. Select your active connection and click **Details**.
3. Go to the **TCP/IP** tab.
4. Click **Renew DHCP Lease**.
5. Wait a few seconds and test your browser.

---

## Quick Checklist

| Check | Command / Location |
|---|---|
| Flush DNS cache | `sudo dscacheutil -flushcache; sudo killall -HUP mDNSResponder` |
| Clear browser DNS cache | `chrome://net-internals/#dns` or Firefox `about:networking#dns` |
| Change DNS server | System Settings → Network → Details → DNS |
| Restart mDNSResponder | `sudo killall -HUP mDNSResponder` |
| Disable proxy | System Settings → Network → Details → Proxies |
| Renew DHCP lease | System Settings → Network → Details → TCP/IP |

---

> **Note:** If none of the above works, try a different browser to confirm the issue is not specific to one app. If the second browser also fails, the problem is at the system level. Try restarting your router and modem, then repeat the steps above.


---

# macOS — Task Scheduling


# Fix cron Jobs Not Running on macOS

`cron` is a classic Unix tool for scheduling tasks. It still exists on macOS but has several limitations that cause jobs to silently fail. This guide explains why, and gives you working solutions.

---

## Why cron Jobs Fail on macOS

### 1. The Mac was asleep
`cron` requires the system to be awake at the exact scheduled time. If your Mac is asleep, the job is **skipped entirely** — it does not run when the Mac wakes up.

### 2. No PATH or shell environment
Just like `launchd`, `cron` runs with a minimal environment. Commands like `brew`, `python3`, or scripts that rely on your `.zshrc` setup will fail with "command not found".

### 3. Full Disk Access not granted
Since macOS Catalina, `cron` (and the `crontab` process) needs Full Disk Access to read or write to protected folders. Without it, jobs that touch files in Desktop, Documents, Downloads, etc. will fail silently.

### 4. cron is not recommended by Apple
Apple officially deprecated `cron` in favor of `launchd`. While `cron` still works for simple tasks, it will never run missed jobs after a sleep, does not integrate with macOS power management, and gets no active development.

---

## Fix 1 — Use Full Paths in Your cron Commands

Replace every command with its full path:

```bash
# Wrong — may fail in cron
0 9 * * * brew update

# Correct
0 9 * * * /opt/homebrew/bin/brew update       # Apple Silicon
0 9 * * * /usr/local/bin/brew update          # Intel Mac
```

To find the full path of any command:
```bash
which brew
which python3
which node
```

---

## Fix 2 — Grant Full Disk Access to cron

1. Open **System Settings** → **Privacy & Security** → **Full Disk Access**.
2. Click the **+** button.
3. Press **Command (⌘) + Shift + G** to open the Go to Folder dialog.
4. Type `/usr/sbin/` and press Enter.
5. Select **cron** and click **Open**.
6. Make sure the toggle next to `cron` is **on**.

---

## Fix 3 — Add a Shell and PATH to Your crontab

At the top of your crontab, explicitly define the shell and PATH:

```bash
SHELL=/bin/zsh
PATH=/opt/homebrew/bin:/usr/local/bin:/usr/bin:/bin:/usr/sbin:/sbin

# Your jobs below
0 9 * * * /path/to/your/script.sh
```

Open your crontab to edit it:
```bash
crontab -e
```

---

## Fix 4 — Add Logging to See What Is Failing

Redirect output to a log file so you can see what is happening:

```bash
0 9 * * * /path/to/script.sh >> /tmp/myjob.log 2>&1
```

- `>>` appends output to the log file
- `2>&1` redirects error messages to the same log

After the scheduled time, check the log:
```bash
cat /tmp/myjob.log
```

---

## Fix 5 — Switch to launchd for Reliable Scheduling

If your job must run even after the Mac wakes from sleep, use `launchd` instead of `cron`. `launchd` is macOS-native, integrates with power management, and can run missed jobs on wake.

Create a plist file at `~/Library/LaunchAgents/com.yourname.yourjob.plist`:

```xml
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN"
  "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
    <key>Label</key>
    <string>com.yourname.yourjob</string>

    <key>EnvironmentVariables</key>
    <dict>
        <key>PATH</key>
        <string>/opt/homebrew/bin:/usr/local/bin:/usr/bin:/bin:/usr/sbin:/sbin</string>
    </dict>

    <key>ProgramArguments</key>
    <array>
        <string>/bin/zsh</string>
        <string>/Users/yourname/scripts/yourscript.zsh</string>
    </array>

    <key>StartCalendarInterval</key>
    <dict>
        <key>Hour</key>
        <integer>9</integer>
        <key>Minute</key>
        <integer>0</integer>
    </dict>

    <key>StandardOutPath</key>
    <string>/tmp/yourjob.log</string>
    <key>StandardErrorPath</key>
    <string>/tmp/yourjob-error.log</string>
</dict>
</plist>
```

Load it:
```bash
launchctl load ~/Library/LaunchAgents/com.yourname.yourjob.plist
```

See the companion guide **"Fix launchd / plist Scripts Not Running (macOS)"** for more detail on launchd troubleshooting.

---

## cron vs launchd — Quick Comparison

| Feature | cron | launchd |
|---|---|---|
| Runs missed jobs after sleep | ❌ No | ✅ Yes |
| Loads PATH automatically | ❌ No | ❌ No (must set manually) |
| GUI tools available | Some | Lingon X |
| Apple recommended | ❌ Deprecated | ✅ Yes |
| Easy to set up quickly | ✅ Yes | ❌ More verbose |

For simple one-off tests, `cron` is fine. For anything that needs to run reliably on a Mac, use `launchd`.


# Fix launchd / plist Scripts Not Running on macOS

`launchd` is macOS's built-in task scheduler — the replacement for `cron`. It is used to run scripts automatically on a schedule or at login. However, it is notoriously difficult to get working because it runs in a completely different environment from your Terminal. Scripts that work perfectly in Terminal often fail silently under `launchd` for reasons that are hard to diagnose.

This guide explains why this happens and how to fix it.

**Requirements:** macOS 10.10 (Yosemite) or later.

---

## Why launchd Scripts Fail Silently

There are three main reasons a script that works in Terminal will fail under `launchd`:

1. **No PATH** — `launchd` does not load your shell's PATH. Commands like `brew`, `python3`, `node`, or any tool installed in `/usr/local/bin` or `/opt/homebrew/bin` are not found unless you specify their full path.

2. **No shell environment** — `launchd` does not source your `.zshrc`, `.zprofile`, or `.bash_profile`. Environment variables you set there are not available.

3. **No disk access** — since macOS Catalina, scripts launched by `launchd` are blocked from accessing protected folders (Desktop, Documents, Downloads, etc.) unless the terminal or interpreter has been granted Full Disk Access.

---

## Fix 1 — Use Full Paths for Every Command

In your script, replace every command with its full path. Do not rely on PATH being set.

To find the full path of any command, run in Terminal:
```bash
which brew
which python3
which node
```

Then in your script, replace:
```bash
brew update
```
With:
```bash
/opt/homebrew/bin/brew update   # Apple Silicon Mac
# or
/usr/local/bin/brew update      # Intel Mac
```

**Common full paths:**

| Command | Apple Silicon | Intel Mac |
|---|---|---|
| `brew` | `/opt/homebrew/bin/brew` | `/usr/local/bin/brew` |
| `python3` | `/opt/homebrew/bin/python3` | `/usr/local/bin/python3` |
| `node` | `/opt/homebrew/bin/node` | `/usr/local/bin/node` |
| `git` | `/usr/bin/git` | `/usr/bin/git` |
| `rsync` | `/usr/bin/rsync` | `/usr/bin/rsync` |

---

## Fix 2 — Set PATH Inside the plist

You can define environment variables directly in your plist file so `launchd` has them available:

```xml
<key>EnvironmentVariables</key>
<dict>
    <key>PATH</key>
    <string>/opt/homebrew/bin:/usr/local/bin:/usr/bin:/bin:/usr/sbin:/sbin</string>
</dict>
```

Add this block inside the main `<dict>` of your plist, alongside your `Label` and `ProgramArguments`.

---

## Fix 3 — Grant Full Disk Access to Terminal (or bash/zsh)

If your script accesses protected folders (Desktop, Documents, Downloads, Pictures), you need to give the shell interpreter Full Disk Access.

1. Open **System Settings** → **Privacy & Security** → **Full Disk Access**.
2. Click the **+** button.
3. Navigate to `/bin/` and add **zsh** (or **bash** if your script uses bash).
4. Make sure the toggle next to it is **on**.

> **Note:** This gives Full Disk Access to ALL scripts run by that shell, not just yours. Only do this if you trust the scripts running on your machine.

Alternatively, wrap your shell script in an **Automator app** and give the Automator app Full Disk Access instead. This limits the access to one specific automation.

---

## Fix 4 — Add Logging to Diagnose the Problem

`launchd` gives no error output by default. Add log output to your plist to capture what is going wrong:

```xml
<key>StandardOutPath</key>
<string>/tmp/my-script.log</string>
<key>StandardErrorPath</key>
<string>/tmp/my-script-error.log</string>
```

After your script runs (or fails to run), check the logs:
```bash
cat /tmp/my-script.log
cat /tmp/my-script-error.log
```

Any errors — including "command not found" — will appear there.

---

## Fix 5 — Load and Verify the plist

After creating or editing a plist in `~/Library/LaunchAgents/`, load it with:

```bash
launchctl load ~/Library/LaunchAgents/com.yourname.yourscript.plist
```

To check if it loaded successfully:
```bash
launchctl list | grep com.yourname.yourscript
```

The output shows three columns: PID, exit code, and label. An exit code of `0` means it ran successfully. Any other number indicates an error — check your log files.

To unload and reload after making changes:
```bash
launchctl unload ~/Library/LaunchAgents/com.yourname.yourscript.plist
launchctl load ~/Library/LaunchAgents/com.yourname.yourscript.plist
```

---

## Example plist With All Fixes Applied

```xml
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN"
  "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
    <key>Label</key>
    <string>com.yourname.yourscript</string>

    <key>EnvironmentVariables</key>
    <dict>
        <key>PATH</key>
        <string>/opt/homebrew/bin:/usr/local/bin:/usr/bin:/bin:/usr/sbin:/sbin</string>
    </dict>

    <key>ProgramArguments</key>
    <array>
        <string>/bin/zsh</string>
        <string>/Users/yourname/scripts/yourscript.zsh</string>
    </array>

    <key>StartCalendarInterval</key>
    <dict>
        <key>Hour</key>
        <integer>9</integer>
        <key>Minute</key>
        <integer>0</integer>
    </dict>

    <key>StandardOutPath</key>
    <string>/tmp/yourscript.log</string>
    <key>StandardErrorPath</key>
    <string>/tmp/yourscript-error.log</string>

    <key>RunAtLoad</key>
    <false/>
</dict>
</plist>
```

Replace `yourname` and `yourscript` with your actual username and script name.

---

> **Tip:** The free app **Lingon X** provides a GUI for creating and managing launchd plists, which can make initial setup easier before you understand the XML format.


---

# macOS & Linux — Shared Fixes


# Fix SSH "Bad Permissions" / "Unprotected Private Key File" Error (macOS and Linux)

When connecting via SSH, you may see an error like:

```
@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
@         WARNING: UNPROTECTED PRIVATE KEY FILE!          @
@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
Permissions 0644 for '/Users/yourname/.ssh/id_rsa' are too open.
It is required that your private key files are NOT accessible by others.
This private key will be ignored.
```

SSH refuses to use your key because **other users on the system can read it**. This is a deliberate security feature: if your private key were readable by anyone, it would defeat the purpose of key-based authentication.

---

## Why This Happens

SSH enforces strict permission requirements on key files and the `.ssh` folder. The error usually occurs after:
- Copying keys from another machine
- Restoring from a backup
- Cloning a repo that included keys
- Creating the `.ssh` folder manually without setting permissions

---

## The Fix — Set Correct Permissions

Run these three commands in Terminal. They set the permissions that SSH requires.

```bash
chmod 700 ~/.ssh
chmod 600 ~/.ssh/id_rsa
chmod 644 ~/.ssh/id_rsa.pub
```

If your key has a different name (e.g., `id_ed25519` or `my_server_key`), replace `id_rsa` with your actual key file name.

---

## What These Permissions Mean

SSH has exact requirements for each file and folder. Here is what is required and why:

| Path | Required Permission | Numeric Code | Meaning |
|---|---|---|---|
| `~/.ssh/` (the folder) | `drwx------` | `700` | Only you can read, write, and enter the folder |
| `~/.ssh/id_rsa` (private key) | `-rw-------` | `600` | Only you can read and write the file — no one else can read it |
| `~/.ssh/id_rsa.pub` (public key) | `-rw-r--r--` | `644` | You can read and write; others can read (this is safe — it is meant to be shared) |
| `~/.ssh/authorized_keys` | `-rw-------` | `600` | Same as the private key — only you |
| `~/.ssh/config` | `-rw-------` | `600` | Only you |
| `~/.ssh/known_hosts` | `-rw-r--r--` | `644` | You can write; others can read |

---

## How to Read Permission Numbers

Each permission number is made up of three digits: **owner**, **group**, **others**.

Each digit is a sum of: **4** (read) + **2** (write) + **1** (execute).

Examples:
- `700` = owner: rwx (4+2+1=7), group: none (0), others: none (0)
- `600` = owner: rw (4+2=6), group: none (0), others: none (0)
- `644` = owner: rw (4+2=6), group: r (4), others: r (4)

---

## Verify Your Permissions

After running the fix, confirm everything is set correctly:

```bash
ls -la ~/.ssh
```

The output should look like this:

```
drwx------   yourname  .ssh/
-rw-------   yourname  id_rsa
-rw-r--r--   yourname  id_rsa.pub
-rw-------   yourname  authorized_keys
-rw-r--r--   yourname  known_hosts
```

---

## Fix Ownership Too (If Needed)

If you copied files from another user or machine, the files might be owned by the wrong user. SSH also rejects keys it does not own:

```bash
chown -R $(whoami) ~/.ssh
```

This sets you as the owner of the `.ssh` folder and everything inside it.

---

> **Note:** These permission rules apply equally on macOS and Linux. On Windows using WSL, the same rules apply inside the WSL environment.


# Fix Broken File Permissions After Copying Between Drives (macOS and Linux)

When you copy files between drives — especially from NTFS or exFAT to APFS or HFS+ — files can end up with wrong permissions, missing execute bits, or corrupted extended attributes. This makes files read-only, scripts non-executable, or apps that refuse to launch.

---

## Why This Happens

Different file systems handle permissions and metadata differently:

| File System | Permissions | Extended Attributes (xattr) |
|---|---|---|
| APFS / HFS+ (Mac) | ✅ Full Unix permissions | ✅ Supported |
| ext4 (Linux) | ✅ Full Unix permissions | ✅ Supported |
| exFAT | ❌ No Unix permissions | ❌ Not supported |
| NTFS (Windows) | Different permission model | Partially supported |
| FAT32 | ❌ No Unix permissions | ❌ Not supported |

When files from exFAT or FAT32 land on APFS, macOS assigns default permissions that may not match what the files need. Extended attributes (invisible metadata used by macOS for things like Gatekeeper quarantine flags, Finder tags, and resource forks) are also lost.

---

## Fix 1 — Restore Execute Permission on Scripts

If shell scripts or binaries no longer run after copying, they have lost their execute bit:

```bash
chmod +x /path/to/script.sh
```

To fix an entire folder of scripts recursively:
```bash
chmod -R +x /path/to/folder/
```

> **Use with care on folders containing mixed content.** This gives execute permission to every file, including data files that do not need it. For a more targeted approach, use Fix 2.

---

## Fix 2 — Restore Permissions to a Specific Pattern

To restore execute permission only on `.sh` files inside a folder:
```bash
find /path/to/folder -name "*.sh" -exec chmod +x {} \;
```

To fix only directories (so you can navigate into them):
```bash
find /path/to/folder -type d -exec chmod 755 {} \;
```

To fix only regular files (not directories):
```bash
find /path/to/folder -type f -exec chmod 644 {} \;
```

---

## Fix 3 — Restore Ownership

If files were copied as root or from another user account, they may be owned by the wrong user. Your account will not be able to edit them:

```bash
sudo chown -R $(whoami) /path/to/folder
```

This sets you as the owner of the folder and everything inside it.

---

## Fix 4 — Remove Quarantine Attributes Added During Copy

macOS sometimes applies quarantine attributes to files copied from external drives, even if they are not downloads. This can cause apps to be blocked:

```bash
xattr -r -d com.apple.quarantine /path/to/app.app
```

To check what extended attributes are on a file:
```bash
xattr -l /path/to/file
```

To remove all extended attributes from a file (use with caution):
```bash
xattr -c /path/to/file
```

---

## Fix 5 — Use `rsync` Instead of Finder for Copying

The Finder copy does not preserve Unix permissions when copying to or from exFAT or NTFS. Using `rsync` with the right flags preserves permissions, timestamps, and symbolic links:

```bash
rsync -av --progress /source/folder/ /destination/folder/
```

| Flag | What it does |
|---|---|
| `-a` | Archive mode: preserves permissions, timestamps, symlinks, and ownership |
| `-v` | Verbose: shows what is being copied |
| `--progress` | Shows progress for large files |

> **Note:** `rsync -a` can only preserve permissions if the destination file system supports them. Copying to exFAT or FAT32 will still lose permissions regardless of the tool used.

---

## Fix 6 — Run Disk Utility First Aid (macOS)

If permissions are broken system-wide (not just on copied files), the volume itself may have errors:

1. Open **Disk Utility** (Applications → Utilities → Disk Utility).
2. Select your drive from the left sidebar.
3. Click **First Aid** → **Run**.
4. Let it complete and check for errors.

---

## Quick Reference

| Problem | Command |
|---|---|
| Script won't run (no execute bit) | `chmod +x /path/to/script.sh` |
| Entire folder not executable | `chmod -R +x /path/to/folder/` |
| Files owned by wrong user | `sudo chown -R $(whoami) /path/to/folder` |
| App blocked by quarantine flag | `xattr -r -d com.apple.quarantine /path/to/app.app` |
| Check what attributes a file has | `xattr -l /path/to/file` |
| Copy with permissions preserved | `rsync -av /source/ /destination/` |

---

> **Note:** If you regularly transfer files between Windows (NTFS) and Mac (APFS), consider using a tool like **Paragon NTFS** or **Tuxera NTFS** which provides better interoperability than macOS's built-in read-only NTFS support.

