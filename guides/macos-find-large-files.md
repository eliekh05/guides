---
layout: default
title: "Find and Delete Large Files on macOS"
parent: "macOS"
nav_order: 40
---

# Find and Delete Large Files on macOS

When your Mac is running out of storage, here is how to find and clean up what is taking space.

---

## See What Is Using Space

**Built-in:**
Apple menu → About This Mac → More Info → Storage (or System Settings → General → Storage)

Shows categories: Movies, Apps, Documents, iCloud Drive, etc. Click each for details.

---

## Find Large Files with Terminal

```bash
# Files over 1GB anywhere accessible
find ~ -size +1G -type f 2>/dev/null | sort

# Files over 500MB in Downloads
find ~/Downloads -size +500M -type f

# Sort by size
du -sh ~/* 2>/dev/null | sort -rh | head -20

# Find largest files anywhere (needs sudo for system areas)
sudo find / -size +1G -type f 2>/dev/null | xargs du -sh | sort -rh | head -20
```

---

## Common Space Wasters

**Xcode derived data:**
```bash
rm -rf ~/Library/Developer/Xcode/DerivedData
```

**iOS device backups:**
```bash
ls ~/Library/Application\ Support/MobileSync/Backup/
# Delete old backups from here or via iTunes/Finder → Manage Backups
```

**Simulator data:**
```bash
# List all simulators
xcrun simctl list devices
# Delete unavailable simulators
xcrun simctl delete unavailable
```

**Docker images:**
```bash
docker system prune -a --volumes    # remove all unused Docker data
docker system df                    # see how much Docker uses
```

**Homebrew cache:**
```bash
brew cleanup -s         # remove all cached downloads
du -sh $(brew --cache)  # see cache size
```

**Old Time Machine local snapshots:**
```bash
tmutil listlocalsnapshots /
tmutil deletelocalsnapshots SNAPSHOT_DATE
```

**Log files:**
```bash
sudo rm -rf /private/var/log/asl/*.asl
```

---

## GUI Tools

**DaisyDisk** — visual disk usage map, paid (~$10)
**OmniDiskSweeper** — free, shows folder sizes
**CleanMyMac** — comprehensive cleaner, paid (~$40/year) — check what it removes before confirming

---

## iCloud Optimise Storage

If you use iCloud Drive, enable "Optimise Mac Storage":
**System Settings → Apple ID → iCloud → iCloud Drive → Optimise Mac Storage**

macOS removes local copies of files that have not been accessed recently. They stay in iCloud and download on demand.

---

## Empty Bin and iCloud Bin

```bash
# Trash is at
ls ~/.Trash

# Empty from terminal
rm -rf ~/.Trash/*
```

Also check: iCloud.com → iCloud Drive → Recently Deleted — files deleted from iCloud stay there for 30 days.
