---
layout: default
title: "curl for API and REST Requests"
parent: "Linux"
nav_order: 33
---

# curl for API and REST Requests

curl is the standard tool for making HTTP requests from the terminal — testing APIs, downloading data, and interacting with web services.

---

## Basic GET Request

```bash
curl https://api.example.com/data
curl -s https://api.example.com/data          # silent (no progress)
curl -s https://api.example.com/data | jq .   # pretty-print JSON
```

---

## Headers

```bash
# Add a header
curl -H "Authorization: Bearer YOUR_TOKEN" https://api.example.com/data
curl -H "Content-Type: application/json" https://api.example.com/data

# Multiple headers
curl -H "Authorization: Bearer TOKEN" \
     -H "Accept: application/json" \
     https://api.example.com/data

# View response headers
curl -I https://example.com              # headers only
curl -v https://example.com             # verbose: request + response headers + body
```

---

## POST Request

```bash
# JSON body
curl -X POST https://api.example.com/users \
  -H "Content-Type: application/json" \
  -d '{"name":"Alice","email":"alice@example.com"}'

# Form data
curl -X POST https://api.example.com/form \
  -d "username=alice&password=secret"

# From a file
curl -X POST https://api.example.com/data \
  -H "Content-Type: application/json" \
  -d @payload.json
```

---

## PUT and PATCH

```bash
# PUT (replace entire resource)
curl -X PUT https://api.example.com/users/123 \
  -H "Content-Type: application/json" \
  -d '{"name":"Alice Updated"}'

# PATCH (partial update)
curl -X PATCH https://api.example.com/users/123 \
  -H "Content-Type: application/json" \
  -d '{"email":"new@email.com"}'
```

---

## DELETE

```bash
curl -X DELETE https://api.example.com/users/123 \
  -H "Authorization: Bearer TOKEN"
```

---

## Authentication

```bash
# Bearer token
curl -H "Authorization: Bearer eyJhbGc..." https://api.example.com

# Basic auth (username:password)
curl -u username:password https://api.example.com

# API key as header
curl -H "X-API-Key: your-api-key" https://api.example.com

# API key as query param
curl "https://api.example.com/data?api_key=your-api-key"
```

---

## Save Response to File

```bash
curl -o output.json https://api.example.com/data
curl -O https://example.com/file.pdf           # save with original name
```

---

## Follow Redirects

```bash
curl -L https://short.url/abc              # -L follows redirects
```

---

## Show Status Code

```bash
curl -s -o /dev/null -w "%{http_code}" https://api.example.com
# Outputs: 200
```

---

## Timeout

```bash
curl --connect-timeout 5 --max-time 30 https://api.example.com
```

---

## Practical Examples

```bash
# GitHub API — get repo info
curl -s https://api.github.com/repos/eliekh05/guides | jq '{stars: .stargazers_count, forks: .forks_count}'

# Weather API (OpenWeatherMap)
curl -s "https://api.openweathermap.org/data/2.5/weather?q=Beirut&appid=YOUR_KEY" | jq '.main.temp'

# Check if a URL returns 200
STATUS=$(curl -s -o /dev/null -w "%{http_code}" https://example.com)
[ "$STATUS" = "200" ] && echo "Up" || echo "Down: $STATUS"

# Post JSON and capture response
RESPONSE=$(curl -s -X POST https://api.example.com/token \
  -H "Content-Type: application/json" \
  -d '{"username":"alice","password":"secret"}')
TOKEN=$(echo $RESPONSE | jq -r '.access_token')
```

---

## Common Issues

**SSL certificate error:**
```bash
curl -k https://...    # skip certificate check (insecure, for testing only)
```

**Proxy:**
```bash
curl -x http://proxy:8080 https://api.example.com
export https_proxy=http://proxy:8080    # set for all curl commands
```
