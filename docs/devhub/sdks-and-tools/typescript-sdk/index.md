# TypeScript SDK

The Aleph Cloud TypeScript SDK (`@aleph-sdk/client`) provides a comprehensive set of tools for interacting with the Aleph Cloud network from TypeScript applications. This guide covers installation, basic usage, and common patterns.

> **Note:** The previous JavaScript SDK (`aleph-js`) has been deprecated and replaced by this TypeScript SDK.

## Installation

::: code-group

```bash [npm]
npm install @aleph-sdk/client
```

```bash [yarn]
yarn add @aleph-sdk/client
```
:::

> **Note:** For browser usage, you need to use a bundler like webpack or rollup.
> The TypeScript SDK is primarily designed for Node.js environments

## Basic Setup

::: code-group

```typescript [ES Modules]
import { AlephHttpClient } from '@aleph-sdk/client';

const client = new AlephHttpClient();
```

```javascript [CommonJS]
// CommonJS imports are supported but TypeScript/ESM is recommended
const { AlephHttpClient } = require('@aleph-sdk/client');

const client = new AlephHttpClient();
```

```html [Browser]
<!-- Browser usage requires bundling the TypeScript SDK -->
<script type="module">
  import { AlephHttpClient } from './bundled-aleph-sdk.js';
  const client = new AlephHttpClient();
</script>
```
:::

## Authentication

The Aleph Cloud SDK uses blockchain accounts for authentication. You need to create an account object first, then use that to instantiate an authenticated client.

### Ethereum Authentication

::: code-group

```typescript [Private Key]
import { AlephHttpClient, AuthenticatedAlephHttpClient } from '@aleph-sdk/client';
import { importAccountFromPrivateKey } from '@aleph-sdk/ethereum';

// Create an Ethereum account from a private key
const privateKey = 'your_private_key';
const account = importAccountFromPrivateKey(privateKey);

// Create an authenticated client
const client = new AuthenticatedAlephHttpClient(account);
```

```typescript [Mnemonic]
import { AlephHttpClient, AuthenticatedAlephHttpClient } from '@aleph-sdk/client';
import { importAccountFromMnemonic } from '@aleph-sdk/ethereum';

// Create an Ethereum account from a mnemonic
const mnemonic = 'your twelve word mnemonic phrase goes here';
const account = importAccountFromMnemonic(mnemonic);

// Create an authenticated client
const client = new AuthenticatedAlephHttpClient(account);
```

```typescript [Web Provider]
import { AlephHttpClient, AuthenticatedAlephHttpClient } from '@aleph-sdk/client';
import { getAccountFromProvider } from '@aleph-sdk/ethereum';

// Connect with MetaMask or other Ethereum provider
async function connectWithProvider() {
  // Request access to the user's Ethereum accounts
  await window.ethereum.request({ method: 'eth_requestAccounts' });

  // Create an Ethereum account from the provider
  const account = await getAccountFromProvider(window.ethereum);
  console.log(`Connected with address: ${account.address}`);

  // Create an authenticated client
  const client = new AuthenticatedAlephHttpClient(account);
  return client;
}
```
:::

### Solana Authentication

::: code-group

```typescript [Private Key]
import { AlephHttpClient, AuthenticatedAlephHttpClient } from '@aleph-sdk/client';
import { importAccountFromPrivateKey } from '@aleph-sdk/solana';

// Create a Solana account from a private key
const privateKey = new Uint8Array([...]); // Your private key as bytes
const account = importAccountFromPrivateKey(privateKey);

// Create an authenticated client
const client = new AuthenticatedAlephHttpClient(account);
```

```typescript [Web Provider]
import { AlephHttpClient, AuthenticatedAlephHttpClient } from '@aleph-sdk/client';
import { getAccountFromProvider } from '@aleph-sdk/solana';

// Connect with Phantom or other Solana wallet
async function connectWithSolanaProvider() {
  const provider = window.solana; // Phantom wallet

  if (!provider.isConnected) {
    await provider.connect();
  }

  // Create a Solana account from the provider
  const account = await getAccountFromProvider(provider);
  console.log(`Connected with address: ${account.address}`);

  // Create an authenticated client
  const client = new AuthenticatedAlephHttpClient(account);
  return client;
}
```
:::

### Other Chains

::: code-group

```typescript [Avalanche]
import { AlephHttpClient, AuthenticatedAlephHttpClient } from '@aleph-sdk/client';
import { importAccountFromPrivateKey, ChainType } from '@aleph-sdk/avalanche';

// Create an Avalanche account from a private key
const privateKey = 'your_private_key';
const account = await importAccountFromPrivateKey(privateKey, ChainType.C_CHAIN);

// Create an authenticated client
const client = new AuthenticatedAlephHttpClient(account);
```

