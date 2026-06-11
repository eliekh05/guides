---
layout: default
title: "Linux Namespaces — How Containers Work"
parent: "Linux"
nav_order: 37
---

# Linux Namespaces — How Containers Work

Docker, Podman, and all container runtimes are built on Linux namespaces and cgroups. Understanding namespaces explains why containers behave the way they do.

---

## What a Namespace Does

A namespace makes a process think it has its own isolated view of a system resource — its own process list, network interfaces, hostname, or filesystem. Processes in different namespaces cannot see each other's resources.

---

## The Seven Namespace Types

| Namespace | What it isolates |
|---|---|
| `pid` | Process IDs — container has its own PID 1 |
| `net` | Network interfaces, routing tables, ports |
| `mnt` | Filesystem mount points |
| `uts` | Hostname and domain name |
| `ipc` | Inter-process communication (shared memory, semaphores) |
| `user` | User and group IDs (rootless containers) |
| `cgroup` | cgroup hierarchy view |

---

## Create a Namespace (unshare)

```bash
# New UTS namespace — your own hostname
sudo unshare --uts bash
hostname container-test     # only affects this shell
hostname                    # shows: container-test
exit
hostname                    # original hostname unchanged

# New network namespace — no network access
sudo unshare --net bash
ip a                        # only shows loopback
exit

# Full container-like isolation
sudo unshare --pid --mount --uts --ipc --net --fork bash
```

---

## View Namespaces of a Process

```bash
ls -la /proc/$$/ns      # your current shell's namespaces
lsns                    # all namespaces on the system
lsns -t net             # only network namespaces
```

---

## How Docker Uses Namespaces

When you run `docker run ubuntu`, Docker:
1. Creates new `pid`, `net`, `mnt`, `uts`, `ipc` namespaces
2. Sets up a virtual network interface in the `net` namespace
3. Mounts the container image as the root filesystem (`mnt`)
4. Starts your process as PID 1 in the `pid` namespace
5. Uses cgroups to limit CPU and memory

The container's PID 1 maps to a regular process on the host — you can see it with `ps aux`.

---

## Enter a Running Container's Namespace

```bash
# Docker exec does this automatically
docker exec -it mycontainer bash

# Manual equivalent using nsenter
PID=$(docker inspect --format '{{.State.Pid}}' mycontainer)
sudo nsenter -t $PID --mount --uts --ipc --net --pid bash
```

---

## Network Namespaces in Practice

```bash
# Create a named network namespace
sudo ip netns add myns

# Run a command inside it
sudo ip netns exec myns ip a

# Add a virtual ethernet pair (veth) to connect it
sudo ip link add veth0 type veth peer name veth1
sudo ip link set veth1 netns myns

# Configure inside the namespace
sudo ip netns exec myns ip addr add 10.0.0.1/24 dev veth1
sudo ip netns exec myns ip link set veth1 up

# Clean up
sudo ip netns del myns
```
