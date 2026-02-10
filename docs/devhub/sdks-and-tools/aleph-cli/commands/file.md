# File Operations

The `file` command group allows you to upload, pin, and manage files on IPFS through the Aleph Cloud network.

## Overall Usage

```bash
aleph file [OPTIONS] KEY_COMMAND [ARGS]...
```

### Options

| Command  | Description                   |
| -------- | ----------------------------- |
| `--help` | Show the help prompt and exit |

### Key Commands

| Command | Description |
|---------|-------------|
| `upload` | Upload a file or directory to IPFS via Aleph Cloud |
| `pin` | Pin an existing IPFS file on Aleph Cloud |
| `download` | Download a file from Aleph Cloud |
| `forget` | Remove a file from Aleph Cloud pinning |
| `list` | List all files for a given address |

## Uploading Files

Upload a file or directory to IPFS via Aleph Cloud. Files larger than 4MB are automatically uploaded using IPFS storage.

### Usage

```bash
aleph file upload [OPTIONS] PATH
```

#### Arguments

| Argument | Type | Description |
|----------|------|-------------|
| `PATH` | PATH | Path of the file or directory to upload |

#### Options

| Options | Type | Description |
|---------|------|-------------|
| `--storage-engine` | [storage, ipfs] | Storage engine to use. If not specified, automatically chooses based on file size (ipfs for files > 4MB) |
| `--channel` | TEXT | Aleph Cloud network channel where the message is or will be broadcasted [default: ALEPH-CLOUDSOLUTIONS] |
| `--private-key` | TEXT | Your private key. Cannot be used with `--private-key-file` |
| `--private-key-file` | PATH | Path to your private key file [default: /home/$USER/.aleph-im/private-keys/ethereum.key] |
| `--chain` | [ARB, AVAX, BASE, BLAST, BOB, BSC, CSDK, CYBER, DOT, ETH, FRAX, INK, LINEA, LISK, METIS, MODE, NEO, NULS, NULS2, OP, POL, SOL, TEZOS, WLD, ZORA] | Chain for the address |
| `--ref` | TEXT | Item hash of the message to update |
| `--debug / --no-debug` | | Enable debug logging [default: no-debug] |
| `--help` | | Show this message and exit |


Upload / Update local files to IPFS through Aleph Cloud:

```bash
# Upload a single file
aleph file upload /path/to/file.txt

# Upload with a specific channel
aleph file upload /path/to/file.txt --channel ALEPH-MAIN

# Update a file from its item hash
aleph file upload --ref ITEM_HASH /path/to/file.txt
```

## Pinning Existing Files

If you already have content on IPFS, you can pin it on Aleph Cloud:

### Usage

`aleph file pin [OPTIONS] ITEM_HASH`

#### Arguments

| Argument    | Type      | Description                     |
| ----------- | --------- | ------------------------------- |
| `ITEM_HASH` | ITEM_HASH | IPFS hash to pin on Aleph Cloud |

#### Options

| Options | Type | Description |
|---------|------|-------------|
| `--channel` | TEXT | Aleph Cloud network channel where the message is or will be broadcasted [default: ALEPH-CLOUDSOLUTIONS] |
| `--private-key` | TEXT | Your private key. Cannot be used with `--private-key-file` |
| `--private-key-file` | PATH | Path to your private key file [default: /home/$USER/.aleph-im/private-keys/ethereum.key] |
| `--chain` | [ARB, AVAX, BASE, BLAST, BOB, BSC, CSDK, CYBER, DOT, ETH, FRAX, INK, LINEA, LISK, METIS, MODE, NEO, NULS, NULS2, OP, POL, SOL, TEZOS, WLD, ZORA] | Chain for the address |
| `--ref` | TEXT | Item hash of the message to update |
| `--debug / --no-debug` | | Enable debug logging [default: no-debug] |
| `--help` | | Show this message and exit |

Pin files on IPFS

```bash
# Pin by IPFS hash
aleph file pin ITEM_HASH
```

## Downloading Files from Aleph Network

Download a file from Aleph Cloud or display its information:

### Usage

`aleph file download [OPTIONS] ITEM_HASH`

#### Arguments

| Argument    | Type      | Description                       |
| ----------- | --------- | --------------------------------- |
| `ITEM_HASH` | ITEM_HASH | hash to download from Aleph Cloud |

#### Options

