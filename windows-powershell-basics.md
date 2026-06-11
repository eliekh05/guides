---
layout: default
title: "PowerShell Basics — Commands You Actually Use"
parent: "System & Users"
nav_order: 22
---

# PowerShell Basics — Commands You Actually Use

PowerShell is the modern command-line shell for Windows. More powerful than Command Prompt and available on macOS and Linux too.

---

## Open PowerShell

- Search **PowerShell** in Start menu
- Right-click Start → **Terminal** (Windows 11) or **Windows PowerShell**
- For admin: right-click → **Run as administrator**

---

## Navigation

```powershell
pwd                         # current directory (Print Working Directory)
ls                          # list files (alias for Get-ChildItem)
ls -Hidden                  # include hidden files
cd Documents                # change directory
cd ..                       # go up one level
cd ~                        # go to home directory
```

---

## Files and Folders

```powershell
# Create
New-Item file.txt -ItemType File
New-Item myfolder -ItemType Directory
mkdir myfolder              # shortcut

# Copy
Copy-Item file.txt copy.txt
Copy-Item folder -Recurse -Destination newfolder

# Move / Rename
Move-Item old.txt new.txt
Rename-Item old.txt new.txt

# Delete
Remove-Item file.txt
Remove-Item folder -Recurse    # delete folder and contents
Remove-Item *.log              # delete all .log files

# Read a file
Get-Content file.txt
cat file.txt                   # alias

# Write to a file
"Hello" | Out-File file.txt    # overwrite
"Hello" | Add-Content file.txt # append
```

---

## Search

```powershell
# Find files by name
Get-ChildItem -Recurse -Filter "*.txt"
Get-ChildItem C:\ -Recurse -Name "config.json" 2>$null

# Search inside files (like grep)
Select-String -Path "*.log" -Pattern "error"
Get-Content app.log | Select-String "error"

# Find processes
Get-Process notepad
Get-Process | Where-Object {$_.CPU -gt 50}
```

---

## System Info

```powershell
Get-ComputerInfo                    # detailed system info
systeminfo                          # traditional system info
Get-Process                         # running processes
Get-Service                         # services
Get-Service | Where-Object {$_.Status -eq "Running"}
Get-EventLog -LogName System -Newest 20    # event log
```

---

## Network

```powershell
ipconfig                            # IP addresses
ipconfig /all                       # detailed
ipconfig /flushdns                  # flush DNS cache
Test-NetConnection google.com       # ping + port test
Test-NetConnection google.com -Port 443   # test specific port
Resolve-DnsName google.com          # DNS lookup
netstat -an                         # active connections
```

---

## Useful One-Liners

```powershell
# Restart
Restart-Computer

# Shutdown
Stop-Computer

# Check Windows version
winver
[System.Environment]::OSVersion

# List installed software
Get-Package
winget list

# Kill a process
Stop-Process -Name notepad
Stop-Process -Id 1234

# Get clipboard contents
Get-Clipboard

# Set clipboard
"text to copy" | Set-Clipboard

# Run as another user
Start-Process powershell -Credential (Get-Credential)
```

---

## Pipelines

PowerShell pipes objects, not just text:

```powershell
# Get top 5 processes by CPU
Get-Process | Sort-Object CPU -Descending | Select-Object -First 5

# Export process list to CSV
Get-Process | Export-Csv processes.csv

# Get services that are stopped
Get-Service | Where-Object {$_.Status -eq "Stopped"}

# Count files in a folder
(Get-ChildItem -File).Count
```

---

## Execution Policy (Fix "Cannot be loaded" Error)

```powershell
# Check current policy
Get-ExecutionPolicy

# Allow scripts (run as Admin)
Set-ExecutionPolicy RemoteSigned -Scope CurrentUser
```
