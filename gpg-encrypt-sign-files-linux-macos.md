---
layout: default
title: "GPG — Encrypt, Decrypt, and Sign Files"
parent: "Security & Apps"
nav_order: 12
---

# GPG — Encrypt, Decrypt, and Sign Files

GPG (GNU Privacy Guard) lets you encrypt files, sign them to prove authenticity, and verify signatures from others.

---

## Install

```bash
brew install gnupg          # macOS
sudo apt install gnupg -y   # Ubuntu/Debian (usually pre-installed)
```

---

## Generate a Key Pair

```bash
gpg --gen-key
```

Choose:
- **Key type:** RSA and RSA (default) or Ed25519 (modern, recommended)
- **Key size:** 4096 bits for RSA
- **Expiry:** 1 or 2 years is good practice (you can extend)
- **Name and email**
- **Passphrase:** use a strong one

---

## List Keys

```bash
gpg --list-keys                    # public keys
gpg --list-secret-keys             # private keys
```

---

## Encrypt a File

### Encrypt for a recipient (they can decrypt with their private key)

```bash
gpg --encrypt --recipient recipient@email.com file.txt
# Creates file.txt.gpg
```

### Encrypt with a passphrase (symmetric, no keys needed)

```bash
gpg --symmetric file.txt
# Asks for a passphrase, creates file.txt.gpg
```

---

## Decrypt a File

```bash
gpg --decrypt file.txt.gpg > file.txt
# or
gpg --output file.txt --decrypt file.txt.gpg
```

---

## Sign a File (Prove It Came From You)

```bash
# Detached signature (original file unchanged, .sig created alongside)
gpg --detach-sign file.txt
# Creates file.txt.sig

# Inline signature (signs and creates a .gpg file)
gpg --sign file.txt

# Clear-sign (readable text + signature, good for text files)
gpg --clearsign message.txt
```

---

## Verify a Signature

```bash
gpg --verify file.txt.sig file.txt
```

---

## Export and Import Keys

```bash
# Export your public key (share with others)
gpg --export --armor your@email.com > publickey.asc

# Export your private key (backup — keep this safe)
gpg --export-secret-keys --armor your@email.com > privatekey.asc

# Import someone else's public key
gpg --import theirkey.asc

# Import from a keyserver
gpg --keyserver keyserver.ubuntu.com --recv-keys KEYID
```

---

## Trust a Key

After importing a key, mark it as trusted:

```bash
gpg --edit-key their@email.com
# Inside the editor:
trust
# Choose: 5 (ultimate trust for your own keys, 4 for others you fully trust)
quit
```

---

## Key Management

```bash
# Delete a public key
gpg --delete-key email@example.com

# Delete a key pair (public + private)
gpg --delete-secret-and-public-key email@example.com

# Edit key (change expiry, add UID, etc.)
gpg --edit-key email@example.com
```

---

## Practical Use Cases

```bash
# Encrypt a backup
tar -czf - /important/folder | gpg --symmetric > backup.tar.gz.gpg

# Decrypt it
gpg --decrypt backup.tar.gz.gpg | tar -xzf -

# Sign a release file (common in open source projects)
gpg --detach-sign --armor release-v1.0.tar.gz
# Creates release-v1.0.tar.gz.asc

# Verify a signed download
gpg --verify release-v1.0.tar.gz.asc release-v1.0.tar.gz
```
