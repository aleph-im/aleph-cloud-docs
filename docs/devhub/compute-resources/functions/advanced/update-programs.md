# How to update a Function (Program)

Whether it is to add new features to your application, upgrade to the latest version of a dependency or migrate to
a new runtime, there are numerous reasons why you will update your program.

In this tutorial, we will see how you can, and sometimes cannot, update programs deployed on the Aleph Cloud network.

There are two main solutions to update a program:\

1. Update the program directly\
2. Update one or more volumes of the program.

## Update a program

The first way to update a program is to emit a new PROGRAM message that replaces the original one.
This is as simple as setting the `replaces` field of the PROGRAM message to the hash of the program
you want to modify.

For example, you find a bug in your request handler, or you want to ship a new
endpoint. Publish the new version with the `aleph` CLI:

```bash
aleph program update $PROGRAM_HASH $CODE_DIR
```

:::note Prerequisite: updatable program
`aleph program update` only works if the program was created with the `--updatable` flag. Without it, the program is immutable and the update command will fail. Programs created in the getting-started tutorial are immutable by default.
:::

This re-uploads the code and publishes a replacement PROGRAM message; the item
hash is unchanged. Your program is updated as soon as the replacement message
reaches the Compute Resource Node(s) executing it.

`aleph program update` only replaces the program's code. Resource settings such
as `vcpus`, `memory`, runtime, or volume layout are fixed at create time, so to
run with a different configuration you publish a fresh program with
`aleph program create` and the new parameters (the new program has a new item
hash).


### Immutable programs

Some programs cannot be updated with the method described above.
We call these **immutable** programs.
These programs are configured with the `allow_amend` field set to false.
Even the owner of an immutable program cannot update it.

The only way to update an immutable program is to delete it and create a new one.

## Update a volume

While updating a program will work in most cases, you can also update a program by updating one or more
of its volumes.
There are numerous cases where this is the best option:

- You detected a security vulnerability in one of your dependencies and want to migrate to a fixed version
- You want your program to migrate to the latest official Aleph Cloud runtime automatically
- You just want to upgrade your code
- etc.

The operation is similar to updating a program, except that we will replace the STORE message
that created the file instead of the PROGRAM message.
Let's use the `aleph` CLI to update one of our volumes.

Re-upload the updated volume file:

```bash
aleph file upload $VOLUME_PATH
```

Or, if the file already exists on IPFS, pin it directly:

```bash
aleph file pin $IPFS_HASH
```

Where `VOLUME_PATH` / `IPFS_HASH` refers to the updated volume content. The new STORE message hash
becomes the new volume reference. For immutable volumes mounted with `use_latest=true`, the program picks up the new upload automatically; for `use_latest=false`, recreate the program referencing the new hash.
You must either own this file or have the permission to update this file
(see [Permissions](/devhub/building-applications/messaging/permissions)).

### Immutable volumes

Similarly to programs, Aleph Cloud also has the concept of immutable volumes.
They are volumes configured with the `use_latest` field set to false.
These volumes will always use the version of the file configured when the program was created.

The only way to update an immutable volume is to first update the program to make the volume
mutable.
If the program itself is immutable, you will have to delete the program and start over.
