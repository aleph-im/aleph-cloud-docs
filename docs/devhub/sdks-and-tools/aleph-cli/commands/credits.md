# Credits Management

The `credits` command group allows you to view and manage your Aleph Cloud credits, which can be used to pay for compute resources on the network.

## Overall Usage

```bash
aleph credits [OPTIONS] COMMAND [ARGS]...
```

### Options

| Option | Type | Description |
|--------|------|-------------|
| `--help` |  | Show this message and exit |

### Key Commands

| Command | Description |
|---------|-------------|
| `show` | Display the number of credits for a specific address |
| `history` | Display the credit transaction history for an address |

## Show Credits

Display the number of credits for a specific address.

### Usage

```bash
aleph credits show [OPTIONS] [ADDRESS]
```

#### Arguments

| Argument | Type | Description |
|----------|------|-------------|
| `ADDRESS` | TEXT | Address of the wallet you want to check. If not provided, uses your current account |

#### Options

| Option | Type | Description |
|--------|------|-------------|
| `--private-key` | TEXT | Your private key. Cannot be used with `--private-key-file` |
| `--private-key-file` | PATH | Path to your private key file [default: /home/$USER/.aleph-im/private-keys/ethereum.key] |
| `--chain` | [ARB, AVAX, BASE, BLAST, BOB, BSC, CSDK, CYBER, DOT, ETH, FRAX, INK, LINEA, LISK, METIS, MODE, NEO, NULS, NULS2, OP, POL, SOL, TEZOS, WLD, ZORA] | Chain for the address |
| `--json / --no-json` |  | Display output as JSON [default: no-json] |
| `--debug / --no-debug` |  | Enable debug logging [default: no-debug] |
| `--help` |  | Show this message and exit |

```bash
# Show credits for your current account
aleph credits show

# Show credits for a specific address
aleph credits show 0x1234567890abcdef...

# Show credits as JSON output
aleph credits show --json

# Show credits for a specific address with JSON output
aleph credits show 0x1234567890abcdef... --json
```

## Credits History

Display the credit transaction history for an address.

### Usage

```bash
aleph credits history [OPTIONS] [ADDRESS]
```

#### Arguments

| Argument | Type | Description |
|----------|------|-------------|
| `ADDRESS` | TEXT | Address of the wallet you want to check. If not provided, uses your current account |

#### Options

| Option | Type | Description |
|--------|------|-------------|
| `--private-key` | TEXT | Your private key. Cannot be used with `--private-key-file` |
| `--private-key-file` | PATH | Path to your private key file [default: /home/$USER/.aleph-im/private-keys/ethereum.key] |
| `--chain` | [ARB, AVAX, BASE, BLAST, BOB, BSC, CSDK, CYBER, DOT, ETH, FRAX, INK, LINEA, LISK, METIS, MODE, NEO, NULS, NULS2, OP, POL, SOL, TEZOS, WLD, ZORA] | Chain for the address |
| `--page-size` | INTEGER | Number of elements per page [default: 100] |
| `--page` | INTEGER | Current page number [default: 1] |
| `--json / --no-json` |  | Display output as JSON [default: no-json] |
| `--debug / --no-debug` |  | Enable debug logging [default: no-debug] |
| `--help` |  | Show this message and exit |

```bash
# Show credit history for your current account
aleph credits history

# Show credit history for a specific address
aleph credits history 0x1234567890abcdef...

# Show credit history with pagination
aleph credits history --page-size 50 --page 2

# Show credit history as JSON
aleph credits history --json
```

## Related Commands

- [Account Balance](./account.md#checking-your-address-and-balance) - View your ALEPH token balance alongside credits
- [Pricing](./pricing.md) - View pricing information for services payable with credits
