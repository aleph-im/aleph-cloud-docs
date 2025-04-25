# How Aleph Cloud Works

## The Aleph Cloud Network

The Aleph Cloud network is composed of 2 sets of nodes:

- **CCNs (Core Channel Nodes)**: The backbone of the P2P network. They serve as an entry point into the network through an API (similar to a blockchain node's RPC).
- **CRNs (Compute Resource Nodes)**: Responsible for the actual compute and storage available on Aleph Cloud. CRNs must be tied manually to a single CCN, and each CCN is incentivized to tie up to 3 CRNs.

![CCN-Network](/assets/images/network/CCN-Network.svg)

## Messages

In Aleph Cloud terminology, a "_message_" is similar to a "_transaction_" for a blockchain: it is a set of data sent by an end user, propagated through the entire peer-to-peer network.
A message can be generated using either the [Python SDK](/devhub/sdks/python/) or [TypeScript SDK](/devhub/sdks/typescript/), or through [aleph-client](/tools/aleph-cli/) or the [Console](https://console.aleph.cloud/).

These messages can contain several different instructions, such as reading or writing posts, programs/functions, or indexing data created on external blockchains.

## Payment

Aleph does not operate as a blockchain but utilizes its native cryptocurrency,
referred to as the _ALEPH_ token, which functions across various blockchains.

This token serves two primary purposes: support users payments for the resources they
allocate on the network, and incentivize node operators to maintain the network's integrity.

The first payment implementation is achieved through a staking mechanism,
where users must hold a certain amount of ALEPH tokens to use the network's resources.
This mechanism is in place for file storage and for persistent virtual machines.

In January 2024, the network started supporting a new payment model, together with the launch
of the [TwentySix Cloud](https://www.twentysix.cloud/) platform,
where users pay using streams of ALEPH tokens on compatible chains.

## Example Workflow

Let's take the example of a user who wants to run a program on the Aleph Cloud network:

1. The user makes sure to have an Ethereum wallet holding a sufficient number of ALEPH tokens
2. The user writes and sends a message using either the aleph python client, one of the SDKs, or the web dashboard
3. The message arrives at a CCN, which then broadcasts that message to all CCNs in the network
4. The "program" workload scheduled by the user's message gets assigned to one of the CCNs
5. The assigned CCN now assigns that workload onto one of its CRNs
6. The assigned CRN starts a virtual machine executing the user's requested workload.
