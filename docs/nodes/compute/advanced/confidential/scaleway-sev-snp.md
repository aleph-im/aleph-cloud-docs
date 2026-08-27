# SEV-SNP CRN on Scaleway Elastic Metal

This page describes how to set up a Compute Resource Node with AMD SEV-SNP
on a Scaleway Elastic Metal server. It covers the parts that are specific
to Scaleway: choosing a server, BIOS updates, IPv6, and SEV platform
recovery. General SEV requirements and the aleph-vm settings are documented
in [Enable Confidential](/nodes/compute/advanced/confidential/), and the
network requirements in the
[installation guide](/nodes/compute/installation/ubuntu-24.04/#network-configuration).

Tested with an Elastic Metal server based on a Dell PowerEdge C6615 with an
AMD EPYC 8024P (Siena), Ubuntu 24.04.4, kernel 6.14 (HWE), BIOS 1.12.2,
microcode 0x0aa0021c, SEV firmware 1.58, QEMU 9.0.2, OVMF 2024.05 and
aleph-vm 2.0 with the Rust supervisor.

## 1. Server selection {#server-selection}

aleph-vm requires a 4th generation EPYC processor or later (9004 Genoa and
Bergamo, 8004 Siena). Zen3 (Milan) and earlier are not supported. The 4004
series does not implement SEV.

The BIOS must be recent enough to include the EntrySign microcode fix
(CVE-2024-56161). Attestation clients enforce a minimum microcode patch
level (SPL) per processor family; on a host below that level SNP guests
boot normally but their attestation reports are rejected. The BIOS
version is not part of the Scaleway offer description and cannot be
changed by the customer (see [BIOS updates](#bios-updates)), so check it
as soon as the server is delivered:

```bash
grep -m1 'model name' /proc/cpuinfo
grep -o -w -E 'sev|sev_es|sev_snp' /proc/cpuinfo | sort -u
grep -m1 microcode /proc/cpuinfo
sudo dmidecode -s system-product-name
sudo dmidecode -s bios-version
```

All three of `sev`, `sev_es` and `sev_snp` must be present. The microcode
value must be at or above the minimum for the processor family:

| Processor | CPUID family / model | Minimum microcode | SPL |
|---|---|---|---|
| Siena, Bergamo (Zen4c: EPYC 8004, 97x4) | 19h / A0h | 0x0aa00219 | 25 |
| Genoa (Zen4: EPYC 9004) | 19h / 11h | 0x0a101154 | 84 |
| Genoa-X | 19h / 11h, stepping 2 | 0x0a10124f | 79 |

These are the minimums published by AMD in security bulletin
[AMD-SB-3019](https://www.amd.com/en/resources/product-security/bulletin/amd-sb-3019.html)
and the default floors enforced by the aleph CLI.

If the microcode is below the minimum, either open a support ticket (see
[BIOS updates](#bios-updates)) or release the server and order a new one.
BIOS levels differ between servers of the same offer, and a new delivery
may already be up to date. As a reference point, a C6615 delivered with
BIOS 1.3.3 runs microcode 0x0aa00215 (SPL 21), and reaching SPL 28 on it
took two Scaleway interventions.

Installing the `amd64-microcode` package does not raise the level on an
old BIOS. Microcode patches from 0x0aa00218 onwards use a new signature
scheme and are only accepted by the processor when the BIOS base microcode
already contains the signing fix; on an older BIOS the OS-loaded patch is
rejected and the BIOS level remains in effect.

## 2. Operating system {#operating-system}

Ubuntu 24.04 with the HWE kernel is the tested configuration. SNP host
support requires Linux 6.11 or later.

```bash
sudo apt install -y linux-generic-hwe-24.04 amd64-microcode qemu-system-x86 ovmf ndppd
sudo reboot
```

[snphost](https://github.com/virtee/snphost) is the SNP equivalent of
`sevctl ok` and is used below to check the platform. It is not packaged
for Ubuntu; install it with cargo:

```bash
sudo apt install -y cargo
cargo install --locked snphost
sudo install ~/.cargo/bin/snphost /usr/local/bin/snphost
```

Run `sudo snphost ok`. All checks must pass. On a healthy host the output
includes:

```
- SEV firmware version: 1.58
- SNP initialized
  - RMP table initialized
  - Alias check: Completed since last system update, no aliasing addresses
- SEV-SNP enabled in KVM
- Comparing TCB values: TCB versions match
 Platform TCB version: Microcode: 28  SNP: 28  Boot Loader: 12
```

The kernel log should contain the following lines, and
`/sys/module/kvm_amd/parameters/sev_snp` should read `Y`:

```
$ sudo journalctl -k -b | grep -iE 'sev|snp|rmp'
SEV-SNP: RMP table physical range [...]
AMD-Vi: IOMMU SNP support enabled.
ccp 0000:02:00.5: SEV API:1.58 build:2
ccp 0000:02:00.5: SEV-SNP API:1.58 build:2
kvm_amd: SEV-SNP enabled (ASIDs 1 - 508)
```

No kernel command-line changes are needed; the Scaleway image boots with
`mem_encrypt=on`. If `snphost ok` reports SNP as not initialized, or the
log contains `SEV-SNP: failed to INIT rc -5, error 0x14`, see
[SEV platform recovery](#sev-platform-recovery).

## 3. BIOS updates {#bios-updates}

Scaleway does not allow customers to modify BIOS settings or flash
firmware on Elastic Metal servers (see the
[Elastic Metal FAQ](https://www.scaleway.com/en/docs/elastic-metal/faq/)).
The `scw baremetal bmc` commands only provide console access. BIOS
updates are requested through a support ticket.

A ticket is processed faster when it is specific. Include the server
model and current BIOS version (`dmidecode -s system-product-name`,
`dmidecode -s baseboard-product-name`, `dmidecode -s bios-version`), the
vendor advisory that applies, and the fixed version. For the PowerEdge
C6615 the relevant advisory is Dell DSA-2025-040 (CVE-2024-56161), fixed
in BIOS 1.6.2.

Mention that the server is used for SEV-SNP workloads, since the
advisory's stated impact is loss of SEV-SNP guest protection, and ask for
the latest available BIOS rather than the minimum fixed version: later
releases also update the AGESA and SEV firmware, which the attestation
report's SNP and Boot Loader components are derived from. Include a
maintenance window and confirm that the server may be rebooted.

After the intervention:

- The SSH host keys may have changed if the server was reinstalled.
- The `ccp` driver may upgrade the SEV firmware on the first boot. When it
  does, the persistent SEV state stored by the PSP no longer matches the
  platform and SNP initialization fails with `0x14 SECURE_DATA_INVALID`.
  QEMU then fails with `sev_common_kvm_init ... fw_error=26` and
  `sevctl export` exits with status 1 (the CRN returns HTTP 500 when a
  session is initialized). [SEV platform recovery](#sev-platform-recovery)
  describes the fix; reinstalling aleph-vm does not help.
- Check `grep microcode /proc/cpuinfo` again. An intervention can update
  the SEV firmware without changing the microcode level, in which case the
  ticket needs to be reopened. On the C6615 mentioned above, the first
  intervention only updated the SEV firmware; the second installed BIOS
  1.12.2 and brought the microcode to 0x0aa0021c.
- Check `journalctl -k -b | grep -i 'hardware error'` over the following
  days. A fatal uncorrected machine check after a firmware change is a
  reason to ask for a hardware replacement.

Until the microcode meets the minimum, the aleph CLI can be told to accept
the host with `--min-tcb microcode=<n> --accept-outdated-tcb` on attested
calls. This is only useful for testing the rest of the setup and should
be removed once the host is updated.

## 4. IPv6 {#ipv6}

Each Elastic Metal server has one native IPv6 address, assigned by SLAAC
from a /64 advertised with a 15 second router lifetime. This /64 cannot be
used as the VM address pool: Scaleway's network only forwards outgoing
traffic whose source is the server's registered address. Packets sent
from other addresses in the native /64 are dropped upstream, so VMs
obtain an address and a default route but no connection succeeds.

VM addresses must come from a flexible IPv6 block, attached to the server
from the console (Elastic Metal > Flexible IPs) or the
[API](https://www.scaleway.com/en/developers/api/elastic-metal-flexible-ip/)
(`POST /flexible-ip/v1alpha1/zones/<zone>/fips` with `is_ipv6: true` and
the server id). One /64 per server is sufficient. Traffic for the flexible
/64 is delivered on-link: the Scaleway gateway sends a neighbour
solicitation for each address and forwards to whoever answers. aleph-vm
configures `ndppd` to answer for each VM's /124, and outgoing traffic
from the flexible /64 is accepted from the server's own MAC address.
Virtual MACs, as described in Scaleway's documentation for bridged
hypervisors, are not needed.

Configure the pool in `/etc/aleph-vm/supervisor.env`, as described in the
[installation guide](/nodes/compute/installation/ubuntu-24.04/#network-configuration):

```
ALEPH_VM_IPV6_ADDRESS_POOL=2001:db8:1:2::/64
ALEPH_VM_IPV6_ALLOCATION_POLICY=dynamic
```

`ALEPH_VM_USE_NDP_PROXY` is enabled by default and requires the `ndppd`
package. aleph-vm enables `net.ipv6.conf.all.forwarding`; it can also be
persisted under `/etc/sysctl.d`.

Do not add an address from the flexible /64 to the uplink interface. The
kernel would start using it as the source address for the host's own
traffic, and it interferes with the NDP proxy. The host keeps its native
SLAAC address.

With systemd-networkd, router advertisements are processed in user space
and the default route survives forwarding being enabled. Distributions
that rely on the kernel for RA processing need `accept_ra=2` on the
uplink.

To check the setup once a VM is running, `/etc/ndppd.conf` should contain
a rule for the VM's /124 on its `vmtap` interface, `ip -6 route` should
show the corresponding route, and the VM address should answer pings from
an external IPv6 host.

## 5. aleph-vm configuration {#aleph-vm-configuration}

Install the aleph-vm Debian package as described in the
[installation guide](/nodes/compute/installation/ubuntu-24.04/), then
edit `/etc/aleph-vm/supervisor.env`. A complete configuration for a
confidential CRN on mainnet:

```
ALEPH_VM_SUPERVISOR_HOST=127.0.0.1
ALEPH_VM_DOMAIN_NAME=<CRN domain>
ALEPH_VM_OWNER_ADDRESS=<node owner wallet>
ALEPH_VM_PROGRAM_MEMORY_RESERVED_MIB=2048
ALEPH_VM_SUPERVISOR_GRPC_SOCKET=/var/lib/aleph/vm/supervisor.sock
ALEPH_VM_IPV6_ADDRESS_POOL=<flexible /64>
ALEPH_VM_IPV6_ALLOCATION_POLICY=dynamic
ALEPH_VM_ENABLE_CONFIDENTIAL_COMPUTING=true
ALEPH_VM_SEV_CTL_PATH=/opt/sevctl
ALEPH_VM_SUPERVISOR_IMPL=rust
ALEPH_VM_NODE_HASH=<node hash>
```

`ALEPH_VM_ENABLE_QEMU_SUPPORT`, listed on the
[Enable Confidential](/nodes/compute/advanced/confidential/) page, defaults
to enabled and does not need to be set. Boolean settings accept `true` or
`1`.

`ALEPH_VM_SUPERVISOR_IMPL=rust` is required for V-PROGRAMs (SEV-SNP);
the Python supervisor only implements the session-based SEV/SEV-ES path.
`/opt/sevctl` is installed by the package and is used to export the
platform certificate chain for SEV sessions; the export downloads the CEK
from AMD's key distribution service at `kdsintf.amd.com`, so the host
needs outbound HTTPS access to it.

The supervisor listens on localhost and a reverse proxy terminates TLS
(see [Install a Reverse Proxy](/nodes/compute/installation/ubuntu-24.04/#_4-install-a-reverse-proxy)).
A minimal Caddyfile:

```
{
    https_port 443
}
<CRN domain>:443 {
    reverse_proxy http://127.0.0.1:4020 {
        header_up Host {host}
    }
}
```

To register the node, create a compute node on
[account.aleph.im](https://account.aleph.im) with the owner wallet, set
`ALEPH_VM_NODE_HASH` to the resulting hash, restart
`aleph-vm-supervisor`, and only then link the node to a CCN. The
scheduler marks a node as unreachable when its first poll coincides with
a supervisor restart and does not retry on its own, so restarting after
linking can leave the node unused for a long time.

To check the configuration:

```bash
curl -s https://<domain>/about/usage/system | jq .properties
curl -s https://<domain>/status/config | grep -i confidential
sudo /opt/sevctl export /tmp/chain.cert
```

The first command should report `sev_snp: true` along with the node hash
and owner, the second should show `ENABLE_CONFIDENTIAL_COMPUTING` set to
true, and the third should exit with status 0.

## 6. Functional tests {#functional-tests}

Two flows use different code paths and both should be tested before the
node is put into service.

Session-based confidential instance (SEV/SEV-ES), as described in
[Confidential Instances](/devhub/compute-resources/confidential-instances/01-confidential-instance-introduction):

```bash
aleph instance create --confidential --confidential-firmware <ovmf> --crn-url https://<domain> ...
aleph instance confidential init-session <vm hash> --keep-session
aleph instance confidential start <vm hash> --secret <passphrase> --firmware-file <ovmf>
```

`start` waits for the launch measurement; requests to
`confidential/measurement` return HTTP 500 until QEMU has produced it,
which the CLI handles by retrying. In the guest, `dmesg | grep -i sev`
reports SEV as active and the root filesystem is on a `/dev/mapper/`
device. After `stop`, the instance needs `init-session` again before
`start`.

V-PROGRAM (SEV-SNP with attestation):

```bash
aleph vprogram create ...
aleph attest call <program> <endpoint>
```

The node must have been scheduled or have received a signed allocation
for the program. The attested call verifies the report against the
network TCB floor and fails on a host below the minimum microcode level.

## 7. SEV platform recovery {#sev-platform-recovery}

After a firmware change, SNP initialization can fail with
`SEV-SNP: failed to INIT rc -5, error 0x14` in the kernel log.
`snphost ok` then reports SNP as not initialized, SNP guests fail with
`SNP_LAUNCH_START fw_error=1 'Platform state is invalid'` or
`sev_common_kvm_init ... fw_error=26`, and `sevctl export` exits with
status 1. Non-confidential and legacy SEV guests may keep running.

The persistent SEV state held by the PSP has to be reset. `sevctl reset`
does this when the SEV ioctl path still works (`sudo /opt/sevctl reset`).
`snphost reset` was replaced by `snphost config reset`, which fails with
`EINVAL` in this situation because it goes through the SNP ioctl. Sending
the `SEV_FACTORY_RESET` command through the `SEV_ISSUE_CMD` ioctl
(`0xC0105300`, `struct sev_issue_cmd` with `cmd = 0`) works in all cases:

```bash
sudo python3 - <<'PY'
import fcntl, struct
f = open('/dev/sev', 'r+b', buffering=0)
fcntl.ioctl(f, 0xC0105300, bytearray(struct.pack('<IQI', 0, 0, 0)))
PY
sudo reboot
```

After the reboot, `sudo snphost ok` should report SNP as initialized. If
guests still fail to launch, stop the supervisor, kill any remaining
`qemu-system-x86_64` processes and start the supervisor again.

## 8. Operation {#operation}

Run `snphost ok` after every reboot and after any maintenance notice from
Scaleway. The TCB reported in attestation is sampled when a VM starts, so
SNP guests have to be restarted after a microcode update to attest at the
new level.

Outages of AMD's key distribution service appear as node failures:
`sevctl export` exits with status 1, the CRN returns HTTP 500 on
`init-session`, and attestation clients fail to download the VCEK.
`curl https://kdsintf.amd.com/vcek/v1/Genoa/cert_chain` and
`sudo /opt/sevctl export /tmp/x.cert` show the underlying error. Nothing
needs to be changed on the node.

Running VMs, including SEV instances, are preserved across supervisor
restarts and package upgrades. The agent returns HTTP 500 while the
supervisor is down, and the scheduler may mark the node as unreachable
(see [aleph-vm configuration](#aleph-vm-configuration)), so restarts
should be kept to a minimum.
