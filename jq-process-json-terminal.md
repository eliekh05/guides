---
layout: default
title: "jq — Process JSON in Terminal"
parent: "Linux"
nav_order: 32
---

# jq — Process JSON in Terminal

`jq` parses, filters, and transforms JSON from the command line. Essential for working with APIs, config files, and log files.

---

## Install

```bash
sudo apt install jq -y      # Ubuntu/Debian
sudo dnf install jq -y      # Fedora/RHEL
sudo pacman -S jq            # Arch
brew install jq              # macOS
```

---

## Basic Usage

```bash
echo '{"name":"Alice","age":30}' | jq .
# Pretty-prints the JSON

cat data.json | jq .
# Pretty-print a file
```

---

## Access Fields

```bash
echo '{"name":"Alice","age":30}' | jq '.name'
# "Alice"

echo '{"user":{"name":"Alice","city":"Beirut"}}' | jq '.user.city'
# "Beirut"

echo '{"items":[1,2,3]}' | jq '.items[0]'
# 1

echo '{"items":[1,2,3]}' | jq '.items[-1]'
# 3 (last element)

echo '{"items":[1,2,3,4,5]}' | jq '.items[1:3]'
# [2,3] (slice)
```

---

## Arrays

```bash
# All elements
echo '[{"name":"Alice"},{"name":"Bob"}]' | jq '.[].name'
# "Alice"
# "Bob"

# Length
echo '[1,2,3]' | jq 'length'
# 3

# Filter array by condition
echo '[{"name":"Alice","age":30},{"name":"Bob","age":25}]' | \
  jq '.[] | select(.age > 28)'
```

---

## Transform and Select

```bash
# Extract specific fields
curl -s https://api.github.com/repos/eliekh05/guides | jq '{name: .name, stars: .stargazers_count}'

# Map over array
echo '[1,2,3,4]' | jq 'map(. * 2)'
# [2,4,6,8]

# Filter array
echo '[1,2,3,4,5]' | jq '[.[] | select(. > 3)]'
# [4,5]

# Get only values without keys
echo '{"a":1,"b":2}' | jq 'values'
# [1,2]

# Get only keys
echo '{"a":1,"b":2}' | jq 'keys'
# ["a","b"]
```

---

## Raw Output (No Quotes)

```bash
echo '{"name":"Alice"}' | jq -r '.name'
# Alice  (no quotes, useful for scripts)
```

---

## Combine with curl for API Work

```bash
# Get JSON from an API and extract a field
curl -s https://api.github.com/users/eliekh05 | jq '.public_repos'

# Get multiple fields
curl -s https://api.github.com/users/eliekh05 | jq '{repos: .public_repos, followers: .followers}'

# Loop through results
curl -s https://api.github.com/users/eliekh05/repos | jq '.[].name'

# Get the first result
curl -s https://api.github.com/users/eliekh05/repos | jq '.[0]'
```

---

## Modify JSON

```bash
# Add a field
echo '{"name":"Alice"}' | jq '. + {"age": 30}'

# Update a field
echo '{"name":"Alice","age":25}' | jq '.age = 30'

# Delete a field
echo '{"name":"Alice","age":30}' | jq 'del(.age)'
```

---

## Compact Output (No Formatting)

```bash
cat pretty.json | jq -c .
# Outputs on single line
```

---

## Quick Reference

| Command | Result |
|---|---|
| `jq .` | Pretty-print |
| `jq '.key'` | Get field value |
| `jq '.a.b'` | Nested field |
| `jq '.[0]'` | Array index |
| `jq '.[]'` | All array items |
| `jq -r '.key'` | Raw output (no quotes) |
| `jq 'length'` | Length of array/object |
| `jq 'keys'` | Object keys |
| `jq 'map(f)'` | Transform array |
| `jq 'select(cond)'` | Filter by condition |
