---
layout: default
title: "sed and awk — Text Processing on Linux and macOS"
parent: "Linux"
nav_order: 38
---

# sed and awk — Text Processing on Linux and macOS

`sed` edits text streams and files by pattern. `awk` processes structured text data column by column. Both are available on every Unix/Linux/macOS system and are essential for scripting.

---

## sed — Stream Editor

### Find and Replace

```bash
# Replace first occurrence per line
sed 's/old/new/' file.txt

# Replace ALL occurrences (global flag)
sed 's/old/new/g' file.txt

# Case-insensitive replace
sed 's/old/new/gI' file.txt

# Replace and save to file (in-place)
sed -i 's/old/new/g' file.txt

# macOS in-place (requires a backup extension or empty string)
sed -i '' 's/old/new/g' file.txt

# Preview before applying (dry run)
sed 's/old/new/g' file.txt | head
```

### Delete Lines

```bash
# Delete lines containing a pattern
sed '/pattern/d' file.txt

# Delete blank lines
sed '/^$/d' file.txt

# Delete specific line number
sed '5d' file.txt

# Delete line range
sed '3,7d' file.txt
```

### Print Specific Lines

```bash
# Print only line 5
sed -n '5p' file.txt

# Print lines 3 to 7
sed -n '3,7p' file.txt

# Print lines matching pattern
sed -n '/error/p' file.txt
```

### Add Lines

```bash
# Insert a line before line 3
sed '3i\New line here' file.txt

# Append a line after line 3
sed '3a\New line here' file.txt

# Add line after matching pattern
sed '/pattern/a\Added after match' file.txt
```

### Practical Examples

```bash
# Remove all comments from a config file
sed '/^#/d' config.conf

# Remove trailing whitespace
sed 's/[[:space:]]*$//' file.txt

# Change http to https in a file
sed -i 's/http:\/\//https:\/\//g' file.txt

# Extract IP addresses
cat access.log | sed -n 's/^\([0-9.]*\) .*/\1/p'
```

---

## awk — Column/Field Processing

awk splits each line into fields by a delimiter (default: whitespace). Fields are referenced as `$1`, `$2`, `$3`, etc. `$0` is the whole line.

### Print Specific Columns

```bash
# Print first column (field)
awk '{print $1}' file.txt

# Print first and third fields
awk '{print $1, $3}' file.txt

# Print last field
awk '{print $NF}' file.txt

# Print second-to-last field
awk '{print $(NF-1)}' file.txt
```

### Custom Delimiter

```bash
# CSV: split by comma
awk -F',' '{print $2}' file.csv

# Split by colon (like /etc/passwd)
awk -F':' '{print $1, $3}' /etc/passwd

# Split by multiple characters
awk -F'[,;]' '{print $1}' file.txt
```

### Filter Lines

```bash
# Print lines where field 3 is greater than 100
awk '$3 > 100' file.txt

# Print lines matching pattern
awk '/error/' file.txt

# Print lines where first field equals "root"
awk '$1 == "root"' /etc/passwd
```

### Math and Aggregation

```bash
# Sum the values in column 2
awk '{sum += $2} END {print sum}' file.txt

# Count lines matching pattern
awk '/error/ {count++} END {print count}' file.txt

# Average of column 3
awk '{sum += $3; count++} END {print sum/count}' file.txt

# Print line number with content
awk '{print NR, $0}' file.txt
```

### Practical Examples

```bash
# Show username and shell from /etc/passwd
awk -F':' '{print $1, $7}' /etc/passwd

# Show disk usage for each filesystem (from df -h)
df -h | awk '{print $1, $5}'

# Find processes using more than 10% CPU
ps aux | awk '$3 > 10 {print $1, $2, $3, $11}'

# Extract IP addresses from log
awk '{print $1}' access.log | sort | uniq -c | sort -rn | head -10

# Sum file sizes from ls -l
ls -l | awk '{sum += $5} END {print "Total:", sum}'
```

---

## sed vs awk — When to Use Which

| Task | Tool |
|---|---|
| Find and replace text | `sed` |
| Delete/add specific lines | `sed` |
| Work with columns/fields | `awk` |
| Math operations on data | `awk` |
| Filter by pattern | Either |
| Transform CSV/TSV | `awk` |
