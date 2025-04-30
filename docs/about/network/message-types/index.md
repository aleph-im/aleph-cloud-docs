# Messages

At its core, the Aleph Cloud network is a messaging system. All the data that transits on the network is represented by Aleph Cloud messages that represent all the possible operations on the network.

With Aleph Cloud messages, you can, for example:

- store files
- pin content on IPFS
- create decentralized programs
- set up key/value databases.

Users create, sign and transmit messages on the Aleph Cloud network. This can be achieved in a variety of ways:

- by posting a message to a Core Channel Node
- by broadcasting the message on the Aleph Cloud peer-to-peer network
- by using the Aleph Cloud smart contracts deployed on supported chains.

## Message types

Actual content sent by regular users can currently be of five types:

- [AGGREGATE](/devhub/building-applications/messaging/object-types/aggregates): provide a decentralized key/value storage.
- [FORGET](/devhub/building-applications/messaging/object-types/forget): delete other messages (see below).
- [POST](/devhub/building-applications/messaging/object-types/posts): provide JSON documents (unique data points, events).
- [PROGRAM](/devhub/building-applications/messaging/object-types/programs): create and update programs running in VMs (ex: lambda functions).
- [STORE](/devhub/building-applications/messaging/object-types/store)

## Using Messages

Messages can be created and sent using:

- [Python SDK](/devhub/sdks-and-tools/python-sdk/)
- [TypeScript SDK](/devhub/sdks-and-tools/typescript-sdk/)
- [Aleph Client CLI](/devhub/sdks-and-tools/aleph-cli/)
- [Web Console](https://app.aleph.cloud)

## Example Message Flow

1. A user creates a message using one of the SDKs or tools
2. The message is signed with the user's private key
3. The signed message is sent to a Core Channel Node (CCN)
4. The CCN validates the message and broadcasts it to the network
5. Other CCNs receive and process the message
6. If the message requires computation, it is assigned to a Compute Resource Node (CRN)
7. The result of the computation is made available through the network API

For more detailed information about using messages in your applications, see the [Developer Hub](/devhub/) section of the documentation.
