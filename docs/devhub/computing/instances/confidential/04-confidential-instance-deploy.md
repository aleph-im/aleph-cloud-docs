# Deploying a Confidential Instance

This guide walks you through the process of deploying a confidential virtual machine instance on the Aleph Cloud network. Once deployed, your confidential instance will run in a secure environment where even the node operator cannot access your data.

## Prerequisites

Before proceeding, ensure you have:

1. Installed the required tools (`aleph-client` and `sevctl`) as outlined in the [Requirements](/devhub/computing/confidential/requirements) guide
2. Created and uploaded an encrypted VM image following the [Encrypted Disk Image](/devhub/computing/confidential/encrypted-disk) guide
3. The ItemHash of your encrypted disk image (obtained from `aleph file list`)
4. ALEPH tokens for payment (either for staking or streaming payments)

## Deployment Methods

There are two methods to deploy a confidential instance on Aleph Cloud:

1. **Automatic Method**: A streamlined approach using a single command
2. **Manual Method**: A step-by-step approach offering more control

## Method 1: Automatic Instance Creation

The CLI provides a streamlined command to automate the entire creation process:

```bash
aleph instance confidential
```

This interactive command will guide you through the process and handle:
- Instance creation
- Secure channel setup
- VM initialization with your encryption password

Follow the prompts to:
- Select a payment method
- Specify resource requirements
- Choose your encrypted disk image
- Enter your disk encryption password
- Select a deployment node

## Method 2: Manual Instance Creation

For more control over the deployment process, follow these steps:

### Step 1: Create the Instance

Launch the instance configuration process:

```bash
aleph instance create --confidential
```

During this process, you'll need to specify:

- **Payment**: Select a payment chain (Ethereum, Avalanche, etc.) and payment method (hold, superfluid, nft)
- **Resources**: Specify CPU cores, RAM amount, disk size, and rootfs (your VM image hash)
- **Deployment**: Choose a Compute Resource Node (CRN) for deployment

::: warning Important
Record the CRN URL and VM hash displayed after creation. You'll need these for subsequent steps.
:::

If you forget these details, you can retrieve them using:

```bash
aleph instance list
```

### Step 2: Establish a Secure Communication Channel

Initialize a secure session with your VM:

```bash
aleph instance confidential-init-session <vm-hash>
```

Replace `<vm-hash>` with the hash of your VM instance.

::: tip Troubleshooting
If this step fails, try rebooting the instance:

```bash
aleph instance reboot <vm-hash> <node-url>
```

Then retry establishing the session.
:::

### Step 3: Validate and Start the VM

Verify the VM's integrity and start it with your encryption password:

```bash
aleph instance confidential-start <vm-hash>
```

You'll be prompted to enter the encryption password you used when creating the disk image.

::: tip Troubleshooting
If this step fails, try rebooting the instance again and retry.
:::

## Managing Your Confidential Instance

Once your confidential instance is running, you can manage it using the following commands:

### Retrieve VM Logs

Monitor your VM's activity:

```bash
aleph instance logs <vm-hash>
```

### Access Your VM via SSH

#### 1. Find the Instance Details

Via CLI:
```bash
aleph instance list
```

Or via API:
Access the compute node's API at `https://<node-url>/about/executions/list`

#### 2. Connect via SSH

Use the retrieved IP address to SSH into your VM:

```bash
ssh <user>@<ip> [-i <path-to-ssh-key>]
```

Default users depend on the base image you used:
- Debian: `root`
- Ubuntu: `ubuntu`

### Stopping or Rebooting Your Instance

To stop your instance:
```bash
aleph instance stop <vm-hash> <node-url>
```

To reboot your instance:
```bash
aleph instance reboot <vm-hash> <node-url>
```

## Verifying Confidentiality

To verify that your instance is running in confidential mode:

1. SSH into your instance
2. Run the following command:
   ```bash
   dmesg | grep -i sev
   ```
3. You should see output indicating that AMD SEV is active

## Next Steps

- [Troubleshooting Guide](/devhub/computing/confidential/troubleshooting) - If you encounter issues with your confidential instance
- [Aleph Cloud Client Usage](/tools/aleph-cli/) - For more advanced instance management commands
- [Persistent Storage](/devhub/computing/persistent/) - Learn how to attach persistent storage to your instance

::: warning Security Reminder
Remember that the security of your confidential instance depends on keeping your encryption password secure. Do not share it with anyone, and do not store it in plaintext on any device.
:::
