# Program Deployment

The `program` command group allows you to deploy and manage serverless functions (micro-VMs) on the Aleph Cloud network.

## Overall Usage

```bash
aleph program [OPTIONS] KEY_COMMAND [ARGS]...
```

### Options

| Command  | Description                   |
| -------- | ----------------------------- |
| `--help` | Show the help prompt and exit |

### Key Commands

| Command           | Description                                                             |
| ----------------- | ----------------------------------------------------------------------- |
| `create / upload` | Deploy a new serverless function (create and upload are aliases)        |
| `update`          | Update an existing function                                             |
| `delete`          | Delete a program                                                        |
| `list`            | List your deployed functions                                            |
| `persistent`      | Recreate a non-persistent program as persistent (item hash will change) |
| `unpersistent`    | Recreate a persistent program as non-persistent (item hash will change) |
| `logs`            | Display the logs of a program                                           |
| `runtime-checker` | Check versions used by a runtime (distribution, python, nodejs, etc...) |

## Creating a Program

### Usage

```bash
aleph program create / upload [OPTIONS] PATH ENTRYPOINT
```

#### Arguments

| Argument     | Type | Description                                                                                                             |
| ------------ | ---- | ----------------------------------------------------------------------------------------------------------------------- |
| `PATH`       | PATH | Path to your source code. Can be a directory, a .squashfs file or a .zip archive                                        |
| `ENTRYPOINT` | TEXT | Your program entrypoint. Example: main:app for Python programs, else run.sh for a script containing your launch command |

#### Options

