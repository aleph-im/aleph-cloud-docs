# Getting Started

## Prerequisites

- An Aleph Cloud account (can be created through wallet authentication)
- The Aleph Cloud SDK for your preferred language
- Basic knowledge of blockchain concepts (for authentication)

## Installation

::: code-group

```bash [TypeScript]
npm install @aleph-sdk/client
```

```bash [Python]
pip install aleph-client
```
:::

# Storing Data

## Storing Messages

Messages are the most basic form of storage on Aleph Cloud. They are immutable and can contain any JSON-serializable data.

::: code-group

```ts [TypeScript]
import { AlephHttpClient, AuthenticatedAlephHttpClient } from '@aleph-sdk/client';
import { getAccountFromProvider } from '@aleph-sdk/ethereum';

// Create an unauthenticated client for reading
const client = new AlephHttpClient();

// Connect with Ethereum wallet (e.g., MetaMask)
const account = await getAccountFromProvider(window.ethereum);

// Create an authenticated client for writing
const authClient = new AuthenticatedAlephHttpClient(account);

// Store a simple message
const result = await authClient.createPost({
  postType: 'example',
  content: 'Hello, Aleph Cloud!',
  channel: 'TEST',
  address: account.address,
  inline: true,
  tags: ['example', 'hello-world'],
  sync: true
});

console.log(`Stored message with hash: ${result.item_hash}`);

// Store a JSON object
const jsonResult = await authClient.createPost({
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

```python [Python]
from aleph_sdk_python.asynchronous import AsyncClient
from aleph_sdk_python.chains.ethereum import ETHAccount

# Create an account (or connect with existing one)
private_key = "0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef"
account = ETHAccount(private_key)

# Create a client instance
client = AsyncClient(account=account)

# Store a simple message
result = await client.create_store(
    "Hello, Aleph Cloud!",
    tags=['example', 'hello-world']
)

print(f"Stored message with hash: {result['item_hash']}")

# Store a JSON object
user_data = {
    "name": "John Doe",
    "email": "john@example.com",
    "age": 30
}

json_result = await client.create_store(
    user_data,
    tags=['user', 'profile']
)

print(f"Stored JSON with hash: {json_result['item_hash']}")
```
:::

## Storing Files

Files can be any binary data, such as images, videos, documents, etc.

::: code-group

```ts [TypeScript]
// Browser: Upload a file from an input element
const fileInput = document.getElementById('fileInput');
const file = fileInput.files[0];
const fileContent = await file.arrayBuffer();
const fileResult = await authClient.createStore({
  fileContent: new Uint8Array(fileContent),
  channel: 'TEST',
  tags: ['image', 'profile'],
  sync: true
});

console.log(`File stored with hash: ${fileResult.item_hash}`);

// Node.js: Upload a file from the filesystem
const fs = require('fs');
const fileContent = fs.readFileSync('./example.pdf');
const fileResult = await authClient.createStore({
  fileContent,
  channel: 'TEST',
  tags: ['document', 'pdf'],
  sync: true
});

console.log(`File stored with hash: ${fileResult.item_hash}`);
```

```python [Python]
# Upload a file
with open('example.pdf', 'rb') as f:
    file_content = f.read()

file_result = await client.create_store_file(
    file_content,
    file_name='example.pdf',
    file_type='application/pdf',
    tags=['document', 'pdf']
)

print(f"File stored with hash: {file_result['item_hash']}")
```
:::

## Working with Aggregates

Aggregates are similar to documents in a database. They can be updated over time while maintaining a history of changes.

::: code-group

```ts [TypeScript]
// Create an aggregate
const aggregateResult = await authClient.createAggregate({
  key: 'john-doe',
  content: { name: 'John Doe', email: 'john@example.com' },
  channel: 'TEST',
  address: account.address,
  sync: true
});

console.log(`Aggregate created with hash: ${aggregateResult.item_hash}`);

// Get an aggregate
const user = await client.fetchAggregate(account.address, 'john-doe');
console.log(user);

// Update an aggregate (by creating a new one with the same key)
const updatedUser = {...user, age: 30};
await authClient.createAggregate({
  key: 'john-doe',
  content: updatedUser,
  channel: 'TEST',
  address: account.address,
  sync: true
});

// Fetch multiple aggregates for the same address
const userAggregates = await client.fetchAggregates(account.address, ['john-doe', 'settings']);
console.log(userAggregates['john-doe']);
console.log(userAggregates.settings);
```

```python [Python]
# Create an aggregate
aggregate_result = await client.create_aggregate(
    'users',
    {'name': 'John Doe', 'email': 'john@example.com'},
    key='john-doe'
)

