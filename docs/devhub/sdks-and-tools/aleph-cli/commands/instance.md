# Instance Management

The `instance` command group allows you to create and manage full virtual machine instances on the Aleph Cloud network.

## Overall Usage

```bash
aleph instance [OPTIONS] COMMAND [ARGS]...
```

### Options

| Option   | Description                   |
| -------- | ----------------------------- |
| `--json` | Output results as JSON        |
| `--help` | Show the help prompt and exit |

### Key Commands

| Command        | Description                                                                   |
|----------------|-------------------------------------------------------------------------------|
| `create`       | Create a new VM instance                                                      |
| `delete`       | Forget an INSTANCE message (send a FORGET)                                    |
| `list`         | List instances belonging to an account                                        |
| `reboot`       | Reboot a VM instance                                                          |
| `start`        | Start (allocate) a VM instance on the CRN                                     |
| `stop`         | Stop a running VM instance                                                    |
| `show`         | Show details of an instance                                                   |
| `ssh`          | SSH into a dispatched VM instance                                             |
| `erase`        | Erase a VM instance's data on the CRN                                         |
| `price`        | Show pricing for an instance configuration                                    |
| `backup`       | Manage VM backups (create / info / download / delete / restore)               |
| `logs`         | Stream logs from a running VM instance                                        |
| `port-forward` | Manage TCP/UDP port forwards for VMs, programs, or IPFS websites (alias: pfw) |

## Creating an Instance

Create a new VM instance on Aleph Cloud. Sizing is specified in one of two ways:

- `--size <SLUG>`, e.g. `1vcpu-2gb`, `2vcpu-4gb`, `4vcpu-8gb`, `8vcpu-16gb`.
- `--vcpus N --memory <SIZE> --disk-size <SIZE>`, with human-readable values (e.g. `4GB`, `512MiB`, `1TiB`).

`--gpu <MODEL>` is independent: it requests a GPU and enforces a minimum size for that model. You can still combine it with `--size` (the minimum slug or any larger multiple) or with `--vcpus`/`--memory`. Use `aleph instance price --list-gpus` to see available models.

An instance name (positional), `--image`, and at least one `--ssh-pubkey-file` are required. Image accepts a preset name (`ubuntu22`, `ubuntu24`, `ubuntu26`, `debian12`) or an item hash. Pin to a specific node with `--crn-hash`. For an interactive walkthrough, pass `-i` / `--interactive`.

### Usage

```bash
aleph instance create [OPTIONS] <NAME>
```

#### Options

| Option                   | Description                                                                    |
|--------------------------|--------------------------------------------------------------------------------|
| `--image <IMAGE>`        | Root filesystem image: preset name or item hash (hex or IPFS CID)             |
| `--size <SIZE>`          | Instance size slug (e.g. `1vcpu-2gb`, `4vcpu-8gb`)                            |
| `--vcpus <N>`            | Number of virtual CPUs (overrides `--size`)                                    |
| `--memory <SIZE>`        | Memory size, e.g. `2GB`, `2048MB` (overrides `--size`)                        |
| `--disk-size <SIZE>`     | Disk size, e.g. `20GB`, `1TiB` (required unless `--size` is used)             |
| `--ssh-pubkey-file PATH` | Path to SSH public key file; can be repeated for multiple keys                 |
| `--gpu <MODEL>`          | GPU model name (e.g. `rtx4090`, `a100`, `l40s`); can be repeated              |
| `--crn-hash <HASH>`      | CRN node hash - pins the instance to a specific compute node                  |
| `--on-behalf-of <ADDR>`  | Sign on behalf of another address (requires an authorization from that address)|
| `--persistent-volume`    | `name=N,mount=PATH,size=SIZE[,persistence=host\|store]`; can be repeated      |
| `--ephemeral-volume`     | `mount=PATH,size=SIZE`; can be repeated                                        |
| `--immutable-volume`     | `ref=HASH,mount=PATH[,use_latest=BOOL]`; can be repeated                      |
| `--confidential`         | Launch a confidential VM (AMD SEV)                                             |
| `--channel <CHANNEL>`    | Channel name                                                                   |
| `--account <ACCOUNT>`    | Named account (defaults to the active account)                                 |
| `--private-key <KEY>`    | Hex-encoded private key (or set `ALEPH_PRIVATE_KEY`)                          |
| `--chain <CHAIN>`        | Signing chain (required with `--private-key`)                                  |
| `--dry-run`              | Build and sign the message but don't submit it                                 |
| `-i, --interactive`      | Prompt interactively for any missing values and run the CRN picker             |
| `--help`                 | Show this message and exit                                                     |

