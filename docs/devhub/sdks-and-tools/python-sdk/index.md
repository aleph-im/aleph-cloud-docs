# Python SDK

The Aleph Cloud Python SDK (`aleph-sdk-python`) provides a comprehensive set of tools for interacting with the Aleph Cloud network from Python applications. This guide covers installation, basic usage, and common patterns.

## Installation

```bash
pip install aleph-sdk-python
```

For development versions:

```bash
pip install git+https://github.com/aleph-im/aleph-sdk-python.git
```

## Client

| Client Type                         | Class                             | Use Case                               | Auth Required |
|------------------------------------|-----------------------------------|----------------------------------------|---------------|
| **HTTP Client (Authenticated)**    | `AuthenticatedAlephHttpClient`   | Send messages, upload files, etc.     | ✅ Yes         |
| **HTTP Client**         | `AlephHttpClient`                | Get Messages, get files, etc;           | ❌ No |
| **VM Client**                      | `VMClient`                       | Interact with Aleph Virtual Machines  | ✅ Yes         |
| **Confidential VM Client**         | `VMConfidentialClient`          | Interact with confidential VMs        | ✅ Yes         |

### Setting up a basic client
```python

from aleph.sdk.client import AlephHttpClient

async def main():
    async with AlephHttpClient() as client:
        # Use the client here
        pass

asyncio.run(main())
```

## Authentication

### Using a Private Key

```python

from aleph.sdk.chains.ethereum import ETHAccount
from aleph.sdk.client import AuthenticatedAlephHttpClient

# Create an account from a private key
private_key = "0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef"
account = ETHAccount(private_key)

# Create a client with this account
async with AuthenticatedAlephHttpClient(account=account) as client:
    # Use the client here
    pass
```

### Using a Mnemonic

```python
from aleph.sdk.chains.ethereum import ETHAccount

# Create an account from a mnemonic
mnemonic = "word1 word2 word3 word4 ... word12"
account = ETHAccount.from_mnemonic(mnemonic)

# Create a client with this account
async with AuthenticatedAlephHttpClient(account=account) as client:
    # Use the client here
    pass
```

### Using Other Chains

```python
# Solana
from aleph.sdk.chains.solana import SOLAccount
sol_account = SOLAccount(private_key)

# Substrate (Polkadot, Kusama, etc.)
from aleph.sdk.chains.substrate import DOTAccount
from aleph
dot_account = DOTAccount(private_key)

# Evm Chains (Avalanche, Base) mainly use for PAYG Features
from aleph.sdk.chains.evm import EVMAccount
from aleph_message.models import Chain

avax_account = EVMAccount(private_key=private_key, chain=Chain.AVAX) # With this account you can manage PAYG flow
```

 ### Using Ledger
````python
from aleph.sdk.wallet.ledger import LedgerAccount
from aleph.sdk.wallet.ledger.ethereum import get_fallback_account

account: LedgerETHAccount = get_fallback_account() # get the first account found on the device
````

## Core Clients
### Authenticated HTTP Client
The Authenticated HTTP Client `AuthenticatedAlephHttpClient` is the primary interface for creating and submitting signed messages to the Aleph.im network. It enables authenticated operations such as creating posts, storing files, deploying programs, launching virtual machines, and more.

#### Initialization
The `AuthenticatedAlephHttpClient` requires an `Account` object for signing messages. It can be initialized with several optional parameters to customize the API endpoint and connection settings:
```python
async with AuthenticatedAlephHttpClient(
    account=account,
    api_server="https://api1.aleph.im",  # Optional
    api_unix_socket=None,               # Optional
    allow_unix_sockets=True,            # Optional
    timeout=None,                       # Optional
    ssl_context=None                    # Optional
) as client:
    # Use the client....
```

