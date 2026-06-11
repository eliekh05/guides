---
layout: default
title: "Install macOS Sequoia on VirtualBox (Windows)"
parent: "Installation Guides"
nav_order: 9
---

# Install macOS Sequoia on VirtualBox (Windows)

Every guide online for this either links to sketchy pre-built VMDK files, uses outdated VBoxManage commands, skips the Windows prerequisites that silently break everything, or does not explain the difference between Intel and AMD setups. This guide is complete, accurate, and uses only official tools.

> **Legal note:** Apple's EULA restricts macOS to Apple hardware. This guide is for developers, testers, and enthusiasts only.

---

## VirtualBox vs VMware for macOS

Before starting, know that VirtualBox is the harder path for macOS:

| | VirtualBox | VMware Workstation Pro |
|---|---|---|
| Cost | Free | Free |
| macOS support | Unofficial, manual patches | Unofficial, easier unlocker |
| Performance | Lower | Better |
| Guest display scaling | Manual VBoxManage command | VMware Tools handles it |
| Stability on macOS guest | Moderate | More stable |

If you have a choice, the VMware guide will give you a smoother experience. Use VirtualBox if VMware is not an option for you.

---

## What You Need

- A Windows PC with an **Intel or AMD 64-bit CPU** with virtualisation support
- At least **8 GB RAM** (plan to give the VM 4–6 GB)
- At least **80 GB free disk space**
- **Virtualisation enabled in BIOS** — Intel VT-x or AMD-V
- A macOS Sequoia ISO file (see Step 1)

---

## Before You Start — Disable These Two Windows Features

This is the most common reason VirtualBox silently fails to start a macOS VM. Both of these take exclusive control of the CPU virtualisation hardware and block VirtualBox from using it.

### Disable Memory Integrity (Core Isolation)

1. Open Windows Search and type **Core Isolation**.
2. Open **Core Isolation** settings.
3. Toggle **Memory Integrity** to **Off**.
4. Restart Windows.

### Disable Hyper-V

1. Open **Command Prompt as Administrator** (right-click Start → Terminal (Admin) or Command Prompt (Admin)).
2. Run:
   ```cmd
   bcdedit /set hypervisorlaunchtype off
   ```
3. Restart Windows.

To re-enable Hyper-V later if needed:
```cmd
bcdedit /set hypervisorlaunchtype auto
```

> **Note:** If you use WSL 2, Docker Desktop, or Windows Sandbox, disabling Hyper-V will break them. You will need to re-enable it after you are done with the macOS VM, or use VMware instead (which has better Hyper-V coexistence).

---

## Step 1 — Get the macOS Sequoia ISO

You need a genuine macOS Sequoia ISO. Do not download pre-built ISOs or VMDKs from random sites — they are often outdated, pirated, or contain malware.

### Option A — Using a Real Mac (Recommended)

On a Mac running macOS Ventura or later, open Terminal and run:

```bash
softwareupdate --fetch-full-installer --full-installer-version 15.0
```

Wait for it to download (about 13 GB). Then convert it to ISO:

```bash
hdiutil create -o /tmp/Sequoia -size 16384m -volname "Install macOS Sequoia" -layout SPUD -fs HFS+J

hdiutil attach /tmp/Sequoia.dmg -noverify -mountpoint /Volumes/InstallMacOSSequoia

sudo /Applications/Install\ macOS\ Sequoia.app/Contents/Resources/createinstallmedia \
  --volume /Volumes/InstallMacOSSequoia --nointeraction

hdiutil detach /Volumes/Install\ macOS\ Sequoia

hdiutil convert /tmp/Sequoia.dmg -format UDTO -o ~/Desktop/Sequoia

mv ~/Desktop/Sequoia.cdr ~/Desktop/Sequoia.iso
```

Copy `Sequoia.iso` to your Windows PC.

### Option B — Using gibMacOS on Windows (No Mac Needed)

