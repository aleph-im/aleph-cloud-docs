# Permissions

## Overview

All Aleph Cloud message types contain an `address` content field representing the object owner on the network.
Core Channel Nodes validate that the message sender has authorization to publish on behalf of that owner.

There are two authorization scenarios:

1. **Direct ownership**: The sender address matches the content address.
2. **Delegated access**: The owner's security aggregate permits the sender.

## Address-Based Permissions

Messages in Aleph Cloud are associated with an `address` field. This address represents the identity of the message creator and is derived from the user's cryptographic key pair. The address format depends on the chain used for authentication:

- Ethereum-compatible chains: `0x` prefixed address
- Substrate-compatible chains: SS58 formatted address
- Solana: Base58 encoded public key
- Other supported chains: Chain-specific address format

## Permission Rules

1. **Message Creation**: Any user with a valid cryptographic key pair can create messages.
2. **Message Modification**: Only the owner of a message (or an authorized delegate) can modify or update that message.
3. **Message Deletion**: Only the owner (or an authorized delegate) can issue FORGET messages to delete their messages.
4. **Aggregate Updates**: Only the owner of an aggregate (or an authorized delegate) can update its content.

## Verification Process

When a message is received by the network:

1. The signature included in the message is verified against the claimed sender address.
2. The sender is checked for authorization: either `sender == content.address` (direct ownership) or the owner's security aggregate grants permission to the sender.
3. If authorization passes, the message is accepted and propagated.
4. If the signature is invalid or authorization fails, the message is rejected.

## The Security Aggregate

The security aggregate is a reserved aggregate used for managing permissions. It has the following constraints:

- It can only be modified by sending an AGGREGATE message on the `security` channel.
- An address can only set permissions for itself, meaning `sender == content.address` must apply for security aggregate messages.

### The `authorizations` Subkey

Users can authorize other addresses to act on their behalf by populating the `authorizations` subkey of their security aggregate. This subkey contains an array of authorization objects.

Each authorization object supports the following fields:

| Field            | Type                  | Description                                        |
| ---------------- | --------------------- | -------------------------------------------------- |
| `address`        | `str`                 | The address to authorize.                          |
| `chain`          | `Optional[str]`       | Restrict authorization to a specific blockchain.   |
| `channels`       | `Optional[List[str]]` | Restrict authorization to specific channels.       |
| `types`          | `Optional[List[str]]` | Restrict authorization to specific message types.  |
| `post_types`     | `Optional[List[str]]` | Restrict authorization to specific post types.     |
| `aggregate_keys` | `Optional[List[str]]` | Restrict authorization to specific aggregate keys. |

### How Filters Work

Filters inside an authorization object are **exclusive**. When a filter is specified, only the listed values are permitted.

For example, an authorization with `"chain": "ETH"` and `"types": ["AGGREGATE"]` means the authorized address can only post AGGREGATE messages using an Ethereum wallet.

### Combining Permissions

Multiple authorization objects can be created for the same address to combine different permissions. For example, you could grant an address:

- Permission to post AGGREGATEs on one channel.
- Permission to post POSTs on another channel.

Each authorization object is evaluated independently.

### Example

To grant address `0xABC...` permission to write to a specific aggregate key using Ethereum:

```json
{
  "address": "<owner-address>",
  "key": "security",
  "content": {
    "authorizations": [
      {
        "address": "0xABC...",
        "chain": "ETH",
        "types": ["AGGREGATE"],
        "aggregate_keys": ["my-app-settings"]
      }
    ]
  }
}
```

This authorization allows `0xABC...` to update only the `my-app-settings` aggregate key on behalf of the owner, and only via an Ethereum wallet.

## Best Practices

- Always securely store your private keys.
- Use the most restrictive authorization filters possible when delegating access.
- Combine multiple narrow authorization objects instead of one broad grant.
- Regularly audit the `authorizations` subkey of your security aggregate.

## Related Documentation

- [AGGREGATE](./object-types/aggregates.md)
- [FORGET](./object-types/forget.md)
- [POST](./object-types/posts.md)
- [PROGRAM](./object-types/programs.md)
- [STORE](./object-types/store.md)
