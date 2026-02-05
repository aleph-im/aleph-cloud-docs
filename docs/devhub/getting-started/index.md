# Getting Started with Aleph Cloud

Welcome to the Aleph Cloud Developer Hub! This guide will help you get started with building on Aleph Cloud's decentralized cloud platform.

## What is Aleph Cloud?

Aleph Cloud is a decentralized cloud platform that provides storage, computing, and indexing services for Web3 applications. It offers a more decentralized alternative to traditional cloud providers, with features specifically designed for blockchain and Web3 use cases.

## Key Features

- **Decentralized Storage**: Store files, objects, and databases with redundancy and persistence
- **Decentralized Computing**: Run code in a decentralized environment (on-demand or persistent)
- **Blockchain Indexing**: Index and query blockchain data efficiently
- **Web3 Hosting**: Host websites and applications in a decentralized manner
- **Cross-Chain Support**: Work with multiple blockchains through a unified API

## Prerequisites

Before you begin, you'll need:

- Basic knowledge of programming (JavaScript, Python, or other supported languages)
- Familiarity with Web3 concepts (optional, but helpful)
- An Aleph Cloud account (can be created through wallet authentication)
- ALEPH tokens for paying for services (available on various exchanges)

## Quick Start

### 1. Choose Your SDK

Aleph Cloud provides SDKs for multiple programming languages:

- [TypeScript](/devhub/sdks-and-tools/typescript-sdk/) - Most feature-complete SDK
- [Python](/devhub/sdks-and-tools/python-sdk/) - Great for data science and backend applications

### 2. Install the SDK

::: code-group
```ts [TypeScript]
npm install @aleph-sdk/client
```

```python [Python]
pip install aleph-client
```
:::
### 3. Initialize the Client

::: code-group

```ts [TypeScript]
import { Account, ETHAccount, ItemType, StoreType } from '@aleph-sdk/core';
import { AlephHttpClient } from '@aleph-sdk/client';

// Create a client instance
const aleph = new AlephHttpClient();

// If you need to authenticate (example with Ethereum)
const account = new ETHAccount();
await account.connect(); // Connect with MetaMask or other provider
```

```python [Python]
from aleph_sdk_python.asynchronous import AsyncClient

# Create a client instance
client = AsyncClient()

# If you need to authenticate
account = client.get_account()
```
:::

### 4. Try a Simple Example

#### Store Data on Aleph Cloud
::: code-group
```ts [TypeScript]
// Store a simple message
const content = { message: 'Hello, Aleph Cloud!' };
const result = await aleph.store.storeContent(
  account,
  content,
  { tags: ['example', 'hello-world'], storageType: StoreType.storage, itemType: ItemType.inline }
);

console.log(`Stored message with hash: ${result.item_hash}`);

// Retrieve the message
const message = await aleph.store.getContent(result.item_hash);
console.log(message);
```

```python [Python]
# Store a simple message
result = await client.create_store(
    "Hello, Aleph Cloud!",
    tags=['example', 'hello-world']
)

print(f"Stored message with hash: {result['item_hash']}")

# Retrieve the message
message = await client.get_message(result['item_hash'])
print(message['content'])
```
:::
## Common Use Cases

### Decentralized Storage

Store files, objects, and structured data with persistence and redundancy:

- [Storage Guide](/devhub/building-applications/data-storage/getting-started)

### Decentralized Computing

Run code in a decentralized environment:

- [On-demand Execution](/devhub/compute-resources/functions/#on-demand-execution) - For serverless functions
- [Persistent Execution](/devhub/compute-resources/functions/#persistent-execution) - For always-on applications
- [Confidential Computing](/devhub/compute-resources/confidential-instances/01-confidential-instance-introduction) - For secure, private execution

### Blockchain Indexing

Index and query blockchain data efficiently:

- [Indexing Guide](/devhub/building-applications/blockchain-data/indexing/)

### Web3 Authentication

Authenticate users with their blockchain wallets:

- [Authentication Guide](/devhub/building-applications/authentication/)

## Sample Projects

To help you get started, we've prepared some sample projects:

- [Web3 Applications](/devhub/examples/)
- [DeFi Integration](/devhub/examples/)
- [NFT Projects](/devhub/examples/)

## Next Steps

1. Explore the [SDK documentation](/devhub/sdks-and-tools/typescript-sdk/) for your preferred language
2. Check out the [API Reference](/devhub/api/rest) for detailed endpoint information
3. Join the [Aleph Cloud Discord](https://discord.gg/alephcloud) to connect with the community
4. Browse [example projects](/devhub/examples/) for inspiration

## Getting Help

If you encounter any issues or have questions:

- Check the documentation for your specific use case
- Join the [Aleph Cloud Discord](https://discord.gg/alephcloud) for community support
- Visit the [Aleph Cloud GitHub](https://github.com/aleph-im) to report issues or contribute
- Contact the Aleph Cloud team through the [official website](https://aleph.cloud/contact)
