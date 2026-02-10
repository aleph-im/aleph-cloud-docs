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

| Client Type                     | Class                          | Use Case                             | Auth Required |
| ------------------------------- | ------------------------------ | ------------------------------------ | ------------- |
| **HTTP Client (Authenticated)** | `AuthenticatedAlephHttpClient` | Send messages, upload files, etc.    | ✅ Yes        |
| **HTTP Client**                 | `AlephHttpClient`              | Get Messages, get files, etc;        | ❌ No         |
| **VM Client**                   | `VMClient`                     | Interact with Aleph Virtual Machines | ✅ Yes        |
| **Confidential VM Client**      | `VMConfidentialClient`         | Interact with confidential VMs       | ✅ Yes        |

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

For ledger use please ensure that udev rules for the devices are set:
https://github.com/LedgerHQ/udev-rules/

```python
from aleph.sdk.wallet.ledger import LedgerAccount
from aleph.sdk.wallet.ledger.ethereum import get_fallback_account

account: LedgerETHAccount = get_fallback_account() # get the first account found on the device
```

## Core Clients

### Authenticated HTTP Client

The Authenticated HTTP Client `AuthenticatedAlephHttpClient` is the primary interface for creating and submitting signed messages to the Aleph Cloud network. It enables authenticated operations such as creating posts, storing files, deploying programs, launching virtual machines, and more.

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
message, status = await client.create_post(
    "Hello, Aleph Cloud!",
    post_type="testtype",
    channel="MY_CHANNEL",
)

print(f"Stored message with hash: {result['item_hash']} Status: {status}")

# Store a JSON object
user_data = {
    "name": "John Doe",
    "email": "john@example.com",
    "age": 30
}

