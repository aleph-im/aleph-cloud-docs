# Authentication Guide

Aleph Cloud provides a secure and flexible authentication system that allows developers to authenticate users and sign messages using various blockchain accounts. This guide explains how to implement authentication in your applications using Aleph Cloud.

## Overview

Aleph Cloud's authentication system offers several key features:

- **Multi-chain Support**: Authenticate with Ethereum, Solana, and other supported blockchains
- **Message Signing**: Sign messages using blockchain accounts
- **Decentralized Identity**: No central authority for authentication
- **Flexible Integration**: Easy to integrate with existing web and mobile applications
- **Session Management**: Create and manage authenticated sessions

## Supported Authentication Methods

Aleph Cloud currently supports authentication with the following blockchain networks:

- Ethereum (and EVM-compatible chains)
- Solana
- Substrate (Polkadot/Kusama)
- NULS
- Cosmos

## Getting Started

### Prerequisites

- Basic knowledge of the blockchain you want to use for authentication
- The Aleph Cloud SDK for your preferred language
- A wallet or key management solution for the blockchain you're using

### Installation

::: code-group

```bash [TypeScript]
npm install @aleph-sdk/client
```

```bash [Python]
pip install aleph-client
```
:::

## Authentication with Ethereum

### Connecting with a Wallet

The most common way to authenticate with Ethereum is using a wallet like MetaMask.

::: code-group

```ts [TypeScript]
import { AlephHttpClient, AuthenticatedAlephHttpClient } from '@aleph-sdk/client';
import { getAccountFromProvider } from '@aleph-sdk/ethereum';

// Connect with Ethereum wallet (e.g., MetaMask)
async function connectWallet() {
  try {
    // Request access to the user's Ethereum accounts
    await window.ethereum.request({ method: 'eth_requestAccounts' });

    // Create an Ethereum account from the provider
    const account = await getAccountFromProvider(window.ethereum);
    console.log(`Connected with address: ${account.address}`);

    // Create an authenticated client
    const client = new AuthenticatedAlephHttpClient(account);
    return { account, client };
  } catch (error) {
    console.error('Failed to connect wallet:', error);
    throw error;
  }
}

// Use the account for authentication
const { account, client } = await connectWallet();
```
:::

### Using a Private Key

For server-side applications or testing, you can authenticate using a private key.

::: code-group

```ts [TypeScript]
import { AuthenticatedAlephHttpClient } from '@aleph-sdk/client';
import { importAccountFromPrivateKey } from '@aleph-sdk/ethereum';

// Create an account from a private key
const privateKey = '0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef';
const account = importAccountFromPrivateKey(privateKey);

// Create a client instance with the account
const client = new AuthenticatedAlephHttpClient(account);

// Now you can use the authenticated client
const result = await client.createPost({
  postType: 'example',
  content: { message: 'Hello, Aleph Cloud!' },
  channel: 'TEST',
  address: account.address,
  tags: ['example'],
  sync: true
});
```

```python [Python]
from aleph_sdk_python.asynchronous import AsyncClient
from aleph_sdk_python.chains.ethereum import ETHAccount

# Create an account from a private key
private_key = "0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef"
account = ETHAccount(private_key)

# Create a client instance with the account
client = AsyncClient(account=account)

# Now you can use the authenticated client
result = await client.create_store(
    {"message": "Hello, Aleph Cloud!"},
    tags=["example"]
)
```
:::

### Message Signing

When interacting with Aleph Cloud, messages are signed using your blockchain account.

::: code-group

