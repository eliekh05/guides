---
layout: default
title: "Download Files with curl and wget (macOS and Linux)"
parent: "Linux"
nav_order: 32
---

# Download Files with curl and wget (macOS and Linux)

Both tools download files from the internet via Terminal. `curl` is more flexible and available on macOS by default. `wget` is simpler for basic downloads and better at resuming interrupted transfers.

---

## curl

### Download a file

```bash
curl -O https://example.com/file.zip          # save with original filename
curl -o myfile.zip https://example.com/file.zip   # save with custom name
curl -L -O https://example.com/file.zip       # follow redirects (-L is often needed)
```

### Download and pipe to command

```bash
curl -fsSL https://get.docker.com | sh        # download and run installer script
curl https://api.example.com | jq             # download JSON and pretty-print it
```

### Show progress / suppress output

```bash
curl -# -O https://example.com/file.zip       # progress bar
curl -s https://example.com/file.zip -o file.zip  # silent
curl -S -s https://... -o file.zip            # silent but show errors
```

### Resume interrupted download

```bash
curl -C - -O https://example.com/largefile.iso
```

### Download with authentication

```bash
curl -u username:password https://example.com/private/file
curl -H "Authorization: Bearer TOKEN" https://api.example.com/data
```

### Send POST request

```bash
curl -X POST -d "key=value&key2=value2" https://example.com/api
curl -X POST -H "Content-Type: application/json" \
  -d '{"key": "value"}' https://api.example.com
```

### Check headers without downloading body

```bash
curl -I https://example.com               # HEAD request
curl -v https://example.com 2>&1 | head  # verbose with headers
```

### Install curl (if missing)

```bash
sudo apt install curl -y     # Ubuntu/Debian
sudo dnf install curl -y     # Fedora
brew install curl            # macOS (updates beyond system version)
```

---

## wget

```bash
sudo apt install wget -y     # Ubuntu/Debian
sudo dnf install wget -y     # Fedora
brew install wget            # macOS (not installed by default)
```

### Download a file

```bash
wget https://example.com/file.zip
wget -O myfile.zip https://example.com/file.zip   # custom filename
```

### Resume interrupted download

```bash
wget -c https://example.com/largefile.iso
```

### Download quietly

```bash
wget -q https://example.com/file.zip
```

### Download in background

```bash
wget -b https://example.com/largefile.iso
tail -f wget-log                                  # check progress
```

### Mirror a website

```bash
wget --mirror --convert-links --adjust-extension \
  --page-requisites --no-parent https://example.com
```

### Download multiple files from a list

```bash
wget -i urls.txt           # urls.txt has one URL per line
```

---

## curl vs wget — Quick Reference

| Task | curl | wget |
|---|---|---|
| Download file | `curl -LO url` | `wget url` |
| Custom filename | `curl -o name url` | `wget -O name url` |
| Resume download | `curl -C - -O url` | `wget -c url` |
| Follow redirects | `curl -L url` | automatic |
| POST request | `curl -X POST -d data url` | `wget --post-data=data url` |
| API calls | `curl` (better) | not ideal |
| Mirror site | not ideal | `wget --mirror` |
| macOS built-in | ✅ yes | ❌ no |
