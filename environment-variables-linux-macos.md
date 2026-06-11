---
layout: default
title: "Environment Variables on macOS and Linux"
parent: "Linux"
nav_order: 36
---

# Environment Variables on macOS and Linux

Environment variables are named values that programs and the shell use for configuration — things like where to find executable programs (PATH), which text editor to use (EDITOR), your home directory (HOME), and many more.

---

## View Variables

```bash
env                              # all environment variables
printenv                         # same
printenv PATH                    # specific variable
echo $PATH                       # print value of PATH
echo $HOME                       # print home directory
echo $USER                       # current username
echo $SHELL                      # current shell
```

---

## Set a Variable for the Current Session

```bash
MY_VAR="hello"
echo $MY_VAR                     # prints: hello
```

This only lasts until you close the terminal.

---

## Export a Variable (Make It Available to Programs)

```bash
export MY_VAR="hello"
export DATABASE_URL="postgres://localhost/mydb"
```

Without `export`, the variable exists in your shell but programs you launch from it cannot see it.

---

## Make Variables Permanent

Add to `~/.zprofile` (macOS/zsh) or `~/.bashrc` (bash/Linux):

```bash
echo 'export MY_VAR="hello"' >> ~/.zprofile
source ~/.zprofile               # apply immediately
```

---

## PATH — The Most Important Variable

PATH is a colon-separated list of folders. When you type a command, the shell looks through each folder in PATH to find the executable.

```bash
echo $PATH
# /usr/local/bin:/usr/bin:/bin:/usr/sbin:/sbin
```

**Add a folder to PATH permanently:**

```bash
echo 'export PATH="/my/custom/bin:$PATH"' >> ~/.zprofile
source ~/.zprofile
```

The `:$PATH` at the end appends your folder to the existing PATH. Without it, you would replace the entire PATH and break most commands.

**Check where a command comes from:**
```bash
which python3
which brew
type -a python3                  # shows all locations
```

---

## Common Environment Variables

| Variable | What it means |
|---|---|
| `PATH` | Where to find executable programs |
| `HOME` | Your home directory |
| `USER` | Current username |
| `SHELL` | Path to current shell |
| `EDITOR` | Default text editor |
| `VISUAL` | Default visual editor |
| `LANG` | Language/locale |
| `TERM` | Terminal type |
| `TMPDIR` | Temporary files directory |
| `http_proxy` / `https_proxy` | Proxy server for HTTP/HTTPS |

---

## Useful Patterns

**Set variable only for one command:**
```bash
NODE_ENV=production node app.js
DEBUG=true ./myscript.sh
```

**Pass variable to sudo (sudo drops most env vars):**
```bash
sudo -E node app.js              # preserve environment
sudo MY_VAR=hello node app.js   # pass specific variable
```

**Store secrets in variables, not files:**
```bash
export API_KEY="mysecretkey"
# In your script: curl -H "Authorization: $API_KEY" https://api.example.com
```

**Check if a variable is set:**
```bash
if [ -z "$MY_VAR" ]; then
    echo "MY_VAR is not set"
fi
```

---

## .env Files (For Projects)

Many projects use a `.env` file to store environment variables:

```
DATABASE_URL=postgres://localhost/mydb
API_KEY=secret123
DEBUG=true
```

Load them into the current shell:
```bash
export $(cat .env | xargs)
```

Or use a tool like `direnv` which automatically loads `.env` files when you `cd` into a project folder:
```bash
brew install direnv     # macOS
sudo apt install direnv # Ubuntu/Debian
echo 'eval "$(direnv hook zsh)"' >> ~/.zshrc
```
