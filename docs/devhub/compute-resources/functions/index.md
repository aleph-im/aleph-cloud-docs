# Computing on Aleph Cloud

Aleph.cloud programs are applications running on the aleph.cloud network.
Each program defines the application to be executed, data to use, computing requirements
(number of CPUs, amount of RAM) and many more parameters.

Functions follow a serverless approach to easily deploy and maintain applications. They
offer [Function-as-a-service](https://en.wikipedia.org/wiki/Function_as_a_service) functionality.

Each function is instantiated as a __virtual machine__ running on a Compute Resource Node (CRN).
Virtual machines are emulated computer systems with dedicated resources that run isolated from each other.
Aleph.cloud Virtual Machines (VMs) are based on Linux.


## Overview of VMs

There are several types of VMs available on the network:

- [On-demand VM](#on-demand-execution)
- [Persistent VM](#persistent-execution)

An [On-demand VM](#on-demand-execution) is created on a [Compute Resource Node](/nodes/compute/introduction/)
(CRN) and is destroyed once the program has finished executing. This is great
for programs that are responding to user requests or API calls (using ASGI) and can shutdown
after processing the event. They are also cheaper to run as they only require
one tenth of the $ALEPH tokens to hold, compared to a [Persistent VM](#persistent-execution).

A [Persistent VM](#persistent-execution) can be used to run programs that cannot afford to stop or need
to handle incoming connections such as polling data from a websocket or AMQP API.

Instances are similar to Persistent VMs, but are specifically designed to run with
a SSH key supplied by the user. This allows the user to connect to the VM and
interact with it directly. They do not rely on code execution, but rather on
the user's ability to connect to the VM and run commands on it.
They cost as much as Persistent VMs.

## On-demand Execution {#on-demand-execution}

On how to deploy a simple Python microVM, see our [Python microVM guide](/devhub/compute-resources/functions/advanced/custom-builds/python/getting-started/)

## Persistent Execution {#persistent-execution}

When a program is created with persistent execution enabled, the aleph.cloud scheduler will find a Compute Resource Node
(CRN) with enough resources to run the program and schedule the program to start on that node.

Persistent programs are designed to always run exactly once, and the scheduler will reallocate the program on another
CRN would the current one go offline. 

> ⚠️ Automatic data migration across hosts in case such events happen is not available yet.

### Message Specification

The execution model of a program is defined in the field `message.content.on` of messages of type `PROGRAM` and is 
non exclusive. The same program can therefore be available as both persistent instance and on demand at the same time.

```javascript
message = {
    ...,
    "content": {
        ...,
        "on": {
          "http": false,
          "persistent": true
        },
        "resources": {
          "vcpus": 1,
          "memory": 128,
        }
    }
}
```

### Prerequisites

Before you begin this tutorial, ensure that you have the following:

* A computer with Python and the [aleph-client](https://github.com/aleph-im/aleph-client/) utility installed
* An Ethereum account with at least 2000 ALEPH token
* Working knowledge of Python

## Step 1: Create your program

Let's consider the following example from the 
  [FastAPI tutorial](https://fastapi.tiangolo.com/tutorial/first-steps/). Any other ASGI compatible 
Python framework should work as well.

> Running programs written in any language that works on Linux is possible. This will be documented later.

Create a file named `src/main.py`:
```python
from fastapi import FastAPI

app = FastAPI()


@app.get("/")
async def root():
    return {"message": "Hello World"}
```

Test the application locally:
```shell
cd ./src/
uvicorn main:app --reload
```

### Step 2: Run a program in  persistent mode

To run the program in a persistent manner on the aleph.cloud network, use: 

```shell
aleph program upload --persistent ./src/ main:app
```

You can stop the execution of the program using:

```shell
aleph unpersist $MESSAGE_ID
```
