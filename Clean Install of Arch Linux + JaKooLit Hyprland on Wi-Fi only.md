# 🖥️ Arch Linux + Hyprland Installation Guide (Wi-Fi Only)

> ⚠️ **Note:** Arch Linux 2026 versions the `archinstall` menus have changed and can be unpredictable.
> This guide keeps the original installation instructions for stability and accuracy.
> For step-by-step prompts, follow the installer menus carefully — options may differ slightly from newer releases.
>
> 💡 **Tip:** If you want to follow this guide exactly as written, you can download the same Arch Linux version used here: **archlinux-2025.11.01** download link in requirements part.

This guide walks you through installing **Arch Linux** on bare metal and setting up **Hyprland** with Wi-Fi.
All instructions use **official Arch Linux tools** and the **Hyprland automated installer** by [JaKooLit](https://github.com/JaKooLit/Arch-Hyprland).



## 🧰 Requirements

* **Wi-Fi connection** (recommended)
* **Arch Linux ISO:** [Torrent Download](https://archlinux.org/releng/releases/2025.11.01/torrent/) or
  `magnet:?xt=urn:btih:d4487f489d4ee786f99bcdeeb8d3f226694ea27f&dn=archlinux-2025.11.01-x86_64.iso`
* **Torrent client:** [Free Download Manager](https://freedownloadmanager.org) or any torrent/magnet client
* **Hyprland installer:** [https://github.com/JaKooLit/Arch-Hyprland](https://github.com/JaKooLit/Arch-Hyprland)
* **Balena Etcher:** [https://etcher.balena.io/#download-etcher](https://etcher.balena.io/#download-etcher)
* **USB drive:** at least **16 GB**



## 🔧 Prepare the Arch Linux USB

You can create the bootable USB on **Windows**, **macOS**, or **Linux**:

1. Download the Arch Linux ISO using your torrent client.
2. Open **Balena Etcher** → click **Flash from File**, then select your ISO.
3. Click **Select Target**, choose your USB drive, and press **Flash**.

   * On **macOS**, enter your admin password.
   * On **Windows**, approve the UAC prompt.
   * On **Linux**, enter your sudo password.

After flashing, your USB is ready to boot.



## 💻 Boot from USB

1. Insert the USB drive into your target computer.
2. Power it on and enter the **Boot Menu** (key varies by manufacturer — often `F12`, `F9`, `ESC`, or `DEL`).
3. Select your USB drive and press **Enter**.
4. At the GRUB menu, choose the first option to boot into the live environment.



## 📶 Connect to Wi-Fi

In the live shell, start the interactive Wi-Fi tool:

```bash
iwctl
```

Inside `iwctl`, run:

```bash
station <your_interface> get-networks
station <your_interface> connect <SSID>
# For hidden networks:
# station <your_interface> connect-hidden <SSID>
exit
```

Back in the normal shell, verify your interface:

```bash
ip a
```

Then request an IP address:

```bash
dhclient <INTERFACE_NAME>
# or use dhcpcd or another DHCP client that is installed
```



## ⚙️ Install Arch Linux

Start the guided installer:

```bash
archinstall
```

Follow the prompts to configure your system:

| Setting                  | Recommended Option       |
| ------------------------ | ------------------------ |
| Language                 | English                  |
| Keyboard layout          | us                       |
| Mirror selection         | Your region or automatic |
| Locale                   | en_US.UTF-8              |
| Disk                     | Internal SSD/HDD         |
| Bootloader               | GRUB                     |
| Swap                     | Yes                      |
| Hostname                 | Your choice              |
| Root password            | Your choice              |
| User account             | Your choice              |
| Profile                  | None                     |
| Audio                    | PulseAudio               |
| Kernel                   | Linux                    |
| Extra packages           | None                     |
| Network config           | As desired               |
| Timezone                 | Your timezone            |
| Automatic timesync (NTP) | Yes                      |
| Optional repositories    | None                     |

After verifying your selections, click **Install** and wait until the process completes.



## 🎨 Set Up Hyprland

After rebooting and logging into your new Arch Linux installation, run:

```bash
sh <(curl -L https://raw.githubusercontent.com/JaKooLit/Arch-Hyprland/main/auto-install.sh)
```

Follow the on-screen instructions.
When you reach the **package selection screen**, choose the following options for a complete Hyprland setup:

| Option      | Setting |
| ----------- | ------- |
| gtk_themes  | ON      |
| bluetooth   | ON      |
| thunar      | ON      |
| quickshell  | ON      |
| sddm        | ON      |
| sddm_theme  | ON      |
| xdph        | ON      |
| zsh         | ON      |
| pokemon     | ON      |
| rog         | OFF     |
| dots        | ON      |
| input_group | ON      |
| nvidia      | ON      |
| nouveau     | ON      |

> 💡 **Tip:** Press **Space** to select a package and **Enter/Return** to confirm when using the JaKooLit installer.
> The installer will display available packages — match them to the list above.

During the process:

* When asked about downloading the 1 GB wallpaper bank → **Choose “No”**
* For rainbow wallpapers → **Choose “Yes”**

After completion, reboot your system.



## 🎉 Congratulations!

You now have **Hyprland** running on a clean **Arch Linux** installation with **Wi-Fi fully configured**.
Enjoy your lightweight, modern, and fully customizable Linux experience! 🚀
