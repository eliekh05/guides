---
layout: default
title: "Automate Tasks with Automator on macOS"
parent: "macOS"
nav_order: 36
---

# Automate Tasks with Automator on macOS

Automator creates workflows that automate repetitive tasks without programming. You build workflows by dragging and connecting pre-built actions.

---

## Open Automator

Spotlight (Cmd+Space) → type Automator

---

## Document Types

| Type | Use case |
|---|---|
| **Workflow** | Run from Automator only |
| **Application** | Double-click to run, can be in Dock |
| **Quick Action** | Appears in right-click menu and Touch Bar |
| **Print Plugin** | Appears in the Print dialog |
| **Folder Action** | Runs when files are added to a folder |
| **Calendar Alarm** | Runs on a calendar event |
| **Image Capture Plugin** | Runs when a camera/scanner is connected |
| **Dictation Command** | Triggered by voice |

---

## Useful Quick Actions (Right-Click Menu)

**Rename files in bulk:**

1. New Document → **Quick Action**
2. Set "Workflow receives" to **files or folders** in Finder
3. Search for **Rename Finder Items** and drag it in
4. Choose your renaming pattern (add text, replace text, number sequentially, etc.)
5. File → Save → name it "Rename Files"

Now right-click any files in Finder → Quick Actions → Rename Files.

**Convert images to JPEG:**

1. New → Quick Action → receives files in Finder
2. Add **Change Type of Images** → JPEG
3. Save as "Convert to JPEG"

---

## Folder Action — Auto-Process Files

A folder action runs automatically when files are added to a folder.

**Example — auto-convert images dropped into a folder:**

1. New → **Folder Action**
2. At top: "Folder action receives files and folders added to" → select your folder
3. Add **Change Type of Images** → JPEG
4. Add **Move Finder Items** → select a destination folder
5. Save

Drop any image into the watched folder and it automatically converts and moves to the destination.

---

## Run Shell Scripts

Add a **Run Shell Script** action to any workflow:

```bash
#!/bin/bash
for f in "$@"; do
    echo "Processing: $f"
    # your commands here
done
```

Set **Pass input** to "as arguments".

---

## Combine with Calendar

1. New → **Calendar Alarm**
2. Add actions (send email, run script, open files, etc.)
3. Save — Automator creates a new Calendar event
4. Set the event time in Calendar

---

## Troubleshooting

**Quick Action does not appear in Finder:**
System Settings → Privacy & Security → Extensions → Finder Extensions → enable your workflow

**Workflow fails silently:**
Add a **Show Notification** or **Display Alert** action to see where it stops.
