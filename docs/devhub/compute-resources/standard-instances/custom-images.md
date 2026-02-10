# Custom instance base image

This document will guide you on how to create a custom reusable runtime image for Aleph Instance.

This allows creating images with additional pre-installed software like bitcoin nodes, eth nodes,
avalanche nodes, … But also with CMS software or any other software.

[//]: # 'Note This tutorial cover QEMU instance, for function see custom-runtime (commented for now as page seems to have been'
[//]: # 'lost in the doc transition ) '

## Manual Image creation process

Overview of the process

1. Make the cloud init file to set the temporary user password
2. Generate the cloud init datasource (using cloud-localds command)
3. Download the base disk image for Debian
4. Launch the image in qemu.
5. Make your modifications in qemu.
6. push the file on ipfs
7. Pin the file in aleph

Aleph Cloud uses CloudInit to configure image upon deployment; it allows settings the network, settings the password for
the user etc...

For locally modifying the image, you will need to create a local CloudInit datasource to set up a temporary user that
will allow you to log in and make your modifications.

### Requirements

This tutorial has been designed to run on a Debian-based operating system (including Ubuntu)

We’ll be using the [cloud-localds](https://manpages.ubuntu.com/manpages/noble/en/man1/cloud-localds.1.html) command,
which comes from the [cloud-image-utils](https://github.com/canonical/cloud-utils) package. For launching an image
with [QEMU](https://www.qemu.org/docs/master/), you will need `qemu-system-x86`. These can be installed via Apt with:

```bash
sudo apt update
sudo apt install --yes cloud-image-utils qemu-system-x86
```

The [aleph-client](/devhub/sdks-and-tools/aleph-cli/)

### Specify user data

Create a YAML file with your desired user data. User data specifies user-defined configuration and content required at
boot time, such as SSH keys or login preferences.

Example:

```bash
cat > user-data.yaml <<EOF
#cloud-config
password: password
chpasswd:
  expire: False
EOF
```

### Create the seed image

Now that you’ve defined the relevant pieces of user data and metadata, you can create the datasource seed image, which
is simply a disk image containing the user data and metadata cloud-init will need to do its job:

```bash
cloud-localds my-seed.img user-data.yaml my-meta-data.yaml
```

### Procure the base debian image.

Download the Debian image you want to customise. e.g. from
https://cloud.debian.org/cdimage/cloud/bookworm/latest/

Take the `genericcloud` `amd64` version in raw or qcow2 format. Other image migth works but having cloudinit installed in
the image is a prerequisite to run on the Aleph network.

### Launch the image in QEMU

We will start a VM using the image in the QEMU emulator so it can be modified.

```bash
qemu-system-x86_64  \
  -cpu host -machine type=q35,accel=kvm -m 2048 \
  -nographic \
  -snapshot \
  -netdev id=net00,type=user,hostfwd=tcp::2222-:22 \
  -device virtio-net-pci,netdev=net00 \
  -drive if=virtio,format=qcow2,file=debian-12-genericcloud-amd64.qcow2 \
  -drive if=virtio,format=raw,file=my-seed.img
```

The user will be `debian` and the password the one you set above in `user-data.yaml`

Then make all your customisation wanted.

Notice: The content of this disk is readable by everyone. Do not leave any password or private token inside or in the
history.

Finish your modification
Remove the password for the user.

```bash
sudo passwd --lock debian
```

A new password will be set for the user when their VM is configured.

Exit QEMU: press `Ctrl + a`, then `x`, and then `[Enter]`.

### Uploading the disk image on IPFS

Upload the disk file you just created to ipfs. Either using an ipfs interface or via `curl`:

```shell
curl -L -X POST -F file=@destination-image.img "http://ipfs-2.aleph.im/api/v0/add"
```

### Register the disk image on Aleph.im

Pin the ipfs file on aleph.im via:

```
aleph file pin <ipfs hash>
```

### Check that it is present

Finally, get its ItemHash that is to be passed at the rootfs item hash:

```shell
aleph file list
```

### Test and use your custom image.

When creating a new image, use the item hash in the custom runtime field

```
aleph instance create
Preset to default chain: ETH
Which payment type do you want to use? [hold/superfluid/nft] (superfluid): hold
Use a custom rootfs or one of the following prebuilt ones: [ubuntu22/ubuntu24/debian12/custom] (ubuntu22): b6ff5c3a8205d1ca4c7c3369300eeafff498b558f71b851aa2114afd0a532717
```

(or via the `--runtime` option)

## Sources and references

Cloud Init documentation : https://documentation.ubuntu.com/public-images/public-images-how-to/use-local-cloud-init-ds/

## Automated process

To programmatically create the image so the creation can be included in an automated process,
we recommend using [FAI](https://wiki.fai-project.org/index.php/Main_Page) (Fully Automated Install) which is what
the Debian cloud team does to generate their image.

This method allows reusing elements between image and to periodically generate up-to-date image with the latest base,
which improves security.

The method is to reuse the FAI Config files made by the [Debian Cloud team](https://salsa.debian.org/cloud-team/debian-cloud-images) and add your own config file on top.

This [article](https://noah.meyerhans.us/blog/2017/02/10/using-fai-to-customize-and-build-your-own-cloud-images/) contain detail information on how to do so

See for more information.

- https://salsa.debian.org/cloud-team/debian-cloud-images
- and https://noah.meyerhans.us/blog/2017/02/10/using-fai-to-customize-and-build-your-own-cloud-images/
- [FAI Guide](https://fai-project.org/guide/)
