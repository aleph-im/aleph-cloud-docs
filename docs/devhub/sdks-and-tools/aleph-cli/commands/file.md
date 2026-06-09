# File Operations

The `file` command group allows you to upload, pin, and manage files on the Aleph Cloud network.

## Overall Usage

```bash
aleph file [OPTIONS] COMMAND [ARGS]...
```

### Options

| Option   | Description                   |
| -------- | ----------------------------- |
| `--help` | Show the help prompt and exit |

### Key Commands

| Command    | Description                                        |
|------------|----------------------------------------------------|
| `upload`   | Upload a file or directory and create a STORE message |
| `pin`      | Pin an existing file by creating a STORE message for a known item hash |
| `download` | Download a file by hash, message hash, or ref      |
| `delete`   | Delete files by hash, releasing the matching STORE pins |
| `list`     | List all files stored by an address                |

## Uploading Files

Upload a file (or directory) and create a STORE message announcing it on the network. Storage engine defaults to `storage` (Aleph native, ≤ 100 MB) for files and `ipfs` for directories. Payment defaults to credits.

### Usage

```bash
aleph file upload [OPTIONS] <PATH>
```

#### Arguments

| Argument | Description                                |
|----------|--------------------------------------------|
| `PATH`   | Path of the file or directory to upload    |

#### Options

| Option                          | Description                                                                                                |
|---------------------------------|------------------------------------------------------------------------------------------------------------|
| `--storage-engine <ENGINE>`     | `storage` (default for files) or `ipfs` (default for directories)                                         |
| `--payment-type <TYPE>`         | `credit` (default) or `hold`                                                                               |
| `--channel <CHANNEL>`           | Channel name                                                                                               |
| `--ref <REFERENCE>`             | User-defined file reference for updates/versioning                                                         |
| `--on-behalf-of <ADDR>`         | Sign on behalf of another address (requires authorization)                                                 |
| `--account <ACCOUNT>`           | Named account (defaults to the active account)                                                             |
| `--private-key <KEY>`           | Hex-encoded private key (or set `ALEPH_PRIVATE_KEY`)                                                      |
| `--chain <CHAIN>`               | Signing chain (required with `--private-key`)                                                              |
| `--dry-run`                     | Build and sign the message but don't submit it                                                             |
| `--help`                        | Show this message and exit                                                                                 |

```bash
# Upload a single file
aleph file upload ./report.pdf

# Upload a directory (automatically uses IPFS)
aleph file upload ./website/

# Upload to IPFS explicitly
aleph file upload ./big.bin --storage-engine ipfs

# Upload and assign a stable reference name
aleph file upload ./report.pdf --ref reports/q4

# Upload to a specific channel
aleph file upload ./data.bin --channel my-channel
```

## Pinning an IPFS CID

Tell the Aleph Cloud network to pin an existing IPFS CID. The CLI emits a STORE
message referencing the CID; CRNs that subscribe to that channel then keep the
content available, so it survives even if the original IPFS provider goes
offline. This is the most common use of `aleph file pin`.

### Usage

```bash
aleph file pin [OPTIONS] <ITEM_HASH>
```

#### Arguments

| Argument    | Description                                    |
|-------------|------------------------------------------------|
| `ITEM_HASH` | The IPFS CID (e.g. `QmXoyp…`) to pin. A 64-character hex item hash is also accepted; it pins via the native `storage` engine instead of IPFS (rarely useful). |

#### Options

| Option                      | Description                                                  |
|-----------------------------|--------------------------------------------------------------|
| `--payment-type <TYPE>`     | `credit` (default) or `hold`                                 |
| `--channel <CHANNEL>`       | Channel name                                                 |
| `--ref <REFERENCE>`         | User-defined file reference                                  |
| `--on-behalf-of <ADDR>`     | Sign on behalf of another address (requires authorization)   |
| `--account <ACCOUNT>`       | Named account (defaults to the active account)               |
| `--private-key <KEY>`       | Hex-encoded private key                                      |
| `--chain <CHAIN>`           | Signing chain                                                |
| `--dry-run`                 | Build and sign the message but don't submit it               |
| `--help`                    | Show this message and exit                                   |

