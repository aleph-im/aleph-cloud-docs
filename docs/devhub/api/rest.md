# REST API

Aleph Cloud provides a comprehensive REST API that allows developers to interact with the network using standard HTTP requests. This documentation covers the available endpoints, request formats, and response structures.

## Base URL

All API endpoints are available at:

```
https://api2.aleph.cloud/api/v0/
```

For development and testing, you can also use:

```
https://api1.aleph.cloud/api/v0/
```

## Authentication

Some API endpoints require authentication. Aleph Cloud uses a signature-based authentication system where you sign a message with your private key and include the signature in your request.

### Authentication Process

1. Create a message object with your data
2. Add a timestamp and nonce for uniqueness
3. Sign the serialized message with your private key
4. Include your address and signature in the request

### Example Authentication (JavaScript)

```javascript
import { ethers } from 'ethers';

async function createAuthenticatedRequest(data, privateKey) {
  const wallet = new ethers.Wallet(privateKey);
  const address = wallet.address;
  
  // Create message with timestamp and nonce
  const message = {
    ...data,
    timestamp: Math.floor(Date.now() / 1000),
    nonce: Math.random().toString(36).substring(2, 15)
  };
  
  // Serialize the message
  const serialized = JSON.stringify(message);
  
  // Sign the message
  const signature = await wallet.signMessage(serialized);
  
  // Return the complete request
  return {
    message,
    signature,
    address
  };
}
```

## Messages API

The Messages API allows you to store and retrieve messages on the Aleph Cloud network.

### Get Message

Retrieves a specific message by its hash.

```
GET /messages/{hash}
```

#### Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| `hash` | string | The hash of the message to retrieve |

#### Response

```json
{
  "item_hash": "QmHash123",
  "chain": "ETH",
  "sender": "0x1234567890abcdef1234567890abcdef12345678",
  "type": "STORE",
  "channel": "ALEPH",
  "timestamp": 1620000000,
  "content": {
    "key1": "value1",
    "key2": "value2"
  },
  "signature": "0x...",
  "confirmations": [
    {
      "chain": "ETH",
      "height": 12345678,
      "hash": "0x..."
    }
  ]
}
```

### Query Messages

Retrieves messages based on various criteria.

```
GET /messages
```

#### Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| `hashes` | string | Comma-separated list of message hashes |
| `addresses` | string | Comma-separated list of sender addresses |
| `channels` | string | Comma-separated list of channels |
| `tags` | string | Comma-separated list of tags |
| `types` | string | Comma-separated list of message types (STORE, POST, AGGREGATE, etc.) |
| `content.keys` | string | Filter by content keys (JSON path) |
| `page` | integer | Page number for pagination |
| `limit` | integer | Number of results per page (default: 20, max: 100) |

#### Response

```json
{
  "messages": [
    {
      "item_hash": "QmHash123",
      "chain": "ETH",
      "sender": "0x1234567890abcdef1234567890abcdef12345678",
      "type": "STORE",
      "channel": "ALEPH",
      "timestamp": 1620000000,
      "content": {
        "key1": "value1",
        "key2": "value2"
      },
      "signature": "0x...",
      "confirmations": [
        {
          "chain": "ETH",
          "height": 12345678,
          "hash": "0x..."
        }
      ]
    },
    // More messages...
  ],
  "pagination": {
    "total": 42,
    "page": 1,
    "per_page": 20,
    "total_pages": 3
  }
}
```

### Create Message

Creates a new message on the network.

```
POST /messages
```

#### Request Body

```json
{
  "message": {
    "chain": "ETH",
    "channel": "ALEPH",
    "type": "STORE",
    "timestamp": 1620000000,
    "content": {
      "key1": "value1",
      "key2": "value2"
    }
  },
  "signature": "0x...",
  "address": "0x1234567890abcdef1234567890abcdef12345678"
}
```

#### Response

```json
{
  "item_hash": "QmHash123",
  "status": "success"
}
```

## Storage API

The Storage API allows you to store and retrieve files on the Aleph Cloud network.

### Store File

Uploads a file to the network.

```
POST /storage/store
```

#### Request

Use `multipart/form-data` to upload the file:

| Parameter | Type | Description |
|-----------|------|-------------|
| `file` | file | The file to upload |
| `address` | string | Your address |
| `signature` | string | Signature of the file hash |
| `channel` | string | Channel (default: "ALEPH") |
| `tags` | string | Comma-separated list of tags |

#### Response

