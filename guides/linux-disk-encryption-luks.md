---
layout: default
title: "LUKS Disk Encryption on Linux"
parent: "Security & Apps"
nav_order: 19
---

# LUKS Disk Encryption on Linux

LUKS (Linux Unified Key Setup) is the standard disk encryption for Linux. It encrypts entire partitions — the contents are unreadable without the passphrase.

---

## Encrypt a New Partition

> Encrypting a disk destroys existing data. Do this on a blank partition.

```bash
# Install cryptsetup
sudo apt install cryptsetup -y

# Encrypt the partition (replace /dev/sdb1 with your partition)
sudo cryptsetup luksFormat /dev/sdb1
# Type YES in capitals when prompted
# Set a strong passphrase

# Open (decrypt) the partition
sudo cryptsetup open /dev/sdb1 encrypted_disk

# Format the decrypted volume
sudo mkfs.ext4 /dev/mapper/encrypted_disk

# Mount
sudo mkdir /mnt/secure
sudo mount /dev/mapper/encrypted_disk /mnt/secure
```

---

## Close an Encrypted Volume

```bash
sudo umount /mnt/secure
sudo cryptsetup close encrypted_disk
```

---

## Auto-Mount at Boot (/etc/crypttab and /etc/fstab)

```bash
# Get UUID of the encrypted partition
sudo blkid /dev/sdb1

# Add to /etc/crypttab
# name    device              keyfile  options
encrypted_disk  UUID=abc123  none     luks

# Add to /etc/fstab
/dev/mapper/encrypted_disk  /mnt/secure  ext4  defaults  0  2
```

At boot it will ask for the passphrase. For automatic unlock, use a keyfile instead of `none`.

---

## Add a Keyfile (For Automated Unlocking)

```bash
# Generate a keyfile
sudo dd if=/dev/urandom of=/etc/luks-keyfile bs=512 count=8
sudo chmod 400 /etc/luks-keyfile

# Add keyfile as an unlock method
sudo cryptsetup luksAddKey /dev/sdb1 /etc/luks-keyfile

# Update crypttab to use keyfile
# encrypted_disk  UUID=abc123  /etc/luks-keyfile  luks
```

---

## LUKS Header Backup

The LUKS header stores encryption metadata. If it gets corrupted, all data is lost:

```bash
sudo cryptsetup luksHeaderBackup /dev/sdb1 --header-backup-file luks-header-backup.img
# Store this somewhere safe (NOT on the encrypted partition)
```

Restore header:
```bash
sudo cryptsetup luksHeaderRestore /dev/sdb1 --header-backup-file luks-header-backup.img
```

---

## Manage Passphrases

LUKS supports up to 8 passphrases/keyfiles (key slots):

```bash
# Add a new passphrase
sudo cryptsetup luksAddKey /dev/sdb1

# Remove a passphrase
sudo cryptsetup luksRemoveKey /dev/sdb1

# Change a passphrase
sudo cryptsetup luksChangeKey /dev/sdb1

# View key slots
sudo cryptsetup luksDump /dev/sdb1
```

---

## Check LUKS Info

```bash
sudo cryptsetup luksDump /dev/sdb1     # full info
sudo cryptsetup status encrypted_disk  # status when open
```
