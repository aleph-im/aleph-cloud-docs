# NFT Integration Examples

This section provides practical examples of integrating Aleph Cloud with NFT (Non-Fungible Token) projects. These examples demonstrate how to leverage Aleph Cloud's decentralized storage, indexing, and computing capabilities to enhance NFT applications.

## Overview

NFT applications built on Aleph Cloud benefit from:

- **Permanent Metadata Storage**: Store NFT metadata permanently and immutably
- **Decentralized Media Storage**: Store NFT images, videos, and other assets
- **Efficient Indexing**: Index NFT transfers, sales, and other events
- **Cross-Chain Compatibility**: Support for multiple blockchains
- **Scalable Infrastructure**: Handle high-volume NFT collections

## Example Projects

### NFT Metadata Storage

Store NFT metadata permanently on Aleph Cloud, ensuring it remains accessible even if centralized services go offline.

#### Key Features

- Permanent, immutable metadata storage
- Content-addressable storage
- IPFS compatibility
- Metadata versioning
- Bulk upload capabilities

#### Implementation Highlights

```javascript
// Import required packages
import { AuthenticatedAlephHttpClient } from '@aleph-sdk/client';
import { importAccountFromPrivateKey } from '@aleph-sdk/ethereum';

// Store NFT metadata for a single token
const storeNFTMetadata = async (tokenId, metadata, privateKey) => {
  try {
    // Add timestamp for versioning
    const metadataWithTimestamp = {
      ...metadata,
      updated_at: Date.now()
    };

    // Create an account and authenticated client
    const account = importAccountFromPrivateKey(privateKey);
    const authClient = new AuthenticatedAlephHttpClient(account);

    // Store the metadata on Aleph Cloud
    const result = await authClient.createPost({
      postType: 'nft-metadata',
      content: metadataWithTimestamp,
      channel: 'TEST',
      address: account.address,
      tags: ['nft', 'metadata', `token-${tokenId}`],
      sync: true
    });

    console.log(`Metadata stored with hash: ${result.item_hash}`);

    // Return the IPFS-compatible CID
    return result.item_hash;
  } catch (error) {
    console.error('Error storing NFT metadata:', error);
    throw error;
  }
};

// Example metadata
const metadata = {
  name: "Cosmic Explorer #42",
  description: "A rare cosmic explorer from the Aleph universe",
  image: "ipfs://QmImageHash123",
  attributes: [
    { trait_type: "Background", value: "Nebula" },
    { trait_type: "Suit", value: "Gold" },
    { trait_type: "Helmet", value: "Crystal" },
    { trait_type: "Tool", value: "Scanner" }
  ]
};

// Store the metadata
const metadataCID = await storeNFTMetadata(42, metadata, account);

// The metadata can now be accessed via:
// https://api1.aleph.im/api/v0/storage/raw/${metadataCID}
// or via IPFS gateway:
// https://ipfs.io/ipfs/${metadataCID}
```

#### Bulk Upload Example

```javascript
// Bulk upload metadata for a collection
const bulkUploadMetadata = async (metadataArray, privateKey) => {
  const results = [];

  // Create an account and authenticated client
  const account = importAccountFromPrivateKey(privateKey);
  const authClient = new AuthenticatedAlephHttpClient(account);

  for (let i = 0; i < metadataArray.length; i++) {
    const { tokenId, metadata } = metadataArray[i];

    try {
      // Store metadata with token ID in tags
      const result = await authClient.createPost({
        postType: 'nft-metadata',
        content: metadata,
        channel: 'TEST',
        address: account.address,
        tags: ['nft', 'metadata', 'bulk-upload', `token-${tokenId}`],
        sync: true
      });

      results.push({
        tokenId,
        success: true,
        hash: result.item_hash
      });

      console.log(`Processed ${i + 1}/${metadataArray.length}: Token #${tokenId}`);
    } catch (error) {
      results.push({
        tokenId,
        success: false,
        error: error.message
      });

      console.error(`Error processing token #${tokenId}:`, error);
    }
  }

  return results;
};
```

#### Retrieving Metadata

```javascript
// Import AlephHttpClient for reading data
import { AlephHttpClient } from '@aleph-sdk/client';

// Create an unauthenticated client for reading
const client = new AlephHttpClient();

