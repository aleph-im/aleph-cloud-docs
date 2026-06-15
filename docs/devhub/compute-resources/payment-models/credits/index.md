# Credits

Credits are the primary way to pay for resources on the Aleph Cloud network.
You buy credits up front, and they are consumed as your workloads run, billed
for the resources you actually use (CPU, memory, storage).

## How It Works

1. You acquire credits for your account.
2. When you deploy a workload, you select **credits** as the payment type.
3. Credits are drawn down continuously while the workload runs, based on its
   allocated resources.
4. When your credit balance runs out, the affected workloads are stopped.

## Buying and Managing Credits

You can buy, transfer, and review credits from the
[Aleph Cloud Console](https://app.aleph.cloud/) or with the CLI. See the
[Credits Management](/devhub/sdks-and-tools/aleph-cli/commands/credits) command
reference for the full set of commands (`aleph credit buy`, `transfer`,
`history`, and `aleph account balance`).

## Where Credits Apply

| Resource | Payment with credits |
|----------|----------------------|
| Instances | Credits only |
| Storage | Supported (recommended); the legacy [hold-based](/devhub/compute-resources/payment-models/holding/) model is still available but will be deprecated soon |
| Programs (PROGRAM messages) | Not yet available; programs currently use the [hold-based](/devhub/compute-resources/payment-models/holding/) model |
