---
layout: default
title: "Convert a DMG to ISO Using Terminal (macOS)"
parent: "macOS & Linux"
nav_order: 7
---

# Convert a DMG to ISO Using Terminal (macOS)

DMG is Apple's native disk image format. Windows and Linux cannot use DMG files directly — they need ISO format. This guide shows how to convert a DMG to an ISO using only the built-in macOS Terminal, no third-party tools required.

This is also the method used to create a bootable ISO from a macOS installer app — for use in VMware, VirtualBox, or UTM.

---

## Convert a DMG to ISO

Open **Terminal** and run the following two commands.

### Step 1 — Convert DMG to CDR

```bash
hdiutil convert /path/to/yourfile.dmg -format UDTO -o ~/Desktop/yourfile
```

- Replace `/path/to/yourfile.dmg` with the actual path to your DMG file.
- The `-format UDTO` flag converts it to a CD/DVD master format (`.cdr`).
- The output will be saved to your Desktop as `yourfile.cdr`.

> **Tip:** You can drag and drop the DMG file from Finder into the Terminal window instead of typing the path manually.

### Step 2 — Rename CDR to ISO

```bash
mv ~/Desktop/yourfile.cdr ~/Desktop/yourfile.iso
```

The `.cdr` and `.iso` formats are identical — renaming the extension is all that is needed. The file is now a standard ISO that Windows and Linux can use.

---

## Convert a macOS Installer App to ISO

This is the method used to create a bootable macOS ISO for virtual machines. Replace `Sequoia` and the app name with your macOS version.

```bash
# Step 1 — Create a blank DMG to write the installer into
hdiutil create -o /tmp/Sequoia -size 18500m -volname "Install macOS Sequoia" -layout SPUD -fs HFS+J

# Step 2 — Mount the blank DMG
hdiutil attach /tmp/Sequoia.dmg -noverify -mountpoint /Volumes/InstallMacOSSequoia

# Step 3 — Write the macOS installer to the mounted DMG
sudo /Applications/Install\ macOS\ Sequoia.app/Contents/Resources/createinstallmedia \
  --volume /Volumes/InstallMacOSSequoia --nointeraction

# Step 4 — Unmount the DMG
hdiutil detach /Volumes/Install\ macOS\ Sequoia

# Step 5 — Convert to ISO
hdiutil convert /tmp/Sequoia.dmg -format UDTO -o ~/Desktop/Sequoia

# Step 6 — Rename to .iso
mv ~/Desktop/Sequoia.cdr ~/Desktop/Sequoia.iso
```

The finished `Sequoia.iso` on your Desktop can be used with VMware, VirtualBox, UTM, or copied to a Windows or Linux machine.

---

## Convert ISO back to DMG (Reverse)

If you need to go the other direction — ISO to DMG:

```bash
hdiutil convert /path/to/yourfile.iso -format UDRW -o ~/Desktop/yourfile.dmg
```

---

## Common Errors

### "hdiutil: convert failed - image/device is too large"
Increase the `-size` value in Step 1. For macOS Sequoia use at least `16384m` (16 GB). For older macOS versions, `8192m` (8 GB) is usually enough.

### "could not access /Volumes/InstallMacOSSequoia - No such file or directory"
The blank DMG did not mount correctly. Run `hdiutil attach /tmp/Sequoia.dmg` manually and check what mount point it used with `ls /Volumes/`.

### "Install macOS Sequoia.app not found"
The installer app is not in your Applications folder. Download it first via the App Store or `softwareupdate --fetch-full-installer`.

### Permission denied
Add `sudo` before the `createinstallmedia` command if not already there.

---

> **Note:** The entire conversion process (Steps 1–6 for a macOS installer ISO) takes 5–15 minutes depending on your Mac's speed and the macOS version size. The final ISO will be around 13–16 GB for Sequoia.
