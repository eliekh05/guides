# Fix Homebrew / Commands Not Found After New Shell Session (macOS)

After installing Homebrew or a tool via Homebrew, you may find that the command works in one Terminal window but not in a new one — or disappears entirely after a restart. This happens because the command's location is not in your **PATH**, or the file where you added it is not being loaded correctly.

---

## Why This Happens

When you open a new Terminal session on macOS, the shell reads one or more configuration files to set up your environment (including PATH). The problem is that **which file gets loaded depends on the shell and how the terminal was opened**, and these files are not interchangeable.

macOS has used **zsh** as the default shell since macOS Catalina (10.15). If you are on an older Mac or switched manually, you may still be using **bash**.

---

## Which File Should You Edit?

### If you use zsh (default on macOS Catalina and later):

| File | When it loads |
|---|---|
| `~/.zprofile` | At login (when you open a new Terminal window or tab) |
| `~/.zshrc` | Every time a new interactive shell starts |

**Rule of thumb:** Put `export PATH=...` lines in `~/.zprofile`. Put aliases and shell functions in `~/.zshrc`.

### If you use bash (macOS Mojave and earlier, or manually switched):

| File | When it loads |
|---|---|
| `~/.bash_profile` | At login |
| `~/.bashrc` | For interactive non-login shells |

**Rule of thumb:** Put `export PATH=...` lines in `~/.bash_profile`. Many people also add `source ~/.bashrc` inside `~/.bash_profile` to make both load together.

---

## Fix — Add Homebrew to Your PATH

### Apple Silicon Macs (M1, M2, M3, M4)

Homebrew installs to `/opt/homebrew/` on Apple Silicon. Add it to your PATH:

```bash
echo 'eval "$(/opt/homebrew/bin/brew shellenv)"' >> ~/.zprofile
source ~/.zprofile
```

### Intel Macs

Homebrew installs to `/usr/local/` on Intel Macs:

```bash
echo 'eval "$(/usr/local/bin/brew shellenv)"' >> ~/.zprofile
source ~/.zprofile
```

After running these commands, open a new Terminal window and test:
```bash
brew --version
```

---

## Fix — Add Any Custom Path

If you need to add a specific folder (not just Homebrew) to your PATH:

```bash
echo 'export PATH="/your/custom/path:$PATH"' >> ~/.zprofile
source ~/.zprofile
```

Replace `/your/custom/path` with the actual directory. The `:$PATH` at the end preserves all the existing paths — never leave that out.

---

## Diagnose What Is Happening

### Check your current PATH:
```bash
echo $PATH
```

### Check which shell you are using:
```bash
echo $SHELL
```

### Check if a file exists and what is in it:
```bash
cat ~/.zprofile
cat ~/.zshrc
cat ~/.bash_profile
```

### Check where a command is installed:
```bash
which brew
which python3
which node
```

If `which` returns nothing, the tool is either not installed or its folder is not in your PATH.

---

## Common Mistakes

**Putting PATH exports in the wrong file:**
Adding an `export PATH=` line to `~/.zshrc` instead of `~/.zprofile` can work but may cause unexpected behavior if the shell is launched in non-interactive mode (as `launchd` scripts do).

**Using `source` on the wrong file:**
If you edited `~/.zprofile` but ran `source ~/.zshrc`, your changes will not take effect. Always `source` the file you edited, or simply open a new Terminal window.

**Not reloading the file after editing:**
After editing any config file, either run `source ~/.zprofile` (or whichever file you edited), or open a new Terminal window. Changes do not apply to the current session automatically.

---

> **Note:** If you switched from bash to zsh (or vice versa) at some point, you may have PATH exports in both `~/.bash_profile` and `~/.zprofile` that conflict. Check both files and consolidate everything into the correct one for your current shell.
