# Program Deployment

The `program` command group allows you to deploy and manage serverless functions (micro-VMs) on the Aleph Cloud network.

## Overall Usage

```bash
aleph program [OPTIONS] COMMAND [ARGS]...
```

### Options

| Option   | Description                   |
| -------- | ----------------------------- |
| `--help` | Show the help prompt and exit |

### Key Commands

| Command      | Description                                                             |
| ------------ | ----------------------------------------------------------------------- |
| `create`     | Deploy a new serverless program                                         |
| `update`     | Update the code of an existing program                                  |
| `delete`     | Forget a program (and its code STORE unless `--keep-code`)              |
| `list`       | List programs owned by an address                                       |
| `persist`    | Recreate a program with `persistent=true` (new item hash)               |
| `unpersist`  | Recreate a program with `persistent=false` (new item hash)              |
| `logs`       | Fetch logs from one CRN running this program                            |
| `show`       | Show full information about a single program                            |

## Creating a Program

Deploy a new serverless program. The CLI auto-uploads `PATH` as a STORE message, then publishes the PROGRAM message referencing it.

### Usage

```bash
aleph program create [OPTIONS] <PATH> <ENTRYPOINT>
```

#### Arguments

| Argument     | Description                                                                                                             |
| ------------ | ----------------------------------------------------------------------------------------------------------------------- |
| `PATH`       | Source code path: directory, `.zip`, or `.squashfs`                                                                     |
| `ENTRYPOINT` | Program entrypoint, e.g. `main:app` for Python or `run.sh` for a shell script                                          |

#### Options

| Option                              | Description                                                                                       |
| ----------------------------------- | ------------------------------------------------------------------------------------------------- |
| `--name <NAME>`                     | Friendly name (stored in `metadata.name`)                                                         |
| `--runtime <RUNTIME>`               | Runtime: preset slug (e.g. `python3.12`) or a 64-char item hash. Defaults to `defaults.runtime`   |
| `--size <SIZE>`                     | Resource preset slug (e.g. `1vcpu-2gb`). Mutually exclusive with `--vcpus` / `--memory`          |
| `--vcpus <N>`                       | Number of virtual CPUs                                                                            |
| `--memory <SIZE>`                   | Memory size (e.g. `2GB`, `512MiB`)                                                                |
| `--timeout-seconds <N>`             | Idle timeout before shutdown (seconds) [default: 30]                                             |
| `--internet`                        | Allow internet access from the program                                                            |
| `--persistent`                      | Make the program persistent (always running) instead of ephemeral                                 |
| `--updatable`                       | Allow future updates with `aleph program update`                                                  |
| `--env-vars <VARS>`                 | Environment variables (comma-separated `KEY=value` pairs)                                         |
| `--persistent-volume`               | `name=N,mount=PATH,size=SIZE[,persistence=host\|store]`; can be repeated                         |
| `--ephemeral-volume`                | `mount=PATH,size=SIZE`; can be repeated                                                           |
| `--immutable-volume`                | `ref=HASH,mount=PATH[,use_latest=BOOL]`; can be repeated                                         |
| `--storage-engine <ENGINE>`         | Storage engine for the code STORE: `storage` (default) or `ipfs`                                 |
| `--payment-type <TYPE>`             | `hold` (default) or `credit`                                                                      |
| `--channel <CHANNEL>`               | Channel name                                                                                      |
| `--on-behalf-of <ADDR>`             | Sign on behalf of another address (requires authorization)                                        |
| `--account <ACCOUNT>`               | Named account (defaults to the active account)                                                    |
| `--private-key <KEY>`               | Hex-encoded private key (or set `ALEPH_PRIVATE_KEY`)                                             |
| `--chain <CHAIN>`                   | Signing chain (required with `--private-key`)                                                     |
| `--dry-run`                         | Build and sign the message but don't submit it                                                    |
| `--help`                            | Show this message and exit                                                                        |

