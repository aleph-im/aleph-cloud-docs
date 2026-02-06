# Running Docker in Aleph Cloud Instances

Aleph Cloud instances support running Docker containers, allowing you to deploy containerized applications on decentralized infrastructure.

## Prerequisites

- An Aleph Cloud instance (Ubuntu 22.04 recommended)
- SSH access to your instance
- Sufficient resources (recommended: 2+ vCPUs, 4GB+ RAM for typical Docker workloads)

## Installing Docker

Connect to your instance via SSH and run the official Docker installation script:

```bash
curl -fsSL https://get.docker.com | sh
```

This installs:
- Docker Engine
- Docker CLI
- Docker Compose plugin
- containerd

Verify the installation:

```bash
docker version
docker compose version
```

## Running Your First Container

Test that Docker works correctly:

```bash
docker run --rm hello-world
```

## Example: Running a Web Application

Here's an example deploying a simple web service with Docker Compose:

```bash
# Create a project directory
mkdir ~/myapp && cd ~/myapp

# Create docker-compose.yml
cat > docker-compose.yml << 'EOF'
services:
  web:
    image: nginx:alpine
    ports:
      - "8080:80"
    volumes:
      - ./html:/usr/share/nginx/html:ro
    restart: unless-stopped
EOF

# Create a simple HTML page
mkdir html
echo '<h1>Hello from Aleph Cloud!</h1>' > html/index.html

# Start the service
docker compose up -d

# Check it's running
curl localhost:8080
```

## Example: Running Multiple Services

Deploy a more complex stack with multiple containers:

```yaml
# docker-compose.yml
services:
  app:
    image: python:3.11-slim
    command: python -m http.server 8000
    ports:
      - "8000:8000"
    restart: unless-stopped

  redis:
    image: redis:alpine
    restart: unless-stopped

  postgres:
    image: postgres:16-alpine
    environment:
      POSTGRES_PASSWORD: mysecretpassword
    volumes:
      - pgdata:/var/lib/postgresql/data
    restart: unless-stopped

volumes:
  pgdata:
```

## Exposing Services Publicly

To make your containerized services accessible from the internet, you have several options:

### 1. Cloudflare Tunnel (Recommended for quick testing)

```bash
# Install cloudflared
curl -L https://github.com/cloudflare/cloudflared/releases/latest/download/cloudflared-linux-amd64 -o /usr/local/bin/cloudflared
chmod +x /usr/local/bin/cloudflared

# Create a quick tunnel
cloudflared tunnel --url http://localhost:8080
```

### 2. Port Forwarding via Aleph

Use the Aleph Cloud console or CLI to configure port forwarding for your instance.

### 3. Custom Domain with Reverse Proxy

Set up nginx or Caddy as a reverse proxy with SSL:

```yaml
# docker-compose.yml with Caddy reverse proxy
services:
  caddy:
    image: caddy:alpine
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./Caddyfile:/etc/caddy/Caddyfile
      - caddy_data:/data
    restart: unless-stopped

  app:
    image: your-app:latest
    expose:
      - "8000"

volumes:
  caddy_data:
```

## Best Practices

### Resource Management

Monitor container resource usage:

```bash
docker stats
```

Set resource limits in your compose file:

```yaml
services:
  app:
    image: your-app
    deploy:
      resources:
        limits:
          cpus: '0.5'
          memory: 512M
```

### Persistent Data

Always use Docker volumes for persistent data:

```yaml
volumes:
  app_data:

services:
  db:
    image: postgres
    volumes:
      - app_data:/var/lib/postgresql/data
```

### Auto-restart

Ensure containers restart after instance reboot:

```yaml
services:
  app:
    restart: unless-stopped
```

### Logging

Configure logging to prevent disk space issues:

```yaml
services:
  app:
    logging:
      driver: "json-file"
      options:
        max-size: "10m"
        max-file: "3"
```

## Troubleshooting

### Docker daemon not starting

Check the Docker service status:

```bash
systemctl status docker
journalctl -u docker
```

### Permission denied errors

If running as non-root, add your user to the docker group:

```bash
sudo usermod -aG docker $USER
# Log out and back in for changes to take effect
```

### Out of disk space

Clean up unused resources:

```bash
docker system prune -a
```

## Limitations

- **Nested virtualization**: Running VMs inside Docker containers may not work depending on the instance type
- **Network performance**: Container networking adds minimal overhead
- **Disk space**: Plan for container images and volumes in your instance storage allocation

## Next Steps

- [Custom Images](/devhub/compute-resources/standard-instances/custom-images) - Create your own instance images
- [Payment Models](/devhub/compute-resources/payment-models/) - Understand pay-as-you-go pricing
