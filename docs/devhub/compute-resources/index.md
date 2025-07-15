# Computing on Aleph Cloud

Aleph Cloud offers a decentralized computing framework that allows users to run
applications on the network.

Two execution models are available:

 - [Functions](/devhub/compute-resources/functions/) follow a serverless 
   approach to easily deploy and maintain applications. They offer [Function-as-a-service](https://en.wikipedia.org/wiki/Function_as_a_service) functionality
 - [Instances](/devhub/compute-resources/standard-instances/) are designed to 
   provide a persistent environment for users to interact with directly. They offer full Virtual Machine running under qemu.

Functions can be executed in parallel on multiple Compute Resource Nodes while there will only one running instance on the network.  

In both cases, user workloads are executed inside virtual machines (VMs)
isolated from each other.

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

# Instances

See [Instances](/devhub/compute-resources/standard-instances/index.md)

In additions you can request usage of a [GPU](/devhub/compute-resources/gpu-instances/index.md) or use  [Confidential instances](/devhub/compute-resources/confidential-instances/01-confidential-instance-introduction.md) 
