---
layout: default
title: "ACL File Permissions on Linux (setfacl and getfacl)"
parent: "Security & Apps"
nav_order: 10
---

# ACL File Permissions on Linux (setfacl and getfacl)

Standard Linux permissions only allow one owner, one group, and "everyone else." ACLs (Access Control Lists) let you set permissions for specific users and groups independently — like giving a specific user read access to a file without changing its owner or adding them to the group.

---

## Check ACL Support

```bash
# Check if ACL tools are installed
getfacl --version

# Install if missing
sudo apt install acl -y        # Ubuntu/Debian
sudo dnf install acl -y        # Fedora/RHEL

# Check if filesystem supports ACLs (most modern ones do: ext4, XFS, Btrfs)
tune2fs -l /dev/sda1 | grep "Default mount options"
```

---

## View ACLs

```bash
getfacl filename
getfacl directory/
```

Files with ACLs show a `+` at the end of permissions in `ls -la`:
```
-rw-rwxr--+  1 alice  staff  0 Jan 1 12:00 file.txt
```

---

## Set ACLs

```bash
# Give a specific user read/write on a file
setfacl -m u:john:rw file.txt

# Give a specific group read access
setfacl -m g:developers:r file.txt

# Give a user full access
setfacl -m u:john:rwx file.txt

# Remove execute permission from others
setfacl -m o::r-- file.txt
```

Permission values: `r` = read, `w` = write, `x` = execute, `-` = none

---

## Recursive ACLs on Directories

```bash
# Apply to directory and all contents
setfacl -R -m u:john:rX /var/www/

# Capital X = execute only for directories (not files) — important for directories
setfacl -R -m u:john:rwX /project/
```

---

## Default ACLs (Inherited by New Files)

Default ACLs are applied to new files and directories created inside a directory.

```bash
# Set default ACL — new files will inherit these permissions
setfacl -d -m u:john:rw /shared/
setfacl -d -m g:developers:rwx /project/

# View default ACLs
getfacl /shared/
```

Output shows both regular and default entries:
```
# file: shared/
user::rwx
user:john:rw-
group::r-x
default:user::rwx
default:user:john:rw-
```

---

## Remove ACLs

```bash
# Remove a specific user's ACL
setfacl -x u:john file.txt

# Remove a specific group's ACL
setfacl -x g:developers file.txt

# Remove ALL ACLs from a file (back to standard permissions)
setfacl -b file.txt

# Remove all default ACLs from a directory
setfacl -k directory/

# Remove ACLs recursively
setfacl -R -b /directory/
```

---

## Backup and Restore ACLs

```bash
# Backup ACLs for a directory tree
getfacl -R /srv/www > acl-backup.txt

# Restore
setfacl --restore=acl-backup.txt
```

---

## Practical Examples

```bash
# Web server scenario: Nginx needs read, developers need read/write
setfacl -m u:www-data:rX /var/www/site/
setfacl -R -m u:www-data:rX /var/www/site/
setfacl -R -m g:webdevs:rwX /var/www/site/
setfacl -R -d -m g:webdevs:rwX /var/www/site/

# Log file: app writes, sysadmin reads, nobody else
setfacl -m u:appuser:rw /var/log/myapp.log
setfacl -m u:sysadmin:r /var/log/myapp.log
setfacl -m o::--- /var/log/myapp.log
```

---

## Quick Reference

| Task | Command |
|---|---|
| View ACLs | `getfacl file` |
| Give user rw | `setfacl -m u:user:rw file` |
| Give group rx | `setfacl -m g:group:rx file` |
| Recursive | `setfacl -R -m u:user:rX dir/` |
| Default (inherit) | `setfacl -d -m u:user:rw dir/` |
| Remove user ACL | `setfacl -x u:user file` |
| Remove all ACLs | `setfacl -b file` |
| Backup | `getfacl -R dir/ > backup.txt` |
| Restore | `setfacl --restore=backup.txt` |