#### Exemple Usage
##### Create Post Message
```python
# Store a simple message 
message, status = await client.create_store(
    "Hello, Aleph.im!",
    extra_fields= {"tags": ["example", "hello-world"]}
)

print(f"Stored message with hash: {result['item_hash']} Status: {status}")

# Store a JSON object
user_data = {
    "name": "John Doe",
    "email": "john@example.com",
    "age": 30
}

json_result, status = await client.create_store(
    user_data,
    extra_fields= {"tags": ["example", "hello-world"]}
)

print(f"Stored JSON with hash: {json_result['item_hash']}, Status: {status}")
```

##### Create Aggregate
```python   
# Create an aggregate (like a document in a database)
aggregate_result = await client.create_aggregate(
    'users',
    {'Andres' : {'email': 'john@example.com'}},
)

print(f"Aggregate created with key: {aggregate_result['key']}")

# Update an aggregate
updated_aggregate = await client.create_aggregate(
    'users',
    {'Andres' : {'age': 49}},
)
```
##### Upload File
```python
# Upload a file on ipfs
with open('example.pdf', 'rb') as f:
    file_content = f.read()
    
file_result = await client.create_store(
    file_content=file_content,
    guess_mime_type=True,
    extra_fields= {"tags": ["document", "pdf"], "file_name": "example.pdf"},
    storage_engine="ipfs" # Optional storage engine (default: "storage")
)

print(f"File stored with hash: {file_result['item_hash']}")

# Get a file from ipfs
ipfs_file_content = await client.download_file_ipfs('FileHash')

# Save the file
with open('downloaded_example.pdf', 'wb') as f:
    f.write(file_content)
```

##### Deploy a Program (On-demand Execution FaaS)
```python
from aleph.sdk.conf import settings
import tempfile  
from pathlib import Path  
import os

# Simple FastAPI program
program_code = """
from fastapi import FastAPI
from fastapi.requests import Request

app = FastAPI()

@app.get("/")
async def root(name: str = "World"):
    return {"message": f"Hello {name}"}
"""
# Upload the program code as a ZIP file
with tempfile.NamedTemporaryFile(suffix='.zip', delete=False) as temp_zip_file:  
    zip_path = temp_zip_file.name  
  
with zipfile.ZipFile(zip_path, 'w') as zip_file:  
    zip_file.writestr('main.py', program_code)  
  
# Upload the ZIP file  
store_message, _ = client.create_store(  
    file_path=Path(zip_path),  
    channel=settings.DEFAULT_CHANNEL  
)  

# Deploy the program to Aleph.im  
program_result, status = client.create_program(  
    program_ref=store_message.item_hash,  
    entrypoint="main:app",  # main.py file, app is the FastAPI instance  
    runtime=settings.DEFAULT_RUNTIME_ID,  
    memory=256,  
    timeout_seconds=10,  
    internet=True,  
    aleph_api=True,  # Required parameter
    #updatable=True,  # Make te program updatable
    #persistent=True,  # Make the program persistent
    metadata={  
        "name": "fastapi-hello",  
        "description": "A simple FastAPI app that returns a hello message"  
    }  
)
```

##### Deploy Qemu VM

```python
from aleph.sdk.conf import settings  

instance_result, status = await client.create_instance(  
    rootfs=settings.DEBIAN_12_QEMU_ROOTFS_ID,  # Use a pre-built Alpine Linux image  
    rootfs_size=20480,
    memory=1024,
    vcpus=1,
    internet=True,  
    aleph_api=True,  
    hypervisor=HypervisorType.qemu,  # Specify QEMU hypervisor  
    # Payment using hold method (default)  
    payment=Payment(  
        chain=Chain.ETH,  
        type=PaymentType.hold,  
        receiver=None  # Uses default receiver  
    ),  
    metadata={  
        "name": "alpine-vm",  
        "description": "A simple Alpine Linux VM with hold payment"  
    }
    #ssh_keys = ["ssh-rsa AAAAB3NzaC1yc2EAAAADAQABAAABAQC3..."] # Optional SSH keys for access
)  
```

## Resources

- [GitHub Repository](https://github.com/aleph-im/aleph-sdk-python)
- [PyPI Package](https://pypi.org/project/aleph-client/)
- [API Reference](/devhub/api-reference/rest)
- [Example Projects](/devhub/example-projects/web3-apps/)
