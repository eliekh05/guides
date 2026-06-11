---
layout: default
title: "age — Simple File Encryption"
parent: "Security & Apps"
nav_order: 17
---

# age — Simple File Encryption

`age` (Actually Good Encryption) is a modern, simple file encryption tool. It is easier than GPG for most use cases — encrypt to a recipient's public key or a passphrase.

---

## Install

```bash
brew install age            # macOS
sudo apt install age -y     # Ubuntu/Debian 22.04+
sudo dnf install age -y     # Fedora

# Or download from: github.com/FiloSottile/age/releases
```

---

## Generate a Key Pair

```bash
age-keygen -o ~/.age/key.txt
```

Output:
```
# created: 2025-01-15T12:00:00Z
# public key: age1ql3z7hjy54pw3hyww5ayyfg7zqgvc7w3j2elw8zmrj2kg5sfn9aqmcac8p
AGE-SECRET-KEY-1GFPYYSJZGFPYYSJZGFPYYSJZGFPYYSJZGFPYYSJZGFPYYSJZGFP...
```

The `age1...` string is your public key. The `AGE-SECRET-KEY-...` is your private key.

---

## Encrypt a File

**To a recipient's public key:**
```bash
age -r age1ql3z7hjy54pw3... -o secret.txt.age secret.txt
```

**With a passphrase:**
```bash
age -p -o secret.txt.age secret.txt
```

**Encrypt a directory:**
```bash
tar czf - documents/ | age -r age1... -o documents.tar.gz.age
```

---

## Decrypt a File

**With private key:**
```bash
age -d -i ~/.age/key.txt -o secret.txt secret.txt.age
```

**With passphrase:**
```bash
age -d -o secret.txt secret.txt.age
# Prompts for passphrase
```

**Decrypt a directory:**
```bash
age -d -i ~/.age/key.txt documents.tar.gz.age | tar xzf -
```

---

## Share Your Public Key

Your public key (`age1...`) is safe to share publicly. Anyone who has it can encrypt files that only you can decrypt with your private key.

```bash
# Get your public key from the key file
grep "public key:" ~/.age/key.txt
```

---

## Use SSH Keys as age Keys

If you already have SSH keys, you can use them with age:

```bash
# Encrypt to your own SSH public key
age -r "$(cat ~/.ssh/id_ed25519.pub)" -o file.age file

# Decrypt with your SSH private key
age -d -i ~/.ssh/id_ed25519 -o file file.age
```

---

## age vs GPG

| Feature | age | GPG |
|---|---|---|
| Simplicity | ✅ Very simple | ❌ Complex |
| Key management | Minimal | Complex web of trust |
| Compatibility | Limited | Universal |
| Use case | File encryption | Signing, email, packages |

Use age for encrypting files and backups. Use GPG for signing releases and email (PGP).
