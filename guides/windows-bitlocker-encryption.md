---
layout: default
title: "BitLocker Drive Encryption on Windows"
parent: "Windows"
nav_order: 13
---

# BitLocker Drive Encryption on Windows

BitLocker encrypts your entire drive. If someone steals your laptop, they cannot read your files without the PIN or recovery key.

---

## Enable BitLocker

**Control Panel → BitLocker Drive Encryption → Turn on BitLocker**

Or right-click the C: drive in File Explorer → **Turn on BitLocker**

**Requirements:**
- Windows 11 Pro, Enterprise, or Education
- A TPM 2.0 chip (most modern PCs have this)

---

## Save the Recovery Key

During setup, you must save or print the recovery key. Options:
- **Save to Microsoft account** (recommended — access at account.microsoft.com/devices/recoverykey)
- **Save to a USB drive**
- **Save to a file**
- **Print it**

Keep the recovery key somewhere safe. You will need it if:
- You change TPM settings in BIOS
- You enable/disable Secure Boot
- You change hardware
- You forget your PIN

---

## Set a PIN (Stronger Protection)

A PIN adds a pre-boot authentication step — the drive does not unlock until you enter the PIN:

```powershell
# Enable PIN requirement
manage-bde -protectors -add C: -TPMAndPIN
```

---

## Check BitLocker Status

```powershell
manage-bde -status C:
Get-BitLockerVolume    # PowerShell cmdlet
```

---

## Common Commands

```powershell
# Enable BitLocker with TPM only (no PIN)
Enable-BitLocker -MountPoint "C:" -EncryptionMethod XtsAes256 -TpmProtector

# Enable with PIN
Enable-BitLocker -MountPoint "C:" -EncryptionMethod XtsAes256 -TpmAndPinProtector

# Pause encryption (for maintenance)
Suspend-BitLocker -MountPoint "C:"

# Resume
Resume-BitLocker -MountPoint "C:"

# Disable BitLocker
Disable-BitLocker -MountPoint "C:"

# Get recovery key
(Get-BitLockerVolume -MountPoint "C:").KeyProtector | Where {$_.KeyProtectorType -eq "RecoveryPassword"} | Select RecoveryPassword
```

---

## BitLocker on External Drives (BitLocker To Go)

Right-click any external drive → **Turn on BitLocker**

This encrypts USB drives and external disks. They can be read on any Windows PC by entering the password. On macOS, use [BitLocker Anywhere](https://www.hasleo.com/bitlocker/) or free tools like BitLocker Drive Encryption on macOS.

---

## Windows 11 Home — Device Encryption

Windows 11 Home does not have full BitLocker but has "Device Encryption" if requirements are met:
Settings → Privacy & Security → Device Encryption → On

Less configurable than BitLocker but still encrypts the drive.