print(f"Aggregate created with key: {aggregate_result['key']}")

# Get an aggregate
user = await client.fetch_aggregate('users', 'john-doe')
print(user)

# Update an aggregate
updated_user = {**user, 'age': 31}  # Add or update fields
await client.update_aggregate('users', 'john-doe', updated_user)

# Query aggregates
users = await client.fetch_aggregates(
    'users',
    query={'age': {'$gt': 25}},
    limit=10
)

for user in users:
    print(f"{user['key']}: {user['name']}, {user['age']}")
```
:::

# Retrieving Data

## Retrieving Messages

::: code-group

```ts [TypeScript]
// Get a post by hash
const message = await client.getPost({
  hash: 'QmHash123'
});
console.log(message.content);

// Query posts by tags
const messages = await client.getPosts({
  tags: ['user', 'profile'],
  pagination: 10,
  page: 1
});

messages.posts.forEach(msg => {
  console.log(`${msg.item_hash}: ${JSON.stringify(msg.content)}`);
});
```

```python [Python]
# Get a message by hash
message = await client.get_message('QmHash123')
print(message['content'])

# Query messages by tags
messages = await client.get_messages(
    tags=['user', 'profile'],
    limit=10
)

for msg in messages:
    print(f"{msg['item_hash']}: {msg['content']}")
```
:::

## Retrieving Files

::: code-group

```ts [TypeScript]
// Get a file by hash
const fileContent = await client.downloadFile('QmFileHash123');

// In browser: Display or download the file
if (fileContent instanceof ArrayBuffer) {
  const blob = new Blob([fileContent]);

  // For images
  const img = document.createElement('img');
  img.src = URL.createObjectURL(blob);
  document.body.appendChild(img);

  // For downloads
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = 'download';
  a.click();
}

// In Node.js: Save the file
const fs = require('fs');
fs.writeFileSync('./downloaded-file', Buffer.from(fileContent));
```

```python [Python]
# Get a file
file_message = await client.get_message('QmFileHash123')
file_content = await client.download_file(file_message)

# Save the file
with open('downloaded_file', 'wb') as f:
    f.write(file_content)
```
:::

# Advanced Usage

## Storage with Encryption

You can encrypt your data before storing it on Aleph Cloud for additional privacy.

::: code-group

```ts [TypeScript]
import { ethers } from 'ethers';
import { importAccountFromPrivateKey } from '@aleph-sdk/ethereum';
import { AuthenticatedAlephHttpClient } from '@aleph-sdk/client';

// Encrypt data for a specific recipient
async function encryptAndStore(data, recipientPublicKey) {
  // Create an Ethereum account
  const privateKey = 'your_private_key';
  const account = importAccountFromPrivateKey(privateKey);

  // Create an authenticated client
  const authClient = new AuthenticatedAlephHttpClient(account);

  // Create a shared secret using ECDH
  const ephemeralWallet = ethers.Wallet.createRandom();
  const publicKeyBytes = ethers.utils.arrayify(recipientPublicKey);
  const sharedSecret = ethers.utils.keccak256(
    ethers.utils.concat([
      ethers.utils.arrayify(
        await ephemeralWallet.signMessage(publicKeyBytes)
      ),
      publicKeyBytes
    ])
  );

  // Encrypt the data
  const encryptedData = await encryptWithAES(JSON.stringify(data), sharedSecret);

  // Store the encrypted data and ephemeral public key
  const result = await authClient.createPost({
    postType: 'encrypted-data',
    content: {
      encrypted: encryptedData,
      ephemeralPublicKey: ephemeralWallet.publicKey
    },
    channel: 'TEST',
    address: account.address,
    tags: ['encrypted'],
    sync: true
  });

  return result.item_hash;
}

// Helper function to encrypt with AES
async function encryptWithAES(data, key) {
  const iv = window.crypto.getRandomValues(new Uint8Array(16));
  const keyBuffer = await window.crypto.subtle.importKey(
    'raw',
    ethers.utils.arrayify(key).slice(0, 32),
    { name: 'AES-CBC' },
    false,
    ['encrypt']
  );

  const encryptedBuffer = await window.crypto.subtle.encrypt(
    { name: 'AES-CBC', iv },
    keyBuffer,
    new TextEncoder().encode(data)
  );

  return {
    iv: Array.from(iv),
    data: Array.from(new Uint8Array(encryptedBuffer))
  };
}
```

```python [Python]
from aleph_sdk_python.utils import encrypt_message, decrypt_message

