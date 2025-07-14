# Caddy Reverse-proxy for Aleph-VM

**Deprecated** Caddy was previously recommended for CRN nodes, we now use HAProxy to support custom domain for instances, see the installation docs.

---

### Instructions to Migrate from Caddy to HAProxy Configuration

If your server was previously configured with Caddy, you can migrate to the HAProxy + Certbot setup using the steps
below. This configuration supports HTTPS and provides a secure reverse-proxy setup. The existing Caddy setup will remain
intact until you have tested and verified the HAProxy setup. Once verified, you may optionally remove the `Caddy`
package.

---

#### Step 1: Stop the `aleph-vm-supervisor` Service

Before making changes, stop the `aleph-vm-supervisor` service managed by `systemd` to ensure a smooth migration process.

```shell script
sudo systemctl stop aleph-vm-supervisor
```

Verify that the service has stopped:

```shell script
sudo systemctl status aleph-vm-supervisor
```

---

#### Step 2: Stop Caddy Without Removing Its Configuration

Stop Caddy to prevent conflicts. *Do not remove its configuration yet, so you can revert to Caddy if needed.*

```shell script
sudo systemctl stop caddy
sudo systemctl disable caddy
```

Check that Caddy is no longer running:

```shell script
ps aux | grep caddy
```

---

#### Step 3: Install Required Packages for HAProxy + Certbot

Update your system and install `haproxy` and `certbot`.

```shell script
sudo apt update
sudo apt install certbot haproxy -y
```

---

#### Step 4: Enable the Aleph-VM Configuration File for HAProxy

Move the provided `haproxy-aleph.cfg` configuration file to activate the HAProxy configuration:

```shell script
sudo mkdir /etc/haproxy/certs/
sudo mv /etc/haproxy/haproxy-aleph.cfg /etc/haproxy/haproxy.cfg
```

Reload and restart HAProxy:

```shell script
sudo systemctl restart haproxy
```

---

#### Step 5: Obtain an HTTPS Certificate with Certbot

Use Certbot's standalone mode to generate an SSL/TLS certificate for your domain.

```shell script
sudo systemctl stop haproxy

sudo certbot certonly --standalone -d yourdomain.com
```

Verify Certbot successfully generated the certificates by checking:

```shell script
sudo ls /etc/letsencrypt/live/yourdomain.com/
```

You should see `fullchain.pem` and `privkey.pem` among the files.

---

#### Step 6: Prepare Certificates for HAProxy

HAProxy requires a single `.pem` file containing both the certificate chain and the private key. Combine them into a
`.pem` file:

```shell script
sudo cat /etc/letsencrypt/live/yourdomain.com/fullchain.pem /etc/letsencrypt/live/yourdomain.com/privkey.pem | sudo tee /etc/haproxy/certs/yourdomain.com.pem > /dev/null

# Secure permissions
sudo chmod 600 /etc/haproxy/certs/yourdomain.com.pem
sudo chown root:root /etc/haproxy/certs/yourdomain.com.pem
```

---

#### Step 7: Restart HAProxy

Restart or reload HAProxy to apply the TLS configuration:

```shell script
sudo systemctl restart haproxy
```
---

#### Step 8: Automate Certificate Renewal

Set up automated certificate renewal using Certbot's `systemd` timer.

Verify the timer is active:

```shell script
systemctl list-timers | grep certbot
```

If not active, enable it:

```shell script
sudo systemctl enable certbot.timer
sudo systemctl start certbot.timer
```

---

#### Step 9: Automate Renewal Hook for HAProxy Reload

Create a deploy hook for Certbot to automatically update the `.pem` file and reload HAProxy after a certificate is
renewed.

Create the script:

```shell script
sudo nano /etc/letsencrypt/renewal-hooks/deploy/haproxy-renew.sh
```

Paste the following into the file:

```shell script
#!/bin/bash

DOMAIN="yourdomain.com"
CERT_PATH="/etc/letsencrypt/live/$DOMAIN"
OUTPUT_PEM="/etc/haproxy/certs/$DOMAIN.pem"

cat "$CERT_PATH/fullchain.pem" "$CERT_PATH/privkey.pem" > "$OUTPUT_PEM"
chmod 600 "$OUTPUT_PEM"
chown root:root "$OUTPUT_PEM"

/bin/systemctl reload haproxy
```

Save the file and make it executable:

```shell script
sudo chmod +x /etc/letsencrypt/renewal-hooks/deploy/haproxy-renew.sh
```

This script runs automatically when Certbot renews your certificate.

---

#### Step 10: Restart the `aleph-vm-supervisor` Service

After completing the migration, restart the `aleph-vm-supervisor` service:

```shell script
sudo systemctl start aleph-vm-supervisor
```

Check its status to ensure everything is running smoothly:

```shell script
sudo systemctl status aleph-vm-supervisor
```

---

#### Step 11: Verify Configuration

After testing, visit your domain (`https://yourdomain.com`) to ensure the new configuration is functioning as expected.

