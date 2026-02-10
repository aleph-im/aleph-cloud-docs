# Princing Information

## Usage

```bash
aleph pricing [OPTIONS] SERVICE
```

### Arguments

| Argument  | Type                                                          | Description                    |
| --------- | ------------------------------------------------------------- | ------------------------------ |
| `SERVICE` | [storage, website, program, instance, confidential, gpu, all] | Service to display pricing for |

### Options

| Option                 | Type    | Description                                       |
| ---------------------- | ------- | ------------------------------------------------- |
| `--compute-units`      | INTEGER | Compute units to display pricing for [default: 0] |
| `--debug / --no-debug` |         | Enable debug logging [default: no-debug]          |
| `--help`               |         | Show this message and exit                        |

```bash
# Display pricing for storage services
aleph pricing storage

# Display pricing for website services
aleph pricing website

# Display pricing for program services
aleph pricing program

# Display pricing for instance services with default compute units
aleph pricing instance

# Display pricing for confidential services with custom compute units
aleph pricing confidential --compute-units 5

# Display pricing for GPU services with debugging enabled
aleph pricing gpu --debug

# Display pricing for all services available
aleph pricing all
```
