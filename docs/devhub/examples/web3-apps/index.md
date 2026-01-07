# Web3 Applications Examples

This section provides practical examples of web3 applications built with Aleph Cloud. These examples demonstrate how to leverage Aleph Cloud's decentralized storage, indexing, and computing capabilities to create powerful decentralized applications.

## Overview

Web3 applications built on Aleph Cloud benefit from:

- **Decentralized Storage**: Store user data, application state, and assets permanently
- **Indexing**: Query blockchain data efficiently
- **Computing**: Run serverless functions and virtual machines
- **Cross-Chain Compatibility**: Support for multiple blockchains
- **Scalability**: Handle high traffic without centralized infrastructure

## Example Projects

### Decentralized Social Media Platform

A social media platform where users own their data and content is stored permanently on Aleph Cloud.

#### Key Features

- User profiles stored as aggregates
- Posts stored as immutable messages
- Media files (images, videos) stored on Aleph Cloud's decentralized storage
- User authentication via blockchain wallets
- Content indexing for efficient searching and filtering

#### Implementation Highlights

```javascript
// Import required packages
import { AuthenticatedAlephHttpClient } from '@aleph-sdk/client';
import { importAccountFromPrivateKey, getAccountFromProvider } from '@aleph-sdk/ethereum';

// Create an account (for demo using private key)
const account = importAccountFromPrivateKey('your_private_key');
// Or with a web provider
// const account = await getAccountFromProvider(window.ethereum);

// Create an authenticated client
const authClient = new AuthenticatedAlephHttpClient(account);

// Store a user profile as an aggregate
const profileResult = await authClient.createAggregate({
  key: 'profile',
  content: {
    username: 'satoshi',
    displayName: 'Satoshi Nakamoto',
    bio: 'Creator of Bitcoin',
    avatar: 'QmAvatarHash123',
    links: {
      twitter: 'https://twitter.com/satoshi',
      github: 'https://github.com/satoshi'
    },
    createdAt: Date.now()
  },
  channel: 'TEST',
  address: account.address,
  sync: true
});

// Create a post
const postResult = await authClient.createPost({
  postType: 'social-post',
  content: {
    text: 'Hello, decentralized world!',
    timestamp: Date.now(),
    attachments: ['QmImageHash123']
  },
  channel: 'TEST',
  address: account.address,
  tags: ['post', 'social'],
  sync: true
});

// Store an image
const fileInput = document.getElementById('imageUpload');
const file = fileInput.files[0];
const fileContent = await file.arrayBuffer();
const fileResult = await authClient.createStore({
  fileObject: new Uint8Array(fileContent),
  channel: 'TEST',
  tags: ['image', 'social'],
  sync: true
});
```

#### Demo Application

