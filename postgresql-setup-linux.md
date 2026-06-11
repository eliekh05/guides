---
layout: default
title: "PostgreSQL Setup on Linux"
parent: "Server & Self-Hosting"
nav_order: 10
---

# PostgreSQL Setup on Linux

---

## Install

```bash
sudo apt install postgresql postgresql-contrib -y     # Ubuntu/Debian
sudo dnf install postgresql-server postgresql-contrib -y && sudo postgresql-setup --initdb  # Fedora/RHEL
sudo pacman -S postgresql && sudo -u postgres initdb -D /var/lib/postgres/data  # Arch

sudo systemctl enable --now postgresql
```

---

## Connect as the postgres superuser

```bash
sudo -u postgres psql
```

You are now in the PostgreSQL shell (`postgres=#`).

---

## Create a Database and User

```sql
-- Create a user with a password
CREATE USER myuser WITH PASSWORD 'strongpassword';

-- Create a database owned by that user
CREATE DATABASE mydb OWNER myuser;

-- Grant all privileges
GRANT ALL PRIVILEGES ON DATABASE mydb TO myuser;

-- Exit
\q
```

---

## Connect as the new user

```bash
psql -U myuser -d mydb -h localhost
# Enter password when prompted
```

---

## psql Quick Reference

```sql
\l              -- list databases
\c mydb         -- connect to database
\dt             -- list tables
\d tablename    -- describe a table
\du             -- list users/roles
\q              -- quit
\?              -- help
```

---

## Allow Remote Connections

By default PostgreSQL only accepts local connections. To allow remote access:

### Step 1 — Edit postgresql.conf

```bash
sudo nano /etc/postgresql/*/main/postgresql.conf       # Ubuntu/Debian
sudo nano /var/lib/pgsql/data/postgresql.conf          # Fedora/RHEL
```

Find and change:
```
listen_addresses = '*'
```

### Step 2 — Edit pg_hba.conf

```bash
sudo nano /etc/postgresql/*/main/pg_hba.conf
```

Add a line at the bottom:
```
host    mydb    myuser    192.168.1.0/24    md5
```

Format: `type  database  user  address  auth-method`

### Step 3 — Restart and open firewall

```bash
sudo systemctl restart postgresql
sudo ufw allow 5432/tcp
```

---

## Backup and Restore

```bash
# Backup a single database
pg_dump -U myuser mydb > backup.sql

# Backup all databases
pg_dumpall -U postgres > all_databases.sql

# Restore a database
psql -U myuser mydb < backup.sql

# Restore with createdb
psql -U postgres -c "CREATE DATABASE mydb"
psql -U myuser mydb < backup.sql
```

---

## Check Status

```bash
sudo systemctl status postgresql
sudo -u postgres psql -c "SELECT version();"
sudo -u postgres psql -c "\l"              # list all databases
```

---

## Common Issues

**`FATAL: peer authentication failed`** — connecting as wrong OS user. Use `-h localhost`:
```bash
psql -U myuser -d mydb -h localhost
```

**`FATAL: password authentication failed`** — wrong password or user does not exist. Check with `\du` in the postgres shell.

**Cannot connect remotely** — check `listen_addresses = '*'` in postgresql.conf and the pg_hba.conf rule. Also check firewall.
