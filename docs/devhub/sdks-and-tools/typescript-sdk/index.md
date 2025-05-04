# TypeScript SDK

The Aleph Cloud TypeScript SDK (`@aleph-sdk/client`) provides a comprehensive set of tools for interacting with the Aleph Cloud network from TypeScript applications. This guide covers installation, basic usage, and common patterns.

> **Note:** The previous JavaScript SDK (`aleph-js`) has been deprecated and replaced by this TypeScript SDK.

## Installation

### Node.js

```bash
npm install @aleph-sdk/client
# or
yarn add @aleph-sdk/client
```

### Browser via CDN

```html
<!-- Note: For browser usage, you may need to use a bundler like webpack or rollup -->
<!-- The TypeScript SDK is primarily designed for Node.js environments -->
```

## Basic Setup

### ES Modules (Recommended)

```typescript
import { AlephHttpClient } from '@aleph-sdk/client';

const aleph = new AlephHttpClient();
```

### CommonJS

```typescript
// CommonJS imports are supported but TypeScript/ESM is recommended
const { AlephHttpClient } = require('@aleph-sdk/client');

const aleph = new AlephHttpClient();
```

### Browser

```html
<!-- Browser usage requires bundling the TypeScript SDK -->
<script type="module">
  import { AlephHttpClient } from './bundled-aleph-sdk.js';
  const aleph = new AlephHttpClient();
</script>
```

## Authentication

The Aleph Cloud SDK uses blockchain accounts for authentication. You need to create an account object first, then use that to instantiate an authenticated client.

### Ethereum Authentication

#### Using a Private Key

```typescript
import { AlephHttpClient, AuthenticatedAlephHttpClient } from '@aleph-sdk/client';
import { importAccountFromPrivateKey } from '@aleph-sdk/ethereum';

// Create an Ethereum account from a private key
const privateKey = '0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef';
const account = importAccountFromPrivateKey(privateKey);

// Create an authenticated client
const sdkClient = new AuthenticatedAlephHttpClient(account);
```

#### Using a Mnemonic

```typescript
import { AlephHttpClient, AuthenticatedAlephHttpClient } from '@aleph-sdk/client';
import { importAccountFromMnemonic } from '@aleph-sdk/ethereum';

// Create an Ethereum account from a mnemonic
const mnemonic = 'your twelve word mnemonic phrase goes here';
const account = importAccountFromMnemonic(mnemonic);

// Create an authenticated client
const sdkClient = new AuthenticatedAlephHttpClient(account);
```

#### Using a Web Provider (MetaMask)

```typescript
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
  const sdkClient = new AuthenticatedAlephHttpClient(account);
  return sdkClient;
}
```

### Solana Authentication

#### Using a Private Key

```typescript
import { AlephHttpClient, AuthenticatedAlephHttpClient } from '@aleph-sdk/client';
import { importAccountFromPrivateKey } from '@aleph-sdk/solana';

// Create a Solana account from a private key
const privateKey = new Uint8Array([...]); // Your private key as bytes
const account = importAccountFromPrivateKey(privateKey);

// Create an authenticated client
const sdkClient = new AuthenticatedAlephHttpClient(account);
```

#### Using a Provider (Phantom)

```typescript
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
  const sdkClient = new AuthenticatedAlephHttpClient(account);
  return sdkClient;
}
```

### Avalanche Authentication

```typescript
import { AlephHttpClient, AuthenticatedAlephHttpClient } from '@aleph-sdk/client';
import { importAccountFromPrivateKey, ChainType } from '@aleph-sdk/avalanche';

// Create an Avalanche account from a private key
const privateKey = 'your_private_key';
const account = await importAccountFromPrivateKey(privateKey, ChainType.C_CHAIN);

// Create an authenticated client
const sdkClient = new AuthenticatedAlephHttpClient(account);
```

### Base Authentication

```typescript
import { AlephHttpClient, AuthenticatedAlephHttpClient } from '@aleph-sdk/client';
import { importAccountFromPrivateKey } from '@aleph-sdk/base';

// Create a Base account from a private key
const privateKey = '0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef';
const account = importAccountFromPrivateKey(privateKey);

// Create an authenticated client
const sdkClient = new AuthenticatedAlephHttpClient(account);
```

