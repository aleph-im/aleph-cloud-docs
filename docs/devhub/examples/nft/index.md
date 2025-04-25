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
// Store NFT metadata for a single token
const storeNFTMetadata = async (tokenId, metadata, account) => {
  try {
    // Add timestamp for versioning
    const metadataWithTimestamp = {
      ...metadata,
      updated_at: Date.now()
    };
    
    // Store the metadata on Aleph Cloud
    const result = await aleph.storage.store(
      metadataWithTimestamp,
      { 
        account,
        tags: ['nft', 'metadata', `token-${tokenId}`]
      }
    );
    
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
const bulkUploadMetadata = async (metadataArray, account) => {
  const results = [];
  
  for (let i = 0; i < metadataArray.length; i++) {
    const { tokenId, metadata } = metadataArray[i];
    
    try {
      // Store metadata with token ID in tags
      const result = await aleph.storage.store(
        metadata,
        { 
          account,
          tags: ['nft', 'metadata', 'bulk-upload', `token-${tokenId}`]
        }
      );
      
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
// Retrieve NFT metadata by CID
const getMetadataByCID = async (cid) => {
  try {
    const metadata = await aleph.storage.get(cid);
    return metadata;
  } catch (error) {
    console.error('Error retrieving metadata:', error);
    throw error;
  }
};

// Retrieve latest metadata by token ID
const getLatestMetadataByTokenId = async (tokenId) => {
  try {
    // Query for messages with the token ID tag
    const messages = await aleph.storage.query({
      tags: [`token-${tokenId}`],
      types: ['storage'],
      pagination: 1,
      page: 1,
      sort: 'DESC'
    });
    
    if (messages.length === 0) {
      throw new Error(`No metadata found for token #${tokenId}`);
    }
    
    // Return the most recent metadata
    return messages[0].content;
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
// Store an image file for an NFT
const storeNFTImage = async (file, tokenId, account) => {
  try {
    // Store the file on Aleph Cloud
    const result = await aleph.storage.storeFile(
      file,
      { 
        account,
        tags: ['nft', 'image', `token-${tokenId}`]
      }
    );
    
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
  
  if (file && tokenId) {
    try {
      const imageCID = await storeNFTImage(file, tokenId, account);
      
      // Update UI with the image URL
      const imageUrl = `https://api1.aleph.im/api/v0/storage/raw/${imageCID}`;
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
// Store a video file for an NFT
const storeNFTVideo = async (file, tokenId, account) => {
  try {
    // Store the file on Aleph Cloud
    const result = await aleph.storage.storeFile(
      file,
      { 
        account,
        tags: ['nft', 'video', `token-${tokenId}`]
      }
    );
    
    console.log(`Video stored with hash: ${result.item_hash}`);
    
    // Return the IPFS-compatible CID
    return result.item_hash;
  } catch (error) {
    console.error('Error storing NFT video:', error);
    throw error;
  }
};

// Store a 3D model for an NFT
const storeNFT3DModel = async (file, tokenId, account) => {
  try {
    // Store the file on Aleph Cloud
    const result = await aleph.storage.storeFile(
      file,
      { 
        account,
        tags: ['nft', '3d-model', `token-${tokenId}`]
      }
    );
    
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

// Create the indexer
const result = await aleph.indexer.create(nftIndexerConfig, { account });
```

#### Querying Indexed Data

```javascript
// Get token details
const getTokenDetails = async (tokenId) => {
  try {
    const token = await aleph.indexer.get(
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
    const transfers = await aleph.indexer.query(
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
    const stats = await aleph.indexer.get(
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
    const owners = await aleph.indexer.query(
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
// Create a marketplace listing
const createListing = async (tokenId, price, account) => {
  try {
    // Store the listing as an aggregate
    const result = await aleph.aggregate.create(
      'nft-listings',
      {
        tokenId: tokenId.toString(),
        seller: account.address,
        price: price.toString(),
        currency: 'ETH',
        active: true,
        createdAt: Date.now()
      },
      { account, key: `listing-${tokenId}` }
    );
    
    console.log(`Listing created for token #${tokenId}`);
    return result;
  } catch (error) {
    console.error('Error creating listing:', error);
    throw error;
  }
};

// Update a listing
const updateListing = async (tokenId, newPrice, account) => {
  try {
    // Update the listing
    const result = await aleph.aggregate.update(
      'nft-listings',
      {
        price: newPrice.toString(),
        updatedAt: Date.now()
      },
      { account, key: `listing-${tokenId}` }
    );
    
    console.log(`Listing updated for token #${tokenId}`);
    return result;
  } catch (error) {
    console.error('Error updating listing:', error);
    throw error;
  }
};

// Cancel a listing
const cancelListing = async (tokenId, account) => {
  try {
    // Update the listing to inactive
    const result = await aleph.aggregate.update(
      'nft-listings',
      {
        active: false,
        cancelledAt: Date.now()
      },
      { account, key: `listing-${tokenId}` }
    );
    
    console.log(`Listing cancelled for token #${tokenId}`);
    return result;
  } catch (error) {
    console.error('Error cancelling listing:', error);
    throw error;
  }
};

// Record a sale
const recordSale = async (tokenId, buyer, price, account) => {
  try {
    // Store the sale
    const saleResult = await aleph.storage.store(
      {
        tokenId: tokenId.toString(),
        seller: account.address,
        buyer,
        price: price.toString(),
        currency: 'ETH',
        timestamp: Date.now()
      },
      { account, tags: ['nft', 'sale', `token-${tokenId}`] }
    );
    
    // Update the listing to inactive
    await aleph.aggregate.update(
      'nft-listings',
      {
        active: false,
        soldAt: Date.now(),
        buyer
      },
      { account, key: `listing-${tokenId}` }
    );
    
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
// Get active listings
const getActiveListings = async (limit = 20, page = 1) => {
  try {
    const listings = await aleph.aggregate.query('nft-listings', {
      where: { active: true },
      sort: { createdAt: -1 },
      limit,
      page
    });
    
    return listings;
  } catch (error) {
    console.error('Error retrieving active listings:', error);
    throw error;
  }
};

// Get listings by seller
const getListingsBySeller = async (sellerAddress, limit = 20) => {
  try {
    const listings = await aleph.aggregate.query('nft-listings', {
      where: { seller: sellerAddress },
      sort: { createdAt: -1 },
      limit
    });
    
    return listings;
  } catch (error) {
    console.error('Error retrieving seller listings:', error);
    throw error;
  }
};

// Get listing for a specific token
const getTokenListing = async (tokenId) => {
  try {
    const listing = await aleph.aggregate.get('nft-listings', `listing-${tokenId}`);
    return listing;
  } catch (error) {
    console.error(`Error retrieving listing for token #${tokenId}:`, error);
    throw error;
  }
};

// Get sales history
const getSalesHistory = async (limit = 20) => {
  try {
    const sales = await aleph.storage.query({
      tags: ['nft', 'sale'],
      types: ['storage'],
      pagination: limit,
      page: 1,
      sort: 'DESC'
    });
    
    return sales.map(sale => sale.content);
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

4. **Create an NFT metadata upload component**:
   ```typescript
   import { useState } from 'react';
   import { AlephHttpClient } from '@aleph-sdk/client';
   import { ETHAccount } from '@aleph-sdk/core';
   import { useWeb3React } from '@web3-react/core';
   
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
         
         // Create Aleph account from Web3 provider
         const aleph = new AlephHttpClient();
         const alephAccount = await aleph.ethereum.from_provider(library.provider);
         
         setStatus('Uploading image...');
         
         // Upload the image
         const imageResult = await aleph.storage.storeFile(
           file,
           { account: alephAccount, tags: ['nft', 'image'] }
         );
         
         setStatus('Storing metadata...');
         
         // Create the full metadata
         const fullMetadata = {
           ...metadata,
           image: `ipfs://${imageResult.item_hash}`,
           created_at: Date.now()
         };
         
         // Store the metadata
         const metadataResult = await aleph.storage.store(
           fullMetadata,
           { account: alephAccount, tags: ['nft', 'metadata'] }
         );
         
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

Join our community to share your NFT projects, get help, and collaborate with other developers building on Aleph Cloud!
