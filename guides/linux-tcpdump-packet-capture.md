---
layout: default
title: "tcpdump — Capture and Analyse Network Packets"
parent: "Networking & DNS"
nav_order: 17
---

# tcpdump — Capture and Analyse Network Packets

`tcpdump` captures network packets in real time or saves them to a file. Useful for debugging network issues, verifying traffic, and understanding what is actually happening on the wire.

---

## Install

```bash
sudo apt install tcpdump -y    # Ubuntu/Debian (usually pre-installed)
brew install tcpdump           # macOS
```

---

## Basic Usage

```bash
# Capture on default interface
sudo tcpdump

# Capture on specific interface
sudo tcpdump -i eth0
sudo tcpdump -i en0         # macOS WiFi

# List available interfaces
sudo tcpdump -D

# Capture with verbose output
sudo tcpdump -v
sudo tcpdump -vv            # more verbose
```

---

## Filter Traffic

```bash
# By host
sudo tcpdump host 192.168.1.1
sudo tcpdump src host 192.168.1.1     # source only
sudo tcpdump dst host 192.168.1.1     # destination only

# By port
sudo tcpdump port 80
sudo tcpdump port 80 or port 443
sudo tcpdump portrange 8000-8100

# By protocol
sudo tcpdump tcp
sudo tcpdump udp
sudo tcpdump icmp

# Combine filters
sudo tcpdump host 192.168.1.1 and port 443
sudo tcpdump not port 22               # exclude SSH
```

---

## Save to File and Read Back

```bash
# Save capture to file
sudo tcpdump -w capture.pcap

# Save first 1000 packets then stop
sudo tcpdump -w capture.pcap -c 1000

# Read and display a saved capture
tcpdump -r capture.pcap

# Read with filter
tcpdump -r capture.pcap port 80
```

The `.pcap` file can be opened in Wireshark for visual analysis.

---

## Show Packet Contents

```bash
# Show ASCII content (for HTTP, SMTP, etc.)
sudo tcpdump -A port 80

# Show hex + ASCII
sudo tcpdump -X port 80

# Capture DNS queries
sudo tcpdump -n port 53

# Watch HTTP traffic (unencrypted)
sudo tcpdump -A -s 0 port 80 | grep -E "GET|POST|HTTP"
```

---

## Practical Examples

```bash
# Debug DNS resolution
sudo tcpdump -n port 53

# Watch connections to a web server
sudo tcpdump -n -i eth0 'tcp port 443 and (tcp-syn)'

# Capture traffic between two hosts
sudo tcpdump -n host 10.0.0.1 and host 10.0.0.2

# Monitor SSH connections
sudo tcpdump -n port 22

# Capture all traffic on a server and rotate files hourly
sudo tcpdump -w /tmp/capture-%Y%m%d-%H%M%S.pcap -G 3600 -C 100
```
