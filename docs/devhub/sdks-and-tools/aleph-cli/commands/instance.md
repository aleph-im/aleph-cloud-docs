# Instance Management

The `instance` command group allows you to create and manage full virtual machine instances on the Aleph.im network.

## Key Commands

| Command | Description |
|---------|-------------|
| `create` | Create a new VM instance |
| `delete` | Delete an instance, unallocating all resources associated with it |
| `list` | List all instances associated to an account |
| `reboot` | Reboot an instance |
| `allocate` | Notify a CRN to start an instance (for Pay-As-You-Go and confidential instances only) |
| `logs` | Retrieve the logs of an instance |
| `stop` | Stop an instance
| `confidential-init-session` | Initialize a confidential communication session with the VM |
| `confidential-start` | Validate the authenticity of the VM and start it |
| `confidentia` | Create (optional), start and unlock a confidential VM (all-in-one command) |
| `gpu` | Create and register a new GPU instance on aleph.im |

## Creating an Instance

Create and register a new instance on aleph.im

### Usage:

```bash
aleph instance create [OPTIONS]
```

#### Options

| Options | Type | Description |
|---------|------|-------------|
| `--payment-type` | [hold, superfluid, nft] | Payment method, either holding tokens, NFTs, or Pay-As-You-Go via token streaming |
| `--payment-chain` | [AVAX, BASE, ETH, SOL] | Chain you want to use to pay for your instance |
| `--hypervisor` | [qemu, firecracker] | Hypervisor to use to launch your instance. Always defaults to QEMU, since Firecracker is now deprecated for instances [default: qemu] |
| `--name` | TEXT | Name of your new instance |
| `--rootfs` | TEXT | Hash of the rootfs to use for your instance. Defaults to Ubuntu 22. You can also create your own rootfs and pin it |
| `--compute-units` | INTEGER | Number of compute units to allocate. Compute units correspond to a tier that includes vcpus, memory, disk and gpu presets. For reference, run: aleph pricing --help |
| `--vcpus` | INTEGER | Number of virtual CPUs to allocate |
| `--memory` | INTEGER | Maximum memory (RAM) in MiB to allocate |
| `--rootfs-size` | INTEGER RANGE | Rootfs size in MiB to allocate. Set to 0 to use default tier value and to not get prompted [x<=1953125] |
| `--timeout-seconds` | FLOAT | If vm is not called after [timeout_seconds] it will shutdown [default: 30.0] |
| `--ssh-pubkey-file` | PATH | Path to a public ssh key to be added to the instance [default: /home/$USER/.ssh/id_rsa.pub] |
| `--address` | TEXT | Address of the payer. In order to delegate the payment, your account must be authorized beforehand to publish on the behalf of this address. See the docs for more info: https://docs.aleph.im/protocol/permissions/ |
| `--crn-hash` | TEXT | Hash of the CRN to deploy to (only applicable for confidential and/or Pay-As-You-Go instances) |
| `--crn-url` | TEXT | URL of the CRN to deploy to (only applicable for confidential and/or Pay-As-You-Go instances) |
| `--confidential / --no-confidential` |  | Launch a confidential instance (requires creating an encrypted volume) [default: no-confidential] |
| `--confidential-firmware` | TEXT | Hash to UEFI Firmware to launch confidential instance [default: ba5bb13f3abca960b101a759be162b229e2b7e93ecad9d1307e54de887f177ff] |
| `--gpu / --no-gpu` |  | Launch an instance attaching a GPU to it [default: no-gpu] |
| `--premium / --no-premium` |  | Use Premium GPUs (VRAM > 48GiB) |
| `--skip-volume / --no-skip-volume` |  | Skip prompt to attach more volumes [default: no-skip-volume] |
| `--persistent-volume` | TEXT | Persistent volumes are allocated on the host machine and are not deleted when the VM is stopped. Requires at least name, mount path, and size_mib. To add multiple, reuse the same argument. Example: --persistent-volume name=data,mount=/opt/data,size_mib=1000. For more info, see the docs: https://docs.aleph.im/computing/volumes/persistent/ |
| `--ephemeral-volume` | TEXT | Ephemeral volumes are allocated on the host machine when the VM is started and deleted when the VM is stopped. Requires at least mount path and size_mib. To add multiple, reuse the same argument. Example: --ephemeral-volume mount=/opt/tmp,size_mib=100 |
| `--immutable-volume` | TEXT | Immutable volumes are pinned on the network and can be used by multiple VMs at the same time. They are read-only and useful for setting up libraries or other dependencies. Requires at least mount path and ref (volume message hash). use_latest is True by default, to use the latest version of the volume, if it has been amended. To add multiple, reuse the same argument. Example: --immutable-volume mount=/opt/packages,ref=25a3...8d94. For more info, see the docs: https://docs.aleph.im/computing/volumes/immutable/ |
| `--crn-auto-tac / --no-crn-auto-tac` |  | Automatically accept the Terms & Conditions of the CRN if you read them beforehand [default: no-crn-auto-tac] |
| `--channel` | TEXT | Aleph.im network channel where the message is or will be broadcasted [default: ALEPH-CLOUDSOLUTIONS] |
| `--private-key` | TEXT | Your private key. Cannot be used with --private-key-file |
| `--private-key-file` | PATH | Path to your private key file [default: /home/$USER/.aleph-im/private-keys/ethereum.key] |
| `--print-message / --no-print-message` |  | Print the message after creation [default: no-print-message] |
| `--verbose / --no-verbose` |  | Display additional information [default: verbose] |
| `--debug / --no-debug` |  | Enable debug logging [default: no-debug] |
| `--help` |  | Show this message and exit |

