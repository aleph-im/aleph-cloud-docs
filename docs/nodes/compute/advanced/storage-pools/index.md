# Configuring Multi-Disk Volume Pools

This guide explains how to spread VM storage across several local disks on a Compute Resource Node (CRN) running aleph-vm 2.0. Once configured, the node places each new VM's disks on the fastest-eligible disk with the most free space, and advertises the combined free space of all disks to the network.

::: warning Prerequisites
- aleph-vm 2.0 or later. Earlier versions only use a single volume directory.
- Root access to the CRN.
- One or more additional SSD or NVMe disks, each formatted and mounted on its own path (for example `/mnt/nvme1`).
:::

## How volume pools work

A **volume pool** is a plain directory, typically the mountpoint of one dedicated SSD or NVMe filesystem. The node keeps every VM's disks (the instance rootfs overlay and any persistent data volumes) in a per-VM subdirectory of one pool: `{pool}/{vm-hash}/`.

- **Pool 0** is always `ALEPH_VM_PERSISTENT_VOLUMES_DIR` (default `/var/lib/aleph/vm/volumes/persistent/`). With no extra pools configured, the node behaves exactly like a single-disk node.
- **Extra pools** come from the `ALEPH_VM_VOLUME_POOLS` setting, one entry per additional disk.
- **Placement**: when a VM is created, its disks go to the eligible pool with the most free bytes. A single volume never spans two pools.
- **Lookup**: the node finds an existing VM's disks by scanning `{pool}/{vm-hash}/` across all pools, so nothing about placement needs to be stored elsewhere.
- **Capacity**: the disk space advertised to the network is the sum of free space across all pools. A VM is admitted only if the total fits *and* its largest single volume fits on at least one pool.

Pools are deliberately independent directories rather than an LVM, mdraid, btrfs or ZFS aggregate. If one disk dies, only the VMs whose disks live on it are affected, and the rest of the node keeps running.

### Media classes

Each pool has a media class: `nvme`, `ssd` or `hdd`. The node detects it automatically from the kernel (`/sys/class/block/*/queue/rotational`, walking through dm/md layers to the slowest member). You can override it with `path=class` in the entry.

**VM disks belong on SSD or NVMe storage.** A pool detected or declared as `hdd` is rejected at startup, and `ALEPH_VM_PERSISTENT_VOLUMES_DIR` should be on solid-state storage as well. Rotational disks are still useful on a CRN: point the download cache (`ALEPH_VM_CACHE_ROOT`) or the backup directory (`ALEPH_VM_BACKUP_DIRECTORY`) at them.

## Configuration steps

::: warning
Execute these commands as root. On Ubuntu systems, use `sudo`.
:::

### 1. Prepare and mount the disks

Format each extra disk with a filesystem of your choice and mount it permanently.

::: danger
`mkfs` destroys everything on the target device. Check the device name with `lsblk` first and make sure it is the new, empty disk.
:::

Example for one NVMe drive:

```shell
mkfs.ext4 /dev/nvme1n1
mkdir -p /mnt/nvme1
```

Add the mount to `/etc/fstab`, using the filesystem UUID so the entry survives device renumbering:

```shell
blkid /dev/nvme1n1
```

```text
UUID=<uuid-from-blkid>  /mnt/nvme1  ext4  defaults,nofail  0  2
```

Then mount it and create the pool directory:

```shell
mount /mnt/nvme1
mkdir -p /mnt/nvme1/aleph-volumes
```

