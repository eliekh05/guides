---
layout: default
title: "Install Home Assistant OS (HAOS) — All Methods, All Systems"
parent: "Installation Guides"
nav_order: 15
---

# Install Home Assistant OS (HAOS) — All Methods, All Systems

Every HAOS guide online covers one method for one device and gets half the steps wrong. This guide covers every supported installation method in one place — Raspberry Pi, generic x86 PC, Proxmox VM, and Docker — with the real errors people run into and exactly how to fix them.

> **Current version:** HAOS 17.2 (May 2026). Always check [github.com/home-assistant/operating-system/releases](https://github.com/home-assistant/operating-system/releases) for the latest version number before downloading — replace any version number in this guide with the latest.

---

## Important: What Is Supported in 2026

As of Home Assistant 2025.12, only two installation methods are officially supported:

| Method | What it is | Add-ons | Recommended |
|---|---|---|---|
| **Home Assistant OS (HAOS)** | Purpose-built OS, manages everything | ✅ Yes | ✅ Yes — for everyone |
| **Home Assistant Container** | Docker container, HA Core only | ❌ No | For advanced Docker users |
| ~~Home Assistant Core~~ | Python environment | ❌ | ❌ Deprecated 2025.12 |
| ~~Home Assistant Supervised~~ | Your OS + Supervisor | ❌ | ❌ Deprecated 2025.12 |

**If you want add-ons** (Mosquitto, Node-RED, Zigbee2MQTT, etc.) — use **HAOS**. Container does not include add-ons.

---

## Hardware Requirements

| Resource | Minimum | Recommended |
|---|---|---|
| CPU | 64-bit (amd64 or aarch64) | 2+ cores |
| RAM | 2 GB | 4 GB+ |
| Storage | 32 GB | 64 GB+ SSD (never SD card long-term) |
| Network | Ethernet | Ethernet (Wi-Fi works but is less stable) |

> ⚠️ **Do not use SD cards for production.** SD cards wear out from constant database writes — most HAOS failures are caused by a dead SD card. Use an SSD or NVMe drive. On Raspberry Pi, boot from USB SSD.

> **32-bit systems are no longer supported.** Since HAOS 17.0 (May 2025), armv7 (Raspberry Pi 2/3/4 32-bit), ODROID-XU4, and ASUS Tinker Board are not supported. If you are on these devices, you have received no updates since 17.0 — migrate to a 64-bit device.

---

## Method 1 — Raspberry Pi (4 or 5)

### What You Need
- Raspberry Pi 4 (2 GB RAM minimum, 4 GB+ recommended) or Raspberry Pi 5
- USB SSD (strongly recommended) or a fast SD card (A2 rated minimum) as a temporary start
- Raspberry Pi Imager from [raspberrypi.com/software](https://www.raspberrypi.com/software/)

### Step 1 — Update EEPROM First (Critical — Most People Skip This)

A stale EEPROM bootloader causes most Raspberry Pi HAOS boot failures — especially on Pi 4 Rev 1.4 and Pi 5. Do this before flashing HAOS.

**If you have a running Raspberry Pi OS:**
```bash
sudo apt update && sudo apt upgrade -y
sudo rpi-eeprom-update -a
sudo reboot
```

**If you do not have Raspberry Pi OS running:**
1. Open **Raspberry Pi Imager** on your computer.
2. Click **Choose Device** → select your Pi model.
3. Click **Choose OS** → **Misc Utility Images** → **Bootloader** → **SD Card Boot** (or USB Boot if you want USB boot).
4. Flash to a spare SD card.
5. Insert the SD card into your Pi and power on.
6. Wait for the screen to turn green — this means the EEPROM update succeeded.
7. Power off and remove the SD card.

### Step 2 — Flash HAOS

1. Open **Raspberry Pi Imager**.
2. Click **Choose Device** → select your Pi model.
3. Click **Choose OS** → **Other specific-purpose OS** → **Home assistants and home automation** → **Home Assistant** → select the version for your device:
   - Pi 4: `Home Assistant OS X.X (RPi 4)`
   - Pi 5: `Home Assistant OS X.X (RPi 5)`
4. Click **Choose Storage** → select your SSD or SD card.
5. Click **Next** — do **not** apply OS customisation settings (HAOS manages its own configuration).
6. Click **Yes** to confirm and flash. Takes 5–10 minutes.

### Step 3 — First Boot

1. Insert the SSD/SD card into your Pi.
2. Connect Ethernet (strongly recommended for first boot).
3. Power on.
4. Wait 5–10 minutes — HAOS expands the partition on first boot.
5. Open a browser on another device and go to: `http://homeassistant.local:8123`

If `homeassistant.local` does not resolve, find the IP address by checking your router's device list, or connect a monitor to the Pi — it shows the IP on screen after boot.

### Raspberry Pi Common Errors

**Pi 4 Rev 1.4: USB devices disappear after HAOS 17.2 update**

This is a confirmed EEPROM bug. Fix:

If you have SSH or the Terminal add-on available:
```bash
ha os login
rpi-eeprom-update -a
reboot
```

If you do not have terminal access, use Raspberry Pi Imager to flash the bootloader update (Step 1 above), boot that SD card once to update the EEPROM, then reinstall HAOS.

**Pi 5: Stuck in boot loop**

Usually caused by an outdated EEPROM. Update it first using the Imager method in Step 1. If still stuck, try the previous stable HAOS version from the GitHub releases page.

**Rainbow screen (Pi 4) or black screen with cursor (Pi 5)**

The EEPROM needs updating. Follow Step 1 exactly.

**`homeassistant.local` not found in browser**

mDNS is being blocked on your network. Use the IP address instead. Check your router's DHCP client list for a device named `homeassistant`.

---

## Method 2 — Generic x86-64 PC or Laptop

This covers any Intel or AMD 64-bit PC — NUC, mini PC, old laptop, desktop. HAOS takes over the entire drive and replaces any existing OS.

### What You Need
- An Intel or AMD 64-bit PC (any CPU from 2010 onwards)
- A USB drive (8 GB+) to run Ubuntu live for flashing
- A second USB drive or the internal drive for HAOS

### Step 1 — Download the HAOS x86-64 Image

Go to the Home Assistant OS releases page:
[github.com/home-assistant/operating-system/releases](https://github.com/home-assistant/operating-system/releases)

Find the latest release and download: `haos_generic-x86-64-XX.X.img.xz`

### Step 2 — Flash HAOS to the Internal Drive (Ubuntu Method — Recommended)

HAOS has no installer — you write the image directly to the internal drive. The cleanest way is booting Ubuntu live and using the Disks app.

1. Flash **Ubuntu Desktop** to a USB drive using [balenaEtcher](https://etcher.balena.io).
2. Boot your PC from the Ubuntu USB.
3. At the GRUB menu, select **Try Ubuntu** — do NOT click Install Ubuntu.
4. Open the **Files** app and navigate to where you downloaded the HAOS `.img.xz` file (or download it now in Firefox).
5. Open **Disks** (search in the application menu).
6. In Disks, select your **internal drive** from the left panel (identify it by size — be careful not to select the Ubuntu USB).
7. Click the three-dot menu (⋮) at the top right → **Restore Disk Image**.
8. Select the `haos_generic-x86-64-XX.X.img.xz` file — Disks can handle compressed `.xz` files directly.
9. Click **Start Restoring** → confirm.
10. Wait for it to finish (5–15 minutes depending on drive speed).

### Step 2 Alternative — Flash Using balenaEtcher

If you prefer balenaEtcher:
1. Boot Ubuntu live (same as above).
2. Download and run balenaEtcher: `flatpak install flathub io.balena.etcher` or download the AppImage from [etcher.balena.io](https://etcher.balena.io).
3. Select the HAOS `.img.xz` file as source.
4. Select your internal drive as target.
5. Click Flash.

### Step 3 — Configure BIOS

Before booting HAOS for the first time:
1. Enter BIOS/UEFI (press F2, Del, or F12 during startup — varies by manufacturer).
2. Disable **Secure Boot** — HAOS does not support Secure Boot.
3. Set boot order to boot from your internal drive first.
4. Save and exit.

### Step 4 — First Boot

Remove the Ubuntu USB and power on. HAOS will boot. Connect a monitor to see the IP address it receives from DHCP. Then access it from another device:

```
http://YOUR_HA_IP:8123
```

### x86-64 Common Errors

**"Error unmounting filesystem" in Ubuntu Disks**

You are running Ubuntu from the internal drive. You must run from the USB stick. Restart, boot from USB again, and select **Try Ubuntu** (not Install).

**Swap partition blocking Disks restore**

In the Disks app, if you see a Swap partition on the target drive, select it and click the Stop button to unmount it before restoring.

**System boots to BIOS/EFI shell instead of HAOS**

Secure Boot is enabled. Disable it in BIOS settings.

**Cannot reach homeassistant.local**

Find the IP from your router's DHCP client list or connect a monitor.

---

## Method 3 — Proxmox VM (Most Reliable for Home Lab)

Running HAOS in a Proxmox VM gives you snapshots, backups, live migration, and the ability to run other VMs alongside it. This is the best setup for a dedicated home lab server.

### What You Need
- A running Proxmox VE installation (see the **Install Proxmox on a Laptop WiFi Only** guide if needed)
- Internet access from the Proxmox host

### Step 1 — Download the HAOS KVM Image

In the **Proxmox Shell** (click your node → Shell), download the latest HAOS KVM image:

```bash
cd /var/lib/vz/template/iso

# Get the latest version from:
# https://github.com/home-assistant/operating-system/releases
# Replace 17.2 with the current latest version

wget https://github.com/home-assistant/operating-system/releases/download/17.2/haos_ova-17.2.qcow2.xz

# Extract it
unxz -v haos_ova-17.2.qcow2.xz
```

> **Important:** The `unxz` step is critical. Many failed installs are caused by importing the `.xz` file directly without extracting it first. `qm importdisk` will not complain but the resulting disk will be corrupt.

### Step 2 — Create the VM

In the Proxmox web UI, click **Create VM** (top right):

**General tab:**
- VM ID: note this number (e.g. `101`) — you need it for the import command
- Name: `HomeAssistant`

**OS tab:**
- Select **Do not use any media**

**System tab — this is where most people fail:**
- Machine: **q35**
- BIOS: **OVMF (UEFI)**
- Add EFI Disk: ✅ **checked**
- Pre-Enroll Keys: ❌ **unchecked** — this disables Secure Boot. Leaving this checked is the #1 cause of "UEFI Access Denied" boot failures
- SCSI Controller: **VirtIO SCSI single**

**Disks tab:**
- Delete the default disk that the wizard adds — you will import the HAOS disk manually

**CPU tab:**
- Cores: **2** minimum (4 recommended)
- Type: **host**

**Memory tab:**
- RAM: **4096 MB** (4 GB) minimum — **8192 MB** (8 GB) recommended if you run Frigate or heavy add-ons

**Network tab:**
- Model: **VirtIO**
- Bridge: **vmbr0** (your main network bridge)

Click **Finish** — do not start the VM yet.

### Step 3 — Import the HAOS Disk

Back in the Proxmox Shell, import the disk into your VM (replace `101` with your VM ID and `local-lvm` with your storage name):

```bash
qm importdisk 101 /var/lib/vz/template/iso/haos_ova-17.2.qcow2 local-lvm
```

Use **Tab** to autocomplete the filename — avoids typos.

### Step 4 — Attach the Disk

1. In the Proxmox UI, select your VM → **Hardware**.
2. You will see **Unused Disk 0** — double-click it.
3. Check **Discard** (if your storage is SSD-backed — enables TRIM).
4. Click **Add**.

### Step 5 — Set Boot Order

1. Select your VM → **Options** → **Boot Order** → **Edit**.
2. Check your newly added disk (usually `scsi0`).
3. Uncheck everything else (net0, ide2, etc.).
4. Click **OK**.

### Step 6 — Enable Start at Boot

In **Options** → **Start at Boot** → enable it. This makes the VM start automatically if the Proxmox host reboots.

### Step 7 — Start the VM

Click **Start**. Open the **Console** tab to watch it boot. After a minute or two, HAOS will display the IP address it received. Access it from a browser:

```
http://YOUR_HA_IP:8123
```

### Proxmox Common Errors

**"UEFI Access Denied" or stuck at UEFI menu**

Pre-Enroll Keys was enabled which activates Secure Boot. Fix:
- While the VM is at the UEFI menu, press **Esc** → **Device Manager** → **Secure Boot Configuration** → disable **Attempt Secure Boot**.

Or delete and recreate the EFI disk without Pre-Enroll Keys:
1. VM → Hardware → select EFI disk → Remove.
2. Add → EFI Disk → **uncheck Pre-Enroll Keys** → Add.

**qm importdisk: file not found**

You did not run `unxz` first, or the filename is wrong. Check with:
```bash
ls /var/lib/vz/template/iso/haos*
```
The file should end in `.qcow2` (not `.qcow2.xz`).

**VM boots to SeaBIOS (text screen)**

You selected SeaBIOS instead of OVMF. Edit VM → Hardware → BIOS → change to OVMF. You will also need to add an EFI disk.

**Disk not detected / boot loop**

The disk is not in the boot order. Go to Options → Boot Order and make sure `scsi0` is checked and at the top.

**QEMU Guest Agent shows no CPU/RAM stats**

This is expected. HAOS does not expose CPU and RAM to the QEMU guest agent — only network stats work. It is not a problem.

---

## Method 4 — Docker (Home Assistant Container)

> ⚠️ **Container does not include add-ons.** If you want Mosquitto, Node-RED, Zigbee2MQTT, or any other add-on, use HAOS (Methods 1–3). Container is only for advanced users who want to manage everything themselves in Docker.

### Linux (Recommended for Container)

```bash
docker run -d \
  --name homeassistant \
  --privileged \
  --restart=unless-stopped \
  --network=host \
  -e TZ=YOUR_TIMEZONE \
  -v /PATH_TO_YOUR_CONFIG:/config \
  ghcr.io/home-assistant/home-assistant:stable
```

Replace:
- `YOUR_TIMEZONE` with your timezone from the [TZ database](https://en.wikipedia.org/wiki/List_of_tz_database_time_zones) (e.g. `Europe/London`, `America/New_York`)
- `/PATH_TO_YOUR_CONFIG` with a folder path on your system (e.g. `/home/yourname/homeassistant`)

Example:
```bash
mkdir -p ~/homeassistant

docker run -d \
  --name homeassistant \
  --privileged \
  --restart=unless-stopped \
  --network=host \
  -e TZ=Europe/London \
  -v ~/homeassistant:/config \
  ghcr.io/home-assistant/home-assistant:stable
```

Access: `http://YOUR_HOST_IP:8123`

### macOS

macOS does not support `--network=host` in Docker. Use port mapping instead:

```bash
docker run -d \
  --name homeassistant \
  --privileged \
  --restart=unless-stopped \
  -e TZ=YOUR_TIMEZONE \
  -v ~/homeassistant:/config \
  -p 8123:8123 \
  ghcr.io/home-assistant/home-assistant:stable
```

### Docker Compose (Recommended for Long-Term)

Create `docker-compose.yml`:

```yaml
services:
  homeassistant:
    container_name: homeassistant
    image: ghcr.io/home-assistant/home-assistant:stable
    volumes:
      - ./config:/config
    environment:
      - TZ=YOUR_TIMEZONE
    restart: unless-stopped
    privileged: true
    network_mode: host
```

Run:
```bash
docker compose up -d
```

### Update Home Assistant Container

```bash
docker pull ghcr.io/home-assistant/home-assistant:stable
docker stop homeassistant
docker rm homeassistant
# Re-run the same docker run command as before
```

Or with Docker Compose:
```bash
docker compose pull
docker compose up -d
```

### Container Common Errors

**Cannot reach port 8123**

On Linux, if you used `--network=host`, access via your host IP. Do not use `localhost` if you are accessing from another device.

On macOS/Windows, use `-p 8123:8123` instead of `--network=host`.

**`homeassistant.local` does not work with Container**

mDNS hostname resolution only works with HAOS. Use the IP address directly.

**Config changes not persisting after container restart**

Your config volume path is wrong. Check that `/PATH_TO_YOUR_CONFIG` or `./config` is a real directory that you own. Check with:
```bash
docker inspect homeassistant | grep Mounts -A 10
```

---

## First-Time Setup (All Methods)

After reaching `http://YOUR_HA_IP:8123` for the first time:

1. Click **Create my smart home**.
2. Create your admin user account — this is your Home Assistant login. Choose a strong password and save it in a password manager.
3. Set your **location** — this is used for sunrise/sunset automations and weather data.
4. Set your **time zone**.
5. Choose whether to share anonymised usage statistics (your choice).
6. Home Assistant will scan your network for devices. Skip or let it discover.
7. Click **Finish** — you are now in your Home Assistant dashboard.

---

## First Things to Do After Installation

### 1. Set Up Backups Immediately

Go to **Settings** → **System** → **Backups** → **Automatic Backups**.

Enable automatic backups and save the **encryption key** somewhere safe (password manager). You cannot restore a backup without this key.

### 2. Move to SSD If You Are on SD Card

SD cards will eventually fail. If you started on an SD card for testing, migrate to a USB SSD as soon as possible:

1. Create a full backup in **Settings** → **System** → **Backups** → **Create Backup**.
2. Download the backup.
3. Flash HAOS to the SSD using the Raspberry Pi Imager.
4. Boot from the SSD.
5. Complete the onboarding wizard.
6. Go to **Settings** → **System** → **Backups** → **Upload Backup** and restore.

### 3. Add-ons Worth Installing First

In **Settings** → **Add-ons** → **Add-on Store**:

| Add-on | What it does |
|---|---|
| **Terminal & SSH** | SSH access and terminal — essential for troubleshooting |
| **File Editor** | Edit config files from the browser |
| **Mosquitto broker** | MQTT broker for IoT devices |
| **Zigbee2MQTT** | Control Zigbee devices (with a USB coordinator dongle) |
| **Node-RED** | Visual automation editor |

---

## Troubleshooting

### Cannot reach Home Assistant after install

1. Check the IP — connect a monitor or check your router's DHCP list.
2. Make sure you are on port 8123: `http://IP:8123`.
3. Wait longer — first boot can take up to 15 minutes on slower hardware.
4. Check that the device is on your network (ping it).

### Home Assistant is unreachable after an update

An update may have caused a config error and put HA in safe mode, or the update may have failed. Connect a monitor to see what is happening. SSH in using Terminal & SSH add-on if you had it installed.

### SD card keeps corrupting

This is the nature of SD cards under continuous database writes. The only real fix is switching to a USB SSD. Consider this a hardware issue, not a software one.

### Zigbee/Z-Wave USB stick not detected

The USB device needs to be passed through to the VM (Proxmox users) or the Docker container. In Proxmox: VM → Hardware → Add → USB Device → select your stick by vendor ID. In Docker: add `--device=/dev/ttyUSB0:/dev/ttyUSB0` to your run command (replace with your actual device path from `ls /dev/ttyUSB*`).

### Home Assistant lost all data after a restart

Your config volume was not persisted correctly (Docker users), or the storage device failed (SD card). Restore from backup.

### Update stuck / Home Assistant not loading after update

Try a forced restart: in the HAOS web terminal, run `ha core restart`. If unavailable, power cycle the device.
