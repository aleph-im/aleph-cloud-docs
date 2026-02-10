[//]: # '## Instructions Certbot + HAProxy to be included in installation doc'

A reverse-proxy is required for production use. It allows:

- Secure connections to aleph-vm using HTTPS
- A different domain name for each VM function (if using a wildcard certificate)

HaProxy is required to support the custom Ipv4 domain name feature. (Previously Caddy was recommended).
CertBot needs to be installed alongside HaProxy to generate the SSL certificates

#### 0. **Enable the configuration file distributed with aleph-vm**

Rename /etc/haproxy/haproxy-aleph.cfg to /etc/haproxy/haproxy.cfg to activate its config

```bash
sudo mv /etc/haproxy/haproxy-aleph.cfg /etc/haproxy/haproxy.cfg
sudo mkdir -p /etc/haproxy/certs/
sudo systemctl restart haproxy
```

#### 1. **Install Required Packages**

```bash
sudo apt update
sudo apt install certbot
```

#### 2. **Obtain Initial Certificate**

You can either use a single domain certificate (recommended) or a wildcard one.

A wildcard certificate allows the use of different subdomain for each VM function on your node but requires a bit more
config.

##### Option 1: Obtain a Certificate for a Single Domain

Use `certbot` with the standalone method:

```bash
sudo certbot certonly --standalone -d yourdomain.com --http-01-port=8888
```

If successful, the certs are located in:

```bash
/etc/letsencrypt/live/yourdomain.com/
```

##### Option 2: Obtain a Wildcard Certificate (for Multiple Subdomains)

A wildcard certificate is recommended to allow any subdomain of your domain to work.

Using a different domain name for each VM function is important when running web applications,
both for security and usability purposes.

The VM Supervisor supports using domains in the form `https://identifer.yourdomain.com`, where
_identifier_ is the identifier/hash of the message describing the VM function and `yourdomain.com`
represents your domain name.

We manage one using [Let's Encrypt](https://letsencrypt.org/) and
[Certbot](https://certbot.eff.org/) with the following instructions. Other certificate providers can also be used.

Automated renewal for wildcard certificate are only supported by Certbot
on some select providers, using plugins.

Please refer to the Certbot documentation on which provider are supported on how to set them up.

https://eff-certbot.readthedocs.io/en/latest/using.html#dns-plugins

You can do the generation via the manual method but the automated renewal will not work.

Using `certbot` with the `--manual` plugin for DNS challenge verification:

1. Use the following command to generate the wildcard certificate:

```bash
sudo certbot certonly --manual -d 'yourdomain.com' -d '*.yourdomain.com' --preferred-challenges dns --agree-tos --email your-email@example.com
```

2. Certbot will prompt you to create a DNS TXT record in your domain's DNS settings. Follow the instructions provided
   during execution.

3. After Certbot verifies the DNS record, and the certificate is issued, restart HAProxy:

```bash
sudo systemctl restart haproxy
```

If successful, the certificate files will be located in:

```bash
/etc/letsencrypt/live/yourdomain.com/
```

#### 3. **Concatenate Fullchain + Key for HAProxy**

HAProxy needs a single `.pem` file:

```bash
sudo mkdir -p /etc/haproxy/certs
sudo cat /etc/letsencrypt/live/yourdomain.com/fullchain.pem /etc/letsencrypt/live/yourdomain.com/privkey.pem | sudo tee /etc/haproxy/certs/yourdomain.com.pem > /dev/null

# Secure permissions
sudo chmod 600 /etc/haproxy/certs/yourdomain.com.pem
sudo chown root:root /etc/haproxy/certs/yourdomain.com.pem
```

#### 4. **Configure HAProxy for TLS**

Reload HAProxy:

```bash
sudo systemctl reload haproxy
```

or if not running : `sudo systemctl start haproxy`

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

and replace yourdomain.com by your domain name

Make it executable:

```bash
sudo chmod +x /etc/letsencrypt/renewal-hooks/deploy/haproxy-renew.sh
```

> This script is automatically triggered **only if the certificate is actually renewed**.

7. Ensure that aleph-vm is started and working

```bash
systemctl start aleph-vm-supervisor
```

8. Then open in your browser : http://yourdomain.com

---

#### 7. To Manually Test Renewal

Run:

```bash
sudo certbot renew --dry-run
```

If it say it fail to bind on port 80, modify `/etc/letsencrypt/renewal/yourdomain.com`
and add under the section `[renewalparams]`

```ini
http01_port = 8888
```

You will need to do this if you followed previous instruction that did the certbot setup without the --http-01-port=8888
option

#### 8. Custom domain for program support (not required)

To allow users to host their website on their own domain, you will still need to run Caddy to handle the on_demand
certificate behind HAPROXY. This is an advanced setup that is not required nor recommended for ordinary node.

To achieve this

1. You can ignore the instruction on how to generate the certificate for HAproxy
2. configure Caddy as per the previous documentation but make it bind on port 4442 instead of 443
3. Edit `/etc/haproxy/haproxy.cfg` to modify the section `bk_default_ssl` to point to Caddy:
   ```haproxy
   backend bk_default_ssl
       mode tcp
       server  127.0.0.1:4442 send-proxy
   ```
4. Restart haproxy
