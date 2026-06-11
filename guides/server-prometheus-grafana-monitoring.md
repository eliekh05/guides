---
layout: default
title: "Set Up Prometheus and Grafana for Server Monitoring"
parent: "Server & Self-Hosting"
nav_order: 22
---

# Set Up Prometheus and Grafana for Server Monitoring

Prometheus collects metrics from servers. Grafana visualises them in dashboards. Together they give you CPU, memory, disk, and network graphs with historical data and alerting.

---

## Docker Compose Setup

```bash
mkdir -p ~/monitoring && cd ~/monitoring
nano docker-compose.yml
```

```yaml
services:
  prometheus:
    image: prom/prometheus:latest
    container_name: prometheus
    restart: unless-stopped
    ports:
      - "9090:9090"
    volumes:
      - ./prometheus.yml:/etc/prometheus/prometheus.yml
      - prometheus_data:/prometheus

  grafana:
    image: grafana/grafana:latest
    container_name: grafana
    restart: unless-stopped
    ports:
      - "3000:3000"
    volumes:
      - grafana_data:/var/lib/grafana
    environment:
      - GF_SECURITY_ADMIN_PASSWORD=changeme

  node-exporter:
    image: prom/node-exporter:latest
    container_name: node-exporter
    restart: unless-stopped
    ports:
      - "9100:9100"
    volumes:
      - /proc:/host/proc:ro
      - /sys:/host/sys:ro
      - /:/rootfs:ro
    command:
      - '--path.procfs=/host/proc'
      - '--path.rootfs=/rootfs'
      - '--path.sysfs=/host/sys'
      - '--collector.filesystem.mount-points-exclude=^/(sys|proc|dev|host|etc)($$|/)'

volumes:
  prometheus_data:
  grafana_data:
```

---

## Prometheus Config

```bash
nano prometheus.yml
```

```yaml
global:
  scrape_interval: 15s

scrape_configs:
  - job_name: 'node-exporter'
    static_configs:
      - targets: ['node-exporter:9100']

  - job_name: 'prometheus'
    static_configs:
      - targets: ['localhost:9090']
```

Start:
```bash
docker compose up -d
```

---

## Configure Grafana

1. Open `http://YOUR_IP:3000` — login admin/changeme
2. **Connections → Data sources → Add data source → Prometheus**
3. URL: `http://prometheus:9090` → **Save & test**
4. **Dashboards → Import → Dashboard ID: 1860** (Node Exporter Full dashboard)
5. Select your Prometheus datasource → **Import**

You now have CPU, memory, disk, network graphs with 15-second resolution.

---

## Monitor Multiple Servers

Install `node-exporter` on each server you want to monitor:

```bash
docker run -d \
  --name node-exporter \
  --restart unless-stopped \
  -p 9100:9100 \
  --pid host \
  -v /proc:/host/proc:ro \
  -v /sys:/host/sys:ro \
  -v /:/rootfs:ro \
  prom/node-exporter:latest \
  --path.procfs=/host/proc --path.sysfs=/host/sys \
  --collector.filesystem.mount-points-exclude='^/(sys|proc|dev|host|etc)($$|/)'
```

Then add to `prometheus.yml`:
```yaml
  - job_name: 'server2'
    static_configs:
      - targets: ['server2-ip:9100']
```
