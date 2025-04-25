# Gaming Integration Examples

This section provides practical examples of integrating Aleph Cloud with gaming applications. These examples demonstrate how to leverage Aleph Cloud's decentralized storage, indexing, and computing capabilities to enhance blockchain games.

## Overview

Gaming applications built on Aleph Cloud benefit from:

- **Decentralized Game State**: Store game state and player data permanently
- **Asset Storage**: Store game assets and metadata
- **Efficient Indexing**: Index in-game events and transactions
- **Cross-Chain Compatibility**: Support for multiple blockchains
- **Scalable Infrastructure**: Handle high-volume gaming activity

## Example Projects

### Game Asset Management

Store and manage game assets (items, characters, etc.) on Aleph Cloud.

#### Key Features

- Permanent asset metadata storage
- Asset ownership tracking
- Asset trading and transfer history
- Rarity and attribute indexing
- Cross-game asset compatibility

#### Implementation Highlights

```javascript
// Store game asset metadata
const storeGameAsset = async (assetId, metadata, account) => {
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
        tags: ['game', 'asset', `asset-${assetId}`]
      }
    );
    
    console.log(`Asset metadata stored with hash: ${result.item_hash}`);
    
    // Return the IPFS-compatible CID
    return result.item_hash;
  } catch (error) {
    console.error('Error storing game asset metadata:', error);
    throw error;
  }
};

// Example asset metadata
const assetMetadata = {
  name: "Excalibur Sword",
  description: "A legendary sword of immense power",
  image: "ipfs://QmImageHash123",
  game: "Legends of Aleph",
  type: "Weapon",
  subtype: "Sword",
  rarity: "Legendary",
  attributes: [
    { trait_type: "Damage", value: 120 },
    { trait_type: "Speed", value: 80 },
    { trait_type: "Durability", value: 1000 },
    { trait_type: "Element", value: "Light" }
  ],
  stats: {
    attack: 120,
    defense: 0,
    speed: -5,
    criticalChance: 15
  }
};

// Store the asset metadata
const assetCID = await storeGameAsset("sword-excalibur", assetMetadata, account);
```

#### Asset Ownership Management

```javascript
// Store asset ownership data
const storeAssetOwnership = async (assetId, owner, account) => {
  try {
    // Create or update ownership record
    const result = await aleph.aggregate.create(
      'game-asset-ownership',
      {
        assetId,
        owner,
        acquiredAt: Date.now()
      },
      { account, key: `ownership-${assetId}` }
    );
    
    console.log(`Ownership recorded for asset ${assetId}`);
    return result;
  } catch (error) {
    console.error('Error recording ownership:', error);
    throw error;
  }
};

// Transfer asset ownership
const transferAssetOwnership = async (assetId, newOwner, account) => {
  try {
    // Record transfer event
    const transferResult = await aleph.storage.store(
      {
        assetId,
        from: account.address,
        to: newOwner,
        timestamp: Date.now()
      },
      { account, tags: ['game', 'asset-transfer', `asset-${assetId}`] }
    );
    
    // Update ownership record
    const ownershipResult = await aleph.aggregate.update(
      'game-asset-ownership',
      {
        owner: newOwner,
        acquiredAt: Date.now(),
        previousOwner: account.address
      },
      { account, key: `ownership-${assetId}` }
    );
    
    console.log(`Asset ${assetId} transferred to ${newOwner}`);
    return { transfer: transferResult, ownership: ownershipResult };
  } catch (error) {
    console.error('Error transferring asset:', error);
    throw error;
  }
};
```

#### Querying Asset Data

