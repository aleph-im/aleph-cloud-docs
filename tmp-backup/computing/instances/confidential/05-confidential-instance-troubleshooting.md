# Troubleshooting Confidential VMs

This guide provides solutions for common issues you might encounter when working with confidential virtual machines on Aleph Cloud.

## Diagnosing Issues

### Fetch VM Logs

If your VM is supposed to be running but cannot be reached, start by checking the logs:

```bash
aleph instance logs <vm_hash>
```

If you don't know the hash of your VM, use:
```bash
aleph instance list
```

In a properly functioning VM, you should see disk unlocking, boot logs, and the system invite. The last lines should look similar to:

```bash
cloud-init[502]: Cloud-init v. 24.1.3-0ubuntu1~22.04.5 finished at Thu, 05 Sep 2024 19:36:07 +0000. Datasource DataSourceNoCloud [seed=/dev/sr0][dsmode=net].  Up 23.63 seconds
[  OK  ] Finished Execute cloud user/final scripts.
[  OK  ] Reached target Cloud-init target.

Ubuntu 22.04.4 LTS dbnszzoulvoea7crseir75egj4xbm5zzzaaut2nbpknjadidp3ua ttyS0
```

### Test Your VM Image Locally

If the VM fails to start on Aleph Cloud, try launching your disk image locally with QEMU to verify it was properly built:

```bash
sudo qemu-system-x86_64 \
  -enable-kvm \
  -m 2048 \
  -nic user,model=virtio \
  -nographic \
  -serial mon:stdio \
  -drive if=pflash,format=raw,unit=0,file=/usr/share/ovmf/OVMF.fd,readonly=on \
  -drive format=raw,file=</path/to/your/image.img>
```

::: info Note
After entering your password, you might need to wait a minute or so for the disk to decrypt and boot.
:::

To exit QEMU: press `Ctrl + a`, then `x`, and then `[Enter]`.

## Common Issues and Solutions

### Cannot SSH Into the VM

If you're unable to connect to your VM via SSH:

1. **Validate IPv6 Connectivity**  
   Ensure that IPv6 is functioning correctly on your local network. Test this by visiting [https://test-ipv6.com/](https://test-ipv6.com/).

2. **Verify the VM's IP Address**  
   Retrieve the correct IP address:
   ```bash
   aleph instance list
   ```

3. **Try Different User Logins**  
   Default users vary by distribution:
   - Debian-based distributions: `root`
   - Ubuntu: `ubuntu`

4. **Check SSH Key Configuration**  
   Ensure you're using the correct SSH key that was installed during VM creation:
   ```bash
   ssh -i /path/to/your/private_key <user>@<ip>
   ```

5. **Check VM Logs**  
   Look for SSH service startup or errors:
   ```bash
   aleph instance logs <vm_hash>
   ```

### Wrong Decryption Password

If you entered the wrong decryption password while starting the VM, you need to reboot it:

```bash
aleph instance reboot <vm_hash> <node_url>
```

Then restart the confidential initialization process:

```bash
aleph instance confidential-init-session <vm_hash>
aleph instance confidential-start <vm_hash>
```

### "Bad Measurement" Error

If you see this error in the logs:

```
qemu-system-x86_64: sev_launch_start: LAUNCH_START ret=1 fw_error=11 'Bad measurement'
qemu-system-x86_64: sev_kvm_init: failed to create encryption context
qemu-system-x86_64: failed to initialize kvm: Operation not permitted
```

#### Probable Causes

1. **Policy Mismatch**  
   The policy requested by the client doesn't match the start packet sent by the client.

2. **Platform Certificate Issues**  
   The CRN's platform certificate may not match the start packet due to:
   - A session generated for one CRN was reused for another
   - The CRN platform certificate was rotated after session generation
   - The CRN is returning an outdated platform certificate

#### Resolution Steps

1. **Regenerate the Session Certificate**  
   ```bash
   aleph instance confidential-init-session <vm_hash>
   ```  
   When prompted to remove existing certificates, answer "yes." Then continue with:
   ```bash
   aleph instance confidential-start <vm_hash>
   ```

2. **If the Error Persists**  
   Contact the Aleph Cloud support team with your VM hash and the node URL. The node operator may need to verify and update their platform certificate.

### VM Starts But Services Don't Work

If your VM boots but your application or services aren't functioning:

1. **Check Cloud-Init Logs**  
   SSH into your VM and check:
   ```bash
   cat /var/log/cloud-init.log
   ```

2. **Verify Network Configuration**  
   Ensure network interfaces are properly configured:
   ```bash
   ip addr
   ```

3. **Check Service Status**  
   Verify your application services are running:
   ```bash
   systemctl status <your-service>
   ```

4. **Review Application Logs**  
   Check application-specific logs for errors.

### Disk Encryption Issues

If the VM fails to decrypt the disk:

1. **Verify Password**  
   Ensure you're using the exact same password you used when creating the encrypted disk.

2. **Check GRUB Configuration**  
   If testing locally, you might see GRUB errors if the encryption setup is incorrect.

3. **Recreate the Encrypted Disk**  
   If persistent issues occur, consider recreating your encrypted disk image following the [encrypted disk guide](/devhub/computing/confidential/encrypted-disk).

## Advanced Troubleshooting

### Checking SEV Status

To verify if SEV is active in your VM:

```bash
dmesg | grep -i sev
```

You should see output indicating that AMD SEV is active.

### Debugging Session Initialization

For more verbose output during session initialization:

```bash
aleph instance confidential-init-session <vm_hash> --debug
```

### Getting Help

If you've tried the solutions above and are still experiencing issues:

1. Join the [Aleph Cloud Discord](https://discord.gg/alephim) for community support
2. Open an issue on the [Aleph-VM GitHub repository](https://github.com/aleph-im/aleph-vm/issues)
3. Contact the Aleph Cloud team directly through the [official website](https://aleph.im/contact)
