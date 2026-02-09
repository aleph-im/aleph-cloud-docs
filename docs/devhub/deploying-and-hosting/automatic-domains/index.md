# Automatic Domains (2n6.me)

Every Aleph Cloud instance automatically receives a free, deterministic URL under `*.2n6.me`. These URLs are derived from the instance hash — no DNS setup or configuration is required.

Each URL is composed of four memorable [BIP-39](https://github.com/bitcoin/bips/blob/master/bip-0039.mediawiki) words, for example:

```
abandon-ability-able-about.2n6.me
```

The URL is deterministic: the same instance hash always produces the same subdomain. You can compute it before the VM is even running.

## Finding Your VM's URL

### From the API

The 2n6.me gateway exposes a public API at `api.2n6.me`. You can look up your instance's automatic domain by its hash:

```bash
curl https://api.2n6.me/api/hash/YOUR_INSTANCE_HASH
```

```json
{
  "instance_hash": "abc123...",
  "subdomain": "abandon-ability-able-about",
  "url": "abandon-ability-able-about.2n6.me",
  "ipv6": "2001:db8::1",
  "active": true
}
```

You can also look up an instance by its subdomain:

```bash
curl https://api.2n6.me/api/lookup/abandon-ability-able-about
```

```json
{
  "subdomain": "abandon-ability-able-about",
  "url": "abandon-ability-able-about.2n6.me",
  "instance_hash": "abc123...",
  "ipv6": "2001:db8::1",
  "active": true
}
```

To check overall gateway status:

```bash
curl https://api.2n6.me/api/status
```

```json
{
  "instance_count": 1234,
  "route_count": 567,
  "last_sync_time": 1700000000.0,
  "domain": "2n6.me"
}
```

### Computing It Locally

The subdomain is derived deterministically from the instance hash. Here's a minimal Python snippet:

```python
# Download the BIP-39 English wordlist (2048 words)
# https://github.com/bitcoin/bips/blob/master/bip-0039/english.txt

def hash_to_subdomain(instance_hash: str, wordlist: list[str]) -> str:
    h = int(instance_hash, 16)
    bits = h >> (256 - 44)       # top 44 bits of the 256-bit hash
    w4 = bits & 0x7FF; bits >>= 11
    w3 = bits & 0x7FF; bits >>= 11
    w2 = bits & 0x7FF; bits >>= 11
    w1 = bits & 0x7FF
    return f"{wordlist[w1]}-{wordlist[w2]}-{wordlist[w3]}-{wordlist[w4]}"
```

Since it's deterministic, you can compute the URL before deploying, or use it in scripts and automation without querying the API.

## Accessing Your VM

### HTTPS (SNI Passthrough)

The 2n6.me gateway performs **Layer 4 SNI passthrough** — it routes TLS connections to your VM based on the Server Name Indication (SNI) in the TLS handshake, without terminating TLS itself.

::: warning
Your VM must serve its own TLS certificate. The gateway does not terminate TLS for you.
:::

The easiest way to handle this is to run a reverse proxy inside your VM that provides automatic TLS. [Caddy](https://caddyserver.com/) is recommended — it obtains and renews Let's Encrypt certificates automatically with zero configuration:

```bash
# Inside your VM
sudo caddy reverse-proxy --from your-subdomain.2n6.me --to localhost:8080
```

### HTTP

Plain HTTP also works. The gateway routes HTTP requests based on the `Host` header. No TLS setup is needed on the VM side for HTTP traffic.

### Sync Delay

::: warning
New instances may take up to 5 minutes to become reachable via their 2n6.me URL. The gateway syncs with the Aleph network periodically.
:::

## Comparison with Custom Domains

| Feature | Automatic Domain (2n6.me) | [Custom Domain](/devhub/deploying-and-hosting/custom-domains/instance) |
|---|---|---|
| DNS setup required | No | Yes (CNAME + TXT records) |
| URL format | `word-word-word-word.2n6.me` | `yourdomain.com` |
| Custom branding | No | Yes |
| TLS handling | SNI passthrough — VM serves its own cert | SNI passthrough — VM serves its own cert |
| IPv4 | Yes (proxied via gateway) | Yes (proxied via CRN) |
| IPv6 | Proxied via gateway | Direct to VM (no proxy) |
| SSH access | No | Yes (via port 2222) |

For branded domains or direct IPv6 access, see [Instance Custom Domains](/devhub/deploying-and-hosting/custom-domains/instance).

## Technical Reference

### Subdomain Derivation Algorithm

The subdomain is derived from the instance hash as follows:

1. Parse the hex instance hash as a 256-bit integer.
2. Extract the top 44 bits (right-shift by 212).
3. Split into 4 chunks of 11 bits each, most significant first.
4. Each 11-bit value (0–2047) indexes into the [BIP-39 English wordlist](https://github.com/bitcoin/bips/blob/master/bip-0039/english.txt) (2048 words).
5. Join the four words with hyphens.

**Properties:**

- **Deterministic** — the same hash always produces the same subdomain.
- **Address space** — 2^44 ≈ 17.6 trillion possible subdomains.
- **Collision handling** — if two hashes map to the same 44-bit prefix (extremely unlikely), the earlier instance (by timestamp) wins.

### API Reference

All endpoints are read-only and CORS-enabled for `GET` requests from any origin.

| Method | Path | Description |
|---|---|---|
| `GET` | `/api/hash/{instance_hash}` | Convert instance hash to subdomain, check if active |
| `GET` | `/api/lookup/{subdomain}` | Look up instance by 4-word subdomain |
| `GET` | `/api/status` | Gateway stats (instance count, route count, last sync time) |
| `POST` | `/api/sync` | Trigger manual sync (requires `Authorization: Bearer <key>`) |

Base URL: `https://api.2n6.me`
