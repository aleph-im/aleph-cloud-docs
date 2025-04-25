# Consensus Mechanism

Aleph Cloud uses a unique consensus mechanism that differs from traditional blockchain consensus models. This page explains how consensus works in the Aleph Cloud network and how it ensures data integrity and availability.

## Overview of Aleph Cloud Consensus

Unlike traditional blockchains that use Proof of Work or Proof of Stake, Aleph Cloud employs a message-based consensus system with verification by Core Channel Nodes (CCNs). This approach allows for faster processing while maintaining security.

## Key Components

### Message Verification

When a message is submitted to the network:

1. The signature is verified to ensure it came from the claimed sender
2. The message format and content are validated
3. The message is checked against network rules and policies

### Message Propagation

Verified messages are propagated through the network:

1. The receiving CCN broadcasts the message to other connected CCNs
2. Each CCN verifies the message independently
3. The message becomes part of the network's state once it has been accepted by a sufficient number of CCNs

### State Agreement

CCNs maintain agreement on the network state through:

1. Regular synchronization of message databases
2. Verification of message order and dependencies
3. Resolution of conflicts using timestamp and other metadata

## Consensus for Compute Tasks

For compute tasks and virtual machine instances:

1. CCNs use a deterministic algorithm to assign tasks to specific CRNs
2. Multiple CCNs can verify the results of computation
3. For critical applications, results can be verified by multiple CRNs

## Consensus for Storage

For data storage:

1. Data is replicated across multiple nodes for redundancy
2. Content addressing (similar to IPFS) ensures data integrity
3. CCNs maintain references to stored data and verify availability

## Finality and Confirmation

Unlike blockchain systems with probabilistic finality, Aleph Cloud messages have practical finality once they have been:

1. Propagated to a majority of CCNs
2. Incorporated into the network state
3. Referenced by subsequent messages

## Advantages of Aleph Cloud Consensus

- **Speed**: No mining or complex consensus algorithms to slow down processing
- **Efficiency**: Lower resource requirements compared to blockchain consensus
- **Flexibility**: Different types of messages can have different consensus requirements
- **Scalability**: The system can scale by adding more nodes without sacrificing performance
