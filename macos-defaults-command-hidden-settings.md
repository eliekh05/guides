---
layout: default
title: "macOS defaults Command — Hidden Settings"
parent: "macOS"
nav_order: 45
---

# macOS defaults Command — Hidden Settings

The `defaults` command reads and writes macOS preferences — including settings that are not exposed in System Settings. Many useful behaviors are hidden here.

---

## Basic Syntax

```bash
defaults read com.apple.dock                  # read all Dock settings
defaults read com.apple.dock autohide         # read one setting
defaults write com.apple.dock autohide -bool true   # write a setting
defaults delete com.apple.dock autohide       # delete/reset a setting
```

After changing most settings, you need to restart the relevant process:
```bash
killall Dock
killall Finder
killall SystemUIServer
```

---

## Finder

```bash
# Show hidden files
defaults write com.apple.Finder AppleShowAllFiles true
killall Finder

# Show file extensions always
defaults write NSGlobalDomain AppleShowAllExtensions true
killall Finder

# Show path bar at bottom of Finder windows
defaults write com.apple.finder ShowPathbar -bool true
killall Finder

# Show status bar
defaults write com.apple.finder ShowStatusBar -bool true
killall Finder

# Search current folder by default (instead of whole Mac)
defaults write com.apple.finder FXDefaultSearchScope -string "SCcf"
killall Finder

# Disable .DS_Store on network drives
defaults write com.apple.desktopservices DSDontWriteNetworkStores true

# Show ~/Library in Finder
chflags nohidden ~/Library
```

---

## Dock

```bash
# Auto-hide the Dock
defaults write com.apple.dock autohide -bool true
killall Dock

# Remove auto-hide delay
defaults write com.apple.dock autohide-delay -float 0
killall Dock

# Faster auto-hide animation
defaults write com.apple.dock autohide-time-modifier -float 0.5
killall Dock

# Show only open apps in the Dock
defaults write com.apple.dock static-only -bool true
killall Dock

# Minimise windows into their app icon
defaults write com.apple.dock minimize-to-application -bool true
killall Dock

# Reset Dock to defaults
defaults delete com.apple.dock
killall Dock
```

---

## Screenshots

```bash
# Change screenshot save location
defaults write com.apple.screencapture location ~/Pictures/Screenshots

# Remove shadow from window screenshots
defaults write com.apple.screencapture disable-shadow -bool true

# Change screenshot format (png, jpg, pdf, gif, tiff)
defaults write com.apple.screencapture type jpg

killall SystemUIServer
```

---

## Keyboard and Input

```bash
# Disable press-and-hold accent menu (enables key repeat)
defaults write NSGlobalDomain ApplePressAndHoldEnabled -bool false

# Set fast key repeat rate
defaults write NSGlobalDomain KeyRepeat -int 2
defaults write NSGlobalDomain InitialKeyRepeat -int 15

# Disable autocorrect
defaults write NSGlobalDomain NSAutomaticSpellingCorrectionEnabled -bool false

# Disable smart quotes
defaults write NSGlobalDomain NSAutomaticQuoteSubstitutionEnabled -bool false
```

---

## Scrolling and Trackpad

```bash
# Natural scrolling off (scroll like Windows/Linux)
defaults write NSGlobalDomain com.apple.swipescrolldirection -bool false

# Tap to click on trackpad
defaults write com.apple.driver.AppleBluetoothMultitouch.trackpad Clicking -bool true
```

---

## Safari

```bash
# Show full URL in address bar
defaults write com.apple.Safari ShowFullURLInSmartSearchField -bool true

# Enable Developer menu
defaults write com.apple.Safari IncludeDevelopMenu -bool true

# Disable auto-open of downloaded files
defaults write com.apple.Safari AutoOpenSafeDownloads -bool false
```

---

## Read All Defaults for an App

To explore what settings an app has:

```bash
defaults read com.apple.Finder
defaults read com.apple.dock
defaults read com.apple.terminal
defaults read com.apple.Safari
defaults read NSGlobalDomain          # system-wide settings
```

---

## Revert Any Setting

```bash
defaults delete com.apple.Finder AppleShowAllFiles
killall Finder
```

Deleting a key reverts it to its default value.