```bash
# Create an instance
aleph instance create

# Create an instance using hold payment and a specific config
aleph instance create \
  --payment-type nft \
  --payment-chain BASE \
  --compute-units 1 \
  --skip-volume \
  --rootfs debian12 \
  --name vm-nft

# Create an instance using PAYG and a speicif CRN
aleph instance create \
  --payment-type superfluid \
  --payment-chain BASE \
  --compute-units 1 \
  --skip-volume \
  --rootfs debian12 \
  --crn-url https://gpu-test-01.nergame.app \
  --name vm-payg \
  --crn-auto-tac

# Creating a confidential instance
aleph instance confidential \
  --payment-type nft \
  --payment-chain BASE \
  --compute-units 1 \
  --skip-volume \
  --crn-url https://coco-1.crn.aleph.sh \
  --no-keep-session \
  --rootfs debian12 \
  --name vm-confidential \
  --crn-auto-tac
```

## Deleting an Instance

Delete an instance, unallocating all resources associated with it. Associated VM will be stopped and erased. Immutable volumes will not be deleted.

### Usage

```bash
aleph instance delete [OPTIONS] ITEM_HASH
```

#### Arguments

| Argument | Type | Description |
|----------|------|-------------|
| `ITEM_HASH` | ITEM HASH | Instance item hash to forget |

#### Options

| Options | Type | Description |
|---------|------|-------------|
| `--reason` | TEXT | Reason for deleting the instance [default: User deletion] |
| `--chain` | [ARB, AVAX, BASE, BLAST, BOB, BSC, CSDK, CYBER, DOT, ETH, FRAX, INK, LINEA, LISK, METIS, MODE, NEO, NULS, NULS2, OP, POL, SOL, TEZOS, WLD, ZORA] | Chain you are using to pay for your instance |
| `--domain` | TEXT | Domain of the CRN where an associated VM is running. It ensures your VM will be stopped and erased on the CRN before the instance message is actually deleted |
| `--private-key` | TEXT | Your private key. Cannot be used with --private-key-file |
| `--private-key-file` | PATH | Path to your private key file [default: /home/$USER/.aleph-im/private-keys/ethereum.key] |
| `--print-message / --no-print-message` |  | Print the message after deletion [default: no-print-message] |
| `--debug / --no-debug` |  | Enable debug logging [default: no-debug] |
| `--help` |  | Show this message and exit |

