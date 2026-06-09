# Port Forwarding Management

The `port-forward` command group (alias: `pfw`) allows you to manage port forwarding for your instances, enabling external access to specific ports on your VMs through IPv4 addresses.

## Overall Usage

```bash
aleph instance port-forward [OPTIONS] COMMAND [ARGS]...
```

### Options

| Command  | Description                   |
| -------- | ----------------------------- |
| `--help` | Show the help prompt and exit |

### Key Commands

| Command   | Description                                                              |
| --------- | ------------------------------------------------------------------------ |
| `list`    | List all port forwards for a given address and/or item hash              |
| `create`  | Create a new port forward for a specific item hash                       |
| `update`  | Update an existing port forward's TCP/UDP flags                          |
| `delete`  | Delete a port forward (a single port, or all ports if `--port` is omitted) |
| `refresh` | Ask the CRN running this VM to re-read the aggregate immediately         |

## Listing Port Forwards

List all port forwards for a given address and/or specific item hash.

### Usage

```bash
aleph instance port-forward list [OPTIONS]
```

#### Options

| Option               | Description                                                                                     |
|----------------------|-------------------------------------------------------------------------------------------------|
| `--address <ADDR>`   | Address to inspect (hex, account name, or alias). Defaults to the current default account's address |
| `--vm-id <VM_ID>`    | Restrict the list to a single VM. Accepts a unique hash prefix                                  |
| `--json`             | Output results as JSON                                                                          |
| `--help`             | Show this message and exit                                                                      |

```bash
# List all port forwards for your account
aleph instance port-forward list

# List port forwards for a specific instance
aleph instance port-forward list --vm-id YOUR_INSTANCE_HASH
```

## Creating a Port Forward

Create a new port forward for a specific item hash. When you create an instance, port 22 (SSH) is automatically forwarded with TCP enabled.

### Usage

```bash
aleph instance port-forward create [OPTIONS] <VM_ID> <PORT>
```

#### Arguments

| Argument | Description                                        |
|----------|----------------------------------------------------|
| `VM_ID`  | Item hash of the instance, program or IPFS website |
| `PORT`   | Port number to forward (1-65535)                   |

#### Options

| Option                        | Description                                                              |
|-------------------------------|--------------------------------------------------------------------------|
| `--tcp <true\|false>`         | Allow TCP for this port [default: true] [possible values: true, false]   |
| `--udp <true\|false>`         | Allow UDP for this port [default: false] [possible values: true, false]  |
| `--json`                      | Output results as JSON                                                   |
| `--channel <CHANNEL>`         | Channel for the AGGREGATE message                                        |
| `--account <NAME>`            | Named account (defaults to the active account)                           |
| `--private-key <K>`           | Hex-encoded private key                                                  |
| `--dry-run`                   | Build and sign the message but don't submit it                           |
| `--help`                      | Show this message and exit                                               |

```bash
# Create a TCP port forward for port 80 (TCP is enabled by default)
aleph instance port-forward create YOUR_INSTANCE_HASH 80

# Create a UDP-only port forward for port 53
aleph instance port-forward create YOUR_INSTANCE_HASH 53 --tcp false --udp true

# Create a port forward for port 443 with both TCP and UDP
aleph instance port-forward create YOUR_INSTANCE_HASH 443 --tcp true --udp true
```

## Updating a Port Forward

Update an existing port forward's TCP/UDP flags.

### Usage

```bash
aleph instance port-forward update [OPTIONS] <VM_ID> <PORT>
```

#### Arguments

| Argument | Description                                        |
|----------|----------------------------------------------------|
| `VM_ID`  | Item hash of the instance, program or IPFS website |
| `PORT`   | Port number to update (1-65535)                    |

#### Options

| Option                        | Description                                                              |
|-------------------------------|--------------------------------------------------------------------------|
| `--tcp <true\|false>`         | Allow TCP for this port [default: true] [possible values: true, false]   |
| `--udp <true\|false>`         | Allow UDP for this port [default: false] [possible values: true, false]  |
| `--json`                      | Output results as JSON                                                   |
| `--channel <CHANNEL>`         | Channel for the AGGREGATE message                                        |
| `--account <NAME>`            | Named account (defaults to the active account)                           |
| `--private-key <K>`           | Hex-encoded private key                                                  |
| `--dry-run`                   | Build and sign the message but don't submit it                           |
| `--help`                      | Show this message and exit                                               |

```bash
# Update port 80 to use both TCP and UDP
aleph instance port-forward update YOUR_INSTANCE_HASH 80 --tcp true --udp true

# Update port 443 to use TCP only
aleph instance port-forward update YOUR_INSTANCE_HASH 443 --tcp true --udp false
```

## Deleting a Port Forward

Delete a port forward for a specific item hash. Omit `--port` to remove all port forwards for the VM.

### Usage

```bash
aleph instance port-forward delete [OPTIONS] <VM_ID>
```

#### Arguments

| Argument | Description                                        |
|----------|----------------------------------------------------|
| `VM_ID`  | Item hash of the instance, program or IPFS website |

#### Options

| Option              | Description                                                          |
|---------------------|----------------------------------------------------------------------|
| `--port <PORT>`     | Port number to delete. If omitted, all port forwards will be deleted |
| `--json`            | Output results as JSON                                               |
| `--account <NAME>`  | Named account (defaults to the active account)                       |
| `--private-key <K>` | Hex-encoded private key                                              |
| `--help`            | Show this message and exit                                           |

```bash
# Delete port forward for port 80
aleph instance port-forward delete YOUR_INSTANCE_HASH --port 80

# Delete all port forwards for an instance
aleph instance port-forward delete YOUR_INSTANCE_HASH
```

## Refreshing Port Configurations

Ask the CRN running this VM to re-read the aggregate immediately.

### Usage

```bash
aleph instance port-forward refresh [OPTIONS] <VM_ID>
```

```bash
# Refresh port configurations for an instance
aleph instance port-forward refresh YOUR_INSTANCE_HASH
```

## Important Notes

1. **Automatic SSH Port**: When you create an instance, port 22 (SSH) is automatically forwarded so you can SSH into your instance immediately.

2. **IPv4 Access**: The port-forward functionality provides IPv4 access to your instances.

3. **Port Limitations**: You can forward any port in the valid range (1-65535), but some CRNs may restrict certain ports for security reasons.

4. **Protocol Options**: You can choose to forward TCP, UDP, or both for each port.

5. **Authorization**: You must be the owner of the instance to manage its port forwards.
