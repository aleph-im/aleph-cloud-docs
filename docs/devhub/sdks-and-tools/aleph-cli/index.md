# Aleph Cloud Command-Line Interface

The Aleph Cloud CLI provides a powerful command-line interface to interact with all features of the Aleph Cloud network directly from your terminal.

## Installation

### Prerequisites

Before installing the CLI, ensure you have the necessary dependencies:

::: code-group

```bash [Linux]
apt-get install -y python3-pip libsecp256k1-dev
```

```bash [macOS]
brew tap cuber/homebrew-libsecp256k1
brew install libsecp256k1
```

:::

### Recommended Installation (pipx)

We recommend using [pipx](https://github.com/pypa/pipx) to install the CLI:

`pipx` installs tools in isolated environments, ensuring that it does not mess up with your system.

```bash
# Install pipx if you don't have it
python3 -m pip install --user pipx
python3 -m pipx ensurepath

# Install Aleph CLI
pipx install aleph-client
```

### Alternative Installation Methods

::: code-group

```bash [Python]
python3 -m venv aleph-env
source aleph-env/bin/activate
pip install aleph-client
```

```bash [Docker]
docker run --rm -ti \
    -v $(pwd)/data:/data \
    ghcr.io/aleph-im/aleph-client/aleph-client:master \
    --help
```

:::
::: info

> ⚠️ Using _Docker_ will create an ephemeral key that will be discarded when the container stops.
> :::

## Command Overview

The Aleph CLI is organized into logical command groups that correspond to different Aleph Cloud features:

| Options | Argument | Description |
|---------|----------|-------------|
| `--install-completion` | [bash / zsh / fish / powershell /pwsh] | Install completion for the specified shell. [default: None] |
| `--show-completion` | [bash / zsh / fish / powershell / pwsh] | Show completion for the specified shell to copy it or customize the installation [default: None] |
| `--help` | | Show the usage message |

| Command | Description |
|---------|-------------|
| `account` | Manage accounts, keys, and balances |
| `message` | Create, find, and manage messages |
| `aggregate` | Work with aggregate messages and permissions |
| `file` | Upload, pin, and manage files on IPFS |
| `program` | Deploy and manage serverless functions |
| `instance` | Create and manage virtual machine instances |
| `domain` | Configure custom domains for your deployments |
| `node` | Get information about network nodes |
| `pricing` | View pricing for Aleph Cloud services |
| `about` | Display version information |

## Getting Started {#getting-started}

### First-time Setup

When using the CLI for the first time:

Using private key :

```bash
# Create a new Ethereum private key
aleph account create

# Import an existing private key
aleph account create --private-key YOUR_PRIVATE_KEY
```

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
# Configure ledger
aleph account config --account-type external
```

### Checking Your Configuration

Verify your setup is working correctly:

```bash
# Show your account configuration
aleph account show

# Display your public address
aleph account address

# Check your ALEPH token balance
aleph account balance
```

## Troubleshooting {#troubleshooting}

If you encounter issues with the CLI:

- Ensure you have the latest version: `pip install -U aleph-client`
- Check that your private key is correctly configured: `aleph account show`
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
- [Pricing Information](./commands/pricing.md)
- [Aggregate Management](./commands/aggregate.md)
- [Domain Configuration](./commands/domain.md)
- [Node Computing](./commands/node.md)
- [Credits Management](./commands/credits.md)
- [About](./commands/about.md)

## Structure

```
Accounts:
├─ aleph account create
├─ aleph account address
├─ aleph account chain
├─ aleph account path
├─ aleph account show
├─ aleph account config
├─ aleph account export-private-key
├─ aleph account sign-bytes
├─ aleph account balance
├─ aleph account list
└─ aleph account vouchers

Programs:
├─ aleph program create (alias: upload)
├─ aleph program update
├─ aleph program delete
├─ aleph program list
├─ aleph program persist
├─ aleph program unpersist
├─ aleph program logs
└─ aleph program runtime-checker

Instances (Compute / VMs):
├─ aleph instance create
├─ aleph instance delete
├─ aleph instance list
├─ aleph instance reboot
├─ aleph instance allocate
├─ aleph instance stop
├─ aleph instance logs
├─ aleph instance confidential-init-session
├─ aleph instance confidential-start
├─ aleph instance confidential
├─ aleph instance gpu
└─ aleph instance port-forwarder [list|create|update|delete|refresh]

Files & Storage:
├─ aleph file upload
├─ aleph file pin
├─ aleph file download
├─ aleph file forget
└─ aleph file list

Messages:
├─ aleph message get
├─ aleph message find
├─ aleph message post
├─ aleph message amend
├─ aleph message forget
├─ aleph message watch
└─ aleph message sign

Aggregates:
├─ aleph aggregate post
├─ aleph aggregate get
├─ aleph aggregate list
├─ aleph aggregate forget
├─ aleph aggregate authorize
├─ aleph aggregate revoke
└─ aleph aggregate permissions

Domains:
├─ aleph domain add
├─ aleph domain attach
├─ aleph domain detach
└─ aleph domain info

Credits:
├─ aleph credits show
└─ aleph credits history

Nodes & Network:
├─ aleph node compute
└─ aleph node core

Pricing:
└─ aleph pricing [service]

Operations / Meta:
├─ aleph about version
└─ aleph --help
```
