---
layout: default
title: "sed — Stream Editor on macOS and Linux"
parent: "Linux"
nav_order: 39
---

# sed — Stream Editor on macOS and Linux

`sed` edits text streams non-interactively. Most commonly used for find-and-replace in files and pipelines.

---

## Find and Replace

```bash
# Replace first occurrence on each line
sed 's/old/new/' file.txt

# Replace ALL occurrences on each line (g = global)
sed 's/old/new/g' file.txt

# Case-insensitive replace
sed 's/old/new/gi' file.txt

# Replace and save to file (-i = in-place)
sed -i 's/old/new/g' file.txt

# macOS requires empty string after -i
sed -i '' 's/old/new/g' file.txt
```

---

## Print Specific Lines

```bash
sed -n '5p' file.txt            # print line 5
sed -n '5,10p' file.txt         # print lines 5 to 10
sed -n '/pattern/p' file.txt    # print lines matching pattern
```

---

## Delete Lines

```bash
sed '3d' file.txt               # delete line 3
sed '3,5d' file.txt             # delete lines 3 to 5
sed '/pattern/d' file.txt       # delete lines matching pattern
sed '/^$/d' file.txt            # delete blank lines
sed '/^#/d' file.txt            # delete comment lines
```

---

## Insert and Append

```bash
sed '3i\New line here' file.txt    # insert before line 3
sed '3a\New line here' file.txt    # append after line 3
```

---

## Common Real Uses

```bash
# Remove trailing whitespace
sed 's/[[:space:]]*$//' file.txt

# Remove leading whitespace
sed 's/^[[:space:]]*//' file.txt

# Comment out a line containing a pattern
sed '/ServerName/s/^/#/' config.conf

# Uncomment lines starting with #
sed 's/^#//' file.txt

# Replace in multiple files at once
sed -i 's/localhost/192.168.1.100/g' *.conf

# Extract lines between patterns
sed -n '/START/,/END/p' file.txt
```

---

## macOS vs Linux

The key difference: on macOS, `-i` requires an argument (use `''` for no backup):

```bash
sed -i 's/old/new/g' file.txt        # Linux
sed -i '' 's/old/new/g' file.txt     # macOS
```

For the GNU sed version on macOS (same as Linux):
```bash
brew install gnu-sed
# then use gsed instead of sed
gsed -i 's/old/new/g' file.txt
```