// Retrieve NFT metadata by CID
const getMetadataByCID = async (cid) => {
  try {
    const message = await client.getPost({
      hash: cid
    });
    return message.content;
  } catch (error) {
    console.error('Error retrieving metadata:', error);
    throw error;
  }
};

// Retrieve latest metadata by token ID
const getLatestMetadataByTokenId = async (tokenId) => {
  try {
    // Query for messages with the token ID tag
    const messages = await client.getPosts({
      tags: [`token-${tokenId}`],
      pagination: 1,
      page: 1
    });

    if (messages.posts.length === 0) {
      throw new Error(`No metadata found for token #${tokenId}`);
    }

    // Return the most recent metadata
    return messages.posts[0].content;
  } catch (error) {
    console.error('Error retrieving latest metadata:', error);
    throw error;
  }
};
```

### NFT Media Storage

Store NFT images, videos, and other assets permanently on Aleph Cloud.

#### Key Features

- Support for various file types (images, videos, 3D models)
- Content-addressable storage
- High availability
- Permanent storage
- IPFS compatibility

#### Implementation Highlights

```javascript
// Import required packages
import { AuthenticatedAlephHttpClient } from '@aleph-sdk/client';
import { importAccountFromPrivateKey } from '@aleph-sdk/ethereum';

// Store an image file for an NFT
const storeNFTImage = async (file, tokenId, privateKey) => {
  try {
    // Create an account and authenticated client
    const account = importAccountFromPrivateKey(privateKey);
    const authClient = new AuthenticatedAlephHttpClient(account);

    // Convert file to Uint8Array
    const fileContent = await file.arrayBuffer();

    // Store the file on Aleph Cloud
    const result = await authClient.createStore({
      fileContent: new Uint8Array(fileContent),
      channel: 'TEST',
      tags: ['nft', 'image', `token-${tokenId}`],
      sync: true
    });

    console.log(`Image stored with hash: ${result.item_hash}`);

    // Return the IPFS-compatible CID
    return result.item_hash;
  } catch (error) {
    console.error('Error storing NFT image:', error);
    throw error;
  }
};

// Example usage with file input
const fileInput = document.getElementById('imageUpload');
fileInput.addEventListener('change', async (event) => {
  const file = event.target.files[0];
  const tokenId = document.getElementById('tokenId').value;
  const privateKey = 'your_private_key'; // In a real app, this would be securely managed

  if (file && tokenId) {
    try {
      const imageCID = await storeNFTImage(file, tokenId, privateKey);

      // Update UI with the image URL
      const imageUrl = `https://api2.aleph.im/api/v0/storage/raw/${imageCID}`;
      document.getElementById('previewImage').src = imageUrl;
      document.getElementById('imageCID').textContent = imageCID;
    } catch (error) {
      console.error('Upload failed:', error);
      alert('Failed to upload image: ' + error.message);
    }
  }
});
```

#### Storing Different Media Types

```javascript
// Import required packages
import { AuthenticatedAlephHttpClient } from '@aleph-sdk/client';
import { importAccountFromPrivateKey } from '@aleph-sdk/ethereum';

// Store a video file for an NFT
const storeNFTVideo = async (file, tokenId, privateKey) => {
  try {
    // Create an account and authenticated client
    const account = importAccountFromPrivateKey(privateKey);
    const authClient = new AuthenticatedAlephHttpClient(account);

    // Convert file to Uint8Array
    const fileContent = await file.arrayBuffer();

    // Store the file on Aleph Cloud
    const result = await authClient.createStore({
      fileContent: new Uint8Array(fileContent),
      channel: 'TEST',
      tags: ['nft', 'video', `token-${tokenId}`],
      sync: true
    });

    console.log(`Video stored with hash: ${result.item_hash}`);

    // Return the IPFS-compatible CID
    return result.item_hash;
  } catch (error) {
    console.error('Error storing NFT video:', error);
    throw error;
  }
};