Check out our [Decentralized Social Media Demo](https://github.com/aleph-im/social-demo) for a complete implementation.

### NFT Marketplace

A decentralized marketplace for NFTs with metadata stored on Aleph Cloud.

#### Key Features

- NFT metadata stored permanently on Aleph Cloud
- Marketplace listings stored as aggregates
- Transaction history indexed for each NFT
- Decentralized search and discovery
- Integration with multiple blockchains

#### Implementation Highlights

```javascript
// Import required packages
import { AlephHttpClient, AuthenticatedAlephHttpClient } from '@aleph-sdk/client';
import { importAccountFromPrivateKey } from '@aleph-sdk/ethereum';

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
    { trait_type: "Eyes", value: "Glowing" }
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

// Create a marketplace listing as an aggregate
const listingResult = await authClient.createAggregate({
  key: `listing-${Date.now()}`,
  content: {
    tokenId: '123',
    collection: '0xCollectionAddress',
    seller: account.address,
    price: '1000000000000000000', // 1 ETH in wei
    currency: '0xETHAddress',
    active: true,
    createdAt: Date.now()
  },
  channel: 'TEST',
  address: account.address,
  sync: true
});

// Create client for reading
const client = new AlephHttpClient();

// To find active listings, we would need to:
// 1. Find all aggregates with the right key prefix/tags 
// 2. Filter the active ones on the client side

// For demonstration, here's how you might query posts with specific tags
const listingPosts = await client.getPosts({
  tags: ['nft', 'listing', 'active'],
  pagination: 20,
  page: 1
});

// Process the listings
const listings = listingPosts.posts.map(post => post.content);
```

#### Demo Application

Explore our [NFT Marketplace Demo](https://github.com/aleph-im/nft-marketplace-demo) for a complete implementation.

### Decentralized Finance Dashboard

A DeFi dashboard that indexes and displays data from multiple protocols.

#### Key Features

- Real-time data from multiple DeFi protocols
- Historical performance tracking
- Portfolio management
- Transaction history
- Price alerts and notifications

#### Implementation Highlights

```javascript
// Define an indexer for a DeFi protocol
const defiIndexerConfig = {
  name: 'UniswapV3Indexer',
  description: 'Indexes Uniswap V3 pools and swaps',
  network: 'ethereum',
  startBlock: 12369621, // Uniswap V3 deployment block
  contracts: [
    {
      address: '0x1F98431c8aD98523631AE4a59f267346ea31F984', // Factory
      abi: [...], // Factory ABI
      events: [
        { name: 'PoolCreated', handler: 'handlePoolCreated' }
      ]
    }
  ],
  handlers: {
    handlePoolCreated: `
      async function handlePoolCreated(event, context) {
        const { token0, token1, fee, pool } = event.args;
        
        await context.store.set('pools', pool, {
          token0,
          token1,
          fee: fee.toString(),
          createdAt: event.block.timestamp,
          tvl: '0',
          volume24h: '0'
        });
      }
    `
  }
};

// Note: The Aleph TypeScript SDK doesn't currently have a direct indexer API
// This would require a custom implementation or using the REST API directly
// Below is a conceptual example of how this might work

// For demonstration purposes, we'd use the authenticated client to publish the indexer configuration
import { AuthenticatedAlephHttpClient } from '@aleph-sdk/client';
import { importAccountFromPrivateKey } from '@aleph-sdk/ethereum';

// Create an account
const account = importAccountFromPrivateKey('your_private_key');

// Create an authenticated client 
const authClient = new AuthenticatedAlephHttpClient(account);

// Publish the indexer configuration as a special message type
const result = await authClient.createPost({
  postType: 'indexer-config',
  content: defiIndexerConfig,
  channel: 'TEST',
  address: account.address,
  tags: ['indexer', 'defi', 'uniswap'],
  sync: true
});

// To query indexed data, use the REST API directly or a wrapper method
// Conceptual example:
async function queryIndexedData(indexerName, collection, query) {
  const response = await fetch(`https://api2.aleph.cloud/api/v0/indexers/${indexerName}/${collection}?${new URLSearchParams({
    sort: JSON.stringify(query.sort),
    limit: query.limit
  })}`);
  
  return await response.json();
}

// Example usage
const pools = await queryIndexedData('UniswapV3Indexer', 'pools', {
  sort: { tvl: -1 },
  limit: 10
});
```

#### Demo Application