```ts [TypeScript]
import { AuthenticatedAlephHttpClient } from '@aleph-sdk/client';
import { importAccountFromPrivateKey } from '@aleph-sdk/ethereum';
import { verifyEthereum } from '@aleph-sdk/ethereum';
import { SignableMessage } from '@aleph-sdk/message';

// Create an account
const account = importAccountFromPrivateKey('0x1234567890abcdef...');

// Create an authenticated client (signing happens automatically)
const client = new AuthenticatedAlephHttpClient(account);

// The SDK handles signing automatically when publishing messages
const result = await client.createPost({
  postType: 'example',
  content: { message: 'This message will be signed' },
  channel: 'TEST',
  address: account.address,
  tags: ['signed'],
  sync: true
});

// Manual signing (if needed)
const messageToSign: SignableMessage = {
  address: account.address,
  time: Math.floor(Date.now() / 1000),
  content: { data: 'Custom message content' }
};

const signature = await account.sign(messageToSign);
console.log(`Signature: ${signature}`);

// Verify a signature
const isValid = await verifyEthereum(
  messageToSign,
  signature,
  account.address
);
console.log(`Signature valid: ${isValid}`);
```

```python [Python]
# The signing happens automatically when using the SDK
result = await client.create_store(
    {"message": "This message will be signed"},
    tags=["signed"]
)

# Manual signing (if needed)
message = "Message to sign"
signature = account.sign(message)
print(f"Signature: {signature}")

# Verify a signature
is_valid = account.verify(message, signature, account.address)
print(f"Signature valid: {is_valid}")
```

:::

## Authentication with Solana

### Connecting with a Wallet

You can authenticate with Solana using wallets like Phantom or Solflare.

::: code-group

```typescript [TypeScript]
import { AlephHttpClient, AuthenticatedAlephHttpClient } from '@aleph-sdk/client';
import { getAccountFromProvider } from '@aleph-sdk/solana';

// Connect with Solana wallet (e.g., Phantom)
async function connectSolanaWallet() {
  try {
    const provider = window.solana; // Phantom wallet

    if (!provider.isConnected) {
      await provider.connect();
    }

    // Create a Solana account from the provider
    const account = await getAccountFromProvider(provider);
    console.log(`Connected with address: ${account.address}`);

    // Create an authenticated client
    const client = new AuthenticatedAlephHttpClient(account);
    return { account, client };
  } catch (error) {
    console.error('Failed to connect Solana wallet:', error);
    throw error;
  }
}

// Use the account for authentication
const { account, client } = await connectSolanaWallet();
```
:::

### Using a Private Key

For server-side applications or testing, you can authenticate using a private key.

::: code-group

```typescript [TypeScript]
import { AuthenticatedAlephHttpClient } from '@aleph-sdk/client';
import { importAccountFromPrivateKey } from '@aleph-sdk/solana';

// Create an account from a private key
const privateKey = new Uint8Array([...]); // Your private key as a byte array
const account = importAccountFromPrivateKey(privateKey);

// Create a client instance with the account
const client = new AuthenticatedAlephHttpClient(account);

// Now you can use the authenticated client
const result = await client.createPost({
  postType: 'example',
  content: { message: 'Hello from Solana!' },
  channel: 'TEST',
  address: account.address,
  tags: ['solana', 'example'],
  sync: true
});
```

```python [Python]
from aleph_sdk_python.asynchronous import AsyncClient
from aleph_sdk_python.chains.solana import SOLAccount

# Create an account from a private key
private_key = [1, 2, 3, ...] # Your private key as a list of bytes
account = SOLAccount(private_key)

# Create a client instance with the account
client = AsyncClient(account=account)

# Now you can use the authenticated client
result = await client.create_store(
    {"message": "Hello from Solana!"},
    tags=["solana", "example"]
)
```
:::

## Authentication with Other Chains

### Substrate (Polkadot/Kusama)

::: code-group

```typescript [TypeScript]
import { AuthenticatedAlephHttpClient } from '@aleph-sdk/client';
import { importAccountFromSeed } from '@aleph-sdk/substrate';

// Create an account from a seed phrase
const seed = 'your seed phrase here';
const account = importAccountFromSeed(seed);

// Create a client instance with the account
const client = new AuthenticatedAlephHttpClient(account);

// Now you can use the authenticated client
const result = await client.createPost({
  postType: 'example',
  content: { message: 'Hello from Polkadot!' },
  channel: 'TEST',
  address: account.address,
  tags: ['polkadot', 'example'],
  sync: true
});
```

