# Migrating a Node to a New Server

This guide walks node operators through migrating a Core Channel Node (CCN) to new physical hardware while minimising downtime, preserving on-chain identity, and protecting node score and rewards.

::: info CRN migration
A dedicated guide for migrating a Compute Resource Node (CRN) is in progress and will be published in a future update.
:::

::: tip Plan for downtime
Migration will cause a brief interruption. Schedule it during a low-activity window and monitor your node score before and after. Some score recovery time is normal after any restart.
:::

## General Principles

- **On-chain identity does not move with the server.** A node's identity is its Ethereum address registered in the node registry — that stays the same. What changes is the underlying machine serving traffic for that identity.
- **Keep the same public IP when possible.** Other nodes' P2P trust is tied to the IPv4 address and node keys. Migrating to the same IP is the smoothest path.
- **Always back up before you migrate.** Treat the migration as a backup/restore exercise. See the [Backups guide](/nodes/resources/management/backups/) first.

---

## Migrating a Core Channel Node (CCN)

### 1. Prepare backups on the old server

Follow the [Backups guide](/nodes/resources/management/backups/) to capture what you need. There are two supported migration strategies — pick the one that fits your situation:

#### Required (minimal migration)

At a minimum, you **must** migrate:

- **pyaleph P2P keys** — `pyaleph/keys/*` (critical: other nodes trust these keys; losing them is equivalent to creating a new node identity)
- **`config.yml`** — your pyaleph configuration file
- **`docker-compose.yml`** — and any customised overrides you maintain

With only these files, the new node will come up with the correct identity and resynchronise **all** state from the network from scratch.

- **Pros:** much smaller transfer; no risk of carrying over a corrupted database or stale file storage.
- **Cons:** full resync typically takes **24 hours to one week** depending on CPU, disk, and network throughput. During resync the node is not serving fully, but **this does not impact your node score** — the score only penalises unresponsive or misconfigured nodes, not a node that is legitimately catching up.

#### Recommended (fast recovery)

For the shortest downtime, also back up the data volumes in addition to the files above:

- **PostgreSQL database** — Docker volume `pyaleph-postgres`
- **pyaleph local storage** — Docker volume `pyaleph-local-storage`
- **IPFS (Kubo) data** — Docker volume `pyaleph-ipfs`

With a recent, consistent copy of these volumes the new node can resume in minutes to hours rather than days. Ensure backups are consistent: either stop the node before snapshotting, or use a filesystem with atomic snapshots (BTRFS/ZFS/QCOW).

#### IPFS identity (Kubo) — when to keep or regenerate

The IPFS daemon (Kubo) has its own identity key, stored in the Kubo `config` file inside the `pyaleph-ipfs` volume, typically at:

```
/var/lib/docker/volumes/pyaleph_pyaleph-ipfs/_data/config
```

Whether you should migrate this file depends on the new IP address:

- **Same public IP on the new server** — back up and restore the Kubo `config` file so the IPFS peer ID stays the same. Other IPFS peers will continue to recognise your node without rebuilding connectivity.
- **New public IP on the new server** — you can still keep the Kubo `config` if you want to, but it is not required. If the file is not migrated, Kubo will generate a fresh identity on first start. This is harmless: the IPFS network will discover your new peer ID automatically.

### 2. Provision the new server

On the destination machine, install Docker and pyaleph following the [CCN installation guide](/nodes/core/installation/), but **do not start** the node yet.

### 3. Stop the old node

```shell
cd /path/to/pyaleph
docker compose down
```

Take a final incremental snapshot of the database and file storage at this point — this is the cleanest state to restore from.

### 4. Transfer data to the new server

Copy the required files to the new machine. The P2P keys and configuration are mandatory:

```shell
rsync -av /path/to/pyaleph/keys/ user@new-server:/path/to/pyaleph/keys/
rsync -av /path/to/pyaleph/config.yml user@new-server:/path/to/pyaleph/config.yml
rsync -av /path/to/pyaleph/docker-compose.yml user@new-server:/path/to/pyaleph/docker-compose.yml
```

If you chose the **recommended (fast recovery)** path, also transfer the data volumes:

```shell
rsync -av /var/lib/docker/volumes/pyaleph_pyaleph-postgres/ \
  user@new-server:/var/lib/docker/volumes/pyaleph_pyaleph-postgres/
rsync -av /var/lib/docker/volumes/pyaleph_pyaleph-local-storage/ \
  user@new-server:/var/lib/docker/volumes/pyaleph_pyaleph-local-storage/
rsync -av /var/lib/docker/volumes/pyaleph_pyaleph-ipfs/ \
  user@new-server:/var/lib/docker/volumes/pyaleph_pyaleph-ipfs/
```

Volume paths may differ depending on your Docker installation; verify with `docker volume inspect`.

If you're keeping the **same public IP** and want to preserve the IPFS peer identity, the Kubo `config` file is already included when you rsync the whole `pyaleph-ipfs` volume — no extra step needed.

If you're using a **new IP** and want Kubo to regenerate its identity instead, exclude the config file during the rsync:

```shell
rsync -av --exclude='_data/config' \
  /var/lib/docker/volumes/pyaleph_pyaleph-ipfs/ \
  user@new-server:/var/lib/docker/volumes/pyaleph_pyaleph-ipfs/
```

Kubo will write a fresh `config` with a new identity the first time it starts on the new server.

### 5. Network considerations

- **Same IPv4**: if you can keep the same public IPv4 (e.g. by moving the address), the other nodes on the network will continue trusting your peer without rebuilding reputation. This is the smoothest path.
- **New IPv4**: your node will still work, but other peers need to re-establish trust, which can take hours to days. Expect a temporary score dip during this period.

If you use a DNS name, update the `A`/`AAAA` records to point to the new server and wait for propagation before starting.

### 6. Start the new node

On the new server:

```shell
cd /path/to/pyaleph
docker compose up -d
```

Verify:

- `docker compose logs -f pyaleph` shows normal P2P activity
- The node catches up with recent messages
- Your node appears healthy on the [Node Operator Dashboard](https://app.aleph.cloud/account/earn/ccn/)

### 7. Update the on-chain registration (multiaddress)

A CCN is registered on-chain with a **multiaddress** that includes its public IP and libp2p peer ID. If the new server has a different IP, or you let the P2P identity change, you must update the registered multiaddress so other nodes and the network can reach you — otherwise your node will look unreachable and your score will drop.

**When you must update the multiaddress:**

- The new server has a different public IPv4 than the old one, **or**
- You did not migrate `pyaleph/keys/*` and the peer ID changed.

**When you can skip this step:**

- Same public IPv4 **and** the P2P keys were migrated — the multiaddress is unchanged.

**Retrieve the new multiaddress** by querying the running node (replace `NODE_IP_ADDRESS` with the new public IP):

```shell
curl -s http://NODE_IP_ADDRESS:4024/api/v0/info/public.json | jq -r .node_multi_addresses[0]
```

The output looks like `/ip4/1.2.3.4/tcp/4025/p2p/Qm...`.

**Update the registration:**

1. Open the [Node Operator Dashboard](https://app.aleph.cloud/account/earn/ccn/).
2. Connect the wallet that owns the node registration.
3. Locate your node in the list and open its settings.
4. Replace the multiaddress with the new value retrieved above and save.

Changes propagate within a few minutes. Monitor your node's score on the dashboard to confirm it recovers.

### 8. Decommission the old server

Only after the new node is confirmed synced and healthy:

1. Confirm the old server is fully stopped (`docker compose ps` shows nothing running).
2. Keep the old backups for at least a few days in case you need to roll back.
3. Wipe or repurpose the old machine.

---

<!--
## Migrating a Compute Resource Node (CRN)

This section is hidden until the CRN migration procedure has been fully validated. Do not re-enable without review.

CRNs hold less persistent state than CCNs — ephemeral VMs are rescheduled automatically, and most persistent instances can be re-fetched from the network. The important things to preserve are configuration, the domain name, and TLS.

### 1. Back up CRN configuration

On the old server, back up:

- **`/etc/aleph-vm/supervisor.env`** — main aleph-vm configuration, including `ALEPH_VM_NETWORK_INTERFACE`, `ALEPH_VM_DOMAIN_NAME`, `PAYMENT_RECEIVER_ADDRESS`, and any GPU/confidential settings
- **Reverse proxy configuration** — `/etc/caddy/Caddyfile` or `/etc/haproxy/haproxy.cfg`, plus any TLS certificates not managed by automatic renewal
- **Systemd overrides**, if any, under `/etc/systemd/system/aleph-vm-supervisor.service.d/`

### 2. Provision the new server

Install aleph-vm on the new machine following the [Debian 12](/nodes/compute/installation/debian-12/) or [Ubuntu 24.04](/nodes/compute/installation/ubuntu-24.04/) installation guide.

**Do not start the supervisor yet.** Complete the configuration step first.

### 3. Restore configuration on the new server

Copy the backed-up files into place:

```shell
scp user@old-server:/etc/aleph-vm/supervisor.env /etc/aleph-vm/supervisor.env
scp -r user@old-server:/etc/caddy/ /etc/caddy/     # or haproxy
```

Review `supervisor.env` and update any hardware-specific settings on the new server:

- `ALEPH_VM_NETWORK_INTERFACE` — the name of the network interface on the new host (e.g. `eth0`, `enp1s0`)
- Any path that referenced the old disk layout
- GPU device IDs if GPU support is enabled

The reward address (`PAYMENT_RECEIVER_ADDRESS`) and domain name should remain unchanged — they tie the node to its on-chain identity.

### 4. Update DNS

Point your CRN domain's `A` and `AAAA` records at the new server's IP addresses. Wait for DNS propagation — the CRN's domain name is the identity that the scheduler and users rely on.

If you use Let's Encrypt with automatic HTTP-01 challenges, the new server will need to obtain fresh certificates once DNS resolves. If you copied existing certificates, make sure the domain still matches.

### 5. Stop the old node

Only once the new server is configured and DNS is updated:

```shell
sudo systemctl stop aleph-vm-supervisor
sudo systemctl disable aleph-vm-supervisor
```

### 6. Start the new node

```shell
sudo systemctl start aleph-vm-supervisor
sudo systemctl status aleph-vm-supervisor
journalctl -u aleph-vm-supervisor -f
```

Verify:

- The supervisor starts without errors
- Your CRN responds at `https://your-domain/about/usage/system`
- The node appears in the [Node Operator Dashboard](https://app.aleph.cloud/account/earn/crn/) with a healthy status
- Confidential/GPU features (if configured) are detected correctly

### 7. Update the on-chain registration (domain name)

A CRN is registered on-chain with its **domain name** (address/URL), not an IP. In most migrations you keep the same domain and only repoint DNS, in which case **no on-chain update is required**.

You only need to update the registration if you are also changing the domain name itself (for example, moving from `old-crn.example.com` to `new-crn.example.com`):

1. Open the [Node Operator Dashboard](https://app.aleph.cloud/account/earn/crn/).
2. Connect the wallet that owns the node registration.
3. Locate your CRN and open its settings.
4. Replace the address/URL with the new domain and save.

If you kept the same domain, skip this step — the network already knows how to reach you through DNS.

### 8. Persistent instances

Persistent VMs scheduled on your CRN will need to be rescheduled by their owners or will be re-launched by the scheduler on the next tick — this is expected and part of the normal CRN lifecycle. Pay-as-you-go instances will continue streaming payments as long as the CRN remains reachable at the same domain.

### 9. Decommission the old server

Confirm the new node is fully operational for at least one scoring window, then stop and wipe the old machine.
-->

---

## Post-Migration Checklist

- New node is running and healthy
- On-chain registration updated if the multiaddress changed
- Node appears on the official monitoring dashboard
- Score is stable (monitor for 24–48 hours)
- Old server is fully stopped to prevent double-running
- Backups from the migration are kept until the new node is confirmed stable
- Any firewall, reverse proxy, and DNS changes are documented for future reference

## Troubleshooting

If the new node fails to sync or appears unhealthy:

- Check firewall rules — CCN requires ports `4001` (IPv4 and IPv6) and `4025`.
- Verify the P2P keys were copied correctly and have the right ownership/permissions.
- Review logs with `docker compose logs`.
- See the [Node Troubleshooting guide](/nodes/resources/management/troubleshooting/) for common issues.
