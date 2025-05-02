# Node Management

## Overall Usage

```bash
aleph node [OPTIONS] COMMAND [ARGS]...
```

### Options

| Option | Type | Description |
|--------|------|-------------|
| `--help` |  | Show this message and exit |

### Key Commands

| Command | Description |
|---------|-------------|
| `compute` | Get all compute nodes (CRN) on aleph network |
| `core` | Get all core nodes (CCN) on aleph network |

## Get All Compute Nodes

Get all compute nodes (CRN) on aleph network

### Usage

```bash
aleph node compute [OPTIONS]
```

#### Options

| Option | Type | Description |
|--------|------|-------------|
| `--json / --no-json` |  | Print as JSON instead of a rich table [default: no-json] |
| `--active / --no-active` |  | Only show active nodes [default: no-active] |
| `--address` | TEXT | Owner address to filter by |
| `--payg-receiver` | TEXT | PAYG (Pay-As-You-Go) receiver address to filter by |
| `--crn-url` | TEXT | CRN URL to filter by |
| `--crn-hash` | TEXT | CRN hash to filter by |
| `--ccn-hash` | TEXT | CCN hash to filter by |
| `--debug / --no-debug` |  | Enable debug logging [default: no-debug] |
| `--help` |  | Show this message and exit |

```bash
# Get all compute nodes in JSON format
aleph node compute --json

# Get only active compute nodes
aleph node compute --active

# Get compute nodes filtered by address
aleph node compute --address ADDRESS
```

## Get All Core Nodes

Get all core nodes (CCN) on aleph network

### Usage

```bash
aleph node core [OPTIONS]
```

#### Options

| Option | Type | Description |
|--------|------|-------------|
| `--json / --no-json` |  | Print as JSON instead of a rich table [default: no-json] |
| `--active / --no-active` |  | Only show active nodes [default: no-active] |
| `--address` | TEXT | Owner address to filter by |
| `--ccn-hash` | TEXT | CCN hash to filter by |
| `--debug / --no-debug` |  | Enable debug logging [default: no-debug] |
| `--help` |  | Show this message and exit |

```bash
# Get all core nodes in JSON format
aleph node core --json

# Get only active core nodes
aleph node core --active

# Get core nodes filtered by address
aleph node core --address ADDRESS
```
