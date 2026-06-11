---
layout: default
title: "Install macOS Sequoia on VMware Workstation Pro (Windows)"
parent: "Installation Guides"
nav_order: 8
---

# Install macOS Sequoia on VMware Workstation Pro (Windows)

Every guide online for this is either outdated, uses sketchy pre-built VMDK files from random sites, skips critical VMX edits, or does not mention that VMware Workstation Pro is now completely free. This guide is accurate for **VMware Workstation Pro 25H2u1** (the latest version as of 2026) and macOS Sequoia 15.

> **Legal note:** Apple's EULA technically restricts macOS to Apple hardware. This guide is intended for developers, testers, and enthusiasts evaluating macOS. Do not use this setup for commercial app distribution — use real Apple hardware for that.

---

## What You Need

- A Windows PC with an **Intel CPU** (AMD works but requires extra steps — see the AMD section at the end)
- CPU must support **AVX2 instructions** — any Intel Core i-series from 4th gen (Haswell, 2013) onwards qualifies. macOS 13+ requires this.
- At least **8 GB RAM** (16 GB recommended — plan to give the VM 4–6 GB)
- At least **80 GB free disk space**
- **Virtualisation enabled in BIOS** — look for Intel VT-x or VT-d and make sure it is on
- A free Broadcom account (required to download VMware)

---

## Step 1 — Download VMware Workstation Pro (Free)

VMware Workstation Pro has been completely free for personal and commercial use since November 2024. No license key needed.