```bash
# Delete an instance
aleph instance delete ITEM_HASH
```

Listing Instances

List all instances associated to an account

### Usage

```bash
aleph instance list [OPTIONS]
```

#### Options

| Options | Type | Description |
|---------|------|-------------|
| `--address` | TEXT | Owner address of the instances |
| `--private-key` | TEXT | Your private key. Cannot be used with --private-key-file |
| `--private-key-file` | PATH | Path to your private key file [default: /home/$USER/.aleph-im/private-keys/ethereum.key] |
| `--chain` | [ARB, AVAX, BASE, BLAST, BOB, BSC, CSDK, CYBER, DOT, ETH, FRAX, INK, LINEA, LISK, METIS, MODE, NEO, NULS, NULS2, OP, POL, SOL, TEZOS, WLD, ZORA] | Chain you are using to pay for your instance |
| `--json / --no-json` |  | Print as json instead of rich table [default: no-json] |
| `--debug / --no-debug` |  | Enable debug logging [default: no-debug] |
| `--help` |  | Show this message and exit |

```bash
# Listing your instances
aleph instance list

# Listing ADDRESS instances as json
aleph instance list --address ADDRESS --json
```

## Rebooting an instance

Reboot an instance

### Usage

```bash
aleph instance reboot [OPTIONS] VM_ID
```
##### Arguments

| Argument | Type | Description |
|----------|------|-------------|
| `VM_ID` | VM ID | VM item hash to reboot |

#### Options

| Options | Type | Description |
|---------|------|-------------|
| `--domain` | TEXT | Domain of the CRN where an associated VM is running. It ensures your VM will be stopped and erased on the CRN before the instance message is actually deleted |
| `--chain` | [ARB, AVAX, BASE, BLAST, BOB, BSC, CSDK, CYBER, DOT, ETH, FRAX, INK, LINEA, LISK, METIS, MODE, NEO, NULS, NULS2, OP, POL, SOL, TEZOS, WLD, ZORA] | Chain you are using to pay for your instance |
| `--private-key` | TEXT | Your private key. Cannot be used with --private-key-file |
| `--private-key-file` | PATH | Path to your private key file [default: /home/$USER/.aleph-im/private-keys/ethereum.key] |
| `--debug / --no-debug` |  | Enable debug logging [default: no-debug] |
| `--help` |  | Show this message and exit |

```bash
# Reboot an instance
aleph instance reboot VM ID
```

## Allocate an instance

Notify a CRN to start an instance (for Pay-As-You-Go and confidential instances only)

### Usage

```bash
aleph instance allocate [OPTIONS] VM_ID
```

#### Arguments

| Argument | Type | Description |
|----------|------|-------------|
| `VM_ID` | VM ID | VM item hash to allocate |

#### Options

| Options | Type | Description |
|---------|------|-------------|
| `--domain` | TEXT | Domain of the CRN where an associated VM is running. It ensures your VM will be stopped and erased on the CRN before the instance message is actually deleted |
| `--chain` | [ARB, AVAX, BASE, BLAST, BOB, BSC, CSDK, CYBER, DOT, ETH, FRAX, INK, LINEA, LISK, METIS, MODE, NEO, NULS, NULS2, OP, POL, SOL, TEZOS, WLD, ZORA] | Chain you are using to pay for your instance |
| `--private-key` | TEXT | Your private key. Cannot be used with --private-key-file |
| `--private-key-file` | PATH | Path to your private key file [default: /home/$USER/.aleph-im/private-keys/ethereum.key] |
| `--debug / --no-debug` |  | Enable debug logging [default: no-debug] |
| `--help` |  | Show this message and exit |

```bash
# Allocating an instance
aleph instance allocate VM ID
```

## Check instance logs

Retrieve the logs of an instance

### Usage

