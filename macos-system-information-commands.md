---
layout: default
title: "macOS System Information Commands"
parent: "macOS"
nav_order: 46
---

# macOS System Information Commands

---

## System and Hardware

```bash
# macOS version
sw_vers
sw_vers -productVersion          # just the version number (e.g. 15.4.1)

# Detailed system info
system_profiler SPSoftwareDataType     # software info
system_profiler SPHardwareDataType     # hardware info
system_profiler SPMemoryDataType       # RAM info
system_profiler SPStorageDataType      # storage info
system_profiler SPDisplaysDataType     # display/GPU info
system_profiler SPNetworkDataType      # network interfaces

# CPU info
sysctl -n machdep.cpu.brand_string    # CPU model
sysctl -n hw.physicalcpu              # physical cores
sysctl -n hw.logicalcpu               # logical cores

# RAM
sysctl -n hw.memsize                  # total RAM in bytes
# Divide by 1073741824 for GB
```

---

## Disk

```bash
df -h                                  # disk usage all volumes
diskutil list                          # all disks and partitions
diskutil info /                        # info on root volume
diskutil info disk0                    # info on physical disk

# Check SMART status
diskutil info disk0 | grep SMART
```

---

## Memory and Processes

```bash
top                                    # live process view
top -o mem                             # sort by memory
ps aux                                 # all processes
ps aux | grep AppName                  # find a specific process
vm_stat                                # virtual memory stats
```

---

## Battery (MacBook)

```bash
pmset -g batt                          # battery status
system_profiler SPPowerDataType        # detailed battery info
```

---

## Network

```bash
ifconfig                               # all network interfaces
ifconfig en0                           # ethernet interface
ifconfig en1                           # wifi interface (varies)
networksetup -listallhardwareports     # list all network ports
arp -a                                 # devices on local network
netstat -rn                            # routing table
```

---

## Running Services and Daemons

```bash
launchctl list                         # all loaded launch agents/daemons
launchctl list | grep com.apple        # Apple services only
launchctl list | grep -v "^-"         # only currently running
```

---

## Serial Number and Hardware IDs

```bash
# Serial number
system_profiler SPHardwareDataType | grep "Serial Number"
ioreg -l | grep IOPlatformSerialNumber

# Hardware UUID
system_profiler SPHardwareDataType | grep "Hardware UUID"

# Model identifier (e.g. MacBookPro18,1)
system_profiler SPHardwareDataType | grep "Model Identifier"
```

---

## Uptime and Login Info

```bash
uptime                                 # uptime and load average
who                                    # logged-in users
last                                   # login history
```
