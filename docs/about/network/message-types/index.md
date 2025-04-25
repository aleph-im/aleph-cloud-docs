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

- [AGGREGATE](/devhub/guides/messages/object-types/aggregates.md): provide a decentralized key/value storage.
- [FORGET](/devhub/guides/messages/object-types/forget.md): delete other messages (see below).
- [POST](/devhub/guides/messages/object-types/posts.md): provide JSON documents (unique data points, events).
- [PROGRAM](/devhub/guides/messages/object-types/programs.md): create and update programs running in VMs (ex: lambda functions).
- [STORE](/devhub/guides/messages/object-types/storage.md)

## Using Messages

Messages can be created and sent using:

- [Python SDK](/devhub/sdks/python/)
- [TypeScript SDK](/devhub/sdks/typescript/)
- [Aleph Client CLI](/tools/aleph-cli/)
- [Web Console](/tools/webconsole/)

## Example Message Flow

1. A user creates a message using one of the SDKs or tools
2. The message is signed with the user's private key
3. The signed message is sent to a Core Channel Node (CCN)
4. The CCN validates the message and broadcasts it to the network
5. Other CCNs receive and process the message
6. If the message requires computation, it is assigned to a Compute Resource Node (CRN)
7. The result of the computation is made available through the network API

For more detailed information about using messages in your applications, see the [Developer Hub](/devhub/) section of the documentation.