```python [Python]
from aleph_sdk_python.asynchronous import AsyncClient
from aleph_sdk_python.chains.substrate import DOTAccount

# Create an account from a seed phrase
seed = "your seed phrase here"
account = DOTAccount(seed)

# Create a client instance with the account
client = AsyncClient(account=account)

# Now you can use the authenticated client
result = await client.create_store(
    {"message": "Hello from Polkadot!"},
    tags=["polkadot", "example"]
)
```
:::

### NULS

::: code-group

```typescript [TypeScript]
import { AuthenticatedAlephHttpClient } from '@aleph-sdk/client';
import { importAccountFromPrivateKey } from '@aleph-sdk/nuls';

// Create an account from a private key
const privateKey = 'your private key here';
const account = importAccountFromPrivateKey(privateKey);

// Create a client instance with the account
const client = new AuthenticatedAlephHttpClient(account);

// Now you can use the authenticated client
const result = await client.createPost({
  postType: 'example',
  content: { message: 'Hello from NULS!' },
  channel: 'TEST',
  address: account.address,
  tags: ['nuls', 'example'],
  sync: true
});
```

```python [Python]
from aleph_sdk_python.asynchronous import AsyncClient
from aleph_sdk_python.chains.nuls import NULSAccount

# Create an account from a private key
private_key = "your private key here"
account = NULSAccount(private_key)

# Create a client instance with the account
client = AsyncClient(account=account)

# Now you can use the authenticated client
result = await client.create_store(
    {"message": "Hello from NULS!"},
    tags=["nuls", "example"]
)
```
:::

## Session Management

For better user experience, you can implement session management to avoid requiring users to sign every message.

### Creating a Session

::: code-group

```typescript [TypeScript]
import { AlephHttpClient, AuthenticatedAlephHttpClient } from '@aleph-sdk/client';
import { getAccountFromProvider } from '@aleph-sdk/ethereum';

// Connect with wallet
async function createSession() {
  // Request access to the user's Ethereum accounts
  await window.ethereum.request({ method: 'eth_requestAccounts' });
  
  // Create an Ethereum account from the provider
  const account = await getAccountFromProvider(window.ethereum);
  
  // Create a client (we'll use this to create the session)
  const client = new AlephHttpClient();
  
  // Create a session (valid for 1 hour)
  const session = await client.session.create(account, {
    duration: 60 * 60 // 1 hour in seconds
  });
  
  // Save the session token
  localStorage.setItem('alephSession', session.token);
  
  // Create a new client with the session
  const sessionClient = new AlephHttpClient({
    sessionToken: session.token
  });
  
  // Use the session client (no need for signing each message)
  const result = await sessionClient.getPost({
    hash: 'QmMessageHash123',
  });
  
  return sessionClient;
}
```

```python [Python]
from aleph_sdk_python.asynchronous import AsyncClient
from aleph_sdk_python.chains.ethereum import ETHAccount
from aleph_sdk_python.session import create_session

# Create an account
private_key = "0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef"
account = ETHAccount(private_key)

# Create a session (valid for 1 hour)
session = await create_session(account, duration=3600)  # 1 hour in seconds

# Create a client with the session
session_client = AsyncClient(session_token=session.token)

# Use the session client (no need for signing each message)
result = await session_client.get_message("QmMessageHash123")
```
:::

### Verifying a Session

::: code-group

```typescript [TypeScript]
import { AlephHttpClient } from '@aleph-sdk/client';

// Get the session token
const token = localStorage.getItem('alephSession');

// Create a client
const client = new AlephHttpClient();

// Verify the session
try {
  const session = await client.session.verify(token);
  console.log(`Session valid until: ${new Date(session.expiresAt)}`);
  
  // Create a client with the verified session
  const sessionClient = new AlephHttpClient({
    sessionToken: token
  });
  
  // Use the session client
  const result = await sessionClient.getPost({
    hash: 'QmMessageHash123',
  });
  
  return sessionClient;
} catch (error) {
  console.error('Session invalid or expired:', error);
  // Handle invalid session (e.g., redirect to login)
  return null;
}
```

