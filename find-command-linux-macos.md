---
layout: default
title: "find Command — Complete Guide (macOS and Linux)"
parent: "Linux"
nav_order: 31
---

# find Command — Complete Guide (macOS and Linux)

`find` searches for files and folders by name, type, size, date, permissions, and more. It is one of the most powerful Terminal commands but the syntax trips up almost everyone.

---

## Basic Syntax

```bash
find [where to search] [what to look for] [what to do with results]
```

---

## Find by Name

```bash
find . -name "file.txt"              # exact name, current folder and subfolders
find . -name "*.log"                 # all .log files
find . -iname "*.log"                # case-insensitive
find / -name "config.json"           # search entire system
find ~/Documents -name "*.pdf"       # search specific folder
```

---

## Find by Type

```bash
find . -type f          # files only
find . -type d          # directories only
find . -type l          # symbolic links only
```

---

## Find by Size

```bash
find . -size +100M      # larger than 100 MB
find . -size -1k        # smaller than 1 KB
find . -size +1G        # larger than 1 GB
find / -size +500M      # files over 500 MB anywhere
```

Units: `c` (bytes), `k` (KB), `M` (MB), `G` (GB)

---

## Find by Date

```bash
find . -mtime -7        # modified in last 7 days
find . -mtime +30       # modified more than 30 days ago
find . -mtime -1        # modified in last 24 hours
find . -newer file.txt  # modified more recently than file.txt
```

`-mtime` = modification time, `-atime` = access time, `-ctime` = change time

---

## Find by Permissions

```bash
find . -perm 777        # exactly 777
find . -perm -644       # at least 644 permissions
find . -perm /u+x       # user-executable files
find / -perm -4000      # setuid files (security audit)
```

---

## Combine Conditions

```bash
find . -type f -name "*.log"                # files ending in .log
find . -type f -size +10M -name "*.zip"     # large zip files
find . -type f -mtime -7 -name "*.py"       # Python files modified recently
find . -type f ! -name "*.txt"              # NOT .txt files
find . -name "a*" -o -name "b*"            # name starts with a OR b
```

---

## Do Something With Results

```bash
# Print each result (default)
find . -name "*.log" -print

# Delete found files
find . -name "*.tmp" -delete

# Run a command on each result
find . -name "*.sh" -exec chmod +x {} \;

# Run command on all results at once (faster)
find . -name "*.log" -exec rm {} +

# Ask before each deletion
find . -name "*.tmp" -ok rm {} \;
```

The `{}` is replaced by each found file. `\;` runs the command once per file. `+` passes all files at once.

---

## Practical Examples

```bash
# Find all empty files
find . -type f -empty

# Find all empty directories
find . -type d -empty

# Find files larger than 1GB and show size
find / -type f -size +1G -exec du -sh {} \; 2>/dev/null

# Find and delete files older than 30 days
find /tmp -type f -mtime +30 -delete

# Find files you own
find /home -user $(whoami) -type f

# Find world-writable files (security check)
find / -type f -perm -o+w 2>/dev/null

# Find files containing text (combine with grep)
find . -type f -name "*.py" -exec grep -l "import os" {} \;
```

---

## Suppress Permission Denied Errors

```bash
find / -name "*.conf" 2>/dev/null
```

`2>/dev/null` redirects error output (permission denied messages) to nothing.

---

## macOS vs Linux Differences

Some `find` flags differ between macOS (BSD find) and Linux (GNU find):

| Task | Linux | macOS |
|---|---|---|
| Delete matching files | `-delete` | `-delete` (same) |
| Print null-separated | `-print0` | `-print0` (same) |
| Max depth | `-maxdepth 2` | `-maxdepth 2` (same) |
| By permissions | `-perm /u+x` | `-perm +u+x` (older macOS) |

For full GNU find on macOS:
```bash
brew install findutils
# then use gfind instead of find
```
