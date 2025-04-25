# Instance Management

The `instance` command group allows you to create and manage full virtual machine instances on the Aleph.im network.

## Key Commands

| Command | Description |
|---------|-------------|
| `create` | Create a new VM instance |
| `update` | Update an existing instance |
| `show` | Display instance details |
| `list` | List your deployed instances |
| `ssh` | Connect to an instance via SSH |

## Creating an Instance

Deploy a full virtual machine:

```bash
# Create a basic instance
aleph instance create \
  --name my-instance \
  --system debian \
  --cpu 2 \
  --memory 2048

# Create with SSH key for access
aleph instance create \
  --name my-instance \
  --system ubuntu \
  --cpu 2 \
  --memory 2048 \
  --ssh-key "ssh-rsa AAAA..."
```

## Supported Operating Systems

Aleph.im provides several base images:

- `debian` - Debian Linux
- `ubuntu` - Ubuntu Linux
- `alpine` - Alpine Linux
- `custom` - Custom image (specify with `--image-hash`)

## Instance Resources

Configure computing resources for your instance:

```bash
# Specify CPU, memory, and storage
aleph instance create \
  --name my-instance \
  --system debian \
  --cpu 4 \
  --memory 4096 \
  --volume-size 20
```

## Specialized Instance Types

### GPU Instances

Create instances with GPU access:

```bash
# Create a GPU-enabled instance
aleph instance create \
  --name gpu-instance \
  --system ubuntu \
  --cpu 4 \
  --memory 8192 \
  --gpu-model nvidia-a100 \
  --gpu-count 1
```

### Confidential Instances

Deploy instances with enhanced security:

```bash
# Create a confidential computing instance
aleph instance create \
  --name secure-instance \
  --system ubuntu \
  --cpu 2 \
  --memory 4096 \
  --confidential
```

## Connecting to Instances

SSH into your running instance:

```bash
# Connect using the CLI
aleph instance ssh INSTANCE_HASH

# Get SSH connection details
aleph instance show INSTANCE_HASH --connection-info
```

## Managing Instances

```bash
# List all your instances
aleph instance list

# Show detailed information
aleph instance show INSTANCE_HASH

# Update an instance
aleph instance update INSTANCE_HASH \
  --cpu 4 \
  --memory 8192
```

## Payment Options

Aleph.im offers two payment models:

```bash
# Create with staking payment (default)
aleph instance create \
  --name my-instance \
  --system debian \
  --payment-method stake

# Create with Pay-As-You-Go
aleph instance create \
  --name my-instance \
  --system debian \
  --payment-method payg
```

## Advanced Configuration

### Custom Images

Use your own VM images:

```bash
# Create from custom image
aleph instance create \
  --name custom-instance \
  --system custom \
  --image-hash QmHash123456789
```

### Networking

Configure network settings:

```bash
# Expose specific ports
aleph instance create \
  --name web-server \
  --system debian \
  --cpu 2 \
  --memory 2048 \
  --open-ports 80,443
```

## Troubleshooting

Common issues and solutions:

- **Instance not starting**: Check resource allocation and system compatibility
- **SSH connection failures**: Verify your SSH key was properly added and the instance is running
- **Performance issues**: Consider increasing CPU, memory, or using a GPU instance
- **Payment errors**: Ensure you have sufficient ALEPH tokens for staking or PAYG balance