```bash
aleph instance logs [OPTIONS] VM_ID
```

#### Arguments

| Argument | Type | Description |
|----------|------|-------------|
| `VM_ID` | VM ID | VM item hash to retrieve the logs from |

#### Options

| Options | Type | Description |
|---------|------|-------------|
| `--domain` | TEXT | Domain of the CRN where an associated VM is running. It ensures your VM will be stopped and erased on the CRN before the instance message is actually deleted |
| `--chain` | [ARB, AVAX, BASE, BLAST, BOB, BSC, CSDK, CYBER, DOT, ETH, FRAX, INK, LINEA, LISK, METIS, MODE, NEO, NULS, NULS2, OP, POL, SOL, TEZOS, WLD, ZORA] | Chain you are using to pay for your instance |
| `--private-key` | TEXT | Your private key. Cannot be used with --private-key-file |
| `--private-key-file` | PATH | Path to your private key file [default: /home/$USER/.aleph-im/private-keys/ethereum.key] |
| `--debug / --no-debug` |  | Enable debug logging [default: no-debug] |
| `--help` |  | Show this message and exit |

```bash
# Retrieve logs of an instance
aleph instance logs VM ID
```

## Stop an instance

### Usage

```bash
aleph instance stop [OPTIONS] VM_ID
```

#### Arguments

| Argument | Type | Description |
|----------|------|-------------|
| `VM_ID` | VM ID | VM item hash to stop |

#### Options

| Options | Type | Description |
|---------|------|-------------|
| `--domain` | TEXT | Domain of the CRN where an associated VM is running. It ensures your VM will be stopped and erased on the CRN before the instance message is actually deleted |
| `--chain` | [ARB, AVAX, BASE, BLAST, BOB, BSC, CSDK, CYBER, DOT, ETH, FRAX, INK, LINEA, LISK, METIS, MODE, NEO, NULS, NULS2, OP, POL, SOL, TEZOS, WLD, ZORA] | Chain you are using to pay for your instance |
| `--private-key` | TEXT | Your private key. Cannot be used with --private-key-file |
| `--private-key-file` | PATH | Path to your private key file [default: /home/$USER/.aleph-im/private-keys/ethereum.key] |
| `--debug / --no-debug` |  | Enable debug logging [default: no-debug] |
| `--help` |  | Show this message and exit |

```bash
# Retrieve logs of an instance
aleph instance delete VM ID
```

## Initialize a Confidential Communication

Initialize a confidential communication session with the VM

### Usage

```bash
aleph instance confidential-init-session [OPTIONS] VM_ID
```

#### Arguments

| Argument | Type | Description |
|----------|------|-------------|
| `VM_ID` | VM ID | VM item hash to initialize the session for |

#### Options

| Options | Type | Description |
|---------|------|-------------|
| `--domain` | TEXT | Domain of the CRN where an associated VM is running. It ensures your VM will be stopped and erased on the CRN before the instance message is actually deleted |
| `--chain` | [ARB, AVAX, BASE, BLAST, BOB, BSC, CSDK, CYBER, DOT, ETH, FRAX, INK, LINEA, LISK, METIS, MODE, NEO, NULS, NULS2, OP, POL, SOL, TEZOS, WLD, ZORA] | Chain you are using to pay for your instance |
| `--policy` | INTEGER | Policy for the confidential session [default: 1] |
| `--keep-session / --no-keep-session` |  | Keeping the already initiated session |
| `--private-key` | TEXT | Your private key. Cannot be used with --private-key-file |
| `--private-key-file` | PATH | Path to your private key file [default: /home/$USER/.aleph-im/private-keys/ethereum.key] |
| `--debug / --no-debug` |  | Enable debug logging [default: no-debug] |
| `--help` |  | Show this message and exit |

```bash
# Starting a confidential communication with a VM
aleph instance confidential-init-session VM_ID
```

## Lauching a Confidential Instance

Create (optional), start and unlock a confidential VM (all-in-one command)

This command combines the following commands:

