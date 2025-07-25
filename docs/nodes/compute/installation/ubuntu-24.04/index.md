# Ubuntu 24.04 LTS

## 0. Introduction

For production using official Ubuntu 24.04 LTS packages.

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
- NETWORK: Minimum 500 MB/s symmetrical, dedicated IPv4, and /64 or larger IPv6 subnet.

You will need a public domain name with access to add TXT and wildcard records.

> 💡 This documentation will use the invalid `vm.example.org` domain name. Replace it when needed.

## 2. Installation

Run the following commands:

First install the [VM-Connector](https://github.com/aleph-im/aleph-vm/tree/main/vm_connector) using Docker:

```shell
sudo apt update
sudo apt upgrade
sudo apt install -y docker.io
docker run -d -p 127.0.0.1:4021:4021/tcp --restart=always --name vm-connector alephim/vm-connector:alpha
```

Then install the [VM-Supervisor](https://github.com/aleph-im/aleph-vm/tree/main/src/aleph/vm/orchestrator) using the official Ubuntu 24.04 package.
The procedure is similar for updates.

```shell
# Download the latest release
release=$(curl -s https://api.github.com/repos/aleph-im/aleph-vm/releases/latest | awk -F'"' '/"tag_name":/ {print $4}')
sudo wget -P /opt/ https://github.com/aleph-im/aleph-vm/releases/download/${release}/aleph-vm.ubuntu-24.04.deb
# Install it
sudo apt install /opt/aleph-vm.ubuntu-24.04.deb
```

Reboot if required (new kernel, ...).

## 3. Configuration

Update the configuration in `/etc/aleph-vm/supervisor.env` using your favourite editor.

The minimum necessary configuration required is :

* Setting up the hostname `ALEPH_VM_DOMAIN_NAME`
* Override Domain Name Servers and the default network interface if they have not been detected properly.

It is also recommended to set to enable full instances support

* The IPv6 address pool
* [Pay as you go address](/nodes/compute/advanced/pay-as-you-go/index.md)

If your node has the required hardware, see the detailed instructions on how to enable their support

* [Confidential computing support](/nodes/compute/advanced/confidential/index.md)
* [GPU support](/nodes/compute/advanced/gpu/index.md)

### Hostname

You will want to insert your domain name in the form of:

```
ALEPH_VM_DOMAIN_NAME=vm.example.org
```

### Network configuration

#### IPv6 address pool

Each virtual machine receives its own ipv6, the range of IPv6 addresses usable by the virtual machines must be specified
manually.

According to the IPv6 specifications, a system is expected to receive an IPv6 with a /64
mask and all addresses inside that mask should simply be routed to the host.

The option takes the form of:

```
ALEPH_VM_IPV6_ADDRESS_POOL="2a01:4f8:171:787::/64"
```

Assuming your hosting provider follows the specification, the procedure is the following:

1. Obtain the IPv6 address of your node.
2. Remove the trailing number after `::` if present, for example `2a01:4f8:171:787::2/64` becomes
   `2a01:4f8:171:787::/64`.
3. Add the IPv6 range you obtained under the setting `ALEPH_VM_IPV6_ADDRESS_POOL` in the configuration.

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
sudo systemctl restart aleph-vm-supervisor
```

## 4. Install a Reverse Proxy

<!--@include: ../configure-haproxy.md-->


## 5. Test

Open https://[YOUR DOMAIN] in a web browser, wait for diagnostic to complete and look for

> ![image](https://user-images.githubusercontent.com/404665/150202090-91a02536-4e04-4af2-967f-fe105d116e1f.png)

If you face an issue, check the logs of the different services for errors:

VM-Supervisor:

```shell
sudo journalctl -f -u aleph-vm-supervisor.service
```

Caddy:

```shell
sudo journalctl -f -u caddy.service
```

VM-Connector:

```shell
sudo docker logs -f vm-connector
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

If you encounter any issues during installation, check the [Troubleshooting Guide](/nodes/resources/management/troubleshooting/#compute-resource-node-troubleshooting) or reach out to the community for support.