```typescript [Base]
import { AlephHttpClient, AuthenticatedAlephHttpClient } from '@aleph-sdk/client';
import { importAccountFromPrivateKey } from '@aleph-sdk/base';

// Create a Base account from a private key
const privateKey = 'your_private_key';
const account = importAccountFromPrivateKey(privateKey);

// Create an authenticated client
const client = new AuthenticatedAlephHttpClient(account);
```
:::

## Storage

### Working with Posts

Post messages are used to store arbitrary JSON data on the Aleph network.

#### Reading Posts

```typescript
import { AlephHttpClient } from '@aleph-sdk/client';

// Create an unauthenticated client
const client = new AlephHttpClient();

// Get a message by hash
const message = await client.getPost({
  hash: 'QmHash123'
});
console.log(message.content);

// Query messages by tags, types, etc.
const messages = await client.getPosts({
  tags: ['user', 'profile'],
  pagination: 10,
  page: 1
});

messages.posts.forEach(msg => {
  console.log(`${msg.item_hash}: ${JSON.stringify(msg.content)}`);
});
```

#### Creating Posts

```typescript
import { AuthenticatedAlephHttpClient } from '@aleph-sdk/client';
import { importAccountFromPrivateKey } from '@aleph-sdk/ethereum';

// Create an account
const account = importAccountFromPrivateKey('0x1234567890abcdef...');

// Create an authenticated client
const client = new AuthenticatedAlephHttpClient(account);

// Store a simple message
const result = await client.createPost({
  postType: 'example',
  content: 'Hello, Aleph Cloud!',
  channel: 'TEST',
  address: account.address,
  inline: true,
  sync: true
});

console.log(`Stored message with hash: ${result.item_hash}`);

// Store a JSON object
const jsonResult = await client.createPost({
  postType: 'user-profile',
  content: { name: 'John Doe', email: 'john@example.com' },
  channel: 'TEST',
  address: account.address,
  inline: true,
  tags: ['user', 'profile'],
  sync: true
});

console.log(`Stored JSON with hash: ${jsonResult.item_hash}`);
```

### Working with Files

Files can be stored with the STORE message type.

#### Uploading Files

```typescript
import { AuthenticatedAlephHttpClient } from '@aleph-sdk/client';
import { importAccountFromPrivateKey } from '@aleph-sdk/ethereum';
import fs from 'fs';

// Create an account
const account = importAccountFromPrivateKey('0x1234567890abcdef...');

// Create an authenticated client
const client = new AuthenticatedAlephHttpClient(account);

// Upload a file (Node.js)
const fileObject = fs.readFileSync('./example.pdf');
const fileResult = await client.createStore({
  fileObject,
  channel: 'TEST',
  sync: true
});

console.log(`File stored with hash: ${fileResult.item_hash}`);
```

#### Downloading Files

```typescript
import { AlephHttpClient } from '@aleph-sdk/client';

// Create an unauthenticated client
const client = new AlephHttpClient();

// Get a file
const fileContent = await client.downloadFile('QmFileHash123');

// In Node.js, you can write it to disk
const fs = require('fs');
fs.writeFileSync('./downloaded-file.pdf', Buffer.from(fileContent));
```

### Working with Aggregates

Aggregates are a key-value store on the Aleph network, bound by address.

#### Reading Aggregates

```typescript
import { AlephHttpClient } from '@aleph-sdk/client';

// Create an unauthenticated client
const client = new AlephHttpClient();

// Fetch a single aggregate
const userProfile = await client.fetchAggregate('0xYourAddress...', 'profile');
console.log(userProfile);

// Fetch multiple aggregates for the same address
const userAggregates = await client.fetchAggregates('0xYourAddress...', ['profile', 'settings']);
console.log(userAggregates.profile);
console.log(userAggregates.settings);
```

#### Creating Aggregates

```typescript
import { AuthenticatedAlephHttpClient } from '@aleph-sdk/client';
import { importAccountFromPrivateKey } from '@aleph-sdk/ethereum';

// Create an account
const account = importAccountFromPrivateKey('0x1234567890abcdef...');

// Create an authenticated client
const client = new AuthenticatedAlephHttpClient(account);

// Create an aggregate
const aggregateResult = await client.createAggregate({
  key: 'profile',
  content: { name: 'John Doe', email: 'john@example.com' },
  channel: 'TEST',
  address: account.address,
  sync: true
});

console.log(`Aggregate created with hash: ${aggregateResult.item_hash}`);
```

## Computing

### Serverless Functions (FaaS)

