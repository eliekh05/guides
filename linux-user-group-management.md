---
layout: default
title: "User and Group Management on Linux"
parent: "System & Users"
nav_order: 21
---

# User and Group Management on Linux

---

## Users

### Create a user

```bash
# Create user with home directory
sudo useradd -m username

# Create with specific shell
sudo useradd -m -s /bin/bash username

# Create with comment/full name
sudo useradd -m -c "John Smith" -s /bin/bash john

# Set password
sudo passwd username
```

### Delete a user

```bash
sudo userdel username           # delete user, keep home directory
sudo userdel -r username        # delete user AND home directory
```

### Modify a user

```bash
sudo usermod -s /bin/zsh username      # change shell
sudo usermod -c "New Name" username    # change comment
sudo usermod -l newname oldname        # rename user
sudo usermod -d /new/home username     # change home directory
sudo usermod -aG groupname username    # add to group (keep existing groups)
sudo usermod -L username               # lock account
sudo usermod -U username               # unlock account
```

### View user info

```bash
id username                    # UID, GID, and groups
whoami                         # current user
who                            # logged-in users
w                              # logged-in users with activity
last                           # login history
cat /etc/passwd | grep username  # user entry
```

---

## Groups

### Create a group

```bash
sudo groupadd groupname
sudo groupadd -g 1500 groupname    # with specific GID
```

### Delete a group

```bash
sudo groupdel groupname
```

### Add user to a group

```bash
sudo usermod -aG groupname username     # -a = append, -G = supplementary groups
sudo gpasswd -a username groupname      # alternative
```

> **Important:** The `-a` flag is critical. Without it, `-G` replaces ALL the user's groups with just the one specified.

### Remove user from a group

```bash
sudo gpasswd -d username groupname
```

### View group membership

```bash
groups username                # groups a user belongs to
getent group groupname         # members of a group
cat /etc/group | grep groupname
```

---

## Important System Files

| File | Contents |
|---|---|
| `/etc/passwd` | User accounts (no passwords) |
| `/etc/shadow` | Encrypted passwords |
| `/etc/group` | Group definitions |
| `/etc/gshadow` | Group passwords |

---

## Password Policy

```bash
# Set password expiry
sudo chage -M 90 username       # max 90 days before expiry
sudo chage -W 7 username        # warn 7 days before expiry
sudo chage -l username          # view current policy

# Force password change on next login
sudo chage -d 0 username
```

---

## Switch Users

```bash
su - username           # switch to user with their environment
su -                    # switch to root
sudo -u username cmd    # run single command as another user
sudo -i                 # open root shell
```

---

## /etc/passwd and /etc/group Format

**`/etc/passwd` fields:**
```
username:x:UID:GID:comment:home:shell
root:x:0:0:root:/root:/bin/bash
john:x:1001:1001:John Smith:/home/john:/bin/bash
```

**`/etc/group` fields:**
```
groupname:x:GID:member1,member2
sudo:x:27:john,alice
```

---

## System Users vs Regular Users

UIDs below 1000 are reserved for system users (services like `www-data`, `postgres`, `nobody`). Regular user accounts start at UID 1000.

```bash
# Create a system user (for a service, no login)
sudo useradd --system --no-create-home --shell /usr/sbin/nologin serviceuser
```
