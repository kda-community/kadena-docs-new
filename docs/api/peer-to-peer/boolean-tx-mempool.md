---
title: Check request keys
description:
  Provides reference information for the chainweb-node mempool endpoints.
id: boolean-tx-mempool
sidebar_position: 6

tags: ['chainweb', 'node api', 'chainweb api', 'api reference']
---

# Check request keys

When transactions are submitted to the blockchain for processing, they are queued in the node memory pool to await delivery to a mining node as new work to be validated.
Endpoints related to memory pool activity are peer-to-peer endpoints that enable communication between memory pools on different nodes. 

With the` /mempool/member` endpoint, you can specify a list of transaction request keys to check the status of.
The request returns true for each transaction found waiting in the `mempool` portion of the peer-to-peer network and false for each transaction request key that wasn't found in the mempool.

## Request format

Use `POST https://{baseURL}/chain/{chain}/mempool/member` to check the whether specific transactions are currently in the memory pool using their transaction request keys.

### Path parameters

| Parameter | Type | Description
| --------- | ---- | -----------
| chain&nbsp;(required) | integer&nbsp;>=&nbsp;0 | Specifies the chain identifier of the chain you want to send the payload request to. Valid values are 0 to 19. For example, to get block payload for the first chain (0), the request is `POST https://{baseURL}/chain/0/mempool/member`.

### Request body schema

The request body consists of an array of transaction request keys to check for in the memory pool. Each request key for a Pact transaction is a Base64Url-encoded string—without padding—that consists of 43 characters from the `a-zA-Z0-9_-` character set.
The request body is an array of these strings.

## Responses

Requests to `POST https://{baseURL}/chain/{chain}/mempool/member` return the following response code:

- **200 OK** indicates that the request succeeded and the response body returns an array of boolean values that indicate whether each specified transaction is in the memory pool. The array has the same size as the request body.

### Response header

The response header parameters are the same for all successful and unsuccessful Chainweb node requests.

| Parameter | Type | Description
| --------- | ---- | -----------
| x-peer-addr | string | Specifies the host address and port number of the client as observed by the remote Chainweb node. The host address can be a domain name or an IP address in IPv4 or IPv6 format. For example: `"10.36.1.3:42988"`.
| x-server&#8209;timestamp | integer&nbsp;>=&nbsp;0 | Specifies the clock time of the remote Chainweb node using the UNIX epoch timestamp. For example: `1618597601`.
| x&#8209;chainweb&#8209;node&#8209;version	| string | Specifies the version of the remote Chainweb node. For example: `"2.23"`.

### Successful response schema

If the request is successful, the response returns `application/json` content with an array of boolean values for each request key in the request body. 

## Examples

You can send a request to a bootstrap node for the Kadena main network and chain id 0 with a call like this:

```Postman
POST https://us-e1.chainweb.com/chainweb/0.0/mainnet01/chain/0/mempool/member
```

For this example, the request body consists of one request key:

```request
["FCy9X1X7bVY-ls971GehpEh5kFwMVEZEfWYnPKKGxJg"]
```

If the transaction isn't found in the memory pool, the response body returns false:

```response
[
    false
]
```

You can send a request to a bootstrap node for the Kadena test network and chain id 1 with a call like this:

```postman
POST https://us1.testnet.chainweb.com/chainweb/0.0/testnet06/chain/1/mempool/member
```

For this example, the request body consists of two request keys:

```request
["Qp4hyjjzCBgjCoOvncCLsTMsw-G0kM6LSM9XSxOVhU4","Gc17hqzSZinUt-JCPvH6k_GJFXEJtRwU1Bx4OtSnxWU"]
```

In this example, the second transaction was found in the memory pool:

```response
[
    false,
    true
]
```
