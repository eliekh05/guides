---
layout: default
title: "Manage Users and Groups on Linux"
parent: "System & Users"
nav_order: 20
---

# Manage Users and Groups on Linux

---

## Users

```bash
# Create a new user
sudo useradd username                     # minimal, no home dir
sudo useradd -m username                  # with home directory
sudo useradd -m -s /bin/bash username     # with home dir and bash shell
sudo adduser username                     # interactive, friendlier (Debian/Ubuntu)

# Set or change password
sudo passwd username

# Delete a user
sudo userdel username
sudo userdel -r username                  # also delete home directory

# Modify a user
sudo usermod -s /bin/zsh username         # change shell
sudo usermod -d /new/home username        # change home directory
sudo usermod -l newname oldname           # rename user

# Lock / unlock a user account
sudo usermod -L username                  # lock
sudo usermod -U username                  # unlock

# See info about a user
id username
finger username
cat /etc/passwd | grep username
```

---

## Groups

```bash
# Create a group
sudo groupadd groupname

# Delete a group
sudo groupdel groupname

# Add user to a group
sudo usermod -aG groupname username       # -a = append, never remove existing groups

# Remove user from a group
sudo gpasswd -d username groupname

# List groups a user belongs to
groups username
id username

# List all groups
cat /etc/group
getent group

# List members of a specific group
getent group sudo
getent group docker
```

---

## Important Groups

| Group | What it allows |
|---|---|
| `sudo` (Debian/Ubuntu) | Run commands with sudo |
| `wheel` (Fedora/RHEL/Arch) | Run commands with sudo |
| `docker` | Run Docker without sudo |
| `kvm` | Use KVM virtualisation |
| `lpadmin` | Manage printers |
| `www-data` | Web server access |

---

## Switch Users

```bash
su username                # switch to user (keeps environment)
su - username              # switch to user (loads their environment)
sudo -u username command   # run a single command as another user
sudo -i                    # open root shell
```

---

## /etc/passwd and /etc/shadow

User information is stored in:
- `/etc/passwd` — usernames, UIDs, home dirs, shells (readable by all)
- `/etc/shadow` — hashed passwords (root only)

Format of `/etc/passwd`:
```
username:x:UID:GID:comment:home_dir:shell
```

```bash
# View user entry
grep youruser /etc/passwd

# List all users
cut -d: -f1 /etc/passwd
```

---

## Batch Create Users (from a file)

```bash
# users.txt: one username per line
while IFS= read -r user; do
    sudo useradd -m -s /bin/bash "$user"
    echo "$user:$(openssl rand -base64 12)" | sudo chpasswd
    echo "Created: $user"
done < users.txt
```
