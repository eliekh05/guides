---
layout: default
title: "Fix No Audio / Sound Not Working on Linux (PipeWire)"
parent: "macOS & Linux"
nav_order: 10
---

# Fix No Audio / Sound Not Working on Linux (PipeWire)

PipeWire is the default audio server on Ubuntu 22.10+, Debian 13, Fedora 34+, and most modern Linux distros. Most audio troubleshooting guides online still reference PulseAudio which is outdated and does not apply to current systems. This guide is for PipeWire.

---

## Step 1 — Check What Audio System You Are Running

```bash
pactl info | grep "Server Name"
```

Output will be one of:
- `Server Name: PulseAudio (on PipeWire x.x.x)` — you are on PipeWire (correct for modern systems)
- `Server Name: pulseaudio` — you are on pure PulseAudio (older install)

If you are on PipeWire, continue with this guide. If on PulseAudio, the fixes are the same but substitute `systemctl --user restart pulseaudio` where this guide says restart PipeWire.

---

## Step 2 — Check If PipeWire Services Are Running

```bash
systemctl --user status pipewire pipewire-pulse wireplumber
```

All three should show `active (running)`. If any show `failed` or `inactive`:

```bash
systemctl --user restart pipewire pipewire-pulse wireplumber
```

Then test audio again. If this fixes it but the problem returns on next login, enable the services to start automatically:

```bash
systemctl --user enable pipewire pipewire-pulse wireplumber
```

---

## Step 3 — Check If a Device Is Being Detected

```bash
wpctl status
```

Under **Audio → Sinks**, you should see your audio output device listed. If the list is empty or only shows `Dummy Output`, your audio hardware is not being detected.

Also check:
```bash
aplay -l
```

This lists all ALSA-detected sound cards. If nothing appears here, the issue is at the hardware/driver level, not PipeWire.

---

## Step 4 — Check Volume and Mute Status

```bash
wpctl get-volume @DEFAULT_AUDIO_SINK@
```

If it shows `MUTED`, unmute:
```bash
wpctl set-mute @DEFAULT_AUDIO_SINK@ 0
```

Set volume to 100%:
```bash
wpctl set-volume @DEFAULT_AUDIO_SINK@ 1.0
```

You can also use `pavucontrol` (PulseAudio Volume Control — works with PipeWire) for a GUI:
```bash
sudo apt install pavucontrol -y
pavucontrol
```

In pavucontrol, check the **Output Devices** tab — make sure nothing is muted and the correct device is set as default.

---

## Step 5 — Set the Correct Default Output Device

If you have multiple audio devices (HDMI, headphones, USB DAC), PipeWire may be outputting to the wrong one.

List available sinks:
```bash
pactl list short sinks
```

Set the default to the correct one (replace `alsa_output.pci-0000_00_1f.3.analog-stereo` with your actual sink name):
```bash
pactl set-default-sink alsa_output.pci-0000_00_1f.3.analog-stereo
```

Or use `wpctl`:
```bash
wpctl set-default SINK_ID_NUMBER
```

Get the sink ID number from `wpctl status`.

---

## Fix — No Sound After Installing PipeWire (Ubuntu 22.04)

Ubuntu 22.04 ships with PulseAudio by default but PipeWire is available. If you installed PipeWire manually and audio broke:

```bash
# Install the full PipeWire audio stack
sudo apt install pipewire pipewire-audio pipewire-pulse pipewire-alsa \
  libspa-0.2-bluetooth wireplumber -y

# Disable PulseAudio
systemctl --user disable pulseaudio.service pulseaudio.socket
systemctl --user mask pulseaudio.service pulseaudio.socket
systemctl --user stop pulseaudio.service pulseaudio.socket

# Enable PipeWire
systemctl --user enable pipewire pipewire-pulse wireplumber
systemctl --user start pipewire pipewire-pulse wireplumber

# Verify
pactl info | grep "Server Name"
```

Log out and back in. Audio should now work through PipeWire.

---

## Fix — Bluetooth Audio Not Working

Bluetooth audio needs an extra package:

```bash
sudo apt install libspa-0.2-bluetooth -y
sudo systemctl restart bluetooth
systemctl --user restart wireplumber
```

If Bluetooth audio connects but sounds terrible (mono, low quality):
```bash
# Check which codec is being used
pactl list cards | grep -A 20 "bluetooth"
```

High quality codecs (aptX, LDAC, AAC) require:
```bash
sudo apt install libspa-0.2-bluetooth pipewire-audio -y
```

Then reconnect the Bluetooth device — it should now negotiate a better codec.

---

## Fix — Audio Crackling or Distortion

Crackling is usually a sample rate mismatch or buffer issue.

Check the current sample rate:
```bash
pw-cli info all | grep "clock.rate"
```

To force 48000Hz (most common fix):
```bash
mkdir -p ~/.config/pipewire
cp /usr/share/pipewire/pipewire.conf ~/.config/pipewire/
nano ~/.config/pipewire/pipewire.conf
```

Find `default.clock.rate` and set it to `48000`. Save and restart:
```bash
systemctl --user restart pipewire pipewire-pulse wireplumber
```

---

## Fix — HDMI Audio Not Working

```bash
# List all HDMI sinks
pactl list short sinks | grep hdmi

# Set HDMI as default
pactl set-default-sink alsa_output.pci-XXXX.hdmi-stereo
```

If no HDMI sinks appear, the GPU driver may not be exposing the HDMI audio device. Check:
```bash
aplay -l | grep HDMI
```

If it appears in `aplay` but not in PipeWire, restart PipeWire:
```bash
systemctl --user restart pipewire wireplumber
```

---

## Check Logs for Errors

```bash
journalctl --user -u pipewire --since "10 minutes ago"
journalctl --user -u wireplumber -f
```

Look for lines containing `error` or `failed` — these often point directly to the problem.

---

## Quick Reference

| Problem | Fix |
|---|---|
| No sound at all | Step 2 — restart PipeWire services |
| No devices detected | Step 3 — check `wpctl status` and `aplay -l` |
| Sound muted | Step 4 — `wpctl set-mute @DEFAULT_AUDIO_SINK@ 0` |
| Wrong output device | Step 5 — set default sink |
| Bluetooth bad quality | Install `libspa-0.2-bluetooth`, reconnect |
| Crackling/distortion | Set `default.clock.rate = 48000` |
| HDMI no audio | Restart PipeWire, check `aplay -l` |
