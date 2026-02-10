# Port Forwarding Management

The `port-forwarder` command group allows you to manage port forwarding for your instances, enabling external access to specific ports on your VMs through IPv4 addresses.

## Overall Usage

```bash
aleph instance port-forwarder [OPTIONS] KEY_COMMAND [ARGS]...
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
| `update`  | Update an existing port forward for a specific item hash                 |
| `delete`  | Delete a port forward or all port forwards for a specific item hash      |
| `refresh` | Ask a CRN to fetch the latest port configurations from sender aggregates |

## Listing Port Forwards

List all port forwards for a given address and/or specific item hash.

### Usage

```bash
aleph instance port-forwarder list [OPTIONS]
```

#### Options

| Option                 | Type                                                                                                                                             | Description                                                                              |
| ---------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------ | ---------------------------------------------------------------------------------------- |
| `--address`            | TEXT                                                                                                                                             | Target address to list port forwards for                                                 |
| `--item-hash`          | TEXT                                                                                                                                             | Filter results to a specific item hash                                                   |
| `--private-key`        | TEXT                                                                                                                                             | Your private key. Cannot be used with --private-key-file                                 |
| `--private-key-file`   | PATH                                                                                                                                             | Path to your private key file [default: /home/$USER/.aleph-im/private-keys/ethereum.key] |
| `--chain`              | [ARB, AVAX, BASE, BLAST, BOB, BSC, CSDK, CYBER, DOT, ETH, FRAX, INK, LINEA, LISK, METIS, MODE, NEO, NULS, NULS2, OP, POL, SOL, TEZOS, WLD, ZORA] | Chain you are using                                                                      |
| `--debug / --no-debug` |                                                                                                                                                  | Enable debug logging [default: no-debug]                                                 |
| `--help`               |                                                                                                                                                  | Show this message and exit                                                               |

```bash
# List all port forwards for your account
aleph instance port-forwarder list

# List port forwards for a specific instance
aleph instance port-forwarder list --item-hash YOUR_INSTANCE_HASH

```

## Creating a Port Forward

Create a new port forward for a specific item hash. Note that when you create an instance, port 22 (SSH) is automatically forwarded with TCP enabled.

### Usage

```bash
aleph instance port-forwarder create [OPTIONS] ITEM_HASH PORT
```

#### Arguments

| Argument    | Type    | Description                                        |
| ----------- | ------- | -------------------------------------------------- |
| `ITEM_HASH` | TEXT    | Item hash of the instance, program or IPFS website |
| `PORT`      | INTEGER | Port number to forward (1-65535)                   |

#### Options

| Option                 | Type                                                                                                                                             | Description                                                                              |
| ---------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------ | ---------------------------------------------------------------------------------------- |
| `--tcp / --no-tcp`     |                                                                                                                                                  | Enable TCP forwarding for this port [default: tcp]                                       |
| `--udp / --no-udp`     |                                                                                                                                                  | Enable UDP forwarding for this port [default: no-udp]                                    |
| `--private-key`        | TEXT                                                                                                                                             | Your private key. Cannot be used with --private-key-file                                 |
| `--private-key-file`   | PATH                                                                                                                                             | Path to your private key file [default: /home/$USER/.aleph-im/private-keys/ethereum.key] |
| `--chain`              | [ARB, AVAX, BASE, BLAST, BOB, BSC, CSDK, CYBER, DOT, ETH, FRAX, INK, LINEA, LISK, METIS, MODE, NEO, NULS, NULS2, OP, POL, SOL, TEZOS, WLD, ZORA] | Chain you are using                                                                      |
| `--debug / --no-debug` |                                                                                                                                                  | Enable debug logging [default: no-debug]                                                 |
| `--help`               |                                                                                                                                                  | Show this message and exit                                                               |

```bash
# Create a TCP port forward for port 80
aleph instance port-forwarder create YOUR_INSTANCE_HASH 80

# Create a UDP port forward for port 53
aleph instance port-forwarder create YOUR_INSTANCE_HASH 53 --no-tcp --udp

