# Aggregate Management

The `aggregate` command group allows you to create and manage key-value aggregate entries on the Aleph Cloud network.

## Overall Usage

```bash
aleph aggregate [OPTIONS] COMMAND [ARGS]...
```

### Options

| Option   | Description                |
| -------- | -------------------------- |
| `--json` | Output results as JSON     |
| `--help` | Show this message and exit |

### Key Commands

| Command  | Description                                              |
| -------- | -------------------------------------------------------- |
| `create` | Create a new aggregate message                           |
| `get`    | Fetch a single aggregate by key                          |
| `list`   | List every aggregate owned by an address                 |
| `forget` | Forget entire aggregates by element hash                 |

## Create an Aggregate

Create a new aggregate message. Content can be provided as a JSON string via `--content`, or piped from stdin.

### Usage

```bash
aleph aggregate create [OPTIONS] --key <KEY>
```

#### Options

| Option                      | Description                                                           |
| --------------------------- | --------------------------------------------------------------------- |
| `--key <KEY>`               | Aggregate key                                                         |
| `--content <JSON>`          | JSON object content. If absent, reads from stdin                      |
| `--channel <CHANNEL>`       | Channel name                                                          |
| `--on-behalf-of <ADDR>`     | Sign on behalf of another address (requires authorization)            |
| `--account <ACCOUNT>`       | Named account (defaults to the active account)                        |
| `--private-key <KEY>`       | Hex-encoded private key (or set `ALEPH_PRIVATE_KEY`)                 |
| `--chain <CHAIN>`           | Signing chain (required with `--private-key`)                         |
| `--dry-run`                 | Build and sign the message but don't submit it                        |
| `--json`                    | Output results as JSON                                                |
| `--help`                    | Show this message and exit                                            |

```bash
# Create an aggregate
aleph aggregate create --key mykey --content '{"a": 1, "b": 2}'

# Create from stdin
echo '{"a": 1}' | aleph aggregate create --key mykey
```

## Get an Aggregate

Fetch a single aggregate by key.

### Usage

```bash
aleph aggregate get [OPTIONS] <KEY>
```

#### Arguments

| Argument | Description            |
| -------- | ---------------------- |
| `KEY`    | Aggregate key to fetch |

#### Options

| Option              | Description                                                  |
| ------------------- | ------------------------------------------------------------ |
| `--address <ADDR>`  | Owner address (defaults to the current account)              |
| `--json`            | Output results as JSON                                       |
| `--help`            | Show this message and exit                                   |

```bash
# Fetch an aggregate by key
aleph aggregate get KEY

# Fetch the aggregate for a specific address
aleph aggregate get KEY --address 0xYourAddress
```

## List Aggregates

List every aggregate owned by an address.

### Usage

```bash
aleph aggregate list [OPTIONS]
```

#### Options

| Option              | Description                                              |
| ------------------- | -------------------------------------------------------- |
| `--address <ADDR>`  | Owner address (defaults to the current account)          |
| `--json`            | Output results as JSON                                   |
| `--help`            | Show this message and exit                               |

```bash
# List all aggregates for the current account
aleph aggregate list

# List all aggregates as JSON
aleph aggregate list --json
```

## Forget an Aggregate

Forget entire aggregates by element hash. Resolves the `(sender, key)` pair from each hash and tombstones every AGGREGATE message under that key from that sender.

### Usage

```bash
aleph aggregate forget [OPTIONS] [HASHES]...
```

#### Arguments

| Argument    | Description                                                              |
| ----------- | ------------------------------------------------------------------------ |
| `HASHES...` | Item hashes of any AGGREGATE element message belonging to the aggregates |

#### Options

| Option                      | Description                                                        |
| --------------------------- | ------------------------------------------------------------------ |
| `--reason <REASON>`         | Reason for forgetting                                              |
| `--channel <CHANNEL>`       | Channel name                                                       |
| `--on-behalf-of <ADDR>`     | Sign on behalf of another address (requires authorization)         |
| `-y, --yes`                 | Skip the confirmation prompt and submit immediately                |
| `--json`                    | Output results as JSON                                             |
| `--account <ACCOUNT>`       | Named account (defaults to the active account)                     |
| `--private-key <KEY>`       | Hex-encoded private key                                            |
| `--chain <CHAIN>`           | Signing chain                                                      |
| `--dry-run`                 | Build and sign the message but don't submit it                     |
| `--help`                    | Show this message and exit                                         |

```bash
# Forget an aggregate by its element hash
aleph aggregate forget ELEMENT_HASH

# Forget with a reason
aleph aggregate forget ELEMENT_HASH --reason "superseded"
```

## Delegated Permissions

Delegated authorization has moved to the dedicated `authorization` command group. Use `aleph authorization --help` to see all options.

```bash
# Grant publishing permission to a delegate
aleph authorization add 0xDelegateAddress

# Revoke permissions from a delegate
aleph authorization revoke 0xDelegateAddress

# List authorizations granted by your account
aleph authorization list

# List authorizations received from other accounts
aleph authorization received
```

For fine-grained control (restrict to specific chains, channels, message types, or aggregate keys), see `aleph authorization add --help`.
