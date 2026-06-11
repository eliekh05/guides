---
layout: default
title: "Docker and Container Networking Explained"
parent: "Server & Self-Hosting"
nav_order: 25
---

# Docker and Container Networking Explained

Understanding Docker networking helps you connect containers to each other, to the host, and to the internet correctly.

---

## Default Network Modes

```bash
docker network ls                   # list networks
docker network inspect bridge       # inspect default bridge
```

**bridge** (default): Container gets its own IP on an internal network. NAT for internet access. Cannot reach other containers by name.

**host**: Container shares the host's network stack. `localhost` inside the container is the host's localhost.

**none**: No network access.

---

## User-Defined Bridge Networks (Recommended)

User-defined bridges allow containers to reach each other **by name**:

```bash
# Create a network
docker network create myapp-network

# Run containers on the same network
docker run -d --name db --network myapp-network postgres
docker run -d --name web --network myapp-network nginx

# Web container can reach database as "db"
# curl http://db:5432 works from inside "web"
```

This is what Docker Compose does automatically.

---

## Connect and Disconnect

```bash
docker network connect myapp-network existing-container
docker network disconnect myapp-network container
```

---

## Expose Ports

```bash
-p 8080:80         # host:container — expose to all interfaces
-p 127.0.0.1:8080:80  # expose on localhost only (security best practice for internal services)
-p 8080:80/udp     # UDP port
```

**Only expose ports that need to be accessed from outside the Docker network.** Containers on the same Docker network can reach each other without port mapping.

---

## DNS in Docker

Docker provides automatic DNS for user-defined networks:
- Container name resolves to the container's IP
- Service names in Docker Compose resolve to their containers
- `host.docker.internal` resolves to the host machine's IP (useful for development)

---

## Docker Compose Networking

All services in a `docker-compose.yml` are automatically on the same network and can reach each other by service name:

```yaml
services:
  web:
    image: nginx
    depends_on:
      - api
  api:
    image: myapp
    # Web can reach this as "http://api:3000"
```

---

## Macvlan — Container Gets Its Own LAN IP

Advanced use: give a container its own IP on your physical network:

```bash
docker network create -d macvlan \
  --subnet=192.168.1.0/24 \
  --gateway=192.168.1.1 \
  -o parent=eth0 \
  mymacvlan

docker run -d --network mymacvlan --ip 192.168.1.200 nginx
```

The container appears on your LAN as `192.168.1.200`. Useful for Pi-hole, Home Assistant, etc.

---

## Troubleshoot Container Networking

```bash
# Enter a container and test network
docker exec -it container bash
ping other-container
curl http://other-container:8080

# Inspect container's network settings
docker inspect container | jq '.[0].NetworkSettings'

# View iptables rules Docker created
sudo iptables -t nat -L DOCKER -n --line-numbers
```
