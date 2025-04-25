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

## Storage

### Store Data

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

### Retrieve Data

```python
# Get a message by hash
message = await client.get_message('item_hash')
print(message['content'])

# Query messages with status 
messages, status = await client.get_messages(
    item_hash=item_hash,
    with_status=True
)
# Get 100 lasts messages
message = await client.get_messages(
    page_size=100,
    page=1,
    ignore_invalid_messages=True
)

for msg in messages:
    print(f"{msg['item_hash']}: {msg['content']}")
```

### File Storage

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

# Get a file
file_content = await client.download_file('FileHash')

# Get a file from ipfs
ipfs_file_content = await client.download_file_ipfs('FileHash')

# Save the file
with open('downloaded_example.pdf', 'wb') as f:
    f.write(file_content)

# Download file to path
await client.download_file_to_path('FileHash', 'downloaded_example.pdf')
```

## Aggregates (Document Storage)

```python
# Create an aggregate (like a document in a database)
aggregate_result = await client.create_aggregate(
    'users',
    {'name': 'John Doe', 'email': 'john@example.com'},
    key='john-doe'  # Optional key for easier retrieval
)

print(f"Aggregate created with key: {aggregate_result['key']}")

# Get an aggregate
user = await client.fetch_aggregate('users', 'john-doe')
print(user)

# Update an aggregate
updated_user = {**user, 'age': 31}  # Add or update fields
await client.update_aggregate('users', 'john-doe', updated_user)

# Query aggregates
users = await client.fetch_aggregates(
    'users',
    query={'age': {'$gt': 25}},
    limit=10
)

for user in users:
    print(f"{user['key']}: {user['name']}, {user['age']}")
```

## Computing

### On-demand Execution (FaaS)

```python
# Deploy a Python function
program_code = """
def process(req):
    name = req.get('name', 'World')
    return {'message': f'Hello, {name}!'}
"""

program_result = await client.create_program(
    program_code,
    runtime='python:3.9',
    memory=128,
    timeout=10,
    name='hello-world',
    description='A simple hello world function'
)

print(f"Function deployed with ID: {program_result['item_hash']}")

# Call the function
response = await client.run_program(
    program_result['item_hash'],
    variables={'name': 'Alice'}
)

print(response)  # {'message': 'Hello, Alice!'}
```

### Persistent Execution (VMs)

```python
# Deploy a VM
vm_result = await client.create_instance(
    name='web-server',
    description='A web server running on Aleph Cloud',
    cpu=2,
    memory=4,  # GB
    disk=20,    # GB
    image='debian:11',
    ssh_key='ssh-rsa AAAAB3NzaC1yc2E...',  # Your public SSH key
    firewall_rules=[
        {'port': 22, 'protocol': 'tcp'},
        {'port': 80, 'protocol': 'tcp'},
        {'port': 443, 'protocol': 'tcp'}
    ]
)

print(f"VM deployed with ID: {vm_result['instance_id']}")
print(f"IPv6 Address: {vm_result['ipv6']}")

# Get VM status
status = await client.get_instance_status(vm_result['instance_id'])
print(f"VM status: {status['state']}")
```

## Indexing

### Query Blockchain Events

```python
from aleph_sdk_python.indexer import IndexerClient

# Create an indexer client
indexer = IndexerClient()

# Query EVM events
events = await indexer.query_events(
    network='ethereum',
    contract='0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984',  # UNI token
    event_name='Transfer',
    limit=10
)

for event in events:
    print(f"Transfer: {event['args']['from']} -> {event['args']['to']}: {event['args']['value']}")

# Query transactions
transactions = await indexer.query_transactions(
    network='ethereum',
    address='0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984',
    limit=10
)

for tx in transactions:
    print(f"Transaction: {tx['hash']}, Value: {tx['value']}")
```

### WebSocket Subscriptions

```python
import asyncio
from aleph_sdk_python.indexer import IndexerWSClient

async def handle_event(event):
    print(f"New transfer: {event['args']['from']} -> {event['args']['to']}: {event['args']['value']}")

async def subscribe_to_events():
    ws_client = IndexerWSClient()
    
    # Connect to the WebSocket server
    await ws_client.connect()
    
    # Subscribe to Transfer events
    await ws_client.subscribe(
        network='ethereum',
        channel='events',
        contract='0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984',
        event_name='Transfer',
        callback=handle_event
    )
    
    # Keep the connection alive
    try:
        while True:
            await asyncio.sleep(1)
    finally:
        await ws_client.disconnect()

