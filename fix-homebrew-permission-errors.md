---
layout: default
title: "Fix Homebrew Permission Errors"
parent: "Package Managers (All OSes)"
nav_order: 5
---

# Fix Homebrew Permission Errors on macOS

Homebrew permission errors are some of the most frustrating — they block installs, upgrades, and even `brew doctor`. They usually appear after macOS updates, permission changes, or installing Homebrew as root. Here are all the fixes.

---

## Common Permission Error Messages

```
Error: /opt/homebrew is not writable
Error: /usr/local/Cellar is not writable
Error: Could not symlink bin/wget
/usr/local/bin is not writable
Permission denied @ rb_sysopen
```

---

## Fix 1 — Fix Homebrew Directory Ownership (Most Common)

Homebrew should be owned by your user, not root. Reset ownership:

**Apple Silicon:**
```bash
sudo chown -R $(whoami) /opt/homebrew
```

**Intel Mac:**
```bash
sudo chown -R $(whoami) /usr/local/Homebrew /usr/local/Cellar /usr/local/bin /usr/local/lib /usr/local/share
```

Then run `brew doctor` to confirm everything is fixed.

---

## Fix 2 — Fix a Specific Broken Symlink

If only one package has a symlink error like:

```
Error: Could not symlink bin/wget
/usr/local/bin is not writable
```

Fix that specific package:

```bash
sudo chown -R $(whoami) /usr/local/bin
brew link wget
```

If a symlink conflict is causing the issue:
```bash
brew link --overwrite wget
```

---

## Fix 3 — Fix Homebrew After Running as Root (Never Run brew as root or sudo)

Running `sudo brew install` breaks Homebrew's permissions because it creates files owned by root that your user cannot modify. Fix it:

**Apple Silicon:**
```bash
sudo chown -R $(whoami) /opt/homebrew
sudo chown -R $(whoami) $(brew --prefix)/var/homebrew
```

**Intel:**
```bash
sudo chown -R $(whoami) /usr/local/Homebrew
sudo chown -R $(whoami) /usr/local/Cellar
sudo chown -R $(whoami) /usr/local/var
```

> **Important:** Never run `sudo brew` again. Homebrew is specifically designed to run without sudo. If a package asks you to run `sudo brew`, that package has a bug.

---

## Fix 4 — Fix /tmp Permissions

Some Homebrew build failures are caused by wrong `/tmp` permissions:

```bash
sudo chmod 1777 /tmp
```

---

## Fix 5 — Fix Homebrew Cache Permissions

If downloads keep failing with permission errors:

```bash
sudo chown -R $(whoami) $(brew --cache)
chmod -R u+rw $(brew --cache)
```

---

## Fix 6 — Full Permissions Reset

If nothing above works, reset all Homebrew directory permissions at once:

**Apple Silicon:**
```bash
sudo chown -R $(whoami) /opt/homebrew
find /opt/homebrew -type d -exec chmod 755 {} \;
find /opt/homebrew -type f -exec chmod 644 {} \;
find /opt/homebrew/bin -type f -exec chmod 755 {} \;
```

**Intel:**
```bash
sudo chown -R $(whoami) /usr/local/Homebrew /usr/local/Cellar /usr/local/bin /usr/local/lib /usr/local/share /usr/local/var
```

Then run:
```bash
brew update && brew doctor
```

---

## Prevention

- **Never use `sudo brew`** — always run Homebrew as your regular user
- After macOS upgrades, run `brew doctor` immediately to catch permission issues early
- If you need to install something that requires root, use `sudo` on the specific command inside the package, not on `brew` itself