```json
{
  "item_hash": "QmFileHash123",
  "status": "success"
}
```

### Get File

Retrieves a file by its hash.

```
GET /storage/{hash}
```

#### Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| `hash` | string | The hash of the file to retrieve |

#### Response

The file content with appropriate Content-Type header.

## Aggregates API

The Aggregates API allows you to work with structured data similar to a document database.

### Get Aggregate

Retrieves an aggregate by its key.

```
GET /aggregates/{address}/{key}
```

#### Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| `address` | string | The address of the aggregate owner |
| `key` | string | The key of the aggregate |

#### Response

```json
{
  "key": "my-aggregate",
  "address": "0x1234567890abcdef1234567890abcdef12345678",
  "content": {
    "field1": "value1",
    "field2": "value2"
  },
  "time": 1620000000,
  "item_hash": "QmAggregateHash123"
}
```

### Query Aggregates

Retrieves aggregates based on various criteria.

```
GET /aggregates
```

#### Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| `address` | string | Filter by owner address |
| `key` | string | Filter by key |
| `keys` | string | Comma-separated list of keys |
| `content.fields` | string | Filter by content fields (JSON path) |
| `page` | integer | Page number for pagination |
| `limit` | integer | Number of results per page (default: 20, max: 100) |

#### Response

```json
{
  "aggregates": [
    {
      "key": "my-aggregate-1",
      "address": "0x1234567890abcdef1234567890abcdef12345678",
      "content": {
        "field1": "value1",
        "field2": "value2"
      },
      "time": 1620000000,
      "item_hash": "QmAggregateHash123"
    },
    // More aggregates...
  ],
  "pagination": {
    "total": 42,
    "page": 1,
    "per_page": 20,
    "total_pages": 3
  }
}
```

### Create/Update Aggregate

Creates or updates an aggregate.

```
POST /aggregates
```

#### Request Body

```json
{
  "message": {
    "chain": "ETH",
    "channel": "ALEPH",
    "type": "AGGREGATE",
    "timestamp": 1620000000,
    "content": {
      "key": "my-aggregate",
      "address": "0x1234567890abcdef1234567890abcdef12345678",
      "content": {
        "field1": "value1",
        "field2": "value2"
      }
    }
  },
  "signature": "0x...",
  "address": "0x1234567890abcdef1234567890abcdef12345678"
}
```

#### Response

```json
{
  "item_hash": "QmAggregateHash123",
  "status": "success"
}
```

## Programs API

The Programs API allows you to deploy and execute serverless functions on the Aleph Cloud network.

### Deploy Program

Deploys a new program to the network.

```
POST /programs
```

#### Request Body

```json
{
  "message": {
    "chain": "ETH",
    "channel": "ALEPH",
    "type": "PROGRAM",
    "timestamp": 1620000000,
    "content": {
      "name": "my-program",
      "description": "A simple program",
      "code": "export default function(req) { return { message: 'Hello, World!' }; }",
      "runtime": "nodejs16",
      "memory": 128,
      "timeout": 10
    }
  },
  "signature": "0x...",
  "address": "0x1234567890abcdef1234567890abcdef12345678"
}
```

#### Response

```json
{
  "item_hash": "QmProgramHash123",
  "status": "success"
}
```

### Execute Program

Executes a program with the provided input.

```
POST /run/{program_hash}
```

#### Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| `program_hash | string | The hash of the program to execute |

#### Request Body

```json
{
  "variables": {
    "key1": "value1",
    "key2": "value2"
  }
}
```

#### Response

The response depends on the program's output.

```json
{
  "message": "Hello, World!"
}
```

## Instances API

The Instances API allows you to manage virtual machines on the Aleph Cloud network.

### Create Instance

Creates a new virtual machine instance.

```
POST /instances
```

#### Request Body

```json
{
  "message": {
    "chain": "ETH",
    "channel": "ALEPH",
    "type": "INSTANCE",
    "timestamp": 1620000000,
    "content": {
      "name": "my-vm",
      "description": "A simple VM",
      "cpu": 2,
      "memory": 4,
      "disk": 20,
      "image": "debian:11",
      "ssh_key": "ssh-rsa AAAAB3NzaC1yc2E...",
      "firewall": {
        "allowedPorts": [22, 80, 443]
      }
    }
  },
  "signature": "0x...",
  "address": "0x1234567890abcdef1234567890abcdef12345678"
}
```

#### Response

```json
{
  "item_hash": "QmInstanceHash123",
  "instance_id": "instance-123",
  "ipv6": "2001:db8::1",
  "status": "success"
}
```

