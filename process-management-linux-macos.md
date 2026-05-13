---
layout: default
title: "Process Management on macOS and Linux"
parent: "macOS & Linux"
nav_order: 34
---

# Process Management on macOS and Linux

---

## See What's Running

```bash
ps aux                           # all running processes
ps aux | grep nginx              # find a specific process
top                              # interactive live view
htop                             # better interactive view (install separately)
```

**Install htop:**
```bash
sudo apt install htop   # Ubuntu/Debian
sudo dnf install htop   # Fedora
brew install htop       # macOS
```

---

## Find a Process by Name or Port

```bash
pgrep nginx                      # get PID of nginx
pgrep -l nginx                   # PID and name
pidof nginx                      # Linux only

# Find what's using a port
sudo lsof -i :8080               # macOS and Linux
sudo ss -tlnp | grep 8080        # Linux
sudo netstat -tlnp | grep 8080   # older Linux
```

---

## Kill a Process

```bash
kill PID                         # graceful stop (SIGTERM)
kill -9 PID                      # force kill (SIGKILL)
killall nginx                    # kill all processes named nginx
pkill nginx                      # same as killall
pkill -9 nginx                   # force kill by name

# Kill what's using a port
sudo kill $(sudo lsof -t -i:8080)
```

---

## Background and Foreground Jobs

```bash
long-running-command &           # run in background
jobs                             # list background jobs
fg                               # bring last background job to foreground
fg %1                            # bring job #1 to foreground
bg                               # resume stopped job in background
Ctrl+Z                           # suspend current foreground job
Ctrl+C                           # kill current foreground job
```

---

## nohup — Keep Running After Logout

```bash
nohup ./script.sh &              # keeps running when you close the terminal
nohup ./script.sh > output.log 2>&1 &   # also logs output
```

---

## Nice — Set Process Priority

Priority ranges from -20 (highest priority) to 19 (lowest priority). Default is 0.

```bash
nice -n 10 ./heavy-script.sh     # run with low priority (nice = 10)
sudo nice -n -5 ./important.sh   # run with higher priority (needs sudo)

renice 10 -p PID                 # change priority of running process
sudo renice -5 -p PID            # increase priority of running process
```

Lower nice value = higher priority. `sudo` required for negative nice values.

---

## Monitor a Command

```bash
watch -n 2 "df -h"              # run "df -h" every 2 seconds
watch -n 1 "docker ps"          # watch Docker containers every second
```

---

## top / htop Quick Reference

**In top:**
- `q` — quit
- `k` — kill a process (enter PID)
- `M` — sort by memory
- `P` — sort by CPU
- `1` — show individual CPU cores

**In htop:**
- `F9` — kill process
- `F6` — sort by column
- `F4` — filter by name
- `q` — quit
- Arrow keys to navigate
