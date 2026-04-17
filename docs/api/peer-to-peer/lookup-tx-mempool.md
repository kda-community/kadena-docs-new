---
title: Look up transactions
description:
  Provides reference information for the chainweb-node mempool endpoints.
id: lookup-tx-mempool
sidebar_position: 6

tags: ['chainweb', 'node api', 'chainweb api', 'api reference']
---

# Look up pending transactions

When transactions are submitted to the blockchain for processing, they are queued in the node memory pool to await delivery to a mining node as new work to be validated.
Endpoints related to memory pool activity are peer-to-peer endpoints that enable communication between memory pools on different nodes. 

With the` /mempool/lookup` endpoint, you can specify a list of transaction request keys to look for in the `mempool` portion of the peer-to-peer network.
For each transaction request key, the endpoint returns the Pending tag and details about the transaction or the Missing tag.

## Request format

Use `POST https://{baseURL}/chain/{chain}/mempool/lookup` to look up pending transactions in the memory pool.

### Path parameters

| Parameter | Type | Description
| --------- | ---- | -----------
| chain&nbsp;(required) | integer&nbsp;>=&nbsp;0 | Specifies the chain identifier for the chain you want to send the request to. Valid values are 0 to 19. For example, to get pending transactions for the first chain (0), the request is `POST https://{baseURL}/chain/0/mempool/lookup`.

### Request body schema

The request body consists of an array of transaction request keys to check for in the memory pool. Each request key for a Pact transaction is a Base64Url-encoded string—without padding—that consists of 43 characters from the `a-zA-Z0-9_-` character set.
The request body is an array of these strings.

## Responses

Requests to `POST https://{baseURL}/chain/{chain}/mempool/lookup` return the following response code:

- **200 OK** indicates that the request succeeded and the response body returns an array of lookup results for each specified transaction. The array has the same size as the request body.

### Response header

The response header parameters are the same for all successful and unsuccessful Chainweb node requests.

| Parameter | Type | Description
| --------- | ---- | -----------
| x-peer-addr | string | Specifies the host address and port number of the client as observed by the remote Chainweb node. The host address can be a domain name or an IP address in IPv4 or IPv6 format. For example: `"10.36.1.3:42988"`.
| x-server&#8209;timestamp | integer&nbsp;>=&nbsp;0 | Specifies the clock time of the remote Chainweb node using the UNIX epoch timestamp. For example: `1618597601`.
| x&#8209;chainweb&#8209;node&#8209;version	| string | Specifies the version of the remote Chainweb node. For example: `"2.23"`.

### Successful response schema

If the request is successful, the response returns `application/json` content with an array of lookup results for each request key in the request body.

| Parameter | Type | Description
| --------- | ---- | -----------
| tag | string | Specifies the lookup result. The valid return values are "Missing" or "Pending".
| contents | string | Specifies the JSON-encoded text for a signed Pact transaction.

## Examples

You can send a request to a bootstrap node for the Kadena test network and chain id 1 with a call like this:

```postman
POST https://us1.testnet.chainweb.com/chainweb/0.0/testnet06/chain/1/mempool/lookup
```

For this example, the request body consists of two request keys:

```request
["ptI7wQeOmOt-BER2KQGVd0o6axBpqbhMPQVkkq5YAyE","Gc17hqzSZinUt-JCPvH6k_GJFXEJtRwU1Bx4OtSnxWU"]
```

In this example, the first transaction is "Pending" and the second transaction is "Missing" in the memory pool:

```response
[
    {
        "tag": "Pending",
        "contents": "{\"hash\":\"ptI7wQeOmOt-BER2KQGVd0o6axBpqbhMPQVkkq5YAyE\",\"sigs\":[{\"sig\":\"1569af1b56cddd4b853b7d49249c4c52d55e59e04910bfeb8aacbd02bfa0637bbe81b0f4b48ba8eb101fa0e8a276023fbfa57fa5a835741b346d574897052201\"}],\"cmd\":\"{\\\"signers\\\":[{\\\"pubKey\\\":\\\"1d5a5e10eb15355422ad66b6c12167bdbb23b1e1ef674ea032175d220b242ed4\\\",\\\"clist\\\":[{\\\"name\\\":\\\"coin.TRANSFER\\\",\\\"args\\\":[\\\"k:1d5a5e10eb15355422ad66b6c12167bdbb23b1e1ef674ea032175d220b242ed4\\\",\\\"k:58705e8699678bd15bbda2cf40fa236694895db614aafc82cf1c06c014ca963c\\\",10]},{\\\"name\\\":\\\"coin.GAS\\\",\\\"args\\\":[]}]}],\\\"meta\\\":{\\\"creationTime\\\":1721947429,\\\"ttl\\\":32441,\\\"chainId\\\":\\\"1\\\",\\\"gasPrice\\\":1.9981e-7,\\\"gasLimit\\\":2320,\\\"sender\\\":\\\"k:1d5a5e10eb15355422ad66b6c12167bdbb23b1e1ef674ea032175d220b242ed4\\\"},\\\"nonce\\\":\\\"chainweaver\\\",\\\"networkId\\\":\\\"testnet06\\\",\\\"payload\\\":{\\\"exec\\\":{\\\"code\\\":\\\"(coin.transfer \\\\\\\"k:1d5a5e10eb15355422ad66b6c12167bdbb23b1e1ef674ea032175d220b242ed4\\\\\\\" \\\\\\\"k:58705e8699678bd15bbda2cf40fa236694895db614aafc82cf1c06c014ca963c\\\\\\\" 10.0)\\\",\\\"data\\\":null}}}\"}"
    },
    {
        "tag": "Missing"
    }
]
```