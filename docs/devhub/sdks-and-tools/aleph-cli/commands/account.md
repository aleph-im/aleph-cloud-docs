# Account Management

The `account` command group helps you manage your Aleph.im identity, private keys, and account information.

## Key Commands

| Command | Description |
|---------|-------------|
| `create` | Create or import a private key |
| `address` | Display your public address(es) |
| `balance` | Check your ALEPH token balance |
| `chain` | Display the currently active chain |
| `path` | Display the directory path where your private keys, config file, and other settings are stored |
| `show` | Display your current configuration |
| `config` | Configure your private key file and active chain |
| `export-private-key` | Display your private key (use with caution) |
| `sign-bytes` | Sign a message using your private key |
| `list` | Display available private keys, along with currenlty active chain and account (from config file) |

## Creating or Importing a Key

### Usage

```bash
aleph account create [OPTIONS]
```

#### Options

| Options | Argument | Description |
|---------|----------|-------------|
| `--private-key` | TEXT | Your private key. Cannot be used with --private-key-file |
| `--private-key-file` | PATH | Path to your private key file |
| `--chain` | [ARB, AVAX, BASE, BLAST, BOB, BSC, CSDK, CYBER, DOT, ETH, FRAX, INK, LINEA, LISK, METIS, MODE, NEO, NULS, NULS2, OP, POL, SOL, TEZOS, WLD, ZORA] | Chain of origin of your private key (ensuring correct parsing) |
| `--replace / --no-replace` | | Overwrites private key file if it already exists [default: no-replace] |
| `--active / --no-active` | | Loads the new private key after creation [default: active] |
| `--debug / --no-debug` | | [default: no-debug] |
| `--help` | | Show this message and exit |


Before using most Aleph.im features, you'll need a private key:

```bash
# Create a new Ethereum private key
aleph account create

# Import an existing private key
aleph account create --private-key YOUR_PRIVATE_KEY

# Import from a file
aleph account create --private-key-file /path/to/key.txt
```

## Checking Your Address and Balance

```bash
# Display your public address
aleph account address

# Check your ALEPH token balance
aleph account balance
```

## Managing Multiple Keys

The CLI supports multiple keys for different chains:

```bash
# List all available keys
aleph account list

# Configure which key to use
aleph account config

# Show current configuration
aleph account show
```

## Chain Support

Aleph.im supports multiple blockchains. Specify the chain when needed:

```bash
# Create a key for a specific chain
aleph account create --chain ETH

# Check balance on a specific chain
aleph account balance --chain SOL
```

Supported chains include:
- ETH (Ethereum)
- SOL (Solana)
- BSC (Binance Smart Chain)
- AVAX (Avalanche)
- And many others (use `--help` to see all options)

## Security Considerations

- **NEVER** share your private key with anyone
- Use `export-private-key` only when absolutely necessary
- Consider using hardware wallets for additional security
- Back up your keys securely

## Troubleshooting

If you encounter issues:

- Check your key path with `aleph account path`
- Verify your configuration with `aleph account show`
- Ensure you have the correct permissions for key files
- Try recreating your key if it's corrupted
