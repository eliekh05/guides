---
layout: default
title: "Terminal Password Not Showing While Typing"
parent: "macOS"
nav_order: 27
---

# Terminal Password Not Showing While Typing

You type `sudo` or SSH into a server and it asks for a password. You start typing and nothing appears on screen. No asterisks, no dots, nothing. The cursor just sits there.

Your keyboard is not broken. The password is being entered. This is intentional.

---

## Why Nothing Shows

Terminal hides password input completely — not even asterisks — as a security measure. If asterisks appeared, someone watching over your shoulder would know how many characters your password is. Showing nothing gives them no information at all.

This is standard behaviour on every Unix/Linux/macOS system. It has worked this way for decades.

---

## What to Do

Type your password normally and press **Enter**. If the password is correct, the command runs. If it is wrong, it says "incorrect password" or "try again" and you type it again.

If you want visual confirmation while typing, some tools like `sudo` on Linux can be configured to show asterisks. Add this to `/etc/sudoers` using `visudo`:

```
Defaults    pwfeedback
```

This makes sudo show `*` for each character you type. macOS does not support this option.

---

## "I Typed the Password and Nothing Happened"

If you pressed Enter and nothing happened at all — no error, no prompt — you may have been on a slow SSH connection with a delay, or the command took a moment to authenticate. Wait a few seconds.

If you get `incorrect password` immediately after pressing Enter, you typed the wrong password or pressed Enter before finishing.

---

> **Summary:** Terminal deliberately shows nothing when you type passwords. Type normally and press Enter. Your keyboard is fine.
