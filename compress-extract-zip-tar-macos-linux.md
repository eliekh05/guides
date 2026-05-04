---
layout: default
title: "Compress and Extract Files (zip, tar, gz) on macOS and Linux"
parent: "macOS & Linux"
nav_order: 18
---

# Compress and Extract Files (zip, tar, gz) on macOS and Linux

---

## zip and unzip

```bash
# Create a zip
zip archive.zip file1.txt file2.txt

# Zip an entire folder
zip -r archive.zip myfolder/

# Extract a zip
unzip archive.zip

# Extract to a specific folder
unzip archive.zip -d /path/to/destination/

# List contents without extracting
unzip -l archive.zip

# Extract a single file from a zip
unzip archive.zip specificfile.txt
```

---

## tar — the confusing one

The flags that trip everyone up:

| Flag | Meaning |
|---|---|
| `c` | Create archive |
| `x` | Extract archive |
| `t` | List contents |
| `f` | Next argument is the filename |
| `v` | Verbose (show files as they process) |
| `z` | Use gzip compression (.tar.gz) |
| `j` | Use bzip2 compression (.tar.bz2) |
| `J` | Use xz compression (.tar.xz) |

```bash
# Create a .tar.gz (most common)
tar -czf archive.tar.gz myfolder/

# Extract a .tar.gz
tar -xzf archive.tar.gz

# Extract to a specific folder
tar -xzf archive.tar.gz -C /path/to/destination/

# List contents without extracting
tar -tzf archive.tar.gz

# Create .tar.bz2 (smaller, slower)
tar -cjf archive.tar.bz2 myfolder/

# Extract .tar.bz2
tar -xjf archive.tar.bz2

# Create uncompressed tar
tar -cf archive.tar myfolder/

# Extract uncompressed tar
tar -xf archive.tar
```

> **Memory trick:** `czf` = **C**reate **Z**ipped **F**ile. `xzf` = e**X**tract **Z**ipped **F**ile.

---

## gz files (single file, not a folder)

```bash
# Compress a single file
gzip file.txt        # creates file.txt.gz, removes original

# Keep the original
gzip -k file.txt

# Decompress
gunzip file.txt.gz

# Or
gzip -d file.txt.gz
```

---

## 7z (if installed)

```bash
# Install
sudo apt install p7zip-full -y   # Ubuntu/Debian
brew install p7zip               # macOS

# Create
7z a archive.7z myfolder/

# Extract
7z x archive.7z

# Extract to folder
7z x archive.7z -o/path/to/destination/
```

---

## Quick reference

| Task | Command |
|---|---|
| Zip a folder | `zip -r out.zip folder/` |
| Unzip | `unzip file.zip` |
| Create tar.gz | `tar -czf out.tar.gz folder/` |
| Extract tar.gz | `tar -xzf file.tar.gz` |
| List tar.gz contents | `tar -tzf file.tar.gz` |
| Compress single file | `gzip file.txt` |
| Decompress .gz | `gunzip file.gz` |