::: tip
Use a subdirectory of the mountpoint (here `aleph-volumes`) rather than the mountpoint itself. Keeping the pool one level down leaves room for `lost+found` and makes an unmounted disk easier to spot (see [Safety guards](#safety-guards) below).
:::

Repeat for every additional disk.

### 2. Declare the pools

Edit `/etc/aleph-vm/supervisor.env` and add `ALEPH_VM_VOLUME_POOLS`. The value is a JSON list of strings; each entry is either an absolute path or `path=class`:

```shell
ALEPH_VM_VOLUME_POOLS='["/mnt/nvme1/aleph-volumes", "/mnt/nvme2/aleph-volumes"]'
```

Or, with explicit media classes:

```shell
ALEPH_VM_VOLUME_POOLS='["/mnt/nvme1/aleph-volumes=nvme", "/mnt/sata-ssd/aleph-volumes=ssd"]'
```

Notes:

- Do **not** list `ALEPH_VM_PERSISTENT_VOLUMES_DIR` here; it is always pool 0.
- Paths must be absolute and the directories must already exist.
- Keep the single quotes: the JSON list contains double quotes, and systemd's environment file needs the outer quotes to pass the value through unchanged.
- An explicit class is only needed when detection fails (for example for a network block device, or a stacked device the detector cannot resolve). The startup error tells you when this is the case.

### 3. Restart the services

Both the agent (which places volumes) and the supervisor daemon (which reports capacity) read this file:

```shell
systemctl restart aleph-vm-supervisor aleph-vm-agent
```

Running VMs are not affected by the restart: the supervisor re-adopts them.

### 4. Verify

Check that the agent started and picked up the pools:

```shell
journalctl -u aleph-vm-agent -n 50 --no-pager
```

Any misconfiguration is a hard startup error with a message pointing at the offending entry (missing directory, undetectable media class, HDD pool, unknown class). The agent refuses to start rather than silently placing volumes in the wrong place.

Once the agent is up, each pool that has been used at least once contains a marker file:

```shell
ls -la /mnt/nvme1/aleph-volumes/.aleph-vm-pool
```

and the registry of adopted pools lists it:

```shell
cat /var/lib/aleph/vm/volume-pools.json
```

The node's advertised disk capacity (the `/about/usage/system` endpoint of your CRN and the figures in the network dashboards) now reflects the combined free space of all pools.

## Safety guards

The node protects against the most common multi-disk mistake: a disk that is not mounted. An unmounted mountpoint is just an empty directory, indistinguishable from a brand-new pool, and writing VM disks into it would fill the root filesystem instead of the intended drive.

Two mechanisms work together:

- A **marker file** (`.aleph-vm-pool`) written to a pool the first time it is used.
- A **registry** (`/var/lib/aleph/vm/volume-pools.json`) of every pool path ever adopted.

At startup, a pool that is in the registry but has no marker file is treated as "very likely not mounted" and the agent refuses to start. Mount the disk and restart.

The same guard fires if you **remove** a pool from `ALEPH_VM_VOLUME_POOLS` while it is still in the registry, because the VMs stored there would otherwise become unreachable. To really retire a pool:

1. Migrate or delete every VM whose disks live on it (`ls {pool}` lists the VM hashes).
2. Remove the pool's entry from `ALEPH_VM_VOLUME_POOLS`.
3. Remove its path from `/var/lib/aleph/vm/volume-pools.json` by hand.
4. Restart the services.

::: warning
Never edit `volume-pools.json` to work around a startup error you do not understand. The error is telling you that VM data may be on a disk the node can no longer see.
:::

## Troubleshooting

| Startup error | Cause | Fix |
| --- | --- | --- |
| `Volume pool /mnt/x does not exist (is the disk mounted?)` | Directory missing | Mount the disk and create the directory |
| `Cannot detect the media class of /mnt/x; add an explicit override` | Detector could not resolve the device | Append `=nvme` or `=ssd` to the entry |
| `Volume pool /mnt/x is rotational storage (HDD)` | Disk is an HDD | Use it for `ALEPH_VM_CACHE_ROOT` or `ALEPH_VM_BACKUP_DIRECTORY` instead |
| `Unknown media class` | Typo in the `=class` suffix | Use exactly `nvme` or `ssd` (HDD pools are rejected) |
| `... adopted as a volume pool but no marker file ...` | Disk is registered but not mounted | Mount the disk and restart |
| `Pool(s) ... were adopted ... but are no longer configured` | Pool removed from the setting while still registered | Follow the retirement steps above |

If a pool becomes unreadable while the node is running (disk failure), the agent logs the error and skips that pool for placement and capacity; VMs on the other pools keep running and new VMs are still admitted.
