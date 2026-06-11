---
layout: default
title: "Run sudo Without a Password on macOS"
parent: "macOS"
nav_order: 42
---

# Run sudo Without a Password on macOS

For personal machines where you want to run sudo commands in scripts without password prompts, you can configure passwordless sudo for specific commands or your whole user.

> **This reduces security.** Only do this on a personal machine you control entirely. Never on a shared or work machine.

---

## Allow Your User to sudo Without Password

```bash
sudo visudo
```

Find the line:
```
%admin ALL=(ALL) ALL
```

Add below it:
```
yourusername ALL=(ALL) NOPASSWD: ALL
```

Save with **Ctrl+X → Y → Enter** (nano) or `:wq` (vim).

---

## Allow Only Specific Commands Without Password

More secure — only specific commands skip the password:

```bash
sudo visudo
```

Add:
```
yourusername ALL=(ALL) NOPASSWD: /usr/sbin/networksetup, /usr/bin/pkill
```

Only those specific commands will not prompt for a password.

---

## Allow Using Touch ID for sudo

On Macs with Touch ID, you can use your fingerprint instead of typing a password:

```bash
sudo nano /etc/pam.d/sudo_local
```

If the file does not exist:
```bash
sudo cp /etc/pam.d/sudo_local.template /etc/pam.d/sudo_local
```

Uncomment (remove `#`) from:
```
auth       sufficient     pam_tid.so
```

Save. Now `sudo` commands prompt for Touch ID instead of a password. If Touch ID fails, you can still type the password.

---

## Touch ID in iTerm2 / Third-Party Terminals

Touch ID for sudo only works in the built-in Terminal by default. To enable it in iTerm2 and other terminals, edit a different PAM file:

```bash
sudo nano /etc/pam.d/sudo
```

Add `auth sufficient pam_tid.so` as the first line after the comment block.

> Note: This file may be overwritten by macOS updates. The `sudo_local` approach above survives updates.

---

## Reset sudoers if You Broke It

If you made a typo in visudo and locked yourself out of sudo:

1. Restart in Recovery Mode (hold Cmd+R on Intel, power button on Apple Silicon)
2. Open Terminal from the Utilities menu
3. Mount the volume: `diskutil mountDisk /dev/disk0s1`
4. Edit the file: `nano /Volumes/Macintosh\ HD/etc/sudoers`
5. Remove your broken line