# Encrypt a message for a specific recipient
recipient_public_key = "0x..."
encrypted_content = encrypt_message(
    {"sensitive": "data"},
    recipient_public_key
)

# Store the encrypted message
encrypted_result = await client.create_store(
    encrypted_content,
    tags=["encrypted", "private"]
)

# Retrieve and decrypt a message
encrypted_message = await client.get_message(encrypted_result['item_hash'])
decrypted_content = decrypt_message(
    encrypted_message['content'],
    account.private_key
)

print(f"Decrypted content: {decrypted_content}")
```
:::

## IPFS Integration

All content stored on Aleph Cloud is also accessible via IPFS.

::: code-group

```ts [TypeScript]
// You can pin existing IPFS content to Aleph Cloud by creating a STORE message
// with the IPFS CID as the file_hash
import { importAccountFromPrivateKey } from '@aleph-sdk/ethereum';
import { AuthenticatedAlephHttpClient } from '@aleph-sdk/client';

// Setup client
const account = importAccountFromPrivateKey('your_private_key');
const authClient = new AuthenticatedAlephHttpClient(account);

// Pin an existing IPFS hash
const existingHash = 'QmExistingIPFSHash';
const pinResult = await authClient.createStore({
  fileHash: existingHash,
  channel: 'TEST',
  sync: true
});

console.log(`Pinned IPFS content with store message hash: ${pinResult.item_hash}`);

// Access via IPFS gateway
const ipfsUrl = `https://ipfs.aleph.cloud/ipfs/${existingHash}$`;
console.log(`IPFS URL: ${ipfsUrl}`);
```

```python [Python]
# Pin an IPFS CID
pin_result = await client.pin_ipfs('QmExistingIPFSHash')
print(f"Pinned: {pin_result['success']}")

# Get content from IPFS
content = await client.ipfs_get('QmExistingIPFSHash')
```
:::

## Storage with Metadata

You can include metadata with your stored content to make it more discoverable and organized.

::: code-group

```ts [TypeScript]
import { importAccountFromPrivateKey } from '@aleph-sdk/ethereum';
import { AuthenticatedAlephHttpClient } from '@aleph-sdk/client';

// Create an account
const account = importAccountFromPrivateKey('your_private_key');

// Create an authenticated client
const authClient = new AuthenticatedAlephHttpClient(account);

// Store content with metadata in a POST message
const result = await authClient.createPost({
  postType: 'document',
  content: {
    text: 'Content with metadata',
    metadata: {
      title: 'Example Document',
      description: 'This is an example document with metadata',
      author: 'John Doe',
      created: Date.now(),
      version: '1.0',
      language: 'en',
      license: 'MIT'
    }
  },
  channel: 'TEST',
  address: account.address,
  tags: ['example', 'metadata'],
  sync: true
});

console.log(`Stored with hash: ${result.item_hash}`);

// Query by tags and check metadata in results
const client = new AlephHttpClient();
const documents = await client.getPosts({
  tags: ['example', 'metadata'],
  pagination: 10,
  page: 1
});

documents.posts.forEach(doc => {
  if (doc.content.metadata &&
      doc.content.metadata.language === 'en' &&
      doc.content.metadata.version === '1.0') {
    console.log(`${doc.item_hash}: ${doc.content.metadata.title}`);
  }
});
```

```python [Python]
# Store content with metadata
result = await client.create_store(
    'Content with metadata',
    tags=['example', 'metadata'],
    metadata={
        'title': 'Example Document',
        'description': 'This is an example document with metadata',
        'author': 'John Doe',
        'created': int(time.time()),
        'version': '1.0',
        'language': 'en',
        'license': 'MIT'
    }
)

print(f"Stored with hash: {result['item_hash']}")

# Query by metadata
documents = await client.get_messages(
    metadata={
        'language': 'en',
        'version': '1.0'
    },
    limit=10
)

for doc in documents:
    print(f"{doc['item_hash']}: {doc['metadata']['title']}")
```
:::

# Use Cases

## NFT Metadata Storage

Store metadata for NFTs in a decentralized and permanent way.

::: code-group

```ts [TypeScript]
import { importAccountFromPrivateKey } from '@aleph-sdk/ethereum';
import { AuthenticatedAlephHttpClient } from '@aleph-sdk/client';

// Create an account
const account = importAccountFromPrivateKey('your_private_key');

// Create an authenticated client
const authClient = new AuthenticatedAlephHttpClient(account);

