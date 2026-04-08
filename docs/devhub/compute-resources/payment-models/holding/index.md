# Hold-Based Payment

The hold-based payment model requires users to maintain a minimum balance of
ALEPH tokens in their wallet while their resources are running. If the balance
falls below the required amount, the Compute Resource Node (CRN) may stop the
affected workloads.

## How It Works

1. You deploy a program or instance and choose **hold** as the payment type.
2. The CRN periodically checks whether your wallet holds enough ALEPH tokens to
   cover the resources you are using.
3. If your balance is insufficient, the CRN stops workloads until the required
   balance is met again, starting with the most recently launched execution.

## Required Balance

The required balance depends on the resources allocated (CPU, memory, storage)
and the type of workload. Refer to the
[Pricing](/devhub/compute-resources/payment-models/) section for details.

:::warning Balance enforcement scope
Hold-based balance enforcement is currently **only active for confidential
instances**. Standard persistent programs and standard instances are not yet
stopped for insufficient hold balance. This behavior will be extended to all
hold-based workloads in a future release.
:::
