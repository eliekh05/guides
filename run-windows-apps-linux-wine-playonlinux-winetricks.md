---
layout: default
title: "Run Windows Apps on Linux with Wine, PlayOnLinux, and Winetricks"
parent: "Installation Guides"
nav_order: 20
---

# Run Windows Apps on Linux with Wine, PlayOnLinux, and Winetricks

Wine is not an emulator — it is a compatibility layer that translates Windows API calls into Linux system calls in real time. Windows apps run at near-native speed without a VM or Windows license. This guide covers Wine, Winetricks for installing dependencies, PlayOnLinux for a GUI, and Bottles as the modern alternative.

---

## Wine vs VM — When to Use Which

| | Wine | Virtual Machine (KVM/QEMU) |
|---|---|---|
| Performance | Near-native | Slightly slower |
| Windows license required | ❌ No | ✅ Yes |
| Compatibility | Most apps work; some do not | Full Windows compatibility |
| GPU/DirectX support | DirectX 11/12 via DXVK/VKD3D | Full (with passthrough) |
| Easy setup | ✅ Yes | Takes more work |
| Best for | Productivity apps, older games, tools | CAD, antivirus, apps that need full Windows |

**Use Wine if:** the app is on the [WineHQ AppDB](https://appdb.winehq.org) as Gold or Platinum compatibility.
**Use a VM if:** the app requires kernel-level drivers, antivirus functionality, or is rated Garbage/Broken on AppDB.

---

## Part 1 — Install Wine

### Ubuntu / Debian (Latest Wine from WineHQ)

The distro package is usually outdated. Install from WineHQ's official repo for the latest version:

```bash
# Enable 32-bit support (required for most Windows apps)
sudo dpkg --add-architecture i386
sudo apt update

# Add WineHQ signing key
wget -O- https://dl.winehq.org/wine-builds/winehq.key \
  | sudo gpg --dearmor -o /usr/share/keyrings/winehq-archive.key

# Add the repository (replace noble with your Ubuntu version codename)
echo "deb [arch=amd64,i386 signed-by=/usr/share/keyrings/winehq-archive.key] \
  https://dl.winehq.org/wine-builds/ubuntu/ $(lsb_release -cs) main" \
  | sudo tee /etc/apt/sources.list.d/winehq.list

# Install Wine stable
sudo apt update && sudo apt install --install-recommends winehq-stable -y
```

Verify:
```bash
wine --version
```

### Fedora / RHEL:

```bash
sudo dnf install winehq-stable
```

### Arch Linux:

Enable the `multilib` repository in `/etc/pacman.conf` (uncomment `[multilib]` section), then:
```bash
sudo pacman -S wine wine-gecko wine-mono
```

---

## Part 2 — First-Time Wine Setup

On first run, Wine creates a "wineprefix" — a fake Windows environment in `~/.wine`. Set it up:

```bash
winecfg
```

A dialog will appear asking to install `wine-gecko` (for Internet Explorer) and `wine-mono` (for .NET apps) — accept both.

In the **winecfg** window:
- **Windows Version tab:** Set to **Windows 10** for most modern apps
- **Graphics tab:** Check **Allow the window manager to decorate windows** and **Allow the window manager to control the windows**

Click **Apply** → **OK**.

---

## Part 3 — Install a Windows App

Download the Windows `.exe` installer and run it with Wine:

```bash
wine ~/Downloads/setup.exe
```

Wine will run the installer as if it were on Windows. Follow it normally.

Installed apps appear in `~/.wine/drive_c/Program Files/`.

To run an installed app:
```bash
wine ~/.wine/drive_c/Program\ Files/AppName/AppName.exe
```

Or right-click the `.exe` in your file manager and select **Open with Wine**.

---

## Part 4 — Install Winetricks

Winetricks installs Windows libraries and runtimes that many apps need — .NET Framework, Visual C++ redistributables, DirectX, fonts, and more.

```bash
# Install winetricks
sudo apt install winetricks -y  # Ubuntu/Debian

# Or download the latest version directly (recommended — distro version often outdated)
wget https://raw.githubusercontent.com/Winetricks/winetricks/master/src/winetricks
chmod +x winetricks
sudo mv winetricks /usr/local/bin/
```

### Install common dependencies with Winetricks

```bash
# .NET Framework 4.8 (needed by many apps)
winetricks dotnet48

# Visual C++ 2019 runtime (needed by most modern apps)
winetricks vcrun2019

# DirectX 9 (older games)
winetricks d3dx9

# Core Windows fonts (fixes font rendering issues)
winetricks corefonts

# Multiple things at once
winetricks dotnet48 vcrun2019 vcrun2022 corefonts d3dx9
```

### Open Winetricks GUI

```bash
winetricks --gui
```

A menu appears where you can select and install components without memorising names.

---

## Part 5 — Wine Prefixes (Run Different Apps in Isolation)

Each app may need different Windows settings or library versions. Wine **prefixes** are isolated Windows environments — like separate Windows installations for each app.

```bash
# Create a prefix for a specific app
WINEPREFIX=~/.wine-myapp winecfg

# Install an app into that prefix
WINEPREFIX=~/.wine-myapp wine setup.exe

# Install Winetricks components into that prefix
WINEPREFIX=~/.wine-myapp winetricks dotnet48

# Run the app from that prefix
WINEPREFIX=~/.wine-myapp wine ~/.wine-myapp/drive_c/Program\ Files/MyApp/myapp.exe
```

This is essential when one app needs .NET 4.8 and another needs .NET 3.5 — they would conflict in the same prefix.

---

## Part 6 — PlayOnLinux (GUI for Wine)

PlayOnLinux provides a friendly GUI that manages Wine versions and prefixes automatically. It has pre-configured installation scripts for many popular apps.

```bash
sudo apt install playonlinux -y  # Ubuntu/Debian
```

Launch it:
```bash
playonlinux
```

**Install an app:**
1. Click **Install a program** → search for your app
2. If a script exists, select it — it will configure Wine automatically
3. If no script exists, click **Install a non-listed program** and follow the manual wizard

PlayOnLinux handles creating prefixes, selecting the right Wine version, and installing dependencies automatically for supported apps.

---

## Part 7 — Bottles (Modern Alternative to PlayOnLinux)

Bottles is a newer, more polished Wine prefix manager available as a Flatpak. It has a cleaner UI than PlayOnLinux and is actively maintained.

```bash
# Install via Flatpak (works on any distro)
flatpak install flathub com.usebottles.bottles
flatpak run com.usebottles.bottles
```

**Create a bottle:**
1. Click **+** → name it → choose an environment:
   - **Application:** for productivity software
   - **Gaming:** pre-configured for games with DXVK enabled
2. Install your `.exe` from the bottle's interface
3. Each bottle is isolated — no conflicts between apps

---

## Part 8 — DXVK for DirectX Gaming

DXVK translates DirectX 9/10/11 calls to Vulkan, dramatically improving gaming performance in Wine.

```bash
# Install DXVK into your default wine prefix
winetricks dxvk
```

Or install it manually:
```bash
# Download DXVK
wget https://github.com/doitsujin/dxvk/releases/latest/download/dxvk-*.tar.gz
tar xf dxvk-*.tar.gz
cd dxvk-*/
./setup_dxvk.sh install
```

For DirectX 12 games, use **VKD3D-Proton**:
```bash
winetricks vkd3d
```

---

## Check App Compatibility Before Installing

Always check [appdb.winehq.org](https://appdb.winehq.org) before spending time configuring an app:

| Rating | Meaning |
|---|---|
| **Platinum** | Works out of the box, no tweaks needed |
| **Gold** | Works with minor configuration |
| **Silver** | Works with significant workarounds |
| **Bronze** | Runs but has major issues |
| **Garbage** | Does not work — use a VM instead |

---

## Troubleshooting

### App crashes immediately with no error
Run from terminal to see the error output:
```bash
wine /path/to/app.exe 2>&1 | less
```

### Missing DLL errors
Install the missing library via Winetricks:
```bash
winetricks --search dll_name
# Then install it
winetricks vcrun2019  # or whatever matches
```

### App window is tiny (DPI issue)
In `winecfg` → **Graphics** tab → increase **Screen Resolution (DPI)** to match your display.

### Font rendering looks bad
```bash
winetricks corefonts
winetricks tahoma
```

### App needs a different Windows version
```bash
# In winecfg, or set per-app:
WINEPREFIX=~/.wine-myapp winetricks winxp  # for very old apps
WINEPREFIX=~/.wine-myapp winetricks win7   # for apps that need Win7
WINEPREFIX=~/.wine-myapp winetricks win10  # default, for modern apps
```

### Sound not working
```bash
winetricks sound=alsa
# or
winetricks sound=pulse
```
