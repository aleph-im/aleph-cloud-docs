# Aggregate Management

## Overall Usage

```bash
aleph aggregate [OPTIONS] COMMAND [ARGS]...
```

### Options

| Option | Type | Description |
|--------|------|-------------|
| `--help` |  | Show this message and exit |

### Key Commands

| Command | Description |
|---------|-------------|
| `post` | Create or update an aggregate by key or subkey |
| `get` | Fetch an aggregate by key or subkeys |
| `list` | Display all aggregates associated with an account |
| `forget` | Delete an aggregate by key or subkeys |
| `authorize` | Grant specific publishing permissions to an address to act on behalf of this account |
| `revoke` | Revoke all publishing permissions from an address acting on behalf of this account |
| `permissions` | Display all permissions emitted by an account |

## Post an Aggregate

Create or update an aggregate by key or subkey

### Usage

```bash
aleph aggregate post [OPTIONS] KEY CONTENT
```

#### Arguments

| Argument | Type | Description |
|----------|------|-------------|
| `KEY` | TEXT | Aggregate key to create or update |
| `CONTENT` | TEXT | Aggregate content in JSON format and between single quotes. E.g., `{"a": 1, "b": 2}` |

#### Options

| Option | Type | Description                                                                                             |
|--------|------|---------------------------------------------------------------------------------------------------------|
| `--subkey` | TEXT | Specified subkey where the content will be replaced                                                     |
| `--address` | TEXT | Target address. Defaults to the current account address                                                 |
| `--channel` | TEXT | Aleph Cloud network channel where the message is or will be broadcasted [default: ALEPH-CLOUDSOLUTIONS] |
| `--inline / --no-inline` |  | Inline [default: no-inline]                                                                             |
| `--sync / --no-sync` |  | Sync response [default: no-sync]                                                                        |
| `--private-key` | TEXT | Your private key. Cannot be used with `--private-key-file`                                              |
| `--private-key-file` | PATH | Path to your private key file [default: /home/$USER/.aleph-im/private-keys/ethereum.key]                |
| `--print-message / --no-print-message` |  | Print the messages after posting [default: no-print-message]                                            |
| `--verbose / --no-verbose` |  | Display additional information [default: verbose]                                                       |
| `--debug / --no-debug` |  | Enable debug logging [default: no-debug]                                                                |
| `--help` |  | Show this message and exit                                                                              |

```bash
# Post or update an aggregate
aleph aggregate post KEY '{"a": 1, "b": 2}'

# Post content for a specific subkey
aleph aggregate post KEY '{"a": 1}' --subkey "subkey1"
```

## Get an Aggregate

Fetch an aggregate by key or subkeys

### Usage

```bash
aleph aggregate get [OPTIONS] KEY
```

#### Arguments

| Argument | Type | Description |
|----------|------|-------------|
| `KEY` | TEXT | Aggregate key to fetch |

#### Options

| Option | Type | Description |
|--------|------|-------------|
| `--subkeys` | TEXT | Fetch specified subkey(s) only. Must be a comma-separated list. E.g., `key1` or `key1,key2` |
| `--address` | TEXT | Target address. Defaults to the current account address |
| `--private-key` | TEXT | Your private key. Cannot be used with `--private-key-file` |
| `--private-key-file` | PATH | Path to your private key file [default: /home/$USER/.aleph-im/private-keys/ethereum.key] |
| `--verbose / --no-verbose` |  | Display additional information [default: verbose] |
| `--debug / --no-debug` |  | Enable debug logging [default: no-debug] |
| `--help` |  | Show this message and exit |

```bash
# Fetch an aggregate by key
aleph aggregate get KEY

# Fetch specific subkeys of an aggregate
aleph aggregate get KEY --subkeys key1,key2
```

## List Aggregates

Display all aggregates associated with an account

### Usage

```bash
aleph aggregate list [OPTIONS]
```

#### Options

| Option | Type | Description |
|--------|------|-------------|
| `--address` | TEXT | Target address. Defaults to the current account address |
| `--private-key` | TEXT | Your private key. Cannot be used with `--private-key-file` |
| `--private-key-file` | PATH | Path to your private key file [default: /home/$USER/.aleph-im/private-keys/ethereum.key] |
| `--json / --no-json` |  | Print as JSON instead of a rich table [default: no-json] |
| `--verbose / --no-verbose` |  | Display additional information [default: verbose] |
| `--debug / --no-debug` |  | Enable debug logging [default: no-debug] |
| `--help` |  | Show this message and exit |

```bash
# List all aggregates associated with the current account
aleph aggregate list

# List all aggregates as JSON
aleph aggregate list --json
```

## Forget an Aggregate

Delete an aggregate by key or subkeys

### Usage

```bash
aleph aggregate forget [OPTIONS] KEY
```

#### Arguments

| Argument | Type | Description |
|----------|------|-------------|
| `KEY` | TEXT | Aggregate key to remove |

#### Options

