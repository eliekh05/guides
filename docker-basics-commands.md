---
layout: default
title: "Docker Basics — Commands You Actually Use"
parent: "macOS & Linux"
nav_order: 29
---

# Docker Basics — Commands You Actually Use

---

## Install Docker

**Ubuntu/Debian (official method):**
```bash
curl -fsSL https://get.docker.com | sh
sudo usermod -aG docker $(whoami)
```
Log out and back in — this lets you run `docker` without `sudo`.

**macOS:**
Download Docker Desktop from [docker.com](https://www.docker.com/products/docker-desktop/).

---

## Run a Container

```bash
docker run hello-world                    # test Docker is working
docker run -it ubuntu bash                # interactive Ubuntu shell
docker run -d -p 8080:80 nginx            # Nginx in background on port 8080
docker run --name mycontainer -d nginx    # give it a name
docker run --rm ubuntu echo "hello"       # remove container when done
```

Flags:
- `-d` — detached (background)
- `-it` — interactive terminal
- `-p host:container` — port mapping
- `--name` — name the container
- `--rm` — auto-remove when stopped

---

## Manage Containers

```bash
docker ps                    # running containers
docker ps -a                 # all containers including stopped

docker stop mycontainer      # graceful stop
docker kill mycontainer      # force stop
docker start mycontainer     # start a stopped container
docker restart mycontainer

docker rm mycontainer        # delete stopped container
docker rm -f mycontainer     # force delete running container
```

---

## Images

```bash
docker images                # list local images
docker pull nginx             # download an image
docker pull nginx:1.25        # specific version
docker rmi nginx              # delete an image
docker rmi $(docker images -q) # delete ALL images (careful)
```

---

## Exec Into a Running Container

```bash
docker exec -it mycontainer bash     # bash shell inside container
docker exec -it mycontainer sh       # sh if bash not available
docker exec mycontainer ls /var      # run one command
```

---

## Logs

```bash
docker logs mycontainer              # all logs
docker logs -f mycontainer           # follow logs in real time
docker logs --tail 50 mycontainer    # last 50 lines
```

---

## Volumes (Persist Data)

```bash
# Named volume
docker run -d -v mydata:/var/lib/mysql mysql

# Bind mount (folder on your machine → container)
docker run -d -v /home/user/data:/data nginx

docker volume ls                # list volumes
docker volume rm mydata         # delete a volume
```

---

## Docker Compose

```bash
docker compose up -d            # start all services in docker-compose.yml
docker compose down             # stop and remove containers
docker compose down -v          # also remove volumes
docker compose logs -f          # follow logs for all services
docker compose restart service  # restart one service
docker compose pull             # pull latest images
```

---

## Clean Up

```bash
docker system prune             # remove stopped containers, unused images, networks
docker system prune -a          # also remove unused images
docker system prune -a --volumes # also remove unused volumes
docker system df                # see disk usage
```

---

## Common Issues

**"Permission denied" running docker:**
```bash
sudo usermod -aG docker $(whoami)
# then log out and back in
```

**Port already in use:**
```bash
sudo ss -tlnp | grep 8080      # find what is using the port
```

**Container keeps restarting:**
```bash
docker logs mycontainer        # check what error is causing the crash
```
