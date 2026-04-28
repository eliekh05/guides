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
