# DeFi Integration Examples

This section provides practical examples of integrating Aleph Cloud with DeFi (Decentralized Finance) applications. These examples demonstrate how to leverage Aleph Cloud's decentralized storage, indexing, and computing capabilities to enhance DeFi protocols and applications.

## Overview

DeFi applications built on Aleph Cloud benefit from:

- **Efficient Indexing**: Index on-chain events for fast data retrieval
- **Historical Data Storage**: Store and access historical financial data
- **Real-time Analytics**: Process and analyze DeFi data in real-time
- **Cross-Chain Compatibility**: Support for multiple blockchains
- **Decentralized Infrastructure**: Eliminate single points of failure

## Example Projects

### Automated Market Maker (AMM) Analytics

An analytics platform for tracking AMM pools, liquidity, and trading activity.

#### Key Features

- Real-time pool statistics
- Historical price and volume data
- Liquidity provider analytics
- Impermanent loss calculator
- Trading volume and fee analytics

#### Implementation Highlights

```javascript
// Define an indexer for Uniswap V2
const uniswapIndexerConfig = {
  name: 'UniswapV2Indexer',
  description: 'Indexes Uniswap V2 pairs and swaps',
  network: 'ethereum',
  startBlock: 10000835, // Uniswap V2 deployment block
  contracts: [
    {
      // Factory contract
      address: '0x5C69bEe701ef814a2B6a3EDD4B1652CB9cc5aA6f',
      abi: [...], // Factory ABI
      events: [
        { name: 'PairCreated', handler: 'handlePairCreated' }
      ]
    },
    {
      // Dynamic pairs (added programmatically)
      address: 'dynamic',
      abi: [...], // Pair ABI
      events: [
        { name: 'Swap', handler: 'handleSwap' },
        { name: 'Sync', handler: 'handleSync' },
        { name: 'Mint', handler: 'handleMint' },
        { name: 'Burn', handler: 'handleBurn' }
      ]
    }
  ],
  handlers: {
    handlePairCreated: `
      async function handlePairCreated(event, context) {
        const { token0, token1, pair } = event.args;
        
        // Store the new pair
        await context.store.set('pairs', pair, {
          token0,
          token1,
          createdAt: event.block.timestamp,
          createdAtBlock: event.blockNumber,
          reserve0: '0',
          reserve1: '0',
          totalSupply: '0',
          volumeToken0: '0',
          volumeToken1: '0',
          txCount: 0
        });
        
        // Add the pair to the dynamic contract addresses
        await context.contracts.add(pair);
      }
    `,
    handleSwap: `
      async function handleSwap(event, context) {
        const { amount0In, amount1In, amount0Out, amount1Out } = event.args;
        const pair = event.address;
        
        // Get current pair data
        const pairData = await context.store.get('pairs', pair);
        if (!pairData) return;
        
        // Calculate volumes
        const volume0 = BigInt(amount0In.toString()) + BigInt(amount0Out.toString());
        const volume1 = BigInt(amount1In.toString()) + BigInt(amount1Out.toString());
        
        // Update pair statistics
        await context.store.set('pairs', pair, {
          ...pairData,
          volumeToken0: (BigInt(pairData.volumeToken0) + volume0).toString(),
          volumeToken1: (BigInt(pairData.volumeToken1) + volume1).toString(),
          txCount: pairData.txCount + 1,
          lastUpdated: event.block.timestamp
        });
        
        // Store the swap event
        await context.store.set('swaps', event.transactionHash, {
          pair,
          token0: pairData.token0,
          token1: pairData.token1,
          amount0In: amount0In.toString(),
          amount1In: amount1In.toString(),
          amount0Out: amount0Out.toString(),
          amount1Out: amount1Out.toString(),
          timestamp: event.block.timestamp,
          blockNumber: event.blockNumber
        });
        
        // Update daily statistics
        const day = Math.floor(event.block.timestamp / 86400) * 86400;
        const dayId = pair + '-' + day;
        
        const dayData = await context.store.get('pairDayData', dayId) || {
          pair,
          day,
          volumeToken0: '0',
          volumeToken1: '0',
          txCount: 0
        };
        
        await context.store.set('pairDayData', dayId, {
          ...dayData,
          volumeToken0: (BigInt(dayData.volumeToken0) + volume0).toString(),
          volumeToken1: (BigInt(dayData.volumeToken1) + volume1).toString(),
          txCount: dayData.txCount + 1
        });
      }
    `,
    handleSync: `
      async function handleSync(event, context) {
        const { reserve0, reserve1 } = event.args;
        const pair = event.address;
        
        // Get current pair data
        const pairData = await context.store.get('pairs', pair);
        if (!pairData) return;
        
        // Update reserves
        await context.store.set('pairs', pair, {
          ...pairData,
          reserve0: reserve0.toString(),
          reserve1: reserve1.toString(),
          lastUpdated: event.block.timestamp
        });
      }
    `,
    handleMint: `
      async function handleMint(event, context) {
        const { sender, amount0, amount1 } = event.args;
        const pair = event.address;
        
        // Store liquidity provision event
        await context.store.set('liquidity', event.transactionHash + '-mint', {
          pair,
          type: 'mint',
          sender,
          amount0: amount0.toString(),
          amount1: amount1.toString(),
          timestamp: event.block.timestamp,
          blockNumber: event.blockNumber
        });
      }
    `,
    handleBurn: `
      async function handleBurn(event, context) {
        const { sender, amount0, amount1, to } = event.args;
        const pair = event.address;
        
        // Store liquidity removal event
        await context.store.set('liquidity', event.transactionHash + '-burn', {
          pair,
          type: 'burn',
          sender,
          to,
          amount0: amount0.toString(),
          amount1: amount1.toString(),
          timestamp: event.block.timestamp,
          blockNumber: event.blockNumber
        });
      }
    `
  }
};

// Create the indexer
const result = await aleph.indexer.create(uniswapIndexerConfig, { account });
```