```bash
# Deploy a Python function
aleph program create ./updated_prog.zip main:app

# Deploy a persistent program with a specific runtime and resources
aleph program create ./updated_prog.zip main:app \
  --name test \
  --persistent \
  --runtime python3.12 \
  --size 1vcpu-2gb \
  --timeout-seconds 60
```

## Showing Program Details

Show full information about a single program: creation time, ownership, per-ref freshness for code, runtime, data, and volumes.

### Usage

```bash
aleph program show [OPTIONS] <ITEM_HASH>
```

```bash
# Show details of a program
aleph program show ITEM_HASH

# Show as JSON
aleph program show ITEM_HASH --json
```

## Deleting a Program

### Usage

```bash
aleph program delete [OPTIONS] <ITEM_HASH>
```

#### Options

| Option               | Description                                                              |
| -------------------- | ------------------------------------------------------------------------ |
| `--reason <REASON>`  | Reason for deletion (recorded on the FORGET message) [default: "User deletion"] |
| `-y, --yes`          | Skip the confirmation prompt                                             |
| `--keep-code`        | Keep the source code STORE instead of deleting it                        |
| `--account <NAME>`   | Named account (defaults to the active account)                           |
| `--private-key <K>`  | Hex-encoded private key                                                  |
| `--dry-run`          | Build and sign the message but don't submit it                           |
| `--help`             | Show this message and exit                                               |

```bash
# Delete a program
aleph program delete ITEM_HASH
```

## Listing Programs

List all programs associated with an account.

### Usage

```bash
aleph program list [OPTIONS]
```

#### Options

| Option              | Description                                    |
| ------------------- | ---------------------------------------------- |
| `--address <ADDR>`  | Owner address of the programs                  |
| `--json`            | Output results as JSON                         |
| `--help`            | Show this message and exit                     |

```bash
# List all your programs
aleph program list

# List programs for a specific address as JSON
aleph program list --address ADDRESS --json
```

## Make a Program Persistent

Recreate a non-persistent program as persistent (item hash will change). The program must be updatable.

### Usage

```bash
aleph program persist [OPTIONS] <ITEM_HASH>
```

```bash
# Recreate a non-persistent program as persistent
aleph program persist ITEM_HASH
```

## Make a Program Non-Persistent

Recreate a persistent program as non-persistent (item hash will change). The program must be updatable.

### Usage

```bash
aleph program unpersist [OPTIONS] <ITEM_HASH>
```

```bash
# Recreate a persistent program as non-persistent
aleph program unpersist ITEM_HASH
```

## Display Logs of a Program

Fetch logs from one CRN running this program. The `--crn` option is required: pass the URL of the CRN executing the program.

### Usage

```bash
aleph program logs --crn <CRN_URL> <ITEM_HASH>
```

#### Options

| Option                | Description                                         |
| --------------------- | --------------------------------------------------- |
| `--crn <CRN>`         | CRN URL (e.g. `https://crn.example.com`) [required]  |
| `--account <NAME>`    | Named account (defaults to the active account)      |
| `--private-key <KEY>` | Hex-encoded private key                             |
| `--json`              | Output results as JSON                              |
| `--help`              | Show this message and exit                          |

```bash
# Display logs of a program
aleph program logs --crn https://crn.example.com ITEM_HASH
```

## Supported Runtimes

Aleph Cloud supports multiple programming languages. Use a preset slug (e.g. `python3.12`) or provide a 64-char item hash for a custom runtime. Omit `--runtime` to use the network's default runtime.

## Troubleshooting

Common issues and solutions:

- **Deployment failures**: Check your code for errors and ensure all dependencies are specified
- **Runtime errors**: View logs with `aleph program logs --crn CRN_URL PROGRAM_HASH`
- **Resource limitations**: Increase memory or CPU if your function is resource-intensive
- **Timeout issues**: Optimize your code or increase the function timeout setting
