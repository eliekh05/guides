---
layout: default
title: "Star Wars in Your Terminal — May the 4th Be With You"
parent: "macOS & Linux"
nav_order: 21
---

# Star Wars in Your Terminal 🌌 — May the 4th Be With You

Happy Star Wars Day. Here are a few ways to celebrate in the Terminal.

---

## Watch Star Wars Episode IV in ASCII Art

The original `telnet towel.blinkenlights.nl` server is no longer active. Use these working alternatives instead:

### Option A — via netcat (works on macOS and Linux, no install needed)

```bash
nc towel.blinkenlights.nl 23
```

`nc` (netcat) is built into macOS and most Linux distros. No install needed.

### Option B — via telehack.com (browser or telnet)

Go to [telehack.com](https://telehack.com) in your browser, then type:

```
starwars
```

Or via Terminal:

```bash
telnet telehack.com
# then type: starwars
```

Press **Ctrl + C** or close the terminal to exit.

---

## Play the Imperial March in Terminal (macOS)

```bash
# The Imperial March via the `say` command and pitch control
say -v Cellos "Dun dun dun dun da dun dun da dun"
```

Or use `afplay` with a downloaded audio file:
```bash
# If you have a Star Wars sound file
afplay /path/to/imperial-march.mp3
```

---

## Print a Lightsaber in Terminal

**Red (Sith):**
```bash
echo -e "\033[31m|===========>\033[0m"
```

**Green (Jedi):**
```bash
echo -e "\033[32m|===========>\033[0m"
```

**Blue (Jedi):**
```bash
echo -e "\033[34m<===========|\033[0m"
```

**Purple (Mace Windu):**
```bash
echo -e "\033[35m|===========>\033[0m"
```

---

## Add a Star Wars Greeting to Your Terminal

Add this to `~/.zshrc` or `~/.bashrc` so it appears every time you open a terminal today:

```bash
echo -e "\033[33m
     ___           ___                 ___         ___           ___     
    /  /\         /  /\               /  /\       /  /\         /  /\    
   /  /::|       /  /::\             /  /:/_      \  \:\       /  /::|   
  /  /:/:|      /  /:/\:\           /  /:/ /\      \  \:\     /  /:/:|   
 /  /:/|:|__   /  /:/~/::\         /  /:/ /::\     /  /::\   /  /:/|:|__ 
/__/:/ |:| /\ /__/:/ /:/\:\ _____ /__/:/ /:/\:\   /  /:/\:\ /__/:/ |:| /\\
\__\/  |:|/:/ \  \:\/:/__\/ \____\\  \:\/:/~/:/ /  /:/__\/ \__\/  |:|/:/
     __|:|/:/   \  \::/            \  \::/ /:/  /__/:/            |:|:/  
    /__/:/        \  \:\            \__\/ /:/   \__\/             |:|/   
    \__\/          \  \:\             /__/:/                      |:/    
                    \__\/             \__\/                       |/     
\033[0m"
echo -e "\033[36mMay the 4th be with you.\033[0m"
echo -e "\033[33mMay the Force be with you.\033[0m"
```

Apply it:
```bash
source ~/.zshrc
```

---

## Set a Star Wars Prompt for Today

Temporarily change your Terminal prompt to something more fitting:

```bash
# Add to ~/.zshrc temporarily
PROMPT='⚔️  %F{yellow}Jedi%f %~ %# '
```

Apply:
```bash
source ~/.zshrc
```

Change it back tomorrow by removing that line and running `source ~/.zshrc` again.

---

## Star Wars Quotes via fortune (Linux)

```bash
# Install fortune
sudo apt install fortune fortunes -y

# Get a random Star Wars-style wisdom quote
fortune
```

Or add your own Star Wars quotes. Create a file `~/.starwars-quotes`:

```
May the Force be with you.
%
Do. Or do not. There is no try.
%
I find your lack of faith disturbing.
%
In my experience, there is no such thing as luck.
%
Never tell me the odds.
%
The Force will be with you. Always.
%
```

Then:
```bash
sudo apt install fortune -y
strfile ~/.starwars-quotes ~/.starwars-quotes.dat
fortune ~/.starwars-quotes
```

---

> *"In a galaxy far, far away... someone was also trying to fix their Proxmox WiFi setup. May your NAT bridge be stable and your DHCP leases never expire."*
>
> — May the 4th be with you 🚀
