---
layout: default
title: "Proxmox No-Subscription Repository Setup"
parent: "Installation Guides"
nav_order: 15
---

# Proxmox No-Subscription Repository Setup

After installing Proxmox, `apt update` immediately throws a 401 Unauthorized error. This happens because Proxmox enables the enterprise repository by default — even on a fresh install — and that repo requires a paid subscription key to access. This guide explains exactly which files are involved, why there are two of them, and how to switch to the free no-subscription repository cleanly.

> **The no-subscription repository is not a downgrade.** It contains the exact same packages as the enterprise repository. The only difference is that packages are released there first (for community testing) before moving to the enterprise repo after further validation. For a homelab or development machine it is perfectly fine.

---

## Why This Happens

Proxmox installs two enterprise repository files by default:

| File | What it controls |
|---|---|
| `/etc/apt/sources.list.d/pve-enterprise.list` (PVE 7/8) | Proxmox VE packages |
| `/etc/apt/sources.list.d/pve-enterprise.sources` (PVE 9 / Debian Trixie) | Proxmox VE packages (new format) |
| `/etc/apt/sources.list.d/ceph.list` | Ceph storage packages |

**Both files point to enterprise.proxmox.com.** Both require a subscription. Most guides only tell you to disable one — leaving the other active, which is why `apt update` still throws errors after following those guides.

---

## Check Your Proxmox Version First

```bash
pveversion
```

- If it shows `pve-manager/8.x` — you are on PVE 8 (Debian Bookworm). Use the PVE 8 section.
- If it shows `pve-manager/9.x` — you are on PVE 9 (Debian Trixie). Use the PVE 9 section.

---

## Fix for Proxmox VE 9 (Debian Trixie) — Current

### Step 1 — Disable the enterprise PVE repository

```bash
nano /etc/apt/sources.list.d/pve-enterprise.sources
```

Comment out all lines by adding `#` at the start of each:

```
# Types: deb
# URIs: https://enterprise.proxmox.com/debian/pve
# Suites: trixie
# Components: pve-enterprise
# Signed-By: /usr/share/keyrings/proxmox-archive-keyring.gpg
```

Save with **Ctrl+X → Y → Enter**.

### Step 2 — Disable the enterprise Ceph repository

```bash
nano /etc/apt/sources.list.d/ceph.list
```

Comment out all lines:

```
# deb https://enterprise.proxmox.com/debian/ceph-squid trixie enterprise
```

Save and exit.

### Step 3 — Add the no-subscription PVE repository

```bash
nano /etc/apt/sources.list.d/pve-no-subscription.list
```

Add this line:

```
deb http://download.proxmox.com/debian/pve trixie pve-no-subscription
```

Save and exit.

### Step 4 — Add the no-subscription Ceph repository

```bash
nano /etc/apt/sources.list.d/ceph.list
```

Add this line below the commented-out enterprise line:

```
deb http://download.proxmox.com/debian/ceph-squid trixie no-subscription
```

Save and exit.

### Step 5 — Update and upgrade

```bash
apt update && apt full-upgrade -y
```

No more 401 errors. If you still see one, check both files again — a single uncommented enterprise line will continue causing errors.

---

## Fix for Proxmox VE 8 (Debian Bookworm)

### Step 1 — Disable the enterprise PVE repository

```bash
nano /etc/apt/sources.list.d/pve-enterprise.list
```

Comment out the line:

```
# deb https://enterprise.proxmox.com/debian/pve bookworm pve-enterprise
```

Save and exit.

### Step 2 — Disable the enterprise Ceph repository

```bash
nano /etc/apt/sources.list.d/ceph.list
```

Comment out the enterprise line:

```
# deb https://enterprise.proxmox.com/debian/ceph-quincy bookworm enterprise
```

Save and exit.

### Step 3 — Add the no-subscription PVE repository

```bash
nano /etc/apt/sources.list
```

Add this line at the bottom:

```
deb http://download.proxmox.com/debian/pve bookworm pve-no-subscription
```