```
- create (unless vm_id is passed)
- allocate
- confidential-init-session
- confidential-start
```

### Usage

```bash
aleph instance confidential [OPTIONS] [VM_ID]
```

#### Arguments

| Argument | Type | Description |
|----------|------|-------------|
| `VM_ID` | VM ID | Item hash of your VM. If provided, skip the instance creation, else create a new one |

#### Options

| **Option** | **Type** | **Description** |
|------------|----------|-----------------|
| `--crn-url` | TEXT | URL of the CRN to deploy to (only applicable for confidential and/or Pay-As-You-Go instances) |
| `--crn-hash` | TEXT | Hash of the CRN to deploy to (only applicable for confidential and/or Pay-As-You-Go instances) |
| `--policy` | INTEGER | Policy for the confidential session [default: 1] |
| `--confidential-firmware` | TEXT | Hash to UEFI Firmware to launch confidential instance [default: ba5bb13f3abca960b101a759be162b229e2b7e93ecad9d1307e54de887f177ff] |
| `--firmware-hash` | TEXT | Hash of the UEFI Firmware content, to validate measure (ignored if path is provided) [default: 89b76b0e64fe9015084fbffdf8ac98185bafc688bfe7a0b398585c392d03c7ee] |
| `--firmware-file` | TEXT | Path to the UEFI Firmware content, to validate measure (instead of the hash) |
| `--keep-session / --no-keep-session` | FLAG | Keeping the already initiated session |
| `--vm-secret` | TEXT | Secret password to start the VM |
| `--payment-type` | [hold, superfluid, nft] | Payment method, either holding tokens, NFTs, or Pay-As-You-Go via token streaming |
| `--chain` | [ARB, AVAX, BASE, BLAST, BOB, BSC, CSDK, CYBER, DOT, ETH, FRAX, INK, LINEA, LISK, METIS, MODE, NEO, NULS, NULS2, OP, POL, SOL, TEZOS, WLD, ZORA] | Chain you are using to pay for your instance |
| `--name` | TEXT | Name of your new instance |
| `--rootfs` | TEXT | Hash of the rootfs to use for your instance. Defaults to Ubuntu 22. You can also create your own rootfs and pin it |
| `--compute-units` | INTEGER | Number of compute units to allocate. Compute units correspond to a tier that includes vcpus, memory, disk and gpu presets. For reference, run: aleph pricing --help |
| `--vcpus` | INTEGER | Number of virtual CPUs to allocate |
| `--memory` | INTEGER | Maximum memory (RAM) in MiB to allocate |
| `--rootfs-size` | INTEGER RANGE | Rootfs size in MiB to allocate. Set to 0 to use default tier value and to not get prompted [x<=1953125] |
| `--timeout-seconds` | FLOAT | If vm is not called after [timeout_seconds] it will shutdown [default: 30.0] |
| `--ssh-pubkey-file` | PATH | Path to a public ssh key to be added to the instance [default: /home/$USER/.ssh/id_rsa.pub] |
| `--address` | TEXT | Address of the payer. In order to delegate the payment, your account must be authorized beforehand to publish on the behalf of this address. See the docs for more info: https://docs.aleph.im/protocol/permissions/ |
| `--gpu / --no-gpu` | FLAG | Launch an instance attaching a GPU to it [default: no-gpu] |
| `--premium / --no-premium` | FLAG | Use Premium GPUs (VRAM > 48GiB) |
| `--skip-volume / --no-skip-volume` | FLAG | Skip prompt to attach more volumes [default: no-skip-volume] |
| `--persistent-volume` | TEXT | Persistent volumes are allocated on the host machine and are not deleted when the VM is stopped. Requires at least name, mount path, and size_mib. To add multiple, reuse the same argument. Example: --persistent-volume name=data,mount=/opt/data,size_mib=1000. For more info, see the docs: https://docs.aleph.im/computing/volumes/persistent/ |
| `--ephemeral-volume` | TEXT | Ephemeral volumes are allocated on the host machine when the VM is started and deleted when the VM is stopped. Requires at least mount path and size_mib. To add multiple, reuse the same argument. Example: --ephemeral-volume mount=/opt/tmp,size_mib=100 |
| `--immutable-volume` | TEXT | Immutable volumes are pinned on the network and can be used by multiple VMs at the same time. They are read-only and useful for setting up libraries or other dependencies. Requires at least mount path and ref (volume message hash). use_latest is True by default, to use the latest version of the volume, if it has been amended. To add multiple, reuse the same argument. Example: --immutable-volume mount=/opt/packages,ref=25a3...8d94. For more info, see the docs: https://docs.aleph.im/computing/volumes/immutable/ |
| `--crn-auto-tac / --no-crn-auto-tac` | FLAG | Automatically accept the Terms & Conditions of the CRN if you read them beforehand [default: no-crn-auto-tac] |
| `--channel` | TEXT | Aleph.im network channel where the message is or will be broadcasted [default: ALEPH-CLOUDSOLUTIONS] |
| `--private-key` | TEXT | Your private key. Cannot be used with --private-key-file |
| `--private-key-file` | PATH | Path to your private key file [default: /home/$USER/.aleph-im/private-keys/ethereum.key] |
| `--debug / --no-debug` | FLAG | Enable debug logging [default: no-debug] |
| `--help` | FLAG | Show this message and exit |

