---
layout: default
title: "Set Up a Printer on Linux (CUPS)"
parent: "macOS & Linux"
nav_order: 22
---

# Set Up a Printer on Linux (CUPS)

CUPS (Common Unix Printing System) is how Linux handles all printing. It works for USB printers, network printers, and wireless printers. Most modern printers work without manual driver installation — but when they do not, this guide covers that too.

---

## Step 1 — Install CUPS

**Ubuntu / Debian / Linux Mint:**
```bash
sudo apt update
sudo apt install cups cups-client -y
```

**Fedora:**
```bash
sudo dnf install cups -y
```

**Arch:**
```bash
sudo pacman -S cups
```

Start and enable CUPS:
```bash
sudo systemctl enable --now cups
```

---

## Step 2 — Add Your User to the lpadmin Group

Without this, you cannot manage printers without root:

```bash
sudo usermod -aG lpadmin $(whoami)
```

Log out and back in for the group change to take effect.

---

## Step 3 — Open the CUPS Web Interface

Open your browser and go to:
```
http://localhost:631
```

Click **Administration** → **Add Printer**.

When it asks for a username and password, use your **Linux login credentials** (the same ones you use to log in to your computer).

---

## Step 4 — Add a USB Printer

1. Connect the printer via USB and power it on.
2. Go to `http://localhost:631` → **Administration** → **Add Printer**.
3. Your printer should appear under **Local Printers**. Select it and click **Continue**.
4. Give it a name → **Continue**.
5. Select a driver — CUPS will suggest one. If the exact model is listed, use it. If not, try the generic driver for your manufacturer.
6. Click **Add Printer** → **Set Default Options** → **Set Default Options**.

Print a test page: go to **Printers** → select your printer → **Print Test Page**.

---

## Step 5 — Add a Network / Wireless Printer

Make sure the printer is on the same network as your Linux machine.

1. Go to `http://localhost:631` → **Administration** → **Add Printer**.
2. Look under **Discovered Network Printers** — most modern printers appear here automatically via Bonjour/IPP.
3. If it does not appear, select **LPD/LPR Host or Printer** or **Internet Printing Protocol (IPP)** and enter the printer's IP address manually:
   - For IPP (most common): `ipp://192.168.1.x/ipp/print`
   - For HP JetDirect: `socket://192.168.1.x:9100`
4. Select the driver and complete the setup as in Step 4.

To find your printer's IP: check your router's connected devices list, or print a configuration page from the printer's front panel menu.

---

## Manufacturer-Specific Drivers

### HP Printers

HP has excellent Linux support via HPLIP:

```bash
sudo apt install hplip hplip-gui -y   # Ubuntu/Debian
sudo dnf install hplip -y              # Fedora
```

Run the HP setup tool:
```bash
hp-setup
```

Follow the GUI wizard — it detects your HP printer and installs the right driver automatically.

### Brother Printers

Brother provides Linux drivers on their website:

1. Go to [support.brother.com](https://support.brother.com), find your model, and download the Linux driver (`.deb` for Ubuntu/Debian, `.rpm` for Fedora).
2. Install it:
   ```bash
   sudo dpkg -i brother-*.deb     # Ubuntu/Debian
   sudo rpm -i brother-*.rpm      # Fedora
   ```
3. Then add the printer via CUPS as normal.

### Epson Printers

```bash
sudo apt install printer-driver-escpr -y   # Ubuntu/Debian
```

Covers most Epson inkjet models.

### Canon Printers

```bash
sudo apt install cups-backend-bjnp -y   # For network Canon printers
```

---

## Manage Printers from the Desktop

Instead of the CUPS web interface, most desktop environments have a built-in printer manager:

**GNOME (Ubuntu):** Settings → Printers

**KDE:** System Settings → Printers

**XFCE:** Settings → Printers

---

## Command-Line Printing

```bash
# Print a file
lp document.pdf

# Print to a specific printer
lp -d PrinterName document.pdf

# Print multiple copies
lp -n 3 document.pdf

# Check print queue
lpq

# Cancel a print job (get job ID from lpq)
lprm JOB_ID

# List all printers
lpstat -p

# Check printer status
lpstat -d
```

---

## Troubleshooting

### Printer detected but jobs stay queued / never print

Check the CUPS error log:
```bash
sudo tail -f /var/log/cups/error_log
```

The log shows exactly why jobs are failing. Common causes: wrong driver, wrong connection URI, or printer offline.

### CUPS service fails to start

```bash
sudo systemctl status cups
journalctl -u cups --since "5 minutes ago"
```

If the config is corrupted:
```bash
sudo mv /etc/cups/cupsd.conf /etc/cups/cupsd.conf.bak
sudo systemctl restart cups
```

CUPS regenerates a default config automatically.

### Network printer keeps going offline

Set a static IP for the printer in your router (DHCP reservation), then re-add it using the static IP instead of a hostname. Hostnames can change; IPs stay fixed.

### "Filter failed" error

The driver or filter is missing. Install `foomatic-db` and `foomatic-filters`:
```bash
sudo apt install foomatic-db foomatic-filters cups-filters -y
sudo systemctl restart cups
```

### Printer needs a PPD file

Some older printers require a PPD (PostScript Printer Description) file. Search [openprinting.org/printers](https://openprinting.org/printers) for your model and download the PPD. When adding the printer in CUPS, choose **Or Provide a PPD File** and upload it.