// Store NFT metadata
const nftMetadata = {
  name: "Cosmic Creature #123",
  description: "A rare cosmic creature from the Aleph universe",
  image: "ipfs://QmImageHash123",
  attributes: [
    { trait_type: "Background", value: "Space" },
    { trait_type: "Body", value: "Alien" },
    { trait_type: "Eyes", value: "Glowing" },
    { trait_type: "Mouth", value: "Smiling" },
    { trait_type: "Accessory", value: "Laser Gun" }
  ]
};

const result = await authClient.createPost({
  postType: 'nft-metadata',
  content: nftMetadata,
  channel: 'TEST',
  address: account.address,
  tags: ['nft', 'metadata', 'cosmic-creatures'],
  sync: true
});

console.log(`NFT metadata stored with hash: ${result.item_hash}`);
console.log(`Metadata URL: https://api2.aleph.cloud/api/v0/messages/${result.item_hash}`);
```
:::

## User Profile System

Create a user profile system with updatable profiles.

::: code-group

```ts [TypeScript]
import { importAccountFromPrivateKey } from '@aleph-sdk/ethereum';
import { AlephHttpClient, AuthenticatedAlephHttpClient } from '@aleph-sdk/client';

// Create an account
const account = importAccountFromPrivateKey('your_private_key');

// Create an authenticated client
const authClient = new AuthenticatedAlephHttpClient(account);

// Create a user profile as an aggregate
const profileData = {
  username: 'johndoe',
  displayName: 'John Doe',
  bio: 'Blockchain enthusiast and developer',
  avatar: 'QmAvatarHash123',
  links: {
    twitter: 'https://twitter.com/johndoe',
    github: 'https://github.com/johndoe'
  },
  createdAt: Date.now()
};

const profileResult = await authClient.createAggregate({
  key: 'profile',
  content: profileData,
  channel: 'TEST',
  address: account.address,
  sync: true
});

console.log(`Profile created with hash: ${profileResult.item_hash}`);

// Get a profile
const client = new AlephHttpClient();
const profile = await client.fetchAggregate(account.address, 'profile');

// Update a profile (by creating a new aggregate with the same key)
const updatedProfile = {
  ...profile,
  bio: 'Blockchain developer and Aleph Cloud enthusiast',
  links: {
    ...profile.links,
    website: 'https://johndoe.com'
  },
  updatedAt: Date.now()
};

await authClient.createAggregate({
  key: 'profile',
  content: updatedProfile,
  channel: 'TEST',
  address: account.address,
  sync: true
});

// To search for profiles, you would need to:
// 1. Use getTags to find accounts with 'profile' aggregate
// 2. Fetch each profile and filter locally
// Or implement a custom indexer for more advanced querying

// Example of getting a list of profiles (simplified)
const messages = await client.getPosts({
  tags: ['profile-created'],
  pagination: 10,
  page: 1
});

const profiles = [];
for (const msg of messages.posts) {
  try {
    const profileAddress = msg.sender;
    const profile = await client.fetchAggregate(profileAddress, 'profile');
    if (profile) {
      profiles.push({
        address: profileAddress,
        ...profile
      });
    }
  } catch (e) {
    console.error(`Failed to fetch profile: ${e}`);
  }
}

profiles.forEach(profile => {
  console.log(`${profile.username}: ${profile.displayName}`);
});
```
:::

## Decentralized Content Management

Create a decentralized blog or content management system.

::: code-group

```ts [TypeScript]
import { importAccountFromPrivateKey } from '@aleph-sdk/ethereum';
import { AlephHttpClient, AuthenticatedAlephHttpClient } from '@aleph-sdk/client';

// Create an account
const account = importAccountFromPrivateKey('your_private_key');

// Create an authenticated client
const authClient = new AuthenticatedAlephHttpClient(account);

// Create a blog post using POST message type
const postContent = {
  title: 'Getting Started with Aleph Cloud',
  content: '# Introduction\n\nAleph Cloud is a decentralized storage and computing network...',
  author: account.address,
  tags: ['aleph', 'tutorial', 'blockchain'],
  createdAt: Date.now(),
  status: 'published'
};

const postResult = await authClient.createPost({
  postType: 'blog-post',
  content: postContent,
  channel: 'TEST',
  address: account.address,
  tags: ['blog', 'post', ...postContent.tags],
  sync: true
});

console.log(`Blog post created with hash: ${postResult.item_hash}`);

// Create a client for reading
const client = new AlephHttpClient();