## Storage

### Store Data with Posts

Post messages are used to store arbitrary JSON data on the Aleph network.

#### Unauthenticated Queries

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

#### Authenticated Posts

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

### Store Files

Files can be stored with the STORE message type.

```typescript
import { AuthenticatedAlephHttpClient } from '@aleph-sdk/client';
import { importAccountFromPrivateKey } from '@aleph-sdk/ethereum';
import fs from 'fs';

// Create an account
const account = importAccountFromPrivateKey('0x1234567890abcdef...');

// Create an authenticated client
const client = new AuthenticatedAlephHttpClient(account);

// Upload a file (Node.js)
const fileContent = fs.readFileSync('./example.pdf');
const fileResult = await client.createStore({
  fileContent,
  channel: 'TEST',
  sync: true
});

console.log(`File stored with hash: ${fileResult.item_hash}`);

// Get a file
const fileContent = await client.downloadFile(fileResult.item_hash);
```

### Using Aggregates

Aggregates are a key-value store on the Aleph network, bound by address.

#### Fetching Aggregates (Unauthenticated)

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

#### Creating Aggregates (Authenticated)

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

### Programs (FaaS)

Programs are serverless functions that run on demand.

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

### Instances (VMs)

Instances are persistent virtual machines running on the Aleph network.

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

### Watching Messages

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

### Message Forget

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

```typescript
import { AuthenticatedAlephHttpClient } from '@aleph-sdk/client';
import { importAccountFromPrivateKey as importEthereumAccount } from '@aleph-sdk/ethereum';
import { importAccountFromPrivateKey as importSolanaAccount } from '@aleph-sdk/solana';
import { importAccountFromPrivateKey as importAvalancheAccount, ChainType } from '@aleph-sdk/avalanche';

// Create accounts for different chains
const ethereumAccount = importEthereumAccount('0x1234567890abcdef...');
const solanaAccount = importSolanaAccount(new Uint8Array([...]));
const avalancheAccount = await importAvalancheAccount('avalanche-private-key', ChainType.C_CHAIN);

// Create authenticated clients for each chain
const ethereumClient = new AuthenticatedAlephHttpClient(ethereumAccount);
const solanaClient = new AuthenticatedAlephHttpClient(solanaAccount);
const avalancheClient = new AuthenticatedAlephHttpClient(avalancheAccount);

// Use each client with its respective account
const ethResult = await ethereumClient.createPost({
  postType: 'example',
  content: 'Message from Ethereum',
  channel: 'TEST',
  address: ethereumAccount.address,
  sync: true
});

const solResult = await solanaClient.createPost({
  postType: 'example',
  content: 'Message from Solana',
  channel: 'TEST',
  address: solanaAccount.address,
  sync: true
});

const avaxResult = await avalancheClient.createPost({
  postType: 'example',
  content: 'Message from Avalanche',
  channel: 'TEST',
  address: avalancheAccount.address,
  sync: true
});
```

## Configuration

You can customize the configuration when initializing the client:

```typescript
import { AlephHttpClient } from '@aleph-sdk/client';

// Custom API server
const client = new AlephHttpClient('https://api2.aleph.im');

// Default client uses the main Aleph API server
const defaultClient = new AlephHttpClient();
```

## React Integration

Example of using Aleph SDK with React:

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

The SDK provides comprehensive TypeScript support for all methods, parameters, and return types:

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

## Browser Compatibility

The SDK is compatible with modern browsers (Chrome, Firefox, Safari, Edge) and can be used in:

- Single-page applications (React, Vue, Angular, etc.)
- Browser extensions
- Mobile web applications

For older browsers, you may need to use a bundler with appropriate polyfills.

## Node.js Compatibility

The SDK is compatible with Node.js 12.x and later.

## Resources

- [GitHub Repository](https://github.com/aleph-im/aleph-sdk-ts)
- [NPM Package](https://www.npmjs.com/package/@aleph-sdk/client)
- [API Reference](/devhub/api/rest)