---

#### Step 12: (Optional) Remove Caddy After Verification

Once you have validated that the HAProxy setup is working as expected and the `aleph-vm` service is running correctly,
you may remove the `Caddy` package and its files if you no longer need them:

```shell script
sudo apt remove --purge caddy -y
sudo rm -rf /etc/caddy /var/lib/caddy
```

---

### Notes on Reverting to the Previous Caddy Setup

If required, you can revert back to your previous Caddy setup:

1. Stop HAProxy:

```shell script
sudo systemctl stop haproxy
```

2. Re-enable and start Caddy:

```shell script
sudo systemctl enable caddy
sudo systemctl start caddy
```

3. Verify the Caddy setup is working by visiting your domain.

---
# Old Instructions

A reverse-proxy is required for production use. It allows:

 - A different domain name for each VM function
 - Secure connections using HTTPS
 - Load balancing between multiple servers

Using a different domain name for each VM function is important when running web applications, 
both for security and usability purposes. 

The VM Supervisor supports using domains in the form `https://identifer.vm.yourdomain.com`, where
_identifier_ is the identifier/hash of the message describing the VM function and `yourdomain.com` 
represents your domain name.

## 1. Wildcard certificates

A wildcard certificate is recommended to allow any subdomain of your domain to work.

You can create one using [Let's Encrypt](https://letsencrypt.org/) and
[Certbot](https://certbot.eff.org/) with the following instructions.

```shell
sudo apt install -y certbot

certbot certonly --manual --email email@yourdomain.com --preferred-challenges dns \
  --server https://acme-v02.api.letsencrypt.org/directory --agree-tos \
  -d 'vm.yourdomain.com,*.vm.yourdomain.com'
```

## 2. Caddy Server

In this documentation, we will install the modern [Caddy](https://caddyserver.com/) reverse-proxy.

Replace `vm.yourdomain.com` with your domain of choice. 

To install on Debian/Ubuntu, according to the
[official instructions](https://caddyserver.com/docs/install#debian-ubuntu-raspbian):
```shell
sudo apt install -y debian-keyring debian-archive-keyring apt-transport-https
curl -1sLf 'https://dl.cloudsmith.io/public/caddy/stable/gpg.key' | sudo gpg --dearmor -o /usr/share/keyrings/caddy-stable-archive-keyring.gpg
curl -1sLf 'https://dl.cloudsmith.io/public/caddy/stable/debian.deb.txt' | sudo tee /etc/apt/sources.list.d/caddy-stable.list
sudo apt update
sudo apt install caddy
```

Then give Caddy access to the certificates generated by Certbot:
```shell
chmod 750 /etc/letsencrypt/live/
chmod 750 /etc/letsencrypt/archive/
chmod 640 /etc/letsencrypt/archive/vm.yourdomain.com/privkey1.pem
chgrp -R caddy /etc/letsencrypt/archive/
chgrp -R caddy /etc/letsencrypt/live/
```

Configure Caddy:
```shell
cat >/etc/caddy/Caddyfile <<EOL

vm.yourdomain.com:443 {
    tls /etc/letsencrypt/live/vm.yourdomain.com/fullchain.pem /etc/letsencrypt/live/vm.yourdomain.com/privkey.pem
    reverse_proxy http://127.0.0.1:4020 {
        # Forward Host header to the backend
        header_up Host {host}
    }
}

*.vm.yourdomain.com:443 {
    tls /etc/letsencrypt/live/vm.yourdomain.com/fullchain.pem /etc/letsencrypt/live/vm.yourdomain.com/privkey.pem
    reverse_proxy http://127.0.0.1:4020 {
        # Forward Host header to the backend
        header_up Host {host}
    }
}
EOL
```

Optionally, you can allow users to host their website using their own domains using the following
configuration. Be careful about rate limits if you enable `on_demand` TLS, 
see the [Caddy documentation on On-Demand TLS](https://caddyserver.com/docs/automatic-https#on-demand-tls).
```shell
cat >/etc/caddy/Caddyfile <<EOL
vm.yourdomain.com:443 {
    tls /etc/letsencrypt/live/vm.yourdomain.com/fullchain.pem /etc/letsencrypt/live/vm.yourdomain.com/privkey.pem
    reverse_proxy http://127.0.0.1:4020 {
        header_up Host {host}
    }
}

*.vm.yourdomain.com:443 {
    tls /etc/letsencrypt/live/vm.yourdomain.com/fullchain.pem /etc/letsencrypt/live/vm.yourdomain.com/privkey.pem
    reverse_proxy http://127.0.0.1:4020 {
        # Forward Host header to the backend
        header_up Host {host}
    }
}

*:443 {
    tls {
        on_demand
    }
    reverse_proxy http://127.0.0.1:4020 {
        # Forward Host header to the backend
        header_up Host {host}
    }
}
EOL
```

Finally, restart Caddy:
```shell
sudo systemctl restart caddy
```