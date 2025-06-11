# Core Channel Node Troubleshooting

This guide covers common issues you might encounter when setting up or running an Aleph Cloud Core Channel Node (CCN), along with solutions to resolve them.

## Installation Issues

### Docker Installation Problems

If you encounter issues installing Docker or Docker Compose:

```bash
# Check if Docker is running
systemctl status docker

# Install Docker from official repository if the package manager version fails
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh
```

### Permission Issues

If you encounter permission errors when running Docker commands:

```bash
# Add your user to the Docker group
sudo usermod -a -G docker $(whoami)

# Apply the new group membership (requires logging out and back in)
# Alternatively, you can use this command to apply changes in the current session
newgrp docker
```

### Configuration Errors

If your node fails to start due to configuration issues:

1. Check for syntax errors in your `config.yml` file:
   ```bash
   yamllint config.yml
   ```

2. Verify the Ethereum API URL is correct and accessible:
   ```bash
   curl -s <your-ethereum-api-url>
   ```

3. Ensure your node keys were generated correctly:
   ```bash
   ls -la keys/
   # Should show: node-pub.key and node-secret.pkcs8.der
   ```

## Docker Resource Management

### Checking Disk Usage

Docker containers and images can consume significant disk space over time:

```bash
# Check Docker disk usage
docker system df

# Detailed breakdown of space used by containers
docker system df -v
```

### Cleaning Unused Docker Resources

Free up disk space by removing unused Docker resources:

```bash
# Remove stopped containers
docker container prune -f

# Remove unused images
docker image prune -a -f

# Remove unused volumes
# Ensure to have ALL containers running to avoid cleaning used volumes
docker volume prune -f

# Remove unused networks
docker network prune -f

# Full system prune (combines all the above)
docker system prune -a -f
```

### Setting Up Log Rotation

Prevent Docker logs from consuming too much disk space:

1. Create or edit `/etc/docker/daemon.json`:
   ```json
   {
     "log-driver": "json-file",
     "log-opts": {
       "max-size": "10m",
       "max-file": "3"
     }
   }
   ```

2. Restart Docker to apply changes:
   ```bash
   sudo systemctl restart docker
   ```

## IPFS Container Resource Management

The IPFS container can sometimes consume excessive system resources, which may impact the overall performance of your node or server. Resource limiting is typically only necessary if you observe high CPU or memory usage that affects system stability.

### When to Consider Resource Limiting

You should consider implementing resource constraints for the IPFS container if:

- System monitoring shows the IPFS container regularly using more than 70-80% of available CPU
- The server becomes unresponsive or significantly slows down during peak times
- Other critical services on the same host are starved of resources

To check resource usage:
```bash
# Monitor container resource usage in real-time
docker stats

# Or check with top and filter for ipfs processes
top -c | grep ipfs
```

### Limiting Memory and CPU Usage

If you determine that resource limiting is necessary, modify your `docker-compose.yml` file to add resource constraints for the IPFS container using the older Docker Compose syntax:

```yaml
services:
  ipfs:
     # ... other configurations ...
     environment:
        - IPFS_PROFILE=server
        - GOMAXPROCS=4  # 50% of total CPU cores amount
        - GOMEMLIMIT=23500MiB # 25% of total RAM memory minus 500MB
     # ... other configurations ...
     command: [... command specification ...]
     cpus: 4.0 # 50% of total CPU cores amount
     mem_limit: 24G # 25% of total RAM memory
     memswap_limit: 24G # Same amount than up
```

### Optimizing IPFS Configuration

Edit your `kubo.json` file to adjust IPFS resource usage:

```json
{
  "Datastore": {
    "GCPeriod": "12h"
  },
  "Swarm": {
    "ConnMgr": {
      "LowWater": 200,
      "HighWater": 500
    }
  }
}
```

The above settings:
- Run garbage collection every 12 hours
- Manage connection count between 200 and 500

## Node Synchronization Issues

### Checking Sync Status

Check if your node is properly synchronized:

```bash
# Check the node's sync status
curl -s http://localhost:4024/api/v0/info/public.json | jq '.sync_status'
```

### Resyncing a Node

If your node is out of sync or having persistent issues, you can perform a complete resynchronization:

1. Stop the node services:
   ```bash
   docker-compose down
   ```

2. Remove Database, IPFS and PyAleph data directories (prune volumes not used):
   ```bash
   docker volume prune -f
   ```

3. Restart the node:
   ```bash
   docker-compose up -d
   ```

4. Monitor the synchronization process:
   ```bash
   docker-compose logs -f
   ```

## Network Connectivity Issues

### Checking Port Accessibility

Verify that your node's ports are accessible from the internet:

```bash
# From another machine, check if the ports are open
nc -zv YOUR_NODE_IP 4001
nc -zv YOUR_NODE_IP 4024
nc -zv YOUR_NODE_IP 4025
```

### Firewall Configuration

If ports are not accessible, check your firewall settings:

```bash
# For UFW (Ubuntu/Debian)
sudo ufw status
sudo ufw allow 4001/tcp
sudo ufw allow 4001/udp
sudo ufw allow 4024/tcp
sudo ufw allow 4025/tcp
```

## Performance Monitoring

### Container Resource Usage

Monitor your containers' resource usage:

```bash
# View resource usage statistics
docker stats

# Install and use ctop for a better interface
docker run --rm -ti --name=ctop --volume /var/run/docker.sock:/var/run/docker.sock quay.io/vektorlab/ctop
```

### Checking Node Metrics

Access the node's metrics endpoint to check performance:

```bash
# Get general metrics
curl -s http://localhost:4024/metrics

# Filter for specific metrics
curl -s http://localhost:4024/metrics | grep messages
```

## Common Error Messages

### "Cannot connect to the Docker daemon"

This usually means Docker is not running or you don't have permission to access it.

**Solution:**
```bash
# Start Docker service
sudo systemctl start docker

# Check if your user is in the docker group
groups $(whoami)

# Add user to docker group if needed
sudo usermod -a -G docker $(whoami)
```

### "No space left on device"

This indicates your disk is full, often due to Docker using too much space.

**Solution:**
```bash
# Check available disk space
df -h

# Clean up Docker resources
docker system prune -a -f
```

### "Could not connect to Ethereum node"

Your node can't connect to the configured Ethereum API endpoint.

**Solution:**
1. Check your internet connection
2. Verify the API URL in your config.yml
3. Try an alternative Ethereum API provider

## Seeking Further Help

If you're still experiencing issues after trying these troubleshooting steps:

1. Visit the [Aleph.im Community](https://discord.gg/aleph-im) on Discord
2. Review the [Node Monitoring](/nodes/resources/management/monitoring/) documentation for additional diagnostic tools