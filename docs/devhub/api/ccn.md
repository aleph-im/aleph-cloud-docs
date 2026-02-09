# CCN API Reference

The Core Channel Node (CCN) exposes a REST API for interacting with the Aleph Cloud network. This reference documents all available endpoints.

**API Version:** 0.9.3

## Base URL

Each CCN exposes the API on its HTTP port. The public API endpoints are:

```
https://api1.aleph.cloud
https://api2.aleph.cloud
```

::: tip
All `GET` endpoints also support the `HEAD` method with identical parameters and responses.
:::

## Messages

### List Messages

```
GET /api/v0/messages.json
```

Retrieves messages based on various filter criteria.

#### Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `msgType` | string | No | | Single message type filter. One of: `POST`, `AGGREGATE`, `STORE`, `PROGRAM`, `INSTANCE`, `FORGET` |
| `msgTypes` | string | No | | Comma-separated message types |
| `msgStatuses` | string | No | | Comma-separated message statuses |
| `addresses` | string | No | | Comma-separated addresses |
| `owners` | string | No | | Comma-separated owners |
| `refs` | string | No | | Comma-separated refs |
| `contentHashes` | string | No | | Comma-separated content hashes |
| `contentKeys` | string | No | | Comma-separated content keys |
| `contentTypes` | string | No | | Comma-separated content types |
| `chains` | string | No | | Comma-separated chains |
| `channels` | string | No | | Comma-separated channels |
| `tags` | string | No | | Comma-separated tags |
| `hashes` | string | No | | Comma-separated hashes |
| `startDate` | number | No | `0` | Start date (epoch timestamp) |
| `endDate` | number | No | `0` | End date (epoch timestamp) |
| `startBlock` | integer | No | `0` | Start block number |
| `endBlock` | integer | No | `0` | End block number |
| `pagination` | integer | No | `20` | Items per page (min: 0) |
| `page` | integer | No | `1` | Page number (min: 1) |
| `sortBy` | string | No | `time` | Sort field. One of: `time`, `tx-time` |
| `sortOrder` | integer | No | `-1` | Sort order: `-1` (descending) or `1` (ascending) |

#### Response

Returns a `PaginatedMessages` object containing `messages`, `pagination_per_page`, `pagination_page`, `pagination_total`, and `pagination_item`.

**Errors:** `422` Validation error

---

### Submit Message

```
POST /api/v0/messages
```

Submits a new message to the network.

#### Request Body (`application/json`)

| Field | Type | Required | Default | Description |
|-------|------|----------|---------|-------------|
| `message` | object | Yes | | The message object to submit |
| `sync` | boolean | No | `false` | Whether to process synchronously |

#### Response

Returns a `BroadcastStatus` object with a `status` field.

**Errors:** `422` Validation error

---

### Get Message

```
GET /api/v0/messages/{item_hash}
```

Retrieves a specific message by its item hash.

#### Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `item_hash` | string | Yes | The message item hash |

#### Response

Returns a `MessageWithStatus` object containing `status`, `item_hash`, and `reception_time`.

**Errors:** `404` Message not found

---

### Get Message Content

```
GET /api/v0/messages/{item_hash}/content
```

Retrieves the content of a specific message.

#### Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `item_hash` | string | Yes | The message item hash |

#### Response

Returns the message content as a JSON object.

**Errors:** `404` Message not found | `422` Invalid message type or status

---

### Get Message Status

```
GET /api/v0/messages/{item_hash}/status
```

Retrieves the processing status of a message.

#### Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `item_hash` | string | Yes | The message item hash |

#### Response

Returns a `MessageStatusInfo` object containing `status`, `item_hash`, and `reception_time`.

**Errors:** `404` Message not found

---

### List Message Hashes

```
GET /api/v0/messages/hashes
```

Retrieves a paginated list of message hashes.

#### Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `status` | string | No | | Filter by status |
| `page` | integer | No | `1` | Page number (min: 1) |
| `pagination` | integer | No | `20` | Items per page (min: 0) |
| `startDate` | number | No | `0` | Start date (epoch timestamp) |
| `endDate` | number | No | `0` | End date (epoch timestamp) |
| `sortOrder` | integer | No | `-1` | Sort order: `-1` or `1` |
| `hash_only` | boolean | No | `true` | Return only hashes |

#### Response

Returns a `MessageHashes` object containing `hashes`, `pagination_per_page`, `pagination_page`, `pagination_total`, and `pagination_item`.

**Errors:** `422` Validation error

---

## Aggregates

### Get Address Aggregate

```
GET /api/v0/aggregates/{address}.json
```

Retrieves the aggregate data for a specific address.

#### Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `address` | string (path) | Yes | | Account address |
| `keys` | string | No | | Comma-separated list of keys to filter |
| `limit` | integer | No | `1000` | Limit number of results |
| `with_info` | boolean | No | `false` | Include additional info |
| `value_only` | boolean | No | `false` | Return values only |

#### Response

Returns an `AddressAggregate` object containing `address`, `data`, and optionally `info`.

**Errors:** `404` No aggregate found for this address | `422` Validation error

---

### List Aggregates

```
GET /api/v0/aggregates
```

Retrieves a paginated list of aggregates.

#### Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `keys` | string | No | | Comma-separated list of keys |
| `addresses` | string | No | | Comma-separated list of addresses |
| `sortBy` | string | No | `last_modified` | Sort field |
| `sortOrder` | integer | No | `-1` | Sort order: `-1` or `1` |
| `pagination` | integer | No | `20` | Items per page (min: 1, max: 500) |
| `page` | integer | No | `1` | Page number (min: 1) |

#### Response

Returns a `PaginatedAggregates` object containing `aggregates`, `pagination_per_page`, `pagination_page`, `pagination_total`, and `pagination_item`.

**Errors:** `422` Validation error

---

## Posts

### List Posts (v0)

```
GET /api/v0/posts.json
```

Retrieves a paginated list of posts using the v0 format.

#### Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `addresses` | string | No | | Comma-separated sender addresses |
| `hashes` | string | No | | Comma-separated item hashes |
| `refs` | string | No | | Comma-separated refs |
| `types` | string | No | | Comma-separated post types |
| `tags` | string | No | | Comma-separated tags |
| `channels` | string | No | | Comma-separated channels |
| `startDate` | number | No | `0` | Start date (epoch timestamp) |
| `endDate` | number | No | `0` | End date (epoch timestamp) |
| `pagination` | integer | No | `20` | Items per page (min: 0) |
| `page` | integer | No | `1` | Page number (min: 1) |
| `sortBy` | string | No | `time` | Sort field. One of: `time`, `tx-time` |
| `sortOrder` | integer | No | `-1` | Sort order: `-1` or `1` |

#### Response

Returns a `PaginatedPosts` object containing `posts`, `pagination_per_page`, `pagination_page`, `pagination_total`, and `pagination_item`.

**Errors:** `422` Validation error

---

### List Posts (v1)

```
GET /api/v1/posts.json
```

