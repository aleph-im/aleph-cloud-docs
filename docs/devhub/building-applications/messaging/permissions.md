# Message Permissions

## Overview

In the Aleph Cloud messaging system, permissions determine who can create, modify, or delete messages. This document explains the permission model used across all message types.

## Address-Based Permissions

Messages in Aleph Cloud are associated with an `address` field. This address represents the identity of the message creator and is derived from the user's cryptographic key pair. The address format depends on the chain used for authentication:

- Ethereum-compatible chains: `0x` prefixed address
- Substrate-compatible chains: SS58 formatted address
- Solana: Base58 encoded public key
- Other supported chains: Chain-specific address format

## Permission Rules

1. **Message Creation**: Any user with a valid cryptographic key pair can create messages.

2. **Message Modification**: Only the original creator of a message (the owner of the private key corresponding to the message's `address`) can modify or update that message.

3. **Message Deletion**: Only the original creator can issue FORGET messages to delete their own messages.

4. **Aggregate Updates**: Only the original creator of an aggregate can update its content.

## Verification Process

When a message is received by the network:

1. The signature included in the message is verified against the claimed address
2. If the signature is valid, the message is accepted and propagated
3. If the signature is invalid, the message is rejected

## Best Practices

- Always securely store your private keys
- Use appropriate key management solutions for your application
- Consider implementing additional application-level permissions for complex use cases

## Related Documentation

- [AGGREGATE](./object-types/aggregates.md)
- [FORGET](./object-types/forget.md)
- [POST](./object-types/posts.md)
- [PROGRAM](./object-types/programs.md)
- [STORE](./object-types/store.md)
