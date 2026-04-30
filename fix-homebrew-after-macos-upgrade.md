---
layout: default
title: "Fix Homebrew After a macOS Upgrade"
parent: "Package Managers (All OSes)"
nav_order: 3
---

# Fix Homebrew After a macOS Upgrade

After upgrading macOS, Homebrew often breaks — packages stop working, `brew` command disappears, or you get `dyld: Library not loaded` errors. This is one of the most searched Homebrew problems and happens on almost every major macOS upgrade.

---

## Step 1 — Reinstall Xcode Command Line Tools

Following a macOS upgrade it may be necessary to reinstall the Xcode Command Line Tools. This is the first thing to do after any major macOS update:

```bash
xcode-select --install
```

A dialog will appear asking to install the tools. Click **Install** and wait for it to finish (5–15 minutes). Then run:

```bash
brew update && brew upgrade
```

If this fixes everything, you are done. If not, continue below.

---

## Step 2 — Fix broken packages with dyld errors

After a macOS upgrade you may see errors like:

```
dyld: Library not loaded: /opt/homebrew/opt/icu4c/lib/libicui18n.76.dylib
```

This means a package's dependencies were upgraded but the package itself was not relinked. Fix it:

```bash
brew upgrade
brew link --overwrite $(brew list)
```

If specific packages are still broken:

```bash
brew reinstall PACKAGE_NAME
```

---

## Step 3 — Fix brew Command Not Found After Upgrade

If `brew` itself is gone from your PATH after a macOS upgrade:

**Apple Silicon:**
```bash
echo 'eval "$(/opt/homebrew/bin/brew shellenv)"' >> ~/.zprofile
source ~/.zprofile
```

**Intel Mac:**
```bash
echo 'eval "$(/usr/local/bin/brew shellenv)"' >> ~/.zprofile
source ~/.zprofile
```

Then verify:
```bash
brew --version
```

---

## Step 4 — Run brew doctor

```bash
brew doctor
```

This checks your Homebrew installation for problems and tells you exactly what to fix. Read each warning and follow the suggested fix. Run it again after each fix until it says `Your system is ready to brew`.

---

## Step 5 — Fix Two Homebrew Installations (Migration Assistant Issue)

When using tools such as Apple's Migration Assistant, it's possible to have two Homebrew installations unintentionally. This causes conflicts where some packages work and others do not.

Check for duplicate installations:
```bash
ls /opt/homebrew/bin/brew 2>/dev/null && echo "Apple Silicon Homebrew found"
ls /usr/local/bin/brew 2>/dev/null && echo "Intel Homebrew found"
```

If both exist on an Apple Silicon Mac, the Intel one at `/usr/local` is the wrong one. Remove it:
```bash
sudo rm -rf /usr/local/Homebrew
sudo rm -rf /usr/local/Cellar
```

Then reinstall Homebrew fresh for Apple Silicon:
```bash
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
```

Reinstall your packages:
```bash
brew install PACKAGE_NAME
```

---

## Step 6 — Full Reinstall (Last Resort)

If nothing else works, a clean reinstall is the most reliable fix:

```bash
# First export your current package list
brew list --formula > ~/brew-formulas.txt
brew list --cask > ~/brew-casks.txt

# Uninstall Homebrew
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/uninstall.sh)"

# Reinstall Homebrew
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"

# Reinstall all formulas
xargs brew install < ~/brew-formulas.txt

# Reinstall all casks
xargs brew install --cask < ~/brew-casks.txt
```

---

## macOS Version Support

In September 2026 or later, Homebrew will not run on macOS Catalina 10.15 and earlier, and macOS Intel x86_64 will move to Tier 3. If you are on an old macOS version and Homebrew stops receiving updates, upgrading macOS or switching to a supported version is the long-term fix.