```python [Python]
from aleph_sdk_python.asynchronous import AsyncClient
from aleph_sdk_python.session import verify_session

# Get the session token
token = "your_session_token"

try:
    # Verify the session
    session = await verify_session(token)
    print(f"Session valid until: {session.expires_at}")
    
    # Create a client with the verified session
    session_client = AsyncClient(session_token=token)
    
    # Use the session client
    result = await session_client.get_message("QmMessageHash123")
except Exception as e:
    print(f"Session invalid or expired: {e}")
    # Handle invalid session (e.g., redirect to login)
```
:::

### Revoking a Session

::: code-group

```typescript [TypeScript]
import { AlephHttpClient } from '@aleph-sdk/client';

// Get the session token
const token = localStorage.getItem('alephSession');

// Create a client
const client = new AlephHttpClient();

// Revoke the session
await client.session.revoke(token);

// Clear the stored token
localStorage.removeItem('alephSession');
```

```python [Python]
from aleph_sdk_python.session import revoke_session

# Get the session token
token = "your_session_token"

# Revoke the session
await revoke_session(token)

# Clear the stored token (if using a storage mechanism)
```
:::

## Authentication in Web Applications

### React Authentication Hook

Here's a simple React hook for managing authentication with Aleph Cloud:

::: code-group

```jsx [React]
import { useState, useEffect } from 'react';
import { AlephHttpClient, AuthenticatedAlephHttpClient } from '@aleph-sdk/client';
import { getAccountFromProvider } from '@aleph-sdk/ethereum';

export function useAlephAuth() {
  const [client, setClient] = useState(null);
  const [account, setAccount] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Initialize the client
  useEffect(() => {
    const baseClient = new AlephHttpClient();
    setClient(baseClient);

    // Check for existing session
    const sessionToken = localStorage.getItem('alephSession');
    if (sessionToken) {
      baseClient.session.verify(sessionToken)
        .then(session => {
          setClient(new AlephHttpClient({
            sessionToken
          }));
          setAccount({ address: session.address });
        })
        .catch(error => {
          console.error('Invalid session:', error);
          localStorage.removeItem('alephSession');
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
  }, []);

  // Connect wallet function
  const connect = async () => {
    if (!client) return;

    setLoading(true);
    setError(null);

    try {
      // Request access to the user's Ethereum accounts 
      await window.ethereum.request({ method: 'eth_requestAccounts' });
      
      // Get account from provider
      const account = await getAccountFromProvider(window.ethereum);
      setAccount(account);
      
      // Create an authenticated client (for operations requiring signatures)
      const authClient = new AuthenticatedAlephHttpClient(account);

      // Create a session for improved UX
      const session = await client.session.create(account, {
        duration: 60 * 60 // 1 hour
      });

      localStorage.setItem('alephSession', session.token);
      setClient(new AlephHttpClient({
        sessionToken: session.token
      }));

      return account;
    } catch (error) {
      console.error('Connection failed:', error);
      setError(error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Disconnect function
  const disconnect = async () => {
    const sessionToken = localStorage.getItem('alephSession');
    if (sessionToken && client) {
      try {
        await client.session.revoke(sessionToken);
      } catch (error) {
        console.error('Failed to revoke session:', error);
      }
    }

    localStorage.removeItem('alephSession');
    setAccount(null);
    setClient(new AlephHttpClient());
  };

  return {
    client,
    account,
    loading,
    error,
    connect,
    disconnect,
    isConnected: !!account
  };
}
```
:::

### Using the Authentication Hook

::: code-group

