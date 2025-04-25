# Computing on Aleph Cloud

Welcome to the Aleph Cloud Computing documentation. This section covers everything developers need to know about using Aleph Cloud's decentralized computing capabilities in their applications.

## Overview

Aleph Cloud provides a decentralized computing platform that allows you to run applications and services without relying on centralized cloud providers. Our network of Compute Resource Nodes (CRNs) offers:

- **Decentralized Execution**: Run code across a network of independent nodes
- **Persistent & On-demand Computing**: Choose the execution model that fits your needs
- **Confidential Computing**: Enhanced security with hardware-level encryption
- **Web3 Integration**: Native support for blockchain applications and services

## Computing Options

Aleph Cloud offers multiple computing models to suit different development use cases:

### [On-demand Execution](/devhub/computing/on-demand/)

On-demand execution is perfect for stateless functions and microservices that need to be executed in response to specific triggers:

- Function-as-a-Service (FaaS) model
- Pay only for the resources you use
- Automatic scaling based on demand
- Ideal for API backends, data processing, and event-driven applications

[Learn more about On-demand Execution →](/devhub/computing/on-demand/)

### [Persistent Execution](/devhub/computing/persistent/)

Persistent execution provides long-running virtual machines for applications that need to maintain state and be continuously available:

- Virtual machine instances that run 24/7
- Full operating system access
- Persistent storage options
- Ideal for web servers, databases, and always-on applications

[Learn more about Persistent Execution →](/devhub/computing/persistent/)

### [Confidential Computing](/devhub/computing/confidential/)

For applications handling sensitive data, Aleph Cloud offers confidential computing with hardware-level encryption:

- Memory and disk encryption using AMD SEV technology
- Protection from node operators and external threats
- Secure execution environment for sensitive workloads
- Ideal for financial applications, healthcare data processing, and privacy-focused services

[Learn more about Confidential Computing →](/devhub/computing/confidential/)

## Integration with Your Applications

::: code-group

```ts [TypeScript]
import { AlephHttpClient } from '@aleph-sdk/client';
import { ETHAccount } from '@aleph-sdk/core';

const aleph = new AlephHttpClient();

// Deploy an on-demand function
const result = await aleph.program.deploy({
  name: 'my-function',
  code: `
    export default function(req) {
      return { message: 'Hello from Aleph Cloud!' };
    }
  `,
  runtime: 'nodejs16',
});

// Call the function
const response = await aleph.program.call(result.programId, {});
console.log(response); // { message: 'Hello from Aleph Cloud!' }
```

```python [Python]
from aleph_sdk_python.asynchronous import AsyncClient
from aleph_sdk_python.vm.instance import create_vm

async def deploy_vm():
    client = AsyncClient()
    
    # Create a persistent VM
    vm_hash = await create_vm(
        client=client,
        cpu=1,
        memory=2,
        disk=10,
        image_name="debian:11",
        ssh_key="ssh-rsa AAAA...",
    )
    
    print(f"VM deployed with hash: {vm_hash}")
```
:::

## Getting Started

To start using Aleph Cloud's computing capabilities:

1. Choose the computing model that best fits your use case
2. Set up an Aleph Cloud account and obtain ALEPH tokens for payment
3. Follow our guides to deploy your first application
4. Monitor and manage your computing resources through our tools

## Tools and Resources

Aleph Cloud provides several tools to help you work with our computing platform:

- [Aleph Cloud Client](/tools/aleph-cli/) - Command-line tool for managing computing resources
- [Web Console](/tools/webconsole/) - Web interface for deploying and managing applications
- [SDKs](/devhub/sdks/typescript/) - Libraries for programmatic access to Aleph Cloud services

## Use Cases

Aleph Cloud's computing platform is being used for a wide range of applications:

- **DeFi Backends**: Powering decentralized finance applications
- **NFT Metadata Services**: Serving metadata for NFT collections
- **Web3 APIs**: Providing APIs for blockchain data and services
- **Decentralized Websites**: Hosting websites with no single point of failure
- **AI/ML Processing**: Running machine learning models in a decentralized environment

## Next Steps

Ready to dive deeper? Check out our detailed guides for each computing model:

- [On-demand Execution Guide](/devhub/computing/on-demand/)
- [Persistent Execution Guide](/devhub/computing/persistent/)
- [Confidential Computing Guide](/devhub/computing/confidential/)
