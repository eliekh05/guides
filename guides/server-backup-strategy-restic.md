---
layout: default
title: "Automated Backups with restic"
parent: "Server & Self-Hosting"
nav_order: 30
---

# Automated Backups with restic

restic is a modern backup tool — fast, encrypted, deduplicated, and supports multiple storage backends (local, S3, Backblaze B2, SFTP, etc.).

---

## Install

```bash
sudo apt install restic -y          # Ubuntu/Debian
sudo dnf install restic -y          # Fedora/RHEL
brew install restic                 # macOS
```

---

## Initialise a Repository

```bash
# Local repository
restic init --repo /mnt/backup/restic

# Backblaze B2
restic init --repo b2:mybucket:restic

# AWS S3
AWS_ACCESS_KEY_ID=key AWS_SECRET_ACCESS_KEY=secret \
  restic init --repo s3:s3.amazonaws.com/mybucket/restic

# SFTP (SSH)
restic init --repo sftp:user@server:/backup/restic
```

Set a strong encryption passphrase when prompted. **Store this passphrase securely — without it, backups cannot be decrypted.**

---

## Back Up Files

```bash
# Back up a directory
restic -r /mnt/backup/restic backup ~/Documents

# Back up multiple paths
restic -r /mnt/backup/restic backup ~/Documents ~/Pictures /etc

# Exclude patterns
restic -r /mnt/backup/restic backup ~/ \
  --exclude ~/.cache \
  --exclude ~/Downloads \
  --exclude node_modules
```

---

## List Snapshots

```bash
restic -r /mnt/backup/restic snapshots
```

---

## Restore

```bash
# Restore latest snapshot to a directory
restic -r /mnt/backup/restic restore latest --target /restore/

# Restore specific snapshot
restic -r /mnt/backup/restic restore abc12345 --target /restore/

# Restore single file
restic -r /mnt/backup/restic restore latest --target /tmp/ --include "/home/user/important.txt"
```

---

## Prune Old Snapshots

```bash
# Keep 7 daily, 4 weekly, 6 monthly snapshots
restic -r /mnt/backup/restic forget --prune \
  --keep-daily 7 \
  --keep-weekly 4 \
  --keep-monthly 6
```

---

## Automate with cron

```bash
nano /usr/local/bin/restic-backup.sh
```

```bash
#!/bin/bash
export RESTIC_REPOSITORY=/mnt/backup/restic
export RESTIC_PASSWORD=yourpassphrase

restic backup /home /etc --exclude /home/*/.cache
restic forget --prune --keep-daily 7 --keep-weekly 4 --keep-monthly 6
restic check
```

```bash
chmod +x /usr/local/bin/restic-backup.sh
crontab -e
# Add:
0 2 * * * /usr/local/bin/restic-backup.sh >> /var/log/restic.log 2>&1
```

---

## Check Repository Integrity

```bash
restic -r /mnt/backup/restic check
restic -r /mnt/backup/restic check --read-data     # verify all data (slow)
```
