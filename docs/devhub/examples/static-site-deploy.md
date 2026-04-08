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

<!-- core deploy content goes in Task 4 -->

### Verifying the core deploy

<!-- core deploy verification content goes in Task 5 -->

## (Optional) Custom domain

<!-- custom domain content goes in Task 6 -->

### Verifying the custom domain

<!-- custom domain verification content goes in Task 7 -->

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
