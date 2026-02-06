# Account Management

The `account` command group helps you manage your Aleph Cloud identity, private keys, and account information.

## Overall Usage

```bash
aleph account [OPTIONS] KEY_COMMAND [ARGS]...
```

### Options

| Command | Description |
|---------|-------------|
| `--help` | Show the help prompt and exit |

### Key Commands

| Command              | Description                                                                                      |
|----------------------|--------------------------------------------------------------------------------------------------|
| `create`             | Create or import a private key                                                                   |
| `address`            | Display your public address(es)                                                                  |
| `balance`            | Check your ALEPH token balance                                                                   |
| `chain`              | Display the currently active chain                                                               |
| `path`               | Display the directory path where your private keys, config file, and other settings are stored   |
| `show`               | Display your current configuration                                                               |
| `config`             | Configure your private key file and active chain                                                 |
| `export-private-key` | Display your private key (use with caution)                                                      |
| `sign-bytes`         | Sign a message using your private key                                                            |
| `list`               | Display available private keys, along with currently active chain and account (from config file) |
| `vouchers`           | Display detailed information about your vouchers.                                                |


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
| `--key-format` | [hexadecimal, base32, base64] | Encoding format of the private key [default: hexadecimal] |
| `--debug / --no-debug` | | Enable debug logging [default: no-debug] |
| `--help` | | Show this message and exit |


Before using most Aleph Cloud features, you'll need a private key:

```bash
# Create a new Ethereum private key
aleph account create

# Import an existing private key
aleph account create --private-key YOUR_PRIVATE_KEY

# Import from a file
aleph account create --private-key-file /path/to/key.txt
```
## Accounts Config

Configure your default account settings, including private key file, chain, and account type (hardware wallet or imported key).

### Usage

```bash
aleph account config [OPTIONS]
```

#### Options

| Options          | Argument                                                                                                                                         | Description                                                            |
|------------------|--------------------------------------------------------------------------------------------------------------------------------------------------|------------------------------------------------------------------------|
| `--private-key-file`  | FILE                                                                                                                                             | Path to the private key file (optional for Ledger)                   |
| `--chain`        | [ARB, AVAX, BASE, BLAST, BOB, BSC, CSDK, CYBER, DOT, ETH, FRAX, INK, LINEA, LISK, METIS, MODE, NEO, NULS, NULS2, OP, POL, SOL, TEZOS, WLD, ZORA] | Chain of origin of your private key         |
| `--address`      | TEXT                                                                                                                                             | Address to use (required for hardware wallet) |
| `--account-type` | [imported, hardware] | Account type: `imported` for private key file, `hardware` for Ledger device |
| `--derivation-path` | TEXT | Derivation path for Ledger (e.g., "44'/60'/0'/0/0") |
| `--ledger-count` | INTEGER | Number of Ledger accounts to fetch [default: 5] |
| `--non-it` | | Non-interactive mode. Only apply provided options without prompts |
| `--help` | | Show this message and exit |

```bash
# Make CLI use Ledger Accounts
aleph account config --account-type hardware --address ledger_address --chain ETH

# Make CLI use private key
aleph account config --private-key-file path --chain ETH

# Configure with a specific derivation path for Ledger
aleph account config --account-type hardware --derivation-path "44'/60'/0'/0/0" --chain ETH

# Non-interactive configuration
aleph account config --non-it --private-key-file my_key.key --chain ETH
```

## Checking Your Address and Balance

```bash
# Display your public address
aleph account address

# Check your ALEPH token balance
aleph account balance
```

## Checking Voucher
````
aleph account vouchers
````

## Managing Multiple Keys

The CLI supports multiple keys for different chains and hardware wallets (Ledger).

### List Command

Display available private keys, along with currently active chain and account.

```bash
aleph account list [OPTIONS]
```

#### Options

| Option | Type | Description |
|--------|------|-------------|
| `--ledger-count` | INTEGER | Number of Ledger accounts to display [default: 5] |
| `--help` | | Show this message and exit |

```bash
# List all available keys
aleph account list

# List keys with more Ledger accounts
aleph account list --ledger-count 10

# Configure which key to use
aleph account config

# Show current configuration
aleph account show
```

## Chain Support

Aleph Cloud supports multiple blockchains. Specify the chain when needed:

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
