# Supported Chains

Multiple blockchains are supported when interacting with Aleph Cloud.

The support of a chain consists in the functionalities below.
The support of a chain may be partial, when only some of these
functionalities are supported.

1. **Message signature**:
   Messages on the Aleph Cloud network must be signed using asymmetric a user's private key.
   Different chains may use public-key cryptography differently, resulting in different methods
   of verifying message signatures.
2. **Wallet support**:
   Interacting with Aleph Cloud in a browser and signing messages requires the use of a Wallet application.
   These applications are often specific to one or a few chains.
3. **Token availability**:
   Allocating resources on the Aleph Cloud network relies on a fungible onchain token.
   Exchanging that token on a blockchain requires that token to be available on that chain first.
4. **Balance support**:
   The Aleph Cloud network needs to be aware of user's tokens on each supported chain in order to allow
   users to allocate resources on the network. Some services are not available without balance support.
5. **Staking support**:
   Users can help securing the Aleph Cloud network by holding tokens and _staking_ them on
   [Core Channel Nodes](/nodes/core/introduction/) they consider trustworthy. The Aleph Cloud network
   interacts with blockchains to achieve this mechanism.
6. **PAYG support**:
   Users can pay for network resources in real-time by streaming tokens for the duration of their usage. When they open
   a token stream, payments flow continuously as long as they use the resource. Once they close the stream, payments
   stop, and the resource becomes inaccessible. This approach ensures users only pay for what they actively use,
   offering a flexible and efficient payment method.

| Chain     | Message signature | Wallet support            | Token availability | Balance support | Staking support | PAYG |
|-----------|-------------------|---------------------------|--------------------|-----------------|-----------------|------|
| Ethereum  | ✅                 | Metamask & Wallet Connect | ✅                 | ✅               | ✅              |      |
| Polygon   | ✅                 | Metamask & Wallet Connect |                    |                 |                 |      |
| Solana    | ✅                 | Phantom                   | ✅                 | ❌               | ❌              |      |
| Tezos     | ✅                 |                           |                    |                 |                 |      |
| Cosmos    | ✅                 |                           |                    |                 |                 |      |
| Nuls1     | Python only       |                           |                    |                 |                 |      |
| Nuls2     | Python only       |                           |                    |                 |                 |      |
| Substrate | ✅                 |                           |                    |                 |                 |      |
| Avalanche | ✅                 | Metamask & Wallet Connect | ✅                 |                 |                 | ✅    |
| BASE      | ✅                 | Metamask & Wallet Connect | ✅                 |                 |                 | ✅    |
| BNB       | ✅                 | Metamask & Wallet Connect | ✅                 |                 |                 |      |
