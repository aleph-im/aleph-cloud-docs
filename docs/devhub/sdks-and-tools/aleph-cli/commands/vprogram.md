# Verifiable Program Deployment

The `vprogram` command group allows you to deploy and manage verifiable programs (V-PROGRAMs) on the Aleph Cloud network.

A V-PROGRAM is a confidential VM running under AMD SEV-SNP whose entire boot chain is measured ahead of time: the runtime bundle (firmware, kernel, initrd, platform rootfs) is published by Aleph Cloud, and your workload is a read-only dm-verity image whose root hash is baked into the kernel command line. The CLI computes the expected launch measurement before publishing, pins it on the message, and every call you make to the guest is verified against it over RA-TLS. If a node runs anything other than exactly what was published, the call fails before a single byte of the response is read.

Compared to a regular program:

- There is no disk allocation. The guest boots from read-only verity images only; writable scratch is a tmpfs carved out of guest memory.
- Payment is always credit. Make sure your account holds credits before deploying (see [Credits](./credits.md)).
- The guest exposes exactly one endpoint: an attested (RA-TLS) port served by the guest agent, which proxies to whatever listens on `127.0.0.1:8080` inside the VM.
- Everything in the workload is public and measured. That includes environment variables in a Compose file; there is no secret channel into the guest.

## Overall Usage

```bash
aleph vprogram [OPTIONS] COMMAND [ARGS]...
```

### Options

| Option   | Description                   |
| -------- | ----------------------------- |
| `--help` | Show the help prompt and exit |

### Key Commands

| Command  | Description                                                              |
| -------- | ------------------------------------------------------------------------ |
| `create` | Build, measure and publish a verifiable program                          |
| `list`   | List V-PROGRAMs owned by an address, with scheduler status and endpoint  |
| `show`   | Show a published V-PROGRAM plus its CRN's live status                    |
| `call`   | Make an attested HTTP call to a running V-PROGRAM                        |
| `delete` | Forget a V-PROGRAM (the scheduler tears the VM down on its own)          |

## Prerequisites

`vprogram create` shells out to a few host tools to build and hash the workload image. Install them before you start:

| Tool                  | Package (Debian/Ubuntu) | Needed for                                    |
| --------------------- | ----------------------- | --------------------------------------------- |
| `veritysetup`         | `cryptsetup-bin`        | Every create (dm-verity hash tree of images)  |
| `mkfs.ext4`           | `e2fsprogs`             | `--compose` (building the workload image)     |
| `podman` or `docker`  | `podman`                | `--compose` (pulling and saving images)       |

`podman` is preferred when both are present. The `--workload` path (a prebuilt ext4 image) only needs `veritysetup`.

## Creating a Verifiable Program

There are two ways to describe the workload. `--compose` is the one you want most of the time: point the CLI at a Docker Compose file and it pulls the images, pins them by digest, packs them with the compose file into an ext4 image and takes it from there. `--workload` takes a prebuilt ext4 image whose layout is dictated by the runtime you pick; use it when you build images in your own pipeline.

In both cases the CLI then:

1. Fetches the runtime manifest and bundle from the `vm-images` aggregate.
2. Computes dm-verity hashes for the workload image and any extra `--volume` images.
3. Uploads the images and their hash trees as STORE messages.
4. Computes the SEV-SNP launch measurement(s) from the runtime bundle, the instantiated kernel command line and your `--vcpus`.
5. Publishes the V-PROGRAM message with the pinned measurements and policy. The network scheduler picks a node and starts the VM.

### Usage

```bash
aleph vprogram create [OPTIONS] <NAME>
```

#### Arguments

| Argument | Description                                                        |
| -------- | ------------------------------------------------------------------ |
| `NAME`   | Friendly name (stored in `metadata.name`, shown by `vprogram list`) |

#### Options

