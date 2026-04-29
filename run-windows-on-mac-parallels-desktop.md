---
layout: default
title: "Run Windows on Mac with Parallels Desktop"
parent: "Installation Guides"
nav_order: 12
---

# Run Windows on Mac with Parallels Desktop

Parallels Desktop is the most polished and easiest way to run Windows on a Mac — both Intel and Apple Silicon. Unlike VMware Fusion (which requires manual setup) or Boot Camp (Intel only, native dual boot), Parallels handles almost everything automatically including downloading Windows for you.

The trade-off is cost: Parallels is a paid subscription. This guide covers what you get, how to set it up, and when it is worth it versus the free alternatives.

---

## Parallels vs Free Alternatives

| | Parallels Desktop | VMware Fusion | Boot Camp |
|---|---|---|---|
| Cost | ~$100/year (Standard) | Free | Free |
| Apple Silicon support | ✅ | ✅ | ❌ |
| Intel Mac support | ✅ | ✅ | ✅ |
| Ease of setup | ⭐⭐⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐ |
| Performance | Excellent | Very good | Native (best) |
| DirectX support | DirectX 12 | DirectX 11 | Native |
| Auto-downloads Windows | ✅ | ❌ | ❌ |
| macOS/Windows integration | Best in class | Good | None (separate boots) |
| Coherence mode (no VM window) | ✅ | ❌ | ❌ |

**Choose Parallels if:** you want the easiest setup, best integration, or need DirectX 12 gaming.
**Choose VMware Fusion if:** you want free and are comfortable with more manual setup.
**Choose Boot Camp if:** you are on Intel Mac and need native Windows performance.

---

## Requirements

- A Mac running macOS 13 (Ventura) or later
- At least **8 GB RAM** (16 GB recommended)
- At least **60 GB free disk space**
- A Parallels Desktop subscription (see pricing below)

---

## Parallels Editions

| Edition | Price | Best for |
|---|---|---|
| Standard | ~$100/year or ~$130 one-time | Home use, basic Windows apps |
| Pro | ~$120/year | Developers, heavy workloads, more RAM/CPU allocation |
| Business | ~$150/year per user | Teams, centralised management |

Student and education discounts are available. Check [parallels.com/education](https://www.parallels.com/education/) for pricing.

---

## Step 1 — Download and Install Parallels Desktop

1. Go to [parallels.com](https://www.parallels.com) and click **Try Free** (14-day trial available) or purchase a subscription.
2. Download the installer and open the `.dmg`.
3. Double-click **Install Parallels Desktop** and follow the prompts.
4. When asked to sign in, create a Parallels account or sign in — this is required to activate the software.

---

## Step 2 — Install Windows (Automatic Method)

Parallels can download and install Windows automatically — you do not need to find an ISO.

1. Open **Parallels Desktop**.
2. Click **+** → **New**.
3. Parallels will show **Install Windows 11**. Click **Install Windows**.
4. Parallels downloads Windows 11 (ARM on Apple Silicon, x86 on Intel) directly from Microsoft. About 5–7 GB — this takes 10–30 minutes.
5. Follow the setup wizard. Windows installs automatically.

> **On Apple Silicon:** Parallels downloads Windows 11 ARM automatically. Most regular Windows apps work via the built-in ARM emulation layer.
> **On Intel Mac:** Parallels installs the standard x86 Windows 11 — full compatibility.

---

## Step 3 — Install Windows (Manual ISO Method)

If you already have a Windows ISO:

1. Open **Parallels Desktop** → **+** → **New**.
2. Select **Install Windows or another OS from a DVD or image file**.
3. Click **Continue** and select your ISO file.
4. Parallels will detect the OS and configure the VM.
5. Follow the installation wizard.

---

## Step 4 — Parallels Tools (Installs Automatically)

Parallels Tools are the equivalent of VMware Tools — they enable display scaling, clipboard sharing, drag and drop, and deep macOS integration. Unlike VMware, **Parallels Tools install automatically** during Windows setup. You do not need to do anything.

---

## Key Features

### Coherence Mode
The most unique Parallels feature — Windows apps appear directly on your macOS desktop without any VM window. Windows apps show in the Dock and run like native Mac apps.

- To enable: go to **View** → **Coherence** (or press Ctrl+Command+C).
- Windows apps appear in your macOS Applications folder under a Windows folder.
- The Windows desktop is hidden — just the apps are visible.

### Shared Profile
Parallels maps your macOS Desktop, Documents, Downloads, and Pictures folders into Windows automatically. Files you save in Windows appear in macOS and vice versa — no manual folder sharing needed.

### Snapshots
Take a snapshot before installing software or making risky changes:
- Go to **Actions** → **Take Snapshot**.
- To restore: **Actions** → **Manage Snapshots** → select a snapshot → **Restore**.

### Adjust Resources
To change RAM, CPU, or disk:
1. Shut down Windows.
2. Go to **Parallels Desktop** → **Settings** → **Hardware**.
3. Adjust CPU, Memory, and Graphics as needed.

---

## Performance Tips

- **Give Windows at least 4 GB RAM** — 6–8 GB if you have 16 GB or more on your Mac.
- **Use SSD storage** — Parallels VMs on spinning hard drives are very slow.
- **Enable Adaptive Hypervisor** (Pro edition): Parallels → Preferences → Advanced → Adaptive Hypervisor — dynamically allocates more resources to macOS when Windows is idle and vice versa.
- **Pause Windows when not in use** rather than leaving it running — saves battery and RAM.
- **Disable Windows visual effects** inside Windows for better performance: right-click **This PC** → **Properties** → **Advanced system settings** → **Performance Settings** → **Adjust for best performance**.

---

## Troubleshooting

### "Your trial has expired" before 14 days
Sign in to your Parallels account inside the app — the trial counter resets if you are signed in.

### Windows activation fails
On Apple Silicon with Windows 11 ARM, activation uses your Microsoft account rather than a product key. Sign in to a Microsoft account during Windows setup to activate automatically.

### Windows apps are slow on Apple Silicon
This is normal for x86 apps running through the ARM emulation layer — particularly older 32-bit apps. Native ARM Windows apps (which most major apps now have) run at full speed.

### Cannot allocate more than 8 GB RAM to Windows
You are on the Standard edition — it has a RAM cap. Upgrade to Pro for higher limits.

### Coherence mode — Windows taskbar still visible
Go to **View** → **Coherence** again to toggle it off and back on. Or restart Windows and re-enable Coherence.

### Drag and drop between macOS and Windows not working
Go to **Parallels Desktop** → **Settings** → **Options** → **Sharing** → make sure **Share Mac clipboard** and **Share Mac volumes with Windows** are enabled.

---

## Cancelling or Migrating Away from Parallels

If you decide Parallels is not for you after the trial:

- **Cancel subscription:** log in at [my.parallels.com](https://my.parallels.com) → Subscriptions → Cancel.
- **Keep using Windows without Parallels:** export your VM as a `.pvm` file (**File** → **Export**) and import it into VMware Fusion later. Note that Parallels `.pvm` format is not directly compatible with VMware — you may need to reinstall Windows from scratch in VMware.
- **Your Windows license is separate from Parallels** — if you purchased a Windows license, you can use it on any other VM software.
