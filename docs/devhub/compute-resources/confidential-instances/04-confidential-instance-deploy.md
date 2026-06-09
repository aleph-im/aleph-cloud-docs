# Deploying a Confidential Instance

This guide walks you through the process of deploying a confidential virtual machine instance on the Aleph Cloud network. Once deployed, your confidential instance will run in a secure environment where even the node operator cannot access your data.

## Prerequisites

Before proceeding, ensure you have:

1. Installed the required tools (the [Aleph CLI](/devhub/sdks-and-tools/aleph-cli/) and `sevctl`) as outlined in the [Requirements](/devhub/compute-resources/confidential-instances/02-confidential-instance-requirements) guide
2. Created and uploaded an encrypted VM image following the [Encrypted Disk Image](/devhub/compute-resources/confidential-instances/03-confidential-instance-create-encrypted-disk) guide
3. The ItemHash of your encrypted disk image (obtained from `aleph file list`)
4. ALEPH tokens for payment (either for staking or streaming payments)

## Deployment Methods

There are two methods to deploy a confidential instance on Aleph Cloud:

1. **Automatic Method**: A streamlined approach using a single command
2. **Manual Method**: A step-by-step approach offering more control

## Method 1: Automatic Instance Creation

In v0.11.1 the streamlined flow is two steps. First allocate the VM:

```bash
aleph instance create --confidential [OPTIONS] <NAME>
```

Then run the all-in-one confidential setup, passing the VM hash from the previous step:

```bash
aleph instance confidential create <vm-hash>
```

`confidential create <vm-hash>` handles the remaining workflow in one shot: it initializes the secure session, validates the launch measurement, and injects the disk-decryption secret.

::: info Not yet available
The fully-automatic no-argument form (`aleph instance confidential create` without a VM hash) is not yet implemented in v0.11.1. Use the two-step flow above, or follow the Manual Method below for the full step-by-step walkthrough.
:::

## Method 2: Manual Instance Creation

For more control over the deployment process, follow these steps:

### Step 1: Create the Instance

Launch the instance configuration process:

```bash
aleph instance create --confidential
```

In interactive mode (`-i`), you will be prompted for:

- **Image**: a preset name (`ubuntu22`, `ubuntu24`, `debian12`) or an item hash / IPFS CID (`--image`)
- **Size**: a slug like `1vcpu-2gb` or `4vcpu-8gb`, or custom sizing via `--vcpus`, `--memory`, `--disk-size` (`--size`)
- **SSH key**: path to your SSH public key file (`--ssh-pubkey-file`)
- **CRN**: the interactive flow lets you pick a Compute Resource Node; pin to a specific one with `--crn-hash <HASH>`
- **Volumes** (optional): persistent, ephemeral, or immutable volumes (`--persistent-volume`, `--ephemeral-volume`, `--immutable-volume`)
- **Confidential firmware** (optional): UEFI firmware preset or hash (`--confidential-firmware`; defaults to the active firmware from the `vm-images` aggregate)

Payment is handled via credits by default; no payment-chain selection is required.

::: warning Important
Record the VM hash displayed after creation. You will need it for the subsequent steps.
If you lose it, run `aleph instance list` to recover it.
:::

If you forget these details, you can retrieve them using:

```bash
aleph instance list
```

### Step 2: Establish a Secure Communication Channel

Initialize a secure session with your VM:

```bash
aleph instance confidential init-session <vm-hash>
```

Replace `<vm-hash>` with the hash of your VM instance.

::: tip Troubleshooting
If this step fails, try rebooting the instance:

```bash
aleph instance reboot <vm-hash>
```

The scheduler resolves the CRN automatically. If you need to target a specific node, add `--crn <hash-or-url>`.

Then retry establishing the session.
:::

### Step 3: Validate and Start the VM

Verify the VM's integrity and start it with your encryption password:

```bash
aleph instance confidential start <vm-hash>
```

You'll be prompted to enter the encryption password you used when creating the disk image (passed as the `--secret` flag or interactively). Additional attestation flags include `--firmware-hash <HEX>` to pin the expected OVMF firmware hash, and `--firmware-file <PATH>` to compute the hash from a local firmware blob.

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
aleph instance stop <vm-hash>
```

To reboot your instance:

```bash
aleph instance reboot <vm-hash>
```

The CRN is discovered automatically via the scheduler. Pass `--crn <hash-or-url>` if you need to target a specific node.

## Verifying Confidentiality

To verify that your instance is running in confidential mode:

1. SSH into your instance
2. Run the following command:
   ```bash
   dmesg | grep -i sev
   ```
3. You should see output indicating that AMD SEV is active

## Next Steps

- [Troubleshooting Guide](/devhub/compute-resources/confidential-instances/05-confidential-instance-troubleshooting) - If you encounter issues with your confidential instance
- [Aleph Cloud Client Usage](/devhub/sdks-and-tools/aleph-cli/) - For more advanced instance management commands
- [Persistent Storage](/devhub/building-applications/data-storage/types-of-storage/persistent-storage) - Learn how to attach persistent storage to your instance

::: warning Security Reminder
Remember that the security of your confidential instance depends on keeping your encryption password secure. Do not share it with anyone, and do not store it in plaintext on any device.
:::