1. Go to [support.broadcom.com](https://support.broadcom.com) and create a free account if you do not have one.
   > **Note:** Broadcom's profile approval process can take a few minutes to a few days. If you are stuck waiting, try logging out and back in — many accounts are approved instantly.
2. Once logged in, go to **My Downloads** → search for **VMware Workstation Pro**.
3. Select **VMware Workstation Pro 25H2u1 for Windows** (or the latest version shown) and download it.
4. Run the installer. Accept defaults. **Do not launch VMware yet.**

When asked for a license key during first launch, select **Use for Personal Use** — no key is needed.

---

## Step 2 — Get the macOS Sequoia ISO

You need a genuine macOS Sequoia ISO. There are two ways to get one:

### Option A — Using a Real Mac (Cleanest Method)

On a Mac, open Terminal and run:

```bash
softwareupdate --fetch-full-installer --full-installer-version 15.0
```

This downloads the full macOS Sequoia installer to `/Applications/`. Then convert it to an ISO:

```bash
hdiutil create -o /tmp/Sequoia -size 16384m -volname "Install macOS Sequoia" -layout SPUD -fs HFS+J
hdiutil attach /tmp/Sequoia.dmg -noverify -mountpoint /Volumes/InstallMacOSSequoia
sudo /Applications/Install\ macOS\ Sequoia.app/Contents/Resources/createinstallmedia \
  --volume /Volumes/InstallMacOSSequoia --nointeraction
hdiutil detach /Volumes/Install\ macOS\ Sequoia
hdiutil convert /tmp/Sequoia.dmg -format UDTO -o ~/Desktop/Sequoia
mv ~/Desktop/Sequoia.cdr ~/Desktop/Sequoia.iso
```

Copy the `Sequoia.iso` from your Mac's Desktop to your Windows PC.

### Option B — Using gibMacOS on Windows (No Mac Needed)

1. Download **gibMacOS** from [github.com/corpnewt/gibMacOS](https://github.com/corpnewt/gibMacOS).
2. Run `gibMacOS.bat` on Windows.
3. Select macOS Sequoia from the list and download it.
4. Once downloaded, run `BuildmacOSInstallApp.command` if on a Mac, or use the `MakeInstall.bat` on Windows to create a bootable ISO from the downloaded files.

> **Avoid pre-made ISOs from random websites.** They are often outdated, modified, or contain malware. Use one of the methods above.

---

## Step 3 — Install the VMware Unlocker

VMware blocks macOS as a guest OS on non-Apple hardware by default. The **Unlocker** patches VMware to enable it.

1. **Close VMware Workstation completely** — the unlocker cannot run while VMware is open.
2. Go to [github.com/DrDonk/unlocker/releases](https://github.com/DrDonk/unlocker/releases).
3. Download the latest release zip (currently **4.2.7**) — it will be named something like `unlocker427.zip`.
4. Extract the zip to a folder on your Desktop.
5. Open the `windows` folder inside the extracted files.
6. Right-click **`unlock.exe`** → **Run as administrator**.
7. A Command Prompt window will flash briefly and close. That is normal — it means it worked.
8. To verify it applied correctly, run **`check.exe`** from the same folder. It should say the patches are applied.

> **Antivirus warning:** Windows Defender and some antivirus tools flag `unlock.exe` as suspicious because it is compiled in Go and modifies system files. This is a false positive. If you want to verify, the source code is fully public on GitHub. Add the folder to your antivirus exclusions temporarily if needed.

> **Important:** If you update VMware Workstation in the future, the patches will be removed by the update. You must run `unlock.exe` again after every VMware update.

---

## Step 4 — Create the macOS Virtual Machine

1. Open **VMware Workstation Pro**.
2. Click **Create a New Virtual Machine**.
3. Select **Custom (Advanced)** and click **Next**.
4. On the hardware compatibility screen, select **Workstation 25H2** (or the latest shown) and click **Next**.
5. Select **I will install the operating system later** and click **Next**.
   - Do **not** point it at your ISO yet. This prevents VMware from running its own setup wizard which breaks macOS installs.
6. For Guest OS, select **Apple Mac OS X**.
7. For Version, select **macOS 15** (or macOS 14 if 15 is not listed — you can change it in settings later).
8. Name your VM (e.g. `macOS Sequoia`) and choose where to store it. Click **Next**.
9. Set processors: **2 processors**, **2 cores per processor** (4 total). Click **Next**.
10. Set RAM to **6144 MB** (6 GB) if you have 16 GB RAM, or **4096 MB** (4 GB) minimum. Click **Next**.
11. Network: leave as **NAT**. Click **Next**.
12. I/O Controller: leave as default **LSI Logic**. Click **Next**.
13. Disk type: leave as default **SATA**. Click **Next**.
14. Select **Create a new virtual disk**. Click **Next**.
15. Set disk size to **80 GB minimum** (100 GB recommended). Select **Store virtual disk as a single file**. Click **Next**.
16. Leave the disk filename as default. Click **Next** → **Finish**.

---

## Step 5 — Configure VM Settings

Before adding the ISO, open the VM settings:

1. Right-click your new VM → **Settings**.
2. Go to **CD/DVD (SATA)** → select **Use ISO image file** → browse to your `Sequoia.iso`.
3. Make sure **Connect at power on** is checked.
4. Click **OK**.

---

## Step 6 — Edit the VMX File (Critical)

This is the step most guides either skip or get wrong. Without these edits, macOS will either refuse to boot or detect it is running in a VM and block setup.

1. Navigate to the folder where you saved the VM (you chose this in Step 4).
2. Find the file ending in `.vmx` — right-click it and open with **Notepad** (or any text editor).
3. Scroll to the very **bottom** of the file and add these lines:

```
smc.version = "0"
smc.present = "TRUE"
board-id.reflectHost = "TRUE"
hw.model = "MacBookPro19,1"
hw.model.reflectHost = "FALSE"
serialNumber.reflectHost = "FALSE"
usb.generic.allowHID = "TRUE"
usb.generic.allowLastHID = "TRUE"
```

4. Save the file and close Notepad.

**What these do:**

| Line | Why it is needed |
|---|---|
| `smc.version = "0"` | Fixes SMC controller compatibility — without this macOS will not boot at all |
| `smc.present = "TRUE"` | Tells macOS an SMC chip is present (required) |
| `board-id.reflectHost` | Prevents VMware from passing the host PC's board ID to macOS |
| `hw.model` | Identifies the VM as a known Mac model to macOS |
| `usb.generic.allowHID` | Fixes keyboard and mouse not working in the VM |

---

## Step 7 — Install macOS Sequoia

1. Power on the VM in VMware.
2. You will see a black screen with Apple logo and progress bar — this is the macOS boot. Wait 1–3 minutes.
3. The **macOS Utilities** screen will appear.
4. Click **Disk Utility**.
5. In Disk Utility, select the **VMware Virtual SATA Hard Drive** from the left panel (it will show as unlabelled or ~80 GB).
6. Click **Erase** at the top.
   - Name: `Macintosh HD`
   - Format: **APFS**
   - Scheme: **GUID Partition Map**
7. Click **Erase** to confirm. Close Disk Utility when done.
8. Select **Install macOS Sequoia** and click **Continue**.
9. Accept the license agreement and select `Macintosh HD` as the destination.
10. Click **Install**.

Installation takes 20–45 minutes. The VM will reboot **two or three times** — this is normal. Leave it alone. After the final reboot you will reach the macOS Setup Assistant.

---

## Step 8 — macOS Initial Setup

Work through the setup screens:

- **Country/Region:** Select yours.
- **Accessibility:** Click Not Now.
- **Wi-Fi:** Select your network — NAT means your VM shares the host's internet connection, so this should work automatically. If not, skip for now.
- **Data & Privacy:** Continue.
- **Migration Assistant:** Select **Not Now**.
- **Apple ID:** You can sign in now or click **Set Up Later**. Skip for now if just testing.
- **Terms and Conditions:** Agree.
- **Create Account:** Set a username and password for the macOS account.
- **Location Services:** Your choice — disable for a test VM.
- **Time Zone:** Select yours.
- Disable **Share Mac Analytics**.
- **Screen Time:** Set Up Later.
- Select your appearance and click **Continue**.

You are now at the macOS Sequoia desktop.

---

## Step 9 — Install VMware Tools (Essential)

Without VMware Tools you will have a tiny fixed resolution, no clipboard sharing, and poor mouse behaviour.

1. In the VMware Workstation menu bar (on Windows, at the top of the VMware window), click **VM** → **Install VMware Tools**.
2. A disc icon will appear on the macOS desktop. Double-click it.
3. Double-click **Install VMware Tools** inside.
4. Click **Continue** → **Install** → enter your macOS password → **Install Software**.
5. macOS will say **System Extension Blocked**. Click **Open Privacy & Security Settings**.
6. In Security & Privacy, click **Allow** next to the VMware message.
7. Click **Restart** to complete the installation.

After restarting, the VM display will resize to fit your window, clipboard sharing between Windows and macOS will work, and mouse movement will be smooth.

---

## Step 10 — Fix Screen Resolution (If Still Wrong)

If the display does not resize properly after VMware Tools:

1. Open the macOS **Terminal** (Applications → Utilities → Terminal).
2. Run:

```bash
sudo /Library/Application\ Support/VMware\ Tools/vmware-resolutionSet 1920 1080
```

Replace `1920 1080` with your actual monitor resolution. You can also try:

```bash
sudo /Library/Application\ Support/VMware\ Tools/vmware-resolutionSet 2560 1440
```

Log out and back into macOS — the resolution will apply.

---

## AMD CPU — Extra Steps

macOS does not officially support AMD CPUs and requires an additional kernel patch to boot.

After completing Step 6 (editing the VMX file), add this extra line:

```
cpuid.0.eax = "0000:0000:0000:0000:0000:0000:0000:1011"
cpuid.0.ebx = "0111:0101:0110:1110:0110:0101:0100:0111"
cpuid.0.ecx = "0110:1100:0110:0101:0111:0100:0110:1110"
cpuid.0.edx = "0100:1001:0110:0101:0110:1110:0110:1001"
cpuid.1.eax = "0000:0000:0000:0001:0000:0110:0111:0001"
cpuid.1.ebx = "0000:0010:0000:0001:0000:1000:0000:0000"
cpuid.1.ecx = "1000:0010:1001:1000:0010:0010:0000:0011"
cpuid.1.edx = "0000:1111:1010:1011:1111:1011:1111:1111"
```

This makes macOS think it is running on an Intel CPU. Stability varies by AMD CPU generation — Ryzen 5000 series and newer generally work well.

---

## Troubleshooting

### Black screen after powering on the VM
The VMX edits are missing or wrong. Power off, open the VMX in Notepad, double-check the lines from Step 6 are at the bottom with no typos, save, and try again.

### macOS not listed as a guest OS option
The Unlocker did not apply. Close VMware completely, re-run `unlock.exe` as Administrator, then reopen VMware.

### VM boots to EFI shell (text screen with `Shell>`)
The ISO is not attached correctly. Go to VM Settings → CD/DVD → confirm the ISO path is correct and **Connect at power on** is checked.

### Stuck on Apple logo with no progress
This usually means not enough RAM or the VMX edits are missing. Give the VM at least 4 GB RAM and check Step 6.

### VMware Tools installer says "can't be opened"
Right-click **Install VMware Tools** → **Open** instead of double-clicking. Accept the security prompt.

### Screen stays small after VMware Tools
Use the Terminal command from Step 10 to force the resolution manually.

### Clipboard not working between Windows and macOS
VMware Tools must be fully installed and the VM must be restarted after installation. Check **VM** → **VMware Tools** in the menu to confirm they show as installed.

---

> **Summary:** Download VMware Workstation Pro 25H2u1 free from Broadcom, get a real macOS Sequoia ISO, run the DrDonk Unlocker as Administrator, create the VM with the correct settings, add the required VMX lines, install macOS, install VMware Tools. The VMX edits and the Unlocker are the two things every other guide either gets wrong or skips entirely.
