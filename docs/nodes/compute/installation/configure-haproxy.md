[//]: # (## Instructions Certbot + HAProxy to be included in installation doc)

A reverse-proxy is required for production use it allows Secure connections using HTTPS
A reverse proxy acts as an intermediary server that forwards client requests to aleph-vm while
providing a SSL secure layer on top.

HaProxy is required to support the custom Ipv4 domain name feature. (Previously Caddy was recommended).
CertBot needs to be installed alongside HaProxy to generate the SSL certificates

#### 0. **Enable the configuration file distributed with aleph-vm**

Rename /etc/haproxy/haproxy-aleph.cfg to /etc/haproxy/haproxy.cfg to activate it's config

```bash
sudo mv etc/haproxy/haproxy-aleph.cfg /etc/haproxy/haproxy.cfg
```

#### 1. **Install Required Packages**

```bash
sudo apt update
sudo apt install certbot haproxy
```

---

#### 2. **Obtain Initial Certificate**

Use `certbot` with the standalone method (temporarily stops HAProxy to use port 80):

```bash
sudo systemctl stop haproxy

sudo certbot certonly --standalone -d yourdomain.com

sudo systemctl start haproxy
```

If successful, the certs are located in:

```bash
/etc/letsencrypt/live/yourdomain.com/
```

---

#### 3. **Concatenate Fullchain + Key for HAProxy**

HAProxy needs a single `.pem` file:

```bash
sudo mkdir -p /etc/haproxy/certs
sudo cat /etc/letsencrypt/live/yourdomain.com/fullchain.pem /etc/letsencrypt/live/yourdomain.com/privkey.pem | sudo tee /etc/haproxy/certs/yourdomain.com.pem > /dev/null

# Secure permissions
sudo chmod 600 /etc/haproxy/certs/yourdomain.com.pem
sudo chown root:root /etc/haproxy/certs/yourdomain.com.pem
```

---

#### 4. **Configure HAProxy for TLS**

Reload HAProxy:

```bash
sudo systemctl reload haproxy
```

---

#### 5. **Set Up Auto-Renewal with Systemd Timer**

Ubuntu and Debian uses `systemd` by default and `certbot` comes with a timer:

Check it's active:

```bash
systemctl list-timers | grep certbot
```

You should see:

```
certbot.timer ...
```

If not enabled:

```bash
sudo systemctl enable certbot.timer
sudo systemctl start certbot.timer
```

It runs `certbot renew` twice daily.

---

#### 6. **Automate Concatenation and Reload with a Hook Script**

Create a script to be used as a deploy hook:

```bash
sudo nano /etc/letsencrypt/renewal-hooks/deploy/haproxy-renew.sh
```

Paste this into the script:

```bash
#!/bin/bash

DOMAIN="yourdomain.com"
CERT_PATH="/etc/letsencrypt/live/$DOMAIN"
OUTPUT_PEM="/etc/haproxy/certs/$DOMAIN.pem"

cat "$CERT_PATH/fullchain.pem" "$CERT_PATH/privkey.pem" > "$OUTPUT_PEM"
chmod 600 "$OUTPUT_PEM"
chown root:root "$OUTPUT_PEM"

/bin/systemctl reload haproxy
```

Make it executable:

```bash
sudo chmod +x /etc/letsencrypt/renewal-hooks/deploy/haproxy-renew.sh
```

> This script is automatically triggered **only if the certificate is actually renewed**.

---

#### To Manually Test Renewal

Run:

```bash
sudo certbot renew --dry-run
```