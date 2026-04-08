# Static Site Deploy Cookbook

Deploy a directory of static files to Aleph Cloud IPFS with one Python script. The cookbook is structured as three nested paths: a minimum-viable Core Deploy that produces an IPFS gateway URL, an optional Custom Domain extension that routes a domain to the deployed CID, and an optional Delegated Signing extension that separates the owner of the deployment from the signer of the messages. Each section is self-contained — readers (and agents) can stop after any section.

## Prerequisites

This cookbook assumes you have:

- **Python 3.11+** with pip available
- **An Ethereum wallet** with at least **1 ALEPH** staked on Ethereum mainnet (required for STORE messages to be retained beyond 24 hours)
- **A directory of static files** to deploy (any framework works — Next.js export, Vite build, Astro build, hand-written HTML — the script takes a directory as input)
- **For the optional Custom Domain section:** a domain name where you can edit DNS records (CNAME and TXT)
- **For the optional Delegated Signing section:** access to the owner's private key for one-time `security` aggregate setup

### Python packages

```bash
pip install aleph-sdk-python==1.7.0 requests==2.32.5
```

| Package            | Purpose                                                                   |
| ------------------ | ------------------------------------------------------------------------- |
| `aleph-sdk-python` | Authenticated client for STORE and AGGREGATE messages                     |
| `requests`         | HTTP client for the IPFS gateway upload (the SDK does not handle uploads) |

### API endpoints

The cookbook uses these Aleph endpoints:

| Endpoint                                                | Purpose                        |
| ------------------------------------------------------- | ------------------------------ |
| `https://api2.aleph.im`                                 | Authenticated SDK requests     |
| `https://ipfs-2.aleph.im/api/v0/add`                    | IPFS gateway upload            |
| `https://api2.aleph.im/api/v0/aggregates/<addr>.json`   | Read aggregates (verification) |
| `https://api2.aleph.im/api/v0/messages.json`            | Read messages (verification)   |
| `https://api2.aleph.im/api/v0/addresses/<addr>/balance` | Check ALEPH balance            |

### Verifying your wallet stake

Before the Core Deploy, confirm your signer has enough stake:

```bash
curl -s "https://api2.aleph.im/api/v0/addresses/<SIGNER_ADDRESS>/balance" | python3 -m json.tool
```

Expected output:

```json
{
  "address": "<SIGNER_ADDRESS>",
  "balance": 1.0,
  "details": null
}
```

If `balance` is below `1.0`, fund the address with ALEPH on Ethereum mainnet before continuing — STORE messages from under-staked addresses are accepted but the content is garbage-collected within 24 hours.

## Core deploy

The Core Deploy uploads a directory to the Aleph IPFS gateway, pins the resulting CID via a STORE message signed by your wallet, and prints a CIDv1 subdomain gateway URL. No DNS, no domain configuration, no delegated signing. The output is a permanent, shareable URL.

Save this script as `deploy.py`:

