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
// Store a user profile
const profileResult = await aleph.aggregate.create(
  'profiles',
  {
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
  { account, key: 'satoshi' }
);

// Create a post
const postResult = await aleph.storage.store(
  {
    content: 'Hello, decentralized world!',
    timestamp: Date.now(),
    attachments: ['QmImageHash123']
  },
  { account, tags: ['post', 'social'] }
);

// Store an image
const fileInput = document.getElementById('imageUpload');
const file = fileInput.files[0];
const fileResult = await aleph.storage.storeFile(
  file,
  { account, tags: ['image', 'social'] }
);
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

const result = await aleph.storage.store(
  nftMetadata,
  { account, tags: ['nft', 'metadata', 'cosmic-creatures'] }
);

// Create a marketplace listing
const listingResult = await aleph.aggregate.create(
  'nft-listings',
  {
    tokenId: '123',
    collection: '0xCollectionAddress',
    seller: account.address,
    price: '1000000000000000000', // 1 ETH in wei
    currency: '0xETHAddress',
    active: true,
    createdAt: Date.now()
  },
  { account, key: `listing-${Date.now()}` }
);

// Query active listings
const listings = await aleph.aggregate.query('nft-listings', {
  where: { active: true },
  sort: { createdAt: -1 },
  limit: 20
});
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

// Create the indexer
const result = await aleph.indexer.create(defiIndexerConfig, { account });

// Query indexed data
const pools = await aleph.indexer.query(
  'UniswapV3Indexer',
  'pools',
  {
    sort: { tvl: -1 },
    limit: 10
  }
);
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
// Create a proposal
const proposalResult = await aleph.aggregate.create(
  'dao-proposals',
  {
    title: 'Increase Developer Fund',
    description: 'Increase the developer fund allocation from 10% to 15%',
    creator: account.address,
    options: ['Approve', 'Reject'],
    startTime: Date.now(),
    endTime: Date.now() + (7 * 24 * 60 * 60 * 1000), // 1 week
    status: 'active'
  },
  { account, key: `proposal-${Date.now()}` }
);

// Cast a vote
const voteResult = await aleph.storage.store(
  {
    proposalId: proposalResult.key,
    option: 'Approve',
    voter: account.address,
    timestamp: Date.now()
  },
  { account, tags: ['vote', 'dao', proposalResult.key] }
);

// Query proposals
const activeProposals = await aleph.aggregate.query('dao-proposals', {
  where: { 
    status: 'active',
    endTime: { $gt: Date.now() }
  },
  sort: { endTime: 1 },
  limit: 10
});
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
   import { AlephHttpClient } from '@aleph-sdk/client';
   import { ETHAccount } from '@aleph-sdk/core';
   
   // Create a client instance
   const aleph = new AlephHttpClient();
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
         
         // Create Aleph account from Web3 provider
         const aleph = new AlephHttpClient();
         const alephAccount = await aleph.ethereum.from_provider(library.provider);
         
         setStatus('Storing data...');
         
         // Store the message
         const result = await aleph.storage.store(
           { content: message },
           { account: alephAccount, tags: ['example', 'web3-app'] }
         );
         
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
         
         // Create Aleph client
         const aleph = new AlephHttpClient();
         
         // Retrieve the message
         const message = await aleph.storage.get(hash);
         
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

- [Aleph Cloud JavaScript SDK](/devhub/sdks/typescript/)
- [Aleph Cloud Python SDK](/devhub/sdks/python/)
- [API Reference](/devhub/api/rest/)
- [GraphQL API Documentation](/devhub/api/graphql/)
- [Storage Guide](/devhub/guides/storage/)
- [Indexing Guide](/devhub/guides/indexing/)
- [Authentication Guide](/devhub/guides/authentication/)

## Community and Support

- [GitHub](https://github.com/aleph-im)
- [Discord](https://discord.gg/aleph-im)
- [Telegram](https://t.me/alephim)
- [Twitter](https://twitter.com/aleph_im)

Join our community to share your projects, get help, and collaborate with other developers building on Aleph Cloud!
