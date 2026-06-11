---
layout: default
title: "Compress and Archive Files on Linux and macOS"
parent: "Linux"
nav_order: 41
---

# Compress and Archive Files on Linux and macOS

---

## tar

tar creates archives. Add `z`, `j`, or `J` to compress.

```bash
# Create archives
tar -czf archive.tar.gz folder/         # gzip compressed
tar -cjf archive.tar.bz2 folder/        # bzip2 compressed (smaller, slower)
tar -cJf archive.tar.xz folder/         # xz compressed (smallest, slowest)
tar -cf archive.tar folder/             # uncompressed

# Extract archives
tar -xzf archive.tar.gz                 # extract gzip
tar -xjf archive.tar.bz2               # extract bzip2
tar -xJf archive.tar.xz                # extract xz
tar -xf archive.tar                     # extract uncompressed

# Extract to specific directory
tar -xzf archive.tar.gz -C /target/dir/

# List contents without extracting
tar -tzf archive.tar.gz

# Extract a single file
tar -xzf archive.tar.gz path/to/specific/file.txt

# Verbose (see files as they process)
tar -czvf archive.tar.gz folder/
```

Memory trick: `c`reate `z`ip `f`ile = czf. E`x`tract `z`ip `f`ile = xzf.

---

## gzip / gunzip

For single files (not folders):

```bash
gzip file.txt               # creates file.txt.gz, removes original
gzip -k file.txt            # keep original
gzip -d file.txt.gz         # decompress (same as gunzip)
gunzip file.txt.gz
gzip -l file.txt.gz         # show compression ratio
```

---

## zip / unzip

```bash
zip archive.zip file1 file2
zip -r archive.zip folder/          # recursive (folders)
zip -r archive.zip folder/ -x "*.git" -x "node_modules/*"  # exclude patterns

unzip archive.zip
unzip archive.zip -d /target/dir/   # extract to directory
unzip -l archive.zip                # list contents
unzip archive.zip specific-file.txt # extract one file
```

---

## 7z

Better compression ratio than zip:

```bash
sudo apt install p7zip-full -y

7z a archive.7z folder/             # create
7z x archive.7z                     # extract
7z l archive.7z                     # list
7z e archive.7z -o/target/          # extract to folder
```

---

## Compressed File Reference

| Extension | Create | Extract |
|---|---|---|
| `.tar.gz` / `.tgz` | `tar -czf out.tar.gz folder/` | `tar -xzf file.tar.gz` |
| `.tar.bz2` | `tar -cjf out.tar.bz2 folder/` | `tar -xjf file.tar.bz2` |
| `.tar.xz` | `tar -cJf out.tar.xz folder/` | `tar -xJf file.tar.xz` |
| `.tar` | `tar -cf out.tar folder/` | `tar -xf file.tar` |
| `.gz` | `gzip file` | `gunzip file.gz` |
| `.zip` | `zip -r out.zip folder/` | `unzip file.zip` |
| `.7z` | `7z a out.7z folder/` | `7z x file.7z` |

---

## Extract Any Archive (Universal Function)

Add to `~/.zshrc`:

```bash
extract() {
    case "$1" in
        *.tar.gz|*.tgz) tar -xzf "$1" ;;
        *.tar.bz2)      tar -xjf "$1" ;;
        *.tar.xz)       tar -xJf "$1" ;;
        *.tar)          tar -xf "$1"  ;;
        *.gz)           gunzip "$1"   ;;
        *.zip)          unzip "$1"    ;;
        *.7z)           7z x "$1"     ;;
        *.rar)          unrar x "$1"  ;;
        *)              echo "Unknown format: $1" ;;
    esac
}
```

Then just: `extract anything.tar.gz`
