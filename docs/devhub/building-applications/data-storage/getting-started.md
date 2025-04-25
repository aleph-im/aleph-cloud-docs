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
import { AlephHttpClient } from '@aleph-sdk/client';
import { ETHAccount, ItemType, StoreType } from '@aleph-sdk/core';

// Create a client instance
const aleph = new AlephHttpClient();

// Connect with Ethereum wallet (e.g., MetaMask)
const account = await aleph.ethereum.connect();

// Store a simple message
const result = await aleph.storage.store(
  'Hello, Aleph Cloud!',
  { account, tags: ['example', 'hello-world'] }
);

console.log(`Stored message with hash: ${result.item_hash}`);

// Store a JSON object
const jsonResult = await aleph.storage.store(
  { name: 'John Doe', email: 'john@example.com' },
  { account, tags: ['user', 'profile'] }
);

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
const fileResult = await aleph.storage.storeFile(
  file,
  { account, tags: ['image', 'profile'] }
);

console.log(`File stored with hash: ${fileResult.item_hash}`);

// Node.js: Upload a file from the filesystem
const fs = require('fs');
const buffer = fs.readFileSync('./example.pdf');
const fileResult = await aleph.storage.storeFile(
  buffer,
  {
    account,
    filename: 'example.pdf',
    mimetype: 'application/pdf',
    tags: ['document', 'pdf']
  }
);

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
const aggregate = await aleph.aggregate.create(
  'users',
  { name: 'John Doe', email: 'john@example.com' },
  { account, key: 'john-doe' }
);

console.log(`Aggregate created with key: ${aggregate.key}`);

// Get an aggregate
const user = await aleph.aggregate.get('users', 'john-doe');
console.log(user);