// Store a 3D model for an NFT
const storeNFT3DModel = async (file, tokenId, privateKey) => {
  try {
    // Create an account and authenticated client
    const account = importAccountFromPrivateKey(privateKey);
    const authClient = new AuthenticatedAlephHttpClient(account);

    // Convert file to Uint8Array
    const fileContent = await file.arrayBuffer();

    // Store the file on Aleph Cloud
    const result = await authClient.createStore({
      fileContent: new Uint8Array(fileContent),
      channel: 'TEST',
      tags: ['nft', '3d-model', `token-${tokenId}`],
      sync: true
    });

    console.log(`3D model stored with hash: ${result.item_hash}`);

    // Return the IPFS-compatible CID
    return result.item_hash;
  } catch (error) {
    console.error('Error storing NFT 3D model:', error);
    throw error;
  }
};
```

### NFT Collection Indexer

Index NFT mints, transfers, and sales to provide comprehensive collection analytics.

#### Key Features

- Real-time tracking of NFT events
- Collection statistics
- Ownership history
- Price history
- Trait rarity analysis

#### Implementation Highlights

```javascript
// Define an indexer for an NFT collection
const nftIndexerConfig = {
  name: 'NFTCollectionIndexer',
  description: 'Indexes events for an NFT collection',
  network: 'ethereum',
  startBlock: 12000000, // Collection deployment block
  contracts: [
    {
      // NFT contract
      address: '0xNFTContractAddress',
      abi: [...], // NFT contract ABI
      events: [
        { name: 'Transfer', handler: 'handleTransfer' },
        { name: 'Approval', handler: 'handleApproval' }
      ]
    },
    {
      // Marketplace contract
      address: '0xMarketplaceAddress',
      abi: [...], // Marketplace ABI
      events: [
        { name: 'Sale', handler: 'handleSale' },
        { name: 'Listing', handler: 'handleListing' }
      ]
    }
  ],
  handlers: {
    handleTransfer: `
      async function handleTransfer(event, context) {
        const { from, to, tokenId } = event.args;

        // Store the transfer event
        await context.store.set('transfers', event.transactionHash + '-' + event.logIndex, {
          tokenId: tokenId.toString(),
          from,
          to,
          timestamp: event.block.timestamp,
          blockNumber: event.blockNumber
        });

        // Update token ownership
        await context.store.set('tokens', tokenId.toString(), {
          tokenId: tokenId.toString(),
          owner: to,
          lastTransferAt: event.block.timestamp,
          transferCount: await incrementTransferCount(context, tokenId.toString())
        });

        // Update owner's token count
        if (from !== '0x0000000000000000000000000000000000000000') {
          await updateOwnerTokenCount(context, from, 'decrease');
        }

        if (to !== '0x0000000000000000000000000000000000000000') {
          await updateOwnerTokenCount(context, to, 'increase');
        }

        // Update collection statistics
        await updateCollectionStats(context);
      }
    `,
    handleSale: `
      async function handleSale(event, context) {
        const { tokenId, seller, buyer, price } = event.args;

        // Store the sale event
        await context.store.set('sales', event.transactionHash, {
          tokenId: tokenId.toString(),
          seller,
          buyer,
          price: price.toString(),
          timestamp: event.block.timestamp,
          blockNumber: event.blockNumber
        });

        // Update token's sale history
        const token = await context.store.get('tokens', tokenId.toString()) || {
          tokenId: tokenId.toString(),
          owner: buyer,
          lastTransferAt: event.block.timestamp,
          transferCount: 1,
          salesCount: 0,
          lastSalePrice: '0'
        };

        await context.store.set('tokens', tokenId.toString(), {
          ...token,
          lastSalePrice: price.toString(),
          lastSaleAt: event.block.timestamp,
          salesCount: (token.salesCount || 0) + 1
        });

        // Update collection price statistics
        await updatePriceStats(context, price.toString());
      }
    `,
    // Helper functions
    incrementTransferCount: `
      async function incrementTransferCount(context, tokenId) {
        const token = await context.store.get('tokens', tokenId) || { transferCount: 0 };
        return (token.transferCount || 0) + 1;
      }
    `,
    updateOwnerTokenCount: `
      async function updateOwnerTokenCount(context, owner, action) {
        const ownerData = await context.store.get('owners', owner) || { tokenCount: 0 };

        let newCount = ownerData.tokenCount || 0;
        if (action === 'increase') {
          newCount += 1;
        } else if (action === 'decrease') {
          newCount = Math.max(0, newCount - 1);
        }

        await context.store.set('owners', owner, {
          address: owner,
          tokenCount: newCount,
          lastUpdated: context.block.timestamp
        });
      }
    `,
    updateCollectionStats: `
      async function updateCollectionStats(context) {
        // Get current stats
        const stats = await context.store.get('stats', 'collection') || {
          totalSupply: 0,
          totalOwners: 0,
          totalTransfers: 0,
          totalSales: 0,
          floorPrice: '0',
          volumeTraded: '0'
        };

        // Count unique owners
        const owners = await context.store.query('owners', {
          where: { tokenCount: { $gt: 0 } }
        });

        // Update stats
        await context.store.set('stats', 'collection', {
          ...stats,
          totalOwners: owners.length,
          totalTransfers: stats.totalTransfers + 1,
          lastUpdated: context.block.timestamp
        });
      }
    `,
    updatePriceStats: `
      async function updatePriceStats(context, price) {
        // Get current stats
        const stats = await context.store.get('stats', 'collection') || {
          totalSupply: 0,
          totalOwners: 0,
          totalTransfers: 0,
          totalSales: 0,
          floorPrice: '0',
          volumeTraded: '0'
        };

        // Update stats
        await context.store.set('stats', 'collection', {
          ...stats,
          totalSales: stats.totalSales + 1,
          volumeTraded: (BigInt(stats.volumeTraded) + BigInt(price)).toString(),
          lastSalePrice: price,
          lastSaleAt: context.block.timestamp
        });

        // Update floor price if needed
        if (stats.floorPrice === '0' || BigInt(price) < BigInt(stats.floorPrice)) {
          stats.floorPrice = price;
        }
      }
    `
  }
};