```bash
# Create a basic instance with a size slug
aleph instance create web \
  --image ubuntu26 \
  --size 1vcpu-2gb \
  --ssh-pubkey-file ~/.ssh/id_ed25519.pub

# Create a GPU instance
aleph instance create gpu-job \
  --image ubuntu26 \
  --gpu h100 \
  --ssh-pubkey-file ~/.ssh/id_ed25519.pub

# Create with custom resources and a persistent volume
aleph instance create db \
  --image ubuntu26 \
  --size 4vcpu-8gb \
  --persistent-volume name=data,mount=/data,size=100GB \
  --ssh-pubkey-file ~/.ssh/id_ed25519.pub

# Create with interactive prompts for everything else
aleph instance create -i web
```

## Deleting an Instance

Forget an INSTANCE message (send a FORGET) and stop billing. This command **only** sends the FORGET - it does **not** erase the VM's data on the CRN, remove port forwards, or stop any Superfluid payment flow.

For a full teardown, run `aleph instance erase` first to wipe the VM's data on the CRN, then `aleph instance delete` to forget the message and stop billing. Remove port forwards separately with `aleph instance port-forward delete` if needed.

### Usage

```bash
aleph instance delete [OPTIONS] <VM_ID>
```

#### Arguments

| Argument | Description               |
|----------|---------------------------|
| `VM_ID`  | Instance item hash        |

#### Options

| Option                | Description                                              |
|-----------------------|----------------------------------------------------------|
| `--reason <REASON>`   | Reason recorded on the FORGET message [default: "User deletion"] |
| `-y, --yes`           | Skip the confirmation prompt                             |
| `--json`              | Output results as JSON                                   |
| `--account <ACCOUNT>` | Named account (defaults to the active account)           |
| `--private-key <KEY>` | Hex-encoded private key                                  |
| `--chain <CHAIN>`     | Signing chain                                            |
| `--dry-run`           | Build and sign the message but don't submit it           |
| `--help`              | Show this message and exit                               |

```bash
# Typical teardown: erase VM data first, then forget the message
aleph instance erase ITEM_HASH
aleph instance delete ITEM_HASH

# Delete with a reason
aleph instance delete ITEM_HASH --reason "decommission"

# Skip confirmation prompt
aleph instance delete ITEM_HASH -y
```

## Listing Instances

List all instances associated with an account.

### Usage

```bash
aleph instance list [OPTIONS]
```

#### Options

| Option              | Description                                        |
|---------------------|----------------------------------------------------|
| `--address <ADDR>`  | Owner address to list instances for                |
| `--json`            | Output results as JSON                             |
| `--help`            | Show this message and exit                         |

```bash
# List your own instances
aleph instance list

# List instances for a specific address as JSON
aleph instance list --address ADDRESS --json
```

## Rebooting an Instance

Reboot a VM instance.

### Usage

```bash
aleph instance reboot [OPTIONS] <VM_ID>
```

#### Arguments

| Argument | Description                |
|----------|----------------------------|
| `VM_ID`  | VM instance item hash      |

```bash
# Reboot an instance
aleph instance reboot VM_ID
```

## Starting an Instance

Start (allocate) a VM instance on the CRN. This replaces the old `allocate` command.

### Usage

```bash
aleph instance start [OPTIONS] <VM_ID>
```

#### Arguments

| Argument | Description                                                   |
|----------|---------------------------------------------------------------|
| `VM_ID`  | VM instance item hash (accepts a unique prefix)               |

#### Options

| Option                  | Description                                                                       |
|-------------------------|-----------------------------------------------------------------------------------|
| `--crn <CRN>`           | CRN to target: node hash, unique prefix/suffix, or URL (bypasses scheduler discovery) |
| `--json`                | Output results as JSON                                                            |
| `--account <ACCOUNT>`   | Named account (defaults to the active account)                                    |
| `--private-key <KEY>`   | Hex-encoded private key                                                           |
| `--chain <CHAIN>`       | Signing chain                                                                     |
| `--dry-run`             | Build and sign the message but don't submit it                                    |
| `--help`                | Show this message and exit                                                        |

```bash
# Start an instance
aleph instance start VM_ID
```

## Stopping an Instance

Stop a running VM instance.

