# Fix curl Errors on macOS (After Reinstalling Homebrew)

This guide covers how to resolve `curl`-related errors that can appear after uninstalling and reinstalling Homebrew on macOS.

> **Note:** Some of these steps take a long time to complete. Be patient and do not cancel them mid-way.

---

## Step 1 — Rebuild curl from Source

1. Clone the curl repository:
   ```bash
   git clone https://github.com/curl/curl.git && cd curl
   ```

2. Try building with CMake from the terminal:
   ```bash
   cmake .
   ```

   If this fails, continue to **Step 2** to use the CMake GUI instead.

---

## Step 2 — Build curl Using the CMake GUI (if Step 1 failed)

1. Download the official [CMake GUI for macOS](https://cmake.org/download/).
2. Move it to your **Applications** folder and open it.
3. Click **Browse Source** and navigate to the folder where you cloned the curl repository (usually in your home directory). Select it and click **Open**.
4. Click **Browse Build**, then click **Make New Folder**, name it `Build`, and select it.
5. Click **Configure** → **Next** and wait for it to finish.
   - If you see an SSL-related error, uncheck the SSL option and click **Configure** again.
6. Click **Generate**, then **Configure** once more.
7. Open Terminal, navigate to the `Build` folder you created, and run:
   ```bash
   sudo make all && sudo make install
   ```

---

## Step 3 — Fix Homebrew if curl Issues Persist

If the steps above did not resolve the problem, the issue may be with Homebrew itself.

### Navigate to the Homebrew bin directory

```bash
cd /usr/local/Homebrew/bin/
```

### Update and restore Homebrew

```bash
brew update-reset && brew update && brew bundle
# Run brew bundle from the directory where your Brewfile is saved
```

---

## Common Errors and Fixes

### HOMEBREW_CELLAR path mismatch

If you see this warning:

> *Your HOMEBREW_PREFIX is set to /usr/local but HOMEBREW_CELLAR is set to /usr/local/Homebrew/Cellar...*

Run:
```bash
echo $HOMEBREW_CELLAR
sudo mv /usr/local/Homebrew/Cellar /usr/local/Cellar
brew update && brew doctor
```

---

### Symlink error — directory not writable

If you see an error like:

> *Error: Could not symlink /usr/local/share/PACKAGE_NAME — not writable*

Run (replacing `PACKAGE_NAME` with the actual package name from the error):
```bash
sudo chown -R $(whoami) /usr/local/share/PACKAGE_NAME
brew link PACKAGE_NAME
brew bundle
# Run brew bundle from the directory where your Brewfile is saved
```

---

## Reinstall Homebrew from Scratch

If nothing above works, do a clean reinstall of Homebrew:

```bash
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install.sh)"
```

---

🎉 **Done!** Your Homebrew installation should now be working correctly.