### Get Instance

Retrieves information about a specific instance.

```
GET /instances/{instance_id}
```

#### Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| `instance_id | string | The ID of the instance to retrieve |

#### Response

```json
{
  "instance_id": "instance-123",
  "owner": "0x1234567890abcdef1234567890abcdef12345678",
  "name": "my-vm",
  "description": "A simple VM",
  "cpu": 2,
  "memory": 4,
  "disk": 20,
  "image": "debian:11",
  "ipv6": "2001:db8::1",
  "status": "running",
  "created_at": 1620000000,
  "updated_at": 1620001000
}
```

### List Instances

Lists instances owned by an address.

```
GET /instances
```

#### Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| `address` | string | Filter by owner address |
| `status` | string | Filter by status (running, stopped, etc.) |
| `page` | integer | Page number for pagination |
| `limit` | integer | Number of results per page (default: 20, max: 100) |

#### Response

```json
{
  "instances": [
    {
      "instance_id": "instance-123",
      "owner": "0x1234567890abcdef1234567890abcdef12345678",
      "name": "my-vm",
      "description": "A simple VM",
      "cpu": 2,
      "memory": 4,
      "disk": 20,
      "image": "debian:11",
      "ipv6": "2001:db8::1",
      "status": "running",
      "created_at": 1620000000,
      "updated_at": 1620001000
    },
    // More instances...
  ],
  "pagination": {
    "total": 42,
    "page": 1,
    "per_page": 20,
    "total_pages": 3
  }
}
```

### Update Instance

Updates an existing instance.

```
PUT /instances/{instance_id}
```

#### Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| `instance_id` | string | The ID of the instance to update |

#### Request Body

```json
{
  "message": {
    "chain": "ETH",
    "channel": "ALEPH",
    "type": "INSTANCE_UPDATE",
    "timestamp": 1620000000,
    "content": {
      "instance_id": "instance-123",
      "name": "updated-vm",
      "description": "An updated VM",
      "firewall": {
        "allowedPorts": [22, 80, 443, 8080]
      }
    }
  },
  "signature": "0x...",
  "address": "0x1234567890abcdef1234567890abcdef12345678"
}
```

#### Response

```json
{
  "item_hash": "QmUpdateHash123",
  "status": "success"
}
```

### Control Instance

Controls the state of an instance (start, stop, restart).

```
POST /instances/{instance_id}/control
```

#### Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| `instance_id` | string | The ID of the instance to control |

#### Request Body

```json
{
  "message": {
    "chain": "ETH",
    "channel": "ALEPH",
    "type": "INSTANCE_CONTROL",
    "timestamp": 1620000000,
    "content": {
      "instance_id": "instance-123",
      "action": "stop"  // "start", "stop", or "restart"
    }
  },
  "signature": "0x...",
  "address": "0x1234567890abcdef1234567890abcdef12345678"
}
```

#### Response

```json
{
  "item_hash": "QmControlHash123",
  "status": "success"
}
```

## IPFS API

The IPFS API allows you to interact with IPFS through Aleph Cloud.

### Pin IPFS Content

Pins IPFS content to ensure it remains available.

```
POST /ipfs/pin
```

#### Request Body

```json
{
  "message": {
    "chain": "ETH",
    "channel": "ALEPH",
    "type": "IPFS_PIN",
    "timestamp": 1620000000,
    "content": {
      "hash": "QmHash123"
    }
  },
  "signature": "0x...",
  "address": "0x1234567890abcdef1234567890abcdef12345678"
}
```

#### Response

```json
{
  "item_hash": "QmPinHash123",
  "status": "success"
}
```

### Get IPFS Content

Retrieves content from IPFS.

```
GET /ipfs/{hash}
```

#### Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| `hash` | string | The IPFS hash of the content to retrieve |

#### Response

The content with appropriate Content-Type header.

## Indexer API

The Indexer API allows you to query blockchain data indexed by Aleph Cloud.

### Query Events

Queries blockchain events.

```
GET /indexer/{network}/events
```

#### Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| `network` | string | The blockchain network (ethereum, polygon, etc.) |
| `contract` | string | Filter by contract address |
| `event_name` | string | Filter by event name |
| `from_block` | integer | Filter from block number |
| `to_block` | integer | Filter to block number |
| `from_timestamp` | integer | Filter from timestamp |
| `to_timestamp` | integer | Filter to timestamp |
| `args` | object | Filter by event arguments |
| `page` | integer | Page number for pagination |
| `limit` | integer | Number of results per page (default: 20, max: 100) |