| Option | Type | Description                                                                                             |
|--------|------|---------------------------------------------------------------------------------------------------------|
| `--subkeys` | TEXT | Remove specified subkey(s) only. Must be a comma-separated list. E.g., `key1` or `key1,key2`            |
| `--address` | TEXT | Target address. Defaults to the current account address                                                 |
| `--channel` | TEXT | Aleph Cloud network channel where the message is or will be broadcasted [default: ALEPH-CLOUDSOLUTIONS] |
| `--inline / --no-inline` |  | Inline [default: no-inline]                                                                             |
| `--sync / --no-sync` |  | Sync response [default: no-sync]                                                                        |
| `--private-key` | TEXT | Your private key. Cannot be used with `--private-key-file`                                              |
| `--private-key-file` | PATH | Path to your private key file [default: /home/$USER/.aleph-im/private-keys/ethereum.key]                |
| `--print-message / --no-print-message` |  | [default: no-print-message]                                                                             |
| `--verbose / --no-verbose` |  | Display additional information [default: verbose]                                                       |
| `--debug / --no-debug` |  | Enable debug logging [default: no-debug]                                                                |
| `--help` |  | Show this message and exit                                                                              |

```bash
# Forget an aggregate by its key
aleph aggregate forget KEY

# Forget specific subkeys of an aggregate
aleph aggregate forget KEY --subkeys key1,key2
```

## Authorize an Address

Grant specific publishing permissions to an address to act on behalf of this account

### Usage

```bash
aleph aggregate authorize [OPTIONS] ADDRESS
```

#### Arguments

| Argument | Type | Description |
|----------|------|-------------|
| `ADDRESS` | TEXT | Target address. Defaults to the current account address |

#### Options

| Option | Type | Description |
|--------|------|-------------|
| `--chain` | [ARB,AVAX,BASE,BLAST,BOB,BSC,CSDK,CYBER,DOT,ETH,FRAX,INK,LINEA,LISK,METIS,MODE,NEO,NULS,NULS2,OP,POL,SOL,TEZOS,WLD,ZORA] | Only on the specified chain |
| `--types` | TEXT | Only for specified message types (comma-separated list) |
| `--channels` | TEXT | Only on specified channels (comma-separated list) |
| `--post-types` | TEXT | Only for specified post types (comma-separated list) |
| `--aggregate-keys` | TEXT | Only for specified aggregate keys (comma-separated list) |
| `--private-key` | TEXT | Your private key. Cannot be used with `--private-key-file` |
| `--private-key-file` | PATH | Path to your private key file [default: /home/$USER/.aleph-im/private-keys/ethereum.key] |
| `--print-message / --no-print-message` |  | [default: no-print-message] |
| `--verbose / --no-verbose` |  | Display additional information [default: verbose] |
| `--debug / --no-debug` |  | Enable debug logging [default: no-debug] |
| `--help` |  | Show this message and exit |

```bash
# Grant publishing permission to an address
aleph aggregate authorize ADDRESS --chain ETH

# Grant permission for specific aggregate keys
aleph aggregate authorize ADDRESS --aggregate-keys key1,key2
```

## Revoke Permissions

Revoke all publishing permissions from an address acting on behalf of this account

### Usage

```bash
aleph aggregate revoke [OPTIONS] ADDRESS
```

#### Arguments

| Argument | Type | Description |
|----------|------|-------------|
| `ADDRESS` | TEXT | Target address. Defaults to the current account address |

#### Options

| Option | Type | Description |
|--------|------|-------------|
| `--private-key` | TEXT | Your private key. Cannot be used with `--private-key-file` |
| `--private-key-file` | PATH | Path to your private key file [default: /home/$USER/.aleph-im/private-keys/ethereum.key] |
| `--print-message / --no-print-message` |  | [default: no-print-message] |
| `--verbose / --no-verbose` |  | Display additional information [default: verbose] |
| `--debug / --no-debug` |  | Enable debug logging [default: no-debug] |
| `--help` |  | Show this message and exit |

```bash
# Revoke publishing permissions from an address
aleph aggregate revoke ADDRESS
```

## View Permissions

Display all permissions emitted by an account

### Usage

```bash
aleph aggregate permissions [OPTIONS]
```

#### Options

| Option | Type | Description |
|--------|------|-------------|
| `--address` | TEXT | Target address. Defaults to the current account address |
| `--private-key` | TEXT | Your private key. Cannot be used with `--private-key-file` |
| `--private-key-file` | PATH | Path to your private key file [default: /home/$USER/.aleph-im/private-keys/ethereum.key] |
| `--json / --no-json` |  | Print as JSON instead of a rich table [default: no-json] |
| `--verbose / --no-verbose` |  | Display additional information [default: verbose] |
| `--debug / --no-debug` |  | Enable debug logging [default: no-debug] |
| `--help` |  | Show this message and exit |

```bash
# View all permissions for the current account
aleph aggregate permissions

# View permissions in JSON format
aleph aggregate permissions --json
```
