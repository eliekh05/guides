---
layout: default
title: "Share Internet Connection from Mac to Another Device"
parent: "Networking & DNS"
nav_order: 7
---

# Share Internet Connection from Mac to Another Device

macOS has a built-in Internet Sharing feature that turns your Mac into a router — useful when you have Ethernet but need to give WiFi to a device that has none, or when you need to share a VPN connection.

---

## Common Use Cases

- Mac is connected via Ethernet, you want to share WiFi to a phone or another laptop
- Mac is connected to a VPN, you want another device to use that VPN without configuring it separately
- Testing a device on an isolated network

---

## Step 1 — Open Internet Sharing

1. **System Settings** → **General** → **Sharing**.
2. Click **Internet Sharing** (do not toggle it yet — configure first).

---

## Step 2 — Configure What to Share

- **Share your connection from:** Select your internet source — usually **Ethernet** (if plugged in) or **Wi-Fi** (if sharing to a USB or Thunderbolt device).
- **To computers using:** Check **Wi-Fi** to create a hotspot other devices can join.

### Set a Wi-Fi Password (Recommended)

Click **Wi-Fi Options**:
- **Network Name:** give it a name
- **Security:** WPA2 Personal
- **Password:** set a password

---

## Step 3 — Enable Internet Sharing

Toggle **Internet Sharing** to **On**. Confirm in the dialog.

A Wi-Fi hotspot with your chosen name will appear on other devices. Connect to it and you are done.

---

## Share via USB (iPhone or iPad)

If you want to share internet to an iPhone/iPad via USB (useful if the device has no Wi-Fi):

1. Connect the device via USB.
2. In **To computers using**, check **iPhone USB** or **iPad USB**.
3. Toggle Internet Sharing on.

---

## Share via Thunderbolt Bridge (Mac to Mac)

To share internet from one Mac to another via a Thunderbolt cable:

1. Connect both Macs with a Thunderbolt cable.
2. On the Mac with internet, set **To computers using** → **Thunderbolt Bridge**.
3. Enable Internet Sharing.

---

## Troubleshooting

### Other devices connect but have no internet
- Make sure the Mac itself has internet before sharing
- Try disabling and re-enabling Internet Sharing
- Check if a VPN on the Mac is blocking outbound traffic

### Cannot enable Internet Sharing (greyed out)
- You cannot share the same interface you are receiving from — for example, you cannot share Wi-Fi via Wi-Fi on older Macs. Use Ethernet to receive and Wi-Fi to share, or vice versa.
- macOS Ventura and later support sharing Wi-Fi via Wi-Fi on Macs with compatible chips.

### Hotspot disappears after Mac sleeps
Internet Sharing disables when the Mac sleeps. Prevent sleep in **System Settings** → **Battery** → **Options** → set **Prevent automatic sleeping when the display is off** to on.