Try our [DeFi Dashboard Demo](https://github.com/aleph-im/defi-dashboard-demo) for a complete implementation.

### Decentralized Governance Platform

A platform for decentralized autonomous organizations (DAOs) to manage proposals and voting.

#### Key Features

- Proposal creation and management
- On-chain and off-chain voting
- Member management
- Treasury tracking
- Execution of approved proposals

#### Implementation Highlights

```javascript
// Import required packages
import { AlephHttpClient, AuthenticatedAlephHttpClient } from '@aleph-sdk/client';
import { importAccountFromPrivateKey } from '@aleph-sdk/ethereum';

// Create an account
const account = importAccountFromPrivateKey('your_private_key');

// Create an authenticated client
const authClient = new AuthenticatedAlephHttpClient(account);

// Create a proposal as an aggregate
const proposal = {
  title: 'Increase Developer Fund',
  description: 'Increase the developer fund allocation from 10% to 15%',
  creator: account.address,
  options: ['Approve', 'Reject'],
  startTime: Date.now(),
  endTime: Date.now() + (7 * 24 * 60 * 60 * 1000), // 1 week
  status: 'active'
};

const proposalId = `proposal-${Date.now()}`;
const proposalResult = await authClient.createAggregate({
  key: proposalId,
  content: proposal,
  channel: 'TEST',
  address: account.address,
  sync: true
});

// Cast a vote as a post
const voteResult = await authClient.createPost({
  postType: 'dao-vote',
  content: {
    proposalId: proposalId,
    option: 'Approve',
    voter: account.address,
    timestamp: Date.now()
  },
  channel: 'TEST',
  address: account.address,
  tags: ['vote', 'dao', proposalId],
  sync: true
});

// Create a read client
const client = new AlephHttpClient();

// To find active proposals (simplified approach):
// 1. Find accounts with proposal aggregates
// 2. Fetch and filter proposals

// Example approach to find votes for a proposal
const votes = await client.getPosts({
  tags: ['vote', 'dao', proposalId],
  pagination: 100,
  page: 1
});

// Process the votes
const processedVotes = votes.posts.map(post => post.content);
console.log(`Found ${processedVotes.length} votes for proposal ${proposalId}`);
```

#### Demo Application

Check out our [DAO Governance Demo](https://github.com/aleph-im/dao-demo) for a complete implementation.

## Building Your Own Web3 Application

Follow these steps to build your own web3 application with Aleph Cloud:

1. **Set up your development environment**:
   ```bash
   # Create a new React application
   npx create-react-app my-web3-app
   cd my-web3-app
   
   # Install Aleph Cloud SDK and other dependencies
   npm install @aleph-sdk/client ethers @web3-react/core @web3-react/injected-connector
   ```

2. **Initialize Aleph Cloud client**:
   ```typescript
   import { AlephHttpClient, AuthenticatedAlephHttpClient } from '@aleph-sdk/client';
   import { getAccountFromProvider } from '@aleph-sdk/ethereum';
   
   // Create an unauthenticated client for reading data
   const client = new AlephHttpClient();
   ```

3. **Implement wallet connection**:
   ```javascript
   import { InjectedConnector } from '@web3-react/injected-connector';
   import { useWeb3React } from '@web3-react/core';
   
   // Configure connector
   const injected = new InjectedConnector({
     supportedChainIds: [1, 137, 56, 43114]
   });
   
   function ConnectButton() {
     const { activate, account } = useWeb3React();
     
     const connect = async () => {
       try {
         await activate(injected);
       } catch (error) {
         console.error('Connection error:', error);
       }
     };
     
     return (
       <button onClick={connect}>
         {account ? `Connected: ${account.substring(0, 6)}...${account.substring(38)}` : 'Connect Wallet'}
       </button>
     );
   }
   ```

4. **Store data on Aleph Cloud**:
   ```typescript
   import { AlephHttpClient } from '@aleph-sdk/client';
   import { ETHAccount } from '@aleph-sdk/core';
   import { useWeb3React } from '@web3-react/core';
   
   function DataStorage() {
     const { account, library } = useWeb3React();
     const [message, setMessage] = useState('');
     const [status, setStatus] = useState('');
     
     const storeData = async () => {
       if (!account || !library || !message) return;
       
       try {
         setStatus('Connecting to Aleph Cloud...');
         
         // Initialize Aleph Cloud client
         const aleph = new AlephHttpClient();
         const account = await getAccountFromProvider(library.provider);
         
         // Create an authenticated client
         const authClient = new AuthenticatedAlephHttpClient(account);
         
         setStatus('Storing data...');
         
         // Store the message
         const result = await authClient.createPost({
           postType: 'user-message',
           content: { text: message },
           channel: 'TEST',
           address: account.address,
           tags: ['example', 'web3-app'],
           sync: true
         });
         
         setStatus(`Data stored successfully! Hash: ${result.item_hash}`);
         setMessage('');
       } catch (error) {
         console.error('Storage error:', error);
         setStatus(`Error: ${error.message}`);
       }
     };
     
     return (
       <div>
         <input
           type="text"
           value={message}
           onChange={(e) => setMessage(e.target.value)}
           placeholder="Enter a message"
         />
         <button onClick={storeData} disabled={!account || !message}>Store Data</button>
         <p>{status}</p>
       </div>
     );
   }
   ```

5. **Query data from Aleph Cloud**:
   ```javascript
   function DataRetrieval() {
     const [hash, setHash] = useState('');
     const [data, setData] = useState(null);
     const [loading, setLoading] = useState(false);
     
     const fetchData = async () => {
       if (!hash) return;
       
       try {
         setLoading(true);
         
         // Create Aleph client for reading
         const client = new AlephHttpClient();
         
         // Retrieve the message
         const message = await client.getPost({
           hash: hash
         });
         
         setData(message.content);
       } catch (error) {
         console.error('Retrieval error:', error);
         setData(null);
       } finally {
         setLoading(false);
       }
     };
     
     return (
       <div>
         <input
           type="text"
           value={hash}
           onChange={(e) => setHash(e.target.value)}
           placeholder="Enter message hash"
         />
         <button onClick={fetchData} disabled={!hash}>Fetch Data</button>
         
         {loading && <p>Loading...</p>}
         
         {data && (
           <div>
             <h3>Retrieved Data:</h3>
             <pre>{JSON.stringify(data, null, 2)}</pre>
           </div>
         )}
       </div>
     );
   }
   ```

## Resources

- [Aleph Cloud JavaScript SDK](/devhub/sdks-and-tools/typescript-sdk/)
- [Aleph Cloud Python SDK](/devhub/sdks-and-tools/python-sdk/)
- [API Reference](/devhub/api/rest)
- [Storage Guide](/devhub/building-applications/data-storage/getting-started)
- [Indexing Guide](/devhub/building-applications/blockchain-data/indexing)
- [Authentication Guide](/devhub/building-applications/authentication/)

## Community and Support

- [GitHub](https://github.com/aleph-im)
- [Discord](https://discord.com/invite/alephcloud)
- [Telegram](https://t.me/alephcloud)
- [Twitter](https://twitter.com/aleph_im)

Join our community to share your projects, get help, and collaborate with other developers building on Aleph Cloud!
