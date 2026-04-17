---
title: Add cut peers
description:
  Provides reference information for the chainweb-node peer endpoints.
id: api-add-cut-peers
sidebar_position: 8
tags: ['chainweb', 'node api', 'chainweb api', 'api reference']
---

# Add cut peers

The peer-to-peer communication that's required for Chainweb nodes to synchronize state is partitioned into separate independent network channels. 
The `/cut/peer` portion of the peer-to-peer network is responsible for communicating the consensus state across a set of distributed network nodes and all chains in the network.
There is also one `/mempool/peer` peer-to-peer network channel for each chain. 
The `/mempool/peer` portion of the peer-to-peer network is responsible for queuing and managing pending transactions for each chain independently. 

## Request format

Use `PUT https://{baseURL}/cut/peer` to add peer information to the peer database of the `/cut/peer` portion of the network on the remote host.

### Request body schema

Use the following parameters to specify the peer information that you want to add to the peer database on the remote host.

| Parameter | Type | Description
| --------- | ---- | -----------
| id&nbsp;(required) | string&nbsp;or&nbsp;null | Specifies the Base64Url-encoded string—without padding—that represents the SHA256 fingerprint of the SSL certificate for the remote node. This field can only be `null` if the node uses an official certificate authority (CA) signed certificate. In all other cases, the `id` string consists of 43 characters from the `a-zA-Z0-9_-` character set.
| address&nbsp;(required) | object | Specifies the host and port number of the peer. 

## Responses

Requests to `PUT https://{baseURL}/cut/peer` return the following response codes:

- **204 No Content** indicates that the request was successful and the peer was added to the peer database of the remote node.
- **400 Bad Request** indicates that the request itself is invalid or that the hostname and port provided for the peer is not reachable. Before a Chainweb node adds a peer to its peer database, the node checks whether the peer can be reached using the information provided. If this check fails, an error is returned.

## Examples

You can send a request to add a peer to the peer database on a remote with a call to the `/cut/peer` endpoint similar to the following:

```Postman
PUT https://us1.testnet.chainweb.com/chainweb/0.0/testnet06/cut/peer
```

The request body for adding a peer contains parameters similar to the following:

```json
{
    "id": "NE9g8dsqVF1_OKwyq_ITXpIiEF4i9ReFzJQG9FhDEnQ",
    "address": {
        "hostname": "testnet-node.ajuba.io",
        "port": 1789
    }
}
```

If the request is successful, you'll see the **204 No Content** response returned.
If the host name or IP address wasn't reachable, you'll see an error message similar to the following:

```text
Invalid hostaddress: IsNotReachable "ConnectionFailure Network.Socket.getAddrInfo (called with preferred socket type/protocol: AddrInfo {addrFlags = [AI_ADDRCONFIG], addrFamily = AF_UNSPEC, addrSocketType = Stream, addrProtocol = 0, addrAddress = 0.0.0.0:0, addrCanonName = Nothing}, host name: Just \"testnet-node.ajuba.io\", service name: Just \"1789\"): does not exist (Name or service not known)"
```
