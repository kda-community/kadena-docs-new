---
title: Add mempool peers
description:
  Provides reference information for the chainweb-node peer endpoints.
id: api-add-mempool-peers
sidebar_position: 8
tags: ['chainweb', 'node api', 'chainweb api', 'api reference']
---

# Add mempool peers

The peer-to-peer communication that's required for Chainweb nodes to synchronize state is partitioned into separate independent network channels. 
The `/cut/peer` portion of the peer-to-peer network is responsible for communicating the consensus state across a set of distributed network nodes and all chains in the network.
There is also one `/mempool/peer` peer-to-peer network channel for each chain. 
The `/mempool/peer` portion of the peer-to-peer network is responsible for queuing and managing pending transactions for each chain independently. 

## Request format

Use `PUT https://{baseURL}/chain/{chain}/mempool/peer` to add peer information to the `mempool` portion of the peer-to-peer network for a specific chain identifier.

### Path parameters

| Parameter | Type | Description
| --------- | ---- | -----------
| chain&nbsp;(required) | integer&nbsp;>=&nbsp;0 | Specifies the chain identifier for the chain you want to send the request to. Valid values are 0 to 19. For example, to get block hashes for the first chain (0), the request is `PUT https://{baseURL}/chain/0/mempool/peer`.

### Request body schema

Use the following parameters to specify the peer information you want to add to the peer database of the `mempool` portion of the peer-to-peer network on the remote host.

| Parameter | Type | Description
| --------- | ---- | -----------
| id&nbsp;(required) | string&nbsp;or&nbsp;null | Specifies the Base64Url-encoded string—without padding—that represents the SHA256 fingerprint of the SSL certificate for the remote node. This field can only be `null` if the node uses an official certificate authority (CA) signed certificate. In all other cases, the `id` string consists of 43 characters from the `a-zA-Z0-9_-` character set.
| address&nbsp;(required) | object | Specifies the host and port number of the peer you want to add to the peer database of the memory pool peer-to-peer network for the specified chain.

## Responses

Requests to `PUT https://{baseURL}/chain/{chain}/mempool/peer` return the following response codes:

- **204 No Content** indicates that the request was successful and the peer was added to the peer database of the remote node.
- **400 Bad Request** indicates that the request itself is invalid or that the hostname and port provided for the peer is not reachable. Before a Chainweb node adds a peer to its peer database, the node checks whether the peer can be reached using the information provided. If this check fails, an error is returned.

### Response header

The response header parameters are the same for all successful and unsuccessful Chainweb node requests.

| Parameter | Type | Description
| --------- | ---- | -----------
| x-peer-addr | string | Specifies the host address and port number of the client as observed by the remote Chainweb node. The host address can be a domain name or an IP address in IPv4 or IPv6 format. For example: `"10.36.1.3:42988"`.
| x-server&#8209;timestamp | integer&nbsp;>=&nbsp;0 | Specifies the clock time of the remote Chainweb node using the UNIX epoch timestamp. For example: `1618597601`.
| x&#8209;chainweb&#8209;node&#8209;version	| string | Specifies the version of the remote Chainweb node. For example: `"2.23"`.

## Examples

You can send a request to add a peer to the peer database with a call to the `/mempool/peer` endpoint similar to the following:

```Postman
PUT https://us1.testnet.chainweb.com/chainweb/0.0/testnet06/chain/4/mempool/peer`
```

The request body for adding a peer contains parameters similar to the following:

```json
{
    "id": "aEdeq9bOZws1X5IpBF5aGM6vV6gh_EicHSMoPs5wb40",
    "address": {
        "hostname": "13.251.43.216",
        "port": 1789
    }
}
```

If the request is successful, you'll see the **204 No Content** response returned.
If the host name or IP address wasn't reachable, you'll see an error message similar to the following:

```text
Invalid hostaddress: IsNotReachable "ConnectionFailure Network.Socket.getAddrInfo (called with preferred socket type/protocol: AddrInfo {addrFlags = [AI_ADDRCONFIG], addrFamily = AF_UNSPEC, addrSocketType = Stream, addrProtocol = 0, addrAddress = 0.0.0.0:0, addrCanonName = Nothing}, host name: Just \"us1.testnet.ajuba.io\", service name: Just \"1789\"): does not exist (Name or service not known)"
```
