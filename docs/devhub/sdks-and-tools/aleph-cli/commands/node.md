# Node Management

The `node` command group allows you to list, register, stake, and manage network nodes on the Aleph Cloud network. For node registration and staking, see `aleph node --help`.

## Overall Usage

```bash
aleph node [OPTIONS] COMMAND [ARGS]...
```

### Options

| Option   | Description                |
| -------- | -------------------------- |
| `--json` | Output results as JSON     |
| `--help` | Show this message and exit |

### Key Commands

| Command      | Description                                  |
| ------------ | -------------------------------------------- |
| `list`       | List nodes on the network                    |
| `create-ccn` | Register a new Core Channel Node (CCN)        |
| `create-crn` | Register a new Compute Resource Node (CRN)    |
| `amend`      | Amend metadata fields on an existing node     |
| `stake`      | Stake ALEPH tokens on a node                 |
| `unstake`    | Remove your stake from a node                |
| `link`       | Link a CRN to one of your CCNs               |
| `unlink`     | Unlink a CRN from your CCN                   |
| `drop`       | Remove a node from the network               |

## List Nodes

List nodes on the network. Use `--type` to filter by node type.

### Usage

```bash
aleph node list [OPTIONS]
```

#### Options

| Option                          | Description                                                          |
| ------------------------------- | -------------------------------------------------------------------- |
| `--type <TYPE>`                 | Filter by node type: `ccn` (Core Channel Node) or `crn` (Compute Resource Node) |
| `--address <ADDR>`              | Filter by owner address                                              |
| `--all`                         | List all nodes on the network                                        |
| `--corechannel-address <ADDR>`  | Address of the corechannel aggregate owner (defaults to mainnet)     |
| `--json`                        | Output results as JSON                                               |
| `--account <ACCOUNT>`           | Named account (defaults to the active account)                       |
| `--private-key <KEY>`           | Hex-encoded private key                                              |
| `--chain <CHAIN>`               | Signing chain                                                        |
| `--help`                        | Show this message and exit                                           |

```bash
# List all Compute Resource Nodes (CRN) in JSON format
aleph node list --type crn --json

# List all Core Channel Nodes (CCN)
aleph node list --type ccn

# List all nodes on the network
aleph node list --all

# List CRNs filtered by owner address
aleph node list --type crn --address ADDRESS

# List CCNs filtered by owner address
aleph node list --type ccn --address ADDRESS
```