```javascript
// Get asset metadata by ID
const getAssetMetadata = async (assetId) => {
  try {
    // Query for messages with the asset ID tag
    const messages = await aleph.storage.query({
      tags: [`asset-${assetId}`],
      types: ['storage'],
      pagination: 1,
      page: 1,
      sort: 'DESC'
    });
    
    if (messages.length === 0) {
      throw new Error(`No metadata found for asset ${assetId}`);
    }
    
    // Return the most recent metadata
    return messages[0].content;
  } catch (error) {
    console.error('Error retrieving asset metadata:', error);
    throw error;
  }
};

// Get asset ownership
const getAssetOwnership = async (assetId) => {
  try {
    const ownership = await aleph.aggregate.get('game-asset-ownership', `ownership-${assetId}`);
    return ownership;
  } catch (error) {
    console.error(`Error retrieving ownership for asset ${assetId}:`, error);
    throw error;
  }
};

// Get asset transfer history
const getAssetTransferHistory = async (assetId) => {
  try {
    const transfers = await aleph.storage.query({
      tags: ['asset-transfer', `asset-${assetId}`],
      types: ['storage'],
      pagination: 10,
      page: 1,
      sort: 'DESC'
    });
    
    return transfers.map(transfer => transfer.content);
  } catch (error) {
    console.error(`Error retrieving transfer history for asset ${assetId}:`, error);
    throw error;
  }
};
```

### Player Profile and Progression

Store player profiles, achievements, and progression data on Aleph Cloud.

#### Key Features

- Persistent player profiles
- Cross-game identity
- Achievement tracking
- Progression statistics
- Leaderboard data

#### Implementation Highlights

```javascript
// Create or update player profile
const updatePlayerProfile = async (playerId, profileData, account) => {
  try {
    // Create or update profile
    const result = await aleph.aggregate.create(
      'player-profiles',
      {
        ...profileData,
        updatedAt: Date.now()
      },
      { account, key: `profile-${playerId}` }
    );
    
    console.log(`Profile updated for player ${playerId}`);
    return result;
  } catch (error) {
    console.error('Error updating player profile:', error);
    throw error;
  }
};

// Example player profile
const playerProfile = {
  username: "AlephWarrior",
  avatar: "ipfs://QmAvatarHash123",
  level: 42,
  experience: 12500,
  joinedAt: Date.now(),
  lastActive: Date.now(),
  stats: {
    victories: 157,
    defeats: 43,
    playtime: 12600, // in minutes
    killCount: 1892,
    deathCount: 421
  },
  preferences: {
    controls: "advanced",
    graphics: "high",
    audio: "medium"
  }
};

// Update player profile
await updatePlayerProfile("player-123", playerProfile, account);
```

#### Achievement System

```javascript
// Record player achievement
const recordAchievement = async (playerId, achievementId, account) => {
  try {
    // Store achievement record
    const result = await aleph.storage.store(
      {
        playerId,
        achievementId,
        unlockedAt: Date.now()
      },
      { account, tags: ['game', 'achievement', `player-${playerId}`] }
    );
    
    // Update player's achievement list
    const playerData = await aleph.aggregate.get('player-profiles', `profile-${playerId}`);
    
    if (playerData) {
      const achievements = playerData.achievements || [];
      
      if (!achievements.includes(achievementId)) {
        await aleph.aggregate.update(
          'player-profiles',
          {
            achievements: [...achievements, achievementId],
            updatedAt: Date.now()
          },
          { account, key: `profile-${playerId}` }
        );
      }
    }
    
    console.log(`Achievement ${achievementId} recorded for player ${playerId}`);
    return result;
  } catch (error) {
    console.error('Error recording achievement:', error);
    throw error;
  }
};

// Get player achievements
const getPlayerAchievements = async (playerId) => {
  try {
    const achievements = await aleph.storage.query({
      tags: ['achievement', `player-${playerId}`],
      types: ['storage'],
      pagination: 100,
      page: 1,
      sort: 'DESC'
    });
    
    return achievements.map(achievement => achievement.content);
  } catch (error) {
    console.error(`Error retrieving achievements for player ${playerId}:`, error);
    throw error;
  }
};
```

#### Player Progression