| Option                              | Description                                                                                                                                               |
| ----------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `--compose <COMPOSE_FILE>`          | Build the workload from a Docker Compose file (see [Compose subset](#the-compose-subset)). Exactly one of `--compose` / `--workload` is required        |
| `--workload <PATH>`                 | Prebuilt workload ext4 image. Exactly one of `--compose` / `--workload` is required                                                                       |
| `--image-archive <IMAGE=PATH>`      | Use a local image archive instead of pulling `IMAGE` (must match the compose file's `image:` exactly). Repeatable; requires `--compose`                  |
| `--runtime <RUNTIME>`               | Runtime bundle: a contract (`aleph.compose/1`, `aleph.exec/1`), a runtime name (`compose`, `exec`) or the item hash of a runtime manifest. Defaults to the current runtime for the workload model |
| `--volume <PATH>`                   | Extra read-only data volume image. Repeatable (max 8); each one is verity-bound into the attested TCB in flag order                                        |
| `--vcpus <N>`                       | Number of virtual CPUs [default: 1]. Part of the measurement                                                                                               |
| `--memory <MIB>`                    | Memory in MiB [default: 2048]                                                                                                                             |
| `--no-internet`                     | Disable guest internet access (enabled by default)                                                                                                        |
| `--policy <POLICY>`                 | SEV-SNP 64-bit guest policy, decimal or `0x`-hex [default: `0x30000`]                                                                                     |
| `--allow-debug`                     | Allow the DEBUG bit (19) in the policy. The host can then read guest memory: the deployment is NOT confidential. Required to publish such a policy         |
| `--crn-hash <HASH>`                 | Pin the V-PROGRAM to a specific compute node                                                                                                              |
| `--wait [SECS]`                     | After submitting, poll until the VM is reachable and print its attested endpoint (default timeout 300 s)                                                  |
| `--channel <CHANNEL>`               | Channel name                                                                                                                                              |
| `--on-behalf-of <ADDR>`             | Sign on behalf of another address (requires authorization)                                                                                                |
| `--account <ACCOUNT>`               | Named account (defaults to the active account)                                                                                                            |
| `--private-key <KEY>`               | Hex-encoded private key (or set `ALEPH_PRIVATE_KEY`)                                                                                                     |
| `--chain <CHAIN>`                   | Signing chain (required with `--private-key`)                                                                                                             |
| `--dry-run`                         | Build and sign the message but don't submit it                                                                                                            |
| `--help`                            | Show this message and exit                                                                                                                                |

### From a Compose file

Write a `docker-compose.yml` where one service listens on `127.0.0.1:8080`. That is the service the attested endpoint will proxy to. The example below uses `traefik/whoami`, a small HTTP service that echoes the request it receives, which makes it a handy first deployment.

```yaml
services:
  whoami:
    image: docker.io/traefik/whoami:v1.10.2
    network_mode: host
    command: ["--port", "8080"]
    environment:
      WHOAMI_NAME: vprogram-demo
    tmpfs:
      - /tmp
```

Then deploy it:

```bash
# Deploy and wait for the attested endpoint
aleph vprogram create whoami --compose ./docker-compose.yml --wait

# Same, with more resources
aleph vprogram create whoami \
  --compose ./docker-compose.yml \
  --vcpus 2 \
  --memory 4096 \
  --wait 600
```

The CLI prints its progress on stderr (pulling images, root hashes, uploads, measurements) and, with `--wait`, ends with:

```
V-Program ready.
  Attested endpoint: https://203.0.113.10:24443
```

Without `--wait` the command returns as soon as the message is published; use `aleph vprogram show` to see when the scheduler has placed it.

#### Pinning images

Images referenced by tag are pulled and rewritten to their `name@sha256:...` digest before the compose file is packed, so the measured compose file names exact image identities. If you build images locally (never pushed to a registry, so they have no digest) or want a fully offline build, save them to an archive and pass it in:

```bash
podman save --format oci-archive -o whoami.tar docker.io/traefik/whoami:v1.10.2

aleph vprogram create whoami \
  --compose ./docker-compose.yml \
  --image-archive docker.io/traefik/whoami:v1.10.2=./whoami.tar
```

The `IMAGE` part must match the compose file's `image:` value character for character.

#### The Compose subset

The runtime implements the `aleph.compose/1` contract, a deliberately small subset of Compose. Supported service keys: `image`, `command`, `entrypoint`, `environment`, `depends_on`, `tmpfs`, and `network_mode`, which must be `host` on every service. `restart` is accepted but ignored (a stack that exits powers the VM off).

Anything else is rejected at validation time, before any image is pulled or any message is signed:

| Key                              | Why it is rejected                                                                                 |
| -------------------------------- | -------------------------------------------------------------------------------------------------- |
| `ports`                          | The guest exposes exactly one attested endpoint (proxy to `127.0.0.1:8080`); no direct publishing |
| `volumes` (top-level or service) | No persistent volumes in v1; use `tmpfs:` for scratch space, or `--volume` for read-only data     |
| `build`                          | Nothing can be built in-guest; reference a prebuilt image                                          |
| `secrets`, `env_file`, `configs` | There is no unmeasured input channel; everything would be public and measured                      |
| `networks`                       | Stacks run with `network_mode: host`                                                               |
| `privileged`, `devices`, `cap_add` | Not available in the guest                                                                       |

### From a prebuilt image

If you already produce ext4 images in your own pipeline, publish them directly. The image's content convention is set by the runtime; the default `exec` runtime (`aleph.exec/1`) is used unless `--runtime` says otherwise.

```bash
aleph vprogram create my-service --workload ./workload.ext4

# Ship read-only data alongside the workload (each volume is measured too)
aleph vprogram create my-service \
  --workload ./workload.ext4 \
  --volume ./model-weights.ext4 \
  --volume ./dataset.ext4
```

### Choosing a runtime

Runtimes are catalogued in the `vm-images` aggregate by workload model (`compose` for `--compose`, `exec` for `--workload`), then by contract, then by runtime name. When `--runtime` is omitted the model's current contract and that contract's default runtime are used, which is what you want unless you are testing a specific build.

```bash
# Pin a specific runtime by name
aleph vprogram create whoami --compose ./docker-compose.yml --runtime compose

# Or by the item hash of its manifest
aleph vprogram create whoami --compose ./docker-compose.yml --runtime 7a3f...e91c
```

The runtime must match the workload model: a `--compose` deploy needs a runtime whose manifest declares `workload.contract: "aleph.compose/1"`.

## Listing Verifiable Programs

List the V-PROGRAMs sent by or owned by an address, merged with the scheduler's placement status and, for placed VMs, the attested endpoint discovered from the allocated node.

### Usage

```bash
aleph vprogram list [OPTIONS]
```

#### Options

| Option              | Description                                                                 |
| ------------------- | --------------------------------------------------------------------------- |
| `--address <ADDR>`  | Hex address or local account name (defaults to the active account)          |
| `--json`            | Output results as JSON                                                      |
| `--help`            | Show this message and exit                                                  |

```bash
# List your V-PROGRAMs
aleph vprogram list

# List V-PROGRAMs for a specific address as JSON
aleph vprogram list --address 0x1234... --json
```

The table shows `ITEM_HASH`, `NAME`, `OWNER`, `STATUS`, `ALLOCATED` (the node) and `ENDPOINT`. The item hash column is a short prefix; every other `vprogram` command accepts that prefix in place of the full hash.

## Showing Verifiable Program Details

Show a published V-PROGRAM: the pinned measurements and policy, runtime and workload references, storage footprint, and, when the scheduler has placed it, the VM's live networking and attested endpoint.

### Usage

```bash
aleph vprogram show [OPTIONS] <ITEM_HASH>
```

```bash
# Show details of a V-PROGRAM (full hash or unique prefix)
aleph vprogram show a41fb91c3e68

# Show as JSON
aleph vprogram show a41fb91c3e68 --json
```

The `STORAGE` section lists the workload and each verified volume with the size reported by the network. `MEASUREMENTS` lists one launch measurement per CPU model the runtime supports; `call` accepts any of them. `STATUS` tells you whether the CRN reports the VM as running and which attested endpoint to reach it on. When the VM has not been placed yet, or the node is unreachable, only the message-side sections are shown.

## Calling a Verifiable Program

`call` is the whole point. It resolves the guest's attested endpoint and the expected launch measurement from the message, then makes the request over a TLS session whose server certificate carries the guest's AMD-signed attestation report.

The response is printed only if every check passes; any failure aborts before the body is read:

- Certificate chain: AMD ARK -> ASK -> VCEK for the reporting chip, validity and revocation, and the report's signature.
- TLS key binding: the signed `report_data` commits to the certificate's public key, so a report cannot be replayed under another key.
- Launch measurement matches the message's pinned measurement(s).
- Guest policy matches the message's pinned policy (no silent downgrade to a debug-enabled launch).
- TCB floor: the launch TCB meets the network floor for the chip.
- Fresh nonce: a second report bound to a nonce generated for this call proves the guest is live now, not a replay of an old key.
- Platform posture, only if `--require-platform` is given.

### Usage

```bash
aleph vprogram call [OPTIONS] <ITEM_HASH> <PATH>
```

#### Arguments

| Argument    | Description                                                     |
| ----------- | --------------------------------------------------------------- |
| `ITEM_HASH` | V-PROGRAM item hash or unique prefix                            |
| `PATH`      | HTTP path to request on the guest, e.g. `/api`                  |

#### Options

| Option                             | Description                                                                                                                   |
| ---------------------------------- | ----------------------------------------------------------------------------------------------------------------------------- |
| `-X, --request <METHOD>`           | HTTP method [default: GET]                                                                                                    |
| `-d, --data <BODY>`                | Request body, sent as-is                                                                                                      |
| `-H, --header <"Key: Value">`      | Extra request header (repeatable)                                                                                             |
| `--url <URL>`                      | Call this URL directly instead of discovering the endpoint via the scheduler and CRN                                          |
| `--expected-measurement <HEX>`     | Override the measurement(s) pinned on the message                                                                             |
| `--amd-product <PRODUCT>`          | AMD product line for the certificate chain [default: Genoa]                                                                   |
| `--min-tcb <COMPONENTS>`           | Raise the minimum TCB, e.g. `snp=9,microcode=15` (components: `fmc`, `bootloader`, `tee`, `snp`, `microcode`)                 |
| `--accept-outdated-tcb`            | Acknowledge a `--min-tcb` that lowers a component below the network floor                                                     |
| `--allow-stale-attestation`        | Skip the fresh-nonce liveness challenge (a key stolen from a past instance would not be detected)                             |
| `--require-platform <BITS>`        | Require host posture bits: `smt-off`, `tsme`, `rapl-off`, `ciphertext-hiding`, `alias-check` (repeatable or comma-separated) |
| `-v, --verbose`                    | Also print the verified evidence on stderr (measurement, policy, launch TCB, platform posture)                                 |
| `--json`                           | Single JSON document on stdout with status, body and the full verified evidence                                                |
| `--help`                           | Show this message and exit                                                                                                    |

The response body goes to stdout verbatim, so you can pipe it like `curl`. stderr gets an `Attestation: verified (...)` line listing the checks that passed and the `HTTP <status>` line.

```bash
# Simple GET
aleph vprogram call a41fb91c3e68 /

# Show the evidence that was verified
aleph vprogram call a41fb91c3e68 / --verbose

# POST some JSON
aleph vprogram call a41fb91c3e68 /echo \
  -X POST \
  -d '{"a":1}' \
  -H 'Content-Type: application/json'

# Machine-readable: status, body and evidence in one document
aleph vprogram call a41fb91c3e68 /api --json | jq .body

# Refuse nodes that have SMT enabled or lack ciphertext hiding
aleph vprogram call a41fb91c3e68 / --require-platform smt-off,ciphertext-hiding
```

## Deleting a Verifiable Program

Send a FORGET for the V-PROGRAM message. This command does only the FORGET; the scheduler picks it up and tears the VM down on its own.

### Usage

```bash
aleph vprogram delete [OPTIONS] <ITEM_HASH>
```

#### Options

| Option               | Description                                                              |
| -------------------- | ------------------------------------------------------------------------ |
| `--reason <REASON>`  | Reason recorded on the FORGET message [default: "User deletion"]         |
| `-y, --yes`          | Skip the confirmation prompt                                             |
| `--account <NAME>`   | Named account (defaults to the active account)                           |
| `--private-key <K>`  | Hex-encoded private key                                                  |
| `--chain <CHAIN>`    | Signing chain (required with `--private-key`)                            |
| `--dry-run`          | Build and sign the message but don't submit it                           |
| `--help`             | Show this message and exit                                               |

```bash
# Delete a V-PROGRAM
aleph vprogram delete a41fb91c3e68

# With a reason, no prompt
aleph vprogram delete a41fb91c3e68 --reason "decommission" -y
```

## Updating a Verifiable Program

There is no `update` command, and that is by design: the measurement pins the exact workload, so a new version is a new V-PROGRAM. Create the new one, switch your clients to its hash once `call` succeeds against it, then delete the old one.

## Troubleshooting

Common issues and solutions:

- **`no container tool found` / `veritysetup` not found**: install the tools listed under [Prerequisites](#prerequisites); the CLI looks for them on `PATH`.
- **Compose file rejected**: the error names the offending key and why. Most often it is a `ports:` mapping (remove it; the endpoint is the attested proxy to `127.0.0.1:8080`) or a service missing `network_mode: host`.
- **`--image-archive` rejected**: the `IMAGE` part must be byte-identical to the `image:` value in the compose file, tag included.
- **`V-Program not reachable yet` after `--wait`**: the message was published; the scheduler simply hasn't placed it in time. Check `aleph vprogram show <hash>` a little later.
- **`call` fails on measurement mismatch**: the node booted something other than what was published. Do not pass `--expected-measurement` to make it go away; that is the check doing its job. Compare against `aleph vprogram show` and, if the node is misbehaving, pin another one with `--crn-hash` on a fresh create.
- **`call` fails on the TCB floor**: the node's firmware is below the network floor. Prefer another node; `--min-tcb` with `--accept-outdated-tcb` exists for controlled testing only.
- **The service exits and the VM powers off**: `restart:` is ignored in v1. Make sure the process serving `127.0.0.1:8080` stays in the foreground.