```bash
# Pin an IPFS CID
aleph file pin QmXoypizjW3WknFiJnKLwHCnL72vedxjQkDDP1mXWo6uco

# Pin a CID and tag it with a user-defined reference for later updates
aleph file pin QmXoypizjW3WknFiJnKLwHCnL72vedxjQkDDP1mXWo6uco --ref my-dataset-v1
```

## Downloading Files

Download a file by hash, message hash, or ref.

### Usage

```bash
aleph file download [OPTIONS] [HASH]
```

#### Arguments

| Argument | Description                         |
|----------|-------------------------------------|
| `HASH`   | File hash to download (direct access) |

#### Options

| Option                          | Description                                                                        |
|---------------------------------|------------------------------------------------------------------------------------|
| `--message-hash <HASH>`         | Download by STORE message hash (resolves file hash from message metadata)          |
| `--ref <REFERENCE>`             | Download by user-defined file reference (requires `--owner`)                       |
| `--owner <ADDR>`                | Owner address (required when downloading by `--ref`)                               |
| `-o, --output <PATH>`           | Output file path (defaults to `./<file_hash>` in current directory)                |
| `--stdout`                      | Write file contents to stdout instead of saving to a file                          |
| `--json`                        | Output results as JSON                                                             |
| `--help`                        | Show this message and exit                                                         |

```bash
# Download a file by its hash
aleph file download ITEM_HASH

# Download by STORE message hash
aleph file download --message-hash MESSAGE_HASH

# Download to a specific output path
aleph file download ITEM_HASH -o ./my-file.pdf

# Download a versioned file by ref
aleph file download --ref reports/q4 --owner 0xYourAddress
```

## Deleting Files

Delete files by their content hash (IPFS CID or native hex), releasing the matching STORE pins. This operation is irreversible.

> **Note:** Use `aleph message forget` instead when you need to forget a specific STORE *message* by its item hash (e.g. to remove a duplicate pin while keeping the file alive).

### Usage

```bash
aleph file delete [OPTIONS] [HASHES]...
```

#### Arguments

| Argument    | Description                                  |
|-------------|----------------------------------------------|
| `HASHES...` | File hashes to delete (IPFS CID or native hex) |

#### Options

| Option                      | Description                                                        |
|-----------------------------|--------------------------------------------------------------------|
| `--reason <REASON>`         | Reason for deleting                                                |
| `--channel <CHANNEL>`       | Channel name                                                       |
| `--on-behalf-of <ADDR>`     | Sign on behalf of another address (requires authorization)         |
| `-y, --yes`                 | Skip the confirmation prompt and submit immediately                |
| `--json`                    | Output results as JSON                                             |
| `--account <ACCOUNT>`       | Named account (defaults to the active account)                     |
| `--private-key <KEY>`       | Hex-encoded private key                                            |
| `--chain <CHAIN>`           | Signing chain                                                      |
| `--dry-run`                 | Build and sign the message but don't submit it                     |
| `--help`                    | Show this message and exit                                         |

```bash
# Delete a file by IPFS CID
aleph file delete Qmabc...

# Delete by native hex hash
aleph file delete 9675a23e...

# Delete multiple files with a reason
aleph file delete Qmabc... QmDef... --reason "superseded"

# Delete without confirmation
aleph file delete Qmabc... -y
```

## Listing Files

List the files stored by an address.

### Usage

```bash
aleph file list [OPTIONS]
```

#### Options

| Option                    | Description                                                                   |
|---------------------------|-------------------------------------------------------------------------------|
| `--address <ADDR>`        | Address to query (defaults to the current account)                            |
| `--count <N>`             | Maximum number of files to display [default: 25]                              |
| `--sort-order <ORDER>`    | Sort order by creation time: `asc` or `desc` [default: desc]                  |
| `--json`                  | Output results as JSON                                                        |
| `--help`                  | Show this message and exit                                                    |

```bash
# List your own uploaded files
aleph file list

# List files uploaded by a specific address
aleph file list --address ADDRESS

# List files from oldest to newest
aleph file list --sort-order asc

# List up to 50 files as JSON
aleph file list --count 50 --json
```

## Troubleshooting

Common issues and solutions:

- **File upload fails**: Check your network connection and file permissions
- **Pin operation times out**: The IPFS network might be congested, try again later
- **File not found**: Verify the hash is correct and the file exists on the network
- **Permission errors**: Ensure you're using the correct account with proper permissions