// List recent posts
const recentPosts = await client.getPosts({
  tags: ['blog', 'post', 'published'],
  pagination: 10,
  page: 1
});

recentPosts.posts.forEach(post => {
  const content = post.content;
  console.log(`${content.title} by ${content.author} (${new Date(content.createdAt).toDateString()})`);
});

// Search posts by tag
const taggedPosts = await client.getPosts({
  tags: ['blog', 'post', 'tutorial'],
  pagination: 10,
  page: 1
});

taggedPosts.posts.forEach(post => {
  const content = post.content;
  console.log(`${content.title} (${content.tags.join(', ')})`);
});
```
:::

# Best Practices

## Efficient Data Organization

- **Use Tags**: Always add relevant tags to your content for better discoverability
- **Use Aggregates for Related Data**: Group related data using aggregates with consistent keys
- **Use Namespaces**: Prefix your aggregate types and keys with a namespace to avoid conflicts

## Performance Optimization

- **Limit Query Results**: Always specify a reasonable limit for queries
- **Use Specific Queries**: Make your queries as specific as possible to reduce data transfer
- **Batch Operations**: Group multiple operations together when possible

## Security Considerations

- **Encrypt Sensitive Data**: Use encryption for any sensitive information
- **Validate User Input**: Always validate user input before storing it
- **Use Secure Authentication**: Ensure your private keys are stored securely

# Troubleshooting

## Common Issues

### Message Not Found

If you're trying to retrieve a message that doesn't exist, you'll get a "Message not found" error.

```javascript
try {
  const client = new AlephHttpClient();
  const message = await client.getPost({
    hash: 'NonExistentHash'
  });
} catch (error) {
  console.error(`Error: ${error.message}`);
  // Handle the error appropriately
}
```

### Rate Limiting

If you're making too many requests in a short period, you might encounter rate limiting.

```javascript
try {
  import { importAccountFromPrivateKey } from '@aleph-sdk/ethereum';
  import { AuthenticatedAlephHttpClient } from '@aleph-sdk/client';

  // Create an account
  const account = importAccountFromPrivateKey('your_private_key');

  // Create an authenticated client
  const authClient = new AuthenticatedAlephHttpClient(account);

  const result = await authClient.createPost({
    postType: 'example',
    content: 'Hello, World!',
    channel: 'TEST',
    address: account.address,
    sync: true
  });
} catch (error) {
  if (error.response && error.response.status === 429) {
    console.error('Rate limit exceeded. Please try again later.');
    // Implement exponential backoff or retry logic
  } else {
    console.error(`Error: ${error.message}`);
  }
}
```

### Large File Uploads

When uploading large files, you might encounter timeout issues. Consider splitting large files into smaller chunks.

```javascript
import { importAccountFromPrivateKey } from '@aleph-sdk/ethereum';
import { AuthenticatedAlephHttpClient } from '@aleph-sdk/client';

// Split a large file into chunks
async function uploadLargeFile(file) {
  // Create an account
  const account = importAccountFromPrivateKey('your_private_key');

  // Create an authenticated client
  const authClient = new AuthenticatedAlephHttpClient(account);

  const chunkSize = 5 * 1024 * 1024; // 5MB chunks
  const totalChunks = Math.ceil(file.size / chunkSize);
  const fileHashes = [];

  for (let i = 0; i < totalChunks; i++) {
    const start = i * chunkSize;
    const end = Math.min(file.size, start + chunkSize);
    const chunk = file.slice(start, end);
    const chunkContent = await chunk.arrayBuffer();

    const result = await authClient.createStore({
      fileContent: new Uint8Array(chunkContent),
      channel: 'TEST',
      tags: ['chunk', `file-${file.name}`, `part-${i}`],
      sync: true
    });

    fileHashes.push(result.item_hash);
    console.log(`Uploaded chunk ${i + 1}/${totalChunks}`);
  }

  // Store the manifest
  const manifest = {
    filename: file.name,
    mimetype: file.type,
    size: file.size,
    chunks: fileHashes,
    totalChunks
  };

  const manifestResult = await authClient.createPost({
    postType: 'file-manifest',
    content: manifest,
    channel: 'TEST',
    address: account.address,
    tags: ['manifest', `file-${file.name}`],
    sync: true
  });

  return manifestResult.item_hash;
}
```

# Resources

- [TypeScript SDK Documentation](/devhub/sdks-and-tools/typescript-sdk/)
- [Python SDK Documentation](/devhub/sdks-and-tools/python-sdk/)
- [API Reference](/devhub/api/rest)