```typescript
import { AuthenticatedAlephHttpClient } from '@aleph-sdk/client';
import { importAccountFromPrivateKey } from '@aleph-sdk/ethereum';
import fs from 'fs';

// Create an account
const account = importAccountFromPrivateKey('0x1234567890abcdef...');

// Create an authenticated client
const client = new AuthenticatedAlephHttpClient(account);

// Deploy a program using a file
const programFile = fs.readFileSync('./program.zip');
const programResult = await client.createProgram({
  file: programFile,
  entrypoint: 'index:handler',
  channel: 'TEST',
  memory: 128,
  vcpus: 1,
  encoding: 'zip',
  isPersistent: false,
  metadata: {
    name: 'hello-world',
    description: 'A simple hello world function',
  },
  sync: true
});

console.log(`Program deployed with hash: ${programResult.item_hash}`);

// The program can be executed through the API
console.log(`Function URL: https://api2.aleph.im/vm/${programResult.item_hash}/`);
```

### Virtual Machines (VMs)

```typescript
import { AuthenticatedAlephHttpClient } from '@aleph-sdk/client';
import { importAccountFromPrivateKey } from '@aleph-sdk/ethereum';

// Create an account
const account = importAccountFromPrivateKey('0x1234567890abcdef...');

// Create an authenticated client
const client = new AuthenticatedAlephHttpClient(account);

// Deploy a VM instance
const instanceResult = await client.createInstance({
  channel: 'TEST',
  metadata: {
    name: 'web-server',
    description: 'A web server running on Aleph Cloud',
  },
  authorizedKeys: ['ssh-rsa AAAAB3NzaC1yc2E...'], // Your public SSH key
  resources: {
    vcpus: 2,
    memory: 4096, // MB
  },
  environment: {
    type: 'debian',
    version: '11'
  },
  volumes: [
    {
      name: 'root',
      size: 20, // GB
      mountPoint: '/',
      fs: 'ext4'
    }
  ],
  sync: true
});

console.log(`Instance deployed with hash: ${instanceResult.item_hash}`);
```

## Advanced Features

### WebSocket Subscriptions

You can subscribe to new messages on the Aleph network using the `watchMessages` method:

```typescript
import { AlephHttpClient } from '@aleph-sdk/client';

const client = new AlephHttpClient();

// Set up a WebSocket connection to watch for new messages
const socket = await client.watchMessages({
  messageType: 'POST',
  channel: 'TEST',
  tags: ['example']
});

// Listen for new messages
socket.on('message', (message) => {
  console.log('New message received:', message);
});

// Close the connection when done
socket.close();
```

### Forget Messages

The FORGET message type allows you to request the deletion of previous messages:

```typescript
import { AuthenticatedAlephHttpClient } from '@aleph-sdk/client';
import { importAccountFromPrivateKey } from '@aleph-sdk/ethereum';

// Create an account
const account = importAccountFromPrivateKey('0x1234567890abcdef...');

// Create an authenticated client
const client = new AuthenticatedAlephHttpClient(account);

// Request to forget a specific message
const forgetResult = await client.forget({
  hashes: ['QmMessageHashToForget123'],
  reason: 'Content no longer relevant',
  channel: 'TEST',
  sync: true
});

console.log(`Forget message created with hash: ${forgetResult.item_hash}`);
```

### Error Handling

Proper error handling is essential when working with the Aleph SDK:

```typescript
import { AlephHttpClient } from '@aleph-sdk/client';

const client = new AlephHttpClient();

// Get message errors
try {
  const message = await client.getMessage('QmNonexistentHash123');
} catch (error) {
  console.error(`Error retrieving message: ${error.message}`);
}

// Check if a message was rejected
try {
  const messageError = await client.getMessageError('QmPotentiallyRejectedHash123');
  if (messageError) {
    console.error(`Message rejected: ${messageError.error}`);
  } else {
    console.log('Message was not rejected');
  }
} catch (error) {
  console.error(`Error checking message status: ${error.message}`);
}
```

### Multi-Chain Support

The Aleph SDK supports multiple blockchains for authentication:

::: code-group

```typescript [Ethereum]
import { AuthenticatedAlephHttpClient } from '@aleph-sdk/client';
import { importAccountFromPrivateKey } from '@aleph-sdk/ethereum';

// Create an Ethereum account
const account = importAccountFromPrivateKey('0x1234567890abcdef...');

// Create an authenticated client
const client = new AuthenticatedAlephHttpClient(account);

// Use the client with Ethereum account
const result = await client.createPost({
  postType: 'example',
  content: 'Message from Ethereum',
  channel: 'TEST',
  address: account.address,
  sync: true
});
```

```typescript [Solana]
import { AuthenticatedAlephHttpClient } from '@aleph-sdk/client';
import { importAccountFromPrivateKey } from '@aleph-sdk/solana';

// Create a Solana account
const account = importAccountFromPrivateKey(new Uint8Array([...]));

// Create an authenticated client
const client = new AuthenticatedAlephHttpClient(account);

