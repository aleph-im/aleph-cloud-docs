# Pasta Drop — Decentralized Pastebin

A permanent pastebin where text is stored on Aleph Cloud using **STORE messages**. Paste text, sign with your wallet, get an immutable link. No backend, no database, no expiration.

This tutorial walks through the Aleph-specific patterns — STORE messages, content addressing, token-based storage, and dual-chain signing — using the Pasta Drop project as a reference implementation.

**Live example:** [pastadrop.stasho.xyz](https://pastadrop.stasho.xyz)

**Source code:** [github.com/cpascariello/pasta-drop](https://github.com/cpascariello/pasta-drop)

## Why STORE Messages?

Aleph Cloud supports several [message types](/devhub/building-applications/messaging/). STORE is the right choice when you need to persist raw files:

- **Permanent** — files live on the decentralized network with no expiration
- **Content-addressed** — each file is identified by its SHA-256 hash (the hash _is_ the address)
- **Free reads** — anyone can fetch files from a gateway without authentication
- **Token-based writes** — holding ALEPH tokens grants storage quota (~3 MB per token held, tokens are _not_ spent)

### When to Use STORE vs Other Message Types

| Message Type  | Best For                                                                                                    |
| ------------- | ----------------------------------------------------------------------------------------------------------- |
| **STORE**     | Raw files — text, images, binaries. Content-addressed by SHA-256 hash                                       |
| **AGGREGATE** | Key-value data tied to a wallet — user settings, profiles. See [Aggregates Cookbook](./aggregates-cookbook) |
| **POST**      | Structured data you need to query — feed items, records with metadata                                       |

## What We'll Build

A pastebin that:

1. Accepts text input from the user
2. Stores it on Aleph as a STORE message signed by their wallet
3. Returns a permanent link based on the content hash
4. Lets anyone view the paste — no wallet needed

## Prerequisites

### SDK Packages

```bash
npm install @aleph-sdk/client @aleph-sdk/ethereum @aleph-sdk/evm
```

| Package               | Purpose                                          |
| --------------------- | ------------------------------------------------ |
| `@aleph-sdk/client`   | HTTP client for reading/writing to Aleph network |
| `@aleph-sdk/ethereum` | Ethereum account wrapper for signing messages    |
| `@aleph-sdk/evm`      | Wallet adapter to bridge browser wallets to SDK  |

For Solana support, also install:

```bash
npm install @aleph-sdk/solana @solana/web3.js
```

### ethers v5 Requirement

::: warning
The Aleph SDK requires ethers v5, not v6. If you're using wagmi/viem, install ethers v5 under an alias:
:::

```bash
npm install ethers5@npm:ethers@^5.7.2
```

Then import from `ethers5`:

```ts
import { providers } from 'ethers5'
```

### Assumed Knowledge

- React with hooks
- Wallet connection (wagmi, Reown AppKit, or similar)
- Basic TypeScript

## Configuration

Create a config file with your app's Aleph identifiers:

```ts
// config/aleph.ts

/** Channel namespace — groups your app's messages on the network */
export const ALEPH_CHANNEL = 'MY_APP_NAME'

/** Ethereum Mainnet chain ID (hex). Required for valid Aleph signatures. */
export const ETH_MAINNET_CHAIN_ID = '0x1'

/** Aleph gateway for reading stored files */
export const ALEPH_GATEWAY = 'https://api2.aleph.im/api/v0'

/** Aleph API server for write operations */
export const ALEPH_API_SERVER = 'https://api2.aleph.im'

/** ALEPH ERC-20 token contract on Ethereum mainnet */
export const ALEPH_TOKEN_ADDRESS = '0x27702a26126e0b3702af63ee09ac4d1a084ef628'
```

### Key Concepts

- **Channel** — a namespace that groups your app's messages. Any string, no registration needed.
- **Gateway** — public HTTP endpoint for reading Aleph data. Multiple gateways exist (api1, api2, api3); reads work on all of them.
- **API Server** — endpoint for write operations. We use `api2.aleph.im` for store uploads.
- **ALEPH Token** — holding tokens grants storage quota. Tokens are not spent — just held in your wallet.

## Reading Files

Reading from Aleph is lightweight — it's just an HTTP GET to a gateway URL. No SDK, no wallet, no authentication:

```ts
// services/aleph-read.ts

import { ALEPH_GATEWAY } from '../config/aleph'

/**
 * Fetch a file by its content hash.
 * This is a READ operation — no wallet needed.
 */
export async function fetchPaste(hash: string): Promise<string> {
  const url = `${ALEPH_GATEWAY}/storage/raw/${hash}`
  const response = await fetch(url)

  if (!response.ok) {
    throw new Error('Failed to fetch paste')
  }

  return response.text()
}
```

The URL pattern is always `{gateway}/storage/raw/{sha256-hash}`. That hash is all you need to retrieve any file on the network.

::: tip Lightweight reads
Since reading is just a `fetch()` call, the read module has **zero heavy dependencies**. This matters for bundle size — your viewers don't need to load the Aleph SDK or ethers.
:::

## Writing Files (Ethereum)

Writing a STORE message involves constructing a signed message and uploading the file. A STORE message has two layers:

1. **Outer envelope** — chain, sender, signature, channel, and an `item_hash`
2. **Inner `item_content`** — JSON metadata pointing to the file's SHA-256 hash

Here's the full write flow:

```ts
// services/aleph-write.ts

import { ETHAccount } from '@aleph-sdk/ethereum'
import { JsonRPCWallet } from '@aleph-sdk/evm'
import { providers } from 'ethers5'
import { ALEPH_API_SERVER, ALEPH_CHANNEL, ETH_MAINNET_CHAIN_ID } from '../config/aleph'

/** SHA-256 hash using the Web Crypto API */
async function sha256Hex(data: Uint8Array): Promise<string> {
  const hashBuffer = await crypto.subtle.digest('SHA-256', data)
  return Array.from(new Uint8Array(hashBuffer))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('')
}

interface WalletProvider {
  request: (args: { method: string; params?: unknown[] }) => Promise<unknown>
}

interface PasteResult {
  fileHash: string // SHA-256 of file bytes — used in gateway URL
  itemHash: string // SHA-256 of item_content JSON — the message ID
  sender: string
  chain: 'ETH' | 'SOL'
}

export async function createPaste(provider: WalletProvider, text: string): Promise<PasteResult> {
  // 1. Verify Ethereum mainnet
  const chainId = (await provider.request({ method: 'eth_chainId' })) as string
  if (chainId !== ETH_MAINNET_CHAIN_ID) {
    throw new Error('Please switch to Ethereum mainnet')
  }

  // 2. Wrap browser wallet → ethers5 → Aleph SDK
  const web3Provider = new providers.Web3Provider(provider as providers.ExternalProvider)
  const wallet = new JsonRPCWallet(web3Provider)
  await wallet.connect()

  // 3. Create Aleph signing account
  const account = new ETHAccount(wallet, wallet.address!)

  // 4. Encode text and compute file hash (content address)
  const fileBytes = new TextEncoder().encode(text)
  const fileHash = await sha256Hex(fileBytes)

  // 5. Build item_content — STORE metadata
  const time = Date.now() / 1000
  const itemContent = {
    address: wallet.address,
    item_type: 'storage',
    item_hash: fileHash,
    time
  }
  const itemContentStr = JSON.stringify(itemContent)

  // 6. Compute the message's item_hash
  const itemHash = await sha256Hex(new TextEncoder().encode(itemContentStr))

  // 7. Sign the verification buffer (triggers wallet popup)
  const { Buffer } = await import('buffer')
  const signable = {
    time,
    sender: wallet.address,
    getVerificationBuffer: () => Buffer.from(['ETH', wallet.address, 'STORE', itemHash].join('\n'))
  }
  const signature = await account.sign(signable)

  // 8. Assemble the full Aleph message
  const message = {
    chain: 'ETH',
    sender: wallet.address,
    channel: ALEPH_CHANNEL,
    time,
    item_type: 'inline',
    item_content: itemContentStr,
    item_hash: itemHash,
    type: 'STORE',
    signature
  }

  // 9. POST as FormData to the Aleph API
  const formData = new FormData()
  formData.append('metadata', JSON.stringify({ message, sync: true }))
  formData.append('file', new Blob([fileBytes], { type: 'application/octet-stream' }))

  const response = await fetch(`${ALEPH_API_SERVER}/api/v0/storage/add_file`, { method: 'POST', body: formData })

  const result = await response.json()
  if (!response.ok && result?.status !== 'success') {
    throw new Error(`Aleph API error: ${JSON.stringify(result)}`)
  }

  return {
    fileHash: result.hash ?? fileHash,
    itemHash,
    sender: wallet.address!,
    chain: 'ETH'
  }
}
```

### The Hash Chain

Understanding how the two hashes relate:

```
file bytes  ──SHA-256──▶  fileHash (item_content.item_hash)
                           ↕  gateway serves file at /storage/raw/{fileHash}

item_content JSON  ──SHA-256──▶  itemHash (message.item_hash)
                                  ↕  identifies the message on Aleph Explorer
```

- **`fileHash`** — the content address. Use this in gateway URLs to retrieve the file.
- **`itemHash`** — the message ID. Use this to look up the message on Aleph Explorer.

### The Verification Buffer

Aleph nodes verify message authenticity by reconstructing a buffer from the message fields and checking the signature:

```
[chain, sender, type, item_hash].join('\n')
→ "ETH\n0xYourAddress\nSTORE\n<itemHash>"
```

The SDK's `account.sign()` method handles the signing — you just provide a `getVerificationBuffer()` function that returns this buffer.

### The API Request

The `/api/v0/storage/add_file` endpoint accepts `FormData` with two parts:

| Part       | Content                                                  |
| ---------- | -------------------------------------------------------- |
| `metadata` | JSON with `{ message, sync }` — the signed Aleph message |
| `file`     | Raw file bytes                                           |

Setting `sync: true` makes the API wait until the message is processed before responding.

## Writing Files (Solana)

The Solana path uses the same message structure and API endpoint — only the chain identifier and signing mechanism differ:

```ts
// services/aleph-write-sol.ts

import { getAccountFromProvider } from '@aleph-sdk/solana'
import { PublicKey } from '@solana/web3.js'
import { ALEPH_API_SERVER, ALEPH_CHANNEL } from '../config/aleph'

export async function createPasteSolana(provider: SolanaProvider, address: string, text: string): Promise<PasteResult> {
  // Bridge wallet provider to the interface Aleph SDK expects
  const messageSigner = {
    publicKey: new PublicKey(address),
    signMessage: (msg: Uint8Array) => provider.signMessage(msg),
    connected: true,
    connect: async () => {}
  }

  const account = await getAccountFromProvider(messageSigner)

  // Same flow as Ethereum from here —
  // hash file, build item_content, sign, POST
  const fileBytes = new TextEncoder().encode(text)
  const fileHash = await sha256Hex(fileBytes)

  const time = Date.now() / 1000
  const itemContent = {
    address,
    item_type: 'storage',
    item_hash: fileHash,
    time
  }
  const itemContentStr = JSON.stringify(itemContent)
  const itemHash = await sha256Hex(new TextEncoder().encode(itemContentStr))

  // Only difference: chain is 'SOL' in the verification buffer
  const { Buffer } = await import('buffer')
  const signable = {
    time,
    sender: address,
    getVerificationBuffer: () => Buffer.from(['SOL', address, 'STORE', itemHash].join('\n'))
  }
  const signature = await account.sign(signable)

  const message = {
    chain: 'SOL', // ← different from ETH path
    sender: address,
    channel: ALEPH_CHANNEL,
    time,
    item_type: 'inline',
    item_content: itemContentStr,
    item_hash: itemHash,
    type: 'STORE',
    signature
  }

  // POST is identical to the ETH path
  const formData = new FormData()
  formData.append('metadata', JSON.stringify({ message, sync: true }))
  formData.append('file', new Blob([fileBytes], { type: 'application/octet-stream' }))

  const response = await fetch(`${ALEPH_API_SERVER}/api/v0/storage/add_file`, { method: 'POST', body: formData })

  const result = await response.json()
  if (!response.ok && result?.status !== 'success') {
    throw new Error(`Aleph API error: ${JSON.stringify(result)}`)
  }

  return {
    fileHash: result.hash ?? fileHash,
    itemHash,
    sender: address,
    chain: 'SOL'
  }
}
```

The key differences from the Ethereum path:

- Uses `getAccountFromProvider()` from `@aleph-sdk/solana` instead of `ETHAccount`
- Verification buffer starts with `'SOL'` instead of `'ETH'`
- Message `chain` field is `'SOL'`
- No ethers dependency — Solana wallets sign directly

## Token Balance Check

Before attempting a store upload, check that the user holds ALEPH tokens. Without tokens, the API returns a cryptic error — a pre-flight check gives a much better UX:

```ts
async function checkAlephBalance(provider: WalletProvider, address: string): Promise<boolean> {
  // 0x70a08231 is the ERC-20 balanceOf(address) function selector
  const balanceData = (await provider.request({
    method: 'eth_call',
    params: [
      {
        to: ALEPH_TOKEN_ADDRESS,
        data: '0x70a08231000000000000000000000000' + address.slice(2).toLowerCase()
      },
      'latest'
    ]
  })) as string

  return BigInt(balanceData) > 0n
}
```

Call this before `createPaste()` and show a clear message if the balance is zero.

::: tip
ALEPH tokens are **held, not spent**. Each token grants approximately 3 MB of storage quota. Users keep their tokens after storing data.
:::

## Code Splitting

For a good user experience, split your read and write paths into separate modules:

```
aleph-read.ts   → fetch() only         → 0 KB additional bundle
aleph-write.ts  → Aleph SDK + ethers5  → loaded on demand
```

The read module uses only `fetch()`, so viewers loading a paste don't download the heavy SDK dependencies. Dynamically import the write module only when the user creates a paste:

```ts
// Only load the write module when needed
const { createPaste } = await import('../services/aleph-write')
const result = await createPaste(provider, text)
```

This kept Pasta Drop's initial bundle at ~224 KB while the full write dependencies are ~3.6 MB.

## Hosting on Aleph Cloud

Once your app is built, you can deploy it to Aleph Cloud's [decentralized web hosting](/devhub/deploying-and-hosting/web-hosting/). Your static site is stored on the network and served through IPFS — permanent, censorship-resistant hosting with no traditional server.

To deploy, build your app and upload the output directory:

```bash
# Build your static site
npm run build

# Install the Aleph CLI
pipx install aleph-client

# Upload the build directory
aleph file upload dist/ --channel MY_APP_NAME
```

See the [Web Hosting guide](/devhub/deploying-and-hosting/web-hosting/) for full deployment instructions, including setting up a custom domain.

## View on Aleph Explorer

After storing a file, you can inspect the STORE message on the Aleph Explorer:

```
https://explorer.aleph.cloud/messages?showAdvancedFilters=1&channels=MY_APP_NAME&type=STORE&sender=YOUR_ADDRESS
```

The explorer shows the message envelope, item_content, sender, timestamp, and chain.

## Reference Implementation

| File                              | What it demonstrates                  |
| --------------------------------- | ------------------------------------- |
| `src/config/aleph.ts`             | Configuration constants               |
| `src/services/aleph-read.ts`      | Lightweight read path (zero deps)     |
| `src/services/aleph-write.ts`     | Ethereum STORE message construction   |
| `src/services/aleph-write-sol.ts` | Solana STORE message construction     |
| `src/components/Editor.tsx`       | Wallet connection + paste creation UI |
| `src/components/Viewer.tsx`       | Hash-based paste viewing              |

- **Live demo:** [pastadrop.stasho.xyz](https://pastadrop.stasho.xyz)
- **Source code:** [github.com/cpascariello/pasta-drop](https://github.com/cpascariello/pasta-drop)

## Resources

- [STORE Message Reference](/devhub/building-applications/messaging/object-types/store)
- [Data Storage Overview](/devhub/building-applications/data-storage/overview)
- [Web Hosting Guide](/devhub/deploying-and-hosting/web-hosting/)
- [TypeScript SDK](/devhub/sdks-and-tools/typescript-sdk/)
- [Aleph CLI](/devhub/sdks-and-tools/aleph-cli/)