```jsx [React]
import React from 'react';
import { useAlephAuth } from './useAlephAuth';
import { AuthenticatedAlephHttpClient } from '@aleph-sdk/client';

function AuthExample() {
  const { client, account, loading, error, connect, disconnect, isConnected } = useAlephAuth();

  const handleConnect = async () => {
    try {
      await connect();
    } catch (error) {
      console.error('Failed to connect:', error);
    }
  };

  const handleFetch = async () => {
    if (!client || !isConnected) return;

    try {
      // Read operation using session client
      const message = await client.getPost({
        hash: 'QmHash123'
      });
      console.log('Fetched message:', message);
    } catch (error) {
      console.error('Failed to fetch message:', error);
    }
  };

  const handlePost = async () => {
    if (!account || !isConnected) return;

    try {
      // Write operation requiring authenticated client
      const authClient = new AuthenticatedAlephHttpClient(account);
      const result = await authClient.createPost({
        postType: 'example',
        content: { message: 'Hello from my app!' },
        channel: 'TEST',
        address: account.address,
        tags: ['example', 'app'],
        sync: true
      });

      console.log('Posted message:', result);
    } catch (error) {
      console.error('Failed to post message:', error);
    }
  };

  return (
    <div>
      <h2>Aleph Cloud Authentication Example</h2>

      {loading ? (
        <p>Loading...</p>
      ) : isConnected ? (
        <div>
          <p>Connected as: {account.address}</p>
          <button onClick={disconnect}>Disconnect</button>
          <button onClick={handleFetch}>Fetch Message</button>
          <button onClick={handlePost}>Post Message</button>
        </div>
      ) : (
        <button onClick={handleConnect}>Connect Wallet</button>
      )}

      {error && <p className="error">{error}</p>}
    </div>
  );
}
:::

## Authentication in Mobile Applications

### React Native Integration

For React Native applications, you can use WalletConnect or a similar solution:

```jsx
import React, { useState, useEffect } from 'react';
import { View, Button, Text } from 'react-native';
import { AlephHttpClient } from '@aleph-sdk/client';
import { ETHAccount } from '@aleph-sdk/core';
import WalletConnect from '@walletconnect/client';
import AsyncStorage from '@react-native-async-storage/async-storage';

function AlephAuthMobile() {
  const [connector, setConnector] = useState(null);
  const [account, setAccount] = useState(null);
  const [client, setClient] = useState(null);

  useEffect(() => {
    // Initialize Aleph client
    const aleph = new AlephHttpClient();
    setClient(aleph);

    // Check for existing session
    AsyncStorage.getItem('walletconnect')
      .then(session => {
        if (session) {
          const sessionData = JSON.parse(session);
          if (sessionData.connected) {
            initWalletConnect();
          }
        }
      })
      .catch(error => {
        console.error('Failed to get session:', error);
      });
  }, []);

  const initWalletConnect = async () => {
    try {
      const connector = new WalletConnect({
        bridge: 'https://bridge.walletconnect.org',
        clientMeta: {
          description: 'Aleph Cloud Mobile App',
          url: 'https://aleph.cloud',
          icons: ['https://aleph.cloud/logo.png'],
          name: 'Aleph Cloud App'
        }
      });

      setConnector(connector);

      if (connector.connected) {
        const { accounts } = connector;
        handleAccountChanged(accounts[0]);
      }

      connector.on('connect', (error, payload) => {
        if (error) {
          console.error('Connection error:', error);
          return;
        }

        const { accounts } = payload.params[0];
        handleAccountChanged(accounts[0]);
      });

      connector.on('disconnect', (error) => {
        if (error) {
          console.error('Disconnect error:', error);
        }

        setAccount(null);
      });

      return connector;
    } catch (error) {
      console.error('WalletConnect init error:', error);
      throw error;
    }
  };

  const handleAccountChanged = async (address) => {
    if (!address) return;

    try {
      // Create an Ethereum account adapter for the connected address
      const ethAccount = new ETHAccount(null, {
        address,
        signCallback: async (message) => {
          try {
            const result = await connector.signPersonalMessage([message, address]);
            return result;
          } catch (error) {
            console.error('Signing error:', error);
            throw error;
          }
        }
      });

      setAccount(ethAccount);

      // Create a session with Aleph Cloud
      const aleph = new AlephHttpClient();
      const session = await aleph.session.create(ethAccount, {
        duration: 60 * 60 * 24 // 24 hours
      });

      await AsyncStorage.setItem('alephSession', session.token);

      // Update the client with the session
      setClient(new AlephHttpClient({ sessionToken: session.token }));
    } catch (error) {
      console.error('Failed to handle account:', error);
    }
  };

  const connect = async () => {
    try {
      const connector = await initWalletConnect();
      if (!connector.connected) {
        await connector.createSession();
      }
    } catch (error) {
      console.error('Connection error:', error);
    }
  };

  const disconnect = async () => {
    if (connector) {
      await connector.killSession();
    }

    await AsyncStorage.removeItem('alephSession');
    setAccount(null);
    setClient(new AlephHttpClient());
  };

  const storeMessage = async () => {
    if (!client || !account) return;

    try {
      const result = await client.storage.store(
        { message: 'Hello from mobile app!' },
        { tags: ['mobile', 'example'] }
      );

      console.log('Stored message:', result);
    } catch (error) {
      console.error('Failed to store message:', error);
    }
  };

  return (
    <View>
      <Text>Aleph Cloud Mobile Authentication</Text>

      {account ? (
        <View>
          <Text>Connected: {account.address}</Text>
          <Button title="Disconnect" onPress={disconnect} />
          <Button title="Store Message" onPress={storeMessage} />
        </View>
      ) : (
        <Button title="Connect Wallet" onPress={connect} />
      )}
    </View>
  );
}
```

## Server-Side Authentication

For server-side applications, you can use a private key for authentication.

::: code-group

```javascript [Node.js]
const { AuthenticatedAlephHttpClient } = require('@aleph-sdk/client');
const { importAccountFromPrivateKey } = require('@aleph-sdk/ethereum');
const express = require('express');
const app = express();

