---
layout: default
title: "deb822 vs One-Line Format for APT Sources"
parent: "Package Managers (All OSes)"
nav_order: 11
---

# deb822 vs One-Line Format for APT Sources

When adding a repository to a Debian-based system (Debian, Ubuntu, Linux Mint, etc.) you will see two different formats used across different guides. This explains what each one is, how they differ, and when to use which.

---

## One-Line Format (`.list` files)

The original format. Each source is a single line in a file ending in `.list`.

**File location:** `/etc/apt/sources.list.d/something.list`

**Format:**
```
deb [signed-by=/usr/share/keyrings/keyname.gpg] https://repo.example.com/debian suite component
```

**Real example — Proxmox (old way):**
```
deb [arch=amd64 signed-by=/usr/share/keyrings/proxmox-archive-keyring.gpg] http://download.proxmox.com/debian/pve trixie pve-no-subscription
```

**Add with a command:**
```bash
echo "deb [signed-by=/usr/share/keyrings/keyname.gpg] https://repo.example.com/debian suite component" \
  | sudo tee /etc/apt/sources.list.d/something.list
```

**Disable a source** — comment out the line with `#`:
```
# deb [signed-by=...] https://...
```

---

## deb822 Format (`.sources` files)

The modern format introduced in APT 1.1 (available on all current Debian/Ubuntu versions). Each source is a multi-line block in a file ending in `.sources`.

**File location:** `/etc/apt/sources.list.d/something.sources`

**Format:**
```
Types: deb
URIs: https://repo.example.com/debian
Suites: suite
Components: component
Signed-By: /usr/share/keyrings/keyname.gpg
```

**Real example — Proxmox (current official way):**
```
Types: deb
URIs: http://download.proxmox.com/debian/pve
Suites: trixie
Components: pve-no-subscription
Signed-By: /usr/share/keyrings/proxmox-archive-keyring.gpg
```

**Add with nano:**
```bash
nano /etc/apt/sources.list.d/something.sources
```

Paste the block, save with **Ctrl+X → Y → Enter**.

**Disable a source** — add `Enabled: no` instead of commenting:
```
Types: deb
URIs: https://...
Suites: trixie
Components: pve-enterprise
Signed-By: /usr/share/keyrings/proxmox-archive-keyring.gpg
Enabled: no
```

---

## Side-by-Side Comparison

| | One-Line (`.list`) | deb822 (`.sources`) |
|---|---|---|
| File extension | `.list` | `.sources` |
| Format | Single line | Multi-line block |
| Readable | Hard when options are long | Much easier to read |
| Multiple sources in one file | One per line | One block per source, separated by blank line |
| Disable without deleting | Comment out with `#` | Add `Enabled: no` |
| Officially recommended | Older systems | **Current recommended** by Debian |
| Supported since | Always | APT 1.1+ (Debian 9+, Ubuntu 16.04+) |

---

## Key Differences

**Signing key reference:**

One-line puts the key in square brackets inline:
```
deb [signed-by=/usr/share/keyrings/key.gpg] https://...
```

deb822 uses a dedicated field:
```
Signed-By: /usr/share/keyrings/key.gpg
```

**Multiple URIs** — deb822 supports multiple URIs for failover in one block:
```
Types: deb
URIs: https://primary.example.com/debian https://mirror.example.com/debian
Suites: trixie
Components: main
Signed-By: /usr/share/keyrings/key.gpg
```

One-line cannot do this without duplicating the entire line.

**Architecture restriction:**

One-line: `deb [arch=amd64] https://...`

deb822:
```
Types: deb
URIs: https://...
Architectures: amd64
```

---

## Which One to Use

**Use deb822** if:
- You are on Debian 9+ or Ubuntu 16.04+ (i.e. any current system)
- You are following official documentation — Proxmox, Docker, and most major projects now use deb822
- You want cleaner, more readable source files

**Use one-line** if:
- You are following an older guide that uses it
- You need compatibility with very old systems
- You want to paste a quick one-liner into the terminal

Both formats work identically — APT supports both at the same time. A system can have `.list` files and `.sources` files in `/etc/apt/sources.list.d/` with no conflict.

---

## Convert One-Line to deb822

If you have an existing one-line source and want to convert it:

**One-line:**
```
deb [arch=amd64 signed-by=/usr/share/keyrings/key.gpg] https://repo.example.com/debian bookworm main
```

**deb822 equivalent:**
```
Types: deb
URIs: https://repo.example.com/debian
Suites: bookworm
Components: main
Architectures: amd64
Signed-By: /usr/share/keyrings/key.gpg
```

On Debian 13 (Trixie) and Ubuntu 24.04+, you can also run:
```bash
apt modernize-sources
```

This automatically converts existing `.list` files to deb822 `.sources` format.
