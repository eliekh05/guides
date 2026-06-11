---
layout: default
title: "Self-Host Gitea — Your Own GitHub"
parent: "Server & Self-Hosting"
nav_order: 29
---

# Self-Host Gitea — Your Own GitHub

Gitea is a lightweight self-hosted Git service with a GitHub-like web interface. It supports repositories, issues, pull requests, CI/CD, and user management.

---

## Install with Docker Compose

```bash
mkdir -p ~/gitea && cd ~/gitea
nano docker-compose.yml
```

```yaml
services:
  gitea:
    image: gitea/gitea:latest
    container_name: gitea
    restart: unless-stopped
    environment:
      - USER_UID=1000
      - USER_GID=1000
      - GITEA__database__DB_TYPE=postgres
      - GITEA__database__HOST=db:5432
      - GITEA__database__NAME=gitea
      - GITEA__database__USER=gitea
      - GITEA__database__PASSWD=giteasecret
    ports:
      - "3000:3000"
      - "222:22"
    volumes:
      - gitea_data:/data
      - /etc/timezone:/etc/timezone:ro
      - /etc/localtime:/etc/localtime:ro
    depends_on:
      - db

  db:
    image: postgres:16
    restart: unless-stopped
    environment:
      - POSTGRES_USER=gitea
      - POSTGRES_PASSWORD=giteasecret
      - POSTGRES_DB=gitea
    volumes:
      - postgres_data:/var/lib/postgresql/data

volumes:
  gitea_data:
  postgres_data:
```

```bash
docker compose up -d
```

Open `http://YOUR_IP:3000` to complete setup.

---

## Initial Configuration (Setup Wizard)

- **Database:** already configured via environment variables
- **Site title:** your organisation name
- **Admin account:** create your first admin user
- **Base URL:** `http://your-ip:3000` or your domain

---

## SSH Access

SSH clone URL uses port 222 (mapped from container port 22):

```bash
git clone ssh://git@YOUR_IP:222/username/repo.git
```

Add your SSH key in Gitea: User Settings → SSH / GPG Keys → Add Key

---

## Set Up Nginx Reverse Proxy

Point Nginx at port 3000 with SSL (see **Nginx Reverse Proxy** guide). Update the `BASE_URL` in Gitea settings after adding SSL.

---

## Migrate From GitHub

In Gitea: + → Migrate → GitHub

Provide your GitHub token. Gitea imports repositories, issues, pull requests, and wiki.

---

## Gitea Actions (CI/CD)

Gitea supports GitHub Actions-compatible workflows. Enable in admin settings and run an act runner:

```bash
docker run -d \
  --name gitea-runner \
  -v /var/run/docker.sock:/var/run/docker.sock \
  -v gitea-runner:/data \
  -e CONFIG_FILE=/data/config.yaml \
  gitea/act_runner:latest
```

Register the runner in Gitea: Site Administration → Runners → Add Runner
