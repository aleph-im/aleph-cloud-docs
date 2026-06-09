# Account Management

The `account` command group helps you manage your Aleph Cloud identity, private keys, and account information. Keys are stored in the **OS keychain** - they never touch disk as plain files.

::: tip Coming from the Python CLI?
Run `aleph account migrate` to import the keys from your existing `~/.aleph-im/`
configuration. Add `--dry-run` to preview what would be imported.
:::

## Overall Usage

```bash
aleph account <COMMAND> [OPTIONS]
```

### Commands

| Command | Description |
|---------|-------------|
| `create` | Generate a new private key and store it in the OS keychain |
| `import` | Import an existing private key (hex, file, or Ledger) |
| `use` | Set the default account used for signing |
| `show` | Show details of an account (defaults to the active account) |
| `list` | List all stored accounts |
| `balance` | Show the balance of any address |
| `export` | Export the private key of a local account |
| `remove` | Remove an account from the keychain |
| `alias` | Manage address aliases (bookmarks for external addresses) |
| `migrate` | Migrate accounts from the Python CLI (`~/.aleph-im/`) |

---

## Creating an Account

Generate a fresh private key and store it in the OS keychain under the given name. The key never touches disk.

```bash
aleph account create <NAME> [--chain <CHAIN>]
```

### Options

| Option | Description |
|--------|-------------|
| `--chain <CHAIN>` | Chain for the new account (default: `eth`) |

Supported chains include `eth`, `sol`, `bsc`, `arb`, `avax`, `base`, `op`, `pol`, and many others. Run `aleph account create --help` for the full list.

### Examples

```bash
# Create an EVM account (default chain: eth)
aleph account create alice

# Create a Solana account
aleph account create alice --chain sol

# Set as the default signing account
aleph account use alice
```

---

## Importing an Existing Key

Import an existing private key into the OS keychain under a given name. Three sources are supported (mutually exclusive):

```bash
aleph account import <NAME> [SOURCE] [OPTIONS]
```

### Sources

| Flag | Description |
|------|-------------|
| `--private-key <HEX>` | Hex-encoded private key on the command line. If omitted (and no other source given), the key is read from stdin so it does not appear in shell history. |
| `--from-file <PATH>` | Read from a file containing a raw 32-byte binary key or a hex-encoded text key. |
| `--ledger` | Use a Ledger hardware wallet. Combine with `--derivation-path` to override the default BIP44 path, and `--ledger-count` to fetch more than the default 5 candidate addresses. |

### Additional Options

| Option | Description |
|--------|-------------|
| `--chain <CHAIN>` | Chain for the imported account (default: `eth`) |
| `--derivation-path <PATH>` | BIP44 derivation path override (only with `--ledger`) |
| `--ledger-count <N>` | Number of addresses to fetch from the Ledger (only with `--ledger`, default: `5`) |

### Examples

```bash
# Import via hex private key
aleph account import alice --private-key 0xabcd1234...

# Import from a key file
aleph account import alice --from-file ~/keys/alice.key

# Import via stdin (key does not appear in shell history)
echo "0xabcd1234..." | aleph account import alice

# Import from a Ledger hardware wallet (EVM only)
aleph account import alice --ledger

# Import a Ledger account with a custom derivation path
aleph account import alice --ledger --derivation-path "44'/60'/0'/0/1"
```

::: warning Ledger is EVM-only
Ledger support is currently limited to EVM accounts. Importing a Solana Ledger
account works, but signing with it does not, so the account is unusable for
transactions. Use `aleph account create` or `aleph account import --from-file`
for Solana keys.
:::

---

## Selecting the Default Account

Set which stored account is used by default for all signing commands.

```bash
aleph account use <NAME>
```

### Example

```bash
aleph account use alice
```

---

## Inspecting Accounts

### Show Account Details

Display details for a specific account, or the active account if no name is given.

```bash
aleph account show [NAME]
```

### List All Accounts

List every account known to the CLI: keys stored in the OS keychain *and*
Ledger-backed accounts (which live on the device, not the keychain).

```bash
aleph account list
```

### Check Balance

Show the ALEPH balance for any address - accepts a local account name, an alias, or a raw `0x…` address. Defaults to the active account if omitted.

```bash
aleph account balance [ADDRESS]
```

#### Examples

```bash
# Balance of the active account
aleph account balance

# Balance by account name
aleph account balance alice

# Balance by raw address
aleph account balance 0xYourAddress...
```

### Export a Private Key

Display the private key for a local account. **Use with caution - never share your private key with anyone.**

```bash
aleph account export <NAME>
```

The CLI will ask for confirmation before printing the key. Pass `--yes` to skip the prompt.

---

## Removing an Account

Remove an account from the OS keychain. The CLI will prompt you to type the account name to confirm.

```bash
aleph account remove <NAME>
```

Pass `-y` / `--yes` to skip the confirmation prompt.

---

## Aliases

Aliases are bookmarks for external addresses - useful for labelling addresses you interact with frequently, without importing their keys.

```bash
aleph account alias add <NAME> <ADDRESS>
aleph account alias list
aleph account alias remove <NAME>
```

### Examples

```bash
# Bookmark an external address
aleph account alias add treasury 0xAbCd1234...

# List all aliases
aleph account alias list

# Remove an alias
aleph account alias remove treasury
```

---

## Migrating from the Python CLI

If you previously used the Python-based CLI, your keys live in `~/.aleph-im/`. Import them into the Rust CLI's OS keychain with:

```bash
# Preview what would be imported (no changes made)
aleph account migrate --dry-run

# Perform the migration
aleph account migrate
```

### Options

| Option | Description |
|--------|-------------|
| `--python-home <PATH>` | Path to the Python CLI config directory (defaults to `~/.aleph-im`) |
| `--dry-run` | Show what would be imported without actually importing |

---

## Identity Overrides on Signing Commands

Most commands that write to the network accept identity overrides so you can sign as a different account without changing the default:

| Method | Usage |
|--------|-------|
| `--account <NAME>` | Use a named account from the keychain |
| `--private-key <HEX>` | Provide a raw hex private key inline. `--chain <CHAIN>` is required when signing with a raw key. |
| `ALEPH_PRIVATE_KEY` env var | Set a hex private key in the environment |

---

## Security Considerations

- Keys are stored in the **OS keychain** - they are never written to disk as plain files.
- **NEVER** share your private key with anyone.
- Use `aleph account export` only when absolutely necessary, and treat the output as a secret.
- Consider using a Ledger hardware wallet for high-value accounts.
- Back up your keys securely before removing them with `aleph account remove`.
