---
layout: default
title: "Shell Scripting Basics (bash and zsh)"
parent: "Linux"
nav_order: 42
---

# Shell Scripting Basics (bash and zsh)

---

## Create and Run a Script

```bash
# Create a script
nano myscript.sh

# Make it executable
chmod +x myscript.sh

# Run it
./myscript.sh
bash myscript.sh        # run with bash explicitly
```

---

## Script Header (Shebang)

Always start with a shebang line telling the system which interpreter to use:

```bash
#!/bin/bash              # bash
#!/bin/zsh               # zsh
#!/usr/bin/env bash      # portable — finds bash in PATH
#!/usr/bin/env python3   # works for Python too
```

---

## Variables

```bash
#!/bin/bash

name="Alice"
echo "Hello, $name"
echo "Hello, ${name}!"     # braces needed when followed by more text

# Command output in a variable
current_date=$(date)
files=$(ls /tmp)

# Read-only variable
readonly PI=3.14159

# Unset a variable
unset name
```

---

## User Input

```bash
read -p "Enter your name: " username
echo "Hello, $username"

# Read with a timeout
read -t 10 -p "Enter within 10 seconds: " input

# Silent input (for passwords)
read -s -p "Enter password: " password
echo ""    # newline after silent read
```

---

## Conditionals

```bash
# if/elif/else
if [ "$name" = "Alice" ]; then
    echo "Hello, Alice"
elif [ "$name" = "Bob" ]; then
    echo "Hello, Bob"
else
    echo "Hello, stranger"
fi

# One-line
[ "$name" = "Alice" ] && echo "It's Alice" || echo "Not Alice"
```

### Comparison Operators

**Strings:**
```bash
[ "$a" = "$b" ]      # equal
[ "$a" != "$b" ]     # not equal
[ -z "$a" ]          # empty string
[ -n "$a" ]          # non-empty string
```

**Numbers:**
```bash
[ "$a" -eq "$b" ]    # equal
[ "$a" -ne "$b" ]    # not equal
[ "$a" -gt "$b" ]    # greater than
[ "$a" -lt "$b" ]    # less than
[ "$a" -ge "$b" ]    # greater or equal
[ "$a" -le "$b" ]    # less or equal
```

**Files:**
```bash
[ -f "$file" ]       # file exists
[ -d "$dir" ]        # directory exists
[ -e "$path" ]       # exists (file or dir)
[ -r "$file" ]       # readable
[ -w "$file" ]       # writable
[ -x "$file" ]       # executable
[ -s "$file" ]       # non-empty file
```

---

## Loops

```bash
# for loop over a list
for item in apple banana cherry; do
    echo "$item"
done

# for loop over files
for file in /tmp/*.log; do
    echo "Processing $file"
done

# for loop with range
for i in {1..10}; do
    echo "$i"
done

# C-style for loop
for ((i=0; i<5; i++)); do
    echo "$i"
done

# while loop
count=0
while [ $count -lt 5 ]; do
    echo "$count"
    ((count++))
done

# Loop over lines in a file
while IFS= read -r line; do
    echo "$line"
done < /path/to/file.txt
```

---

## Functions

```bash
greet() {
    local name=$1      # local = scoped to function
    echo "Hello, $name"
}

greet "Alice"
greet "Bob"

# Function with return value
add() {
    local result=$(( $1 + $2 ))
    echo $result       # use echo to "return" a value
}

sum=$(add 3 5)
echo "Sum: $sum"
```

---

## Arguments

```bash
$0          # script name
$1, $2...   # positional arguments
$#          # number of arguments
$@          # all arguments (as separate words)
$*          # all arguments (as one word)

# Example
echo "Script: $0"
echo "First arg: $1"
echo "All args: $@"
echo "Arg count: $#"
```

---

## Exit Codes

```bash
$?          # exit code of last command (0 = success, non-zero = error)

command && echo "Success" || echo "Failed"

# Exit with a code
exit 0       # success
exit 1       # generic error
```

---

## Error Handling

```bash
#!/bin/bash
set -e           # exit immediately if any command fails
set -u           # treat unset variables as errors
set -o pipefail  # catch failures in pipes

# Or just the common combo:
set -euo pipefail
```

---

## Practical Template

```bash
#!/usr/bin/env bash
set -euo pipefail

# Variables
LOG_FILE="/var/log/myscript.log"
DATE=$(date +%Y-%m-%d)

log() {
    echo "[$(date '+%H:%M:%S')] $1" | tee -a "$LOG_FILE"
}

main() {
    log "Starting script"

    if [ ! -f "/etc/config" ]; then
        log "Error: config file not found"
        exit 1
    fi

    log "Done"
}

main "$@"
```