```python
# deploy.py
"""Deploy a directory to Aleph Cloud IPFS — Core flow.

Uploads files to IPFS via the Aleph gateway, pins the CID with a STORE
message, and prints a CIDv1 subdomain gateway URL.

Usage:
    python deploy.py --dir <path> --private-key <hex>
"""
from __future__ import annotations

import argparse
import asyncio
import base64
import json
import sys
from pathlib import Path

import requests
from aleph.sdk.chains.ethereum import ETHAccount
from aleph.sdk.client.authenticated_http import AuthenticatedAlephHttpClient
from aleph.sdk.types import StorageEnum

ALEPH_API = "https://api2.aleph.im"
IPFS_GATEWAY = "https://ipfs-2.aleph.im"
ALEPH_CHANNEL = "ALEPH-CLOUDSOLUTIONS"


def upload_to_ipfs(directory: Path) -> str:
    """Upload a directory to IPFS via the Aleph gateway; return root CID (v0)."""
    files = []
    for path in sorted(directory.rglob("*")):
        if not path.is_file():
            continue
        relative = path.relative_to(directory.parent)
        files.append(("file", (str(relative), open(path, "rb"))))

    if not files:
        print(f"No files found in {directory}", file=sys.stderr)
        sys.exit(1)

    print(f"Uploading {len(files)} files to IPFS...")
    resp = requests.post(
        f"{IPFS_GATEWAY}/api/v0/add",
        params={"recursive": "true", "wrap-with-directory": "true"},
        files=files,
        timeout=300,
    )
    resp.raise_for_status()

    # The gateway returns one JSON object per line; the directory entry is the
    # second-to-last line (the last line is an empty newline).
    lines = resp.text.strip().splitlines()
    directory_entry = json.loads(lines[-2])
    cid = directory_entry.get("Hash")
    if not cid:
        print("Failed to get CID from IPFS response", file=sys.stderr)
        print(resp.text, file=sys.stderr)
        sys.exit(1)
    return cid


def cidv0_to_cidv1(cidv0: str) -> str:
    """Convert a base58btc CIDv0 (Qm...) to a base32 CIDv1 (bafy...).

    Subdomain IPFS gateways require CIDv1 because DNS hostnames are
    case-insensitive and CIDv0's base58btc alphabet is mixed-case.
    """
    alphabet = b"123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz"
    num = 0
    for c in cidv0.encode():
        num = num * 58 + alphabet.index(c)

    # Count LEADING '1' characters only (each one represents a leading 0x00 byte)
    pad = 0
    for c in cidv0:
        if c == "1":
            pad += 1
        else:
            break

    multihash = b"\x00" * pad + num.to_bytes((num.bit_length() + 7) // 8, "big")
    if multihash[0] != 0x12 or multihash[1] != 0x20:
        raise ValueError(f"Unexpected multihash prefix: {multihash[:2].hex()}")

    cidv1_bytes = bytes([0x01, 0x70]) + multihash  # version 1 + dag-pb codec
    b32 = base64.b32encode(cidv1_bytes).decode().lower().rstrip("=")
    return "b" + b32


async def pin_on_aleph(account: ETHAccount, cid: str) -> tuple[str, str]:
    """Pin the CID via a STORE message; return (store_message_hash, cid)."""
    async with AuthenticatedAlephHttpClient(
        account=account, api_server=ALEPH_API
    ) as client:
        message, status = await client.create_store(
            file_hash=cid,
            storage_engine=StorageEnum.ipfs,
            channel=ALEPH_CHANNEL,
            sync=True,
        )
        return message.item_hash, message.content.item_hash


def main() -> None:
    parser = argparse.ArgumentParser(description="Deploy a directory to Aleph Cloud IPFS")
    parser.add_argument("--dir", required=True, help="Directory to upload")
    parser.add_argument("--private-key", required=True, help="Ethereum private key (hex)")
    args = parser.parse_args()

    directory = Path(args.dir)
    if not directory.is_dir():
        print(f"Not a directory: {directory}", file=sys.stderr)
        sys.exit(1)

    cidv0 = upload_to_ipfs(directory)
    print(f"  CIDv0:  {cidv0}")

    key = args.private_key.removeprefix("0x")
    account = ETHAccount(bytes.fromhex(key))
    print(f"  Signer: {account.get_address()}")

    store_hash, content_cid = asyncio.run(pin_on_aleph(account, cidv0))
    print(f"  STORE message: {store_hash}")

    cidv1 = cidv0_to_cidv1(content_cid)
    print()
    print(f"  Live at: https://{cidv1}.ipfs.aleph.sh")
```

Run it:

```bash
python deploy.py --dir ./public --private-key 0xYOUR_PRIVATE_KEY
```

Expected output:

```text
Uploading 12 files to IPFS...
  CIDv0:  Qmdn5SYB91N2CFnjDfUBtD4HyRtexANnqhshCp4v5gi7DU
  Signer: 0x0e20c15D2f377D542E679362136f0EF81e6aF18F
  STORE message: d3936b0d443d0356220291d466459785ac8cb12104558b196ec3121cd3546ca7

  Live at: https://bafybeihfmle4qgb7dv4vavr4iu7sj54tvvsfzs6pgiwysfkrvaw43qx5ym.ipfs.aleph.sh
```

The `Live at` URL is permanent (subject to your stake retention) and is the deliverable of the Core Deploy.

::: warning Subdomain gateway requires CIDv1
The IPFS subdomain gateway (`<cid>.ipfs.aleph.sh`) only accepts CIDv1 (base32 `bafy...`). The Aleph SDK returns CIDv0 (`Qm...`) on `message.content.item_hash`. Always convert before constructing the URL — the `cidv0_to_cidv1` function in the script handles this.
:::

::: warning Hand-rolled base58 decoders have a leading-zero footgun
The base58 → base32 conversion in `cidv0_to_cidv1` only counts `'1'` characters at the **start** of the CID as leading zero bytes. A buggy implementation that counts all `'1'` characters anywhere in the string (`pad = sum(1 for c in s if c == '1')`) will corrupt CIDs that contain `'1'` mid-string and produce a CIDv1 that the gateway rejects with `"trailing bytes in data buffer"`. If you need this in production, use `multiformats-cid` from PyPI instead of hand-rolling.
:::