// Create an account from a private key (store securely, e.g., in environment variables)
const privateKey = process.env.ALEPH_PRIVATE_KEY;
const account = importAccountFromPrivateKey(privateKey);

// Create a client instance with the account
const client = new AuthenticatedAlephHttpClient(account);

app.use(express.json());

// API endpoint to store data on Aleph Cloud
app.post('/api/store', async (req, res) => {
  try {
    const { data, tags } = req.body;

    // Store data on Aleph Cloud
    const result = await client.createPost({
      postType: 'data',
      content: data,
      channel: 'TEST',
      address: account.address,
      tags: tags || ['api', 'server'],
      sync: true
    });

    res.json({
      success: true,
      hash: result.item_hash
    });
  } catch (error) {
    console.error('Failed to store data:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
```

```python [FastAPI]
import os
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from aleph_sdk_python.asynchronous import AsyncClient
from aleph_sdk_python.chains.ethereum import ETHAccount

app = FastAPI()

# Create an account from a private key (store securely, e.g., in environment variables)
private_key = os.environ.get("ALEPH_PRIVATE_KEY")
account = ETHAccount(private_key)

# Create a client instance with the account
client = AsyncClient(account=account)

class StoreRequest(BaseModel):
    data: dict
    tags: list[str] = ["api", "server"]

@app.post("/api/store")
async def store_data(request: StoreRequest):
    try:
        # Store data on Aleph Cloud
        result = await client.create_store(
            request.data,
            tags=request.tags
        )

        return {
            "success": True,
            "hash": result["item_hash"]
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
```
:::

## Authentication for DApps

### Web3Modal Integration

For decentralized applications, you can use Web3Modal to support multiple wallet providers:

::: code-group

```jsx [React]
import React, { useState, useEffect } from 'react';
import Web3Modal from 'web3modal';
import { ethers } from 'ethers';
import { AlephHttpClient, AuthenticatedAlephHttpClient } from '@aleph-sdk/client';
import { getAccountFromProvider } from '@aleph-sdk/ethereum';

// Configure Web3Modal
const providerOptions = {
  /* See Web3Modal documentation for options */
};

const web3Modal = new Web3Modal({
  network: 'mainnet',
  cacheProvider: true,
  providerOptions
});

function DAppAuth() {
  const [provider, setProvider] = useState(null);
  const [account, setAccount] = useState(null);
  const [alephClient, setAlephClient] = useState(null);

  useEffect(() => {
    // Check if user is already connected
    if (web3Modal.cachedProvider) {
      connectWallet();
    }
  }, []);

  const connectWallet = async () => {
    try {
      const provider = await web3Modal.connect();
      const ethersProvider = new ethers.providers.Web3Provider(provider);
      
      setProvider(provider);

      // Create an Ethereum account adapter using the Ethereum provider
      const account = await getAccountFromProvider(provider);
      setAccount(account);

      // Create an authenticated client for direct operations
      const authenticatedClient = new AuthenticatedAlephHttpClient(account);

      // Create a session for better UX
      const baseClient = new AlephHttpClient();
      const session = await baseClient.session.create(account, {
        duration: 60 * 60 // 1 hour
      });

      localStorage.setItem('alephSession', session.token);

      // Create a client with the session
      const sessionClient = new AlephHttpClient({
        sessionToken: session.token
      });

      setAlephClient(sessionClient);

      // Setup event listeners
      provider.on('accountsChanged', (accounts) => {
        if (accounts.length === 0) {
          disconnectWallet();
        } else {
          window.location.reload();
        }
      });

      provider.on('chainChanged', () => {
        window.location.reload();
      });

      provider.on('disconnect', () => {
        disconnectWallet();
      });
    } catch (error) {
      console.error('Connection error:', error);
    }
  };

  const disconnectWallet = async () => {
    if (provider?.disconnect) {
      await provider.disconnect();
    }

    web3Modal.clearCachedProvider();

    const sessionToken = localStorage.getItem('alephSession');
    if (sessionToken && alephClient) {
      try {
        // Create a new client to revoke the session
        const client = new AlephHttpClient();
        await client.session.revoke(sessionToken);
      } catch (error) {
        console.error('Failed to revoke session:', error);
      }
    }

    localStorage.removeItem('alephSession');
    setProvider(null);
    setAccount(null);
    setAlephClient(null);
  };

  const storeData = async () => {
    if (!alephClient) return;

    try {
      // Using the session client
      const post = await alephClient.getPost({
        hash: 'QmMessageHash123'
      });
      
      console.log('Fetched message:', post);
    } catch (error) {
      console.error('Failed to get data:', error);
    }
  };

  return (
    <div>
      <h2>Aleph Cloud DApp Authentication</h2>

      {account ? (
        <div>
          <p>Connected: {account.address}</p>
          <button onClick={disconnectWallet}>Disconnect</button>
          <button onClick={storeData}>Get Data</button>
        </div>
      ) : (
        <button onClick={connectWallet}>Connect Wallet</button>
      )}
    </div>
  );
}
```
:::

## Best Practices

### Security Considerations

- **Never expose private keys**: Store private keys securely and never include them in client-side code
- **Use sessions for better UX**: Create sessions to avoid requiring users to sign every message
- **Validate signatures**: Always validate signatures on the server side
- **Use HTTPS**: Always use HTTPS for API endpoints that handle authentication
- **Implement proper error handling**: Handle authentication errors gracefully

### Performance Optimization

- **Cache authentication state**: Store authentication state in local storage or cookies
- **Use session tokens**: Session tokens reduce the need for repeated signing
- **Implement proper loading states**: Show loading indicators during authentication

### User Experience

- **Clear error messages**: Provide clear error messages when authentication fails
- **Remember user preferences**: Store user preferences after authentication
- **Automatic reconnection**: Attempt to reconnect automatically when possible
- **Support multiple wallets**: Allow users to choose their preferred wallet

## Troubleshooting

### Common Issues

#### Wallet Connection Failed

If the wallet connection fails:

1. Check if the wallet extension is installed and unlocked
2. Ensure you're connecting to the correct network
3. Check for console errors that might provide more details

#### Signature Request Not Showing

If the signature request doesn't appear:

1. Check if the wallet is properly connected
2. Ensure the message format is correct for the blockchain being used
3. Try refreshing the page and reconnecting

#### Session Expired

If a session expires unexpectedly:

1. Check the session duration setting
2. Implement automatic session renewal
3. Handle session expiration gracefully by redirecting to login

## Resources

- [TypeScript SDK Documentation](/devhub/sdks-and-tools/typescript-sdk/)
- [Python SDK Documentation](/devhub/sdks-and-tools/python-sdk/)
- [Aleph CLI Documentation](/devhub/sdks-and-tools/aleph-cli/)
