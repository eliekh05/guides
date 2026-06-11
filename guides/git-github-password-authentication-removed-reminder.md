---
layout: default
title: "GitHub \"Support for Password Authentication Was Removed\" Reminder"
parent: "macOS"
nav_order: 25
---

# GitHub "Support for Password Authentication Was Removed" Reminder

When you try to push to GitHub and see:

```
remote: Support for password authentication was removed on August 13, 2021.
remote: Please use a personal access token instead.
fatal: Authentication failed
```

You are typing your GitHub account password when git asks for a password. GitHub stopped accepting account passwords for git operations in August 2021. Your password is not wrong — GitHub simply no longer accepts it.

---

## What GitHub Wants Instead

You have two options:

**Option 1 — Personal Access Token (PAT)**

A token is a long string of random characters that acts like a password but can be restricted to specific permissions and revoked at any time.

1. Go to **github.com → Settings → Developer settings → Personal access tokens → Tokens (classic)**
2. Click **Generate new token (classic)**
3. Give it a name, set an expiry, and check the **repo** scope
4. Copy the token — GitHub only shows it once
5. Next time git asks for your password, paste the token instead of your account password

**Option 2 — SSH Keys (Recommended, No Password Prompts)**

SSH keys authenticate you automatically without entering anything. See the **Set Up SSH Keys from Scratch** guide on this site.

---

## Store the Token So Git Stops Asking Every Time

**macOS — store in Keychain:**
```bash
git config --global credential.helper osxkeychain
```
Enter your username and paste the token as the password once — macOS saves it.

**Linux:**
```bash
git config --global credential.helper store
```
Stores credentials in a plain text file at `~/.git-credentials`. Fine for personal machines.

**Windows:**
Git Credential Manager is included with Git for Windows and handles this automatically. When prompted, choose **Sign in with your browser**.

---

## If You Already Have a Saved Password That Is Now Rejected

macOS Keychain may have your old GitHub password cached. Update it:

1. Open **Keychain Access** (search with Spotlight)
2. Search for `github.com`
3. Double-click the entry → **Show Password** → replace the old password with your new token
4. Save

---

> **Summary:** GitHub no longer accepts your account password for git push/pull. Use a Personal Access Token in its place, or switch to SSH keys to avoid typing anything at all.