| Options                                                | Type    | Description                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           |
| ------------------------------------------------------ | ------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `--name`                                               | TEXT    | Name for your program                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 |
| `--runtime`                                            | TEXT    | Hash of the runtime to use for your program. You can also create your own runtime and pin it. [default: 63f07193e6ee9d207b7d1fcf8286f9aee34e6f12f101d2ec77c1229f92964696] (Use aleph program runtime-checker to inspect it)                                                                                                                                                                                                                                                                                                           |
| `--compute-units                                       | INTEGER | Number of compute units to allocate. Compute units correspond to a tier that includes vcpus, memory, disk and gpu presets. For reference, run: aleph pricing --help                                                                                                                                                                                                                                                                                                                                                                   |
| `--vcpus`                                              | INTEGER | Number of virtual CPUs to allocate                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    |
| `--memory`                                             | INTEGER | Maximum memory (RAM) in MiB to allocate                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               |
| `--timeout-seconds`                                    | FLOAT   | If vm is not called after [timeout_seconds] it will shutdown [default: 30.0]                                                                                                                                                                                                                                                                                                                                                                                                                                                          |
| `--internet / --no-internet`                           |         | Enable internet access for your program. By default, internet access is disabled [default: no-internet]                                                                                                                                                                                                                                                                                                                                                                                                                               |
| `--updatable / --no-updatable`                         |         | Allow program updates. By default, only the source code can be modified without requiring redeployement (same item hash). When enabled (set to True), this option allows to update any other field. However, such modifications will require a program redeployment (new item hash) [default: no-updatable]                                                                                                                                                                                                                           |
| `--beta / --no-beta`                                   |         | If true, you will be prompted to add message subscriptions to your program [default: no-beta]                                                                                                                                                                                                                                                                                                                                                                                                                                         |
| `--persistent / --no-persistent`                       |         | Create your program as persistent. By default, programs are ephemeral (serverless): they only start when called and then shutdown after the defined timeout delay. [default: no-persistent]                                                                                                                                                                                                                                                                                                                                           |
| `--skip-volume / --no-skip-volume`                     |         | Skip prompt to attach more volumes [default: no-skip-volume]                                                                                                                                                                                                                                                                                                                                                                                                                                                                          |
| `--persistent-volume`                                  | TEXT    | Persistent volumes are allocated on the host machine and are not deleted when the VM is stopped. Requires at least name, mount path, and size_mib. To add multiple, reuse the same argument. Example: --persistent-volume name=data,mount=/opt/data,size_mib=1000. For more info, see the docs: https://docs.aleph.cloud/computing/volumes/persistent/                                                                                                                                                                                |
| `--ephemeral-volume`                                   | TEXT    | Ephemeral volumes are allocated on the host machine when the VM is started and deleted when the VM is stopped. Requires at least mount path and size_mib. To add multiple, reuse the same argument. Example: --ephemeral-volume mount=/opt/tmp,size_mib=100                                                                                                                                                                                                                                                                           |
| `--immutable-volume`                                   | TEXT    | Immutable volumes are pinned on the network and can be used by multiple VMs at the same time. They are read-only and useful for setting up libraries or other dependencies. Requires at least mount path and ref (volume message hash). use_latest is True by default, to use the latest version of the volume, if it has been amended. To add multiple, reuse the same argument. Example: --immutable-volume mount=/opt/packages,ref=25a3...8d94. For more info, see the docs: https://docs.aleph.cloud/computing/volumes/immutable/ |
| `--skip-env-var / --no-skip-env-var`                   |         | Skip prompt to set environment variables [default: no-skip-env-var]                                                                                                                                                                                                                                                                                                                                                                                                                                                                   |
| `--env-vars`                                           | TEXT    | Environment variables to pass. They will be public and visible in the message, so don't include secrets. Must be a comma separated list. Example: KEY=value or KEY=value,KEY=value                                                                                                                                                                                                                                                                                                                                                    |
| `--address`                                            | TEXT    | Address of the payer. In order to delegate the payment, your account must be authorized beforehand to publish on the behalf of this address. See the docs for more info: https://docs.aleph.cloud/protocol/permissions/                                                                                                                                                                                                                                                                                                               |
| `--payment-chain`                                      | TEXT    | Chain you want to use to pay for your program can be [AVAX, BASE, ETH, SOL]                                                                                                                                                                                                                                                                                                                                                                                                                                                           |
| `--channel`                                            | TEXT    | Aleph Cloud network channel where the message is or will be broadcasted [default: ALEPH-CLOUDSOLUTIONS]                                                                                                                                                                                                                                                                                                                                                                                                                               |
| `--private-key`                                        | TEXT    | Your private key. Cannot be used with --private-key-file                                                                                                                                                                                                                                                                                                                                                                                                                                                                              |
| `--private-key-file`                                   | PATH    | Path to your private key file [default: /home/$USER/.aleph-im/private-keys/ethereum.key]                                                                                                                                                                                                                                                                                                                                                                                                                                              |
| `--print-messages / --no-print-messages`               |         | Print the messages after creation [default: no-print-messages]                                                                                                                                                                                                                                                                                                                                                                                                                                                                        |
| `--print-code-message / --no-print-code-message`       |         | Print the code message after creation [default: no-print-code-message]                                                                                                                                                                                                                                                                                                                                                                                                                                                                |
| `--print-program-message / --no-print-program-message` |         | Print the program message after creation [default: no-print-program-message]                                                                                                                                                                                                                                                                                                                                                                                                                                                          |
| `--verbose / --no-verbose`                             |         | Display additional information [default: verbose]                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     |
| `--debug / --no-debug`                                 |         | Enable debug logging [default: no-debug]                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              |
| `--help`                                               |         | Show this message and exit                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            |

Deploy a serverless function from your local code:

```bash
# Deploy a Python function
aleph program create ./updated_prog.zip main:app

# Deploy a persistent program named test and with a specific configuration
aleph program create ./updated_prog.zip main:app \
  --name test \
  --persistent \
  --runtime 63f07193e6ee9d207b7d1fcf8286f9aee34e6f12f101d2ec77c1229f92964696 \
  --payment-chain AVAX \
  --compute-units 1 \
  --vcpus 1 \
  --memory 512 \
  --timeout-seconds 60 \
  --skip-volume \
  --skip-env-var