```bash
# Create a basic confidential VM with default settings
aleph instance confidential \
  --name secure-vm \
  --payment-type hold \
  --payment-chain ETH

# Create a confidential VM using a CRN and keep the session alive
aleph instance confidential \
  --name confidential-db \
  --crn-url https://example.com/my-crn \
  --crn-hash 123abc456def \
  --keep-session \
  --payment-type superfluid \
  --payment-chain BASE

# Convert an existing instance to a confidential one
aleph instance confidential VM_HASH

# Create a confidential VM with a persistent volume and a VM startup secret
aleph instance confidential \
  --name private-ai-node \
  --vm-secret mySecret \
  --persistent-volume name=ai_data,mount=/data,size_mib=8000 \
  --payment-type nft \
  --payment-chain SOL
```


## Supported Operating Systems

Aleph.im provides several base images:

- `debian` - Debian Linux
- `ubuntu` - Ubuntu Linux
- `alpine` - Alpine Linux
- `custom` - Custom image (specify with `--image-hash`)

## Connecting to Instances

SSH into your running instance:

```bash
# Connect using the CLI
aleph instance ssh INSTANCE_HASH

# Get SSH connection details
aleph instance show INSTANCE_HASH --connection-info
```

## Managing Instances

```bash
# List all your instances
aleph instance list

# Show detailed information
aleph instance show INSTANCE_HASH

# Update an instance
aleph instance update INSTANCE_HASH \
  --cpu 4 \
  --memory 8192
```

## Payment Options

Aleph.im offers two payment models:

```bash
# Create with staking payment (default)
aleph instance create \
  --name my-instance \
  --system debian \
  --payment-method stake

# Create with Pay-As-You-Go
aleph instance create \
  --name my-instance \
  --system debian \
  --payment-method payg
```

## Advanced Configuration

### Custom Images

Use your own VM images:

```bash
# Create from custom image
aleph instance create \
  --name custom-instance \
  --system custom \
  --image-hash QmHash123456789
```

### Networking

Configure network settings:

```bash
# Expose specific ports
aleph instance create \
  --name web-server \
  --system debian \
  --cpu 2 \
  --memory 2048 \
  --open-ports 80,443
```

## Troubleshooting

Common issues and solutions:

- **Instance not starting**: Check resource allocation and system compatibility
- **SSH connection failures**: Verify your SSH key was properly added and the instance is running
- **Performance issues**: Consider increasing CPU, memory, or using a GPU instance
- **Payment errors**: Ensure you have sufficient ALEPH tokens for staking or PAYG balance