#### Querying Indexed Data

```javascript
// Get top pairs by volume
const topPairs = await aleph.indexer.query(
  'UniswapV2Indexer',
  'pairs',
  {
    sort: { volumeToken0: -1 },
    limit: 10
  }
);

// Get recent swaps for a specific pair
const recentSwaps = await aleph.indexer.query(
  'UniswapV2Indexer',
  'swaps',
  {
    where: { pair: '0xB4e16d0168e52d35CaCD2c6185b44281Ec28C9Dc' },
    sort: { timestamp: -1 },
    limit: 20
  }
);

// Get daily volume for a pair
const dailyVolume = await aleph.indexer.query(
  'UniswapV2Indexer',
  'pairDayData',
  {
    where: { pair: '0xB4e16d0168e52d35CaCD2c6185b44281Ec28C9Dc' },
    sort: { day: -1 },
    limit: 30
  }
);
```

#### Demo Application

Check out our [AMM Analytics Demo](https://github.com/aleph-im/amm-analytics-demo) for a complete implementation.

### Lending Protocol Dashboard

A dashboard for monitoring lending protocol metrics, user positions, and market conditions.

#### Key Features

- Real-time market statistics
- User position tracking
- Liquidation risk monitoring
- Interest rate history
- Collateral ratio analytics

#### Implementation Highlights

```javascript
// Define an indexer for Aave V2
const aaveIndexerConfig = {
  name: 'AaveV2Indexer',
  description: 'Indexes Aave V2 lending protocol events',
  network: 'ethereum',
  startBlock: 11362579, // Aave V2 deployment block
  contracts: [
    {
      // LendingPool contract
      address: '0x7d2768dE32b0b80b7a3454c06BdAc94A69DDc7A9',
      abi: [...], // LendingPool ABI
      events: [
        { name: 'Deposit', handler: 'handleDeposit' },
        { name: 'Withdraw', handler: 'handleWithdraw' },
        { name: 'Borrow', handler: 'handleBorrow' },
        { name: 'Repay', handler: 'handleRepay' },
        { name: 'LiquidationCall', handler: 'handleLiquidation' },
        { name: 'ReserveDataUpdated', handler: 'handleReserveUpdate' }
      ]
    }
  ],
  handlers: {
    handleDeposit: `
      async function handleDeposit(event, context) {
        const { reserve, user, amount, onBehalfOf } = event.args;
        
        // Store the deposit event
        await context.store.set('deposits', event.transactionHash, {
          reserve,
          user,
          onBehalfOf,
          amount: amount.toString(),
          timestamp: event.block.timestamp,
          blockNumber: event.blockNumber
        });
        
        // Update user position
        await updateUserPosition(context, onBehalfOf, reserve, 'deposit', amount.toString());
        
        // Update reserve statistics
        await updateReserveStats(context, reserve, 'deposit', amount.toString());
      }
    `,
    handleWithdraw: `
      async function handleWithdraw(event, context) {
        const { reserve, user, amount, to } = event.args;
        
        // Store the withdrawal event
        await context.store.set('withdrawals', event.transactionHash, {
          reserve,
          user,
          to,
          amount: amount.toString(),
          timestamp: event.block.timestamp,
          blockNumber: event.blockNumber
        });
        
        // Update user position
        await updateUserPosition(context, user, reserve, 'withdraw', amount.toString());
        
        // Update reserve statistics
        await updateReserveStats(context, reserve, 'withdraw', amount.toString());
      }
    `,
    // Additional handlers...
    
    // Helper functions
    updateUserPosition: `
      async function updateUserPosition(context, user, reserve, action, amount) {
        const positionKey = user + '-' + reserve;
        const position = await context.store.get('positions', positionKey) || {
          user,
          reserve,
          depositBalance: '0',
          borrowBalance: '0',
          lastUpdated: 0
        };
        
        let updatedPosition = { ...position };
        
        if (action === 'deposit') {
          updatedPosition.depositBalance = (BigInt(position.depositBalance) + BigInt(amount)).toString();
        } else if (action === 'withdraw') {
          updatedPosition.depositBalance = (BigInt(position.depositBalance) - BigInt(amount)).toString();
        } else if (action === 'borrow') {
          updatedPosition.borrowBalance = (BigInt(position.borrowBalance) + BigInt(amount)).toString();
        } else if (action === 'repay') {
          updatedPosition.borrowBalance = (BigInt(position.borrowBalance) - BigInt(amount)).toString();
        }
        
        updatedPosition.lastUpdated = context.block.timestamp;
        
        await context.store.set('positions', positionKey, updatedPosition);
      }
    `,
    updateReserveStats: `
      async function updateReserveStats(context, reserve, action, amount) {
        const reserveData = await context.store.get('reserves', reserve) || {
          reserve,
          totalDeposits: '0',
          totalBorrows: '0',
          depositAPY: '0',
          borrowAPY: '0',
          utilizationRate: '0',
          lastUpdated: 0
        };
        
        let updatedReserve = { ...reserveData };
        
        if (action === 'deposit') {
          updatedReserve.totalDeposits = (BigInt(reserveData.totalDeposits) + BigInt(amount)).toString();
        } else if (action === 'withdraw') {
          updatedReserve.totalDeposits = (BigInt(reserveData.totalDeposits) - BigInt(amount)).toString();
        } else if (action === 'borrow') {
          updatedReserve.totalBorrows = (BigInt(reserveData.totalBorrows) + BigInt(amount)).toString();
        } else if (action === 'repay') {
          updatedReserve.totalBorrows = (BigInt(reserveData.totalBorrows) - BigInt(amount)).toString();
        }
        
        // Calculate utilization rate
        const totalDeposits = BigInt(updatedReserve.totalDeposits);
        const totalBorrows = BigInt(updatedReserve.totalBorrows);
        
        if (totalDeposits > 0) {
          const utilizationRate = (totalBorrows * BigInt(10000)) / totalDeposits;
          updatedReserve.utilizationRate = utilizationRate.toString();
        }
        
        updatedReserve.lastUpdated = context.block.timestamp;
        
        await context.store.set('reserves', reserve, updatedReserve);
      }
    `
  }
};
```

#### Querying Indexed Data

```javascript
// Get user positions
const userPositions = await aleph.indexer.query(
  'AaveV2Indexer',
  'positions',
  {
    where: { user: '0xUserAddress' },
    limit: 20
  }
);

// Get reserve statistics
const reserves = await aleph.indexer.query(
  'AaveV2Indexer',
  'reserves',
  {
    sort: { utilizationRate: -1 },
    limit: 10
  }
);

// Get recent liquidations
const liquidations = await aleph.indexer.query(
  'AaveV2Indexer',
  'liquidations',
  {
    sort: { timestamp: -1 },
    limit: 20
  }
);
```

#### Demo Application

Explore our [Lending Dashboard Demo](https://github.com/aleph-im/lending-dashboard-demo) for a complete implementation.

### Yield Farming Tracker

A tool for tracking yield farming opportunities, rewards, and performance.

#### Key Features

- Real-time APY/APR calculations
- Historical yield data
- Reward tracking
- Portfolio performance
- Impermanent loss monitoring

#### Implementation Highlights

```javascript
// Store farm data
const farmResult = await aleph.aggregate.create(
  'yield-farms',
  {
    name: 'ETH-USDC LP Farm',
    protocol: 'SushiSwap',
    pair: {
      address: '0x397FF1542f962076d0BFE58eA045FfA2d347ACa0',
      token0: {
        address: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
        symbol: 'WETH'
      },
      token1: {
        address: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
        symbol: 'USDC'
      }
    },
    rewards: [
      {
        token: {
          address: '0x6B3595068778DD592e39A122f4f5a5cF09C90fE2',
          symbol: 'SUSHI'
        },
        rewardPerBlock: '100000000000000000'
      }
    ],
    tvl: '25000000', // $25M
    apr: '42.5', // 42.5%
    updatedAt: Date.now()
  },
  { account, key: 'sushiswap-eth-usdc' }
);

// Store user position
const positionResult = await aleph.aggregate.create(
  'farm-positions',
  {
    user: account.address,
    farm: 'sushiswap-eth-usdc',
    stakedAmount: '1000000000000000000', // 1 LP token
    stakedUSD: '1000', // $1000
    pendingRewards: {
      'SUSHI': '500000000000000000' // 0.5 SUSHI
    },
    entryTimestamp: Date.now(),
    updatedAt: Date.now()
  },
  { account, key: `${account.address}-sushiswap-eth-usdc` }
);

// Query farms by APR
const topFarms = await aleph.aggregate.query('yield-farms', {
  sort: { apr: -1 },
  limit: 10
});

// Query user positions
const userPositions = await aleph.aggregate.query('farm-positions', {
  where: { user: account.address },
  limit: 20
});
```

#### Demo Application

Try our [Yield Farming Tracker Demo](https://github.com/aleph-im/yield-tracker-demo) for a complete implementation.

### Token Analytics Platform

A platform for analyzing token metrics, transfers, and holder statistics.

#### Key Features

- Token holder distribution
- Transfer volume analytics
- Whale movement tracking
- Token velocity metrics
- Price correlation analysis

#### Implementation Highlights

```javascript
// Define an indexer for ERC-20 tokens
const tokenIndexerConfig = {
  name: 'TokenAnalyticsIndexer',
  description: 'Indexes ERC-20 token transfers and analytics',
  network: 'ethereum',
  startBlock: 12000000,
  contracts: [
    {
      // Token contract
      address: '0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984', // UNI token
      abi: [...], // ERC-20 ABI
      events: [
        { name: 'Transfer', handler: 'handleTransfer' }
      ]
    }
  ],
  handlers: {
    handleTransfer: `
      async function handleTransfer(event, context) {
        const { from, to, value } = event.args;
        
        // Store the transfer
        await context.store.set('transfers', event.transactionHash + '-' + event.logIndex, {
          from,
          to,
          value: value.toString(),
          timestamp: event.block.timestamp,
          blockNumber: event.blockNumber
        });
        
        // Update sender balance
        if (from !== '0x0000000000000000000000000000000000000000') {
          await updateBalance(context, from, value.toString(), 'subtract');
        }
        
        // Update recipient balance
        if (to !== '0x0000000000000000000000000000000000000000') {
          await updateBalance(context, to, value.toString(), 'add');
        }
        
        // Update daily statistics
        await updateDailyStats(context, value.toString(), event.block.timestamp);
      }
    `,
    updateBalance: `
      async function updateBalance(context, address, value, operation) {
        const balance = await context.store.get('balances', address) || { balance: '0' };
        
        let newBalance;
        if (operation === 'add') {
          newBalance = (BigInt(balance.balance) + BigInt(value)).toString();
        } else {
          newBalance = (BigInt(balance.balance) - BigInt(value)).toString();
        }
        
        await context.store.set('balances', address, {
          address,
          balance: newBalance,
          lastUpdated: context.block.timestamp
        });
        
        // Update holder statistics
        await updateHolderStats(context, address, balance.balance, newBalance);
      }
    `,
    updateHolderStats: `
      async function updateHolderStats(context, address, oldBalance, newBalance) {
        // Check if this is a new holder
        const isNewHolder = BigInt(oldBalance) === BigInt(0) && BigInt(newBalance) > BigInt(0);
        
        // Check if this holder is now gone
        const isRemovedHolder = BigInt(oldBalance) > BigInt(0) && BigInt(newBalance) === BigInt(0);
        
        // Get current stats
        const stats = await context.store.get('tokenStats', 'holders') || {
          totalHolders: 0,
          holdersDistribution: {
            '0-10': 0,
            '10-100': 0,
            '100-1000': 0,
            '1000-10000': 0,
            '10000+': 0
          }
        };
        
        // Update total holders
        if (isNewHolder) {
          stats.totalHolders += 1;
        } else if (isRemovedHolder) {
          stats.totalHolders -= 1;
        }
        
        // Update distribution buckets
        const oldBucket = getBucket(oldBalance);
        const newBucket = getBucket(newBalance);
        
        if (oldBucket !== newBucket) {
          if (BigInt(oldBalance) > BigInt(0)) {
            stats.holdersDistribution[oldBucket] -= 1;
          }
          
          if (BigInt(newBalance) > BigInt(0)) {
            stats.holdersDistribution[newBucket] += 1;
          }
        }
        
        await context.store.set('tokenStats', 'holders', stats);
      }
    `,
    getBucket: `
      function getBucket(balance) {
        const balanceNum = Number(BigInt(balance) / BigInt(1e18)); // Convert to whole tokens
        
        if (balanceNum < 10) return '0-10';
        if (balanceNum < 100) return '10-100';
        if (balanceNum < 1000) return '100-1000';
        if (balanceNum < 10000) return '1000-10000';
        return '10000+';
      }
    `,
    updateDailyStats: `
      async function updateDailyStats(context, value, timestamp) {
        const day = Math.floor(timestamp / 86400) * 86400;
        const dayId = day.toString();
        
        const dayData = await context.store.get('dailyStats', dayId) || {
          day,
          transferCount: 0,
          transferVolume: '0'
        };
        
        await context.store.set('dailyStats', dayId, {
          ...dayData,
          transferCount: dayData.transferCount + 1,
          transferVolume: (BigInt(dayData.transferVolume) + BigInt(value)).toString()
        });
      }
    `
  }
};
```

#### Querying Indexed Data

```javascript
// Get top token holders
const topHolders = await aleph.indexer.query(
  'TokenAnalyticsIndexer',
  'balances',
  {
    sort: { balance: -1 },
    limit: 100
  }
);

// Get recent transfers
const recentTransfers = await aleph.indexer.query(
  'TokenAnalyticsIndexer',
  'transfers',
  {
    sort: { timestamp: -1 },
    limit: 20
  }
);

// Get holder statistics
const holderStats = await aleph.indexer.get(
  'TokenAnalyticsIndexer',
  'tokenStats',
  'holders'
);

// Get daily transfer volume
const dailyVolume = await aleph.indexer.query(
  'TokenAnalyticsIndexer',
  'dailyStats',
  {
    sort: { day: -1 },
    limit: 30
  }
);
```

#### Demo Application

Check out our [Token Analytics Demo](https://github.com/aleph-im/token-analytics-demo) for a complete implementation.

## Building Your Own DeFi Integration

Follow these steps to build your own DeFi integration with Aleph Cloud:

1. **Identify the DeFi protocol** you want to integrate with
2. **Determine the key metrics** and events to track
3. **Create an indexer** to capture on-chain events
4. **Design a data model** for storing and querying the indexed data
5. **Build a user interface** to visualize and interact with the data

### Example: Creating a Simple DEX Volume Tracker

```javascript
// 1. Define the indexer configuration
const dexIndexerConfig = {
  name: 'SimpleSwapTracker',
  description: 'Tracks swap volume for a DEX',
  network: 'ethereum',
  startBlock: 12000000,
  contracts: [
    {
      address: '0xDEXContractAddress',
      abi: [...], // DEX contract ABI
      events: [
        { name: 'Swap', handler: 'handleSwap' }
      ]
    }
  ],
  handlers: {
    handleSwap: `
      async function handleSwap(event, context) {
        const { sender, amount0In, amount1In, amount0Out, amount1Out } = event.args;
        
        // Determine which token was sold and which was bought
        let soldToken, boughtToken, soldAmount, boughtAmount;
        
        if (amount0In > 0) {
          soldToken = 'token0';
          soldAmount = amount0In.toString();
          boughtToken = 'token1';
          boughtAmount = amount1Out.toString();
        } else {
          soldToken = 'token1';
          soldAmount = amount1In.toString();
          boughtToken = 'token0';
          boughtAmount = amount0Out.toString();
        }
        
        // Store the swap
        await context.store.set('swaps', event.transactionHash, {
          sender,
          soldToken,
          soldAmount,
          boughtToken,
          boughtAmount,
          timestamp: event.block.timestamp,
          blockNumber: event.blockNumber
        });
        
        // Update daily volume
        const day = Math.floor(event.block.timestamp / 86400) * 86400;
        const dayId = day.toString();
        
        const dayData = await context.store.get('dailyVolume', dayId) || {
          day,
          token0Volume: '0',
          token1Volume: '0',
          swapCount: 0
        };
        
        if (soldToken === 'token0') {
          dayData.token0Volume = (BigInt(dayData.token0Volume) + BigInt(soldAmount)).toString();
        } else {
          dayData.token1Volume = (BigInt(dayData.token1Volume) + BigInt(soldAmount)).toString();
        }
        
        dayData.swapCount += 1;
        
        await context.store.set('dailyVolume', dayId, dayData);
      }
    `
  }
};

// 2. Create the indexer
const result = await aleph.indexer.create(dexIndexerConfig, { account });

// 3. Query the indexed data
const recentSwaps = await aleph.indexer.query(
  'SimpleSwapTracker',
  'swaps',
  {
    sort: { timestamp: -1 },
    limit: 20
  }
);

const volumeData = await aleph.indexer.query(
  'SimpleSwapTracker',
  'dailyVolume',
  {
    sort: { day: -1 },
    limit: 30
  }
);
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

Join our community to share your DeFi integrations, get help, and collaborate with other developers building on Aleph Cloud!
