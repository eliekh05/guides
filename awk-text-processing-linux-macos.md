---
layout: default
title: "awk — Text Processing on macOS and Linux"
parent: "Linux"
nav_order: 38
---

# awk — Text Processing on macOS and Linux

`awk` processes text line by line, splitting each line into fields. It is perfect for extracting columns from logs, CSV files, and command output. Confusing at first — simple once you understand the pattern.

---

## Basic Pattern

```bash
awk '{action}' file
awk 'pattern {action}' file
```

awk reads each line, splits it into fields (`$1`, `$2`, etc.), and runs your action on it.

---

## Print Specific Columns

```bash
# Print first column of every line
awk '{print $1}' file.txt

# Print second and fourth columns
awk '{print $2, $4}' file.txt

# Print last column (NF = number of fields)
awk '{print $NF}' file.txt

# Print second-to-last column
awk '{print $(NF-1)}' file.txt

# Print all columns
awk '{print $0}' file.txt
```

---

## Filter Lines (Pattern Matching)

```bash
# Print lines containing "error"
awk '/error/' file.txt

# Print lines NOT containing "error"
awk '!/error/' file.txt

# Print lines where column 3 equals "active"
awk '$3 == "active"' file.txt

# Print lines where column 2 is greater than 100
awk '$2 > 100' file.txt

# Print lines 5 to 10
awk 'NR>=5 && NR<=10' file.txt
```

---

## Change the Field Separator

By default awk splits on whitespace. Use `-F` for other separators:

```bash
# Parse CSV
awk -F',' '{print $1}' file.csv

# Parse /etc/passwd (colon-separated)
awk -F':' '{print $1, $3}' /etc/passwd

# Multiple separators
awk -F'[,:]' '{print $1}' file.txt
```

---

## Combine with Other Commands

```bash
# Show processes using most memory (print name and memory)
ps aux | awk '{print $11, $4}' | sort -k2 -rn | head -10

# Get IP addresses from ifconfig
ifconfig | awk '/inet /{print $2}'

# Sum a column
awk '{sum += $3} END {print sum}' data.txt

# Count lines matching a pattern
awk '/error/{count++} END {print count}' logfile.txt

# Print lines between two patterns
awk '/START/,/END/' file.txt
```

---

## BEGIN and END Blocks

```bash
# Print header, process data, print footer
awk 'BEGIN {print "Name Age"} {print $1, $2} END {print "Done"}' file.txt
```

- `BEGIN` runs once before reading any lines
- `END` runs once after reading all lines

---

## Built-in Variables

| Variable | Meaning |
|---|---|
| `$0` | Entire current line |
| `$1, $2...` | Field 1, 2... |
| `NF` | Number of fields in current line |
| `NR` | Current line number |
| `FS` | Field separator (default: space) |
| `OFS` | Output field separator |
| `RS` | Record separator (default: newline) |

---

## Quick Examples

```bash
# Print usernames from /etc/passwd
awk -F':' '{print $1}' /etc/passwd

# Show disk usage over 1GB
df -h | awk '$2 ~ /G/ && $2+0 > 1'

# Count words in a file
awk '{words += NF} END {print words}' file.txt

# Print lines with more than 5 fields
awk 'NF > 5' file.txt

# Replace a field value
awk '{$2 = "replaced"; print}' file.txt
```
