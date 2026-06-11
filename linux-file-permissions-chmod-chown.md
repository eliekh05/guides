---
layout: default
title: "Linux File Permissions — chmod, chown, chgrp Explained"
parent: "Linux"
nav_order: 39
---

# Linux File Permissions — chmod, chown, chgrp Explained

---

## Read the Permission String

```
-rwxr-xr--  1  alice  staff  4096  Jan 1  file.txt
```

| Part | Meaning |
|---|---|
| `-` | File type: `-` = file, `d` = directory, `l` = symlink |
| `rwx` | Owner permissions: read, write, execute |
| `r-x` | Group permissions: read, no write, execute |
| `r--` | Others permissions: read only |
| `alice` | Owner |
| `staff` | Group |

---

## chmod — Change Permissions

### Symbolic mode (easier to read)

```bash
chmod u+x file.sh          # add execute for owner
chmod g-w file.txt         # remove write from group
chmod o=r file.txt         # set others to read only
chmod a+r file.txt         # add read for all (u+g+o)
chmod u+x,g+r file.sh      # multiple changes at once
chmod -R 755 /var/www/     # recursive
```

- `u` = user (owner)
- `g` = group
- `o` = others
- `a` = all three
- `+` = add, `-` = remove, `=` = set exactly

### Numeric mode (faster once you know it)

Each permission has a value: `r=4`, `w=2`, `x=1`

Add them up for each category: owner / group / others

```bash
chmod 755 file    # rwxr-xr-x  (owner: all, group: r+x, others: r+x)
chmod 644 file    # rw-r--r--  (owner: r+w, group: r, others: r)
chmod 600 file    # rw-------  (owner: r+w only)
chmod 777 file    # rwxrwxrwx  (everyone everything — avoid this)
chmod 700 dir/    # rwx------  (owner only, required for SSH keys folder)
```

Common values:
- `7` = rwx (4+2+1)
- `6` = rw- (4+2)
- `5` = r-x (4+1)
- `4` = r-- (4)
- `0` = --- (none)

### Recursive

```bash
chmod -R 755 /var/www/
chmod -R u+rwX,go+rX /shared/   # Capital X = execute only on directories
```

---

## chown — Change Owner

```bash
chown alice file.txt               # change owner to alice
chown alice:staff file.txt         # change owner and group
chown :staff file.txt              # change group only
chown -R alice /home/alice/        # recursive
sudo chown root:root /etc/hosts    # system files need sudo
```

---

## chgrp — Change Group

```bash
chgrp developers file.txt
chgrp -R developers /project/
```

---

## Special Permissions

### Setuid (s on owner execute bit)

Executable runs as the file's owner, not the user who ran it:
```bash
chmod u+s /usr/bin/program
# Shows as: -rwsr-xr-x
```

### Setgid (s on group execute bit)

On a directory: new files inherit the directory's group instead of creator's group:
```bash
chmod g+s /shared/project/
# Shows as: drwxr-sr-x
```

### Sticky bit (t on others execute bit)

On a directory: only the file owner can delete their own files:
```bash
chmod +t /tmp
chmod 1777 /tmp
# Shows as: drwxrwxrwt
```

---

## Default Permissions — umask

`umask` sets the default permissions subtracted from `666` for files and `777` for directories.

```bash
umask          # view current umask
umask 022      # common default: files=644, dirs=755
umask 002      # group-write friendly: files=664, dirs=775
```

Set permanently in `~/.zprofile` or `~/.bashrc`:
```bash
echo "umask 022" >> ~/.zprofile
```

---

## Quick Reference

| Permission | Files | Directories |
|---|---|---|
| `r` (4) | Read file contents | List directory contents |
| `w` (2) | Modify file | Create/delete files inside |
| `x` (1) | Execute file | Enter directory (cd) |

| Numeric | Symbolic | Meaning |
|---|---|---|
| 777 | rwxrwxrwx | Everyone can do everything |
| 755 | rwxr-xr-x | Owner full, rest read+execute |
| 644 | rw-r--r-- | Owner read/write, rest read |
| 700 | rwx------ | Owner only |
| 600 | rw------- | Owner read/write only |
| 400 | r-------- | Owner read only |