```

## Deleting a Program

### Usage

```bash
aleph program delete [OPTIONS] ITEM_HASH
```

#### Arguments

| Argument    | Type      | Description            |
| ----------- | --------- | ---------------------- |
| `ITEM_HASH` | ITEM HASH | Item hash to unpersist |

#### Options

| Options                                | Type | Description                                                                              |
| -------------------------------------- | ---- | ---------------------------------------------------------------------------------------- |
| `--reason`                             | TEXT | Reason for deleting the program [default: User deletion]                                 |
| `--keep-code / --no-keep-code`         |      | Keep the source code intact instead of deleting it [default: no-keep-code]               |
| `--chain`                              | TEXT | Chain you want to use to pay for your program can be [AVAX, BASE, ETH, SOL]              |
| `--private-key`                        | TEXT | Your private key. Cannot be used with --private-key-file                                 |
| `--private-key-file`                   | PATH | Path to your private key file [default: /home/$USER/.aleph-im/private-keys/ethereum.key] |
| `--print-message / --no-print-message` |      | Print the message after deletion [default: no-print-message]                             |
| `--verbose / --no-verbose`             |      | Display additional information [default: verbose]                                        |
| `--debug / --no-debug`                 |      | Enable debug logging [default: no-debug]                                                 |
| `--help`                               |      | Show this message and exit                                                               |

```bash
# Deleting a program
aleph program delete ITEM_HASH
```

## Listing Programs

List all programs associated to an account

### Usage

```bash
aleph program list [OPTIONS]
```

#### Options

| Options                | Type | Description                                                                              |
| ---------------------- | ---- | ---------------------------------------------------------------------------------------- |
| `--address`            | TEXT | Owner address of the programs                                                            |
| `--chain`              | TEXT | Chain you want to use to pay for your program can be [AVAX, BASE, ETH, SOL]              |
| `--private-key`        | TEXT | Your private key. Cannot be used with --private-key-file                                 |
| `--private-key-file`   | PATH | Path to your private key file [default: /home/$USER/.aleph-im/private-keys/ethereum.key] |
| `--json / --no-json`   |      | Print as json instead of rich table [default: no-json]                                   |
| `--debug / --no-debug` |      | Enable debug logging [default: no-debug]                                                 |
| `--help`               |      | Show this message and exit                                                               |

```bash
# Listing all your programs
aleph program list

