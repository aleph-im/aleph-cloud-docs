# Confidential Computing Requirements

This page outlines the requirements for creating and deploying confidential virtual machines on Aleph Cloud.

## System Requirements

Creating a confidential virtual machine currently requires the creation of an encrypted disk on a machine you trust. Your system must meet the following requirements:

- **Operating System**: Linux on x86_64 architecture (64-bit CPU, most recent PCs but not Mac)
- **Network**: IPv6 connectivity
- **CPU**: AMD CPU with SEV (Secure Encrypted Virtualization) support for production use

The documentation below assumes a Linux system based on [Debian](https://www.debian.org/) or [Ubuntu](https://ubuntu.com/), but the procedure can be adjusted to other distributions.

::: info Note
This requirement will be lifted in the future with confidential virtual machines that encrypt the filesystem themselves.
:::

## Required Software

To create and deploy confidential virtual machines, you'll need the following software:

### 1. aleph-client

The `aleph-client` command-line tool is used to interact with the Aleph Cloud network. Install it using:

```bash
pip install aleph-client
```

For detailed installation instructions, see the [aleph-client documentation](/tools/aleph-cli/).

### 2. sevctl

The `sevctl` tool from AMD is used to manage SEV encryption keys. To install it:

First, install Rust and Cargo:

```bash
curl https://sh.rustup.rs -sSf | sh
```

Some packages may need to be installed on some systems (e.g., Ubuntu) to build sevctl:

```bash
apt install -y pkg-config libssl-dev asciidoctor
```

Then install sevctl using Cargo:

```bash
cargo install sevctl
set --export PATH ~/.cargo/bin:$PATH
```

::: info Windows Users
On Windows, we recommend using [WSL](https://learn.microsoft.com/en-us/windows/wsl/install) and following the same steps above.
:::

### 3. guestmount

This tool is used to create the encrypted disk. On Debian/Ubuntu-based systems, install it using:

```bash
apt install guestmount
```

Note: This installation may require up to 119 dependencies and 178 MB of additional disk space.

### 4. OpenSSH Keypair

You'll need an SSH keypair to securely access your confidential VM. If you don't already have one, create it using:

```bash
ssh-keygen -t ed25519 -C "your_email@example.com"
```

### 5. IPFS Server

The encrypted filesystem you will create is close to 4 GB. To copy it to the Aleph Cloud decentralized network, you first need to make it available on [IPFS](https://ipfs.tech/).

Install IPFS (Kubo implementation) by following the [official installation guide](https://docs.ipfs.tech/install/command-line/).

Quick installation for Linux:

```bash
wget https://dist.ipfs.tech/kubo/v0.18.1/kubo_v0.18.1_linux-amd64.tar.gz
tar -xvzf kubo_v0.18.1_linux-amd64.tar.gz
cd kubo
sudo bash install.sh
ipfs init
```

### 6. Optional: Qemu

Qemu is useful for testing your VM locally before deploying it to Aleph Cloud. Install it using:

```bash
apt install qemu-system-x86
```

## Hardware Requirements for Running Confidential VMs

If you're a node operator wanting to support confidential computing on your Compute Resource Node (CRN), you'll need:

- **CPU**: AMD EPYC processor with SEV support
- **Firmware**: Up-to-date BIOS with SEV enabled
- **Memory**: At least 64GB RAM (128GB recommended)
- **Storage**: Fast SSD storage (NVMe preferred)

## Verifying SEV Support

To check if your system supports SEV, run:

```bash
sevctl show
```

If SEV is supported and enabled, you'll see output similar to:

```
Platform Version: 0x17
Owner: Not Present
```

If you get an error or "SEV is not enabled," you may need to enable it in your BIOS settings.

## Next Steps

Once you have all the requirements in place, you can proceed to:

1. [Creating an encrypted disk image](/devhub/computing/confidential/encrypted-disk)
2. [Deploying a confidential instance on Aleph Cloud](/devhub/computing/confidential/instance)

If you encounter any issues with the setup, refer to our [troubleshooting guide](/devhub/computing/confidential/troubleshooting).
