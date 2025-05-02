# Domain Management

## Overall Usage

```bash
aleph domain [OPTIONS] COMMAND [ARGS]...
```

### Options

| Option | Type | Description |
|--------|------|-------------|
| `--help` |  | Show this message and exit |

### Key Commands

| Command | Description |
|---------|-------------|
| `add` | Add and link a Custom Domain |
| `attach` | Attach resource to a Custom Domain |
| `detach` | Unlink Custom Domain |
| `info` | Show Custom Domain Details |

## Add a Custom Domain

Add and link a Custom Domain

### Usage

```bash
aleph domain add [OPTIONS] FQDN
```

#### Arguments

| Argument | Type | Description |
|----------|------|-------------|
| `FQDN` | TEXT | Fully Qualified Domain Name (e.g., aleph.im) |

#### Options

| Option | Type | Description |
|--------|------|-------------|
| `--target` | [ipfs, program, instance] | Resource type to target |
| `--item-hash` | TEXT | Item hash |
| `--owner` | TEXT | Owner address. Defaults to current account address |
| `--ask / --no-ask` |  | Prompt user for confirmation [default: ask] |
| `--private-key` | TEXT | Your private key. Cannot be used with `--private-key-file` |
| `--private-key-file` | PATH | Path to your private key file [default: /home/$USER/.aleph-im/private-keys/ethereum.key] |
| `--help` |  | Show this message and exit |

```bash
# Add and link a custom domain
aleph domain add aleph.im --target ipfs --owner ADDRESS

# Add and link a custom domain with confirmation
aleph domain add aleph.im --target program --ask
```
