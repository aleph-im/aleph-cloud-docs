# Standard Instance Creation and Configuration

This section outlines the process of starting a standard (CPU-only) instance on the Aleph Cloud network.

The [aleph-client](https://github.com/aleph-im/aleph-client/) command-line tool is required.<br>
See [CLI Reference](/devhub/sdks-and-tools/aleph-cli/) or use `--help` for a quick overview of a specific command.

## Setup

### Create a Standard Instance

To create a standard instance, use the CLI or the [Aleph Cloud Console](https://app.aleph.cloud).

```shell
aleph instance create
```
<br/><br/>

Your VM is now ready to use.

### Retrieve VM Logs

Monitor your VM's activity:

```shell
aleph instance logs <vm-hash>
```

### Access Your VM via SSH

#### 1. **Find the Instance Details**

- **Via CLI**:

```shell
aleph instance list
```

- **Via API**: Access the compute node's API at `https://<node-url>/about/executions/list`.

#### 2. **Connect via SSH**:

Use the retrieved IP address to SSH into your VM:

```shell
ssh <user>@<ip> [-i <path-to-ssh-key>]
```

- **Default Users**:
  - Debian: `root`
  - Ubuntu: `ubuntu`

---

For more details, see the [CLI Reference](/devhub/sdks-and-tools/aleph-cli/).