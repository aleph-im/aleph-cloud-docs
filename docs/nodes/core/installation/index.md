# Core Channel Node Installation

This guide will walk you through the process of installing and setting up an Aleph Cloud Core Channel Node (CCN) using Docker Compose.

## Prerequisites

Before you begin, ensure you have:

- A server meeting the [hardware requirements](/nodes/core/introduction/#hardware-requirements)
- A system capable of running Docker and Docker Compose _(recent Debian or Ubuntu recommended)_
- Public IP address
- The following ports open from the internet:
  - 4001/tcp
  - 4001/udp
  - 4024/tcp
  - 4025/tcp
- Shell with sudo access
- A text editor

## Installation Steps

### 1. Install Docker and Docker Compose

On a Debian-based system (Debian, Ubuntu, Linux Mint, etc.), use the following commands:

```bash
sudo apt update
sudo apt upgrade -y
sudo apt install -y docker.io docker-compose
sudo systemctl enable docker && sudo systemctl start docker
```

Add your user to the Docker group:

```bash
sudo usermod -a -G docker $(whoami)
```

Logout and login again to apply the new group membership.

### 2. Configure Your Node

PyAleph requires two configuration items:
- A configuration file, usually named `config.yml`
- A private key to identify the node on the P2P network

#### Configuration File

Download the PyAleph configuration template:

```bash
wget "https://raw.githubusercontent.com/aleph-im/pyaleph/main/deployment/samples/docker-compose/sample-config.yml"
mv sample-config.yml config.yml
```

##### Ethereum API URL

Your Aleph node needs to connect to an Ethereum API. If you don't run your own Ethereum node, you can use Infura or a similar service:

1. Register on [infura.io](https://infura.io/)
2. Create a new Ethereum project
3. Get the hosted endpoint URL for your project (e.g., `https://mainnet.infura.io/v3/<project-id>`)
4. Edit the `config.yml` file to add the endpoint URL in the field `[ethereum > api_url]`

#### Node Secret Keys

Generate a persistent public-private keypair to authenticate to the network:

```bash
mkdir keys
docker run --rm --user root --entrypoint "" -v $(pwd)/keys:/opt/pyaleph/keys alephim/pyaleph-node:latest chown aleph:aleph /opt/pyaleph/keys
docker run --rm --entrypoint "" -v $(pwd)/keys:/opt/pyaleph/keys alephim/pyaleph-node:latest pyaleph --gen-keys --key-dir /opt/pyaleph/keys
```

Verify that the keys were generated successfully:

```bash
ls keys/
# Should show: node-pub.key  node-secret.pkcs8.der
```

### 3. Run the Node with Docker Compose

Download the Docker Compose file:

```bash
wget "https://raw.githubusercontent.com/aleph-im/pyaleph/main/deployment/samples/docker-compose/docker-compose.yml"
```

Modify the Docker Compose file to update the paths to your configuration file and keys directory if needed.

Start running the node:

```bash
docker-compose up -d
```

### 4. Verify Your Node

#### Check the Containers

Verify that all containers have started:

```bash
docker-compose ps
```

You should see containers for IPFS and PyAleph with a State of "Up".

#### Check the Metrics

Check that messages are being processed by viewing the metrics endpoint at `http://127.0.0.1:4024/metrics`.

#### Check the Logs

Make sure no errors appear in the logs:

```bash
docker-compose logs
```

## Node Registration

To receive rewards, you need to register your node on the Aleph.im network:

1. Retrieve your node's multiaddress by running the following command (replace NODE_IP_ADDRESS with your node's public IP):

   ```bash
   curl -s http://NODE_IP_ADDRESS:4024/api/v0/info/public.json | jq -r .node_multi_addresses[0]
   ```

2. Visit the [Node Operator Dashboard](https://account.aleph.im/earn/ccn/)
3. Connect your wallet containing ALEPH tokens
4. Follow the registration process, providing your node's multiaddress
5. Stake the required amount of ALEPH tokens _(200,000 ALEPH)_

For detailed registration instructions, refer to the [Node Registration Guide](https://medium.com/aleph-im/aleph-im-node-registration-guide-ea2badb84e75).

## Next Steps

After successful installation and registration:

1. Set up [Node Backups](/nodes/resources/management/backups/) to protect your data
2. Explore [Node Monitoring](/nodes/resources/management/monitoring/) to keep track of your node's performance