json_result, status = await client.create_post(
    user_data,
    post_type="testtype",
    channel="MY_CHANNEL",
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

# Deploy the program to Aleph Cloud
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

##### Forget a Message

```python
# Forget a message
client.forget_message(
    hashes=["0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef",
            "0xabcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890"
    ],
    reason="This message is no longer needed",
)
```

### HTTP Client

The `AlephHttpClient` class serves as the fundamental client for interacting with the Aleph Cloud network via HTTP. It provides core functionality for data retrieval operations, including fetching aggregates, downloading files, and retrieving messages without requiring authentication.

#### Initialization

```python
async with AlephHttpClient(
    api_server="https://api1.aleph.im",  # Optional
    api_unix_socket=None,               # Optional
    allow_unix_sockets=True,            # Optional
    timeout=None,                       # Optional
    ssl_context=None                    # Optional
) as client:
    # Use the client....
```

#### Exemple Usage

#### Message Operations

```python
# Get messages with filtering
messages_response = await client.get_messages(
    page_size=200,
    page=1,
    message_filter=MessageFilter(message_types=[MessageType.post]),
    ignore_invalid_messages=True
)

# Get a specific message
message = await client.get_message(item_hash="MESSAGE_HASH")

# Get a message with its status
message, status = await client.get_message(item_hash="MESSAGE_HASH", with_status=True)

# Watch messages in real-time
async for message in client.watch_messages(message_filter=MessageFilter(channels=["CHANNEL_NAME"])):
    process_message(message)
```

##### Fetching Aggregates

Aggregates are key-value data structures associated with an address on the Aleph network.

```python
# Fetch a single aggregate key
data = await client.fetch_aggregate(address="0xa1B3bb7d2332383D96b7796B908fB7f7F3c2Be10", key="corechannel")

# Fetch multiple aggregate keys
data = await client.fetch_aggregates(address="0xa1B3bb7d2332383D96b7796B908fB7f7F3c2Be10", keys=["key1", "key2"])
```

##### Retrieving Posts

Posts are content messages published to the Aleph network. The client provides filtering and pagination capabilities.

```python
# Retrieve posts with filtering
posts_response = await client.get_posts(
    page_size=200,
    page=1,
    post_filter=PostFilter(channels="CHANNEL_NAME", tags=["tag1"]),
    ignore_invalid_messages=True
)
```

##### Downloading Files

The client provides multiple methods for downloading files from the Aleph storage layer:

```python
# Download a file to memory
file_content = await client.download_file(file_hash="QmeomffUNfmQy76CQGy9NdmqEnnHU9soCexBnGU3ezPHVH")

# Download a file to disk
file_path = await client.download_file_to_path(
    file_hash="QmeomffUNfmQy76CQGy9NdmqEnnHU9soCexBnGU3ezPHVH",
    path="downloaded_file.txt"
)

# Download a file to a custom buffer
buffer = BytesIO()
await client.download_file_to_buffer(
    file_hash="QmeomffUNfmQy76CQGy9NdmqEnnHU9soCexBnGU3ezPHVH",
    output_buffer=buffer
)

# Download an IPFS file
ipfs_content = await client.download_file_ipfs(file_hash="QmeomffUNfmQy76CQGy9NdmqEnnHU9soCexBnGU3ezPHVH")
```

##### Pricing

The client can fetch price estimates for program and instance deployment:

```python
executable_content = make_instance_content(
    rootfs="ROOTFS_HASH",  # Hash of your rootfs file
    rootfs_size=10240,  # Size in MB
    # Optional parameters:
    vcpus=1,
    memory=2048,
    timeout_seconds=30.0,
    internet=True,
    aleph_api=True,
    environment_variables={"ENV_VAR": "value"}
)

# Get price estimate for a program/instance
price_response = await client.get_estimated_price(content=executable_content)

# Get price for an existing program
price_response = await client.get_program_price(item_hash="PROGRAM_HASH")
```

##### Message Status and Content

Check message status or retrieve stored content:

```python
# Get message status
status = await client.get_message_status(item_hash="MESSAGE_HASH")

# Get error information for a message
error = await client.get_message_error(item_hash="MESSAGE_HASH")

# Get content from a store message
content = await client.get_stored_content(item_hash="STORE_MESSAGE_HASH")
```

### VmClient

The VM Client (`VMClient``) provides an interface for managing Aleph Cloud virtual machines, allowing you to control VM instances that have been deployed to the network. This includes operations such as starting, stopping, rebooting, and retrieving logs from VMs.

#### VM Client Types

| Client Type            | Class                  | Use Case                            | Auth Required |
| ---------------------- | ---------------------- | ----------------------------------- | ------------- |
| VM Client              | `VMClient`             | Control and manage Aleph VMs        | ✅ Yes        |
| Confidential VM Client | `VMConfidentialClient` | Control and manage confidential VMs | ✅ Yes        |

#### Basic VM Client

##### Initialization

```python
from aleph.sdk.chains.ethereum import ETHAccount
from aleph.sdk.client.vm_client import VmClient
from aleph.sdk.conf import settings

# Create an account
account = ETHAccount(settings.PRIVATE_KEY_FILE.read_bytes())

# Initialize the VM client with your account and the node URL
async with VmClient(
    account=account,
    node_url="https://api2.aleph.im"
) as vm_client:
    # Use the client here
    pass
```

##### Example Usage

Starting a VM Instance

```python
# Notify the allocation of a VM by its ID (starts the VM)
vm_id = ItemHash("cafecafecafecafecafecafecafecafecafecafecafecafecafecafecafecafe")
status, response = await vm_client.start_instance(vm_id)
print(f"VM start status: {status}, response: {response}")
```

Stopping a VM Instance

```python
# Stop a running VM instance
vm_id = ItemHash("cafecafecafecafecafecafecafecafecafecafecafecafecafecafecafecafe")
status, response = await vm_client.stop_instance(vm_id)
print(f"VM stop status: {status}, response: {response}")
```

Rebooting a VM Instance

```
# Reboot a running VM instance
vm_id = ItemHash("cafecafecafecafecafecafecafecafecafecafecafecafecafecafecafecafe")
status, response = await vm_client.reboot_instance(vm_id)
print(f"VM reboot status: {status}, response: {response}")
```

Erasing a VM Instance

```python
# Erase a VM instance (deletes the VM's state and data)
vm_id = ItemHash("cafecafecafecafecafecafecafecafecafecafecafecafecafecafecafecafe")
status, response = await vm_client.erase_instance(vm_id)
print(f"VM erase status: {status}, response: {response}")
```

Expiring a VM Instance

```python
# Expire a VM instance (marks it as expired)
vm_id = ItemHash("cafecafecafecafecafecafecafecafecafecafecafecafecafecafecafecafe")
status, response = await vm_client.expire_instance(vm_id)
print(f"VM expire status: {status}, response: {response}")
```

Getting VM Logs

```python
# Stream logs from a VM in real-time
vm_id = ItemHash("cafecafecafecafecafecafecafecafecafecafecafecafecafecafecafecafe")
async for log_entry in vm_client.get_logs(vm_id):
    print(f"Log: {log_entry}")
```

#### Confidential VM Client

The `VmConfidentialClient` extends the basic `VmClient` to work with confidential computing VMs. These VMs use hardware-based security features to protect data and computation, providing enhanced security for sensitive workloads.

##### Initialization

```python
from aleph.sdk.chains.ethereum import ETHAccount
from aleph.sdk.conf import settings
from aleph.sdk.client.vm_confidential_client import VmConfidentialClient
from pathlib import Path

# Create an account
account = ETHAccount(private_key=settings.PRIVATE_KEY_FILE.read_bytes())

# Path to the sevctl tool for confidential computing operations
sevctl_path = Path("/usr/bin/sevctl")

# Initialize the confidential VM client
async with VmConfidentialClient(
    account=account,
    sevctl_path=sevctl_path,
    node_url="https://api2.aleph.im"
) as vm_client:
    # Use the client here
    pass
```

##### Example Usage

Getting VM Certificates

```python
# Get the platform confidential certificates
status, cert_path = await vm_client.get_certificates()
if status == 200:
    print(f"Retrieved certificates at: {cert_path}")
```

Creating a Confidential Session

```python
from pathlib import Path

# Create a confidential session
certificate_prefix = "my_vm_session"
platform_certificate_path = Path("/path/to/certificates")
policy = 1  # Policy value for the confidential session

session_path = await vm_client.create_session(
    certificate_prefix=certificate_prefix,
    platform_certificate_path=platform_certificate_path,
    policy=policy
)
print(f"Created session at: {session_path}")
```

Initializing a Confidential VM

```python
# Initialize a confidential VM with a session
vm_id = ItemHash("cafecafecafecafecafecafecafecafecafecafecafecafecafecafecafecafe")
session_path = Path("/path/to/session")
godh_path = Path("/path/to/godh")

initialization_result = await vm_client.initialize(
    vm_id=vm_id,
    session=session_path,
    godh=godh_path
)
print(f"Initialization result: {initialization_result}")
```

Getting VM Measurement

```python
# Get the confidential measurement of a VM
vm_id = ItemHash("cafecafecafecafecafecafecafecafecafecafecafecafecafecafecafecafe")
measurement = await vm_client.measurement(vm_id)
print(f"VM measurement: {measurement}")
```

Validating VM Measurement

```python
# Validate a VM's confidential measurement against expected values
from pathlib import Path

vm_id = ItemHash("cafecafecafecafecafecafecafecafecafecafecafecafecafecafecafecafe")
measurement = await vm_client.measurement(vm_id)

tik_path = Path("/path/to/tik")
firmware_hash = "firmware_hash_value"

is_valid = await vm_client.validate_measure(
    sev_data=measurement,
    tik_path=tik_path,
    firmware_hash=firmware_hash
)
print(f"Measurement is valid: {is_valid}")
```

Building and Injecting Secrets

```python
# Build and inject a secret into a confidential VM
from pathlib import Path

vm_id = ItemHash("cafecafecafecafecafecafecafecafecafecafecafecafecafecafecafecafe")
measurement = await vm_client.measurement(vm_id)

tek_path = Path("/path/to/tek")
tik_path = Path("/path/to/tik")
secret = "my_confidential_secret"

# Build the encrypted secret
packet_header, encrypted_secret = await vm_client.build_secret(
    tek_path=tek_path,
    tik_path=tik_path,
    sev_data=measurement,
    secret=secret
)

# Inject the secret into the confidential VM
result = await vm_client.inject_secret(
    vm_id=vm_id,
    packet_header=packet_header,
    secret=encrypted_secret
)
print(f"Secret injection result: {result}")
```

## Advanced Usage

### Batch Operations

```python
# Batch store multiple messages
messages = [
    {"content": "Message 1", "tags": ["batch", "test"]},
    {"content": "Message 2", "tags": ["batch", "test"]},
    {"content": "Message 3", "tags": ["batch", "test"]}
]

async def store_batch(messages):
    tasks = []
    for msg in messages:
        task = client.create_store(msg["content"], tags=msg["tags"])
        tasks.append(task)

    results = await asyncio.gather(*tasks)
    return results

batch_results = await store_batch(messages)
for result in batch_results:
    print(f"Stored message with hash: {result['item_hash']}")
```

## Custom Message Types

```python
# Create a custom message type
custom_result = await client.create_post(
    post_type="custom_type",
    content={"key1": "value1", "key2": "value2"},
    tags=["custom", "example"]
)

print(f"Custom message hash: {custom_result['item_hash']}")

# Query custom message types
custom_messages = await client.get_messages(
    post_types=["custom_type"],
    tags=["custom"],
    limit=10
)

for msg in custom_messages:
    print(f"{msg['item_hash']}: {msg['content']}")
```

## Error Handling

```python
from aleph_sdk_python.exceptions import AlephClientError, MessageNotFoundError

try:
    message = await client.get_message('NonExistentHash')
except MessageNotFoundError:
    print("Message not found")
except AlephClientError as e:
    print(f"Client error: {e}")
except Exception as e:
    print(f"Unexpected error: {e}")
```

## Web Framework Integration

### FastAPI Example

```python
from fastapi import FastAPI, HTTPException
from aleph.sdk.chains.ethereum import ETHAccount
from aleph.sdk.conf import settings
from aleph.sdk.client import AuthenticatedAlephHttpClient, AlephHttpClient
from pydantic import BaseModel

# Create an account
account = ETHAccount(private_key=settings.PRIVATE_KEY_FILE.read_bytes())

app = FastAPI()
class User(BaseModel):
    name: str
    email: str
    age: int = None

@app.post("/users/")
async def create_user(user: User):
    try:
        async with AuthenticatedAlephHttpClient(account=account) as client:
            # Create a new user in the aggregate
            result = await client.create_aggregate(
                'users',
                user.dict(),
                key=user.email
            )
            return {"key": result['key'], "hash": result['item_hash']}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/users/{email}")
async def get_user(email: str):
    try:
        async with AlephHttpClient() as client:
            user = await client.fetch_aggregate('users', email)
            if not user:
                raise HTTPException(status_code=404, detail="User not found")
            return user
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
```

## Custom Services

### Scheduler

Get scheduler plan

```python
from aleph.sdk.types import SchedulerPlan
data: SchedulerPlan  = await client.scheduler.get_plan() # get info about all the VM (where should they be scheduled)
```

Get node used by scheduler

```python
from aleph.sdk.types import SchedulerNodes
node_info: SchedulerNodes = await client.scheduler.get_node()
```

Get allocations of an Hold instance

```python
from aleph.sdk.types import AllocationItem
from aleph_message.models import ItemHash
allocation: AllocationItem = await client.scheduler.get_allocation(
    ItemHash("ItemHASH")
)
```

### CRN

Get Last version of aleph-cm

```python
crn_version = client.crn.get_last_crn_version()
```

# Get list of CRN

```python
crn_list = client.crn.get_crns_list(only_active=False) # Default to True
```

Get Executions info of a vm

```python
from aleph_message.models import ItemHash
from aleph.sdk.types import CrnExecutionV2, CrnExecutionV1
from typing import Optional, Union
vm: Optional[Union[CrnExecutionV1, CrnExecutionV2]] = client.crn.get_vm(
    crn_address="address", item_hash=ItemHash("item_hash")
)
```

Update Crn Instance config

```python
# This will 'ask' crn to refresh config of the instance (exemple after adding a new ports)
await client.crn.update_instance_config(crn_address='URL', item_hash="itemhash")
```

### Instance

Get all instances / allocations / executions for a specific address

```python
instance: List[InstanceMessage] = await client.utils.get_instances("address")
allocations = await client.utils.get_instances_allocations(instance)
executions = await client.utils.get_instance_executions_info(allocations)
```

### DNS

Get DNS for instances

```python
    from aleph_message.models import ItemHash
    from aleph.sdk.types import Dns
    from typing import List, Optional

    dnsList: List[Dns] = await client.dns.get_public_dns() # Get all Dns

    dns: Optional[Dns] = await client.dns.get_dns_for_instance(item_hash=ItemHash('item_hash'))

    # Find DNS for a specific host
    dns = await client.dns.get_public_dns_by_host('host_name')
```

### Port-Forwarder

Get Ports Info

```python
from aleph_message.models import ItemHash
from aleph.sdk.types import Ports
# AlephHttpClient
ports = await client.port_forwarder.get_address_ports('address')
port: Optional[Ports] = await client.port_forwarder.get_ports('address', ItemHash("item_hash"))

# AuthenticatedAlephHttpClient
ports = await client.port_forwarder.get_address_ports() # address is optional (taking account address)
port: Optional[Ports] = await client.port_forwarder.get_ports(ItemHash('item_hash')) # same
```

Create Port for an instances

```python
from aleph.sdk.types import Ports
from aleph_message.models import ItemHash
# AuthenticatedAlephHttpClient is required
ports = Ports(
    ports={
        80: PortFlags(tcp=True, udp=False),
        22: PortFlags(tcp=True, udp=False),
    }
)
message, status = await client.port_forwarder.create_ports(
    ItemHash("item_hash"),
    ports
)
```

Updates the Ports

```python
ports = Ports(
    ports={
        80: PortFlags(tcp=False, udp=True),
        22: None,
    }
)
message, status = await client.port_forwarder.update_ports(
    item_hash=ItemHash("Item_Hash"),
    ports=ports,
)

```

Remove all the ports for a VM

```python
    message, status = await.client.port_forwarder.delete_ports(
        item_hash=ItemHash("item_hash")
    )
```

### Voucher

Fetch Voucher by address

```python
    evm_voucher: list[Voucher] = await client.voucher.get_evm_vouchers("0x...")
    sol_voucher: list[Voucher] = await client.voucher.get_solana_vouchers("address")

    voucher: list[Voucher] = await client.voucher.get_vouchers(addres) # Will get voucher based on address if it evm or sol

    voucher: list[Voucher] = awaot client.voucher.fetch_vouchers_by_chain("address", Chain.ETH)

    for voucher in evem_voucher:
        metadata = await client.voucher.fetch_voucher_metadata(voucher.metadata_id)

```

# Resources

- [GitHub Repository](https://github.com/aleph-im/aleph-sdk-python)
- [PyPI Package](https://pypi.org/project/aleph-sdk-python/)
- [API Reference](/devhub/api/rest)
