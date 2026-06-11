---
layout: default
title: "File Permissions — chmod and chown (macOS and Linux)"
parent: "Linux"
nav_order: 43
---

# File Permissions — chmod and chown (macOS and Linux)

Every file on Linux and macOS has an owner, a group, and permissions for three audiences: the owner, the group, and everyone else.

---

## Read Permissions

```bash
ls -la
```

Example output:
```
-rwxr-xr--  1  alice  staff  1234  file.sh
drwxr-xr-x  2  alice  staff   128  folder/
```

| Part | Meaning |
|---|---|
| `-` or `d` | File (`-`) or directory (`d`) |
| `rwx` | Owner permissions |
| `r-x` | Group permissions |
| `r--` | Others permissions |
| `alice` | Owner |
| `staff` | Group |

---

## Permission Letters

| Letter | Meaning | Numeric Value |
|---|---|---|
| `r` | Read | 4 |
| `w` | Write | 2 |
| `x` | Execute | 1 |
| `-` | No permission | 0 |

---

## chmod — Change Permissions

### Numeric (Octal) Mode

Each position is owner, group, others. Each digit = r+w+x values added together.

```bash
chmod 755 file.sh      # rwxr-xr-x — owner full, group/others read+execute
chmod 644 file.txt     # rw-r--r-- — owner read+write, others read only
chmod 600 secret.key   # rw------- — owner read+write only
chmod 777 file.sh      # rwxrwxrwx — everyone full (avoid this)
chmod 000 file.txt     # --------- — no permissions for anyone
```

**Common permission values:**

| Octal | Permissions | Typical use |
|---|---|---|
| `755` | `rwxr-xr-x` | Executables, scripts, directories |
| `644` | `rw-r--r--` | Regular files, configs |
| `600` | `rw-------` | Private keys, secrets |
| `700` | `rwx------` | Private directories |
| `666` | `rw-rw-rw-` | Shared writable files |
| `400` | `r--------` | Read-only, no modification |

### Symbolic Mode

```bash
chmod +x file.sh           # add execute for everyone
chmod -x file.sh           # remove execute from everyone
chmod u+x file.sh          # add execute for owner only
chmod g+w file.txt         # add write for group
chmod o-r secret.txt       # remove read from others
chmod u=rwx,g=rx,o=r file  # set exact permissions symbolically
```

- `u` = user/owner, `g` = group, `o` = others, `a` = all three

### Recursive

```bash
chmod -R 755 /var/www          # apply recursively to folder
find /var/www -type f -exec chmod 644 {} \;    # files only
find /var/www -type d -exec chmod 755 {} \;    # directories only
```

---

## chown — Change Owner

```bash
sudo chown alice file.txt              # change owner to alice
sudo chown alice:staff file.txt        # change owner and group
sudo chown :staff file.txt             # change group only
sudo chown -R alice:staff /var/www     # recursive
sudo chown $(whoami) file.txt          # take ownership of a file
```

---

## chgrp — Change Group

```bash
sudo chgrp staff file.txt
sudo chgrp -R www-data /var/www
```

---

## Special Permissions

### Setuid (run as owner, not caller)
```bash
chmod u+s /usr/bin/program     # 4755
```

### Setgid (new files inherit directory group)
```bash
chmod g+s /shared/folder       # 2755
```

### Sticky bit (only owner can delete files in directory)
```bash
chmod +t /tmp                  # 1777
```

---

## SSH Permission Requirements (Common Cause of Errors)

```bash
chmod 700 ~/.ssh
chmod 600 ~/.ssh/id_ed25519
chmod 644 ~/.ssh/id_ed25519.pub
chmod 600 ~/.ssh/authorized_keys
chmod 600 ~/.ssh/config
```
