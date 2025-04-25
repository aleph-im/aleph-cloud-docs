# Compute Resource Nodes Introduction

<ActionButtons>
  <ActionButton theme="brand" text="Hardware Requirements" link="#hardware-requirements" />
  <ActionButton theme="brand" text="Get started" link="#get-started" />
</ActionButtons>

## What are Compute Resource Nodes?

Aleph Cloud Compute Resource Nodes (CRNs) are decentralized computing infrastructure components that form a vital part of the Aleph Cloud network. These nodes work collectively to provide distributed and secure computing power, storage, and other resources to users and applications on the platform.

Compute Resource Nodes are designed to support a wide range of tasks, including:
- Off-chain smart contract execution
- Decentralized application (dApp) hosting
- Decentralized file storage
- Function execution
- Virtual machine provisioning
- GPU processing
- Confidential computing

These nodes enable users to access and utilize decentralized computing resources without relying on centralized servers or cloud providers, ensuring better privacy, security, and control over their data and applications.

## Network Architecture

CRNs are connected to Core Channel Nodes (CCNs) in the Aleph Cloud network. Each CCN can connect to up to five CRNs, and the CCNs distribute workloads to their connected CRNs. This architecture ensures that the network remains resilient against single points of failure, as the removal of one node does not impact the overall functioning of the system.

In return for their contributions, node operators are rewarded with ALEPH tokens, creating an incentive system for maintaining a healthy and robust ecosystem.

## Node Security

Aleph Cloud employs advanced cryptographic techniques and consensus algorithms to ensure that the Compute Resource Nodes operate securely and reliably. The network uses microVMs (micro virtual machines) to isolate workloads and ensure that one user's application cannot interfere with another's.

## Hardware Requirements {#hardware-requirements}

To run a Compute Resource Node effectively, you'll need:

### Server Type

- **Bare Metal Server**: Virtual servers are typically not suitable as they often lack the performance and nested virtualization capabilities required for CRNs.

### Processor

Your server should use x86_64 (alias amd64) architecture with one of the following CPU configurations:

- **Gaming/Desktop CPU**: 
  - Minimum 8 cores / 16 threads
  - 3.0GHz+ clock speed
  - Optimized for fast boot-up of microVMs
  - Examples: Intel Core i9, AMD Ryzen 9

- **Datacenter CPU**:
  - Minimum 12 cores / 24 threads
  - 2.4GHz+ clock speed
  - Optimized for handling multiple concurrent workloads
  - Examples: Intel Xeon, AMD EPYC

::: warning
- **Confidential Computing**:
  - Requires 4th Generation AMD EPYC™ Processors (9004 Series or 8004 Series)
  - Must support Secure Encrypted Virtualization (SEV)
:::

### Memory

- **Minimum**: 64GB RAM
- **Recommended**: 128GB RAM or more for better performance with multiple concurrent workloads

### Storage

- **Capacity**: Minimum 1TB
- **Type**:
  - NVME SSD preferred for best performance
  - Datacenter-grade fast HDD possible, but requires a large and fast cache
- **Configuration**:
  - Consider RAID for data redundancy
  - Separate system and data drives recommended

### Connectivity

- **Bandwidth**: Minimum 500 Mbit/s (1 Gbit/s recommended)
- **IP Configuration**: Both IPv4 and IPv6 must be configured
- **Stability**: Reliable, low-latency connection required
- **Firewall**: Ability to open necessary ports

### Software Requirements

- **Operating System**: Debian 12 (Bookworm) or Ubuntu 24.04 LTS
- **Virtualization**: CPU must support hardware virtualization (Intel VT-x or AMD-V)
- **Containers**: Docker and Containerd properly configured for microVM support

## Get Started {#get-started}

If you're interested in running a Compute Resource Node:

1. Follow the [Installation Guide](/nodes/compute/installation/ubuntu-24.04/) to set up your node
2. Learn about [Advanced Features](/nodes/compute/advanced/enable-confidential/) such as confidential computing

Running a Compute Resource Node is a significant contribution to the Aleph.im ecosystem and helps provide the computing power needed for decentralized applications.
