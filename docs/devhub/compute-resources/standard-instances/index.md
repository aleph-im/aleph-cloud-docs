# Standard Instance Creation and Configuration

This section outlines the process of starting a standard (CPU-only) instance on the Aleph Cloud network.

## via the Web

You can create, manage your instances viathe [Aleph Cloud Console](https://app.aleph.cloud).

## via the CLI

The [aleph-client](https://github.com/aleph-im/aleph-client/) command-line tool is required.<br>
See [CLI Reference](/devhub/sdks-and-tools/aleph-cli/) or use `--help` for a quick overview of a specific command.

### Create a Standard Instance via the CLI

Prerequisite: A ssh key so you can log onto into your VM, you can create one using the `ssh-keygen` command.
To create a standard instance, use:

```shell
aleph instance create
```

An instance will guide you and ask you question on how you want to configure your VM: base system, disk size, etc...

Once the process is complete, your VM should be ready to use in a few minutes.

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

### Network

Instance support both IPv4 and IPv6.

They receive a public IPv6 address and an internal IPv4 address.

It is possible to make the VM reachable from the outside on IPv4 using the [Custom Domain](/devhub/deploying-and-hosting/custom-domains/instance.md) and/or the [Port Fowarding](/devhub/deploying-and-hosting/ipv4/ipv4-port-forwarding.md) features.

- Custom domain allows redirecting of http(s) traffic on the standard 80 and 443 ports.
- Port forwarding exposes any chosen VM port on an external port of the host.
