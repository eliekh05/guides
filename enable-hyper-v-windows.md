---
layout: default
title: "Enable Hyper-V on Windows 11"
parent: "Windows"
nav_order: 8
---

# Enable Hyper-V on Windows 11

Hyper-V is Windows' built-in hypervisor. It is required for Docker Desktop, WSL2, Android emulators, and Windows Sandbox. It is only available on Windows 11 Pro, Enterprise, and Education — not Home.

---

## Check Your Windows Edition

```cmd
winver
```

If it says **Home**, Hyper-V is not available. You can either upgrade to Pro or use WSL2 without enabling full Hyper-V.

---

## Method 1 — Windows Features (GUI)

1. Press **Windows + R** → type `optionalfeatures` → Enter.
2. Scroll to find **Hyper-V** and expand it.
3. Check:
   - ✅ Hyper-V Management Tools
   - ✅ Hyper-V Platform
4. Click **OK**.
5. Restart when prompted.

---

## Method 2 — PowerShell

Open **PowerShell as Administrator**:

```powershell
Enable-WindowsOptionalFeature -Online -FeatureName Microsoft-Hyper-V -All
```

Restart when prompted.

---

## Method 3 — DISM

```cmd
DISM /Online /Enable-Feature /All /FeatureName:Microsoft-Hyper-V
```

---

## Verify Hyper-V Is Enabled

```cmd
systeminfo | find "Hyper-V"
```

Should show:
```
Hyper-V Requirements: A hypervisor has been detected. Features required for Hyper-V will not be displayed.
```

---

## Hyper-V Conflicts With Other Hypervisors

Hyper-V runs at the hardware level and can interfere with VirtualBox and older VMware versions. When Hyper-V is on:

- **VirtualBox** — works in VirtualBox 6.1+ with Hyper-V backend, older versions run very slowly
- **VMware Workstation** — works fine in modern versions (17+)
- **Android Studio emulator** — works with HAXM or Hyper-V backend

If you need to disable Hyper-V temporarily for an incompatible app:

```cmd
bcdedit /set hypervisorlaunchtype off
```

Restart. Re-enable with:
```cmd
bcdedit /set hypervisorlaunchtype auto
```

---

## Enable Virtualisation in BIOS (If Hyper-V Fails to Enable)

Hyper-V requires hardware virtualisation (Intel VT-x or AMD-V) to be enabled in BIOS. If you see errors during installation, restart → enter BIOS → enable:
- **Intel VT-x** / **Intel Virtualization Technology**
- **AMD-V** / **SVM Mode**

Save and restart.
