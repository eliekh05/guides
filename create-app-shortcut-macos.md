---
layout: default
title: "Create a .app Shortcut on macOS"
parent: "macOS"
nav_order: 25
---

# Create a .app Shortcut on macOS

Sometimes you want a clickable `.app` file that runs a script, opens a specific URL, launches another app with certain settings, or chains multiple actions together. macOS has two built-in ways to do this — Script Editor for simple AppleScript apps, and Automator for more complex workflows.

---

## Method 1 — Script Editor (Simplest)

Script Editor lets you write a few lines of AppleScript and save the result as a double-clickable `.app` file.

1. Open **Script Editor** (Applications → Utilities → Script Editor, or search with Spotlight).
2. Write your script. Examples:

**Open a specific website in the default browser:**
```applescript
open location "https://example.com"
```

**Open a folder in Finder:**
```applescript
tell application "Finder"
    open POSIX file "/Users/yourname/Documents/MyProject"
    activate
end tell
```

**Run a shell command:**
```applescript
do shell script "your-command-here"
```

**Run a shell command with admin rights:**
```applescript
do shell script "your-command-here" with administrator privileges
```

**Launch an app and open a file:**
```applescript
tell application "Visual Studio Code"
    open "/Users/yourname/Projects/myproject"
    activate
end tell
```

3. Press **Command + R** to test the script.
4. Go to **File** → **Export**.
5. Set **File Format** to **Application**.
6. Choose where to save it and click **Save**.

The result is a `.app` file you can double-click, put in your Dock, or add to Login Items.

---

## Method 2 — Automator (More Powerful)

Automator is better for workflows involving multiple steps, file operations, or things that do not fit into a few lines of AppleScript.

1. Open **Automator** (Applications → Automator).
2. Click **New Document** → select **Application** → click **Choose**.
3. In the left panel search bar, search for the action you want. Drag it into the workflow area on the right.

**Common useful actions:**

| Action | What it does |
|---|---|
| **Launch Application** | Opens a specific app |
| **Run Shell Script** | Runs any Terminal command |
| **Run AppleScript** | Runs AppleScript code |
| **Open URLs** | Opens one or more URLs |
| **Get Specified Finder Items** | Selects specific files to pass to the next action |
| **Move Finder Items** | Moves selected files to a folder |

4. Chain actions by dragging multiple ones into the workflow — output from one feeds into the next.
5. Click **Run** (play button) to test.
6. **File** → **Save** → the file saves as a `.app` automatically.

---

## Method 3 — Shell Script as .app via Automator

The easiest way to turn a shell script into a clickable app:

1. Open **Automator** → **New Document** → **Application**.
2. Search for **Run Shell Script** in the action library and drag it in.
3. Paste your shell script into the text area.
4. Set **Shell** to `/bin/zsh` (default on modern macOS).
5. **File** → **Save** → save as a `.app`.

Example — a one-click Homebrew update app:

```bash
/opt/homebrew/bin/brew update && /opt/homebrew/bin/brew upgrade && /opt/homebrew/bin/brew cleanup
```

> Always use full paths in Automator shell scripts — `/opt/homebrew/bin/brew` not just `brew` — because Automator does not load your shell PATH.

---

## Add to Dock

Drag any `.app` file to your Dock. It will stay there permanently.

---

## Change the App Icon

To give your custom app a custom icon:

1. Find an image you want to use (`.png` or `.icns`).
2. Open the image in **Preview** → **Edit** → **Select All** → **Copy** (Command + C).
3. Right-click your `.app` file → **Get Info**.
4. Click the small icon in the top-left of the Get Info window (it gets highlighted).
5. Press **Command + V** to paste the new icon.

---

## Add to Login Items (Auto-Launch at Startup)

1. **System Settings** → **General** → **Login Items & Extensions**.
2. Under **Open at Login**, click **+** and select your `.app` file.

---

## Troubleshooting

### App opens then immediately closes

The script ran and finished — this is normal if the script has no UI. If you want it to stay open, add a dialog at the end:

```applescript
display dialog "Done!" buttons {"OK"} default button "OK"
```

### "App is damaged and can't be opened"

Your app was saved to a location that got quarantined. Run in Terminal:
```bash
xattr -r -d com.apple.quarantine /path/to/YourApp.app
```

### Shell commands not found in Automator

Use full paths: `/opt/homebrew/bin/brew`, `/usr/bin/python3`, `/usr/local/bin/node` etc.
