# Debian 12 Bookworm

## 0. Introduction

For production using official Debian 12 packages.

> **Note:** Before proceeding with installation, please review the [hardware requirements](/nodes/compute/introduction/#hardware-requirements) for running a Compute Resource Node, including special requirements for features like [confidential computing](/nodes/compute/advanced/confidential/).

## 1. Requirements

- A [supported Linux server](https://github.com/aleph-im/aleph-vm/tree/main/src/aleph/vm/orchestrator#1-supported-platforms)
- A public domain name from a registrar and top level domain you trust.

In order to run an official Aleph Cloud Compute Resource Node (CRN), you will also need the following resources:

- CPU (2 options):
  - Min. 8 cores / 16 threads, 3.0 ghz+ CPU (gaming CPU for fast boot-up of microVMs)
  - Min. 12 core / 24 threads, 2.4ghz+ CPU (datacenter CPU for multiple concurrent loads)
  - For [confidential computing](/nodes/compute/advanced/confidential/), specific AMD EPYC™ processors are required
- RAM: 64GB
- STORAGE: 1TB (NVMe SSD preferred, datacenter fast HDD possible under conditions, you’ll want a big and fast cache)
- NETWORK: Minimum 500 Mbit/s symmetrical, a dedicated IPv4, and a dedicated, routed IPv6 /64 (or larger) that is **not shared with any other node**.

You will need a public domain name with access to add TXT and wildcard records.

> 💡 This documentation will use the invalid `vm.example.org` domain name. Replace it when needed.

## 2. Installation

Run the following commands as `root`:

First install the [VM-Connector](https://github.com/aleph-im/aleph-vm/tree/main/vm_connector) using Docker:

```shell
apt update
apt upgrade
apt install -y docker.io apparmor-profiles
docker run -d -p 127.0.0.1:4021:4021/tcp --restart=always --name vm-connector alephim/vm-connector:alpha
```

Then install the [VM-Supervisor](https://github.com/aleph-im/aleph-vm/tree/main/src/aleph/vm/orchestrator) using the official Debian 12 package.
The procedure is similar for updates.

```shell
# Download the latest release
release=$(curl -s https://api.github.com/repos/aleph-im/aleph-vm/releases/latest | awk -F'"' '/"tag_name":/ {print $4}')
sudo wget -P /opt/ https://github.com/aleph-im/aleph-vm/releases/download/${release}/aleph-vm.debian-12.deb
# Install it
apt install /opt/aleph-vm.debian-12.deb
```

Reboot if required (new kernel, ...).

## 3. Configuration

Update the configuration in `/etc/aleph-vm/supervisor.env` using your favourite editor.

The minimum necessary configuration required is :

- Setting up the hostname `ALEPH_VM_DOMAIN_NAME`
- Override Domain Name Servers and the default network interface if they have not been detected properly.

It is also recommended to set to enable full instances support

- The IPv6 address pool
- [Pay as you go address](/nodes/compute/advanced/pay-as-you-go/index.md)

If your node has the required hardware, see the detailed instructions on how to enable their support

- [Confidential computing support](/nodes/compute/advanced/confidential/index.md)
- [GPU support](/nodes/compute/advanced/gpu/index.md)

### Hostname

You will want to insert your domain name in the form of:

```
ALEPH_VM_DOMAIN_NAME=vm.example.org
```

### Network configuration

#### IPv6 address pool

Each virtual machine receives its own publicly routable IPv6 address, taken from a pool you must
configure manually. aleph-vm assigns each VM a `/124` sub-range carved from this pool.

The pool **must be a globally-routable `/64` that is routed to your host and unique to this node**.
According to the IPv6 specifications, a host is expected to receive a `/64` with every address
inside it routed to the machine. Many providers follow this; some budget VPS providers instead
place many customers on a single shared `/64` subnet and hand each machine only one address. That
setup does **not** work for a node: the addresses assigned to your VMs would collide with other
machines on the subnet, and your node will be penalized by the network scoring (see below).

The option takes the form of:

```
ALEPH_VM_IPV6_ADDRESS_POOL="2a01:4f8:171:787::/64"
```

Assuming your provider routes a `/64` to your host, the procedure is:

1. Obtain the routed IPv6 `/64` assigned to your node. If your provider only gives you a single
   address on a shared subnet, ask them for a _routed_ (or _delegated_) `/64`.
2. Remove the trailing host bits after `::` if present, for example `2a01:4f8:171:787::2/64`
   becomes `2a01:4f8:171:787::/64`.
3. Add the range under the setting `ALEPH_VM_IPV6_ADDRESS_POOL` in the configuration.

> ⚠️ **Each node needs its own unique, routed /64.** The network scoring forces the score of any
> node that shares its IPv6 `/64` with another node to `0` (diagnostic code `1005`, _duplicate IP_).
> When several nodes sit in the same `/64` (common on shared-subnet providers, or when running
> multiple nodes at the same host), only one of them is scored and the rest drop to zero.

> ⚠️ **Do not leave the default pool.** If `ALEPH_VM_IPV6_ADDRESS_POOL` is unset, aleph-vm falls
> back to the placeholder `fc00:1:2:3::/64`. This is a private (ULA) range used only for
> compatibility with hosts not yet configured for IPv6: your VMs receive non-routable addresses
> and have no working public IPv6. Always set the pool to your own routed `/64`.

##### Verifying your IPv6 pool

After setting the pool and restarting aleph-vm, confirm it is correct:

1. Check the value your node reports (replace the domain with your own):
   ```
   curl -s https://vm.example.org/status/config | jq .networking.IPV6_ADDRESS_POOL
   ```
   It must show **your** `/64`, not `fc00:1:2:3::/64`, and not a `/64` shared with other machines.
2. Confirm the range is globally routable: it should start with a global-unicast prefix
   (`2000::/3`), not `fc00::/7` (ULA) or `fe80::/10` (link-local).
3. From a machine **outside** your host, ping the IPv6 of one of your running VMs to confirm the
   `/64` is actually routed to you: `ping6 <vm-ipv6-address>`.

#### Network Interface

The default network interface is detected automatically from the IP routes.
You can configure the default interface manually instead by adding:

```
ALEPH_VM_NETWORK_INTERFACE=enp0s1
```

(don't forget to replace `enp0s1` with the name of your default network interface).

#### Domain Name Servers (optional)

You can configure the DNS resolver manually by using one of the following options:

```
ALEPH_VM_DNS_RESOLUTION=resolvectl
ALEPH_VM_DNS_RESOLUTION=resolv.conf
```

> 💡 You can instead specify the DNS resolvers used by the VMs using `ALEPH_VM_DNS_NAMESERVERS=["1.2.3.4", "5.6.7.8"]`.

### Volumes and partitions (optional)

Two directories are used to store data from the network:

- `/var/lib/aleph/vm` contains all the execution and persistent data.
- `/var/cache/aleph/vm` contains data downloaded from the network.

These two directories must be stored on the same partition.
That partition must meet the minimum requirements specified for a CRN.

> 💡 This is required due to the software using hard links to optimize performance and disk usage.

### Applying changes

Finally, restart the service:

```shell
systemctl restart aleph-vm-supervisor
```

## 4. Install a Reverse Proxy

<!--@include: ../configure-haproxy.md-->

## 5. Test

Open https://[YOUR DOMAIN] in a web browser, wait for diagnostic to complete and look for

> ![image](https://user-images.githubusercontent.com/404665/150202090-91a02536-4e04-4af2-967f-fe105d116e1f.png)

If you face an issue, check the logs of the different services for errors:

VM-Supervisor:

```shell
journalctl -f -u aleph-vm-supervisor.service
```

Caddy:

```shell
journalctl -f -u caddy.service
```

VM-Connector:

```shell
docker logs -f vm-connector
```

IPv6 connectivity can be checked by opening the path `/status/check/ipv6` on the CRN's URL after restarting the service.

```
https://vm.example.org/status/check/ipv6
```

### Common errors

#### "Network interface eth0 does not exist"

Did you update the configuration file `/etc/aleph-vm/supervisor.env` with `ALEPH_VM_NETWORK_INTERFACE` equal to
the default network interface of your server ?

#### "Aleph Connector unavailable"

Investigate the installation of the VM-Connector using Docker in step 2.

## Advanced Troubleshooting

If you encounter any issues during installation, check the [Troubleshooting Guide](/nodes/compute/troubleshooting/#compute-resource-node-troubleshooting) or reach out to the community for support.
