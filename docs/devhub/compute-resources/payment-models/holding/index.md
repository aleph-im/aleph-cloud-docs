# Hold-Based Payment

The hold-based payment model requires users to maintain a minimum balance of
ALEPH tokens in their wallet while their resources are running. If the balance
falls below the required amount, the Compute Resource Node (CRN) may stop the
affected workloads.

:::warning Deprecating
Hold-based payment is being phased out in favor of [Credits](/devhub/compute-resources/payment-models/credits/).
It remains the only payment model for **programs** (PROGRAM messages) for now,
and is still available for **storage**, where credits are recommended instead.
**Instances are paid with credits only** and no longer support hold-based payment.
:::

## How It Works

1. You deploy a program and choose **hold** as the payment type.
2. The CRN periodically checks whether your wallet holds enough ALEPH tokens to
   cover the resources you are using.
3. If your balance is insufficient, the CRN stops workloads until the required
   balance is met again, starting with the most recently launched execution.

## Required Balance

The required balance depends on the resources allocated (CPU, memory, storage)
and the type of workload. Refer to the
[Pricing](/devhub/sdks-and-tools/aleph-cli/commands/pricing) reference for details.

:::warning Balance enforcement scope
Hold-based balance enforcement is currently **only active for confidential
instances**. Standard persistent programs are not yet stopped for insufficient
hold balance. This behavior will be extended to all hold-based workloads in a
future release.
:::
