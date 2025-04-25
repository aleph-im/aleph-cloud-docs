# Creating an Encrypted Disk Image

This guide walks you through the process of creating an encrypted virtual machine disk image for confidential computing on Aleph Cloud. The encrypted disk ensures that even the compute resource node running your instance cannot access, read, or modify its content.

## Overview

The process involves:
1. Retrieving sample scripts
2. Customizing the VM
3. Fetching a base image
4. Extracting the root filesystem
5. Creating the encrypted disk
6. Testing the image (optional)
7. Uploading the disk image to IPFS
8. Registering the disk image on Aleph Cloud

## Prerequisites

Before starting, ensure you have completed all the [requirements](/devhub/computing/confidential/requirements) for confidential computing.

## Step-by-Step Guide

### 1. Retrieving the Scripts

Download the necessary sample scripts from the Aleph VM repository:

```bash
wget https://raw.githubusercontent.com/aleph-im/aleph-vm/main/examples/example_confidential_image/build_debian_image.sh
wget https://raw.githubusercontent.com/aleph-im/aleph-vm/main/examples/example_confidential_image/setup_debian_rootfs.sh
```

These scripts are specifically designed to create an encrypted VM image for confidential computing purposes. They will:

- Create an encrypted partition
- Set up a boot partition
- Generate the required initramfs for decrypting the encrypted partition during boot

The resulting disk image is designed to work with the custom OVMF (Open Virtual Machine Firmware) used by Aleph Cloud, which can receive the decryption key securely and pass it to GRUB for disk decryption.

### 2. Customizing the VM

You can customize your VM by modifying the `setup_debian_rootfs.sh` script. This script is executed within the VM's chroot environment, allowing you to tailor the system to your needs.

It is strongly recommended to at least add a user with both a password and an SSH key in the sudo group. You can also:

- Install additional software
- Modify the default configuration
- Set up application-specific settings

Simply add your custom instructions at the end of the `setup_debian_rootfs.sh` script.

### 3. Fetch a Base Image

For this example, we'll use Debian 12. It's recommended to start from the genericcloud image, as it contains cloud-init, which is used to set up the network when launching the VM:

```bash
wget https://cloud.debian.org/images/cloud/bookworm/latest/debian-12-genericcloud-amd64.qcow2
```

::: info Note
The CRN relies on cloud-init being enabled (which it is by default). Other cloud-init features can be disabled if not needed.
:::

### 4. Extract the Root Filesystem

Mount the raw image with `guestmount`:

```bash
sudo mkdir -p /mnt/debian
sudo guestmount \
  --format=qcow2 \
  -a ./debian-12-genericcloud-amd64.qcow2 \
  -o allow_other \
  -i /mnt/debian
```

Copy the root filesystem to a directory, preserving proper permissions with the `--archive` option:

```bash
export ROOT_DIR=./extracted
mkdir ${ROOT_DIR}
sudo cp --archive /mnt/debian/* ${ROOT_DIR}
```

Clean up the mount:

```bash
sudo guestunmount /mnt/debian
sudo rm -r /mnt/debian
```

### 5. Create the Encrypted Disk

Run the build script to create the image with the encrypted disk:

```bash
bash ./build_debian_image.sh --rootfs-dir $ROOT_DIR -o ~/destination-image.img --password your-secure-password
```

::: warning Important
The password option is the *secret* password key with which the disk will be encrypted. You will need this password to launch the VM. Store it securely and don't forget it!
:::

::: tip Debugging
To debug the image creation, pass the `-x` option to bash in front of the script name:
```bash
bash -x ./build_debian_image.sh --rootfs-dir $ROOT_DIR -o ~/destination-image.img --password your-secure-password
```
:::

### 6. Test Your Image (Optional)

You can test your confidential VM locally using QEMU:

```bash
sudo qemu-system-x86_64 \
  -drive format=raw,file=~/destination-image.img \
  -enable-kvm \
  -m 2048 \
  -nic user,model=virtio \
  -nographic \
  -serial mon:stdio \
  -drive if=pflash,format=raw,unit=0,file=/usr/share/ovmf/OVMF.fd,readonly=on
```

::: info Note
After entering your password, you might need to wait a minute or so for the disk to decrypt and boot.
:::

To exit QEMU: press `Ctrl + a`, then `x`, and then `[Enter]`.

This is a good opportunity to make final customizations:
- Add your user and SSH key
- Install additional programs
- Configure services

### 7. Upload the Disk Image to IPFS

Upload the disk file you created to IPFS. You can use an IPFS interface or `curl`:

```bash
curl -L -X POST -F file=@~/destination-image.img "http://ipfs-2.aleph.im/api/v0/add"
```

This will return an IPFS hash that you'll need for the next step.

### 8. Register the Disk Image on Aleph Cloud

Pin the IPFS file on Aleph Cloud using the aleph-client:

```bash
aleph file pin <ipfs-hash>
```

Replace `<ipfs-hash>` with the hash you received in the previous step.

### 9. Verify the Registration

Check that your file is properly registered and get its ItemHash (which you'll need when creating the instance):

```bash
aleph file list
```

Look for your file in the output and note the ItemHash.

## Next Steps

Now that you have created and registered your encrypted disk image, you can proceed to [creating a confidential instance](/devhub/computing/confidential/instance) on Aleph Cloud.

If you encounter any issues during this process, refer to our [troubleshooting guide](/devhub/computing/confidential/troubleshooting).
