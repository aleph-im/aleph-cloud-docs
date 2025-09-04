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
aleph file pin QmXoypizjW3WknFiJnKLwHCnL72vedxjQkDDP1mXWo6uco

# Pin a local file (uploads and pins)
# file > 4MB goes to ipfs other goes to storage engine
aleph file upload myfile.txt
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
from aleph.sdk import AuthenticatedAlephHttpClient
from aleph.sdk.chains.ethereum import ETHAccount
from aleph.sdk.types import StorageEnum,
async def pin_content():
    account = ETHAccount("....")
    
    async with AuthenticatedAlephHttpClient() as client:
        # Upload & Pin to IPFS
        result, status = await client.create_store(
            file_content=b"Hello World :)",
            storage_engine=StorageEnum.ipfs,
            channel="TEST",
            guess_mime_type=True,
        )
      # Pin an existing IPFS CID
      result, status = await client.create_store(
            file_hash="QmXoypizjW3WknFiJnKLwHCnL72vedxjQkDDP1mXWo6uco",
            storage_engine=StorageEnum.ipfs,
            channel="TEST",
            guess_mime_type=True,
        )
    
    print(f"Content pinned: {result}")
```

### Managing Pinned Content

#### Listing Pinned Content

```bash
# Using the CLI
aleph file list

# Using the REST API
curl "https://api2.aleph.im/api/v0/addresses/{address}/files"
```

#### Unpinning Content

```bash
# Using the CLI
aleph file forget item_hash1,item_hash2 # item hash of the store message not Ipfs CID / File hash

```
```py
# Using SDK
hashes = [ItemHash("item_hash")]
async with AuthenticatedAlephHttpClient(account=account, api_server=settings API_HOST) as client:
    result = await client.forget(hashes=hashes, reason=reason, channel=channel)
    print(result)
```


## Advanced Usage

### Pinning with Metadata

You can attach metadata to your pinned content for better organization:

```python
from aleph.sdk import AuthenticatedAlephHttpClient
from aleph.sdk.chains.ethereum import ETHAccount
from aleph.sdk.types import StorageEnum,
async def pin_content():
    account = ETHAccount("....")
    async with AuthenticatedAlephHttpClient() as client:
        # Pin an existing IPFS CID
        result, status = await client.create_store(
            file_hash="QmXoypizjW3WknFiJnKLwHCnL72vedxjQkDDP1mXWo6uco",
            storage_engine=StorageEnum.ipfs,
            channel="TEST",
            guess_mime_type=True,
            extra_fields={"add your metadata here"}
        )
    
    print(f"Content pinned: {result}")
```

## Integration with Other Aleph Cloud Services

### Using Pinned Content in VMs

You can use pinned IPFS content in your Aleph Cloud virtual machines:

```bash
# Deploy a VM that uses pinned content
aleph instance create \
  --name "web-server" \
  --vcpus 2 \
  --memory 4 \
  --rootfs_size 20480 \
  --immutable-volume mount=/opt/packages,ref=25a3...8d94
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
2. Join the [Aleph Cloud Discord](https://discord.com/invite/alephcloud) for community support
3. Contact support through the [Aleph Cloud website](https://aleph.cloud/contact)

## Next Steps

- [Storage Guide](/devhub/building-applications/data-storage/getting-started) - Learn more about Aleph Cloud's storage capabilities
- [Web3 Hosting](/devhub/deploying-and-hosting/web-hosting/) - Host websites using IPFS and Aleph Cloud
- [API Reference](/devhub/api/rest) - Documentation for the Aleph Cloud REST API
