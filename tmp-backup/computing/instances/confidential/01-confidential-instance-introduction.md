# Confidential Computing

Aleph Cloud supports confidential virtual machines, secured with AMD SEV (Secure Encrypted Virtualization). This technology is also known as TEE (Trusted Execution Environment) and provides enhanced security for your workloads.

## What is Confidential Computing?

Confidential computing is a cloud computing technology that isolates sensitive data in a protected CPU environment during processing. With confidential computing on Aleph Cloud:

- Both the memory (RAM) and the disk are fully encrypted by the CPU
- No one can see what happens in a virtual machine from the outside, not even the node operator
- Your data and code remain private and secure throughout the entire computation process
- The integrity of your application is protected against tampering

## How It Works

Aleph Cloud's confidential computing implementation uses AMD SEV technology to create a hardware-based trusted execution environment:

1. The CPU generates encryption keys that are not accessible to the operating system or hypervisor
2. All data in RAM is encrypted and decrypted in real-time by the CPU
3. The disk image is encrypted before being deployed to the network
4. The virtual machine boots in a secure environment with encrypted memory and storage
5. Even with root access to the host machine, operators cannot access the data inside the VM

## Use Cases

Confidential computing is ideal for applications that process sensitive data:

- Financial applications handling transaction data
- Healthcare applications processing patient information
- Applications working with intellectual property or trade secrets
- Blockchain validators and nodes requiring enhanced security
- Multi-party computation where data privacy is essential

## Getting Started with Confidential Computing

To use confidential computing on Aleph Cloud, you'll need to:

1. [Understand the requirements](#requirements)
2. [Create an encrypted disk image](#creating-an-encrypted-disk-image)
3. [Deploy a confidential instance on Aleph Cloud](#deploying-a-confidential-instance)

### Requirements

To create a confidential virtual machine, you'll need:

- A Linux system on x86_64 architecture (not Mac) with IPv6 connectivity
- The following software installed:
  - [aleph-client](/tools/aleph-cli/) command-line tool
  - [sevctl](https://github.com/virtee/sevctl) tool from AMD
  - An OpenSSH keypair
  - An IPFS Server
  - Optional: [Qemu](https://www.qemu.org/) to test your VM locally

For detailed installation instructions for these requirements, see the [full requirements guide](/devhub/computing/confidential/requirements).

### Creating an Encrypted Disk Image

The process involves:
1. Creating a base disk image
2. Installing your application and dependencies
3. Encrypting the disk with AMD SEV keys
4. Uploading the encrypted image to IPFS

For step-by-step instructions, see the [encrypted disk creation guide](/devhub/computing/confidential/encrypted-disk).

### Deploying a Confidential Instance

Once your encrypted disk image is ready, you can deploy it on Aleph Cloud:
1. Create a VM instance with the confidential flag enabled
2. Specify your encrypted disk image
3. Configure networking and other parameters
4. Deploy and access your secure instance

For detailed deployment instructions, see the [confidential instance creation guide](/devhub/computing/confidential/instance).

## Limitations and Considerations

- Confidential computing is currently in beta on Aleph Cloud
- Only AMD SEV is supported (Intel SGX support is planned for future releases)
- There is a small performance overhead compared to regular VMs
- The initial setup process is more complex than standard VMs

## Troubleshooting

If you encounter issues with confidential computing, refer to our [troubleshooting guide](/devhub/computing/confidential/troubleshooting) for common problems and solutions.

## Next Steps

- [Detailed Requirements](/devhub/computing/confidential/requirements)
- [Creating an Encrypted Disk Image](/devhub/computing/confidential/encrypted-disk)
- [Deploying a Confidential Instance](/devhub/computing/confidential/instance)
- [Troubleshooting Guide](/devhub/computing/confidential/troubleshooting)
