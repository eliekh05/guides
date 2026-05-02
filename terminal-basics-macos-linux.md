---
layout: default
title: "Terminal Basics for macOS and Linux"
parent: "macOS & Linux"
nav_order: 14
---

# Terminal Basics for macOS and Linux

Most guides on this site assume you know how to use the Terminal. If you have never used it before, this guide gives you everything you need to follow any other guide here.

---

## Opening Terminal

**macOS:**
- Press **Command (⌘) + Space** to open Spotlight, type `Terminal`, press Enter
- Or: Applications → Utilities → Terminal

**Linux (Ubuntu/Debian):**
- Press **Ctrl + Alt + T**
- Or search for Terminal in your app launcher

---

## How Terminal Works

Terminal is a text interface to your computer. You type a command, press **Enter**, and the computer runs it. The output appears below your command.

The **prompt** is the line waiting for your input. It usually looks like:

```
yourname@macbook ~ %
```

- `yourname` — your username
- `macbook` — your computer name
- `~` — your current folder (`~` means your home folder)
- `%` or `$` — indicates the shell is ready for input

---

## Navigating Folders

### Where am I?

```bash
pwd
```

Prints your current folder path (Print Working Directory).

### What is in this folder?

```bash
ls
```

Lists files and folders. To show hidden files too:

```bash
ls -a
```

To show details (permissions, size, date):

```bash
ls -la
```

### Move into a folder

```bash
cd Documents
```

Move into a subfolder:

```bash
cd Documents/Projects/myproject
```

Move up one level:

```bash
cd ..
```

Go back to your home folder from anywhere:

```bash
cd ~
```

Or just:

```bash
cd
```

Go to a full path:

```bash
cd /Applications
cd /usr/local/bin
```

> **Tip:** Press **Tab** after typing part of a folder or file name to auto-complete it. Press Tab twice to see all options.

---

## Working with Files and Folders

### Create a folder

```bash
mkdir myfolder
mkdir -p parent/child/grandchild   # Create nested folders at once
```

### Create an empty file

```bash
touch myfile.txt
```

### Copy a file

```bash
cp source.txt destination.txt
cp source.txt /path/to/destination/
```

Copy a folder and everything inside it:

```bash
cp -r myfolder /path/to/destination/
```

### Move or rename a file

```bash
mv oldname.txt newname.txt          # Rename
mv myfile.txt /path/to/destination/ # Move
```

### Delete a file

```bash
rm myfile.txt
```

Delete a folder and everything inside it:

```bash
rm -rf myfolder
```

> ⚠️ `rm -rf` deletes permanently — there is no Trash. Double-check before running this.

### View file contents

```bash
cat myfile.txt
```

For large files, scroll through page by page:

```bash
less myfile.txt
```

Press **Q** to quit less.

---

## Running Commands as Administrator

Some commands need admin rights. Add `sudo` before them:

```bash
sudo apt update
sudo rm /protected-file
```

You will be prompted for your **login password** (not an email password). Nothing appears as you type — that is normal. Press Enter when done.

---

## Reading Command Output

Commands print their output directly below. When a command finishes, the prompt appears again. If the prompt never comes back, the command is still running — wait for it, or press **Ctrl + C** to cancel it.

---

## Common Shortcuts

| Shortcut | What it does |
|---|---|
| **Tab** | Auto-complete a file or folder name |
| **Up arrow** | Go back through previous commands |
| **Ctrl + C** | Cancel the running command |
| **Ctrl + L** | Clear the screen |
| **Ctrl + A** | Move cursor to beginning of line |
| **Ctrl + E** | Move cursor to end of line |
| **Ctrl + R** | Search through command history |
| **q** | Quit most viewer programs (like `less`, `man`) |

---

## The Pipe `|` — Chain Commands Together

The pipe sends the output of one command as the input to the next:

```bash
ls -la | grep ".txt"      # List files, then filter for .txt only
cat file.txt | less        # View a file page by page
```

---

## Redirect Output to a File

Save command output to a file instead of printing to screen:

```bash
ls -la > filelist.txt     # Save to file (overwrites)
ls -la >> filelist.txt    # Append to file
```

Redirect errors separately:

```bash
command 2> errors.txt          # Save errors only
command > output.txt 2>&1      # Save both output and errors
```

---

## Editing Files in Terminal

**nano** is the easiest text editor — it works like a basic notepad:

```bash
nano myfile.txt
```

- Type to edit
- **Ctrl + O** then **Enter** to save
- **Ctrl + X** to exit

**vim** is also available but has a steeper learning curve. If you accidentally open vim:
- Press **Esc**
- Type `:q!` and press **Enter** to quit without saving
- Type `:wq` and press **Enter** to save and quit

---

## Finding Things

Find a file by name:

```bash
find / -name "myfile.txt"         # Search entire system
find ~ -name "myfile.txt"         # Search your home folder
find . -name "*.log"              # Find all .log files in current folder
```

Search inside a file for text:

```bash
grep "search term" myfile.txt
grep -r "search term" /path/      # Search recursively in all files
grep -i "search term" myfile.txt  # Case-insensitive search
```

---

## Get Help for Any Command

```bash
man ls          # Manual page for ls
man brew
man sudo
```

Press **Q** to exit the manual. Or use `--help`:

```bash
ls --help
brew --help
```

---

## Common Beginner Mistakes

**"Permission denied"** — add `sudo` before the command, or check that you own the file.

**"No such file or directory"** — the path is wrong. Check spelling, check you are in the right folder with `pwd`, and use Tab to auto-complete.

**"Command not found"** — the program is not installed, or it is not in your PATH. Try installing it with `brew install NAME` (macOS) or `sudo apt install NAME` (Ubuntu/Debian).

**Command seems frozen** — press **Ctrl + C** to cancel, or wait if it is a long-running process.

**Accidentally opened vim** — press **Esc**, then type `:q!` and press **Enter**.