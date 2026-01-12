# Pricing Information

Display pricing for services available on Aleph Cloud, including compute instances, programs, storage, and GPU resources.

## Usage

```bash
aleph pricing [OPTIONS] SERVICE
```

### Arguments

| Argument | Type | Description |
|----------|------|-------------|
| `SERVICE` | [storage, website, program, instance, confidential, gpu, all] | Service to display pricing for |

### Options

| Option | Type | Description |
|--------|------|-------------|
| `--tier` | INTEGER | Filter pricing by a specific tier number |
| `--payment-type` | [hold, superfluid, credit] | Filter pricing by payment type |
| `--json / --no-json` |  | Output as JSON instead of Rich Table [default: no-json] |
| `--no-null` |  | Exclude null values in JSON output |
| `--with-current-availability / --ignore-availability` |  | (GPU only) Show prices only for GPU types currently accessible on the network [default: ignore-availability] |
| `--debug / --no-debug` |  | Enable debug logging [default: no-debug] |
| `--help` |  | Show this message and exit |

## Examples

```bash
# Display pricing for storage services
aleph pricing storage

# Display pricing for website services
aleph pricing website

# Display pricing for program services
aleph pricing program

# Display pricing for instance services
aleph pricing instance

# Display pricing for a specific tier
aleph pricing instance --tier 2

# Display pricing filtered by payment type (holding tokens)
aleph pricing instance --payment-type hold

# Display pricing for confidential instances
aleph pricing confidential

# Display pricing for GPU services with debugging enabled
aleph pricing gpu --debug

# Display GPU pricing showing only currently available GPUs on the network
aleph pricing gpu --with-current-availability

# Display pricing for all services available
aleph pricing all

# Output pricing as JSON
aleph pricing instance --json

# Output pricing as JSON without null values
aleph pricing instance --json --no-null
```

## Service Types

| Service | Description |
|---------|-------------|
| `storage` | Pricing for persistent file storage on IPFS via Aleph Cloud |
| `website` | Pricing for hosting static websites |
| `program` | Pricing for serverless functions (both ephemeral and persistent) |
| `instance` | Pricing for standard virtual machine instances |
| `confidential` | Pricing for confidential computing instances with encrypted memory |
| `gpu` | Pricing for GPU-enabled instances |
| `all` | Display pricing for all service types |

## Payment Types

| Payment Type | Description |
|--------------|-------------|
| `hold` | Pay by holding ALEPH tokens (staking) |
| `superfluid` | Pay-As-You-Go via token streaming |

## Understanding Tiers

Each service type has multiple tiers that define the resource allocation:

- **Tier 1**: Basic resources (1 compute unit)
- **Tier 2-6+**: Progressively more resources (more vCPUs, RAM, disk)

Use `aleph pricing <service>` to see the specific resources allocated for each tier.

**Going Beyond Tiers**: While tiers provide predefined resource configurations, you can customize and exceed tier limits by directly specifying `--vcpus`, `--memory`, or `--rootfs-size` when creating instances. See the [Resource Allocation section in the Instance documentation](./instance.md#resource-allocation) for more details on custom resource configuration.