```javascript
// Update player progression
const updatePlayerProgression = async (playerId, gameId, progressData, account) => {
  try {
    // Create or update progression record
    const result = await aleph.aggregate.create(
      'player-progression',
      {
        playerId,
        gameId,
        ...progressData,
        updatedAt: Date.now()
      },
      { account, key: `progress-${playerId}-${gameId}` }
    );
    
    console.log(`Progression updated for player ${playerId} in game ${gameId}`);
    return result;
  } catch (error) {
    console.error('Error updating player progression:', error);
    throw error;
  }
};

// Example progression data
const progressionData = {
  currentLevel: 7,
  completedLevels: [1, 2, 3, 4, 5, 6],
  currentMission: "The Dark Forest",
  missionProgress: 65, // percentage
  unlockedAreas: ["Starting Village", "Western Plains", "Mountain Pass", "Dark Forest"],
  inventory: {
    gold: 1250,
    gems: 42,
    items: [
      { id: "health-potion", quantity: 5 },
      { id: "mana-potion", quantity: 3 },
      { id: "sword-excalibur", quantity: 1 }
    ]
  },
  skills: [
    { id: "fireball", level: 3 },
    { id: "healing", level: 2 },
    { id: "stealth", level: 1 }
  ]
};

// Update player progression
await updatePlayerProgression("player-123", "legends-of-aleph", progressionData, account);
```

### Game Event Indexing

Index in-game events to provide analytics, leaderboards, and activity feeds.

#### Key Features

- Real-time event tracking
- Player activity feeds
- Game analytics
- Leaderboard generation
- Achievement triggers

#### Implementation Highlights

```javascript
// Define a game event indexer
const gameEventIndexerConfig = {
  name: 'GameEventIndexer',
  description: 'Indexes game events and player activities',
  network: 'ethereum',
  startBlock: 12000000,
  contracts: [
    {
      // Game contract
      address: '0xGameContractAddress',
      abi: [...], // Game contract ABI
      events: [
        { name: 'BattleCompleted', handler: 'handleBattleCompleted' },
        { name: 'ItemCrafted', handler: 'handleItemCrafted' },
        { name: 'LevelUp', handler: 'handleLevelUp' },
        { name: 'QuestCompleted', handler: 'handleQuestCompleted' }
      ]
    }
  ],
  handlers: {
    handleBattleCompleted: `
      async function handleBattleCompleted(event, context) {
        const { battleId, winner, loser, rewards } = event.args;
        
        // Store the battle event
        await context.store.set('battles', battleId.toString(), {
          battleId: battleId.toString(),
          winner,
          loser,
          rewards: rewards.toString(),
          timestamp: event.block.timestamp,
          blockNumber: event.blockNumber
        });
        
        // Update player statistics
        await updatePlayerStats(context, winner, 'win');
        await updatePlayerStats(context, loser, 'loss');
        
        // Update leaderboard
        await updateLeaderboard(context, winner, loser);
      }
    `,
    handleItemCrafted: `
      async function handleItemCrafted(event, context) {
        const { player, itemId, ingredients } = event.args;
        
        // Store the crafting event
        await context.store.set('crafting', event.transactionHash, {
          player,
          itemId: itemId.toString(),
          ingredients: ingredients.map(i => i.toString()),
          timestamp: event.block.timestamp,
          blockNumber: event.blockNumber
        });
        
        // Update player crafting statistics
        const playerData = await context.store.get('players', player) || {
          address: player,
          craftingCount: 0
        };
        
        await context.store.set('players', player, {
          ...playerData,
          craftingCount: (playerData.craftingCount || 0) + 1,
          lastActivity: event.block.timestamp
        });
      }
    `,
    handleLevelUp: `
      async function handleLevelUp(event, context) {
        const { player, newLevel, oldLevel } = event.args;
        
        // Store the level up event
        await context.store.set('levelUps', event.transactionHash, {
          player,
          newLevel: newLevel.toString(),
          oldLevel: oldLevel.toString(),
          timestamp: event.block.timestamp,
          blockNumber: event.blockNumber
        });
        
        // Update player level
        const playerData = await context.store.get('players', player) || {
          address: player
        };
        
        await context.store.set('players', player, {
          ...playerData,
          level: newLevel.toString(),
          lastActivity: event.block.timestamp
        });
      }
    `,
    handleQuestCompleted: `
      async function handleQuestCompleted(event, context) {
        const { player, questId, rewards } = event.args;
        
        // Store the quest completion event
        await context.store.set('quests', event.transactionHash, {
          player,
          questId: questId.toString(),
          rewards: rewards.toString(),
          timestamp: event.block.timestamp,
          blockNumber: event.blockNumber
        });
        
        // Update player quest statistics
        const playerData = await context.store.get('players', player) || {
          address: player,
          questsCompleted: 0
        };
        
        await context.store.set('players', player, {
          ...playerData,
          questsCompleted: (playerData.questsCompleted || 0) + 1,
          lastActivity: event.block.timestamp
        });
      }
    `,
    // Helper functions
    updatePlayerStats: `
      async function updatePlayerStats(context, player, result) {
        const playerData = await context.store.get('players', player) || {
          address: player,
          wins: 0,
          losses: 0,
          totalBattles: 0
        };
        
        const updates = {
          ...playerData,
          totalBattles: (playerData.totalBattles || 0) + 1,
          lastActivity: context.block.timestamp
        };
        
        if (result === 'win') {
          updates.wins = (playerData.wins || 0) + 1;
        } else {
          updates.losses = (playerData.losses || 0) + 1;
        }
        
        // Calculate win rate
        if (updates.totalBattles > 0) {
          updates.winRate = Math.floor((updates.wins / updates.totalBattles) * 100);
        }
        
        await context.store.set('players', player, updates);
      }
    `,
    updateLeaderboard: `
      async function updateLeaderboard(context, winner, loser) {
        // Get current leaderboard
        const leaderboard = await context.store.get('stats', 'leaderboard') || {
          topPlayers: [],
          lastUpdated: 0
        };
        
        // Get player data
        const winnerData = await context.store.get('players', winner);
        
        // Check if winner should be on leaderboard
        if (winnerData && winnerData.wins >= 5) {
          // Check if player is already on leaderboard
          const existingIndex = leaderboard.topPlayers.findIndex(p => p.address === winner);
          
          if (existingIndex >= 0) {
            // Update existing entry
            leaderboard.topPlayers[existingIndex] = {
              address: winner,
              wins: winnerData.wins,
              losses: winnerData.losses,
              winRate: winnerData.winRate
            };
          } else {
            // Add new entry
            leaderboard.topPlayers.push({
              address: winner,
              wins: winnerData.wins,
              losses: winnerData.losses,
              winRate: winnerData.winRate
            });
          }
          
          // Sort by wins
          leaderboard.topPlayers.sort((a, b) => b.wins - a.wins);
          
          // Keep only top 100
          if (leaderboard.topPlayers.length > 100) {
            leaderboard.topPlayers = leaderboard.topPlayers.slice(0, 100);
          }
          
          // Update leaderboard
          leaderboard.lastUpdated = context.block.timestamp;
          await context.store.set('stats', 'leaderboard', leaderboard);
        }
      }
    `
  }
};

// Create the indexer
const result = await aleph.indexer.create(gameEventIndexerConfig, { account });
```

