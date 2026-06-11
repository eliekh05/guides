---
layout: default
title: "Text Processing Pipelines in Linux"
parent: "Linux"
nav_order: 40
---

# Text Processing Pipelines in Linux

Linux pipes allow chaining commands together. The output of one command becomes the input of the next. This is how you process text, logs, and data without writing programs.

---

## The Pipe Operator

```bash
command1 | command2 | command3
```

Data flows left to right. Each command processes the output of the previous one.

---

## Essential Text Processing Tools

```bash
cat      — concatenate and print files
head     — first N lines
tail     — last N lines
grep     — filter lines by pattern
sort     — sort lines
uniq     — deduplicate adjacent lines
cut      — extract columns
tr       — translate characters
wc       — count lines, words, chars
tee      — duplicate output (to file and stdout)
xargs    — build commands from stdin
paste    — merge lines from files
join     — join files on a field
```

---

## Practical Pipelines

**Count occurrences of each unique value:**
```bash
cat access.log | awk '{print $1}' | sort | uniq -c | sort -rn | head -10
```

**Find top IP addresses in a log:**
```bash
grep "404" access.log | awk '{print $1}' | sort | uniq -c | sort -rn | head -20
```

**Extract specific columns from CSV:**
```bash
cut -d',' -f1,3 data.csv          # columns 1 and 3
awk -F',' '{print $1, $3}' data.csv  # same with awk
```

**Find files modified today, list sizes:**
```bash
find . -mtime 0 -type f -exec ls -lh {} \; | awk '{print $5, $9}'
```

**Remove blank lines and comments from a config:**
```bash
grep -v "^#" config.conf | grep -v "^$"
```

**Convert newlines to commas:**
```bash
cat items.txt | tr '\n' ','
```

**Find and replace in a stream:**
```bash
cat file.txt | sed 's/old/new/g'
```

**Count words in multiple files:**
```bash
cat *.txt | wc -w
```

**Monitor a log and filter for errors:**
```bash
tail -f /var/log/syslog | grep --line-buffered -i "error\|warn\|crit"
```

---

## Process Substitution

Use command output as a file:

```bash
diff <(ls dir1) <(ls dir2)        # compare directory listings
comm <(sort list1) <(sort list2)   # show lines unique to each file
```

---

## xargs — Build Commands From Input

```bash
# Delete files found by find
find . -name "*.tmp" | xargs rm

# Parallel processing (4 parallel jobs)
cat urls.txt | xargs -P 4 -I{} curl -O {}

# Pass multiple items to a command
echo "package1 package2 package3" | xargs sudo apt install -y
```

---

## Here Documents and Here Strings

```bash
# Feed text into a command
cat << EOF
line one
line two