| Options                        | Type | Description                                                   |
| ------------------------------ | ---- | ------------------------------------------------------------- |
| `--use-ipfs / --no-use-ipfs`   |      | Download using IPFS instead of storage [default: no-use-ipfs] |
| `--output-path`                | PATH | Output directory path [default: .]                            |
| `--file-name`                  | TEXT | Output file name (without extension)                          |
| `--file-extension`             | TEXT | Output file extension                                         |
| `--only-info / --no-only-info` |      | [default: no-only-info]                                       |
| `--verbose / --no-verbose`     |      | [default: verbose]                                            |
| `--debug / --no-debug`         |      | [default: no-debug]                                           |
| `--help`                       |      | Show this message and exit                                    |

```bash
# Download a file from its ITEM_HASH
aleph file download ITEM_HASH

# Download a file from its ITEM_HASH and renaming it as new_name
aleph file download ITEM_HASH --file-name new_name

# Download a file from its ITEM_HASH as a python program named new_name
aleph file download ITEM_HASH --file-name new_name --file-extension .py
```

## Forgetting Files

Forget a file and his message on Aleph Cloud:

### Usage

`aleph file forget [OPTIONS] ITEM_HASH(ES) [REASON]`

#### Arguments

| Argument        | Type      | Description                                                                                   |
| --------------- | --------- | --------------------------------------------------------------------------------------------- |
| `ITEM_HASH(ES)` | ITEM_HASH | Hash(es) to forget. Must be a comma separated list. Example: 123...abc or 123...abc,456...xyz |
| `REASON`        | TEXT      | Reason to forget [default: User deletion]                                                     |

#### Options

| Options | Type | Description |
|---------|------|-------------|
| `--channel` | TEXT | Aleph Cloud network channel where the message is or will be broadcasted [default: ALEPH-CLOUDSOLUTIONS] |
| `--private-key` | TEXT | Your private key. Cannot be used with `--private-key-file` |
| `--private-key-file` | PATH | Path to your private key file [default: /home/$USER/.aleph-im/private-keys/ethereum.key] |
| `--chain` | [ARB, AVAX, BASE, BLAST, BOB, BSC, CSDK, CYBER, DOT, ETH, FRAX, INK, LINEA, LISK, METIS, MODE, NEO, NULS, NULS2, OP, POL, SOL, TEZOS, WLD, ZORA] | Chain for the address |
| `--debug / --no-debug` | | Enable debug logging [default: no-debug] |
| `--help` | | Show this message and exit |

```bash
# Forget a file by hash
aleph file forget ITEM_HASH

# Forget with a reason
aleph file forget ITEM_HASH --reason "File no longer needed"
```

## Listing Files

List all files for a given address:

### Usage

```bash
aleph file list [OPTIONS]
```

#### Options

| Options | Type | Description |
|---------|------|-------------|
| `--address` | TEXT | Address you are interested in |
| `--private-key` | TEXT | Your private key. Cannot be used with `--private-key-file` |
| `--private-key-file` | PATH | Path to your private key file [default: /home/$USER/.aleph-im/private-keys/ethereum.key] |
| `--chain` | [ARB, AVAX, BASE, BLAST, BOB, BSC, CSDK, CYBER, DOT, ETH, FRAX, INK, LINEA, LISK, METIS, MODE, NEO, NULS, NULS2, OP, POL, SOL, TEZOS, WLD, ZORA] | Chain for the address |
| `--pagination` | INTEGER | Maximum number of files to return [default: 100] |
| `--page` | INTEGER | Offset in pages [default: 1] |
| `--sort-order`| INTEGER | Order in which files should be listed: -1 means most recent messages first, 1 means older messages first [default: -1] |
| `--json / --no-json`| | Print as JSON instead of rich table [default: no-json] |
| `--help` | | Show this message and exit |


```bash
# List your own uploaded files
aleph file list

# List files uploaded by a specific address
aleph file list --address ADDRESS

# List your own files from oldest to newest (ascending order)
aleph file list --sort-order 1

# List the 50 oldest files uploaded by a specific address
aleph file list --address ADDRESS --sort-order 1 --pagination 50
```

## Troubleshooting

Common issues and solutions:

- **File upload fails**: Check your network connection and file permissions
- **Pin operation times out**: The IPFS network might be congested, try again later
- **File not found**: Verify the hash is correct and the file exists on IPFS
- **Permission errors**: Ensure you're using the correct account with proper permissions
