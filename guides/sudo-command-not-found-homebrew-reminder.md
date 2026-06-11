---
layout: default
title: "\"sudo: command not found\" After Installing With Homebrew"
parent: "macOS"
nav_order: 26
---

# "sudo: command not found" After Installing With Homebrew

You install something with Homebrew and it installs without errors. Then you type:

```bash
sudo python3 script.py
# or
sudo node app.js
# or
sudo some-command
```

And get:

```
sudo: python3: command not found
```

But without sudo it works fine:

```bash
python3 --version   # works
```

---

## Why This Happens

`sudo` runs commands as root. Root has its own PATH — a list of folders where it looks for commands. Root's PATH does not include `/opt/homebrew/bin` (where Homebrew installs things on Apple Silicon) or `/usr/local/bin` (Intel Mac).

So when you run `sudo python3`, root looks in its own PATH, cannot find Python there, and says "command not found" — even though you can run `python3` as your own user.

---

## The Fix

**Option 1 — Use the full path:**
```bash
which python3
# /opt/homebrew/bin/python3

sudo /opt/homebrew/bin/python3 script.py
```

**Option 2 — Use sudo -E to preserve your environment:**
```bash
sudo -E python3 script.py
```

**Option 3 — Use sudo env with PATH:**
```bash
sudo env "PATH=$PATH" python3 script.py
```

**Option 4 — Edit sudoers to include Homebrew path (permanent fix):**
```bash
sudo visudo
```
Find the line `Defaults    secure_path` and add `/opt/homebrew/bin`:
```
Defaults    secure_path = /opt/homebrew/bin:/usr/local/bin:/usr/bin:/bin:/usr/sbin:/sbin
```

---

## Do You Actually Need sudo?

Most of the time the answer is no. Homebrew is specifically designed so you never need `sudo` — it installs everything into your user-owned directory. If a script or tutorial tells you to run `sudo brew install something`, that is wrong. Homebrew will refuse and tell you so.

If you are running a server script or a system-level task that actually needs root, use the full path approach above.

---

> **Summary:** sudo uses root's PATH which does not include Homebrew's bin folder. Use the full path (`/opt/homebrew/bin/command`) or `sudo env "PATH=$PATH" command` instead.