#### Querying Game Events

```javascript
// Get player battle history
const getPlayerBattles = async (playerAddress) => {
  try {
    // Query battles where player was winner or loser
    const battlesAsWinner = await aleph.indexer.query(
      'GameEventIndexer',
      'battles',
      {
        where: { winner: playerAddress },
        sort: { timestamp: -1 },
        limit: 10
      }
    );
    
    const battlesAsLoser = await aleph.indexer.query(
      'GameEventIndexer',
      'battles',
      {
        where: { loser: playerAddress },
        sort: { timestamp: -1 },
        limit: 10
      }
    );
    
    // Combine and sort by timestamp
    const allBattles = [...battlesAsWinner, ...battlesAsLoser];
    allBattles.sort((a, b) => b.timestamp - a.timestamp);
    
    return allBattles.slice(0, 10); // Return most recent 10
  } catch (error) {
    console.error(`Error retrieving battles for player ${playerAddress}:`, error);
    throw error;
  }
};

// Get leaderboard
const getLeaderboard = async () => {
  try {
    const leaderboard = await aleph.indexer.get(
      'GameEventIndexer',
      'stats',
      'leaderboard'
    );
    
    return leaderboard?.topPlayers || [];
  } catch (error) {
    console.error('Error retrieving leaderboard:', error);
    throw error;
  }
};

// Get player statistics
const getPlayerStats = async (playerAddress) => {
  try {
    const playerStats = await aleph.indexer.get(
      'GameEventIndexer',
      'players',
      playerAddress
    );
    
    return playerStats;
  } catch (error) {
    console.error(`Error retrieving stats for player ${playerAddress}:`, error);
    throw error;
  }
};
```

