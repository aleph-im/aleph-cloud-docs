# Message Management

The `message` command group allows you to query, sync, and forget raw protocol messages on the Aleph Cloud network.

> **Note:** Creating and amending posts now lives under `aleph post` (see the post command). Message signing and watching have no direct CLI equivalent in the Rust CLI.

## Overall Usage

```bash
aleph message [OPTIONS] COMMAND [ARGS]...
```

### Options

| Option   | Description                |
| -------- | -------------------------- |
| `--json` | Output results as JSON     |
| `--help` | Show this message and exit |

### Key Commands

| Command  | Description                                    |
| -------- | ---------------------------------------------- |
| `get`    | Get a message by its item hash                 |
| `list`   | List messages (with filters)                   |
| `forget` | Forget messages or entire aggregates           |
| `retry`  | Re-submit a previously rejected message        |
| `sync`   | Sync messages from one node to another         |

## Get a Message

Get a message by its item hash.

### Usage

```bash
aleph message get [OPTIONS] <ITEM_HASH>
```

#### Arguments

| Argument    | Description              |
| ----------- | ------------------------ |
| `ITEM_HASH` | The item hash of the message to fetch |

#### Options

| Option   | Description                |
| -------- | -------------------------- |
| `--json` | Output results as JSON     |
| `--help` | Show this message and exit |

```bash
# Retrieve a message
aleph message get ITEM_HASH
```

## List Messages

List messages with optional filters. Walks cursor pagination server-side.

### Usage

```bash
aleph message list [OPTIONS]
```

#### Options

| Option                      | Description                                                                                    |
| --------------------------- | ---------------------------------------------------------------------------------------------- |
| `--count <N>`               | Maximum number of messages to return [default: 200]                                            |
| `--message-type <TYPE>`     | Filter by message type: `aggregate`, `forget`, `instance`, `program`, `post`, `store`          |
| `--message-types <TYPES>`   | Filter by multiple message types (CSV or repeated)                                             |
| `--content-types <TYPES>`   | Filter by content types (CSV or repeated)                                                      |
| `--content-keys <KEYS>`     | Filter by content keys (CSV or repeated)                                                       |
| `--addresses <ADDRS>`       | Sender addresses (CSV or repeated)                                                             |
| `--owners <ADDRS>`          | Content owners (CSV or repeated)                                                               |
| `--tags <TAGS>`             | Tags (CSV or repeated)                                                                         |
| `--hashes <HASHES>`         | Specific item hashes (CSV or repeated)                                                         |
| `--channels <CHANNELS>`     | Channels (CSV or repeated)                                                                     |
| `--chains <CHAINS>`         | Sender chains (CSV or repeated)                                                                |
| `--start-date <DATE>`       | Earliest date (RFC3339 or unix seconds)                                                        |
| `--end-date <DATE>`         | Latest date (RFC3339 or unix seconds)                                                          |
| `--sort-by <KEY>`           | Sort key: `time` or `tx-time`                                                                  |
| `--sort-order <ORDER>`      | Sort order: `asc` or `desc`                                                                    |
| `--message-statuses <S>`    | Message statuses (CSV or repeated): `pending`, `processed`, `removing`, `removed`, `forgotten` |
| `--json`                    | Output results as JSON                                                                         |
| `--help`                    | Show this message and exit                                                                     |

```bash
# List messages from several addresses
aleph message list --addresses ADDRESS_1,ADDRESS_2,ADDRESS_3

# List messages with specific tags
aleph message list --tags TAG_1,TAG_2

# List up to 50 STORE messages
aleph message list --count 50 --message-type store
```

## Forget a Message

Forget messages on the network. Forget by individual item hashes, or use `--aggregates` to tombstone an entire aggregate.

### Usage

```bash
aleph message forget [OPTIONS] [HASHES]...
```

#### Arguments

| Argument    | Description                                          |
| ----------- | ---------------------------------------------------- |
| `HASHES...` | Item hashes of the messages to forget (one per hash) |

#### Options

| Option                      | Description                                                                                |
| --------------------------- | ------------------------------------------------------------------------------------------ |
| `--aggregates <HASHES>`     | Item hashes identifying aggregates to forget entirely (all elements with the same sender + key) |
| `--reason <REASON>`         | Reason for forgetting                                                                      |
| `--channel <CHANNEL>`       | Channel name                                                                               |
| `--on-behalf-of <ADDR>`     | Sign on behalf of another address (requires authorization)                                 |
| `-y, --yes`                 | Skip the confirmation prompt and submit immediately                                        |
| `--json`                    | Output results as JSON                                                                     |
| `--account <ACCOUNT>`       | Named account (defaults to the active account)                                             |
| `--private-key <KEY>`       | Hex-encoded private key                                                                    |
| `--chain <CHAIN>`           | Signing chain                                                                              |
| `--dry-run`                 | Build and sign the message but don't submit it                                             |
| `--help`                    | Show this message and exit                                                                 |

```bash
# Forget two specific messages
aleph message forget abc123... def456...

# Forget the entire aggregate keyed at the (sender, key) of this element
aleph message forget --aggregates abc123...

# Forget with a reason
aleph message forget ITEM_HASH --reason "Outdated content"
```

## Retry a Message

Re-submit a previously rejected message.

### Usage

```bash
aleph message retry [OPTIONS] <ITEM_HASH>
```

#### Arguments

| Argument    | Description                                    |
| ----------- | ---------------------------------------------- |
| `ITEM_HASH` | The item hash of the rejected message to re-submit |

#### Options

| Option      | Description                                         |
| ----------- | --------------------------------------------------- |
| `--dry-run` | Print the reconstructed envelope without submitting |
| `--json`    | Output results as JSON                              |
| `--help`    | Show this message and exit                          |

```bash
# Retry a rejected message
aleph message retry ITEM_HASH
```

## Sync Messages

Sync messages from one node to another. Fetches messages from the source and POSTs any missing ones to the target.

### Usage

```bash
aleph message sync [OPTIONS] --source <SOURCE> --target <TARGET>
```

#### Options

| Option                  | Description                                                        |
|-------------------------|--------------------------------------------------------------------|
| `--source <URL>`        | URL of the source node (messages are fetched from here)            |
| `--target <URL>`        | URL of the target node (missing messages are POSTed here)          |
| `--count <N>`           | Maximum number of messages to fetch from each node [default: 200]  |
| `--dry-run`             | Show what would be synced without actually POSTing                 |
| `--message-type <TYPE>` | Filter by message type                                             |
| `--addresses <ADDRS>`   | Sender addresses (CSV or repeated)                                 |
| `--json`                | Output results as JSON                                             |
| `--help`                | Show this message and exit                                         |

```bash
# Sync messages between two nodes
aleph message sync \
  --source https://api.aleph.im \
  --target https://api2.aleph.im

# Dry-run to preview what would be synced
aleph message sync \
  --source https://api.aleph.im \
  --target https://api2.aleph.im \
  --dry-run
```