### Verifying the core deploy

After the script prints a `Live at` URL, run these checks to confirm the deploy is healthy.

**Check 1 — STORE message is on chain and confirmed:**

```bash
curl -s "https://api2.aleph.im/api/v0/messages.json?hashes=<STORE_MESSAGE_HASH>" \
  | python3 -m json.tool
```

Expected response (truncated):

```json
{
  "messages": [
    {
      "type": "STORE",
      "channel": "ALEPH-CLOUDSOLUTIONS",
      "sender": "<SIGNER_ADDRESS>",
      "content": {
        "address": "<SIGNER_ADDRESS>",
        "item_type": "ipfs",
        "item_hash": "<CIDv0>"
      },
      "confirmed": true
    }
  ]
}
```

If `confirmed` is `false`, wait 30-60 seconds and retry — confirmation is asynchronous.

**Check 2 — gateway serves the content:**

```bash
curl -sI https://<CIDv1>.ipfs.aleph.sh
```

Expected:

```text
HTTP/2 200
content-type: text/html
etag: "<CIDv0>"
```

The `etag` should match the CIDv0 from your `STORE` message's `content.item_hash`.

**Check 3 — explorer view (optional, human verification):**

Visit `https://explorer.aleph.cloud/messages?showAdvancedFilters=1&type=STORE&sender=<SIGNER_ADDRESS>` in a browser. Your most recent STORE message should appear at the top.

## (Optional) Custom domain

The Custom Domain extension routes a domain you control (`<DOMAIN>`) to a STORE-pinned CID via the Aleph `domains` aggregate. The DNS resolver reads the `_control.<DOMAIN>` TXT record to identify the owner address, then queries that owner's `domains` aggregate for the entry matching `<DOMAIN>`.

This extension assumes you have completed the Core Deploy and have a `STORE_MESSAGE_HASH` to point at.

### Step 1: DNS records

Add these records at your DNS provider:

| Type  | Name                | Value                                                          |
| ----- | ------------------- | -------------------------------------------------------------- |
| CNAME | `<DOMAIN>`          | `ipfs.public.aleph.sh`                                         |
| TXT   | `_control.<DOMAIN>` | `"<OWNER_ADDRESS>"` (with quotes if your DNS UI requires them) |

`<OWNER_ADDRESS>` is the address whose `domains` aggregate will hold the entry. For the basic Custom Domain flow (no delegation), this is the same address that signs the STORE message — your signer address.

Verify propagation:

```bash
dig +short CNAME <DOMAIN> @1.1.1.1
dig +short TXT _control.<DOMAIN> @1.1.1.1
```

Expected:

```text
ipfs.public.aleph.sh.
"<OWNER_ADDRESS>"
```

DNS propagation can take up to 10 minutes for new records.

### Step 2: Update the deploy script

Extend `deploy.py` from the Core Deploy section with two additions: a `--domain` argument and a call to `create_aggregate` after the STORE message is pinned.

Add this import to the top of `deploy.py`:

```python
from datetime import datetime, timezone
```

Add this function alongside `pin_on_aleph`:

```python
async def update_domain_aggregate(
    account: ETHAccount,
    domain: str,
    store_message_hash: str,
) -> None:
    """Update the `domains` aggregate to point `domain` at the STORE message.

    The owner address is the signer's own address. The aggregate write merges
    shallowly at the top level — other entries in the `domains` aggregate are
    preserved.
    """
    async with AuthenticatedAlephHttpClient(
        account=account, api_server=ALEPH_API
    ) as client:
        await client.create_aggregate(
            key="domains",
            content={
                domain: {
                    "type": "ipfs",
                    "message_id": store_message_hash,
                    "programType": "ipfs",
                    "updated_at": datetime.now(timezone.utc).isoformat(),
                    "options": {"catch_all_path": "/404.html"},
                }
            },
            channel=ALEPH_CHANNEL,
            sync=True,
        )
```

Update `main()` to accept `--domain` and call the new function after `pin_on_aleph`:

```python
def main() -> None:
    parser = argparse.ArgumentParser(description="Deploy a directory to Aleph Cloud IPFS")
    parser.add_argument("--dir", required=True, help="Directory to upload")
    parser.add_argument("--private-key", required=True, help="Ethereum private key (hex)")
    parser.add_argument("--domain", help="Optional custom domain to point at the deploy")
    args = parser.parse_args()

    directory = Path(args.dir)
    if not directory.is_dir():
        print(f"Not a directory: {directory}", file=sys.stderr)
        sys.exit(1)

    cidv0 = upload_to_ipfs(directory)
    print(f"  CIDv0:  {cidv0}")

    key = args.private_key.removeprefix("0x")
    account = ETHAccount(bytes.fromhex(key))
    print(f"  Signer: {account.get_address()}")

    store_hash, content_cid = asyncio.run(pin_on_aleph(account, cidv0))
    print(f"  STORE message: {store_hash}")

    if args.domain:
        print(f"  Updating domain {args.domain}...")
        asyncio.run(update_domain_aggregate(account, args.domain, store_hash))
        print(f"  Live at: https://{args.domain}")
    else:
        cidv1 = cidv0_to_cidv1(content_cid)
        print(f"  Live at: https://{cidv1}.ipfs.aleph.sh")
```

Run with the new flag:

```bash
python deploy.py --dir ./public --private-key 0xYOUR_PRIVATE_KEY --domain mysite.example
```

Expected output:

```text
Uploading 12 files to IPFS...
  CIDv0:  Qmdn5SYB91N2CFnjDfUBtD4HyRtexANnqhshCp4v5gi7DU
  Signer: 0x0e20c15D2f377D542E679362136f0EF81e6aF18F
  STORE message: d3936b0d443d0356220291d466459785ac8cb12104558b196ec3121cd3546ca7
  Updating domain mysite.example...
  Live at: https://mysite.example
```

::: warning The ALEPH-CLOUDSOLUTIONS channel is required, not optional
The Aleph DNS resolver's live watcher only listens to the `ALEPH-CLOUDSOLUTIONS` channel. Domain aggregate writes published on other channels will be accepted by the network but the resolver will not pick them up until its next cold resync (which can take an hour or more). Always pass `channel="ALEPH-CLOUDSOLUTIONS"` for `domains` aggregate writes.
:::

::: warning Aggregate writes merge shallowly
The `create_aggregate(key="domains", content={"<DOMAIN>": {...}})` call only overwrites the entry for `<DOMAIN>` — other domain entries under the same address are preserved. This is the right behavior for adding or updating one domain at a time. Do not pass the full domains map unless you intend to clear unlisted entries (you don't).
:::

::: warning Do not use the `aleph domain` CLI for delegated domain updates
The `aleph-client` CLI's `domain` subcommand hardcodes `account.get_address()` as both signer and owner. It cannot perform delegated domain updates. For the basic (non-delegated) flow it works, but to keep the cookbook consistent, use the SDK directly via `create_aggregate(...)` as shown above.
:::

### Verifying the custom domain

After running the script with `--domain`, run these checks.

**Check 1 — DNS TXT record matches the owner:**

```bash
dig +short TXT _control.<DOMAIN> @1.1.1.1
```

Expected:

```text
"<OWNER_ADDRESS>"
```

If the TXT record returns a different value, the resolver will ignore your aggregate entry. Fix the DNS record before debugging anything else.

**Check 2 — domains aggregate has the entry:**

```bash
curl -s "https://api2.aleph.im/api/v0/aggregates/<OWNER_ADDRESS>.json?keys=domains" \
  | python3 -c "import json, sys; print(json.dumps(json.load(sys.stdin)['data']['domains']['<DOMAIN>'], indent=2))"
```

Expected:

```json
{
  "type": "ipfs",
  "options": {
    "catch_all_path": "/404.html"
  },
  "message_id": "<STORE_MESSAGE_HASH>",
  "updated_at": "2026-04-08T08:59:22.286059+00:00",
  "programType": "ipfs"
}
```

The `message_id` should match the `STORE_MESSAGE_HASH` from your deploy. The `updated_at` should be within the last few minutes.

**Check 3 — resolver serves the new content:**

```bash
curl -sI https://<DOMAIN> | grep -iE "^(HTTP|etag)"
```

Expected (after resolver propagation, 2-5 minutes):

```text
HTTP/2 200
etag: "<CIDv0>"
```

The `etag` should match the CIDv0 from `content.item_hash` of your STORE message. If the etag is stale (matches a previous deploy), the resolver cache hasn't refreshed yet — wait a few more minutes and retry.

## (Optional) Delegated signing

<!-- delegated signing content goes in Task 8 -->

### Verifying the delegation setup

<!-- delegated signing verification content goes in Task 9 -->

## Running from CI (GitHub Actions)

<!-- CI section content goes in Task 10 -->

## Troubleshooting

### Lookup table

<!-- troubleshooting table content goes in Task 11 -->

### Expanded notes

<!-- troubleshooting expanded notes content goes in Task 12 -->

## Reference

<!-- reference section content goes in Task 13 -->