### Game Economy and Marketplace

Build a decentralized in-game economy and marketplace using Aleph Cloud.

#### Key Features

- In-game item marketplace
- Trading history
- Price tracking
- Inventory management
- Economic analytics

#### Implementation Highlights

```javascript
// Create a marketplace listing
const createItemListing = async (itemId, price, account) => {
  try {
    // Store the listing as an aggregate
    const result = await aleph.aggregate.create(
      'game-item-listings',
      {
        itemId,
        seller: account.address,
        price: price.toString(),
        currency: 'GOLD',
        active: true,
        createdAt: Date.now()
      },
      { account, key: `listing-${itemId}-${Date.now()}` }
    );
    
    console.log(`Listing created for item ${itemId}`);
    return result;
  } catch (error) {
    console.error('Error creating listing:', error);
    throw error;
  }
};

// Cancel a listing
const cancelItemListing = async (listingId, account) => {
  try {
    // Update the listing to inactive
    const result = await aleph.aggregate.update(
      'game-item-listings',
      {
        active: false,
        cancelledAt: Date.now()
      },
      { account, key: listingId }
    );
    
    console.log(`Listing ${listingId} cancelled`);
    return result;
  } catch (error) {
    console.error('Error cancelling listing:', error);
    throw error;
  }
};

// Record a sale
const recordItemSale = async (listingId, buyer, account) => {
  try {
    // Get the listing
    const listing = await aleph.aggregate.get('game-item-listings', listingId);
    
    if (!listing || !listing.active) {
      throw new Error('Listing not found or not active');
    }
    
    // Store the sale
    const saleResult = await aleph.storage.store(
      {
        listingId,
        itemId: listing.itemId,
        seller: listing.seller,
        buyer,
        price: listing.price,
        currency: listing.currency,
        timestamp: Date.now()
      },
      { account, tags: ['game', 'item-sale', `item-${listing.itemId}`] }
    );
    
    // Update the listing to inactive
    await aleph.aggregate.update(
      'game-item-listings',
      {
        active: false,
        soldAt: Date.now(),
        buyer
      },
      { account, key: listingId }
    );
    
    console.log(`Sale recorded for listing ${listingId}`);
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
    const listings = await aleph.aggregate.query('game-item-listings', {
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
    const listings = await aleph.aggregate.query('game-item-listings', {
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

// Get sales history for an item
const getItemSalesHistory = async (itemId, limit = 10) => {
  try {
    const sales = await aleph.storage.query({
      tags: ['item-sale', `item-${itemId}`],
      types: ['storage'],
      pagination: limit,
      page: 1,
      sort: 'DESC'
    });
    
    return sales.map(sale => sale.content);
  } catch (error) {
    console.error(`Error retrieving sales history for item ${itemId}:`, error);
    throw error;
  }
};
```

## Building Your Own Gaming Application

Follow these steps to build your own gaming application with Aleph Cloud:

1. **Design your data model**:
   - Player profiles and progression
   - Game assets and inventory
   - Game events and activities
   - Marketplace and economy

2. **Implement storage solutions**:
   - Use `aleph.storage` for immutable data (assets, events)
   - Use `aleph.aggregate` for mutable data (profiles, inventories)
   - Use `aleph.indexer` for on-chain events (transactions, smart contract events)

3. **Create a user interface**:
   - Connect to player wallets
   - Display player data and assets
   - Enable marketplace functionality
   - Show leaderboards and activity feeds

4. **Integrate with blockchain**:
   - Authenticate players using their wallets
   - Record important events on-chain
   - Use Aleph Cloud as a scalable data layer

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

Join our community to share your gaming projects, get help, and collaborate with other developers building on Aleph Cloud!