# Run the subscription
asyncio.run(subscribe_to_events())
```

## IPFS Integration

```python
# Pin an IPFS CID
pin_result = await client.pin_ipfs('QmHash123')
print(f"Pinned: {pin_result['success']}")

# Get content from IPFS
content = await client.ipfs_get('QmHash123')
```

## VRF (Verifiable Random Function)

```python
from aleph_sdk_python.vrf import generate_random, verify_random

# Generate a random number
random_result = await generate_random(
    client=client,
    seed="my-unique-seed-value",
    min_value=1,
    max_value=100,
    count=1
)

print(f"Random number: {random_result['value']}")
print(f"Verification proof: {random_result['proof']}")

# Verify the random number
is_valid = await verify_random(
    client=client,
    seed="my-unique-seed-value",
    value=random_result['value'],
    proof=random_result['proof']
)

print(f"Is valid: {is_valid}")
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

## Configuration

```python
# Custom configuration
client = AsyncClient(
    api_server='https://api2.aleph.im',
    api_port=443,
    channel='TEST',
    network_id='ETH'
)

# Using environment variables
# Set ALEPH_API_HOST, ALEPH_API_PORT, ALEPH_CHANNEL, ALEPH_ETH_PKEY in your environment
import os
os.environ['ALEPH_API_HOST'] = 'api2.aleph.im'
os.environ['ALEPH_CHANNEL'] = 'TEST'

# Client will use environment variables
client = AsyncClient()
```

## Web Framework Integration

### FastAPI Example

```python
from fastapi import FastAPI, HTTPException
from aleph_sdk_python.asynchronous import AsyncClient
from pydantic import BaseModel

app = FastAPI()
client = AsyncClient()

class User(BaseModel):
    name: str
    email: str
    age: int = None

@app.post("/users/")
async def create_user(user: User):
    try:
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
        user = await client.fetch_aggregate('users', email)
        if not user:
            raise HTTPException(status_code=404, detail="User not found")
        return user
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
```

### Django Example

```python
# views.py
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
import json
import asyncio
from aleph_sdk_python.asynchronous import AsyncClient

client = AsyncClient()

@csrf_exempt
def create_user(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            
            # Run async function in Django
            loop = asyncio.new_event_loop()
            asyncio.set_event_loop(loop)
            result = loop.run_until_complete(
                client.create_aggregate('users', data, key=data['email'])
            )
            loop.close()
            
            return JsonResponse({"key": result['key'], "hash": result['item_hash']})
        except Exception as e:
            return JsonResponse({"error": str(e)}, status=500)
    return JsonResponse({"error": "Method not allowed"}, status=405)
```

## Command Line Interface

The SDK includes a command-line interface for common operations:

```bash
# Store a message
aleph store "Hello, Aleph.im!" --tags example,hello-world

# Get a message
aleph get QmHash123

# Create an aggregate
aleph aggregate create users '{"name": "John Doe", "email": "john@example.com"}' --key john-doe

# Get an aggregate
aleph aggregate get users john-doe

# Pin IPFS content
aleph ipfs pin QmHash123

# Deploy a program
aleph program deploy my_function.py --runtime python:3.9 --name hello-world
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

### Custom Message Types

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

### Encryption

```python
from aleph_sdk_python.utils import encrypt_message, decrypt_message

# Encrypt a message for a specific recipient
recipient_public_key = "0x..."
encrypted_content = encrypt_message(
    {"sensitive": "data"},
    recipient_public_key
)

# Store the encrypted message
encrypted_result = await client.create_store(
    encrypted_content,
    tags=["encrypted", "private"]
)

# Retrieve and decrypt a message
encrypted_message = await client.get_message(encrypted_result['item_hash'])
decrypted_content = decrypt_message(
    encrypted_message['content'],
    account.private_key
)

print(f"Decrypted content: {decrypted_content}")
```

## Resources

- [GitHub Repository](https://github.com/aleph-im/aleph-sdk-python)
- [PyPI Package](https://pypi.org/project/aleph-client/)
- [API Reference](/devhub/api-reference/rest)
- [Example Projects](/devhub/example-projects/web3-apps/)
