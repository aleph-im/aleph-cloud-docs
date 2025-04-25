# Persistent Execution

Persistent execution on Aleph Cloud provides long-running virtual machines (VMs) that operate continuously, similar to traditional cloud VMs but in a decentralized environment. This guide explains how to use persistent execution for your applications.

## Overview

Persistent execution is ideal for:
- Web servers and APIs that need to be always available
- Databases and stateful applications
- Background processing services
- Applications that require continuous operation
- Services that need full operating system access

Your VM runs 24/7 on the Aleph Cloud network, maintained by Compute Resource Nodes (CRNs).

## How It Works

1. You deploy a VM instance to the Aleph Cloud network
2. The VM is assigned to a Compute Resource Node (CRN)
3. The VM runs continuously, accessible via its IPv6 address
4. You can SSH into the VM for management
5. Payment is made via ALEPH tokens (staking or streaming)

## Available VM Types

Aleph Cloud supports several VM configurations:

- **Standard VMs**: General-purpose Linux virtual machines
- **Confidential VMs**: Enhanced security VMs with memory and disk encryption
- **Custom VMs**: Specialized VMs with specific configurations

## Supported Operating Systems

The following base images are available:
- Debian (10, 11, 12)
- Ubuntu (20.04, 22.04)
- Alpine Linux
- Custom images (via QCOW2 format)

## Deploying a VM

::: code-group

```ts [TypeScript]
import { AlephHttpClient } from '@aleph-sdk/client';
import { ETHAccount } from '@aleph-sdk/core';

const aleph = new AlephHttpClient();

async function deployVM() {
  const result = await aleph.instance.create({
    name: 'my-web-server',
    description: 'A web server running on Aleph Cloud',
    cpu: 2,
    memory: 4, // GB
    disk: 20, // GB
    image: 'debian:12',
    sshKey: 'ssh-rsa AAAAB3NzaC1yc2E...', // Your public SSH key
    volumes: [], // Optional: attach persistent volumes
    firewall: {
      allowedPorts: [22, 80, 443]
    },
    payment: {
      chain: 'ETH',
      type: 'hold',
      amount: '100' // ALEPH tokens to stake
    }
  });
  
  console.log(`VM deployed with ID: ${result.instanceId}`);
  console.log(`IPv6 Address: ${result.ipv6}`);
  
  return result;
}
```

```python [Python]
from aleph_sdk_python.asynchronous import AsyncClient
from aleph_sdk_python.vm.instance import create_vm

async def deploy_vm():
    client = AsyncClient()
    
    vm_hash = await create_vm(
        client=client,
        cpu=2,
        memory=4,
        disk=20,
        image_name="debian:12",
        ssh_key="ssh-rsa AAAAB3NzaC1yc2E...",  # Your public SSH key
        allowed_ports=[22, 80, 443],
        payment_chain="ETH",
        payment_type="hold",
        payment_amount=100
    )
    
    print(f"VM deployed with hash: {vm_hash}")
    
    # Get VM details
    vm_details = await client.get_vm_instance(vm_hash)
    print(f"IPv6 Address: {vm_details.get('ipv6')}")
    
    return vm_hash
```
:::

### Using the CLI

```bash
aleph instance create \
  --name "my-web-server" \
  --cpu 2 \
  --memory 4 \
  --disk 20 \
  --image debian:12 \
  --ssh-key "ssh-rsa AAAAB3NzaC1yc2E..." \
  --allowed-ports 22,80,443 \
  --payment-chain ETH \
  --payment-type hold \
  --payment-amount 100
```

## Accessing Your VM

Once deployed, you can access your VM via SSH:

```bash
ssh root@<ipv6-address>
```

For Debian and most Linux distributions, the default user is `root`. For Ubuntu, the default user is `ubuntu`.

## Managing Your VM

### Checking VM Status

```typescript
// TypeScript
const status = await aleph.instance.status(instanceId);
console.log(status);
```

```python
# Python
status = await client.get_vm_instance(vm_hash)
print(status)
```

```bash
# CLI
aleph instance status <instance-id>
```

### Stopping a VM

```typescript
// TypeScript
await aleph.instance.stop(instanceId);
```

```python
# Python
await client.vm.stop(vm_hash)
```

```bash
# CLI
aleph instance stop <instance-id>
```

### Restarting a VM

```typescript
// TypeScript
await aleph.instance.restart(instanceId);
```

```python
# Python
await client.vm.restart(vm_hash)
```

```bash
# CLI
aleph instance restart <instance-id>
```

## Persistent Storage

You can attach persistent volumes to your VM for data that needs to survive VM restarts:

```typescript
// TypeScript
const volumeResult = await aleph.volume.create({
  name: 'data-volume',
  size: 50, // GB
});

const vmResult = await aleph.instance.create({
  // ... other VM parameters
  volumes: [
    {
      id: volumeResult.volumeId,
      mountPoint: '/data'
    }
  ]
});
```

```python
# Python
volume_hash = await client.create_volume(
    name="data-volume",
    size=50
)

vm_hash = await create_vm(
    # ... other VM parameters
    volumes=[
        {
            "id": volume_hash,
            "mount_point": "/data"
        }
    ]
)
```

## Cloud-Init Support

VMs support cloud-init for initial configuration. You can provide a cloud-init configuration when creating a VM:

```typescript
// TypeScript
const cloudConfig = `#cloud-config
packages:
  - nginx
  - git

runcmd:
  - systemctl enable nginx
  - systemctl start nginx
`;

const result = await aleph.instance.create({
  // ... other VM parameters
  cloudInit: cloudConfig
});
```

## Networking

### Firewall Configuration

By default, only SSH (port 22) is open. You can specify additional ports when creating the VM:

```bash
aleph instance create \
  # ... other parameters
  --allowed-ports 22,80,443,8080
```

### Domain Name Configuration

You can set up a domain name to point to your VM:

1. Create an AAAA record in your DNS settings pointing to your VM's IPv6 address
2. Configure your web server inside the VM to respond to that domain

## Best Practices

1. **Use SSH keys** for authentication (password authentication is disabled by default)
2. **Regularly update your VM** with security patches
3. **Back up important data** to persistent volumes or external storage
4. **Monitor resource usage** to ensure your VM has adequate resources
5. **Use cloud-init** for automated VM setup
6. **Implement proper firewall rules** to secure your VM
7. **Consider using confidential computing** for sensitive workloads

## Limitations

- **IPv6 only**: VMs are only accessible via IPv6
- **Resource limits**: Maximum configurations depend on available CRN resources
- **Payment required**: VMs require ALEPH token payment (staking or streaming)

## Next Steps

- [On-demand Execution](/devhub/computing/on-demand/) - For stateless functions
- [Confidential Computing](/devhub/computing/confidential/) - For enhanced security
- [Storage Guide](/devhub/guides/storage/) - Learn how to store data on Aleph Cloud
