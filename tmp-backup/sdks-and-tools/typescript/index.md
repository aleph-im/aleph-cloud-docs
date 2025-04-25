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

### Connect with Ethereum

```javascript
// Connect with MetaMask or other Ethereum provider
const account = await aleph.ethereum.connect();
console.log(`Connected with address: ${account.address}`);
```

### Connect with Solana

```javascript
// Connect with Phantom or other Solana wallet
const account = await aleph.solana.connect();
console.log(`Connected with address: ${account.address}`);
```

### Using a Private Key

```javascript
// For server-side applications
const account = aleph.ethereum.importAccount('0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef');
```

## Storage

### Store Data

```javascript
// Store a simple message
const result = await aleph.storage.store(
  'Hello, Aleph.im!',
  { tags: ['example', 'hello-world'] }
);

console.log(`Stored message with hash: ${result.item_hash}`);

// Store a JSON object
const jsonResult = await aleph.storage.store(
  { name: 'John Doe', email: 'john@example.com' },
  { tags: ['user', 'profile'] }
);

console.log(`Stored JSON with hash: ${jsonResult.item_hash}`);
```

### Retrieve Data

```javascript
// Get a message by hash
const message = await aleph.storage.get('QmHash123');
console.log(message.content);

// Query messages by tags
const messages = await aleph.storage.query({
  tags: ['user', 'profile'],
  limit: 10
});

messages.forEach(msg => {
  console.log(`${msg.item_hash}: ${JSON.stringify(msg.content)}`);
});
```

### File Storage

```javascript
// Upload a file (browser)
const fileInput = document.getElementById('fileInput');
const file = fileInput.files[0];
const fileResult = await aleph.storage.storeFile(file);
console.log(`File stored with hash: ${fileResult.item_hash}`);

// Upload a file (Node.js)
const fs = require('fs');
const buffer = fs.readFileSync('./example.pdf');
const fileResult = await aleph.storage.storeFile(buffer, {
  filename: 'example.pdf',
  mimetype: 'application/pdf'
});
console.log(`File stored with hash: ${fileResult.item_hash}`);

// Get a file
const fileContent = await aleph.storage.getFile('QmFileHash123');
```

## Computing

### On-demand Execution (FaaS)

```javascript
// Deploy a function
const programResult = await aleph.program.deploy({
  name: 'hello-world',
  description: 'A simple hello world function',
  code: `
    export default function(req) {
      const name = req.query.name || 'World';
      return { message: \`Hello, \${name}!\` };
    }
  `,
  runtime: 'nodejs16',
  memory: 128,
  timeout: 10
});

console.log(`Function deployed with ID: ${programResult.programId}`);

// Call the function
const response = await aleph.program.call(programResult.programId, {
  query: { name: 'Alice' }
});

console.log(response); // { message: 'Hello, Alice!' }
```

### Persistent Execution (VMs)

```javascript
// Deploy a VM
const vmResult = await aleph.instance.create({
  name: 'web-server',
  description: 'A web server running on Aleph.im',
  cpu: 2,
  memory: 4, // GB
  disk: 20, // GB
  image: 'debian:11',
  sshKey: 'ssh-rsa AAAAB3NzaC1yc2E...', // Your public SSH key
  firewall: {
    allowedPorts: [22, 80, 443]
  }
});

console.log(`VM deployed with ID: ${vmResult.instanceId}`);
console.log(`IPv6 Address: ${vmResult.ipv6}`);

// Get VM status
const status = await aleph.instance.status(vmResult.instanceId);
console.log(`VM status: ${status.state}`);
```

## Indexing

### Query Blockchain Events

```javascript
// Query EVM events
const events = await aleph.indexer.queryEvents({
  network: 'ethereum',
  contract: '0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984', // UNI token
  eventName: 'Transfer',
  limit: 10
});

events.forEach(event => {
  console.log(`Transfer: ${event.args.from} -> ${event.args.to}: ${event.args.value}`);
});