// Update an aggregate
await aleph.aggregate.update(
  'users',
  'john-doe',
  { ...user, age: 30 },
  { account }
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
const fileContent = await aleph.storage.getFile('QmFileHash123');

// In browser: Display or download the file
if (fileContent.type.startsWith('image/')) {
  const img = document.createElement('img');
  img.src = URL.createObjectURL(fileContent);
  document.body.appendChild(img);
} else {
  const a = document.createElement('a');
  a.href = URL.createObjectURL(fileContent);
  a.download = fileContent.name || 'download';
  a.click();
}

// In Node.js: Save the file
const fs = require('fs');
fs.writeFileSync('./downloaded-file', fileContent);
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

// Encrypt data for a specific recipient
async function encryptAndStore(data, recipientPublicKey) {
  // Connect with Ethereum wallet
  const account = await aleph.ethereum.connect();
  
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
  const result = await aleph.storage.store(
    {
      encrypted: encryptedData,
      ephemeralPublicKey: ephemeralWallet.publicKey
    },
    { account, tags: ['encrypted'] }
  );
  
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
// Get IPFS hash from Aleph Cloud hash
const ipfsHash = await aleph.storage.getIPFSHash('QmHash123');
console.log(`IPFS hash: ${ipfsHash}`);

// Access via IPFS gateway
const ipfsUrl = `https://ipfs.aleph.cloud/ipfs/${ipfsHash}`;
console.log(`IPFS URL: ${ipfsUrl}`);

// Pin existing IPFS content to Aleph Cloud
const pinResult = await aleph.ipfs.pin('QmExistingIPFSHash');
console.log(`Pinned: ${pinResult.success}`);
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
// Store content with metadata
const result = await aleph.storage.store(
  'Content with metadata',
  {
    account,
    tags: ['example', 'metadata'],
    metadata: {
      title: 'Example Document',
      description: 'This is an example document with metadata',
      author: 'John Doe',
      created: Date.now(),
      version: '1.0',
      language: 'en',
      license: 'MIT'
    }
  }
);

console.log(`Stored with hash: ${result.item_hash}`);

// Query by metadata
const documents = await aleph.storage.query({
  metadata: {
    language: 'en',
    version: '1.0'
  },
  limit: 10
});

documents.forEach(doc => {
  console.log(`${doc.item_hash}: ${doc.metadata.title}`);
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

const result = await aleph.storage.store(
  nftMetadata,
  { account, tags: ['nft', 'metadata', 'cosmic-creatures'] }
);

console.log(`NFT metadata stored with hash: ${result.item_hash}`);
console.log(`Metadata URL: https://api2.aleph.cloud/api/v0/messages/${result.item_hash}`);
```
:::

## User Profile System

Create a user profile system with updatable profiles.

::: code-group

```ts [TypeScript]
// Create a user profile
const profileResult = await aleph.aggregate.create(
  'profiles',
  {
    username: 'johndoe',
    displayName: 'John Doe',
    bio: 'Blockchain enthusiast and developer',
    avatar: 'QmAvatarHash123',
    links: {
      twitter: 'https://twitter.com/johndoe',
      github: 'https://github.com/johndoe'
    },
    createdAt: Date.now()
  },
  { account, key: 'johndoe' }
);

console.log(`Profile created with key: ${profileResult.key}`);

// Update a profile
const profile = await aleph.aggregate.get('profiles', 'johndoe');
await aleph.aggregate.update(
  'profiles',
  'johndoe',
  {
    ...profile,
    bio: 'Blockchain developer and Aleph Cloud enthusiast',
    links: {
      ...profile.links,
      website: 'https://johndoe.com'
    },
    updatedAt: Date.now()
  },
  { account }
);

// Search for profiles
const profiles = await aleph.aggregate.query('profiles', {
  where: {
    $or: [
      { username: { $regex: 'john' } },
      { displayName: { $regex: 'John' } }
    ]
  },
  limit: 10
});

profiles.forEach(profile => {
  console.log(`${profile.username}: ${profile.displayName}`);
});
```
:::

## Decentralized Content Management

Create a decentralized blog or content management system.

::: code-group

```ts [TypeScript]
// Create a blog post
const postResult = await aleph.aggregate.create(
  'blog-posts',
  {
    title: 'Getting Started with Aleph Cloud',
    content: '# Introduction\n\nAleph Cloud is a decentralized storage and computing network...',
    author: 'johndoe',
    tags: ['aleph', 'tutorial', 'blockchain'],
    createdAt: Date.now(),
    status: 'published'
  },
  { account, key: `post-${Date.now()}` }
);

console.log(`Blog post created with key: ${postResult.key}`);

// List recent posts
const recentPosts = await aleph.aggregate.query('blog-posts', {
  where: { status: 'published' },
  sort: { createdAt: -1 },
  limit: 10
});

recentPosts.forEach(post => {
  console.log(`${post.title} by ${post.author} (${new Date(post.createdAt).toDateString()})`);
});

// Search posts by tag
const taggedPosts = await aleph.aggregate.query('blog-posts', {
  where: {
    status: 'published',
    tags: { $in: ['tutorial'] }
  },
  limit: 10
});

taggedPosts.forEach(post => {
  console.log(`${post.title} (${post.tags.join(', ')})`);
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
  const message = await aleph.storage.get('NonExistentHash');
} catch (error) {
  console.error(`Error: ${error.message}`);
  // Handle the error appropriately
}
```

### Rate Limiting

If you're making too many requests in a short period, you might encounter rate limiting.

```javascript
try {
  const result = await aleph.storage.store('Hello, World!', { account });
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
// Split a large file into chunks
async function uploadLargeFile(file, account) {
  const chunkSize = 5 * 1024 * 1024; // 5MB chunks
  const totalChunks = Math.ceil(file.size / chunkSize);
  const fileHashes = [];
  
  for (let i = 0; i < totalChunks; i++) {
    const start = i * chunkSize;
    const end = Math.min(file.size, start + chunkSize);
    const chunk = file.slice(start, end);
    
    const result = await aleph.storage.storeFile(
      chunk,
      {
        account,
        filename: `${file.name}.part${i}`,
        tags: ['chunk', `file-${file.name}`]
      }
    );
    
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
  
  const manifestResult = await aleph.storage.store(
    manifest,
    { account, tags: ['manifest', `file-${file.name}`] }
  );
  
  return manifestResult.item_hash;
}
```

# Resources

- [TypeScript SDK Documentation](/devhub/sdks-and-tools/typescript-sdk/)
- [Python SDK Documentation](/devhub/sdks-and-tools/python-sdk/)
- [API Reference](/devhub/api-reference/rest)
- [Example Projects](/devhub/example-projects/web3-apps/)