// Note: The Aleph TypeScript SDK doesn't currently have a direct indexer API
// This would require a custom implementation or using the REST API directly
// Below is a conceptual example of how you might publish an indexer configuration

// Import required packages
import { AuthenticatedAlephHttpClient } from '@aleph-sdk/client';
import { importAccountFromPrivateKey } from '@aleph-sdk/ethereum';

// Create an account
const account = importAccountFromPrivateKey('your_private_key');

// Create an authenticated client
const authClient = new AuthenticatedAlephHttpClient(account);

// Publish the indexer configuration as a special message type
const result = await authClient.createPost({
  postType: 'indexer-config',
  content: nftIndexerConfig,
  channel: 'TEST',
  address: account.address,
  tags: ['indexer', 'nft-collection'],
  sync: true
});
```

#### Querying Indexed Data

```javascript
// Since the TypeScript SDK doesn't have direct indexer API,
// below are conceptual examples using direct REST API calls

// Helper function for indexed data queries
async function queryIndexedData(indexer, collection, query = {}) {
  const queryParams = new URLSearchParams();

  if (query.where) queryParams.append('where', JSON.stringify(query.where));
  if (query.sort) queryParams.append('sort', JSON.stringify(query.sort));
  if (query.limit) queryParams.append('limit', query.limit.toString());
  if (query.offset) queryParams.append('offset', query.offset.toString());

  const response = await fetch(
    `https://api2.aleph.im/api/v0/indexers/${indexer}/${collection}?${queryParams}`
  );

  if (!response.ok) {
    throw new Error(`API error: ${response.status} ${response.statusText}`);
  }

  return await response.json();
}

// Helper function to get a specific indexed item
async function getIndexedItem(indexer, collection, key) {
  const response = await fetch(
    `https://api2.aleph.im/api/v0/indexers/${indexer}/${collection}/${key}`
  );

  if (!response.ok) {
    throw new Error(`API error: ${response.status} ${response.statusText}`);
  }

  return await response.json();
}

// Get token details
const getTokenDetails = async (tokenId) => {
  try {
    const token = await getIndexedItem(
      'NFTCollectionIndexer',
      'tokens',
      tokenId.toString()
    );

    return token;
  } catch (error) {
    console.error(`Error retrieving token #${tokenId}:`, error);
    throw error;
  }
};

// Get token transfer history
const getTokenTransfers = async (tokenId) => {
  try {
    const transfers = await queryIndexedData(
      'NFTCollectionIndexer',
      'transfers',
      {
        where: { tokenId: tokenId.toString() },
        sort: { timestamp: -1 },
        limit: 10
      }
    );

    return transfers;
  } catch (error) {
    console.error(`Error retrieving transfers for token #${tokenId}:`, error);
    throw error;
  }
};

