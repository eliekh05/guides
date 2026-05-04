---
layout: default
title: "Re-enable Allow Apps from Anywhere in Gatekeeper (macOS)"
parent: "Security & Apps"
nav_order: 6
---

# Re-enable "Allow Apps from Anywhere" in Gatekeeper (macOS)

In macOS Sierra (10.12), Apple removed the **"Allow apps downloaded from: Anywhere"** option from System Preferences. It still exists and still works — it is just hidden. This is different from the "app is damaged" fix — this re-enables the option permanently in the Security settings GUI.

> **Only do this if you regularly install apps from trusted sources outside the App Store and do not want to use the right-click workaround every time.**

---

## Enable It via Terminal

```bash
sudo spctl --master-disable
```

Enter your password. That is it.

Now go to **System Settings** → **Privacy & Security** → scroll to the **Security** section. You will see a third option: **Anywhere** has returned.

---

## Re-disable It (Restore Default)

```bash
sudo spctl --master-enable
```

The Anywhere option disappears again from the UI.

---

## Check Current Status

```bash
spctl --status
```

- `assessments enabled` — Gatekeeper is on (default, Anywhere is hidden)
- `assessments disabled` — Gatekeeper is off (Anywhere option visible)

---

## Still Get Blocked After Enabling?

Some apps have a quarantine attribute that blocks them even with Gatekeeper off. Remove it:

```bash
xattr -r -d com.apple.quarantine /Applications/AppName.app
```

Or right-click the app → **Open** → **Open** in the dialog that appears.

---

> **Security note:** Disabling Gatekeeper means macOS will run any app without checking its signature. Only keep it disabled if you know what you are installing. Re-enable it after installing the apps you need.
