---
layout: default
title: "Mac Won't Boot — What Each Startup Symbol Means"
parent: "System & Users"
nav_order: 7
---

# Mac Won't Boot — What Each Startup Symbol Means

When a Mac fails to boot, it shows a symbol instead of starting up normally. Each symbol means something completely different — what you do next depends entirely on which one you see. This guide covers every startup symbol and the correct fix for each.

---

## 🔲 Black Screen (Nothing at All)

The Mac appears completely off — no Apple logo, no chime, no fan noise.

**Possible causes:** Power issue, display issue, SMC problem.

**Fixes in order:**
1. Hold the power button for 10 seconds to force off. Wait 30 seconds. Press power once.
2. Check the power cable and adapter — try a different outlet or cable.
3. Connect to an external monitor (HDMI or USB-C to HDMI). If the external works, the built-in display has a fault.
4. Reset the SMC — see the **Reset NVRAM and SMC** guide.
5. If nothing works, the Mac may need hardware repair.

---

## 🍎 Stuck on Apple Logo (No Progress Bar)

The Apple logo appears but the Mac never gets past it, with no loading bar underneath.

**Possible causes:** Corrupted system files, startup disk error, incompatible kernel extension.

**Fixes in order:**
1. **Wait** — the first boot after a macOS update can take 10–20 minutes. Give it time.
2. **Safe Mode** — boot with only essential system files:
   - **Intel Mac:** Hold **Shift** at startup until you see the login screen.
   - **Apple Silicon:** Hold power, select your startup disk, hold **Shift**, click **Continue in Safe Mode**.
   - If it boots in Safe Mode, a third-party app or extension is the culprit. Remove recently installed software.
3. **Run First Aid** — boot into Recovery Mode (see below), open Disk Utility, select your drive, and click **First Aid**.
4. **Reinstall macOS** from Recovery Mode (does not delete your files).

---

## 📁 Flashing Folder with Question Mark

A folder icon with a flashing question mark appears at startup.

**Meaning:** The Mac cannot find a bootable operating system. The startup disk is missing, damaged, or not selected.

**Fixes in order:**
1. **Wait** — sometimes this appears briefly before finding the disk. If it boots normally after a few seconds, the issue was temporary.
2. **Reset NVRAM** — the startup disk selection may be corrupted. Reset NVRAM (hold **Option + Command + P + R** at startup on Intel, or just restart on Apple Silicon — NVRAM resets automatically).
3. **Select startup disk manually** — boot into Recovery Mode, go to **Startup Disk**, and select your main drive.
4. **Run Disk Utility First Aid** in Recovery Mode — the drive may have errors.
5. **Reinstall macOS** if First Aid finds errors it cannot fix.
6. **Drive hardware failure** — if none of the above work, the SSD/HDD may have died.

---

## 🚫 Circle with a Diagonal Line (Prohibitory Symbol)

A grey or black circle with a line through it (like a no-entry sign).

**Meaning:** macOS found a startup disk but cannot boot from it — usually because the OS on it is incompatible with this Mac (too old or too new for the hardware), or the OS is severely corrupted.

**Common cause:** This often happens after restoring a backup from a different Mac model, or installing an incompatible macOS version.

**Fixes in order:**
1. **Boot into Recovery Mode** and reinstall macOS — this replaces the OS without deleting your data.
2. **Select a different startup disk** from Recovery — if you have another bootable volume, try that.
3. **Erase and reinstall** if Recovery cannot fix the existing installation.

---

## 🌐 Spinning Globe

A spinning globe appears instead of the Apple logo.

**Meaning:** The Mac cannot find a local startup disk and is trying to boot from **Internet Recovery** — downloading a recovery environment from Apple's servers over Wi-Fi.

**This is not necessarily a failure** — if your Mac is booting from Internet Recovery intentionally (you erased the drive or the recovery partition is gone), the globe is expected. Connect to Wi-Fi when prompted.

**If the globe appears unexpectedly:**
1. Connect to Wi-Fi as prompted — Internet Recovery needs internet to continue.
2. If Wi-Fi does not appear, the Mac may not be detecting the startup disk. Run Disk Utility once Internet Recovery loads.
3. If you see a **globe with an exclamation mark (⚠️)**, Internet Recovery failed — usually a network issue. Try a different Wi-Fi network or use Ethernet.

---

## ❗ Exclamation Mark in a Circle

A circle with an exclamation mark, sometimes with `support.apple.com/mac/startup` shown below.

**Meaning:** The Mac detected a critical firmware or system issue during startup.

**What to do:**
1. Note any error code shown on screen (starts with `-` followed by numbers, like `-2005F`).
2. Restart and try again — sometimes this clears on a second boot.
3. Run Apple Diagnostics to check hardware: hold **D** at startup (Intel) or hold power until startup options then hold **Command + D** (Apple Silicon).
4. If it persists, visit [apple.com/support](https://apple.com/support) with the error code.

---

## ⚙️ Gear Icon with "Options" Text

Shows your startup volumes with an Options gear icon.

**Meaning:** You are in **Startup Manager** — this is intentional. You held Option at startup, or the Mac cannot find a default startup disk and is asking you to choose.

**What to do:**
1. Select your startup disk (usually **Macintosh HD**) and press Enter.
2. If the correct disk is not listed, it has a problem — see the Flashing Folder section above.
3. If you want to set a permanent default, go into Recovery → Startup Disk and select it.

---

## 🔒 Lock Icon

A padlock appears at startup.

**Meaning:** A firmware password is set on this Mac. You cannot boot from any external device or change startup settings without it.

**What to do:**
1. Enter the firmware password — if you do not know it, the Mac was likely previously owned or managed by an organisation.
2. If you are the owner and forgot it, you need to contact Apple Support with proof of purchase — this cannot be bypassed without Apple's help on modern Macs.

---

## How to Enter Recovery Mode

You will need Recovery Mode to fix most of the above issues.

**Intel Mac:**
Restart and immediately hold **Command (⌘) + R** until the Apple logo appears.

**Apple Silicon (M1/M2/M3/M4):**
Shut down completely. Press and hold the **power button** until you see **"Loading startup options"**. Click **Options** → **Continue**.

From Recovery Mode you can access: Disk Utility, Reinstall macOS, Terminal, Startup Disk settings.

---

## Quick Reference

| Symbol | Meaning | First Fix |
|---|---|---|
| Black screen | Power or display issue | Force restart, check power |
| Stuck Apple logo | System file or extension issue | Safe Mode, then First Aid |
| Flashing folder + ? | No bootable OS found | Reset NVRAM, then Recovery |
| Circle with slash | Incompatible or corrupt OS | Reinstall macOS in Recovery |
| Spinning globe | Booting from Internet Recovery | Connect to Wi-Fi |
| Globe + exclamation | Internet Recovery failed | Different network or Ethernet |
| Exclamation in circle | Critical firmware issue | Apple Diagnostics |
| Gear + Options | Startup Manager | Select your disk |
| Lock icon | Firmware password set | Enter password or contact Apple |