# Create a port forward for port 443 with both TCP and UDP
aleph instance port-forwarder create YOUR_INSTANCE_HASH 443 --tcp --udp
```

## Updating a Port Forward

Update an existing port forward for a specific item hash.

### Usage

```bash
aleph instance port-forwarder update [OPTIONS] ITEM_HASH PORT
```

#### Arguments

| Argument    | Type    | Description                                        |
| ----------- | ------- | -------------------------------------------------- |
| `ITEM_HASH` | TEXT    | Item hash of the instance, program or IPFS website |
| `PORT`      | INTEGER | Port number to update (1-65535)                    |

#### Options

| Option                 | Type                                                                                                                                             | Description                                                                              |
| ---------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------ | ---------------------------------------------------------------------------------------- |
| `--tcp / --no-tcp`     |                                                                                                                                                  | Enable TCP forwarding for this port [default: tcp]                                       |
| `--udp / --no-udp`     |                                                                                                                                                  | Enable UDP forwarding for this port [default: no-udp]                                    |
| `--private-key`        | TEXT                                                                                                                                             | Your private key. Cannot be used with --private-key-file                                 |
| `--private-key-file`   | PATH                                                                                                                                             | Path to your private key file [default: /home/$USER/.aleph-im/private-keys/ethereum.key] |
| `--chain`              | [ARB, AVAX, BASE, BLAST, BOB, BSC, CSDK, CYBER, DOT, ETH, FRAX, INK, LINEA, LISK, METIS, MODE, NEO, NULS, NULS2, OP, POL, SOL, TEZOS, WLD, ZORA] | Chain you are using                                                                      |
| `--debug / --no-debug` |                                                                                                                                                  | Enable debug logging [default: no-debug]                                                 |
| `--help`               |                                                                                                                                                  | Show this message and exit                                                               |

```bash
# Update port 80 to use both TCP and UDP
aleph instance port-forwarder update YOUR_INSTANCE_HASH 80 --tcp --udp

# Update port 443 to use TCP only
aleph instance port-forwarder update YOUR_INSTANCE_HASH 443 --tcp --no-udp
```

## Deleting a Port Forward

Delete a port forward or all port forwards for a specific item hash.

### Usage

```bash
aleph instance port-forwarder delete [OPTIONS] ITEM_HASH
```

#### Arguments

| Argument    | Type | Description                                        |
| ----------- | ---- | -------------------------------------------------- |
| `ITEM_HASH` | TEXT | Item hash of the instance, program or IPFS website |

#### Options

| Option                 | Type                                                                                                                                             | Description                                                                              |
| ---------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------ | ---------------------------------------------------------------------------------------- |
| `--port`               | INTEGER                                                                                                                                          | Port number to delete. If not specified, all port forwards will be deleted               |
| `--private-key`        | TEXT                                                                                                                                             | Your private key. Cannot be used with --private-key-file                                 |
| `--private-key-file`   | PATH                                                                                                                                             | Path to your private key file [default: /home/$USER/.aleph-im/private-keys/ethereum.key] |
| `--chain`              | [ARB, AVAX, BASE, BLAST, BOB, BSC, CSDK, CYBER, DOT, ETH, FRAX, INK, LINEA, LISK, METIS, MODE, NEO, NULS, NULS2, OP, POL, SOL, TEZOS, WLD, ZORA] | Chain you are using                                                                      |
| `--debug / --no-debug` |                                                                                                                                                  | Enable debug logging [default: no-debug]                                                 |
| `--help`               |                                                                                                                                                  | Show this message and exit                                                               |

```bash
# Delete port forward for port 80
aleph instance port-forwarder delete YOUR_INSTANCE_HASH --port 80

# Delete all port forwards for an instance
aleph instance port-forwarder delete YOUR_INSTANCE_HASH
```

## Refreshing Port Configurations

Ask a CRN to fetch the latest port configurations from sender aggregates.

### Usage

```bash
aleph instance port-forwarder refresh [OPTIONS] ITEM_HASH
```

#### Arguments

| Argument    | Type | Description                                        |
| ----------- | ---- | -------------------------------------------------- |
| `ITEM_HASH` | TEXT | Item hash of the instance, program or IPFS website |

#### Options

| Option                 | Type                                                                                                                                             | Description                                                                              |
| ---------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------ | ---------------------------------------------------------------------------------------- |
| `--private-key`        | TEXT                                                                                                                                             | Your private key. Cannot be used with --private-key-file                                 |
| `--private-key-file`   | PATH                                                                                                                                             | Path to your private key file [default: /home/$USER/.aleph-im/private-keys/ethereum.key] |
| `--chain`              | [ARB, AVAX, BASE, BLAST, BOB, BSC, CSDK, CYBER, DOT, ETH, FRAX, INK, LINEA, LISK, METIS, MODE, NEO, NULS, NULS2, OP, POL, SOL, TEZOS, WLD, ZORA] | Chain you are using                                                                      |
| `--debug / --no-debug` |                                                                                                                                                  | Enable debug logging [default: no-debug]                                                 |
| `--help`               |                                                                                                                                                  | Show this message and exit                                                               |

```bash
# Refresh port configurations for an instance
aleph instance port-forwarder refresh YOUR_INSTANCE_HASH
```

## Important Notes

1. **Automatic SSH Port**: When you create an instance, we also create aggregate for port 22 (SSH) allowing you to SSH into your instance immediately.

2. **IPv4 Access**: The port-forwarder functionality provides IPv4 access to your instances, making them accessible from systems that don't support IPv6.

3. **Port Limitations**: You can forward any port in the valid range (1-65535), but some CRNs may restrict certain ports for security reasons.

4. **Protocol Options**: You can choose to forward TCP, UDP, or both for each port.

5. **Authorization**: You must be the owner of the instance to manage its port forwards.
