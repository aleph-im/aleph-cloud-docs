# IPFS Pinning

Aleph Cloud provides a reliable IPFS pinning service that ensures your IPFS content remains accessible and persistent on the network. This guide explains how to use Aleph Cloud's IPFS pinning capabilities.

## Overview

IPFS (InterPlanetary File System) is a distributed system for storing and accessing files, websites, applications, and data. However, content on IPFS is only available when at least one node on the network is hosting it. Pinning ensures that your content stays available by keeping it stored on dedicated nodes.

Aleph Cloud's IPFS pinning service offers:

- Permanent storage for your IPFS content
- High availability through a network of distributed nodes
- Simple API and tools for pinning management
- Integration with Aleph Cloud's other decentralized services

## Getting Started

### Prerequisites

- An Aleph Cloud account
- ALEPH tokens for payment
- Your IPFS content hash (CID)

### Pinning Content

#### Using the Aleph Cloud Client

The simplest way to pin content is using the Aleph Cloud Client:

```bash
# Install the client if you haven't already
pip install aleph-client

# Pin an existing IPFS CID
aleph pin ipfs QmXoypizjW3WknFiJnKLwHCnL72vedxjQkDDP1mXWo6uco

# Pin a local file (uploads and pins)
aleph file upload myfile.txt --pin
```

#### Using the Web Console

1. Log in to the [Aleph Cloud Web Console](https://console.aleph.im)
2. Navigate to the "Storage" section
3. Click "Pin IPFS Content"
4. Enter the IPFS CID you want to pin
5. Confirm the pinning operation

#### Using the REST API

```bash
curl -X POST "https://api2.aleph.im/api/v0/storage/pin" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -d '{
    "cid": "QmXoypizjW3WknFiJnKLwHCnL72vedxjQkDDP1mXWo6uco"
  }'
```

#### Using the JavaScript SDK

```typescript
import { AlephHttpClient } from '@aleph-sdk/client';
import { ETHAccount } from '@aleph-sdk/core';

const aleph = new AlephHttpClient();

// Pin an existing IPFS CID
async function pinContent() {
  const result = await aleph.storage.pinIpfs('QmXoypizjW3WknFiJnKLwHCnL72vedxjQkDDP1mXWo6uco');
  console.log(`Content pinned: ${result.success}`);
}
```

#### Using the Python SDK

```python
from aleph_sdk_python.asynchronous import AsyncClient
from aleph_sdk_python.storage import pin_ipfs

async def pin_content():
    client = AsyncClient()
    
    # Pin an existing IPFS CID
    result = await pin_ipfs(
        client=client,
        cid="QmXoypizjW3WknFiJnKLwHCnL72vedxjQkDDP1mXWo6uco"
    )
    
    print(f"Content pinned: {result}")
```

### Managing Pinned Content

#### Listing Pinned Content

```bash
# Using the CLI
aleph pin list

# Using the REST API
curl "https://api2.aleph.im/api/v0/storage/pins" \
  -H "Authorization: Bearer YOUR_API_KEY"
```

#### Unpinning Content

```bash
# Using the CLI
aleph pin remove QmXoypizjW3WknFiJnKLwHCnL72vedxjQkDDP1mXWo6uco

# Using the REST API
curl -X DELETE "https://api2.aleph.im/api/v0/storage/pin/QmXoypizjW3WknFiJnKLwHCnL72vedxjQkDDP1mXWo6uco" \
  -H "Authorization: Bearer YOUR_API_KEY"
```

## Advanced Usage

### Pinning with Metadata

You can attach metadata to your pinned content for better organization:

```bash
aleph pin ipfs QmXoypizjW3WknFiJnKLwHCnL72vedxjQkDDP1mXWo6uco \
  --metadata '{"name": "Important Document", "category": "legal", "expires": "2025-12-31"}'
```

### Batch Pinning

For pinning multiple items at once:

```bash
aleph pin batch-ipfs QmHash1 QmHash2 QmHash3
```

### Scheduled Pinning

You can schedule content to be pinned at a specific time:

```bash
aleph pin ipfs QmXoypizjW3WknFiJnKLwHCnL72vedxjQkDDP1mXWo6uco \
  --schedule '2023-12-01T12:00:00Z'
```

### Conditional Pinning

Pin content only if certain conditions are met:

```bash
aleph pin ipfs QmXoypizjW3WknFiJnKLwHCnL72vedxjQkDDP1mXWo6uco \
  --if-size-below 100MB
```

## Integration with Other Aleph Cloud Services

### Using Pinned Content in VMs

You can use pinned IPFS content in your Aleph Cloud virtual machines:

```bash
# Deploy a VM that uses pinned content
aleph instance create \
  --name "web-server" \
  --cpu 2 \
  --memory 4 \
  --disk 20 \
  --image debian:11 \
  --cloud-init "
#cloud-config
runcmd:
  - curl -L https://ipfs.aleph.im/ipfs/QmXoypizjW3WknFiJnKLwHCnL72vedxjQkDDP1mXWo6uco -o /var/www/html/index.html
  - systemctl restart nginx
"
```

### Using Pinned Content in Programs

Access pinned content in your serverless functions:

```javascript
export default async function(req, context) {
  const { aleph } = context;
  
  // Fetch content from pinned IPFS CID
  const content = await aleph.ipfs.get('QmXoypizjW3WknFiJnKLwHCnL72vedxjQkDDP1mXWo6uco');
  
  return { content };
}
```

## Best Practices

1. **Pin Important Content**: Always pin critical content to ensure its availability
2. **Use Metadata**: Add descriptive metadata to make content management easier
3. **Monitor Usage**: Regularly check your pinned content and storage usage
4. **Clean Up**: Remove pins for content you no longer need
5. **Backup CIDs**: Keep a record of important CIDs separate from the pinning service

## Troubleshooting

### Common Issues

- **Content Not Available**: Ensure the CID is correct and the content exists on the IPFS network
- **Pinning Fails**: Check your account balance and network connection
- **Slow Access**: Content might be propagating through the network; try again later

### Getting Help

If you encounter issues with IPFS pinning:

1. Check the [Aleph Cloud documentation](/devhub/)
2. Join the [Aleph Cloud Discord](https://discord.gg/alephim) for community support
3. Contact support through the [Aleph Cloud website](https://aleph.im/contact)

## Next Steps

- [Storage Guide](/devhub/building-applications/data-storage/) - Learn more about Aleph Cloud's storage capabilities
- [Web3 Hosting](/tools/web3-hosting/) - Host websites using IPFS and Aleph Cloud
- [API Reference](/devhub/api-reference/rest) - Documentation for the Aleph Cloud REST API
