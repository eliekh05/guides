---
layout: default
title: "Set Up SSH Keys from Scratch (macOS and Linux)"
parent: "macOS & Linux"
nav_order: 19
---

# Set Up SSH Keys from Scratch (macOS and Linux)

SSH keys let you log into servers without a password — faster, more secure, and no more typing credentials every time.

---

## Step 1 — Generate a Key Pair

```bash
ssh-keygen -t ed25519 -C "your@email.com"
```

- `-t ed25519` — modern, secure key type (use this over RSA)
- `-C` — a label so you remember what this key is for (your email works)

You will be asked:
- **Where to save:** press Enter to accept the default (`~/.ssh/id_ed25519`)
- **Passphrase:** optional but recommended — protects the key if someone gets your laptop

This creates two files:
- `~/.ssh/id_ed25519` — your **private key** — never share this
- `~/.ssh/id_ed25519.pub` — your **public key** — this goes on the server

---

## Step 2 — Copy the Public Key to a Server

```bash
ssh-copy-id username@server_ip
```

Enter your password one last time. From now on, no password needed.

If `ssh-copy-id` is not available (some macOS setups):

```bash
cat ~/.ssh/id_ed25519.pub | ssh username@server_ip "mkdir -p ~/.ssh && cat >> ~/.ssh/authorized_keys && chmod 600 ~/.ssh/authorized_keys"
```

---

## Step 3 — Log In

```bash
ssh username@server_ip
```

No password prompt — you are in.

---

## Step 4 — Set Up ~/.ssh/config for Multiple Servers

Instead of typing `ssh user@192.168.1.100` every time, create shortcuts:

```bash
nano ~/.ssh/config
```

```
Host myserver
    HostName 192.168.1.100
    User ubuntu
    IdentityFile ~/.ssh/id_ed25519

Host vps
    HostName 203.0.113.45
    User root
    Port 2222
    IdentityFile ~/.ssh/id_ed25519
```

Now you just type:
```bash
ssh myserver
ssh vps
```

Set correct permissions:
```bash
chmod 600 ~/.ssh/config
```

---

## Add Key to SSH Agent (So You Only Enter Passphrase Once)

```bash
# Start the agent
eval "$(ssh-agent -s)"

# Add your key
ssh-add ~/.ssh/id_ed25519
```

**macOS — make it persist across reboots:**

Add to `~/.ssh/config`:
```
Host *
    AddKeysToAgent yes
    UseKeychain yes
    IdentityFile ~/.ssh/id_ed25519
```

Then:
```bash
ssh-add --apple-use-keychain ~/.ssh/id_ed25519
```

---

## Copy Public Key to GitHub / GitLab

```bash
# Print your public key
cat ~/.ssh/id_ed25519.pub
```

Copy the entire output. Then:
- **GitHub:** Settings → SSH and GPG keys → New SSH key → paste
- **GitLab:** Preferences → SSH Keys → paste

Test:
```bash
ssh -T git@github.com
# Should say: Hi username! You've successfully authenticated...
```

---

## Troubleshooting

**Still asking for password after copying key:**
```bash
# Check permissions
chmod 700 ~/.ssh
chmod 600 ~/.ssh/authorized_keys
```

**Permission denied (publickey):**
The key was not copied to the server. Repeat Step 2, or manually paste the contents of `~/.ssh/id_ed25519.pub` into `~/.ssh/authorized_keys` on the server.
