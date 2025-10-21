# Aleph VM Orchestrator API

The Aleph VM orchestrator exposes HTTP endpoints on each Compute Resource Node (CRN) to manage virtual machines and retrieve operational data. Use this reference when you need to automate instance lifecycle tasks or inspect node health.

## Base URL

Replace `<crn-host>` with the public hostname or IP address of the target CRN:

```text
https://<crn-host>
```

## Authentication

Control endpoints require a valid allocation token signature. Include your token in the `X-Auth-Signature` header, as illustrated in the [local testing guide](/nodes/compute/advanced/local-testing/).

## Control endpoints

| Method | Path | Description | Auth |
| --- | --- | --- | --- |
| `POST` | `/control/reserve_resources` | Reserve capacity for upcoming executions. | Required |
| `POST` | `/control/allocations` | Submit allocation updates, including VM start requests. | Required |
| `POST` | `/control/allocation/notify` | Notify the orchestrator about allocation events. | Required |

## Machine lifecycle endpoints

| Method | Path | Description | Auth |
| --- | --- | --- | --- |
| `POST` | `/control/machine/{ref}/update` | Apply configuration updates to the VM identified by `{ref}`. | Required |
| `POST` | `/control/machine/{ref}/stop` | Gracefully stop the VM. | Required |
| `POST` | `/control/machine/{ref}/erase` | Remove VM data from the node. | Required |
| `POST` | `/control/machine/{ref}/reboot` | Reboot the VM. | Required |
| `POST` | `/control/machine/{ref}/expire` | Mark the VM as expired so it can be reclaimed. | Required |

## Log streaming endpoints

| Method | Path | Description | Auth |
| --- | --- | --- | --- |
| `GET` | `/control/machine/{ref}/logs` | Fetch recent execution logs as JSON. | Required |
| `GET` | `/control/machine/{ref}/stream_logs` | Stream live logs over an HTTP connection. | Required |

## Confidential computing endpoints

| Method | Path | Description | Auth |
| --- | --- | --- | --- |
| `POST` | `/control/machine/{ref}/confidential/initialize` | Initialize the confidential execution environment. | Required |
| `GET` | `/control/machine/{ref}/confidential/measurement` | Retrieve measurement data for attestation. | Required |
| `POST` | `/control/machine/{ref}/confidential/inject_secret` | Inject encrypted secrets into the VM. | Required |

## Status endpoints

These endpoints are useful for health checks and diagnostics.

| Method | Path | Description |
| --- | --- | --- |
| `GET` | `/status/check/fastapi` | Confirms the FastAPI worker is reachable. |
| `GET` | `/status/check/fastapi/legacy` | Backward-compatible FastAPI health check. |
| `GET` | `/status/check/host` | Reports host-level availability. |
| `GET` | `/status/check/version` | Returns the orchestrator build version. |
| `GET` | `/status/check/ipv6` | Confirms IPv6 connectivity. |
| `GET` | `/status/config` | Provides a sanitized view of public configuration. |

## About endpoints

Use these read-only endpoints to inspect running executions and node metadata.

| Method | Path | Description |
| --- | --- | --- |
| `GET` | `/about/login` | Retrieves the token-gated login form for operator pages. |
| `GET` | `/about/executions/list` | Lists current executions. |
| `GET` | `/v2/about/executions/list` | Lists executions using the v2 schema. |
| `GET` | `/about/executions/details` | Returns details for a specific execution. |
| `GET` | `/about/executions/records` | Provides execution history records. |
| `GET` | `/about/usage/system` | Reports system usage metrics. |
| `GET` | `/about/certificates` | Shows TLS certificates managed by the node. |
| `GET` | `/about/capability` | Enumerates node capabilities. |
| `GET` | `/about/config` | Displays operator configuration. |

## Debug endpoints

| Method | Path | Description |
| --- | --- | --- |
| `GET` | `/debug/haproxy` | Exposes HAProxy statistics for debugging. |

## Related resources

- [REST API documentation](/devhub/api/rest)
- [Compute resources overview](/devhub/compute-resources/)
- [Local testing with Aleph VM](/nodes/compute/advanced/local-testing/)