### Usage

```bash
aleph instance stop [OPTIONS] <VM_ID>
```

```bash
# Stop an instance
aleph instance stop VM_ID
```

## Confidential Instances

The confidential VM workflow lives under `aleph instance confidential` (subcommands: `init-session`, `start`, `create`). Use `aleph instance create --confidential` to allocate a confidential VM without the full attestation flow, or `aleph instance confidential create` for the all-in-one (create, allocate, init session, start). See the [confidential instances guide](/devhub/compute-resources/confidential-instances/01-confidential-instance-introduction) for the full deployment workflow.

## Show Instance Details

Show details of a single VM instance: INSTANCE message from the CCN, scheduler placement, and status. Pass `--verbose` to also fetch live networking information from the CRN.

### Usage

```bash
aleph instance show [OPTIONS] <VM_ID>
```

#### Options

| Option              | Description                                                                |
|---------------------|----------------------------------------------------------------------------|
| `-v, --verbose`     | Also reach the CRN for live networking (IPv4/IPv6, mapped host ports)      |
| `--json`            | Output results as JSON                                                     |
| `--help`            | Show this message and exit                                                 |

```bash
# Show instance details
aleph instance show a41fb91c3e68

# Show with live networking info
aleph instance show a41fb91c3e68 --verbose

# Show as JSON
aleph instance show a41fb91c3e68 --json
```

## SSH Into an Instance

Open an SSH session to a dispatched VM instance. The scheduler is queried to find the CRN, then the VM's IPv6 address is discovered from the CRN.

### Usage

```bash
aleph instance ssh [OPTIONS] <VM_ID> [SSH_ARGS]...
```

#### Options

| Option                  | Description                                               |
|-------------------------|-----------------------------------------------------------|
| `--crn <CRN>`           | CRN to target: node hash or URL (skips scheduler discovery) |
| `--user <USER>`         | SSH user to connect as [default: root]                    |
| `--port <PORT>`         | SSH port [default: 22]                                    |
| `--identity <PATH>`     | Path to an SSH private key (`ssh -i`)                     |
| `--json`                | Output results as JSON                                    |
| `--help`                | Show this message and exit                                |

```bash
# SSH into an instance
aleph instance ssh <vm-hash>

# SSH as a specific user with a key
aleph instance ssh <vm-hash> --user ubuntu --identity ~/.ssh/id_ed25519

# Run a remote command
aleph instance ssh <vm-hash> -- uptime
```

## Erasing Instance Data

Erase a VM instance's data on the CRN (does not delete the INSTANCE message).

### Usage

```bash
aleph instance erase [OPTIONS] <VM_ID>
```

```bash
# Erase instance data on the CRN
aleph instance erase VM_ID
```

## Instance Pricing

Show pricing for an instance configuration. See the [pricing page](./pricing.md) for full details.

```bash
# Price by size slug
aleph instance price --size 4vcpu-8gb

# Price a GPU instance
aleph instance price --gpu h100

# List available GPU models
aleph instance price --list-gpus
```

## Instance Backups

Manage VM backups: create, inspect, download, delete, or restore.

### Usage

```bash
aleph instance backup [OPTIONS] <COMMAND>
```

| Subcommand  | Description                                       |
|-------------|---------------------------------------------------|
| `create`    | Create a backup of a running VM                   |
| `info`      | Show the latest backup status for a VM            |
| `download`  | Download a backup archive to disk                 |
| `delete`    | Delete a backup                                   |
| `restore`   | Restore a VM from a local QCOW2 file or a volume  |

```bash
# Create a backup of a running instance
aleph instance backup create VM_ID
```

## Port Forwarding

Manage TCP/UDP port forwards for VM instances. The command is `port-forward` (alias: `pfw`).

For detailed documentation, see the [port-forward documentation](port-forwarder.md).

```bash
# List port forwards for your account
aleph instance port-forward list

# Create a TCP port forward for port 80
aleph instance port-forward create YOUR_INSTANCE_HASH 80

# Delete a port forward
aleph instance port-forward delete YOUR_INSTANCE_HASH --port 80
```

## Troubleshooting

Common issues and solutions:

- **Instance not starting**: Check resource allocation and system compatibility
- **SSH connection failures**: Verify your SSH key was properly added and the instance is running
- **Performance issues**: Consider increasing CPU, memory, or using a GPU instance
- **Payment errors**: Ensure you have sufficient credits or ALEPH tokens
