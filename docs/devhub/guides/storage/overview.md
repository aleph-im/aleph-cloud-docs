# Storage Guide

Aleph Cloud provides a decentralized storage solution that enables developers to store various types of data with persistence, redundancy, and censorship resistance. This guide explains how to use Aleph Cloud's storage capabilities for different use cases.

## Overview

Aleph Cloud's storage system offers several key features:

- **Persistence**: Data is stored permanently on the network
- **Redundancy**: Data is replicated across multiple nodes for reliability
- **Censorship Resistance**: No single entity can remove or modify your data
- **Flexible Data Types**: Support for messages, files, aggregates, and more
- **IPFS Integration**: All content is accessible via IPFS as well as HTTP
- **Cross-Chain Authentication**: Sign data with various blockchain accounts

## Storage Types

Aleph Cloud provides several storage types for different use cases:

### Messages

Messages are the most basic storage unit on Aleph Cloud. They can contain any JSON-serializable data and are immutable once created.

### Files

Files can be any binary data, such as images, videos, documents, etc. They are stored efficiently and can be retrieved via HTTP or IPFS.

### Aggregates

Aggregates are similar to documents in a database. They can be updated over time while maintaining a history of changes.