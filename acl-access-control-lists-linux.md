---
layout: default
title: "ACL — Access Control Lists on Linux"
parent: "Security & Apps"
nav_order: 10
---

# ACL — Access Control Lists on Linux

Standard Linux permissions only allow one owner, one group, and everyone else. ACLs let you grant specific permissions to any number of individual users or groups on a single file or directory without changing ownership or adding users to groups.

---

## Install

```bash
sudo apt install acl -y        # Ubuntu/Debian
sudo dnf install acl -y        # Fedora/RHEL
sudo pacman -S acl             # Arch
```

ACLs work natively on ext4, XFS, and Btrfs — no extra configuration needed on modern systems.

---

## View ACL Permissions

```bash
getfacl filename
getfacl /path/to/directory
```

When a file has ACL entries, `ls -la` shows a `+` at the end of the permissions string:
```
-rw-rw-r--+  1 alice  staff  1234 file.txt
```

---

## Set ACL Permissions

```bash
setfacl -m u:bob:rw file.txt          # give bob read/write
setfacl -m g:developers:r file.txt    # give developers group read
setfacl -m u:bob:rX /path/to/dir      # read/execute on directory
setfacl -m u:bob:rw,g:devs:r file.txt # multiple rules at once
```

Permission letters: `r` = read, `w` = write, `x` = execute, `X` = execute only if it is a directory or already executable by someone

---

## Default ACLs — Inherit Permissions Automatically

Default ACLs on a directory make all new files and subdirectories automatically inherit the specified permissions:

```bash
setfacl -d -m u:bob:rw /shared/folder     # new files give bob rw automatically
getfacl /shared/folder                     # view defaults
```

---

## Remove ACL Entries

```bash
setfacl -x u:bob file.txt       # remove bob's ACL entry
setfacl -x g:devs file.txt      # remove group ACL entry
setfacl -b file.txt             # remove ALL ACL entries
setfacl -k /path/to/dir         # remove default ACLs from directory
```

---

## Recursive

```bash
setfacl -R -m u:bob:rX /var/www              # apply recursively
setfacl -R -d -m u:bob:rX /var/www          # recursive + default
```

---

## Backup and Restore

```bash
getfacl -R /var/www > acl-backup.txt         # backup
setfacl --restore=acl-backup.txt             # restore
```

---

## Real Examples

```bash
# Developer needs read access to production logs without changing ownership
setfacl -m u:developer:r /var/log/app.log

# Web server needs to read a config file it does not own
setfacl -m u:www-data:r /etc/myapp/config.conf

# Multiple users with different permissions on shared directory
setfacl -m u:alice:rwX,u:bob:rwX,u:charlie:rX /shared/project
setfacl -d -m u:alice:rwX,u:bob:rwX,u:charlie:rX /shared/project
```

---

## Quick Reference

| Task | Command |
|---|---|
| View ACLs | `getfacl file` |
| Grant user | `setfacl -m u:user:rwx file` |
| Grant group | `setfacl -m g:group:rx file` |
| Default ACL | `setfacl -d -m u:user:rw dir` |
| Remove user ACL | `setfacl -x u:user file` |
| Remove all ACLs | `setfacl -b file` |
| Recursive | `setfacl -R -m u:user:rx dir` |
| Backup | `getfacl -R dir > backup.txt` |
| Restore | `setfacl --restore=backup.txt` |
