---
layout: default
title: "Git Basics — Commands You Actually Use"
parent: "Linux"
nav_order: 26
---

# Git Basics — Commands You Actually Use

---

## First-Time Setup

```bash
git config --global user.name "Your Name"
git config --global user.email "you@example.com"
```

---

## Starting a Project

```bash
git init                                          # Track current folder
git clone https://github.com/user/repo.git        # Download a repo
git clone https://github.com/user/repo.git folder # Clone into named folder
```

---

## Daily Workflow

```bash
git status                    # See what changed
git add filename.txt          # Stage a file
git add .                     # Stage everything
git commit -m "Fix bug"       # Commit with message
git commit -am "Fix bug"      # Stage tracked files + commit in one step
git push                      # Push to remote
git pull                      # Pull latest from remote
```

---

## History

```bash
git log                       # Full history
git log --oneline             # Compact one-line view
git log --oneline --graph --all  # Branch graph
git diff                      # Changes not yet staged
git diff --staged             # Changes staged but not committed
```

---

## Undoing Things

```bash
git restore filename.txt          # Discard changes to a file
git restore --staged filename.txt # Unstage a file (keep changes)
git reset --soft HEAD~1           # Undo last commit, keep changes staged
git reset --mixed HEAD~1          # Undo last commit, unstage changes
git reset --hard HEAD~1           # Undo last commit, DISCARD changes
git revert abc1234                # Safely undo a commit (creates new commit)
```

> Use `revert` on shared branches. Use `reset` only on your own local branches.

---

## Branches

```bash
git branch                    # List branches
git switch -c feature-login   # Create and switch to new branch
git switch main               # Switch to existing branch
git merge feature-login       # Merge branch into current
git branch -d feature-login   # Delete merged branch
git branch -D feature-login   # Force delete
```

---

## Remote

```bash
git remote -v                              # See linked remotes
git remote add origin https://github.com/user/repo.git  # Link a remote
git push -u origin feature-login          # Push new branch first time
git push                                   # After that
git pull --rebase                         # Pull with cleaner history
```

---

## Stash

```bash
git stash                        # Save current changes temporarily
git stash pop                    # Apply and remove latest stash
git stash list                   # See all stashes
git stash push -m "half-done"   # Named stash
```

---

## .gitignore

Create `.gitignore` in project root:

```
node_modules/
.env
.DS_Store
__pycache__/
*.log
.venv/
dist/
```

Stop tracking an already-tracked file:
```bash
git rm --cached filename
```

---

## Common Mistakes Fixed

```bash
# Committed to wrong branch
git reset --soft HEAD~1     # undo commit
git switch -c correct-branch
git commit -m "message"

# Need to fix last commit message
git commit --amend -m "Correct message"

# Accidentally deleted a file
git restore deleted-file.txt

# Everything broke, go back to last commit
git restore .
```
