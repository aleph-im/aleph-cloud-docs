# Aleph Cloud Command-Line Interface

The Aleph Cloud CLI provides a powerful command-line interface to interact with all features of the Aleph Cloud network directly from your terminal.

## Installation

::: code-group
```sh [macOS]
brew install aleph-im/homebrew-tap/aleph-cli
```
```sh [Linux (Debian/Ubuntu)]
curl -fsSL https://apt.aleph.im/install.sh | sudo bash
sudo apt install aleph-cli
```
```sh [Cargo (any platform)]
cargo install aleph-cli
```
:::

Prebuilt binaries for Linux/macOS/Windows are also published at
<https://github.com/aleph-im/aleph-rs/releases/latest>. After installing, enable
shell completion with `aleph completions <bash|elvish|fish|powershell|zsh>`.

## Command Overview

The Aleph CLI is organized into logical command groups. Run `aleph <group> --help` for full details on any group.

| Command | Description |
|---------|-------------|
| `account` | Manage local accounts and signing keys |
| `credit` | Buy and manage Aleph credits |
| `file` | Upload, download, and manage files |
| `instance` | Create and manage VM instances |
| `program` | Deploy and manage serverless functions / micro-VMs |
| `aggregate` | Create aggregate key-value entries |
| `post` | List, create, and amend posts |
| `message` | Query, sync, and forget raw protocol messages |
| `domain` | Manage custom domains attached to websites, programs, or instances |
| `node` | Register, stake, and manage network nodes |
| `authorization` | Manage delegated authorizations |
| `config` | Manage CLI configuration (networks, CCN endpoints, etc.) |
| `website` | Deploy and manage static websites |

## Getting Started {#getting-started}

### First-time Setup

When using the CLI for the first time, create a new account or import an existing key:

```bash
# Create a new Ethereum account named "alice"
aleph account create alice

# Set it as the default for signing commands
aleph account use alice

# Verify your setup
aleph account show
```

See [Account Management](./commands/account.md) for the full workflow including imports, Ledger support, and key migration.

## Using Ledger

### Linux Prerequisites

To use Ledger with the CLI, you need to set up the Ledger udev rules that allow interaction with the device:

```shell
git clone https://github.com/LedgerHQ/udev-rules/
cd udev-rules

sudo sh add_udev_rules.sh
```

### Setup Ledger

Make sure your Ledger device is:

- Connected to your computer
- Unlocked
- Open on the Ethereum app

Then:

```bash
# Import a Ledger account named "ledger-main"
aleph account import ledger-main --ledger

# Set it as the default
aleph account use ledger-main
```

### Checking Your Configuration

Verify your setup is working correctly:

```bash
# Show your account details
aleph account show

# Check your ALEPH token balance
aleph account balance
```

## Troubleshooting {#troubleshooting}

If you encounter issues with the CLI:

- Ensure you have the latest version: update via your install method (`brew upgrade aleph-cli`, `sudo apt update && sudo apt install --only-upgrade aleph-cli`, or re-download the binary)
- Check that your account is correctly configured: `aleph account show`
- For permission errors, verify you have the correct permissions for the operation
- If you find a bug, please [report an issue](https://github.com/aleph-im/support/issues)

## Next Steps

Explore the detailed documentation for each command group:

- [Account Management](./commands/account.md)
- [Message Management](./commands/message.md)
- [File Operations](./commands/file.md)
- [Program Deployment](./commands/program.md)
- [Instance Management](./commands/instance.md)
- [Port Forwarding](./commands/port-forwarder.md)
- [Aggregate Management](./commands/aggregate.md)
- [Domain Configuration](./commands/domain.md)
- [Node Computing](./commands/node.md)
- [Credits Management](./commands/credits.md)

## Structure

```
aleph account   → create, import, use, show, list, remove, export, balance, migrate, alias

aleph credit    → buy, transfer, history

aleph file      → upload, download, list, pin, delete

aleph instance  → create, list, show, start, stop, reboot, logs, ssh, delete, erase,
                  price, port-forward (pfw), backup

aleph program   → create, update, delete, list, show, persist, unpersist, logs

aleph aggregate → create, get, list, forget

aleph post      → create, amend, list

aleph message   → get, list, forget, retry, sync

aleph domain    → list, add, attach, detach, remove

aleph node      → list (+ register/stake/link - see `aleph node --help`)

aleph authorization → add, list, received, revoke

aleph config    → network …, ccn …

aleph website   → deploy, update, list, show, delete
```
