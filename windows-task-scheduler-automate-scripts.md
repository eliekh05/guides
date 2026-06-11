---
layout: default
title: "Automate Scripts with Windows Task Scheduler"
parent: "Task Scheduling"
nav_order: 4
---

# Automate Scripts with Windows Task Scheduler

Windows Task Scheduler is the built-in tool for running scripts, programs, and commands automatically on a schedule or triggered by events. It is the Windows equivalent of cron on Linux or launchd on macOS — and like both of those, it has plenty of ways to silently fail without telling you why. This guide covers how to set it up correctly and how to debug when it does not run.

---

## Open Task Scheduler

Press **Windows + R**, type `taskschd.msc`, and press Enter.

Or search for **Task Scheduler** in the Start menu.

---

## Create a Basic Scheduled Task (GUI)

### Step 1 — Create a New Task

In the right panel, click **Create Basic Task** for a simple wizard, or **Create Task** for full control. Use **Create Task** — the Basic Task wizard hides important options.

### Step 2 — General Tab

- **Name:** give it a clear name like `Daily Backup Script`
- **Description:** optional but useful
- **Run whether user is logged on or not:** check this if the task needs to run in the background
- **Run with highest privileges:** check this if your script needs admin rights
- **Configure for:** set to your Windows version

### Step 3 — Triggers Tab

Click **New** to add when the task runs:

| Trigger | When it fires |
|---|---|
| On a schedule | Daily, weekly, monthly, or one time |
| At log on | When any or a specific user logs in |
| At startup | When Windows starts (before login) |
| On an event | When a specific Windows event log entry appears |
| On idle | When the PC has been idle for a set time |

For a daily schedule: choose **Daily**, set the start time, and set **Recur every 1 days**.

### Step 4 — Actions Tab

Click **New**:

- **Action:** Start a program
- **Program/script:** the full path to your script or executable

**For a PowerShell script:**
- Program: `powershell.exe`
- Arguments: `-ExecutionPolicy Bypass -File "C:\Scripts\myscript.ps1"`

**For a batch file (.bat):**
- Program: `C:\Scripts\myscript.bat`

**For a Python script:**
- Program: `C:\Python312\python.exe`
- Arguments: `"C:\Scripts\myscript.py"`

> **Always use full paths.** Task Scheduler does not inherit your user PATH — `python` alone will fail. Use `C:\Python312\python.exe`.

### Step 5 — Conditions Tab

- Uncheck **Start the task only if the computer is on AC power** if you want it to run on battery too
- Uncheck **Stop if the computer switches to battery power**
- If the task needs internet, check **Start only if the following network connection is available**

### Step 6 — Settings Tab

- **Allow task to be run on demand:** check this (lets you test manually)
- **If the task fails, restart every:** useful for tasks that might fail occasionally
- **Stop the task if it runs longer than:** set a timeout to prevent runaway tasks
- **If the task is already running:** choose **Do not start a new instance** for most scripts

Click **OK** and enter your Windows password to save.

---

## Create a Task via PowerShell (Faster for Repeat Setup)

```powershell
$action = New-ScheduledTaskAction -Execute "powershell.exe" `
  -Argument '-ExecutionPolicy Bypass -File "C:\Scripts\myscript.ps1"'

$trigger = New-ScheduledTaskTrigger -Daily -At "9:00AM"

$settings = New-ScheduledTaskSettingsSet `
  -RunOnlyIfNetworkAvailable $false `
  -WakeToRun $false `
  -ExecutionTimeLimit (New-TimeSpan -Hours 1)

Register-ScheduledTask -TaskName "Daily Backup" `
  -Action $action `
  -Trigger $trigger `
  -Settings $settings `
  -RunLevel Highest `
  -Force
```

---

## Why Tasks Silently Fail (And How to Fix Each)

### Task runs but script does nothing

Task Scheduler runs from `C:\Windows\System32` as the working directory, not your script's folder. Your script may be trying to open files with relative paths that do not exist from that location.

Fix — set the working directory in the action:
- In **Actions** → **Edit**, set **Start in (optional)** to the folder your script lives in (e.g. `C:\Scripts`)

### "The task has been disabled"

Right-click the task → **Enable**.

### Task shows Last Run Result: `0x1`

Exit code 1 — the script ran but returned an error. Run the script manually from PowerShell to see the actual error output.

### Last Run Result: `0x41301` — Task is currently running

The previous run did not finish. Either the task is stuck or the timeout is too short.

### Last Run Result: `0x8007010B` — Directory name is invalid

Your script path or working directory path does not exist. Check all paths are correct and use full absolute paths.

### Task runs when logged in but not when logged out

Go to task properties → **General** tab → select **Run whether user is logged on or not** → enter your password. Without this, tasks only run when your user account is active.

### PowerShell script does not run

By default, PowerShell's execution policy blocks scripts. Fix:
- In the action, use: `-ExecutionPolicy Bypass -File "C:\Scripts\script.ps1"`
- Never just set `Program: script.ps1` — always call `powershell.exe` with the file as an argument

### Task runs but produces no output / cannot see errors

Add logging to your script:

**PowerShell:**
```powershell
Start-Transcript -Path "C:\Logs\myscript-log.txt" -Append
# your script here
Stop-Transcript
```

**Batch file:**
```batch
@echo off
call myscript.bat >> C:\Logs\myscript-log.txt 2>&1
```

Then check the log file after the task runs.

---

## View Task History

1. In Task Scheduler, click on your task.
2. Click the **History** tab at the bottom.
3. Each run is listed with its result code and duration.

If History is empty, enable it: in the left panel, click **Task Scheduler Library** → in the right panel click **Enable All Tasks History**.

---

## Export and Import Tasks

**Export a task** (save as XML for backup or to move to another machine):

Right-click the task → **Export**.

**Import a task:**

In the right panel → **Import Task** → select the XML file.

**Export via PowerShell:**
```powershell
Export-ScheduledTask -TaskName "Daily Backup" | Out-File "C:\Backup\DailyBackup.xml"
```

**Import via PowerShell:**
```powershell
Register-ScheduledTask -Xml (Get-Content "C:\Backup\DailyBackup.xml" | Out-String) -TaskName "Daily Backup" -Force
```
