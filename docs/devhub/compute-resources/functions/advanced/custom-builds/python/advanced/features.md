# Advanced Python program features

## Aleph Cloud messages

The [aleph-sdk-python](https://github.com/aleph-im/aleph-sdk-python) library is pre-installed and 
pre-configured in the official Aleph-VM Python runtime. It is tweaked to work even
for programs with the access to internet disabled.

### Get messages

Use `aleph.sdk.client.AlephHttpClient` to get messages from the Aleph Cloud network.

```python
from aleph.sdk.client import AlephHttpClient
from aleph.sdk.query.filters import MessageFilter

async def get_messages():
    async with AlephHttpClient() as client:
        resp, status = await client.get_messages(
            message_filter=MessageFilter(
                channels=["TEST"],
            )
        )
        return resp.messages
```

## Post Aleph Cloud messages

Messages posted by VMs may not be authorized by the Aleph Cloud network yet.

Posting messages on the Aleph Cloud network requires signing them using a valid account.
Since programs are public, they should not contain secrets. Instead of signing messages
themselves, programs should therefore ask their execution host to sign messages on their behalf
using a `RemoteAccount`. The hash of the VM will be referenced in the message content `address` 
field.

```python
from datetime import datetime
from aleph.sdk.chains.remote import RemoteAccount
from aleph.sdk.client import AuthenticatedAlephHttpClient

async def create_post():
    account = await RemoteAccount.from_crypto_host(
        host="http://localhost", unix_socket="/tmp/socat-socket")
    
    content = {
        "date": datetime.utcnow().isoformat(),
        "test": True,
        "answer": 42,
        "something": "interesting",
    }
    
    async with AuthenticatedAlephHttpClient(account) as client:
        message, status = await client.create_post(
            post_content=content,
            post_type="test",
            ref=None,
            channel="TEST",
            inline=True,
        )
```

## Shared cache

The shared cache is a simple key-value store available to programs to store information that would
be useful to persist between executions but can be recovered from other sources. 
The cache is specific to one program on one execution node.

The persistence of the cache should not be relied on - its content can be deleted anytime when
the program is not running. Important data must be persisted on the Aleph Cloud network. 

To use the cache, you can use the following methods:
```python
from aleph.sdk.vm.cache import VmCache
cache = VmCache()

async def f():
    await cache.set('key', 'value')
    value = await cache.get('key')
    await cache.delete('key')
```

## Volumes

Volumes consist in extra storage that can be used by programs. If a `mount` point
is specified, they will be mounted on the virtual machine filesystem before your program is
started.

### Immutable volumes

Immutable volumes contain extra files that can be used by a program and are stored on the Aleph Cloud 
network. They can be shared by multiple programs and updated independently of the code of the program.

You can use them to store Python libraries that your program depends on, use them in multiple
programs and update them independently of other programs.

#### 1. Create an immutable volume

Create with a volume containing a Python library:

```shell
mkdir extralib
cd extralib
mksquashfs extralib extra-lib.squashfs
```

Start an IPFS daemon:
```shell
ipfs daemon
```

Upload the volume to IPFS:
```shell
ipfs add extra-lib.squashfs
```
and retrieve the printed IPFS hash.

Pin the volume on Aleph Cloud using `aleph pin`:
```shell
aleph pin $IPFS_HASH --channel TEST
```

Mention the volume in the prompt of `aleph program (...)`

#### 2. Update an immutable volume

Follow the same procedure you used to create an immutable volume, but pin it with a
reference to the original using:

```shell
aleph pin $IPFS_HASH --ref $ORIGINAL_HASH
```

### Host persistent volumes

Host persistent volumes are empty volumes that your program can use to store information that
would be useful to persist between executions but can be recovered from other sources.
Like the cache, host persistent volumes are specific to one program on one execution node.

Unlike the cache, you can use these volumes to store any kind of files, including databases.

There is no guarantee that these volumes will not be deleted anytime when the
program is not running and important data must be persisted on the Aleph Cloud network.

Host persistent volumes have a fixed size and must be named. The name will be used in the future
to allow changing the mount point of a volume.


## Message structure

Full example 
https://github.com/aleph-im/aleph-message/blob/main/aleph_message/tests/messages/machine.json

## Custom domains

You can make your own domain point to a VM. To achieve this, you need to create the following DNS 
records:

1. A `CNAME` record to the server, for example:
`hosted-on-aleph.net IN CNAME aleph.sh`
2. A `TXT` record to the VM hash with the prefix _aleph-id, for example:
`_aleph-id.hosted-on-aleph.org 60 IN TXT "b34f193470c349b1d9b60903a6d172e8c335710736d4999ff05971692febe8bc"`
