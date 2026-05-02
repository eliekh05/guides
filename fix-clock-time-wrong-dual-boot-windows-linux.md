---
layout: default
title: "Fix Clock Showing Wrong Time When Dual Booting Windows and Linux"
parent: "macOS & Linux"
nav_order: 17
---

# Fix Clock Showing Wrong Time When Dual Booting Windows and Linux

When dual booting Windows and Linux, the clock shows the wrong time in one of them after switching between the two. This happens because Windows and Linux handle the hardware clock differently — Windows stores local time, Linux stores UTC. Every time you switch, one of them corrects the clock and throws the other off.

---

## The Fix — Make Linux Use Local Time (Matches Windows)

The easiest fix is to tell Linux to use local time like Windows does:

```bash
timedatectl set-local-rtc 1 --adjust-system-clock
```

Verify it worked:
```bash
timedatectl
```

Look for `RTC in local TZ: yes`.

---

## Alternative — Make Windows Use UTC (Matches Linux)

If you prefer Linux's approach, tell Windows to store UTC instead. Open **Command Prompt as Administrator** and run:

```cmd
reg add "HKEY_LOCAL_MACHINE\System\CurrentControlSet\Control\TimeZoneInformation" /v RealTimeIsUniversal /d 1 /t REG_DWORD /f
```

Restart Windows. The clock should now stay in sync with Linux.

---

## Also Sync Time After Switching

Even with the fix above, the clock may drift slightly. Force a time sync after booting:

**Linux:**
```bash
sudo timedatectl set-ntp true
sudo systemctl restart systemd-timesyncd
```

**Windows:**
Open Command Prompt as Administrator:
```cmd
w32tm /resync /force
```

---

> **Which fix to use?** The Linux `set-local-rtc 1` approach is simpler and requires no Windows registry edit. The Windows UTC approach is technically more correct but either works fine.