// Get collection statistics
const getCollectionStats = async () => {
  try {
    const stats = await getIndexedItem(
      'NFTCollectionIndexer',
      'stats',
      'collection'
    );

    return stats;
  } catch (error) {
    console.error('Error retrieving collection stats:', error);
    throw error;
  }
};

// Get top owners
const getTopOwners = async (limit = 10) => {
  try {
    const owners = await queryIndexedData(
      'NFTCollectionIndexer',
      'owners',
      {
        sort: { tokenCount: -1 },
        limit
      }
    );

    return owners;
  } catch (error) {
    console.error('Error retrieving top owners:', error);
    throw error;
  }
};
```

### NFT Marketplace

A decentralized marketplace for buying and selling NFTs with metadata stored on Aleph Cloud.

#### Key Features

- Decentralized listings
- Secure transactions
- Metadata permanence
- Search and discovery
- Multi-chain support

#### Implementation Highlights

```javascript
// Import required packages
import { AlephHttpClient, AuthenticatedAlephHttpClient } from '@aleph-sdk/client';
import { importAccountFromPrivateKey } from '@aleph-sdk/ethereum';

// Create a marketplace listing
const createListing = async (tokenId, price, privateKey) => {
  try {
    // Create an account and authenticated client
    const account = importAccountFromPrivateKey(privateKey);
    const authClient = new AuthenticatedAlephHttpClient(account);

    // Store the listing as an aggregate
    const result = await authClient.createAggregate({
      key: `listing-${tokenId}`,
      content: {
        tokenId: tokenId.toString(),
        seller: account.address,
        price: price.toString(),
        currency: 'ETH',
        active: true,
        createdAt: Date.now()
      },
      channel: 'TEST',
      address: account.address,
      sync: true
    });

    console.log(`Listing created for token #${tokenId}`);
    return result;
  } catch (error) {
    console.error('Error creating listing:', error);
    throw error;
  }
};

// Update a listing by creating a new aggregate with updated content
const updateListing = async (tokenId, newPrice, privateKey) => {
  try {
    // Create an account and authenticated client
    const account = importAccountFromPrivateKey(privateKey);
    const authClient = new AuthenticatedAlephHttpClient(account);
    const client = new AlephHttpClient();

    // Get the current listing
    const currentListing = await client.fetchAggregate(account.address, `listing-${tokenId}`);

    // Create an updated listing as a new aggregate with the same key
    const result = await authClient.createAggregate({
      key: `listing-${tokenId}`,
      content: {
        ...currentListing,
        price: newPrice.toString(),
        updatedAt: Date.now()
      },
      channel: 'TEST',
      address: account.address,
      sync: true
    });

    console.log(`Listing updated for token #${tokenId}`);
    return result;
  } catch (error) {
    console.error('Error updating listing:', error);
    throw error;
  }
};

// Cancel a listing by updating it to inactive
const cancelListing = async (tokenId, privateKey) => {
  try {
    // Create an account and authenticated client
    const account = importAccountFromPrivateKey(privateKey);
    const authClient = new AuthenticatedAlephHttpClient(account);
    const client = new AlephHttpClient();

    // Get the current listing
    const currentListing = await client.fetchAggregate(account.address, `listing-${tokenId}`);

    // Create an updated inactive listing
    const result = await authClient.createAggregate({
      key: `listing-${tokenId}`,
      content: {
        ...currentListing,
        active: false,
        cancelledAt: Date.now()
      },
      channel: 'TEST',
      address: account.address,
      sync: true
    });

    console.log(`Listing cancelled for token #${tokenId}`);
    return result;
  } catch (error) {
    console.error('Error cancelling listing:', error);
    throw error;
  }
};