#### Response

```json
{
  "events": [
    {
      "transaction_hash": "0x...",
      "block_number": 12345678,
      "log_index": 42,
      "contract": "0x1234567890abcdef1234567890abcdef12345678",
      "event_name": "Transfer",
      "args": {
        "from": "0x0000000000000000000000000000000000000000",
        "to": "0x1234567890abcdef1234567890abcdef12345678",
        "value": "1000000000000000000"
      },
      "timestamp": 1620000000
    },
    // More events...
  ],
  "pagination": {
    "total": 42,
    "page": 1,
    "per_page": 20,
    "total_pages": 3
  }
}
```

### Query Transactions

Queries blockchain transactions.

```
GET /indexer/{network}/transactions
```

#### Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| `network` | string | The blockchain network (ethereum, polygon, etc.) |
| `address` | string | Filter by address (sender or receiver) |
| `from` | string | Filter by sender address |
| `to` | string | Filter by receiver address |
| `from_block` | integer | Filter from block number |
| `to_block` | integer | Filter to block number |
| `from_timestamp` | integer | Filter from timestamp |
| `to_timestamp` | integer | Filter to timestamp |
| `page` | integer | Page number for pagination |
| `limit` | integer | Number of results per page (default: 20, max: 100) |

#### Response

```json
{
  "transactions": [
    {
      "hash": "0x...",
      "block_number": 12345678,
      "from": "0x1234567890abcdef1234567890abcdef12345678",
      "to": "0x9876543210abcdef1234567890abcdef12345678",
      "value": "1000000000000000000",
      "gas": 21000,
      "gas_price": "20000000000",
      "timestamp": 1620000000
    },
    // More transactions...
  ],
  "pagination": {
    "total": 42,
    "page": 1,
    "per_page": 20,
    "total_pages": 3
  }
}
```

## VRF API

The VRF (Verifiable Random Function) API allows you to generate and verify random numbers.

### Generate Random Number

Generates a verifiable random number.

```
POST /vrf/generate
```

#### Request Body

```json
{
  "seed": "my-unique-seed-value",
  "min": 1,
  "max": 100,
  "count": 1
}
```

#### Response

```json
{
  "seed": "my-unique-seed-value",
  "value": 42,
  "proof": "0x...",
  "status": "success"
}
```

### Verify Random Number

Verifies a random number.

```
POST /vrf/verify
```

#### Request Body

```json
{
  "seed": "my-unique-seed-value",
  "value": 42,
  "proof": "0x..."
}
```

#### Response

```json
{
  "valid": true,
  "status": "success"
}
```

## Error Handling

All API endpoints return standard HTTP status codes:

- *200*: Success
- *400*: Bad Request (invalid parameters)
- *401*: Unauthorized (authentication required)
- *403*: Forbidden (insufficient permissions)
- *404*: Not Found (resource not found)
- *429*: Too Many Requests (rate limit exceeded)
- *500*: Internal Server Error

Error responses include a JSON body with details:

```json
{
  "error": "Error message",
  "status": "error",
  "code": "ERROR_CODE"
}
```

## Rate Limiting

The API implements rate limiting to ensure fair usage. Rate limits are applied per IP address and can vary by endpoint.

Current rate limits:

- General endpoints: 100 requests per minute
- Authentication-required endpoints: 300 requests per minute
- Heavy computation endpoints (like program execution): 10 requests per minute

If you exceed the rate limit, you'll receive a 429 status code with a Retry-After header indicating how many seconds to wait before retrying.

## Webhooks

Some operations support webhooks for asynchronous notifications:

```
POST /webhooks
```

#### Request Body

```json
{
  "message": {
    "chain": "ETH",
    "channel": "ALEPH",
    "type": "WEBHOOK",
    "timestamp": 1620000000,
    "content": {
      "url": "https://example.com/webhook",
      "events": ["message.new", "program.executed"],
      "secret": "your-webhook-secret"
    }
  },
  "signature": "0x...",
  "address": "0x1234567890abcdef1234567890abcdef12345678"
}
```

#### Response

```json
{
  "webhook_id": "webhook-123",
  "status": "success"
}
```

## SDKs

For easier integration, consider using one of the official SDKs:

- [TypeScript SDK](/devhub/sdks/typescript/)
- [Python SDK](/devhub/sdks/python/)
- [Other Languages](/devhub/sdks/other-languages/)
