# Pricing Information

Display pricing for VM instance configurations on Aleph Cloud using `aleph instance price`.

> **Note:** Storage, website, and program pricing are not yet available as CLI commands. Check the [pricing pages](https://aleph.cloud/pricing) or use the SDK for those services.

## Usage

```bash
aleph instance price [OPTIONS]
```

### Options

| Option              | Description                                                          |
|---------------------|----------------------------------------------------------------------|
| `--size <SIZE>`     | Instance size slug (e.g. `1vcpu-2gb`, `4vcpu-8gb`)                  |
| `--vcpus <N>`       | Number of virtual CPUs (custom sizing)                               |
| `--memory <SIZE>`   | Memory size, e.g. `2GB`, `2048MB` (custom sizing)                   |
| `--disk-size <SIZE>`| Disk size, e.g. `20GB`, `1TiB` (custom sizing)                      |
| `--gpu [<MODEL>]`   | GPU model name (e.g. `h100`, `a100`, `rtx-4090`). Pass without value to list models |
| `--list-gpus`       | List available GPU models and exit                                   |
| `--confidential`    | Use confidential VM pricing (AMD SEV)                                |
| `--json`            | Output results as JSON                                               |
| `--help`            | Show this message and exit                                           |

## Examples

```bash
# Display pricing for a size slug
aleph instance price --size 4vcpu-8gb

# Display pricing with custom resource specification
aleph instance price --vcpus 2 --memory 4GB --disk-size 50GB

# Display pricing for a GPU instance
aleph instance price --gpu h100

# Display pricing for a GPU instance with more resources than the minimum
aleph instance price --gpu h100 --size 32vcpu-192gb

# List available GPU models
aleph instance price --list-gpus

# Display confidential instance pricing
aleph instance price --size 1vcpu-2gb --confidential

# Output as JSON
aleph instance price --size 4vcpu-8gb --json
```

## Available GPU Models

Use `aleph instance price --list-gpus` to see currently available GPU models and their minimum resource requirements. Example output:

| Model                | Min size       | VRAM    | Tier     |
|----------------------|----------------|---------|----------|
| `rtx-4000-ada`       | 3vcpu-18gb     | 20 GiB  | standard |
| `rtx-3090`           | 4vcpu-24gb     | 24 GiB  | standard |
| `rtx-4090`           | 6vcpu-36gb     | 24 GiB  | standard |
| `l40s`               | 12vcpu-72gb    | 48 GiB  | standard |
| `a100`               | 16vcpu-96gb    | 80 GiB  | premium  |
| `h100`               | 24vcpu-144gb   | 80 GiB  | premium  |
| `h200`               | 32vcpu-192gb   | 141 GiB | premium  |

GPU and confidential instances use separate pricing tiers and cannot be combined.

## Instance Size Slugs

Size slugs provide preset configurations for standard instances:

- `1vcpu-2gb` - 1 vCPU, 2 GB RAM
- `2vcpu-4gb` - 2 vCPUs, 4 GB RAM
- `4vcpu-8gb` - 4 vCPUs, 8 GB RAM
- `8vcpu-16gb` - 8 vCPUs, 16 GB RAM

For custom sizing above these presets, use `--vcpus`, `--memory`, and `--disk-size` directly.