// Subscribe to events via WebSocket
const subscription = aleph.indexer.subscribeEvents({
  network: 'ethereum',
  contract: '0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984',
  eventName: 'Transfer'
}, (event) => {
  console.log(`New transfer: ${event.args.from} -> ${event.args.to}: ${event.args.value}`);
});

// Later, unsubscribe
subscription.unsubscribe();
```

## Advanced Usage

### Aggregate Storage

```javascript
// Create an aggregate (like a document in a database)
const aggregate = await aleph.aggregate.create(
  'users',
  { name: 'John Doe', email: 'john@example.com' },
  { key: 'john-doe' } // Optional key for easier retrieval
);

console.log(`Aggregate created with key: ${aggregate.key}`);

// Get an aggregate
const user = await aleph.aggregate.get('users', 'john-doe');
console.log(user);

// Update an aggregate
await aleph.aggregate.update(
  'users',
  'john-doe',
  { ...user, age: 30 }
);

// Query aggregates
const users = await aleph.aggregate.query('users', {
  where: { age: { $gt: 25 } },
  limit: 10
});

users.forEach(user => {
  console.log(`${user.key}: ${user.name}, ${user.age}`);
});
```

### IPFS Integration

```javascript
// Pin an IPFS CID
const pinResult = await aleph.ipfs.pin('QmHash123');
console.log(`Pinned: ${pinResult.success}`);

// Get content from IPFS
const content = await aleph.ipfs.get('QmHash123');
```

### Multichain Support

```javascript
// Use with different chains
const ethereumAccount = await aleph.ethereum.connect();
const solanaAccount = await aleph.solana.connect();

// Store data signed by Ethereum account
const ethResult = await aleph.storage.store(
  'Ethereum message',
  { account: ethereumAccount }
);

// Store data signed by Solana account
const solResult = await aleph.storage.store(
  'Solana message',
  { account: solanaAccount }
);
```

## Error Handling

```javascript
try {
  const result = await aleph.storage.get('NonExistentHash');
} catch (error) {
  console.error(`Error: ${error.message}`);
  
  if (error.response) {
    console.error(`Status: ${error.response.status}`);
    console.error(`Data: ${JSON.stringify(error.response.data)}`);
  }
}
```

## Configuration

```javascript
// Custom configuration
const aleph = new AlephHttpClient({
  apiServer: 'https://api2.aleph.im',
  channel: 'TEST',
  networkId: 'ETH'
});

// Changing configuration after initialization
aleph.setApiServer('https://api1.aleph.im');
aleph.setChannel('MYAPP');
```

## React Integration

```jsx
import React, { useState, useEffect } from 'react';
import { AlephHttpClient } from '@aleph-sdk/client';
import { ETHAccount } from '@aleph-sdk/core';

function AlephComponent() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        const aleph = new AlephHttpClient();
        const message = await aleph.storage.get('QmHash123');
        setData(message.content);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);
  
  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  
  return (
    <div>
      <h2>Data from Aleph.im</h2>
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </div>
  );
}
```

## TypeScript Support

The SDK includes TypeScript definitions for all methods and objects:

```typescript
import { AlephHttpClient } from '@aleph-sdk/client';
import { Message, ProgramDeployOptions } from '@aleph-sdk/core';

const aleph: AlephHttpClient = new AlephHttpClient();

interface UserProfile {
  name: string;
  email: string;
  age?: number;
}

async function storeUserProfile(profile: UserProfile): Promise<string> {
  const result = await aleph.storage.store<UserProfile>(profile);
  return result.item_hash;
}

async function deployGreetingProgram(): Promise<string> {
  const options: ProgramDeployOptions = {
    name: 'greeting',
    code: `export default (req) => ({ greeting: 'Hello' })`,
    runtime: 'nodejs16'
  };
  
  const result = await aleph.program.deploy(options);
  return result.programId;
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
- [SDK Documentation](https://aleph-cloud.github.io/aleph-sdk-ts/)
- [API Reference](/devhub/api/rest/)
- [Example Projects](/devhub/examples/web3-apps/)
