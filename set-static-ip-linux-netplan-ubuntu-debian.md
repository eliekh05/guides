---
layout: default
title: "Set a Static IP on Linux Using Netplan (Ubuntu/Debian)"
parent: "Networking & DNS"
nav_order: 4
---

# Set a Static IP on Linux Using Netplan (Ubuntu/Debian)

Netplan is the default network configuration tool on Ubuntu 20.04 and later, and Debian 12 (Trixie) and later. It uses YAML files that are notoriously unforgiving — one wrong space breaks everything silently, and most guides get the syntax slightly wrong. This guide has the exact correct syntax.

> **Remote server warning:** If you are configuring a server you access via SSH, a wrong network config will lock you out. Always have physical or console access ready before applying network changes on a remote machine.

---

## Find Your Network Interface Name

Before editing anything, find the exact name of your network interface:

```bash
ip a
```

Look for:
- **Ethernet:** usually `eth0`, `enp3s0`, `enp0s3`, or similar (`en` prefix)
- **Wi-Fi:** usually `wlan0`, `wlp2s0`, or similar (`wl` prefix)

Note the exact name — you will use it in the config file.

---

## Find Your Current Network Details

If the machine is currently connected via DHCP, note the current values:

```bash
ip a show enp3s0        # Replace with your interface name
ip route show
cat /etc/resolv.conf
```

Note:
- Current IP and prefix (e.g. `192.168.1.45/24`)
- Gateway (the `default via` line, e.g. `192.168.1.1`)
- DNS servers from `/etc/resolv.conf`

---

## Step 1 — Find the Netplan Config File

Netplan config files live in `/etc/netplan/`. List them:

```bash
ls /etc/netplan/
```

You will see one file, usually named something like:
- `00-installer-config.yaml`
- `01-netcfg.yaml`
- `50-cloud-init.yaml`

Open it to see the current config:

```bash
cat /etc/netplan/00-installer-config.yaml
```

---

## Step 2 — Back Up the Current Config

Always back up before editing:

```bash
sudo cp /etc/netplan/00-installer-config.yaml /etc/netplan/00-installer-config.yaml.bak
```

---

## Step 3 — Edit the Config File

Open the file with nano:

```bash
sudo nano /etc/netplan/00-installer-config.yaml
```

### Static IP for Ethernet (most common — servers, Proxmox, etc.)

Replace the entire contents with:

```yaml
network:
  version: 2
  renderer: networkd
  ethernets:
    enp3s0:
      dhcp4: no
      addresses:
        - 192.168.1.10/24
      routes:
        - to: default
          via: 192.168.1.1
      nameservers:
        addresses:
          - 1.1.1.1
          - 8.8.8.8
```

Replace:
- `enp3s0` with your actual interface name
- `192.168.1.10/24` with your chosen static IP and subnet prefix
- `192.168.1.1` with your gateway (router IP)

### Static IP for Wi-Fi

```yaml
network:
  version: 2
  renderer: NetworkManager
  wifis:
    wlp2s0:
      dhcp4: no
      access-points:
        "YOUR_WIFI_NAME":
          password: "YOUR_WIFI_PASSWORD"
      addresses:
        - 192.168.1.10/24
      routes:
        - to: default
          via: 192.168.1.1
      nameservers:
        addresses:
          - 1.1.1.1
          - 8.8.8.8
```

Replace `wlp2s0` with your Wi-Fi interface name, and fill in your Wi-Fi credentials.

### DHCP (to revert back to automatic IP)

```yaml
network:
  version: 2
  renderer: networkd
  ethernets:
    enp3s0:
      dhcp4: yes
```

---

## YAML Indentation Rules (Critical)

Netplan will silently fail or throw cryptic errors if indentation is wrong. Rules:

- **Use spaces, never tabs**
- Each level of nesting is **2 spaces**
- The file must start with `network:` at column 0 with no leading spaces
- Keys and values are case-sensitive

A single wrong space = config not applied, often with no useful error message.

---

## Step 4 — Validate the Config Before Applying

Always validate first — this catches syntax errors before they disconnect you:

```bash
sudo netplan try
```

This applies the config temporarily for 120 seconds. If you do not confirm within that time, it automatically reverts. If nothing breaks:

```bash
sudo netplan apply
```

Or do both in one step:

```bash
sudo netplan generate && sudo netplan apply
```

---

## Step 5 — Verify It Worked

Check the new IP:

```bash
ip a show enp3s0
```

Test internet access:

```bash
ping -c 4 1.1.1.1
ping -c 4 google.com
```

If the first ping works but the second does not, DNS is misconfigured. Check your `nameservers` section.

---

## Troubleshooting

### `sudo netplan apply` — no output, but IP did not change
The config file was not read. Check:
1. The filename ends in `.yaml` not `.yml`
2. The interface name matches exactly (`ip a` to confirm)
3. Run `sudo netplan generate` first and check for errors

### `Invalid YAML` error
A tab character snuck in, or indentation is off. Open the file in nano, press **Ctrl+C** to show line numbers, and carefully check each line's spacing. Run:
```bash
cat -A /etc/netplan/00-installer-config.yaml
```
Any `^I` in the output is a tab — replace with spaces.

### Config applies but internet does not work
The gateway IP is wrong. Run `ip route show` on a working machine on the same network to find the correct gateway.

### `Permission denied` when editing
You forgot `sudo`. Always edit with `sudo nano` or `sudo vim`.

### SSH connection dropped after applying
The IP changed and your SSH client is still connecting to the old IP. Reconnect using the new static IP.

### Multiple `.yaml` files in `/etc/netplan/`
Files are applied in alphabetical order. If there are two files configuring the same interface, the second one wins. Remove or rename any that you are not actively using.
