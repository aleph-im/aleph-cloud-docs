# Aleph Cloud Command-Line Interface

The Aleph Cloud CLI provides a powerful command-line interface to interact with all features of the Aleph.im network directly from your terminal.

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
:::
## Command Overview

The Aleph CLI is organized into logical command groups that correspond to different Aleph.im features:

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
| `pricing` | View pricing for Aleph.im services |

## Getting Started

### First-time Setup

When using the CLI for the first time, you'll need to create or import a private key:

```bash
# Create a new Ethereum private key
aleph account create

# Import an existing private key
aleph account create --private-key YOUR_PRIVATE_KEY
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

## Troubleshooting

If you encounter issues with the CLI:

- Ensure you have the latest version: `pip install -U aleph-client`
- Check that your private key is correctly configured: `aleph account show`
- For permission errors, verify you have the correct permissions for the operation
- If you find a bug, please [report an issue](https://github.com/aleph-im/support/issues)

## Next Steps

Explore the detailed documentation for each command group:

- [Account Management](./commands/account.md)
- [Working with Messages](./commands/message.md)
- [File Operations](./commands/file.md)
- [Program Deployment](./commands/program.md)
- [Instance Management](./commands/instance.md)
- [Domain Configuration](./commands/domain.md)
