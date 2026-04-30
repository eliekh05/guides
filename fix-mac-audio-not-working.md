---
layout: default
title: "Fix Mac Audio Not Working"
parent: "System & Users"
nav_order: 11
---

# Fix Mac Audio Not Working on macOS

Mac audio stops working more often than it should — usually after a sleep cycle, an app crash, or a macOS update. Most cases are fixed in under a minute without restarting.

---

## Fix 1 — Restart the Audio Process (Fixes 90% of Cases)

macOS runs audio through a process called `coreaudiod`. Killing it forces it to restart cleanly:

```bash
sudo killall coreaudiod
```

Enter your password when prompted. Audio will cut out for a second and come back. Test immediately.

If that does not work, also restart the related process:
```bash
sudo killall -9 coreaudiod
sudo launchctl stop com.apple.audio.coreaudiod
sudo launchctl start com.apple.audio.coreaudiod
```

---

## Fix 2 — Check Output Device Selection

macOS sometimes switches to a phantom or wrong output device automatically, especially after connecting Bluetooth headphones or an external monitor with speakers.

1. Click the **Control Centre** icon (top right menu bar) → **Sound**.
2. Under **Output**, make sure the correct device is selected — internal speakers, your headphones, or your external device.
3. If the right device is selected but there is still no sound, click on it anyway to re-select it — this forces macOS to reinitialise the connection.

You can also go to **System Settings** → **Sound** → **Output** and check the volume slider is not at zero and the Mute checkbox is not checked.

---

## Fix 3 — Unplug and Re-plug Audio Devices

If you are using external speakers, a DAC, a USB audio interface, or headphones via an adapter:

1. Unplug the device completely.
2. Wait 5 seconds.
3. Plug it back in.
4. Go to **System Settings** → **Sound** → **Output** and select the device again.

macOS sometimes loses track of USB and Bluetooth audio devices after sleep — replugging forces it to re-enumerate the device.

---

## Fix 4 — Reset Core Audio via Terminal (Full Reset)

If Fix 1 did not work, try a full audio subsystem reset:

```bash
sudo launchctl unload /System/Library/LaunchDaemons/com.apple.audio.coreaudiod.plist
sudo launchctl load /System/Library/LaunchDaemons/com.apple.audio.coreaudiod.plist
```

---

## Fix 5 — Delete Audio Preference Files (Clears Corrupted Config)

Corrupted audio preferences can prevent sound from working even after restarting coreaudiod.

1. Open **Finder**.
2. Press **Command + Shift + G** and navigate to:
   ```
   ~/Library/Preferences/
   ```
3. Look for and delete these files if they exist:
   - `com.apple.audio.DeviceSettings.plist`
   - `com.apple.audio.InfoHelper.plist`
   - `com.apple.coreaudio.plist`
4. Restart your Mac. macOS will recreate these files with fresh defaults.

---

## Fix 6 — Reset NVRAM

NVRAM stores audio-related settings like volume level and output device. Resetting it clears corrupted audio configuration that survives restarts.

See the **Reset NVRAM and SMC** guide for full instructions. For audio issues, resetting NVRAM alone (without SMC) is usually sufficient.

After an NVRAM reset, check **System Settings** → **Sound** and reconfigure your preferred output device.

---

## Fix 7 — Check for Sample Rate Mismatch

If audio plays but sounds distorted, robotic, or at the wrong pitch, there may be a sample rate conflict between your app and the output device.

1. Open **Audio MIDI Setup** (search with Spotlight).
2. Select your output device in the left panel.
3. Check the **Format** setting — the sample rate (e.g. 44100 Hz, 48000 Hz, 96000 Hz).
4. If it does not match what your music app or interface expects, change it here.

Most Mac audio issues with external DACs and interfaces are caused by a sample rate mismatch.

---

## Fix 8 — macOS Update Broke Audio

After some macOS updates, the audio kext (kernel extension) needs to be reloaded. Restart your Mac completely — a full restart (not just logging out) reloads all kernel extensions.

If audio was working before an update and is broken after, also check:
- **System Settings** → **Privacy & Security** → **Microphone** — make sure your audio apps still have permission
- Check if a third-party audio driver (Focusrite, Universal Audio, etc.) needs to be updated for the new macOS version

---

## Quick Reference

| Symptom | Fix |
|---|---|
| No sound from any app | Fix 1 — `sudo killall coreaudiod` |
| Wrong output device | Fix 2 — check System Settings → Sound |
| USB/Bluetooth audio gone after sleep | Fix 3 — unplug and replug |
| Sound cuts out randomly | Fix 5 — delete preference files |
| Audio worked then stopped after macOS update | Fix 8 — full restart, update drivers |
| Distorted or robotic sound | Fix 7 — check sample rate in Audio MIDI Setup |
| Nothing works | Fix 6 — reset NVRAM |
