---
layout: default
title: "Nix Package Manager — Complete Beginner Guide"
parent: "Package Managers (All OSes)"
nav_order: 10
---

# Nix Package Manager — Complete Beginner Guide

Nix is a package manager that works on Linux, macOS, and Windows (via WSL). It is fundamentally different from every other package manager — it installs packages into isolated, immutable directories in `/nix/store`, never overwriting system files. Multiple versions of the same package can coexist without conflict, and you can roll back any installation.

This makes it the go-to tool for developers who need reproducible environments, but it also has a steep learning curve. This guide starts from zero and explains everything clearly.

---

## What Makes Nix Different

Every other package manager installs packages into shared system directories (`/usr/bin`, `/usr/lib`). Nix installs each package into its own unique directory like:

```
/nix/store/abc123def456-firefox-126.0/
/nix/store/xyz789ghi012-nodejs-20.11.0/
```

The hash in the folder name is computed from every input that went into building the package — its source, dependencies, build flags, everything. This means:

- Two packages that depend on different versions of the same library get their own isolated copies — no conflicts
- Installing a package never breaks something else that was working
- Every Nix install of the same package produces bit-for-bit identical results
- You can roll back to any previous state

---

## Install Nix

**Recommended — Determinate Systems installer (enables flakes by default):**

```bash
curl --proto '=https' --tlsv1.2 -sSf -L https://install.determinate.systems/nix | sh -s -- install
```

**Official installer:**

```bash
sh <(curl -L https://nixos.org/nix/install) 
```

After installation, close and reopen your terminal (or source the profile):

```bash
source /etc/profile
```

Verify:

```bash
nix --version
```

---

## Two CLIs — Old and New

Nix has two sets of commands and this is where beginners get confused.

| Old (nix-env style) | New (nix profile / flakes style) | What it does |
|---|---|---|
| `nix-env -iA nixpkgs.firefox` | `nix profile install nixpkgs#firefox` | Install a package |
| `nix-env -e firefox` | `nix profile remove firefox` | Remove a package |
| `nix-env -u` | `nix profile upgrade '.*'` | Upgrade all packages |
| `nix-env -q` | `nix profile list` | List installed packages |
| `nix-shell -p package` | `nix shell nixpkgs#package` | Temporary shell with package |
| `nix-env --rollback` | `nix profile rollback` | Roll back to previous state |

The new CLI requires flakes to be enabled. Both work fine — use whichever you see in guides you are following.

### Enable flakes (if not using Determinate installer)

```bash
mkdir -p ~/.config/nix
echo "experimental-features = nix-command flakes" >> ~/.config/nix/nix.conf
```

---

## Finding Packages

Search at [search.nixos.org](https://search.nixos.org) — select the channel you are using (usually `nixpkgs` or `unstable`).

Or search from the command line:

```bash
nix search nixpkgs firefox
```

Packages are referenced by their **attribute path** — usually `nixpkgs#packagename` or `nixpkgs.packagename`.

---

## Installing Packages Permanently

### New CLI (recommended with flakes)

```bash
nix profile install nixpkgs#firefox
nix profile install nixpkgs#git nixpkgs#vim nixpkgs#curl
```

### Old CLI

```bash
nix-env -iA nixpkgs.firefox
```

---

## Trying a Package Without Installing It

This is one of Nix's killer features — spin up a temporary shell with any package available, then exit and it's gone:

```bash
# New CLI
nix shell nixpkgs#cowsay
cowsay "Hello from Nix"
exit   # cowsay is gone

# Old CLI
nix-shell -p cowsay
```

You can combine multiple packages:

```bash
nix shell nixpkgs#python3 nixpkgs#nodejs nixpkgs#git
```

This is perfect for trying something out before committing to an install.

---

## Running a Package Once Without Installing

```bash
nix run nixpkgs#cowsay -- "Hello"
```

The package runs once and is not added to your profile.

---

## Upgrading Packages

### New CLI

```bash
nix profile upgrade '.*'          # Upgrade everything
nix profile upgrade firefox       # Upgrade specific package
```

### Old CLI

```bash
nix-env -u                        # Upgrade everything
nix-env -u firefox                # Upgrade specific package
```

---

## Removing Packages

### New CLI

```bash
nix profile list                  # Get the index number or name
nix profile remove firefox
```

### Old CLI

```bash
nix-env -e firefox
```

---

## Rolling Back

Every Nix operation creates a new **generation** — a snapshot of your profile state. You can roll back to any of them.

```bash
# List generations
nix profile history               # new CLI
nix-env --list-generations        # old CLI

# Roll back to previous generation
nix profile rollback              # new CLI
nix-env --rollback                # old CLI

# Switch to a specific generation (old CLI)
nix-env --switch-generation 42
```

---

## Cleaning Up Disk Space

Nix keeps all old generations and unused packages in `/nix/store`. Clean them up:

```bash
# Delete old generations (keep current)
nix profile wipe-history --older-than 30d   # new CLI
nix-env --delete-generations old            # old CLI

# Remove packages no longer referenced by any generation
nix-collect-garbage
nix-collect-garbage -d   # delete old generations AND collect garbage
```

---

## nix-env vs nix profile — Key Differences

`nix-env` is the older command. `nix profile` is the modern replacement introduced in Nix 2.0. For new setups use `nix profile`. If following an older guide that uses `nix-env`, it still works — no need to translate.

---

## Nix on macOS — Home Manager

On macOS, many developers use **nix-darwin** (like NixOS but for macOS system config) and **Home Manager** (manages user packages and dotfiles declaratively). These are separate tools on top of Nix and are outside the scope of this beginner guide, but they are worth looking into once you are comfortable with basic Nix commands.

---

## Quick Reference

| Task | New CLI | Old CLI |
|---|---|---|
| Install | `nix profile install nixpkgs#pkg` | `nix-env -iA nixpkgs.pkg` |
| Remove | `nix profile remove pkg` | `nix-env -e pkg` |
| Upgrade all | `nix profile upgrade '.*'` | `nix-env -u` |
| List installed | `nix profile list` | `nix-env -q` |
| Search | `nix search nixpkgs term` | `nix-env -qaP term` |
| Temp shell | `nix shell nixpkgs#pkg` | `nix-shell -p pkg` |
| Run once | `nix run nixpkgs#pkg` | — |
| Rollback | `nix profile rollback` | `nix-env --rollback` |
| List generations | `nix profile history` | `nix-env --list-generations` |
| Garbage collect | `nix-collect-garbage -d` | `nix-collect-garbage -d` |

---

## Why Use Nix?

- Works on **Linux, macOS, and WSL** — same commands everywhere
- Install tools without touching system packages — safe on macOS alongside Homebrew
- Try any package in a temporary shell without installing it
- Never break your system — always roll back
- Massive package repository — over 100,000 packages, more than Homebrew or any distro
- Reproducible environments — share a `shell.nix` and anyone gets the exact same setup
