---
layout: default
title: "Disable and Enable SIP (System Integrity Protection) on macOS"
parent: "Security & Apps"
nav_order: 4
---

# Disable and Enable SIP (System Integrity Protection) on macOS

SIP (System Integrity Protection) is a macOS security feature that prevents any software — including root — from modifying protected system files and folders. It is on by default and should stay on in normal use.

Some tools require it to be temporarily disabled: OCLP (OpenCore Legacy Patcher), yabai (window manager), certain kernel extensions, and some developer tools. This guide covers how to do it correctly on both Intel and Apple Silicon Macs.

> **Always re-enable SIP after you are done.** Leaving SIP off makes your Mac significantly more vulnerable.

---

## Check Current SIP Status

Before doing anything, check whether SIP is already disabled:

```bash
csrutil status
```

Output will say one of:
- `System Integrity Protection status: enabled.` — SIP is on
- `System Integrity Protection status: disabled.` — SIP is already off
- `System Integrity Protection status: unknown (Custom Configuration).` — partially disabled

---

## Disable SIP — Intel Mac

1. **Shut down** your Mac completely.
2. Press the power button and immediately hold **Command (⌘) + R**.
3. Keep holding until you see the Apple logo or a spinning globe — you are in Recovery Mode.
4. When the macOS Utilities window appears, go to **Utilities** → **Terminal** in the menu bar.
5. In Terminal, type:
   ```bash
   csrutil disable
   ```
6. Press **Enter**. You will see:
   ```
   Successfully disabled System Integrity Protection. Please restart the machine for the changes to take effect.
   ```
7. Click the Apple menu → **Restart**.

---

## Disable SIP — Apple Silicon (M1 / M2 / M3 / M4)

The process is slightly different on Apple Silicon:

1. **Shut down** your Mac completely.
2. Press and hold the **power button** until you see **"Loading startup options..."**
3. Click **Options** → **Continue**.
4. Select your user and enter your password if prompted.
5. Go to **Utilities** → **Terminal** in the menu bar.
6. In Terminal, type:
   ```bash
   csrutil disable
   ```
7. Press **Enter**.
8. Type `Y` and press **Enter** to confirm when prompted.
9. Enter your admin password.
10. Click the Apple menu → **Restart**.

---

## Re-enable SIP

The process is identical to disabling — boot into Recovery Mode and run:

```bash
csrutil enable
```

Then restart.

**This is the same steps for both Intel and Apple Silicon** — just follow the same boot process above for your chip type, but use `csrutil enable` instead.

---

## Partially Disable SIP (Advanced)

Some tools only need specific SIP protections disabled rather than all of them. For example, yabai only needs filesystem protection disabled:

```bash
csrutil enable --without fs
```

Available flags:

| Flag | What it disables |
|---|---|
| `--without fs` | Filesystem protection (allows modifying system files) |
| `--without debug` | Debugging restrictions |
| `--without nvram` | NVRAM protection |
| `--without dtrace` | DTrace restrictions |
| `--without kext` | Kernel extension restrictions |

Always check the documentation for the tool you are installing to see exactly which protection it needs disabled.

---

## What SIP Protects

When SIP is enabled, the following are fully protected from modification by any user or app:

- `/System`
- `/usr` (except `/usr/local`)
- `/bin`
- `/sbin`
- `/var`
- Pre-installed Apple apps in `/Applications`
- System kernel extensions

SIP does **not** protect your home folder (`~`), `/usr/local`, or anything in `/Applications` that you installed yourself.

---

## Common Reasons to Disable SIP

| Tool / Task | Why SIP needs to be off |
|---|---|
| OpenCore Legacy Patcher (OCLP) | Applies root patches to system volume |
| yabai window manager | Requires disabling scripting additions protection |
| Installing unsigned kexts | SIP blocks unsigned kernel extensions |
| Certain antivirus or VPN system extensions | Some require elevated system access |
| Custom font installation to system fonts | Protected path |

---

## Troubleshooting

### `csrutil: command not found`
You are not in Recovery Mode. You cannot disable SIP from a normal Terminal session — it must be done from Recovery.

### SIP re-enables after macOS update
This is expected behaviour. Some major macOS updates re-enable SIP. Check the status with `csrutil status` after each update and disable it again if needed.

### Recovery Mode does not load (shows globe or gets stuck)
Hold the power button to force shut down. Try again. If you see a spinning globe, your Mac is trying to download Recovery over the internet — wait for it or connect to Wi-Fi.

### `csrutil disable` requires a password on Apple Silicon
This is by design on Apple Silicon — you must authenticate to make security changes in Recovery Mode.
