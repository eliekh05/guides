---
layout: default
title: "Fix 'User is Not in the Sudoers File' on Linux"
parent: "macOS & Linux"
nav_order: 28
---

# Fix "User is Not in the Sudoers File" on Linux

When you run `sudo` and see:

```
username is not in the sudoers file. This incident will be reported.
```

Your user account does not have permission to use `sudo`. The fix depends on whether you have root access or not.

> **"This incident will be reported"** — this just means the failed attempt is logged to `/var/log/auth.log` (Debian/Ubuntu) or `/var/log/secure` (Fedora/RHEL). Nothing bad happens. It is a warning, not a threat.

---

## Before You Start — Which Group Does Your Distro Use?

| Distro | sudo group name |
|---|---|
| Ubuntu, Debian, Linux Mint, Pop!_OS | `sudo` |
| Fedora, RHEL, CentOS, AlmaLinux, Rocky | `wheel` |
| Arch Linux | `wheel` (must be enabled in sudoers first) |
| Void Linux | `wheel` |

---

## Method 1 — Add User to the sudo Group (Easiest, Recommended)

### If you have root access or another sudo user on the machine:

Switch to root or another sudo-capable user, then run:

**Ubuntu / Debian / Linux Mint:**
```bash
usermod -aG sudo username
```

**Fedora / RHEL / CentOS / Arch / Void:**
```bash
usermod -aG wheel username
```

Replace `username` with the actual username.

Then **log out and back in** — group changes do not take effect until the next login.

To apply immediately without logging out:
```bash
newgrp sudo    # Ubuntu/Debian
newgrp wheel   # Fedora/Arch
```

Verify it worked:
```bash
groups username
sudo whoami    # should print: root
```

---

## Method 2 — Edit sudoers with visudo (For Specific User Permissions)

> **Never edit `/etc/sudoers` directly with nano or vim.** If you introduce a typo, sudo stops working for everyone including root. Always use `visudo` — it validates the file before saving.

As root:
```bash
visudo
```

Find the line:
```
root    ALL=(ALL:ALL) ALL
```

Add your user directly below it:
```
root        ALL=(ALL:ALL) ALL
yourusername ALL=(ALL:ALL) ALL
```

Save and exit (`Ctrl+X → Y → Enter` in nano, or `:wq` in vim).

**What `ALL=(ALL:ALL) ALL` means:**
- First `ALL` — applies to all hosts
- `(ALL:ALL)` — can run commands as any user and any group
- Last `ALL` — can run all commands

### Alternatively, add to `/etc/sudoers.d/` (Cleaner)

Instead of editing the main sudoers file, create a new file in the drop-in directory:

```bash
echo "yourusername ALL=(ALL:ALL) ALL" > /etc/sudoers.d/yourusername
chmod 440 /etc/sudoers.d/yourusername
```

This keeps the main sudoers file untouched and is easier to reverse.

---

## Method 3 — Fresh Debian Install (sudo Not Installed or User Not Added)

Debian's installer creates a root account separately and does not add your user to sudo by default — unlike Ubuntu which makes the first user a sudo member automatically. This is the most common cause on fresh Debian setups.

Switch to root:
```bash
su -
```

Install sudo if missing:
```bash
apt update && apt install sudo -y
```

Add your user:
```bash
usermod -aG sudo yourusername
```

Log out and back in.

---

## Method 4 — Locked Out Completely (No Root Access, No sudo Users)

If you have no root password and no other sudo user, you need to boot into recovery mode.

### Ubuntu / Debian — Recovery Mode

1. Restart the machine.
2. Hold **Shift** (Ubuntu) or press **Esc** repeatedly (Debian) during boot to show the GRUB menu.
3. Select **Advanced options** → **recovery mode**.
4. In the recovery menu, select **root — Drop to root shell prompt**.
5. Remount the filesystem as writable:
   ```bash
   mount -o remount,rw /
   ```
6. Add your user to sudo:
   ```bash
   usermod -aG sudo yourusername
   ```
7. Type `exit` → select **resume** to reboot.

### Fedora / RHEL — Single User Mode

1. Restart and hold **Shift** at boot to open GRUB.
2. Press **e** on the default entry.
3. Find the line starting with `linux` and add `single` or `init=/bin/bash` at the end.
4. Press **Ctrl+X** to boot.
5. Remount if needed: `mount -o remount,rw /`
6. Run `usermod -aG wheel yourusername`
7. Reboot: `exec /sbin/init`

---

## Method 5 — Broken sudoers File (Syntax Error)

If you edited `/etc/sudoers` directly and introduced an error, sudo is broken for everyone. Fix it:

### If you can still `su` to root:

```bash
su -
visudo -f /etc/sudoers   # Opens the broken file with syntax checking
```

Fix the syntax error, save. Sudo will work again immediately.

### If you cannot `su` either (badly locked out):

Boot into recovery mode (Method 4) and run:

```bash
visudo -f /etc/sudoers
```

Or restore from backup if one exists:
```bash
cp /etc/sudoers.bak /etc/sudoers
```

---

## Troubleshooting

### Added user to group but still getting the error
You need to log out and back in. The group membership update does not apply to already-running sessions. Confirm the user is in the group:
```bash
groups yourusername
```

### `su: Authentication failure` when trying to switch to root
The root account may be locked (Ubuntu locks it by default). Use recovery mode (Method 4) instead.

### `visudo: /etc/sudoers: Permission denied`
You are not running as root. Run `su -` first, then `visudo`.

### `sudo: sudo must be owned by uid 0 and have the setuid bit set`
The sudo binary's permissions are wrong. From a root shell:
```bash
chown root:root /usr/bin/sudo
chmod 4755 /usr/bin/sudo
```
