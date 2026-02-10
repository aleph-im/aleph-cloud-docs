# Domain Management

## Overall Usage

```bash
aleph domain [OPTIONS] COMMAND [ARGS]...
```

### Options

| Option   | Type | Description                |
| -------- | ---- | -------------------------- |
| `--help` |      | Show this message and exit |

### Key Commands

| Command  | Description                        |
| -------- | ---------------------------------- |
| `add`    | Add and link a Custom Domain       |
| `attach` | Attach resource to a Custom Domain |
| `detach` | Unlink Custom Domain               |
| `info`   | Show Custom Domain Details         |

## Add a Custom Domain

Add and link a Custom Domain

### Usage

```bash
aleph domain add [OPTIONS] FQDN
```

#### Arguments

| Argument | Type | Description                                     |
| -------- | ---- | ----------------------------------------------- |
| `FQDN`   | TEXT | Fully Qualified Domain Name (e.g., aleph.cloud) |

#### Options

| Option               | Type                      | Description                                                                              |
| -------------------- | ------------------------- | ---------------------------------------------------------------------------------------- |
| `--target`           | [ipfs, program, instance] | Resource type to target                                                                  |
| `--item-hash`        | TEXT                      | Item hash                                                                                |
| `--owner`            | TEXT                      | Owner address. Defaults to current account address                                       |
| `--ask / --no-ask`   |                           | Prompt user for confirmation [default: ask]                                              |
| `--private-key`      | TEXT                      | Your private key. Cannot be used with `--private-key-file`                               |
| `--private-key-file` | PATH                      | Path to your private key file [default: /home/$USER/.aleph-im/private-keys/ethereum.key] |
| `--help`             |                           | Show this message and exit                                                               |

```bash
# Add and link a custom domain
aleph domain add aleph.cloud --target ipfs --owner 0xYourAddress

# Add and link a custom domain with confirmation
aleph domain add aleph.cloud --target program --ask
```

## Attach Resource to Custom Domain

Attach resource to a Custom Domain

### Usage

```bash
aleph domain attach [OPTIONS] FQDN
```

#### Arguments

| Argument | Type | Description                                     |
| -------- | ---- | ----------------------------------------------- |
| `FQDN`   | TEXT | Fully Qualified Domain Name (e.g., aleph.cloud) |

#### Options

| Option               | Type | Description                                                                              |
| -------------------- | ---- | ---------------------------------------------------------------------------------------- |
| `--item-hash`        | TEXT | Item hash                                                                                |
| `--catch-all-path`   | TEXT | Choose a relative path to catch all unmatched routes or a 404 error                      |
| `--ask / --no-ask`   |      | Prompt user for confirmation [default: ask]                                              |
| `--private-key`      | TEXT | Your private key. Cannot be used with `--private-key-file`                               |
| `--private-key-file` | PATH | Path to your private key file [default: /home/$USER/.aleph-im/private-keys/ethereum.key] |
| `--help`             |      | Show this message and exit                                                               |

```bash
# Attach resource to a custom domain
aleph domain attach aleph.cloud --item-hash ITEM_HASH --catch-all-path /404

# Attach resource with confirmation
aleph domain attach aleph.cloud --item-hash ITEM_HASH --ask
```

## Detach Custom Domain

Unlink Custom Domain

### Usage

```bash
aleph domain detach [OPTIONS] FQDN
```

#### Arguments

| Argument | Type | Description                                     |
| -------- | ---- | ----------------------------------------------- |
| `FQDN`   | TEXT | Fully Qualified Domain Name (e.g., aleph.cloud) |

#### Options

| Option               | Type | Description                                                                              |
| -------------------- | ---- | ---------------------------------------------------------------------------------------- |
| `--ask / --no-ask`   |      | Prompt user for confirmation [default: ask]                                              |
| `--private-key`      | TEXT | Your private key. Cannot be used with `--private-key-file`                               |
| `--private-key-file` | PATH | Path to your private key file [default: /home/$USER/.aleph-im/private-keys/ethereum.key] |
| `--help`             |      | Show this message and exit                                                               |

```bash
# Detach a custom domain
aleph domain detach aleph.cloud

# Detach a custom domain with confirmation
aleph domain detach aleph.cloud --ask
```

## Show Custom Domain Details

Fetch details of a Custom Domain

### Usage

```bash
aleph domain info [OPTIONS] FQDN
```

#### Arguments

| Argument | Type | Description                                     |
| -------- | ---- | ----------------------------------------------- |
| `FQDN`   | TEXT | Fully Qualified Domain Name (e.g., aleph.cloud) |

#### Options

| Option               | Type | Description                                                                              |
| -------------------- | ---- | ---------------------------------------------------------------------------------------- |
| `--private-key`      | TEXT | Your private key. Cannot be used with `--private-key-file`                               |
| `--private-key-file` | PATH | Path to your private key file [default: /home/$USER/.aleph-im/private-keys/ethereum.key] |
| `--help`             |      | Show this message and exit                                                               |

```bash
# Show details of a custom domain
aleph domain info aleph.cloud
```
