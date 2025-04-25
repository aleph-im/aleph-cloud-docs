# Deleting messages

The aleph.im protocol is GDPR-compliant.
To achieve this objective, we allow users to delete their own data.
This is implemented using a special message type called FORGET.
By sending a FORGET message, users can delete one or more messages from the entire aleph.im network.
Users can forget any type of message, except for FORGET messages themselves.

When a FORGET message is processed by a node, it will immediately mark the target message(s) as forgotten,
meaning that their `content` (and `item_content`) fields will be deleted.
In addition, any content related to the forgotten message(s) will be deleted, if no other message points to the same
content. For example, forgetting a STORE message will delete the associated file, if no other STORE message points
to the same file.

Furthermore, forgotten messages will no longer appear when querying messages from `/api/v0/messages.json`.