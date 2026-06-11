---
layout: default
title: "Symbolic Links and Hard Links on Linux and macOS"
parent: "Linux"
nav_order: 40
---

# Symbolic Links and Hard Links on Linux and macOS

---

## Symbolic Links (Symlinks)

A symlink is a pointer to another file or directory. If the target is deleted, the symlink breaks.

```bash
# Create a symlink
ln -s /path/to/original /path/to/link

# Examples
ln -s /opt/myapp/bin/myapp /usr/local/bin/myapp     # make a command available system-wide
ln -s /mnt/data/photos ~/Photos                      # link a folder
ln -s /etc/nginx/sites-available/mysite.conf /etc/nginx/sites-enabled/mysite.conf  # Nginx config
```

### View symlinks

```bash
ls -la         # shows -> pointing to target
ls -la | grep "^l"   # list only symlinks
readlink /usr/local/bin/myapp       # show where a symlink points
readlink -f /usr/local/bin/myapp    # follow all symlinks to final target
```

### Update or overwrite a symlink

```bash
# -f = force overwrite existing symlink
ln -sf /path/to/new/target /path/to/link
```

### Delete a symlink

```bash
rm /path/to/link         # remove the link, not the target
unlink /path/to/link     # same thing
```

> **Do not use `rm -r` on a symlink to a directory** — it deletes the contents of the target directory, not just the link.

---

## Hard Links

A hard link is another name for the same file. Both names point to the same data on disk. Deleting one name leaves the data accessible through the other.

```bash
# Create a hard link
ln /path/to/original /path/to/hardlink

# View hard link count (second column in ls -la)
ls -la file.txt
# -rw-r--r--  2  alice  staff  ...    <- the 2 means 2 hard links
```

### Hard link limitations

- Cannot cross filesystem boundaries (cannot hard link across different partitions)
- Cannot hard link directories (on most systems)
- Both names must be on the same filesystem

---

## Symlink vs Hard Link

| | Symlink | Hard Link |
|---|---|---|
| Target deleted | Symlink breaks (dangling) | Data still accessible via other name |
| Cross filesystems | ✅ Yes | ❌ No |
| Link to directory | ✅ Yes | ❌ Usually no |
| Shows as separate file | Yes (with `->`  in `ls`) | No (looks identical) |
| Most common use | ✅ | Rarely needed |

---

## Practical Use Cases

```bash
# Make Python 3 available as "python"
sudo ln -sf /usr/bin/python3 /usr/local/bin/python

# Enable an Nginx site
sudo ln -s /etc/nginx/sites-available/mysite /etc/nginx/sites-enabled/

# Create a shortcut to a deep path
ln -s ~/Documents/Projects/client-work/2026/webapp ~/Desktop/webapp

# Link a config file to a managed location
ln -sf /opt/myapp/config/app.conf ~/.config/app.conf

# Java version management (switch default Java)
sudo ln -sf /usr/lib/jvm/java-21/bin/java /usr/local/bin/java
```

---

## Fix Broken Symlinks

```bash
# Find all broken symlinks in current directory
find . -type l ! -exec test -e {} \; -print

# Find broken symlinks system-wide
find / -type l ! -exec test -e {} \; -print 2>/dev/null
```
