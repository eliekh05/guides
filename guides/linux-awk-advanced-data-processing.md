---
layout: default
title: "awk Advanced Data Processing"
parent: "Linux"
nav_order: 42
---

# awk Advanced Data Processing

awk is a complete text processing language. Beyond the basics, it can do math, arrays, functions, and formatted output.

---

## Multiple Conditions and Actions

```bash
# Print line if field 3 > 100 AND field 1 is "server"
awk '$1 == "server" && $3 > 100 { print $0 }' file

# Print different output based on condition
awk '{ if ($3 > 100) print "HIGH: " $0; else print "LOW:  " $0 }' file
```

---

## Built-in Variables

```
NR     current record (line) number
NF     number of fields in current record
FS     field separator (default whitespace)
OFS    output field separator
RS     record separator (default newline)
ORS    output record separator
FILENAME  current filename
```

```bash
# Print line number with content
awk '{ print NR": "$0 }' file

# Print last field of each line
awk '{ print $NF }' file

# Set custom output separator
awk 'BEGIN{OFS=","} { print $1,$2,$3 }' file
```

---

## BEGIN and END Blocks

```bash
# Process before and after reading input
awk '
  BEGIN { print "Starting..." }
  { total += $3; count++ }
  END { print "Total:", total; print "Count:", count; print "Average:", total/count }
' data.txt
```

---

## Arrays

```bash
# Count occurrences
awk '{ count[$1]++ } END { for (k in count) print k, count[k] }' file

# Sum by category
awk '{ total[$1] += $2 } END { for (cat in total) print cat, total[cat] }' file | sort -k2 -rn
```

---

## Functions

```bash
awk '
function max(a, b) { return a > b ? a : b }
function min(a, b) { return a < b ? a : b }
{ print "max:", max($1, $2), "min:", min($1, $2) }
' file
```

---

## Process CSV Files

```bash
# Parse CSV (simple — does not handle quoted commas)
awk -F',' '{ print $1, $3 }' file.csv

# Skip header row
awk -F',' 'NR > 1 { print $1, $3 }' file.csv

# Sum a column
awk -F',' 'NR > 1 { sum += $2 } END { print "Total:", sum }' file.csv
```

---

## Multi-File Processing

```bash
# Process multiple files
awk '{ print FILENAME": "$0 }' file1.txt file2.txt

# Print only from specific file
awk 'FILENAME=="access.log" && /error/' access.log error.log
```

---

## Formatted Output

```bash
# printf-style formatting
awk '{ printf "%-20s %10.2f\n", $1, $2 }' file

# Table with headers
awk '
BEGIN { printf "%-20s %10s\n", "Name", "Score"; print "-" }
{ printf "%-20s %10.2f\n", $1, $2 }
END { printf "-\nTotal records: %d\n", NR }
' file
```
