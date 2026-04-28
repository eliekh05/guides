# Fix Broken File Permissions After Copying Between Drives (macOS and Linux)

When you copy files between drives — especially from NTFS or exFAT to APFS or HFS+ — files can end up with wrong permissions, missing execute bits, or corrupted extended attributes. This makes files read-only, scripts non-executable, or apps that refuse to launch.

---

## Why This Happens

Different file systems handle permissions and metadata differently:

| File System | Permissions | Extended Attributes (xattr) |
|---|---|---|
| APFS / HFS+ (Mac) | ✅ Full Unix permissions | ✅ Supported |
| ext4 (Linux) | ✅ Full Unix permissions | ✅ Supported |
| exFAT | ❌ No Unix permissions | ❌ Not supported |
| NTFS (Windows) | Different permission model | Partially supported |
| FAT32 | ❌ No Unix permissions | ❌ Not supported |

When files from exFAT or FAT32 land on APFS, macOS assigns default permissions that may not match what the files need. Extended attributes (invisible metadata used by macOS for things like Gatekeeper quarantine flags, Finder tags, and resource forks) are also lost.

---

## Fix 1 — Restore Execute Permission on Scripts

If shell scripts or binaries no longer run after copying, they have lost their execute bit:

```bash
chmod +x /path/to/script.sh
```

To fix an entire folder of scripts recursively:
```bash
chmod -R +x /path/to/folder/
```

> **Use with care on folders containing mixed content.** This gives execute permission to every file, including data files that do not need it. For a more targeted approach, use Fix 2.

---

## Fix 2 — Restore Permissions to a Specific Pattern

To restore execute permission only on `.sh` files inside a folder:
```bash
find /path/to/folder -name "*.sh" -exec chmod +x {} \;
```

To fix only directories (so you can navigate into them):
```bash
find /path/to/folder -type d -exec chmod 755 {} \;
```

To fix only regular files (not directories):
```bash
find /path/to/folder -type f -exec chmod 644 {} \;
```

---

## Fix 3 — Restore Ownership

If files were copied as root or from another user account, they may be owned by the wrong user. Your account will not be able to edit them:

```bash
sudo chown -R $(whoami) /path/to/folder
```

This sets you as the owner of the folder and everything inside it.

---

## Fix 4 — Remove Quarantine Attributes Added During Copy

macOS sometimes applies quarantine attributes to files copied from external drives, even if they are not downloads. This can cause apps to be blocked:

```bash
xattr -r -d com.apple.quarantine /path/to/app.app
```

To check what extended attributes are on a file:
```bash
xattr -l /path/to/file
```

To remove all extended attributes from a file (use with caution):
```bash
xattr -c /path/to/file
```

---

## Fix 5 — Use `rsync` Instead of Finder for Copying

The Finder copy does not preserve Unix permissions when copying to or from exFAT or NTFS. Using `rsync` with the right flags preserves permissions, timestamps, and symbolic links:

```bash
rsync -av --progress /source/folder/ /destination/folder/
```

| Flag | What it does |
|---|---|
| `-a` | Archive mode: preserves permissions, timestamps, symlinks, and ownership |
| `-v` | Verbose: shows what is being copied |
| `--progress` | Shows progress for large files |

> **Note:** `rsync -a` can only preserve permissions if the destination file system supports them. Copying to exFAT or FAT32 will still lose permissions regardless of the tool used.

---

## Fix 6 — Run Disk Utility First Aid (macOS)

If permissions are broken system-wide (not just on copied files), the volume itself may have errors:

1. Open **Disk Utility** (Applications → Utilities → Disk Utility).
2. Select your drive from the left sidebar.
3. Click **First Aid** → **Run**.
4. Let it complete and check for errors.

---

## Quick Reference

| Problem | Command |
|---|---|
| Script won't run (no execute bit) | `chmod +x /path/to/script.sh` |
| Entire folder not executable | `chmod -R +x /path/to/folder/` |
| Files owned by wrong user | `sudo chown -R $(whoami) /path/to/folder` |
| App blocked by quarantine flag | `xattr -r -d com.apple.quarantine /path/to/app.app` |
| Check what attributes a file has | `xattr -l /path/to/file` |
| Copy with permissions preserved | `rsync -av /source/ /destination/` |

---

> **Note:** If you regularly transfer files between Windows (NTFS) and Mac (APFS), consider using a tool like **Paragon NTFS** or **Tuxera NTFS** which provides better interoperability than macOS's built-in read-only NTFS support.
