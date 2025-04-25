# Program Deployment

The `program` command group allows you to deploy and manage serverless functions (micro-VMs) on the Aleph.im network.

## Key Commands

| Command | Description |
|---------|-------------|
| `create` | Deploy a new serverless function |
| `update` | Update an existing function |
| `publish` | Publish a function (make it immutable) |
| `show` | Display function details |
| `list` | List your deployed functions |

## Creating a Program

Deploy a serverless function from your local code:

```bash
# Deploy a Python function
aleph program create \
  --file /path/to/main.py \
  --entrypoint main.py \
  --runtime python-3.10

# Deploy with environment variables
aleph program create \
  --file /path/to/app.js \
  --entrypoint app.js \
  --runtime node-18 \
  --env-var "API_KEY=your_api_key" \
  --env-var "DEBUG=true"
```

## Supported Runtimes

Aleph.im supports multiple programming languages:

- `python-3.10` - Python 3.10
- `node-18` - Node.js 18
- `node-20` - Node.js 20
- `rust-1.70` - Rust 1.70

## Updating a Program

Modify an existing function:

```bash
# Update code only
aleph program update PROGRAM_HASH \
  --file /path/to/updated_main.py

# Update code and configuration
aleph program update PROGRAM_HASH \
  --file /path/to/updated_main.py \
  --memory 256 \
  --vcpus 1
```

## Resource Allocation

Configure computing resources for your function:

```bash
# Specify memory and CPU
aleph program create \
  --file /path/to/main.py \
  --entrypoint main.py \
  --runtime python-3.10 \
  --memory 512 \
  --vcpus 2
```

## Viewing Program Details

```bash
# Show program details
aleph program show PROGRAM_HASH

# List all your programs
aleph program list
```

## Volume Management

Attach persistent storage to your function:

```bash
# Create a program with a volume
aleph program create \
  --file /path/to/main.py \
  --entrypoint main.py \
  --runtime python-3.10 \
  --volume my-data:/app/data \
  --volume-size 1
```

## Advanced Features

### Dependencies

Specify dependencies for your function:

```bash
# Python requirements
aleph program create \
  --file /path/to/main.py \
  --entrypoint main.py \
  --runtime python-3.10 \
  --requirements /path/to/requirements.txt

# Node.js package.json
aleph program create \
  --file /path/to/app.js \
  --entrypoint app.js \
  --runtime node-18 \
  --package /path/to/package.json
```

### Custom Domain

Assign a domain to your function:

```bash
# Create with domain
aleph program create \
  --file /path/to/main.py \
  --entrypoint main.py \
  --runtime python-3.10 \
  --domain your-domain.aleph.sh
```

## Troubleshooting

Common issues and solutions:

- **Deployment failures**: Check your code for errors and ensure all dependencies are specified
- **Runtime errors**: View logs with `aleph program logs PROGRAM_HASH`
- **Resource limitations**: Increase memory or CPU if your function is resource-intensive
- **Timeout issues**: Optimize your code or increase the function timeout setting