// Record a sale
const recordSale = async (tokenId, buyer, price, privateKey) => {
  try {
    // Create an account and authenticated client
    const account = importAccountFromPrivateKey(privateKey);
    const authClient = new AuthenticatedAlephHttpClient(account);
    const client = new AlephHttpClient();

    // Store the sale as a post
    const saleResult = await authClient.createPost({
      postType: 'nft-sale',
      content: {
        tokenId: tokenId.toString(),
        seller: account.address,
        buyer,
        price: price.toString(),
        currency: 'ETH',
        timestamp: Date.now()
      },
      channel: 'TEST',
      address: account.address,
      tags: ['nft', 'sale', `token-${tokenId}`],
      sync: true
    });

    // Get the current listing
    const currentListing = await client.fetchAggregate(account.address, `listing-${tokenId}`);

    // Update the listing to inactive
    await authClient.createAggregate({
      key: `listing-${tokenId}`,
      content: {
        ...currentListing,
        active: false,
        soldAt: Date.now(),
        buyer
      },
      channel: 'TEST',
      address: account.address,
      sync: true
    });

    console.log(`Sale recorded for token #${tokenId}`);
    return saleResult;
  } catch (error) {
    console.error('Error recording sale:', error);
    throw error;
  }
};
```

#### Querying Marketplace Data

```javascript
// Import AlephHttpClient for reading data
import { AlephHttpClient } from '@aleph-sdk/client';

// Create an unauthenticated client for reading
const client = new AlephHttpClient();

// Finding active listings requires a different approach with the new SDK
// We'll need to:
// 1. Get accounts with nft-listings aggregates
// 2. Fetch and filter the active ones

// Get listing for a specific token
const getTokenListing = async (sellerAddress, tokenId) => {
  try {
    const listing = await client.fetchAggregate(sellerAddress, `listing-${tokenId}`);
    return listing;
  } catch (error) {
    console.error(`Error retrieving listing for token #${tokenId}:`, error);
    throw error;
  }
};

// Get listings by tag
// Note: This is a simplified approach - in a real application,
// you would need a more sophisticated indexing solution
const getListingsByTag = async (tag, limit = 20) => {
  try {
    // Search for posts with the appropriate tag
    const listingPosts = await client.getPosts({
      tags: ['nft', 'listing', tag],
      pagination: limit,
      page: 1
    });

    // For each post, try to fetch the actual listing aggregate
    // This is a simplified example
    const listings = [];
    for (const post of listingPosts.posts) {
      try {
        const sellerAddress = post.sender;
        const tokenId = post.content.tokenId;
        const listing = await client.fetchAggregate(sellerAddress, `listing-${tokenId}`);
        if (listing && listing.active) {
          listings.push({
            ...listing,
            sellerAddress
          });
        }
      } catch (err) {
        console.error('Error fetching individual listing:', err);
      }
    }

    return listings;
  } catch (error) {
    console.error('Error retrieving listings:', error);
    throw error;
  }
};

// Get active listings - simplified example
const getActiveListings = async (limit = 20) => {
  return await getListingsByTag('active', limit);
};

// Get sales history
const getSalesHistory = async (limit = 20) => {
  try {
    const salesPosts = await client.getPosts({
      tags: ['nft', 'sale'],
      pagination: limit,
      page: 1
    });

    return salesPosts.posts.map(post => post.content);
  } catch (error) {
    console.error('Error retrieving sales history:', error);
    throw error;
  }
};
```

## Building Your Own NFT Application

Follow these steps to build your own NFT application with Aleph Cloud:

1. **Set up your development environment**:
   ```bash
   # Create a new React application
   npx create-react-app my-nft-app
   cd my-nft-app

   # Install Aleph Cloud SDK and other dependencies
   npm install @aleph-sdk/client @aleph-sdk/core ethers @web3-react/core @web3-react/injected-connector
   ```

2. **Initialize Aleph Cloud client**:
   ```typescript
   import { AlephHttpClient, AuthenticatedAlephHttpClient } from '@aleph-sdk/client';
   import { importAccountFromPrivateKey, getAccountFromProvider } from '@aleph-sdk/ethereum';

   // Create a client for reading data
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

