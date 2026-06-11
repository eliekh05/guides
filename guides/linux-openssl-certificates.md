---
layout: default
title: "OpenSSL — Create and Inspect Certificates"
parent: "Security & Apps"
nav_order: 13
---

# OpenSSL — Create and Inspect Certificates

OpenSSL is the command-line tool for working with SSL/TLS certificates, keys, and encryption.

---

## Inspect an Existing Certificate

```bash
# Check a remote server's certificate
echo | openssl s_client -connect example.com:443 2>/dev/null | openssl x509 -noout -text

# Check expiry date only
echo | openssl s_client -connect example.com:443 2>/dev/null | openssl x509 -noout -dates

# Inspect a local certificate file
openssl x509 -in cert.pem -noout -text
openssl x509 -in cert.pem -noout -subject -issuer -dates

# Check if a cert matches its private key
openssl x509 -noout -modulus -in cert.pem | md5sum
openssl rsa  -noout -modulus -in key.pem  | md5sum
# Both hashes must match
```

---

## Generate a Self-Signed Certificate

```bash
# Key + self-signed cert in one command (for testing/internal use)
openssl req -x509 -newkey rsa:4096 -keyout key.pem -out cert.pem \
  -days 365 -nodes \
  -subj "/C=US/ST=State/L=City/O=MyOrg/CN=mysite.local"
```

---

## Generate a CSR (Certificate Signing Request)

Send a CSR to a CA (Certificate Authority) to get a trusted certificate:

```bash
# Generate key and CSR
openssl req -newkey rsa:4096 -keyout mysite.key -out mysite.csr -nodes \
  -subj "/C=US/ST=State/L=City/O=MyOrg/CN=mysite.com"

# Generate CSR from existing key
openssl req -new -key mysite.key -out mysite.csr
```

---

## Convert Certificate Formats

```bash
# PEM to DER
openssl x509 -outform der -in cert.pem -out cert.der

# DER to PEM
openssl x509 -inform der -in cert.der -out cert.pem

# PEM to PKCS#12 (.pfx/.p12) — used by Windows/IIS
openssl pkcs12 -export -out cert.pfx -inkey key.pem -in cert.pem

# PKCS#12 to PEM
openssl pkcs12 -in cert.pfx -out cert.pem -nodes
```

---

## Test TLS Connection

```bash
# Full TLS handshake info
openssl s_client -connect example.com:443

# Check supported TLS versions
openssl s_client -connect example.com:443 -tls1_3
openssl s_client -connect example.com:443 -tls1_2

# Check with SNI (Server Name Indication — for virtual hosting)
openssl s_client -connect example.com:443 -servername example.com
```

---

## Encrypt and Decrypt Files

```bash
# Encrypt a file (uses AES-256)
openssl enc -aes-256-cbc -salt -in file.txt -out file.enc

# Decrypt
openssl enc -aes-256-cbc -d -in file.enc -out file.txt
```

---

## Check Certificate Expiry Across Multiple Servers

```bash
for host in example.com github.com google.com; do
  echo -n "$host: "
  echo | openssl s_client -connect $host:443 2>/dev/null | \
    openssl x509 -noout -dates 2>/dev/null | grep "notAfter"
done
```
