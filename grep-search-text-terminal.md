---
layout: default
title: "grep — Search Text in Files (macOS and Linux)"
parent: "macOS & Linux"
nav_order: 33
---

# grep — Search Text in Files (macOS and Linux)

`grep` searches for text patterns in files or command output. It is one of the most used Terminal commands.

---

## Basic Usage

```bash
grep "word" file.txt                  # find lines containing "word"
grep "error" /var/log/syslog          # search a log file
grep "def " *.py                      # search all .py files
```

---

## Essential Flags

```bash
grep -i "word" file.txt               # case-insensitive
grep -r "word" /path/                 # recursive (search all files in folder)
grep -l "word" *.txt                  # list files that contain the match (not the lines)
grep -n "word" file.txt               # show line numbers
grep -c "word" file.txt               # count matching lines
grep -v "word" file.txt               # invert — show lines that do NOT match
grep -w "word" file.txt               # whole word only (not "password" when searching "word")
grep -A 3 "error" file.txt            # show 3 lines AFTER each match
grep -B 3 "error" file.txt            # show 3 lines BEFORE each match
grep -C 3 "error" file.txt            # show 3 lines before AND after (context)
```

---

## Search Multiple Files / Recursively

```bash
grep -r "TODO" .                       # search everything in current folder
grep -r "TODO" . --include="*.py"     # only Python files
grep -r "TODO" . --exclude="*.log"    # exclude log files
grep -r "TODO" . --exclude-dir=".git" # exclude .git folder
```

---

## Patterns (Regular Expressions)

```bash
grep "^error" file.txt                # lines starting with "error"
grep "error$" file.txt                # lines ending with "error"
grep "err.r" file.txt                 # . matches any character
grep "err[oa]r" file.txt              # matches "errar" or "error"
grep -E "error|warning" file.txt      # extended regex: OR
grep -E "err(or|and)" file.txt        # groups
grep "[0-9]{3}" file.txt              # exactly 3 digits
```

Use `-E` for extended regular expressions (ERE). Use `-P` for Perl-compatible regex (not available on macOS by default).

---

## Combine with Other Commands

```bash
# Search output of another command
ps aux | grep nginx
docker ps | grep mycontainer
cat /var/log/auth.log | grep "Failed"

# Count occurrences
cat access.log | grep "404" | wc -l

# Find all unique IPs in a log
grep -oE "[0-9]+\.[0-9]+\.[0-9]+\.[0-9]+" access.log | sort -u

# Search history for a command
history | grep docker
```

---

## grep vs ripgrep (rg)

`ripgrep` (`rg`) is a modern, faster replacement for grep. It ignores `.git` and binary files by default, respects `.gitignore`, and is much faster on large codebases.

```bash
brew install ripgrep       # macOS
sudo apt install ripgrep   # Ubuntu/Debian

rg "TODO" .                # same as grep -r "TODO" .
rg -i "error" .            # case-insensitive
rg "error" --type py       # Python files only
rg "error" -l              # list files only
```

---

## Highlight Matches

```bash
grep --color=auto "error" file.txt
```

Add to `~/.zshrc` to always highlight:
```bash
export GREP_OPTIONS='--color=auto'
```

---

## Quick Reference

| Task | Command |
|---|---|
| Search file | `grep "text" file` |
| Case-insensitive | `grep -i "text" file` |
| Recursive | `grep -r "text" folder/` |
| With line numbers | `grep -n "text" file` |
| Invert match | `grep -v "text" file` |
| Whole word | `grep -w "text" file` |
| Count matches | `grep -c "text" file` |
| Files with match | `grep -l "text" *.txt` |
| Context lines | `grep -C 3 "text" file` |
| OR pattern | `grep -E "a\|b" file` |
