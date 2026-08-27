# Enabling Hugepages

This guide explains how to back VM memory with hugepages on a Compute Resource Node (CRN) running aleph-vm 2.0. Hugepages reduce TLB pressure and page-table overhead for memory-heavy guests, and improve memory locality on multi-socket servers. This feature is off by default and is an optimisation, not a requirement: a node without it runs the same workloads.

::: warning Prerequisites
- aleph-vm 2.0 or later.
- The **Rust supervisor** implementation. Hugepage support lives in the Rust supervisor daemon and controller; the Python implementation ignores these settings.
- A host with **more than one NUMA node** (typically a dual-socket server, or a single socket configured in NPS2/NPS4 mode). On a single-node host, NUMA placement and hugepages are inert, even when enabled.
- Root access to the CRN.
:::

## How it works

aleph-vm 2.0 is NUMA-aware. On a host with several NUMA nodes, the supervisor places each VM on one node (filling node 0 first, then node 1, and so on), pins the VM's process to that node's CPUs through a systemd `AllowedCPUs=` drop-in, and binds the VM's memory to the same node.

With hugepages enabled, the supervisor additionally:

1. **Reserves 2 MiB hugepages on every NUMA node at daemon startup**, by writing `nr_hugepages` under `/sys/devices/system/node/node*/hugepages/`. The amount reserved per node is the node's RAM minus a headroom of regular memory kept for the host, minus any 1 GiB pages already reserved, optionally capped by a global limit.
2. **Backs each VM's memory with hugepages** from its node's pool. 1 GiB pages are used when the VM's memory size is a multiple of 1 GiB and the node has enough free 1 GiB pages (see [1 GiB pages](#1-gib-pages) below); otherwise 2 MiB pages; otherwise regular pages.

Everything is fail-safe. If the reservation fails on one node (for example because memory is too fragmented), that node falls back to regular pages and the others are still reserved. If a node's pool runs out, VMs placed there simply get regular pages. Enabling hugepages never changes which node a VM lands on and never causes a VM creation to fail.

::: info Where the memory goes
Reserved hugepages are taken away from the host's general-purpose memory immediately at reservation time, whether or not any VM uses them. Choose the headroom (and optional limit) so the host itself, the download cache, HAProxy and any other services have enough regular memory left.
:::

## Configuration steps

::: warning
Execute these commands as root. On Ubuntu systems, use `sudo`.
:::

### 1. Check the host topology

```shell
ls -d /sys/devices/system/node/node*
```

If only `node0` is listed, the host has a single NUMA node and enabling the setting has no effect. On such hosts you can stop here.

Check current hugepage state:

```shell
grep -i huge /proc/meminfo
```

### 2. Switch to the Rust supervisor

Edit `/etc/aleph-vm/supervisor.env` and make sure the Rust implementation is selected:

```shell
ALEPH_VM_SUPERVISOR_IMPL=rust
```

::: warning
This one flag switches both the supervisor daemon and the per-VM controller. Already-running VMs keep their current controller process until they are next started, and a running VM launched by the other implementation is not guaranteed to be re-attached across the switch. Change this flag on a node with running VMs only after stopping them, or on a fresh node.
:::

### 3. Enable hugepages

In the same file, add:

```shell
ALEPH_VM_NUMA_HUGEPAGES=true
```

Optional tuning:

| Setting | Default | Meaning |
| --- | --- | --- |
| `ALEPH_VM_NUMA_HUGEPAGES_HEADROOM_MB` | `8192` | Regular memory (MiB) kept out of the reservation **on each node**. Raise it on dense nodes running many services; lower it on nodes dedicated to VMs. |
| `ALEPH_VM_NUMA_HUGEPAGES_LIMIT_MB` | unset | Global cap (MiB) on the total 2 MiB hugepage reservation, split evenly across nodes. Unset means "all RAM minus the per-node headroom". |

Example for a 2-node, 256 GiB host that should keep 16 GiB of regular memory per node and reserve at most 192 GiB of hugepages in total:

```shell
ALEPH_VM_NUMA_HUGEPAGES=true
ALEPH_VM_NUMA_HUGEPAGES_HEADROOM_MB=16384
ALEPH_VM_NUMA_HUGEPAGES_LIMIT_MB=196608
```

### 4. Restart the supervisor

```shell
systemctl restart aleph-vm-supervisor
```

::: tip Startup time
The reservation is written synchronously during daemon startup, before the supervisor accepts requests. On a host that has been running for a long time the kernel may need to compact memory to satisfy it, which can make this restart noticeably slower than usual. This happens only at startup, never when a VM is created.
:::

### 5. Verify

Check the reservation in the supervisor log:

```shell
journalctl -u aleph-vm-supervisor -n 100 --no-pager | grep -i hugepage
```

You should see one `reserved 2M hugepages` line per node. A `reserved fewer 2M hugepages than requested` warning means the kernel could not find enough contiguous memory; a reboot with a fresh (unfragmented) memory state usually resolves it. A `failed to reserve 2M hugepages on this node` warning means that node stays on regular pages.

Confirm from the kernel side:

```shell
grep -i huge /proc/meminfo
cat /sys/devices/system/node/node*/hugepages/hugepages-2048kB/nr_hugepages
```

Finally, once a VM has been started on the node, check that its QEMU process uses a hugepage-backed memory object bound to one NUMA node:

```shell
ps -eo args | grep -o 'memory-backend-memfd[^ ]*' | head
```

The output should contain `hugetlb=on,hugetlbsize=2M` (or `1G`) together with `host-nodes=<n>,policy=bind`.

## 1 GiB pages

The supervisor never reserves 1 GiB pages itself. If you want VMs with 1 GiB-aligned memory sizes (for example 4096 MiB, 8192 MiB) to use them, reserve the pages at boot through the kernel command line, for example in `/etc/default/grub`:

```
GRUB_CMDLINE_LINUX="... default_hugepagesz=2M hugepagesz=1G hugepages=64"
```

then run `update-grub` and reboot. The supervisor detects the 1 GiB pages on each node, subtracts them from the 2 MiB budget so the two reservations never overlap, and prefers 1 GiB pages for eligible VMs.

## Disabling hugepages

Set `ALEPH_VM_NUMA_HUGEPAGES=false` (or remove the line) and restart the supervisor. The daemon does not release a reservation it made earlier; to give the memory back to the host without a reboot, write `0` to each node's `nr_hugepages` file:

```shell
for f in /sys/devices/system/node/node*/hugepages/hugepages-2048kB/nr_hugepages; do echo 0 > "$f"; done
```

Pages still in use by running VMs are released only when those VMs stop.

## Troubleshooting

| Symptom | Cause | Fix |
| --- | --- | --- |
| No hugepage lines in the supervisor log | Python supervisor selected, or single-NUMA host | Set `ALEPH_VM_SUPERVISOR_IMPL=rust`; check `/sys/devices/system/node/` |
| `no 2M hugepage budget for this node` | Headroom (or limit) leaves nothing to reserve | Lower `ALEPH_VM_NUMA_HUGEPAGES_HEADROOM_MB` or raise the limit |
| `reserved fewer 2M hugepages than requested` | Memory fragmentation | Reboot, or accept the smaller pool |
| Host services getting OOM-killed after enabling | Headroom too small for the host's own needs | Raise the headroom, restart the supervisor, release pages as shown above |
| VMs run with regular pages although the pool is non-empty | Pool exhausted by earlier VMs; a stopped VM keeps its reservation until deleted | Expected; delete unused VMs or raise the pool |
| Supervisor fails to start with a settings error | Non-boolean/non-integer value | Use `true`/`false` and plain integers |
