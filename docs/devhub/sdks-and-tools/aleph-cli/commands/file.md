# File Operations

The `file` command group allows you to upload, pin, and manage files on IPFS through the Aleph.im network.

## Key Commands

| Command | Description |
|---------|-------------|
| `upload` | Upload a file to IPFS via Aleph.im |
| `pin` | Pin an existing IPFS file on Aleph.im |
| `status` | Check the status of a file |
| `forget` | Remove a file from Aleph.im pinning |

## Uploading Files

Upload local files to IPFS through Aleph.im:

```bash
# Upload a single file
aleph file upload /path/to/file.txt

# Upload a directory
aleph file upload /path/to/directory --recursive

# Upload with a specific channel
aleph file upload /path/to/file.txt --channel ALEPH-MAIN
```

## Pinning Existing IPFS Content

If you already have content on IPFS, you can pin it on Aleph.im:

```bash
# Pin by IPFS hash
aleph file pin QmHash123456789

# Pin with a specific storage engine
aleph file pin QmHash123456789 --storage-engine ipfs
```

## Checking File Status

Verify that your files are properly stored:

```bash
# Check file status by hash
aleph file status QmHash123456789

# Check with detailed information
aleph file status QmHash123456789 --verbose
```

## Removing Files

When you no longer need a file to be pinned:

```bash
# Forget a file by hash
aleph file forget QmHash123456789

# Forget with a reason
aleph file forget QmHash123456789 --reason "No longer needed"
```

## Advanced Options

### Storage Engines

Aleph.im supports different storage backends:

```bash
# Specify storage engine
aleph file upload /path/to/file.txt --storage-engine ipfs
```

Available storage engines:
- `ipfs` - InterPlanetary File System
- `storage` - Aleph.im native storage

### File Metadata

Add metadata to your files:

```bash
# Add a content type
aleph file upload /path/to/file.jpg --content-type image/jpeg

# Add a filename
aleph file upload /path/to/file.txt --filename custom_name.txt
```

## Troubleshooting

Common issues and solutions:

- **File upload fails**: Check your network connection and file permissions
- **Pin operation times out**: The IPFS network might be congested, try again later
- **File not found**: Verify the hash is correct and the file exists on IPFS
- **Permission errors**: Ensure you're using the correct account with proper permissions
