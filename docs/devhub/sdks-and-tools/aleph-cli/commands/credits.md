# Credits Management

The credits commands allow you to view and manage your Aleph Cloud credits and account balance. Credits can be used to pay for compute resources on the network.

## Account Balance

Show the balance of any address (ALEPH tokens and credits).

### Usage

```bash
aleph account balance [OPTIONS] [ADDRESS]
```

#### Arguments

| Argument  | Description                                                                     |
|-----------|---------------------------------------------------------------------------------|
| `ADDRESS` | Address to query (hex `0x…`, local account name, or alias). Defaults to the active account |

#### Options

| Option   | Description                |
|----------|----------------------------|
| `--json` | Output results as JSON     |
| `--help` | Show this message and exit |

```bash
# Show balance for your current account
aleph account balance

# Show balance for a specific address
aleph account balance 0x1234567890abcdef...

# Show balance as JSON
aleph account balance --json
```

## Credit History

Display the paginated credit history of an address.

### Usage

```bash
aleph credit history [OPTIONS]
```

#### Options

| Option                    | Description                                              |
|---------------------------|----------------------------------------------------------|
| `--address <ADDR>`        | Owner address (defaults to the current account)          |
| `--page <N>`              | Page number (1-indexed) [default: 1]                     |
| `--page-size <N>`         | Items per page (server-clamped) [default: 100]           |
| `--json`                  | Output results as JSON                                   |
| `--help`                  | Show this message and exit                               |

```bash
# Show credit history for your current account
aleph credit history

# Show credit history for a specific address
aleph credit history --address 0x1234567890abcdef...

# Show credit history with pagination
aleph credit history --page-size 50 --page 2

# Show credit history as JSON
aleph credit history --json
```

## Buy Credits

Buy Aleph credits by transferring ALEPH, USDC, or native ETH from your EVM account. ALEPH and USDC are ERC-20 transfers; ETH is a plain value transfer. Either way the transfer goes to the network's credit purchase address, and the protocol mints credits to your address once the transfer is confirmed.

`--amount` is in human-readable token units (decimals OK), not credits. 1 USD purchases 1,000,000 credits.

### Usage

```bash
aleph credit buy [OPTIONS] --token <TOKEN> --amount <AMOUNT>
```

#### Options

| Option                  | Description                                                        |
|-------------------------|--------------------------------------------------------------------|
| `--token <TOKEN>`       | Token to pay with: `aleph`, `usdc`, or `eth`                       |
| `--amount <AMOUNT>`     | Amount in human-readable units (e.g. `100` for 100 ALEPH, `0.05` for 0.05 ETH) |
| `--rpc-url <URL>`       | Ethereum JSON-RPC endpoint override                                |
| `-y, --yes`             | Skip the confirmation prompt and submit immediately                 |
| `--json`                | Output results as JSON                                             |
| `--account <ACCOUNT>`   | Named account (defaults to the active account)                     |
| `--private-key <KEY>`   | Hex-encoded private key                                            |
| `--chain <CHAIN>`       | Signing chain                                                      |
| `--dry-run`             | Build and sign the message but don't submit it                     |
| `--help`                | Show this message and exit                                         |

```bash
# Buy credits with ALEPH tokens
aleph credit buy --token aleph --amount 100

# Buy credits with USDC
aleph credit buy --token usdc --amount 50.5

# Buy credits with native ETH
aleph credit buy --token eth --amount 0.05

# Buy without confirmation prompt
aleph credit buy --token usdc --amount 25 --yes
```

## Transfer Credits

Transfer Aleph credits to another address. `--amount` is the number of credits (integer, not tokens) - 1 USD ≈ 1,000,000 credits.

### Usage

```bash
aleph credit transfer [OPTIONS] --to <TO> --amount <AMOUNT>
```

#### Options

| Option                      | Description                                                                        |
|-----------------------------|------------------------------------------------------------------------------------|
| `--to <ADDR>`               | Recipient address, account name, or alias                                          |
| `--amount <N>`              | Number of credits to transfer (strictly positive integer)                          |
| `--expiration <RFC3339>`    | Optional expiration timestamp; unspent credits are returned after this time        |
| `-y, --yes`                 | Skip the confirmation prompt and submit immediately                                |
| `--channel <CHANNEL>`       | Optional channel for the underlying POST message                                   |
| `--json`                    | Output results as JSON                                                             |
| `--account <ACCOUNT>`       | Named account (defaults to the active account)                                     |
| `--private-key <KEY>`       | Hex-encoded private key                                                            |
| `--chain <CHAIN>`           | Signing chain                                                                      |
| `--dry-run`                 | Build and sign the message but don't submit it                                     |
| `--help`                    | Show this message and exit                                                         |

```bash
# Transfer credits to a named account or alias
aleph credit transfer --to bob --amount 1000000

# Transfer to a hex address
aleph credit transfer --to 0xab12... --amount 500000

# Transfer with an expiration date
aleph credit transfer --to bob --amount 250000 \
  --expiration 2026-12-31T23:59:59Z
```

## Related Commands

- [Pricing](./pricing.md) - View pricing information for services payable with credits
