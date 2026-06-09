# Domain Management

The `domain` command group allows you to manage custom domains attached to websites, programs, or instances on the Aleph Cloud network.

## Overall Usage

```bash
aleph domain [OPTIONS] COMMAND [ARGS]...
```

### Options

| Option   | Description                |
| -------- | -------------------------- |
| `--json` | Output results as JSON     |
| `--help` | Show this message and exit |

### Key Commands

| Command  | Description                                               |
| -------- | --------------------------------------------------------- |
| `list`   | List all domains for an account                           |
| `add`    | Add (or update) a domain entry pointing at a target       |
| `attach` | Re-point an existing domain to a different target         |
| `detach` | Clear a domain's target                                   |
| `remove` | Remove a domain entry (soft-delete)                       |

## List Domains

List all domains for an account.

### Usage

```bash
aleph domain list [OPTIONS]
```

#### Options

| Option              | Description                                     |
|---------------------|-------------------------------------------------|
| `--address <ADDR>`  | Inspect another address's domains               |
| `--json`            | Output results as JSON                          |
| `--help`            | Show this message and exit                      |

```bash
# List domains for your account
aleph domain list

# List domains for a specific address
aleph domain list --address 0xYourAddress

# List domains as JSON
aleph domain list --json
```

## Add a Custom Domain

Add (or update) a domain entry pointing at a target (website name or message hash).

### Usage

```bash
aleph domain add [OPTIONS] --target <TARGET> <DOMAIN>
```

#### Arguments

| Argument | Description                                     |
|----------|-------------------------------------------------|
| `DOMAIN` | Fully Qualified Domain Name (e.g. `aleph.cloud`) |

#### Options

| Option                            | Description                                                          |
|-----------------------------------|----------------------------------------------------------------------|
| `--target <TARGET>`               | Website name (resolved against your `websites` aggregate) or a raw message hash |
| `--kind <KIND>`                   | Target type [default: ipfs] [possible values: `ipfs`, `program`, `instance`] |
| `--catch-all-path <PATH>`         | Catch-all path for IPFS sites (default: `/404.html`)                 |
| `--force`                         | Overwrite existing entry without erroring                            |
| `--channel <CHANNEL>`             | Channel name                                                         |
| `--on-behalf-of <ADDR>`           | Sign on behalf of another address (requires authorization); the aggregate write and any website-name lookup target the owner |
| `--account <ACCOUNT>`             | Named account (defaults to the active account)                       |
| `--private-key <KEY>`             | Hex-encoded private key                                              |
| `--chain <CHAIN>`                 | Signing chain                                                        |
| `--dry-run`                       | Build and sign the message but don't submit it                       |
| `--json`                          | Output results as JSON                                               |
| `--help`                          | Show this message and exit                                           |

```bash
# Add a domain pointing at a website or program hash
aleph domain add --target ITEM_HASH example.com

# Add a domain for an instance
aleph domain add --target ITEM_HASH --kind instance example.com

# Add on behalf of another address
aleph domain add --target ITEM_HASH example.com --on-behalf-of 0xOwnerAddress

# Overwrite an existing entry
aleph domain add --target ITEM_HASH example.com --force
```

## Attach a Domain to a Resource

Re-point an existing domain to a different target. Use `--on-behalf-of <ADDRESS>` for delegated updates.

### Usage

```bash
aleph domain attach [OPTIONS] <DOMAIN> --to <TARGET>
```

#### Arguments

| Argument | Description                                     |
|----------|-------------------------------------------------|
| `DOMAIN` | The domain to re-point                          |

#### Options

| Option                      | Description                                                          |
|-----------------------------|----------------------------------------------------------------------|
| `--to <TARGET>`             | Website name or message hash                                         |
| `--channel <CHANNEL>`       | Channel name                                                         |
| `--on-behalf-of <ADDR>`     | Sign on behalf of another address (requires authorization)           |
| `--account <ACCOUNT>`       | Named account (defaults to the active account)                       |
| `--private-key <KEY>`       | Hex-encoded private key                                              |
| `--chain <CHAIN>`           | Signing chain                                                        |
| `--dry-run`                 | Build and sign the message but don't submit it                       |
| `--json`                    | Output results as JSON                                               |
| `--help`                    | Show this message and exit                                           |

```bash
# Attach a domain to a resource
aleph domain attach example.com --to ITEM_HASH

# Attach on behalf of another address (delegated update)
aleph domain attach example.com --to ITEM_HASH --on-behalf-of 0xOwnerAddress
```

## Detach a Domain

Clear a domain's target (entry is kept, message_id emptied).

### Usage

```bash
aleph domain detach [OPTIONS] <DOMAIN>
```

```bash
# Detach a custom domain
aleph domain detach example.com
```

## Remove a Domain Entry

Remove a domain entry (soft-delete: sets the entry to null).

### Usage

```bash
aleph domain remove [OPTIONS] <DOMAIN>
```

#### Options

| Option                      | Description                                                          |
|-----------------------------|----------------------------------------------------------------------|
| `--yes`                     | Skip the confirmation prompt                                         |
| `--channel <CHANNEL>`       | Channel name                                                         |
| `--on-behalf-of <ADDR>`     | Sign on behalf of another address (requires authorization)           |
| `--account <ACCOUNT>`       | Named account (defaults to the active account)                       |
| `--private-key <KEY>`       | Hex-encoded private key                                              |
| `--chain <CHAIN>`           | Signing chain                                                        |
| `--dry-run`                 | Build and sign the message but don't submit it                       |
| `--json`                    | Output results as JSON                                               |
| `--help`                    | Show this message and exit                                           |

```bash
# Remove a domain entry
aleph domain remove example.com

# Remove without confirmation
aleph domain remove example.com --yes
```
