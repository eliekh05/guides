---
layout: default
title: "Debug with strace and ltrace on Linux"
parent: "Linux"
nav_order: 38
---

# Debug with strace and ltrace on Linux

`strace` traces system calls. `ltrace` traces library calls. Both are invaluable for debugging programs that fail silently or behave unexpectedly.

---

## strace — System Calls

```bash
sudo apt install strace -y

# Trace a command
strace ls /tmp

# Trace only specific system calls
strace -e trace=open,read,write ls /tmp

# Trace file operations only
strace -e trace=file ls /tmp

# Trace network calls
strace -e trace=network curl google.com

# Attach to a running process
strace -p PID

# Save output to file
strace -o trace.log ls /tmp

# Show timing
strace -T ls /tmp          # time per call
strace -tt ls /tmp         # absolute timestamps
```

---

## Understand strace Output

```
openat(AT_FDCWD, "/etc/passwd", O_RDONLY) = 3
```

This means: `openat` was called with path `/etc/passwd`, opened as read-only, returned file descriptor 3.

```
read(3, "root:x:0:0:root:/root:/bin/bash\n", 4096) = 32
```

Read 32 bytes from file descriptor 3.

A return value of `-1` with `ENOENT` means "file not found". `EACCES` means "permission denied".

---

## Common Debugging Uses

```bash
# Why is this program failing to find a file?
strace -e trace=file ./myprogram 2>&1 | grep "ENOENT\|No such"

# What network connections is this making?
strace -e trace=connect,socket -p PID

# What config files is it reading?
strace -e trace=openat ./myprogram 2>&1 | grep -v "ENOENT"

# Count system calls (performance analysis)
strace -c ./myprogram
```

---

## ltrace — Library Calls

```bash
sudo apt install ltrace -y

# Trace library calls
ltrace ls /tmp

# Trace only malloc/free
ltrace -e malloc,free ./myprogram

# Attach to running process
ltrace -p PID
```

---

## lsof — What Files Does a Process Have Open

```bash
lsof -p PID              # all files open by process
lsof -i :8080            # what's listening on port 8080
lsof /path/to/file       # who has this file open
lsof -u username         # all files opened by a user
```
