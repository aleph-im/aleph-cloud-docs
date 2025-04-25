# Enable PAYG (Pay-As-You-Go)

Pay-As-You-Go allows user to pay for resources as you use them on the Aleph.im network, eliminating the need to hold or
stake large amounts of $ALEPH.

The feature is currently available on BASE and Avalanche c-chain.


#### Configure the stream reward address

1. Create an Avalanche (AVAX) or BASE wallet.
2. Open the information of your CRN on the Aleph Cloud [account page](https://account.aleph.im/) and enter the address in
   the section named STREAM REWARD ADDRESS.

3. Add the reward address inside the CRN configuration `/etc/aleph-vm/supervisor.env` in the form of:
   ```
   ALEPH_VM_PAYMENT_RECEIVER_ADDRESS="{YOUR 0x0... wallet address}"
   ```
4. Restart the node with `systemctl restart aleph-vm-supervisor.service`
5. Confirm that the address appears on the path `/status/config` on the CRN's URL/config
