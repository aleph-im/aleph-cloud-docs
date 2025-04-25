# Indexing Framework

The [aleph.im Indexer Framework](https://github.com/aleph-im/aleph-indexer-framework) is a node.js and [moleculer](https://moleculer.services/) based framework for building multithreaded indexers to be deployed on the Aleph.im network. It provides a scalable architecture for tracking and processing blockchain events across multiple networks simultaneously.

## Overview

The Indexer Framework offers a comprehensive solution for blockchain data indexing with the following capabilities:

- **Multi-blockchain Support**: Index data from multiple blockchains in a single application
- **Scalable Architecture**: Horizontally scale microservices to meet demand
- **Real-time Processing**: Track blockchain events as they occur
- **Historical Data Indexing**: Fetch and process historical blockchain data
- **GraphQL API**: Expose indexed data through a flexible query interface

## Supported Blockchains

The framework currently supports indexing data from the following blockchains:

- **EVM-based chains**:
  - Ethereum
  - Binance Smart Chain (BSC)
  - Oasys L1
  - Oasys L2 (Homeverse)
- **Solana**

New blockchains can be added by implementing a blockchain adapter.

## Framework Architecture

The indexer's architecture is designed for scalability and high availability, incorporating three key microservices:

- **Fetcher**: Retrieves blockchain data
- **Parser**: Transforms raw data into structured formats
- **Indexer**: Processes and stores parsed data for efficient querying

These services communicate through an abstract transport layer, allowing for flexible deployment strategies.

## Indexing Options

### EVM Indexer

For EVM-based blockchains (Ethereum, BSC, Oasys), the framework provides capabilities to:

- Track smart contract events across different networks
- Process and store event data with custom business logic
- Filter events based on specific criteria
- Expose indexed data through a GraphQL API

The EVM indexer supports tracking events from multiple contracts and networks simultaneously.

### Solana IDL Indexer Generator

For Solana programs, the framework offers an Indexer Generator that:

- Automatically generates indexers from Anchor IDLs
- Creates boilerplate code for account tracking and event parsing
- Provides built-in statistics calculation
- Exposes program data through a GraphQL API with predefined queries

The generator simplifies the process of creating Solana indexers by handling the complex parsing of program instructions and accounts.

## Getting Started

To get started with the Indexer Framework, refer to the specific guides:

- [EVM Indexer Setup Guide](./evm-indexer.md): Comprehensive walkthrough for setting up an indexer for EVM-based blockchains
- [Solana IDL Indexer Guide](./solana-idl-indexer.md): Guide for generating and running Solana program indexers

## Documentation and Resources

- [Framework Documentation](https://aleph-im.github.io/aleph-indexer-framework/)
- [Indexer Library](https://github.com/aleph-im/aleph-indexer-library): Examples of working indexers
- [Solana Indexer Library](https://github.com/aleph-im/solana-indexer-library): Solana-specific indexer tools
