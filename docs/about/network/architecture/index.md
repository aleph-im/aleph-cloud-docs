# Network Architecture

The Aleph Cloud network is designed as a decentralized, peer-to-peer system that provides both storage and computing capabilities. This page explains the architecture of the network and how its components interact.

## Network Overview

![The Aleph Cloud network](/assets/images/network/CCN-Network.svg)

The Aleph Cloud network consists of two primary types of nodes that work together to provide decentralized services:

### Core Channel Nodes (CCNs)

Core Channel Nodes form the backbone of the Aleph Cloud P2P network. They:

- Serve as entry points to the network through an API interface (similar to blockchain RPC nodes)
- Broadcast and propagate messages throughout the network
- Maintain the message history and state
- Coordinate workload distribution to Compute Resource Nodes
- Provide consensus on the network state

### Compute Resource Nodes (CRNs)

Compute Resource Nodes provide the actual computing and storage resources of the network. They:

- Execute programs and functions
- Store files and data
- Run persistent virtual machines
- Process indexing tasks
- Are tied to a specific CCN (each CCN can have up to 3 CRNs)

## Communication Flow

1. Users interact with the network by sending messages through SDKs, clients, or the web console
2. Messages are received by CCNs and propagated throughout the network
3. CCNs assign workloads to their connected CRNs
4. CRNs execute the requested operations and return results
5. Results are made available through the CCN API endpoints

## Network Resilience

The distributed nature of Aleph Cloud provides several advantages:

- No single point of failure
- Geographic distribution of resources
- Redundancy of data storage
- Load balancing across multiple nodes
- Resistance to censorship and attacks

## Network Scalability

The Aleph Cloud network can scale horizontally by adding more nodes:

- Additional CCNs improve message propagation and API availability
- Additional CRNs increase the network's computing and storage capacity
- The network can adapt to varying workloads by distributing tasks efficiently

For more detailed information about the specific node types, see the [Nodes](/nodes/) section of the documentation.