Retrieves a paginated list of posts using the v1 format. Accepts the same parameters as [List Posts (v0)](#list-posts-v0).

---

## Storage

### Upload File

```
POST /api/v0/storage/add_file
```

Uploads a file to Aleph Cloud storage.

#### Request Body

Accepts `multipart/form-data` or `application/octet-stream`.

For `multipart/form-data`:

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `file` | binary | No | The file to upload |
| `metadata` | string | No | Metadata string |

For `application/octet-stream`: raw binary data.

#### Response

Returns a `FileUploadResponse` object with `status` and `hash`.

**Errors:** `400` Bad request | `402` Insufficient balance | `413` File too large

---

### Add JSON to Storage

```
POST /api/v0/storage/add_json
```

Uploads a JSON object to Aleph Cloud storage.

#### Request Body (`application/json`)

Any valid JSON object.

#### Response

Returns a `FileUploadResponse` object with `status` and `hash`.

---

### Get File by Hash

```
GET /api/v0/storage/{file_hash}
```

Retrieves a file by its hash (base64 encoded).

#### Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `file_hash` | string | Yes | The file hash |

#### Response

Returns a `StorageHashResponse` object with `status`, `hash`, `engine`, and `content` (base64-encoded).

**Errors:** `400` Invalid hash | `404` File not found

---

### Get Raw File by Hash

```
GET /api/v0/storage/raw/{file_hash}
```

Retrieves a file's raw binary content by its hash.

#### Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `file_hash` | string | Yes | The file hash |

#### Response

Returns the raw file content as `application/octet-stream`.

**Errors:** `400` Invalid hash | `404` File not found

---

### Get File Metadata by Message Hash

```
GET /api/v0/storage/by-message-hash/{message_hash}
```

Retrieves file metadata using the associated message hash.

#### Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `message_hash` | string | Yes | The message hash |

#### Response

Returns a `FileMetadataResponse` object with `ref`, `owner`, `file_hash`, `download_url`, and `size`.

**Errors:** `400` Invalid hash | `404` File not found

---

### Get File Metadata by Ref

```
GET /api/v0/storage/by-ref/{ref}
```

Retrieves file metadata using a reference string.

#### Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `ref` | string | Yes | The reference string |

#### Response

Returns a `FileMetadataResponse` object with `ref`, `owner`, `file_hash`, `download_url`, and `size`.

**Errors:** `400` Invalid parameters | `404` File not found

---

### Get File Pins Count

```
GET /api/v0/storage/count/{hash}
```

Retrieves the number of pins for a file.

#### Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `hash` | string | Yes | The file hash |

#### Response

Returns an integer representing the number of pins.

**Errors:** `400` No hash provided

---

## Accounts

### Address Stats (v0)

```
GET /api/v0/addresses/stats.json
```

Retrieves message count statistics per address.

#### Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `addresses[]` | array of strings | No | Array of addresses to look up |

#### Response

Returns an `AddressStatsV0` object — a map of addresses to stats with counts per message type (`messages`, `aggregate`, `forget`, `instance`, `post`, `program`, `store`).

---

### Address Stats (v1)

```
GET /api/v1/addresses/stats.json
```

Retrieves paginated address statistics with filtering and sorting.

#### Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `addressContains` | string | No | | Case-insensitive substring filter for addresses (max 66 chars) |
| `sortBy` | string | No | `total` | Sort field. One of: `post`, `aggregate`, `store`, `forget`, `program`, `instance`, `total` |
| `sortOrder` | integer | No | `-1` | Sort order: `-1` or `1` |
| `pagination` | integer | No | `20` | Items per page (min: 0) |
| `page` | integer | No | `1` | Page number (min: 1) |

#### Response

Returns a paginated `AddressStatsV1` object.

**Errors:** `422` Validation error

---

### Get Account Balance

```
GET /api/v0/addresses/{address}/balance
```

Retrieves the balance for an account.

#### Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `address` | string (path) | Yes | Account address |
| `chain` | string | No | Filter by EVM chain |

#### Response

Returns a `GetAccountBalanceResponse` object with `address`, `balance`, `details`, `locked_amount`, and `credit_balance`.

**Errors:** `422` Validation error

---

### Get Chain Balances

```
GET /api/v0/balances
```

Retrieves paginated balances across chains.

#### Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `chains` | string | No | | Comma-separated list of chains |
| `pagination` | integer | No | `100` | Items per page (min: 0) |
| `page` | integer | No | `1` | Page number (min: 1) |
| `min_balance` | integer | No | `0` | Minimum balance filter (min: 1) |

#### Response

Returns a `PaginatedBalances` object containing balance entries with `address`, `balance`, and `chain`.

**Errors:** `422` Validation error

---

### Get Credit Balances

```
GET /api/v0/credit_balances
```

Retrieves paginated credit balances.

#### Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `pagination` | integer | No | `100` | Items per page (min: 0) |
| `page` | integer | No | `1` | Page number (min: 1) |
| `min_balance` | integer | No | `0` | Minimum balance filter (min: 1) |

#### Response

Returns a `PaginatedCreditBalances` object containing entries with `address` and `credits`.

**Errors:** `422` Validation error

---

### Get Account Files

```
GET /api/v0/addresses/{address}/files
```

Retrieves files owned by an account.

#### Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `address` | string (path) | Yes | | Account address |
| `pagination` | integer | No | `100` | Items per page (min: 0) |
| `page` | integer | No | `1` | Page number (min: 1) |
| `sort_order` | integer | No | `-1` | Sort order: `-1` or `1` |

#### Response

Returns a `GetAccountFilesResponse` object with `address`, `total_size`, `files` (each with `file_hash`, `size`, `type`, `created`, `item_hash`), and pagination fields.

**Errors:** `404` No files found | `422` Validation error

---

### Get Account Post Types

```
GET /api/v0/addresses/{address}/post_types
```

Retrieves the post types used by an account.

#### Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `address` | string | Yes | Account address |

#### Response

Returns a `GetAccountPostTypesResponse` object with `address` and `post_types`.

---

### Get Account Channels

```
GET /api/v0/addresses/{address}/channels
```

Retrieves the channels used by an account.

#### Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `address` | string | Yes | Account address |

#### Response

Returns a `GetAccountChannelsResponse` object with `address` and `channels`.

---

### Get Account Credit History

```
GET /api/v0/addresses/{address}/credit_history
```

Retrieves the credit transaction history for an account.

#### Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `address` | string (path) | Yes | | Account address |
| `pagination` | integer | No | `0` | Items per page (min: 0) |
| `page` | integer | No | `1` | Page number (min: 1) |
| `tx_hash` | string | No | | Transaction hash filter |
| `token` | string | No | | Token filter |
| `chain` | string | No | | Chain filter |
| `provider` | string | No | | Provider filter |
| `origin` | string | No | | Origin filter |
| `origin_ref` | string | No | | Origin reference filter |
| `payment_method` | string | No | | Payment method filter |

#### Response

Returns a `GetAccountCreditHistoryResponse` object with `address`, `credit_history`, and pagination fields.

**Errors:** `404` No credit history found | `422` Validation error

---

### Get Resource Consumed Credits

```
GET /api/v0/messages/{item_hash}/consumed_credits
```

Retrieves the credits consumed by a specific resource.

#### Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `item_hash` | string | Yes | The message item hash |

#### Response

Returns a `GetResourceConsumedCreditsResponse` object with `item_hash` and `consumed_credits`.

---

## Prices

### Get Message Price

```
GET /api/v0/price/{item_hash}
```

Retrieves the estimated cost for an existing message.

#### Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `item_hash` | string | Yes | The message item hash |

#### Response

Returns an `EstimatedCostsResponse` object with `required_tokens`, `payment_type`, `cost`, `detail`, and `charged_address`.

**Errors:** `404` Message not found

---

### Estimate Message Price

```
POST /api/v0/price/estimate
```

Estimates the cost for a message before submitting it.

#### Request Body (`application/json`)

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `message` | object | Yes | The message to estimate pricing for |

#### Response

Returns an `EstimatedCostsResponse` object with `required_tokens`, `payment_type`, `cost`, `detail`, and `charged_address`.

**Errors:** `404` Pricing error

---

### Recalculate Message Costs

```
POST /api/v0/price/recalculate
```

Recalculates costs for messages.

#### Response

Returns a `RecalculateCostsResponse` object with `message`, `recalculated_count`, `total_messages`, `pricing_changes_found`, and `errors`.

---

## Programs

### List Programs on Message

```
GET /api/v0/programs/on/message
```

Lists programs triggered by messages.

#### Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `sort_order` | integer | No | `-1` | Sort order: `-1` or `1` |

#### Response

Returns an array of objects, each with `item_hash` and `content`.

**Errors:** `400` Validation error

---

## Channels

### List Channels

```
GET /api/v0/channels/list.json
```

Retrieves a list of all channels on the network.

#### Response

Returns a `ChannelsResponse` object with a `channels` array.

---

## P2P

### Publish to Pubsub

```
POST /api/v0/ipfs/pubsub/pub
```

Publishes a JSON message to a P2P/IPFS pubsub topic.

#### Request Body (`application/json`)

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `topic` | string | Yes | Pubsub topic to publish to |
| `data` | string | Yes | Data to publish |

#### Response

Returns a `PublicationStatus` object with `status` and `failed`.

**Errors:** `403` Unauthorized topic | `422` Invalid data format

---

## IPFS

### Add File to IPFS

```
POST /api/v0/ipfs/add_file
```

Uploads a file directly to IPFS via the node.

#### Request Body (`multipart/form-data`)

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `file` | binary | Yes | The file to upload |

#### Response

Returns an `IpfsAddFileResponse` object with `status`, `hash` (IPFS CID), `name`, and `size`.

**Errors:** `403` IPFS is disabled on this node | `422` Invalid file field

---

### Add JSON to IPFS

```
POST /api/v0/ipfs/add_json
```

Uploads a JSON object to IPFS via the node.

#### Request Body (`application/json`)

Any valid JSON object.

#### Response

Returns a `FileUploadResponse` object with `status` and `hash`.

---

## Metrics

### Prometheus Metrics

```
GET /metrics
```

Returns node metrics in Prometheus text format.

#### Response

Returns `text/plain` with Prometheus-formatted metrics.

---

### Metrics (JSON)

```
GET /metrics.json
```

Returns node metrics in JSON format.

#### Response

Returns a `MetricsResponse` JSON object.

---

### Get CCN Node Metrics

```
GET /api/v0/core/{node_id}/metrics
```

Retrieves metrics for a specific Core Channel Node.

#### Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `node_id` | string (path) | Yes | CCN node identifier |
| `start_date` | number | No | Start date filter |
| `end_date` | number | No | End date filter |
| `sort` | string | No | Sort field |

#### Response

Returns a `NodeMetricsResponse` object.

**Errors:** `404` Node not found | `422` Validation error

---

### Get CRN Node Metrics

```
GET /api/v0/compute/{node_id}/metrics
```

Retrieves metrics for a specific Compute Resource Node.

#### Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `node_id` | string (path) | Yes | CRN node identifier |
| `start_date` | number | No | Start date filter |
| `end_date` | number | No | End date filter |
| `sort` | string | No | Sort field |

#### Response

Returns a `NodeMetricsResponse` object.

**Errors:** `404` Node not found | `422` Validation error

---

## Info

### Get Version

```
GET /version
```

Returns the API version.

#### Response

Returns a `VersionResponse` object with a `version` field.

---

### Get Public Multiaddresses

```
GET /api/v0/info/public.json
```

Returns the node's public multiaddresses.

#### Response

Returns a `NodeMultiAddressResponse` object with a `node_multi_addresses` array.