// Use the client with Solana account
const result = await client.createPost({
  postType: 'example',
  content: 'Message from Solana',
  channel: 'TEST',
  address: account.address,
  sync: true
});
```

```typescript [Avalanche]
import { AuthenticatedAlephHttpClient } from '@aleph-sdk/client';
import { importAccountFromPrivateKey, ChainType } from '@aleph-sdk/avalanche';

// Create an Avalanche account
const account = await importAccountFromPrivateKey('avalanche-private-key', ChainType.C_CHAIN);

// Create an authenticated client
const client = new AuthenticatedAlephHttpClient(account);

// Use the client with Avalanche account
const result = await client.createPost({
  postType: 'example',
  content: 'Message from Avalanche',
  channel: 'TEST',
  address: account.address,
  sync: true
});
```
:::

## Configuration

```typescript
import { AlephHttpClient } from '@aleph-sdk/client';

// Custom API server
const client = new AlephHttpClient('https://api2.aleph.im');

// Default client uses the main Aleph API server
const defaultClient = new AlephHttpClient();
```

## Framework Integration

### React Integration

```tsx
import React, { useState, useEffect } from 'react';
import { AlephHttpClient } from '@aleph-sdk/client';
import { importAccountFromPrivateKey } from '@aleph-sdk/ethereum';
import { AuthenticatedAlephHttpClient } from '@aleph-sdk/client';

// Unauthenticated component to fetch data
function AlephDataViewer({ hash }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const client = new AlephHttpClient();
        const message = await client.getPost({ hash });
        setData(message.content);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchData();
  }, [hash]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <h2>Data from Aleph Cloud</h2>
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </div>
  );
}

// Authenticated component to store data
function AlephDataPublisher() {
  const [hash, setHash] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const publishData = async () => {
    setLoading(true);
    setError(null);

    try {
      // For real apps, you'd use a secure wallet connection
      // This is just for demonstration
      const privateKey = '0x1234567890abcdef...';
      const account = importAccountFromPrivateKey(privateKey);
      const client = new AuthenticatedAlephHttpClient(account);

      const result = await client.createPost({
        postType: 'example',
        content: { message: 'Hello from React!', timestamp: Date.now() },
        channel: 'TEST',
        address: account.address,
        sync: true
      });

      setHash(result.item_hash);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <button onClick={publishData} disabled={loading}>
        {loading ? 'Publishing...' : 'Publish Data'}
      </button>

      {error && <div className="error">Error: {error}</div>}

      {hash && (
        <div>
          <p>Published message with hash: {hash}</p>
          <AlephDataViewer hash={hash} />
        </div>
      )}
    </div>
  );
}
```

## TypeScript Support

```typescript
import { AlephHttpClient, AuthenticatedAlephHttpClient } from '@aleph-sdk/client';
import { importAccountFromPrivateKey } from '@aleph-sdk/ethereum';
import { PostMessage } from '@aleph-sdk/message';

interface UserProfile {
  name: string;
  email: string;
  age?: number;
}

// Unauthenticated client for reading
const client = new AlephHttpClient();

// Authenticated client for writing
const account = importAccountFromPrivateKey('0x1234567890abcdef...');
const authClient = new AuthenticatedAlephHttpClient(account);

// Function to store a user profile
async function storeUserProfile(profile: UserProfile): Promise<string> {
  const result = await authClient.createPost<UserProfile>({
    postType: 'user-profile',
    content: profile,
    channel: 'TEST',
    address: account.address,
    sync: true
  });

  return result.item_hash;
}

// Function to retrieve a user profile
async function getUserProfile(hash: string): Promise<UserProfile> {
  const message = await client.getPost<UserProfile>({ hash });
  return message.content;
}

// Type-safe message handling
async function processMessage(message: PostMessage<UserProfile>): Promise<void> {
  const { name, email, age } = message.content;
  console.log(`Processing user ${name} with email ${email}`);

  if (age !== undefined && age < 18) {
    console.log('User is under 18');
  }
}
```

## Compatibility

### Browser Compatibility

The SDK is compatible with modern browsers (Chrome, Firefox, Safari, Edge) and can be used in:

- Single-page applications (React, Vue, Angular, etc.)
- Browser extensions
- Mobile web applications

For older browsers, you may need to use a bundler with appropriate polyfills.

### Node.js Compatibility

The SDK is compatible with Node.js 12.x and later.

When using in a Node.js environment, make sure to install all required dependencies:

```bash
npm install @aleph-sdk/client @aleph-sdk/ethereum @aleph-sdk/message
```

## Resources

- [GitHub Repository](https://github.com/aleph-im/aleph-sdk-ts)
- [NPM Package](https://www.npmjs.com/package/@aleph-sdk/client)
- [API Reference](/devhub/api/rest)
- [Authentication Guide](/devhub/building-applications/authentication/)