Save and exit.

### Step 4 — Add the no-subscription Ceph repository

```bash
nano /etc/apt/sources.list.d/ceph.list
```

Add this line:

```
deb http://download.proxmox.com/debian/ceph-squid bookworm no-subscription
```

Save and exit.

### Step 5 — Update and upgrade

```bash
apt update && apt full-upgrade -y
```

---

## One-Command Fix (Copy and Paste)

If you just want to run it all at once without editing files manually:

**PVE 9 (Trixie):**
```bash
# Disable enterprise repos
sed -i 's/^Types:/#Types:/;s/^URIs:/#URIs:/;s/^Suites:/#Suites:/;s/^Components:/#Components:/;s/^Signed-By:/#Signed-By:/' \
  /etc/apt/sources.list.d/pve-enterprise.sources
sed -i 's/^deb/#deb/' /etc/apt/sources.list.d/ceph.list

# Add no-subscription repos
echo "deb http://download.proxmox.com/debian/pve trixie pve-no-subscription" \
  > /etc/apt/sources.list.d/pve-no-subscription.list
echo "deb http://download.proxmox.com/debian/ceph-squid trixie no-subscription" \
  >> /etc/apt/sources.list.d/ceph.list

apt update && apt full-upgrade -y
```

**PVE 8 (Bookworm):**
```bash
# Disable enterprise repos
sed -i 's/^deb/#deb/' /etc/apt/sources.list.d/pve-enterprise.list
sed -i 's/^deb https:\/\/enterprise/#deb https:\/\/enterprise/' /etc/apt/sources.list.d/ceph.list

# Add no-subscription repos
echo "deb http://download.proxmox.com/debian/pve bookworm pve-no-subscription" \
  >> /etc/apt/sources.list
echo "deb http://download.proxmox.com/debian/ceph-squid bookworm no-subscription" \
  >> /etc/apt/sources.list.d/ceph.list

apt update && apt full-upgrade -y
```

---

## Remove the "No Valid Subscription" Popup

Even after fixing the repositories, the Proxmox web UI shows a popup on every login saying **"You do not have a valid subscription."** This is cosmetic — it does not affect functionality. To remove it:

```bash
sed -i.bak "s/Ext.Msg.show(/void(/g" \
  /usr/share/javascript/proxmox-widget-toolkit/proxmoxlib.js

systemctl restart pveproxy
```

Refresh your browser (hard refresh with Ctrl+Shift+R). The popup will be gone.

> **Note:** This edit gets overwritten every time the `proxmox-widget-toolkit` package updates. Re-run the command after each Proxmox update if the popup comes back.

---

## What the Subscription Tiers Actually Give You

| Feature | No Subscription (Free) | Community | Basic | Standard | Premium |
|---|---|---|---|---|---|
| Repository access | No-subscription repo | Enterprise repo | Enterprise repo | Enterprise repo | Enterprise repo |
| Community forum | ✅ | ✅ | ✅ | ✅ | ✅ |
| Official ticket support | ❌ | ❌ | ✅ (next business day) | ✅ (2 hour response) | ✅ (1 hour response) |
| Price (per CPU socket/year) | Free | ~€95 | ~€340 | ~€510 | ~€1,100 |

For a homelab, the no-subscription setup is the right choice. The enterprise repo gets the same packages, just slightly later. Paying for a subscription makes sense when you need official support tickets and SLA response times for production infrastructure.

---

## Verify Everything Is Correct

After running `apt update`, check there are no errors:

```bash
apt update 2>&1 | grep -i "error\|401\|unauthorized"
```

No output means everything is clean. Also verify your repo files look correct:

```bash
cat /etc/apt/sources.list.d/pve-enterprise.list    # or .sources for PVE 9
cat /etc/apt/sources.list.d/ceph.list
cat /etc/apt/sources.list.d/pve-no-subscription.list
```

Every enterprise line should start with `#`. Every no-subscription line should be active (no `#`).
