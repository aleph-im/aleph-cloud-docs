# On-demand Execution

On-demand execution on Aleph Cloud allows you to run code in response to specific triggers, similar to serverless functions or Function-as-a-Service (FaaS) platforms. This guide explains how to use on-demand execution for your applications.

## Overview

On-demand execution is ideal for:
- API endpoints that respond to HTTP requests
- Event-driven processing
- Scheduled tasks
- Stateless microservices
- Webhook handlers

Your code is executed only when needed, and you pay only for the resources consumed during execution.

## How It Works

1. You deploy your function code to the Aleph Cloud network
2. The function is distributed to Compute Resource Nodes (CRNs)
3. When triggered, the function executes on available CRNs
4. Results are returned to the caller

Functions can be triggered via:
- HTTP requests
- Aleph Cloud messages
- Scheduled events
- Blockchain events (through indexers)

## Supported Runtimes

Aleph Cloud supports multiple runtimes for on-demand execution:

- **Node.js** (versions 16, 18, 20)
- **Python** (versions 3.9, 3.10, 3.11)
- **Rust** (via WASM)
- **Custom runtimes** (via Docker containers)

## Deploying a Function

::: code-group

```ts [TypeScript]
import { AlephHttpClient } from '@aleph-sdk/client';
import { ETHAccount } from '@aleph-sdk/core';

const aleph = new AlephHttpClient();

async function deployFunction() {
  const result = await aleph.program.deploy({
    name: 'hello-world',
    description: 'A simple hello world function',
    code: `
      export default function(req) {
        const name = req.query.name || 'World';
        return { message: \`Hello, \${name}!\` };
      }
    `,
    runtime: 'nodejs16',
    memory: 128, // MB
    timeout: 10, // seconds
  });
  
  console.log(`Function deployed with ID: ${result.programId}`);
  console.log(`Endpoint URL: ${result.endpoint}`);
  
  return result;
}
```

```python [Python]
from aleph_sdk_python.asynchronous import AsyncClient
from aleph_sdk_python.program import create_program

async def deploy_function():
    client = AsyncClient()
    
    code = """
def handler(req):
    name = req.get('query', {}).get('name', 'World')
    return {'message': f'Hello, {name}!'}
    """
    
    result = await create_program(
        client=client,
        program_name="hello-world",
        program_code=code,
        runtime="python3.9",
        memory=128,
        timeout=10,
    )
    
    print(f"Function deployed with ID: {result['item_hash']}")
    print(f"Endpoint URL: https://api2.aleph.im/api/v0/run/{result['item_hash']}")
    
    return result
```
:::

### Using the CLI

```bash
aleph program deploy \
  --name "hello-world" \
  --runtime nodejs16 \
  --memory 128 \
  --timeout 10 \
  --file ./function.js
```

## Invoking a Function

Once deployed, you can invoke your function in several ways:

### HTTP Request

```bash
curl "https://api2.aleph.im/api/v0/run/{program_id}?name=Alice"
```

::: code-group

```ts [TypeScript]
const response = await aleph.program.call(programId, { 
  query: { name: 'Alice' } 
});
console.log(response); // { message: 'Hello, Alice!' }
```

```python [Python]
response = await client.program.call(
    program_hash=program_id,
    data={"query": {"name": "Alice"}}
)
print(response)  # {'message': 'Hello, Alice!'}
```
:::

## Function Context

Your functions have access to a context object that provides information about the execution environment:

### Node.js Example

```javascript
export default function(req, context) {
  console.log('Request method:', req.method);
  console.log('Request path:', req.path);
  console.log('Request query:', req.query);
  console.log('Request body:', req.body);
  console.log('Request headers:', req.headers);
  
  console.log('Function ID:', context.functionId);
  console.log('Execution node:', context.nodeId);
  console.log('Aleph account:', context.account);
  
  return { received: true };
}
```

### Python Example

```python
def handler(req, context=None):
    print(f"Request method: {req.get('method')}")
    print(f"Request path: {req.get('path')}")
    print(f"Request query: {req.get('query')}")
    print(f"Request body: {req.get('body')}")
    print(f"Request headers: {req.get('headers')}")
    
    if context:
        print(f"Function ID: {context.get('function_id')}")
        print(f"Execution node: {context.get('node_id')}")
        print(f"Aleph account: {context.get('account')}")
    
    return {"received": True}
```

## Working with Storage

Functions can interact with Aleph Cloud storage to persist data between executions:

```javascript
export default async function(req, context) {
  const { aleph } = context;
  
  // Store data
  const storeResult = await aleph.store.set({
    key: 'user-data',
    value: { name: 'Alice', visits: 5 }
  });
  
  // Retrieve data
  const getData = await aleph.store.get('user-data');
  
  return { stored: storeResult, retrieved: getData };
}
```

## Best Practices

1. **Keep functions small and focused** - Functions should do one thing well
2. **Minimize cold start times** - Avoid heavy dependencies when possible
3. **Handle errors gracefully** - Implement proper error handling
4. **Use appropriate timeouts** - Set realistic timeouts for your functions
5. **Optimize memory usage** - Request only the memory you need
6. **Use environment variables** for configuration
7. **Implement proper logging** for debugging

## Limitations

- **Execution time**: Functions have a maximum execution time (configurable up to 60 seconds)
- **Memory**: Functions have a maximum memory allocation (configurable up to 1GB)
- **Disk space**: Limited temporary disk space is available during execution
- **Network access**: Functions can make outbound network requests but cannot bind to ports

## Next Steps

- [Persistent Execution](/devhub/computing/persistent/) - For long-running applications
- [Confidential Computing](/devhub/computing/confidential/) - For enhanced security
- [Storage Guide](/devhub/guides/storage/) - Learn how to store data on Aleph Cloud
