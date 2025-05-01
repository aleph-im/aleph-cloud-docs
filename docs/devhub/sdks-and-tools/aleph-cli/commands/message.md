# Message Management

## Overall Usage

```bash
aleph message [OPTIONS] KEY_COMMAND [ARGS]...
```

### Options

| Option | Type | Description |
|--------|------|-------------|
| `--help` |  | Show this message and exit |

### Key Commands

| Command | Description |
|---------|-------------|
| `get` | Retrieve a message from aleph.im |
| `find` | Search for messages on aleph.im |
| `post` | Post a message on aleph.im |
| `amend` | Amend an existing aleph.im message |
| `forget` | Forget an existing aleph.im message |
| `watch` | Watch a hash for amends and print amend hashes |
| `sign` | Sign an aleph message with a private key |

## Get a Message

Retrieve a message from aleph.im

### Usage

```bash
aleph message get [OPTIONS] ITEM_HASH
```

#### Arguments

| Argument | Type | Description |
|----------|------|-------------|
| `ITEM_HASH` | TEXT | Item hash of the message |

#### Options

| Option | Type | Description |
|--------|------|-------------|
| `--help` |  | Show this message and exit |

```bash
# Retrieve a message
aleph message get ITEM_HASH
```

## Find a Message

Search for messages on aleph.im

### Usage

```bash
aleph message find [OPTIONS]
```

#### Options

| Option | Type | Description |
|--------|------|-------------|
| `--pagination` | INTEGER | The maximum number of messages to return [default: 200] |
| `--page` | INTEGER | The page number to display [default: 1] |
| `--message-types` | [post, aggregate, store, program, instance, forget] | Types of messages to search for, separated by commas |
| `--content-types` | TEXT | Content types to search for, separated by commas |
| `--content-keys` | TEXT | Specific content keys to search for, separated by commas |
| `--refs` | TEXT | References of messages to search for, separated by commas |
| `--addresses` | TEXT | Sender addresses to search for, separated by commas |
| `--tags` | TEXT | Tags associated with the messages to search for, separated by commas |
| `--hashes` | TEXT | Hashes of the messages to search for, separated by commas |
| `--channels` | TEXT | Channels associated with the messages to search for, separated by commas |
| `--chains` | TEXT | Blockchain chains associated with the messages to search for, separated by commas |
| `--start-date` | TEXT | Start date for the message search (format: `YYYY-MM-DD`) |
| `--end-date` | TEXT | End date for the message search (format: `YYYY-MM-DD`) |
| `--ignore-invalid-messages / --no-ignore-invalid-messages` |  | If enabled, ignores invalid messages in the search results [default: `ignore-invalid-messages`] |
| `--help` |  | Show this message and exit |

```bash
# Search for messages from several addresses
aleph message find --adresses ADDRESS_1,ADDRESS_2,ADDRESS_3

# Search for messages with specific tags
aleph message find --tags TAG_1,TAG_2

# Search for messages with pagination
aleph message find --pagination 50 --page 1
```

## Post a Message

Post a message on aleph.im

### Usage

```bash
aleph message post [OPTIONS]
```

#### Options

| Option | Type | Description |
|--------|------|-------------|
| `--path` | PATH | Path to the content you want to post. If omitted, you can input your content directly inside the prompt |
| `--type` | TEXT | Text representing the message object type [default: test] |
| `--ref` | TEXT | Item hash of the message to update |
| `--channel` | TEXT | Aleph.im network channel where the message is or will be broadcasted [default: ALEPH-CLOUDSOLUTIONS] |
| `--private-key` | TEXT | Your private key. Cannot be used with --private-key-file |
| `--private-key-file` | PATH | Path to your private key file [default: /home/$USER/.aleph-im/private-keys/ethereum.key] |
| `--debug / --no-debug` |  | [default: no-debug] |
| `--help` |  | Show this message and exit |

```bash
# Post a message by giving the path of the message
aleph message post --path PATH

# Post a new message from a file on a specific channel
aleph message post --path PATH --channel "MY_CHANNEL"

# Update a post with the prompt
aleph message post --ref REF
```