1. Download **gibMacOS** from [github.com/corpnewt/gibMacOS](https://github.com/corpnewt/gibMacOS) → click **Code** → **Download ZIP**.
2. Extract and run `gibMacOS.bat`.
3. Select macOS Sequoia from the numbered list and press Enter to download (about 13 GB).
4. Once done, run `BuildmacOSInstallApp.command` — on Windows this will produce the files needed to build an ISO.
5. Follow the on-screen instructions to produce a bootable ISO.

---

## Step 2 — Download and Install VirtualBox

1. Go to [virtualbox.org/wiki/Downloads](https://www.virtualbox.org/wiki/Downloads).
2. Download **VirtualBox for Windows hosts** (the latest version — 7.1.x as of 2026).
3. Also download the **VirtualBox Extension Pack** from the same page — you need this for USB 3.0 support.
4. Install VirtualBox first, then double-click the Extension Pack to install it into VirtualBox.

---

## Step 3 — Create the Virtual Machine

1. Open **VirtualBox** and click **New**.
2. Fill in the details:
   - **Name:** `macOS Sequoia` — use this exact name (the VBoxManage commands later reference it)
   - **Folder:** leave as default
   - **ISO Image:** Do **not** select the ISO here yet — leave it as `<not selected>`
   - **Type:** `Mac OS X`
   - **Version:** `Mac OS X (64-bit)`
3. Click **Next**.
4. **Memory:** Set to **6144 MB** (6 GB) if you have 16 GB RAM, or **4096 MB** minimum.
5. **Processors:** Set to **2**.
6. Click **Next**.
7. **Virtual Hard Disk:** Select **Create a Virtual Hard Disk Now**, set size to **80 GB** minimum (100 GB recommended).
8. Click **Next** → **Finish**.

---

## Step 4 — Configure VM Settings

Right-click your new VM → **Settings**.

### System → Motherboard
- **Base Memory:** confirm your RAM setting
- Enable **I/O APIC**
- Enable **Hardware Clock in UTC Time**
- **Boot Order:** uncheck Floppy, ensure Optical and Hard Disk are checked

### System → Processor
- **Processors:** 2
- Enable **PAE/NX** — uncheck this actually, macOS does not need it and it can cause issues
- Enable **VT-x/AMD-V** (should be on by default)

### System → Acceleration
- **Paravirtualization Interface:** set to **None**
- **Hardware Virtualisation:** enable both options

### Display
- **Video Memory:** set to **128 MB**
- **Graphics Controller:** set to **VBoxVGA** (not VMSVGA — macOS does not work with VMSVGA)
- Leave 3D acceleration **off**

### Storage
- Click the **Empty** CD icon under Controller: SATA.
- Click the disc icon on the right → **Choose a disk file**.
- Select your `Sequoia.iso`.
- Make sure **Live CD/DVD** is checked.

### USB
- Select **USB 3.0 (xHCI) Controller** (requires Extension Pack).

### Network
- **Adapter 1:** Attached to **NAT** (default — gives internet access).

Click **OK** to save.

---

## Step 5 — Run the VBoxManage Commands (Critical)

This is the step every outdated guide either skips or gets wrong. Without these commands macOS will not boot. These must be run **while the VM is powered off**.

Open **Command Prompt as Administrator**.

### For Intel CPUs — run all of these:

```cmd
cd "C:\Program Files\Oracle\VirtualBox\"

VBoxManage.exe modifyvm "macOS Sequoia" --cpuidset 00000001 000106e5 00100800 0098e3fd bfebfbff

VBoxManage setextradata "macOS Sequoia" "VBoxInternal/Devices/efi/0/Config/DmiSystemProduct" "iMac19,3"

VBoxManage setextradata "macOS Sequoia" "VBoxInternal/Devices/efi/0/Config/DmiSystemVersion" "1.0"

VBoxManage setextradata "macOS Sequoia" "VBoxInternal/Devices/efi/0/Config/DmiBoardProduct" "Iloveapple"

VBoxManage setextradata "macOS Sequoia" "VBoxInternal/Devices/smc/0/Config/DeviceKey" "ourhardworkbythesewordsguardedpleasedontsteal(c)AppleComputerInc"

VBoxManage setextradata "macOS Sequoia" "VBoxInternal/Devices/smc/0/Config/GetKeyFromRealSMC" 1

VBoxManage setextradata "macOS Sequoia" "VBoxInternal/TM/TSCMode" "RealTSCOffset"
```

### For AMD CPUs — run all of the above, then also run this:

```cmd
VBoxManage modifyvm "macOS Sequoia" --cpu-profile "Intel Core i7-6700K"
```

> **AMD note:** The CPU profile line is essential on AMD — without it macOS kernel panics immediately. If `Intel Core i7-6700K` does not work for your specific AMD chip, try `Intel Xeon X5482 3.20GHz` as an alternative. Also change `GetKeyFromRealSMC` from `1` to `0` on AMD systems:
> ```cmd
> VBoxManage setextradata "macOS Sequoia" "VBoxInternal/Devices/smc/0/Config/GetKeyFromRealSMC" 0
> ```

**What these commands do:**

| Command | Why it is needed |
|---|---|
| `--cpuidset` | Spoofs the CPU ID so macOS sees a compatible Intel processor |
| `DmiSystemProduct iMac19,3` | Identifies the VM as a known Mac model |
| `DmiBoardProduct Iloveapple` | Sets a board identifier macOS accepts |
| `DeviceKey` | Provides Apple's SMC security key — required to boot |
| `GetKeyFromRealSMC` | 1 for Intel (read from host), 0 for AMD (use fake key) |
| `TSCMode RealTSCOffset` | Fixes timing issues that cause boot loops |
| `--cpu-profile` | AMD only: forces macOS to see an Intel CPU profile |

---

## Step 6 — Install macOS Sequoia

1. Start the VM in VirtualBox — click **Start**.
2. You will see a dark boot screen. Wait up to **5 minutes** — this is normal for the first boot from ISO.
3. The **macOS Utilities** menu will appear.
4. Click **Disk Utility**.
5. In Disk Utility, select **VBOX HARDDISK** (or similar) from the left panel.
6. Click **Erase**:
   - **Name:** `Macintosh HD`
   - **Format:** `APFS`
   - **Scheme:** `GUID Partition Map`
7. Click **Erase**, then close Disk Utility.
8. Select **Install macOS Sequoia** → **Continue**.
9. Accept the license → select `Macintosh HD` → **Install**.

The VM will reboot **two or three times**. Each reboot is normal — leave it running. Total installation time is 30–60 minutes.

> **Boot loop fix:** If the VM reboots more than 3 times without progress, power it off and run this command, then start again:
> ```cmd
> VBoxManage setextradata "macOS Sequoia" "VBoxInternal/TM/TSCMode" "RealTSCOffset"
> ```

---

## Step 7 — Complete macOS Setup

After installation finishes you will reach the Setup Assistant. Go through the steps:

- **Country:** Select yours → Continue.
- **Accessibility:** Not Now.
- **Wi-Fi:** Select your network (NAT gives internet through your Windows host automatically).
- **Data & Privacy:** Continue.
- **Migration Assistant:** Not Now.
- **Apple ID:** Set Up Later (or sign in — your choice).
- **Terms:** Agree.
- **Create Account:** Set a name, username, and password.
- **Location Services:** Your choice — disable for a test VM.
- Disable **Share Mac Analytics**.
- **Screen Time:** Set Up Later.
- Choose an appearance and click Continue.

You are now at the macOS Sequoia desktop inside VirtualBox.

---

## Step 8 — Fix Screen Resolution

VirtualBox does not auto-resize macOS like VMware does. Set your resolution manually.

Power off the VM first, then open **Command Prompt as Administrator** and run:

```cmd
cd "C:\Program Files\Oracle\VirtualBox\"

VBoxManage setextradata "macOS Sequoia" VBoxInternal2/EfiGraphicsResolution 1920x1080
```

Replace `1920x1080` with your actual monitor resolution. Other options:

```
1280x720
1280x800
1440x900
1600x900
1920x1080
2560x1440
```

Start the VM again — macOS will boot at the resolution you set.

---

## Step 9 — Install VirtualBox Guest Additions (Optional)

Guest Additions improve mouse integration and clipboard sharing but have limited macOS support compared to VMware Tools. Worth trying:

1. With the VM running, go to **Devices** → **Insert Guest Additions CD image** in the VirtualBox menu.
2. A disc will appear on the macOS desktop. Open it.
3. Run **VBoxDarwinAdditions.pkg**.
4. Follow the installer and restart the VM.

> **Note:** Guest Additions on macOS in VirtualBox is less polished than VMware Tools. If it causes issues, eject the disc and skip this step.

---

## Troubleshooting

### Black screen after clicking Start
The VBoxManage commands were not applied, or Memory Integrity / Hyper-V is still enabled. Verify both are disabled, re-run the commands, and try again.

### VM crashes immediately with a kernel panic
On AMD: make sure you ran the `--cpu-profile` command and set `GetKeyFromRealSMC` to `0` instead of `1`.

### Stuck at Apple logo for more than 10 minutes
Power off. Run the `TSCMode RealTSCOffset` command if you have not already. Also try reducing CPU count to **1** in Settings → System → Processor (speeds up install significantly).

### Boot loops during installation
This is the TSCMode issue. Power off, run:
```cmd
VBoxManage setextradata "macOS Sequoia" "VBoxInternal/TM/TSCMode" "RealTSCOffset"
```
Then start the VM and select **Continue** from the installer menu.

### `VERR_INVALID_HANDLE` SMC error
You are on an AMD CPU but used `GetKeyFromRealSMC` value `1`. Change it to `0`:
```cmd
VBoxManage setextradata "macOS Sequoia" "VBoxInternal/Devices/smc/0/Config/GetKeyFromRealSMC" 0
```

### No internet in macOS
Go to VM **Settings** → **Network** → confirm **Adapter 1** is set to **NAT** and is enabled.

### Screen stays at low resolution
Make sure you ran the `EfiGraphicsResolution` command with the correct VM name and **while the VM was powered off**.

### VBoxManage says `VBOX_E_OBJECT_NOT_FOUND`
Your VM name does not exactly match what is in the commands. Check the name in VirtualBox — it is case-sensitive. Replace `"macOS Sequoia"` in the commands with your exact VM name.

---

## Performance Tips

VirtualBox macOS performance is limited by design — it is not a native environment. To get the most out of it:

- Give the VM at least **4 CPU cores** if your host has 8 or more
- Keep the VM storage on an **SSD** — spinning hard drives make it almost unusable
- Close unnecessary Windows apps while the VM is running
- Do not enable 3D acceleration — it causes crashes on macOS guests in VirtualBox
- Set the graphics controller to **VBoxVGA** not VMSVGA or VBoxSVGA

---

> **Summary:** Disable Memory Integrity and Hyper-V first — most failures happen because these are still on. Create the VM with VBoxVGA and 128 MB video memory. Run all the VBoxManage commands as Administrator before first boot. On AMD, add the `--cpu-profile` line and set `GetKeyFromRealSMC` to `0`. Set resolution with the `EfiGraphicsResolution` command after install. That covers everything every other guide misses.
