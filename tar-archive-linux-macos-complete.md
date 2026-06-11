---
layout: default
title: "tar — Archive and Compress Files (Linux and macOS)"
parent: "Linux"
nav_order: 40
---

# tar — Archive and Compress Files (Linux and macOS)

`tar` is the standard archiving tool on Linux and macOS. The flags confuse people. This is the complete reference.

---

## The Essential Commands

```bash
# Create a .tar.gz archive
tar -czf archive.tar.gz folder/

# Extract a .tar.gz archive
tar -xzf archive.tar.gz

# Create a .tar.bz2 (smaller, slower)
tar -cjf archive.tar.bz2 folder/

# Extract .tar.bz2
tar -xjf archive.tar.bz2

# Create .tar.xz (smallest, slowest)
tar -cJf archive.tar.xz folder/

# Extract .tar.xz
tar -xJf archive.tar.xz

# Extract to a specific directory
tar -xzf archive.tar.gz -C /path/to/destination/

# List contents without extracting
tar -tzf archive.tar.gz
```

---

## Flag Reference

| Flag | Meaning |
|---|---|
| `c` | Create archive |
| `x` | Extract |
| `t` | List contents |
| `f` | Next argument is the filename (always use this) |
| `v` | Verbose — show each file |
| `z` | gzip compression (.tar.gz) |
| `j` | bzip2 compression (.tar.bz2) |
| `J` | xz compression (.tar.xz) |
| `C` | Change to directory before operation |

**Memory trick:** `czf` = Create Zipped File. `xzf` = eXtract Zipped File.

---

## Useful Options

```bash
# Exclude a folder
tar -czf archive.tar.gz folder/ --exclude='folder/.git'

# Exclude multiple patterns
tar -czf archive.tar.gz folder/ --exclude='*.log' --exclude='node_modules'

# Verbose — show progress
tar -czvf archive.tar.gz folder/

# Append files to existing archive (uncompressed tar only)
tar -rf archive.tar newfile.txt

# Extract only specific files
tar -xzf archive.tar.gz folder/specific-file.txt

# Show size of archive before creating (dry run)
tar -czvf /dev/null folder/ | wc -l
```

---

## Multi-Format Extract (Auto-detect)

Use this function in `~/.zshrc` to extract any archive type:

```bash
extract() {
    case "$1" in
        *.tar.gz|*.tgz)   tar -xzf "$1" ;;
        *.tar.bz2|*.tbz2) tar -xjf "$1" ;;
        *.tar.xz)          tar -xJf "$1" ;;
        *.tar)             tar -xf "$1" ;;
        *.gz)              gunzip "$1" ;;
        *.bz2)             bunzip2 "$1" ;;
        *.zip)             unzip "$1" ;;
        *.7z)              7z x "$1" ;;
        *)                 echo "Unknown format: $1" ;;
    esac
}
```

---

## Common Real Uses

```bash
# Backup a directory with date in filename
tar -czf backup-$(date +%Y%m%d).tar.gz /home/user/data/

# Create archive and pipe to remote server (no temp file needed)
tar -czf - /home/user/data/ | ssh user@server "cat > backup.tar.gz"

# Extract and pipe from remote (no local temp file)
ssh user@server "cat backup.tar.gz" | tar -xzf -

# Compare archive contents with current files
tar -dzf archive.tar.gz

# Test archive integrity
tar -tzf archive.tar.gz > /dev/null && echo "OK" || echo "Corrupted"
```