# Listing every programs of a specified user as json
aleph program list --address ADDRESS --json
```

## Make a Program Persistant

Recreate a non-persistent program as persistent (item hash will change). **The program must be updatable and yours**

### Usage

```bash
aleph program persist [OPTIONS] ITEM_HASH
```

#### Arguments

| Argument    | Type      | Description                          |
| ----------- | --------- | ------------------------------------ |
| `ITEM_HASH` | ITEM HASH | Item hash of the programm to persist |

#### Options

| Options                                | Type | Description                                                                              |
| -------------------------------------- | ---- | ---------------------------------------------------------------------------------------- |
| `--keep-prev / --no-keep-prev`         |      | Keep the previous program intact instead of deleting it [default: no-keep-prev]          |
| `--chain`                              | TEXT | Chain you want to use to pay for your program can be [AVAX, BASE, ETH, SOL]              |
| `--private-key`                        | TEXT | Your private key. Cannot be used with --private-key-file                                 |
| `--private-key-file`                   | PATH | Path to your private key file [default: /home/$USER/.aleph-im/private-keys/ethereum.key] |
| `--print-message / --no-print-message` |      | Print the message after deletion [default: no-print-message]                             |
| `--verbose / --no-verbose`             |      | Display additional information [default: verbose]                                        |
| `--debug / --no-debug`                 |      | Enable debug logging [default: no-debug]                                                 |
| `--help`                               |      | Show this message and exit                                                               |

```bash
# Recreate a non-persistent program as persistent
aleph program persist ITEM_HASH
```

## Make a Program Non-persistant

Recreate a persistent program as non-persistent (item hash will change). **The program must be updatable and yours**

### Usage

```bash
aleph program unpersist [OPTIONS] ITEM_HASH
```

#### Arguments

| Argument    | Type      | Description                         |
| ----------- | --------- | ----------------------------------- |
| `ITEM_HASH` | ITEM HASH | Item hash of the program to persist |

#### Options

| Options                                | Type | Description                                                                              |
| -------------------------------------- | ---- | ---------------------------------------------------------------------------------------- |
| `--keep-prev / --no-keep-prev`         |      | Keep the previous program intact instead of deleting it [default: no-keep-prev]          |
| `--chain`                              | TEXT | Chain you want to use to pay for your program can be [AVAX, BASE, ETH, SOL]              |
| `--private-key`                        | TEXT | Your private key. Cannot be used with --private-key-file                                 |
| `--private-key-file`                   | PATH | Path to your private key file [default: /home/$USER/.aleph-im/private-keys/ethereum.key] |
| `--print-message / --no-print-message` |      | Print the message after deletion [default: no-print-message]                             |
| `--verbose / --no-verbose`             |      | Display additional information [default: verbose]                                        |
| `--debug / --no-debug`                 |      | Enable debug logging [default: no-debug]                                                 |
| `--help`                               |      | Show this message and exit                                                               |

```bash
# Recreate a persistent program as non-persistent
aleph program unpersist ITEM_HASH
```

## Display Logs of a Program

Display the logs of a program, it will only show logs from the selected CRN

### Usage

```bash
aleph program logs [OPTIONS] ITEM_HASH
```

#### Arguments

| Argument    | Type      | Description              |
| ----------- | --------- | ------------------------ |
| `ITEM_HASH` | ITEM HASH | Item hash of the program |

#### Options

| Options                | Type | Description                                                                              |
| ---------------------- | ---- | ---------------------------------------------------------------------------------------- |
| `--chain`              | TEXT | Chain you want to use to pay for your program can be [AVAX, BASE, ETH, SOL]              |
| `--private-key`        | TEXT | Your private key. Cannot be used with --private-key-file                                 |
| `--private-key-file`   | PATH | Path to your private key file [default: /home/$USER/.aleph-im/private-keys/ethereum.key] |
| `--domain`             | TEXT | URL of the CRN (Compute node) on which the program is running                            |
| `--debug / --no-debug` |      | Enable debug logging [default: no-debug]                                                 |
| `--help`               |      | Show this message and exit                                                               |

```bash
# Display logs of a program
aleph program logs ITEM_HASH
```

## Checking versions

Check versions used by a runtime (distribution, python, nodejs, etc)

### Usage

```bash
aleph program runtime-checker [OPTIONS] ITEM_HASH
```

#### Arguments

| Argument    | Type      | Description                       |
| ----------- | --------- | --------------------------------- |
| `ITEM_HASH` | ITEM HASH | Item hash of the runtime to check |

#### Options

| Options                    | Type | Description                                                                              |
| -------------------------- | ---- | ---------------------------------------------------------------------------------------- |
| `--chain`                  | TEXT | Chain for the address, it can be [AVAX, BASE, ETH, SOL]                                  |
| `--private-key`            | TEXT | Your private key. Cannot be used with --private-key-file                                 |
| `--private-key-file`       | PATH | Path to your private key file [default: /home/$USER/.aleph-im/private-keys/ethereum.key] |
| `--verbose / --no-verbose` |      | Display additional information [default: no-verbose]                                     |
| `--debug / --no-debug`     |      | Enable debug logging [default: no-debug]                                                 |
| `--help`                   |      | Show this message and exit                                                               |

```bash
# Checking versions for a program
aleph program runtime-checker ITEM_HASH
```

## Supported Runtimes

Aleph Cloud supports multiple programming languages:

- `python-3.10` - Python 3.10
- `node-18` - Node.js 18
- `node-20` - Node.js 20
- `rust-1.70` - Rust 1.70

## Troubleshooting

Common issues and solutions:

- **Deployment failures**: Check your code for errors and ensure all dependencies are specified
- **Runtime errors**: View logs with `aleph program logs PROGRAM_HASH`
- **Resource limitations**: Increase memory or CPU if your function is resource-intensive
- **Timeout issues**: Optimize your code or increase the function timeout setting
