# Fix SSH "Bad Permissions" / "Unprotected Private Key File" Error (macOS and Linux)

When connecting via SSH, you may see an error like:

```
@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
@         WARNING: UNPROTECTED PRIVATE KEY FILE!          @
@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
Permissions 0644 for '/Users/yourname/.ssh/id_rsa' are too open.
It is required that your private key files are NOT accessible by others.
This private key will be ignored.
```

SSH refuses to use your key because **other users on the system can read it**. This is a deliberate security feature: if your private key were readable by anyone, it would defeat the purpose of key-based authentication.

---

## Why This Happens

SSH enforces strict permission requirements on key files and the `.ssh` folder. The error usually occurs after:
- Copying keys from another machine
- Restoring from a backup
- Cloning a repo that included keys
- Creating the `.ssh` folder manually without setting permissions

---

## The Fix — Set Correct Permissions

Run these three commands in Terminal. They set the permissions that SSH requires.

```bash
chmod 700 ~/.ssh
chmod 600 ~/.ssh/id_rsa
chmod 644 ~/.ssh/id_rsa.pub
```

If your key has a different name (e.g., `id_ed25519` or `my_server_key`), replace `id_rsa` with your actual key file name.

---

## What These Permissions Mean

SSH has exact requirements for each file and folder. Here is what is required and why:

| Path | Required Permission | Numeric Code | Meaning |
|---|---|---|---|
| `~/.ssh/` (the folder) | `drwx------` | `700` | Only you can read, write, and enter the folder |
| `~/.ssh/id_rsa` (private key) | `-rw-------` | `600` | Only you can read and write the file — no one else can read it |
| `~/.ssh/id_rsa.pub` (public key) | `-rw-r--r--` | `644` | You can read and write; others can read (this is safe — it is meant to be shared) |
| `~/.ssh/authorized_keys` | `-rw-------` | `600` | Same as the private key — only you |
| `~/.ssh/config` | `-rw-------` | `600` | Only you |
| `~/.ssh/known_hosts` | `-rw-r--r--` | `644` | You can write; others can read |

---

## How to Read Permission Numbers

Each permission number is made up of three digits: **owner**, **group**, **others**.

Each digit is a sum of: **4** (read) + **2** (write) + **1** (execute).

Examples:
- `700` = owner: rwx (4+2+1=7), group: none (0), others: none (0)
- `600` = owner: rw (4+2=6), group: none (0), others: none (0)
- `644` = owner: rw (4+2=6), group: r (4), others: r (4)

---

## Verify Your Permissions

After running the fix, confirm everything is set correctly:

```bash
ls -la ~/.ssh
```

The output should look like this:

```
drwx------   yourname  .ssh/
-rw-------   yourname  id_rsa
-rw-r--r--   yourname  id_rsa.pub
-rw-------   yourname  authorized_keys
-rw-r--r--   yourname  known_hosts
```

---

## Fix Ownership Too (If Needed)

If you copied files from another user or machine, the files might be owned by the wrong user. SSH also rejects keys it does not own:

```bash
chown -R $(whoami) ~/.ssh
```

This sets you as the owner of the `.ssh` folder and everything inside it.

---

> **Note:** These permission rules apply equally on macOS and Linux. On Windows using WSL, the same rules apply inside the WSL environment.
