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