4. **Create an NFT metadata upload component**:
   ```typescript
   import { useState } from 'react';
   import { useWeb3React } from '@web3-react/core';
   import { AuthenticatedAlephHttpClient } from '@aleph-sdk/client';

   function NFTUploader() {
     const { account, library } = useWeb3React();
     const [file, setFile] = useState(null);
     const [metadata, setMetadata] = useState({
       name: '',
       description: '',
       attributes: []
     });
     const [status, setStatus] = useState('');

     const handleFileChange = (e) => {
       setFile(e.target.files[0]);
     };

     const handleMetadataChange = (e) => {
       setMetadata({
         ...metadata,
         [e.target.name]: e.target.value
       });
     };

     const handleAttributeChange = (index, key, value) => {
       const updatedAttributes = [...metadata.attributes];
       updatedAttributes[index] = {
         ...updatedAttributes[index],
         [key]: value
       };

       setMetadata({
         ...metadata,
         attributes: updatedAttributes
       });
     };

     const addAttribute = () => {
       setMetadata({
         ...metadata,
         attributes: [
           ...metadata.attributes,
           { trait_type: '', value: '' }
         ]
       });
     };

     const uploadNFT = async () => {
       if (!account || !library || !file || !metadata.name) {
         setStatus('Please connect wallet and fill all required fields');
         return;
       }

       try {
         setStatus('Connecting to Aleph Cloud...');

         // Create an Aleph account from Web3 provider
         const account = await getAccountFromProvider(library.provider);

         // Create an authenticated client
         const authClient = new AuthenticatedAlephHttpClient(account);

         setStatus('Uploading image...');

         // Convert file to Uint8Array
         const fileContent = await file.arrayBuffer();

         // Upload the image
         const imageResult = await authClient.createStore({
           fileContent: new Uint8Array(fileContent),
           channel: 'TEST',
           tags: ['nft', 'image'],
           sync: true
         });

         setStatus('Storing metadata...');

         // Create the full metadata
         const fullMetadata = {
           ...metadata,
           image: `ipfs://${imageResult.item_hash}`,
           created_at: Date.now()
         };

         // Store the metadata
         const metadataResult = await authClient.createPost({
           postType: 'nft-metadata',
           content: fullMetadata,
           channel: 'TEST',
           address: account.address,
           tags: ['nft', 'metadata'],
           sync: true
         });

         setStatus(`NFT created successfully! Metadata CID: ${metadataResult.item_hash}`);
       } catch (error) {
         console.error('Upload error:', error);
         setStatus(`Error: ${error.message}`);
       }
     };

     return (
       <div>
         <h2>Create NFT</h2>

         <div>
           <label>Name:</label>
           <input
             type="text"
             name="name"
             value={metadata.name}
             onChange={handleMetadataChange}
           />
         </div>

         <div>
           <label>Description:</label>
           <textarea
             name="description"
             value={metadata.description}
             onChange={handleMetadataChange}
           />
         </div>

         <div>
           <label>Image:</label>
           <input
             type="file"
             accept="image/*"
             onChange={handleFileChange}
           />
         </div>

         <div>
           <h3>Attributes</h3>
           {metadata.attributes.map((attr, index) => (
             <div key={index}>
               <input
                 type="text"
                 placeholder="Trait Type"
                 value={attr.trait_type}
                 onChange={(e) => handleAttributeChange(index, 'trait_type', e.target.value)}
               />
               <input
                 type="text"
                 placeholder="Value"
                 value={attr.value}
                 onChange={(e) => handleAttributeChange(index, 'value', e.target.value)}
               />
             </div>
           ))}
           <button onClick={addAttribute}>Add Attribute</button>
         </div>

         <button onClick={uploadNFT} disabled={!account || !file || !metadata.name}>
           Create NFT
         </button>

         <p>{status}</p>
       </div>
     );
   }
   ```

## Resources

- [Aleph Cloud JavaScript SDK](/devhub/sdks-and-tools/typescript-sdk/)
- [Aleph Cloud Python SDK](/devhub/sdks-and-tools/python-sdk/)
- [API Reference](/devhub/api/rest)
- [Storage Guide](/devhub/building-applications/data-storage/getting-started)
- [Indexing Guide](/devhub/building-applications/blockchain-data/indexing/)
- [Authentication Guide](/devhub/building-applications/authentication/)

## Community and Support

- [GitHub](https://github.com/aleph-im)
- [Discord](https://discord.com/invite/alephcloud)
- [Telegram](https://t.me/alephcloud)
- [Twitter](https://twitter.com/aleph_im)

Join our community to share your NFT projects, get help, and collaborate with other developers building on Aleph Cloud!
