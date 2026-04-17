---
title: Get payload
description:
  Provides reference information for the chainweb-node block payload endpoints.
id: get-payload
sidebar_position: 7
tags: ['chainweb', 'node api', 'chainweb api', 'api reference']
---

# Get payload

You can use the `/payload` endpoint to return raw block payloads in the same form as they are stored on the chain. 
By default, only the payload data is returned.
The raw payload data is sufficient for validating the blockchain Merkle tree and to use as input to Pact for executing the Pact transactions of the block and recomputing the outputs.

You can also send requests to query the transaction outputs along with the payload data.

## Request format

Use `GET https://{baseURL}/chain/{chain}/payload/{payloadHash}` to get the raw payload data for the specified payload hash.

### Path parameters

| Parameter | Type | Description
| --------- | ---- | -----------
| chain&nbsp;(required) | integer&nbsp;>=&nbsp;0 | Specifies the chain identifier for the chain you want to send the payload request to. Valid values are 0 to 19. For example, to get block payload for the first chain (0), the request is `GET https://{baseURL}/chain/0/payload`.
| payloadHash&nbsp;(required) | string | Specifies the payload hash for the request. The block payload hash is a Base64Url-encoded string—without padding—that consists of 43 characters from the `a-zA-Z0-9_-` character set. For example: `GpaWbHkHrCjRhY8hKE0qZ1WsBBaG3Y_zkFLV2sYumQA`.

### Query parameters

| Parameter | Type | Description
| --------- | ---- | -----------
| height | integer&nbsp;>=&nbsp;0 | Height of a block. For example: `height=3000000`.

## Responses

Requests to `GET https://{baseURL}/chain/{chain}/payload/{payloadhash}` return the following response codes:

- **200 OK** indicates that the request succeeded and the response body returns the payload data for the specified payload hash. 
- **404 Not Found** indicates that the payload hash wasn't found.

### Response header

The response header parameters are the same for all successful and unsuccessful Chainweb node requests.

| Parameter | Type | Description
| --------- | ---- | -----------
| x-peer-addr	| string | Specifies the host address and port number of the client as observed by the remote Chainweb node. The host address can be a domain name or an IP address in IPv4 or IPv6 format. For example: `"10.36.1.3:42988"`.
| x-server&#8209;timestamp | integer&nbsp;>=&nbsp;0 | Specifies the clock time of the remote Chainweb node using the UNIX epoch timestamp. For example: `1618597601`.
| x&#8209;chainweb&#8209;node&#8209;version	| string | Specifies the version of the remote Chainweb node. For example: `"2.23"`.

### Successful response schema

If the request is successful, the response returns `application/json` content with the following:

| Parameter | Type | Description
| --------- | ---- | -----------
| transactions&nbsp;(required) | Array of strings | An array of Base64Url-encoded strings—without padding—that describe signed Pact transactions in JSON format.
| minerData (required) | string | Miner information is a Base64Url-encoded string—without padding—that consists of characters from the `a-zA-Z0-9_-` character set. This information is included as part of the payload JSON object.
| transactionsHash&nbsp;(required) | string | The transaction hash is a SHA256 hash. The hash is a Base64Url-encoded string—without padding—that consists of 43 characters from the `a-zA-Z0-9_-` character set.
| outputsHash (required) | string | The output hash is a SHA256 hash. The hash is a Base64Url-encoded string—without padding—that consists of 43 characters from the `a-zA-Z0-9_-` character set.
| payloadHash (required) | string | The block payload hash is a Base64Url-encoded string—without padding—that consists of 43 characters from the `a-zA-Z0-9_-` character set.

### Not found response schema

If there are no results matching the request criteria, the response returns the following:

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| key | string | Specifies the base64Url-encoded block hash without padding. The block hash consists of 43 characters from the `a-zA-Z0-9_-` character set. |
| reason | string | Provides a placeholder for specifying the reason that no block hashes were found. |

## Examples

You can send a payload request to a bootstrap node for the Kadena test network and chain id 18 with a call like this:

```Postman
GET https://us1.testnet.chainweb.com/chainweb/0.0/testnet06/chain/18/payload/BKFz8a2AZGtZQPlp2xPRfe7ohlnOuzV2NbIEB3cFwI8
```

The response header for this request looks like this for `chainweb-node` version 2.26.1:

```text
X-Server-Timestamp: 1720805685
X-Peer-Addr: 54.86.50.139:16853
X-Chainweb-Node-Version: 2.26.1
Content-Type: application/json;charset=utf-8
```

The response body for this request returns the payload data.
In this example, the payload data includes three transactions:

```json
{
    "transactions": [
        "eyJoYXNoIjoicXl1UE00V0F3UFEyeHUtTmxZYVVNcVhzLTBmNG5mR2oyOE12YjFvclN4ayIsInNpZ3MiOlt7InNpZyI6ImMwNWI0NjU5ZTAyOWM2ZTcwNzAwNGFiZjNjMDE1OTY4YjZlMDgzZWI1YzU5YTIyMWUyYWMzMThkYTljZDlmMjdhOTliNzIwYjZkMmNjMDE1M2JkODYxYmZlY2RkZTY2YzcyNmQzOTZhNWQ4MTRiMWQ0YmZhYWNjMzdjYWQzNjBmIn1dLCJjbWQiOiJ7XCJuZXR3b3JrSWRcIjpcInRlc3RuZXQwNFwiLFwicGF5bG9hZFwiOntcImV4ZWNcIjp7XCJkYXRhXCI6e30sXCJjb2RlXCI6XCIobl9jNTE3NTY4Yjg5ZWViNWI2ZTZhYjE0NTYwZTcxMGYyODcwMzJlNjcyLmJyby1sb3R0ZXJ5LWhlbHBlcnMuYnV5LXRpY2tldC1pbi1rZGEgXFxcIms6MDQ4Y2E3MzgzYjIyNjdhMGZmZTc2OGI5N2I5NjEwNGQwZmI4MmU1NzZjNTNlMzVhNmE0NGUwYmI2NzVjNTNjZVxcXCIgMi40MTAxMzcwODY4MTEzIDQpXCJ9fSxcInNpZ25lcnNcIjpbe1wiY2xpc3RcIjpbe1wiYXJnc1wiOltcIms6MDQ4Y2E3MzgzYjIyNjdhMGZmZTc2OGI5N2I5NjEwNGQwZmI4MmU1NzZjNTNlMzVhNmE0NGUwYmI2NzVjNTNjZVwiLFwiMGVXemUwX2I3YkMxVDQ2YXoxM1kxU2FKU3daSTNNTzA2cDVReEs5b2RnOFwiLHtcImRlY2ltYWxcIjpcIjIuNDEwMTM3MDg2ODExXCJ9XSxcIm5hbWVcIjpcImNvaW4uVFJBTlNGRVJcIn0se1wiYXJnc1wiOltdLFwibmFtZVwiOlwiY29pbi5HQVNcIn1dLFwicHViS2V5XCI6XCIwNDhjYTczODNiMjI2N2EwZmZlNzY4Yjk3Yjk2MTA0ZDBmYjgyZTU3NmM1M2UzNWE2YTQ0ZTBiYjY3NWM1M2NlXCJ9XSxcIm1ldGFcIjp7XCJjcmVhdGlvblRpbWVcIjoxNzIwODAyMTA2LFwidHRsXCI6Mjg4MDAsXCJnYXNMaW1pdFwiOjgwMDAsXCJjaGFpbklkXCI6XCIxOFwiLFwiZ2FzUHJpY2VcIjoxZS04LFwic2VuZGVyXCI6XCJrOjA0OGNhNzM4M2IyMjY3YTBmZmU3NjhiOTdiOTYxMDRkMGZiODJlNTc2YzUzZTM1YTZhNDRlMGJiNjc1YzUzY2VcIn0sXCJub25jZVwiOlwiXFxcIlhFRFMtXFxcXFxcXCIyMDI0LTA3LTEyVDE2OjM2OjM2LjQzOVpcXFxcXFxcIlxcXCJcIn0ifQ",
        "eyJoYXNoIjoidFVTVHB0SlYyRWhfMXVZdUpaV0R6V0dObU02anhmQ1BsRWVGQVkwTUhzayIsInNpZ3MiOlt7InNpZyI6IjI1NDZkY2NiZDRlMzQ1MWRlODdkYjIzZTY3MDUxMmYzY2ZmYzhkNjk4ODI5NmY1NDA4ZTgxZWY0NzE4OWYyYjVkNDM2MWQzYWMwOTlkZDJkYjYyYTI5ZGE0MjU1MTAwOWJlZWVmOTNkMjUwMmQzOGJiNDgwYmMyODAzZTY2YzA5In1dLCJjbWQiOiJ7XCJuZXR3b3JrSWRcIjpcInRlc3RuZXQwNFwiLFwicGF5bG9hZFwiOntcImV4ZWNcIjp7XCJkYXRhXCI6e30sXCJjb2RlXCI6XCIobl9jNTE3NTY4Yjg5ZWViNWI2ZTZhYjE0NTYwZTcxMGYyODcwMzJlNjcyLmJyby1sb3R0ZXJ5LWhlbHBlcnMuYnV5LXRpY2tldC1pbi1icm8gXFxcIms6MDQ4Y2E3MzgzYjIyNjdhMGZmZTc2OGI5N2I5NjEwNGQwZmI4MmU1NzZjNTNlMzVhNmE0NGUwYmI2NzVjNTNjZVxcXCIgOSlcIn19LFwic2lnbmVyc1wiOlt7XCJjbGlzdFwiOlt7XCJhcmdzXCI6W1wiazowNDhjYTczODNiMjI2N2EwZmZlNzY4Yjk3Yjk2MTA0ZDBmYjgyZTU3NmM1M2UzNWE2YTQ0ZTBiYjY3NWM1M2NlXCIsXCJjOm1qRmw4TGk4UXYzOG13Rm5xeXRua0RWeUpXcGozc0JSRFBuRGZ2M0xIX2dcIix7XCJkZWNpbWFsXCI6XCIwLjAxXCJ9XSxcIm5hbWVcIjpcIm5fNWQxMTljYzA3ZmZkNWVmYWVmNWM3ZmVlZjllODc4ZjM0ZTNkNDY1Mi5icm8uVFJBTlNGRVJcIn0se1wiYXJnc1wiOltdLFwibmFtZVwiOlwiY29pbi5HQVNcIn1dLFwicHViS2V5XCI6XCIwNDhjYTczODNiMjI2N2EwZmZlNzY4Yjk3Yjk2MTA0ZDBmYjgyZTU3NmM1M2UzNWE2YTQ0ZTBiYjY3NWM1M2NlXCJ9XSxcIm1ldGFcIjp7XCJjcmVhdGlvblRpbWVcIjoxNzIwODAyMTE4LFwidHRsXCI6Mjg4MDAsXCJnYXNMaW1pdFwiOjMwMDAsXCJjaGFpbklkXCI6XCIxOFwiLFwiZ2FzUHJpY2VcIjoxZS04LFwic2VuZGVyXCI6XCJrOjA0OGNhNzM4M2IyMjY3YTBmZmU3NjhiOTdiOTYxMDRkMGZiODJlNTc2YzUzZTM1YTZhNDRlMGJiNjc1YzUzY2VcIn0sXCJub25jZVwiOlwiXFxcIlhFRFMtXFxcXFxcXCIyMDI0LTA3LTEyVDE2OjM2OjQ4Ljg0MlpcXFxcXFxcIlxcXCJcIn0ifQ",
        "eyJoYXNoIjoiell6YTFLWlJfbXM4U1BwNFc0SGxfcExRdVZINWxpX1NralJZaW1tazlGdyIsInNpZ3MiOlt7InNpZyI6IjAwZGMxOTUyZTJmZTFhZjI3NzFjNTE2MDAyZjJhOTk2ZWVmYjFkZWM5ZmExNDQwNDIyYzYzMmIzNDIyYTNlZjI4MGZlMDczNjAwYWYwM2RlNmVmNzljNDRiMDRjODcyZjJmMWM0NzEyZjgwNTgxMjlhYmJhOWZkYTcxMmUwOTA5In1dLCJjbWQiOiJ7XCJuZXR3b3JrSWRcIjpcInRlc3RuZXQwNFwiLFwicGF5bG9hZFwiOntcImV4ZWNcIjp7XCJkYXRhXCI6e30sXCJjb2RlXCI6XCIobl9jNTE3NTY4Yjg5ZWViNWI2ZTZhYjE0NTYwZTcxMGYyODcwMzJlNjcyLmJyby1sb3R0ZXJ5LWhlbHBlcnMuYnV5LXRpY2tldC1pbi1rZGEgXFxcIms6MDQ4Y2E3MzgzYjIyNjdhMGZmZTc2OGI5N2I5NjEwNGQwZmI4MmU1NzZjNTNlMzVhNmE0NGUwYmI2NzVjNTNjZVxcXCIgMi40MTAxMzcwODY4MTEzIDcpXCJ9fSxcInNpZ25lcnNcIjpbe1wiY2xpc3RcIjpbe1wiYXJnc1wiOltcIms6MDQ4Y2E3MzgzYjIyNjdhMGZmZTc2OGI5N2I5NjEwNGQwZmI4MmU1NzZjNTNlMzVhNmE0NGUwYmI2NzVjNTNjZVwiLFwiMGVXemUwX2I3YkMxVDQ2YXoxM1kxU2FKU3daSTNNTzA2cDVReEs5b2RnOFwiLHtcImRlY2ltYWxcIjpcIjIuNDEwMTM3MDg2ODExXCJ9XSxcIm5hbWVcIjpcImNvaW4uVFJBTlNGRVJcIn0se1wiYXJnc1wiOltdLFwibmFtZVwiOlwiY29pbi5HQVNcIn1dLFwicHViS2V5XCI6XCIwNDhjYTczODNiMjI2N2EwZmZlNzY4Yjk3Yjk2MTA0ZDBmYjgyZTU3NmM1M2UzNWE2YTQ0ZTBiYjY3NWM1M2NlXCJ9XSxcIm1ldGFcIjp7XCJjcmVhdGlvblRpbWVcIjoxNzIwODAyMTEzLFwidHRsXCI6Mjg4MDAsXCJnYXNMaW1pdFwiOjgwMDAsXCJjaGFpbklkXCI6XCIxOFwiLFwiZ2FzUHJpY2VcIjoxZS04LFwic2VuZGVyXCI6XCJrOjA0OGNhNzM4M2IyMjY3YTBmZmU3NjhiOTdiOTYxMDRkMGZiODJlNTc2YzUzZTM1YTZhNDRlMGJiNjc1YzUzY2VcIn0sXCJub25jZVwiOlwiXFxcIlhFRFMtXFxcXFxcXCIyMDI0LTA3LTEyVDE2OjM2OjQzLjI5N1pcXFxcXFxcIlxcXCJcIn0ifQ"
    ],
    "minerData": "eyJhY2NvdW50IjoiazpkYjc3Njc5M2JlMGZjZjhlNzZjNzViZGIzNWEzNmU2N2YyOTgxMTFkYzYxNDVjNjY2OTNiMDEzMzE5MmUyNjE2IiwicHJlZGljYXRlIjoia2V5cy1hbGwiLCJwdWJsaWMta2V5cyI6WyJkYjc3Njc5M2JlMGZjZjhlNzZjNzViZGIzNWEzNmU2N2YyOTgxMTFkYzYxNDVjNjY2OTNiMDEzMzE5MmUyNjE2Il19",
    "transactionsHash": "T5-33Qu1748HUok8fDVd21iPgh5_ErN27ann7Xg67P8",
    "outputsHash": "ACzFnsi7kdSgS5bxhjO7qQaHfbk1kw9V4P4xoV1_zf8",
    "payloadHash": "BKFz8a2AZGtZQPlp2xPRfe7ohlnOuzV2NbIEB3cFwI8"
}
```

In the following example, the payload hash doesn't include any transactions:

```Postman
GET https://us1.testnet.chainweb.com/chainweb/0.0/testnet06/chain/18/payload/PB4yVhQo7vosXUH9Pik2z_OyJzn_fH0ChH-WOygOKuw
```

The response body indicates the empty block payload like this:

```json
{
    "transactions": [],
    "minerData": "eyJhY2NvdW50IjoidGVzdG4zdCIsInByZWRpY2F0ZSI6ImtleXMtYWxsIiwicHVibGljLWtleXMiOlsiZGI3NzY3OTNiZTBmY2Y4ZTc2Yzc1YmRiMzVhMzZlNjdmMjk4MTExZGM2MTQ1YzY2NjkzYjAxMzMxOTJlMjYxNiJdfQ",
    "transactionsHash": "v0-mUfeOoSLCuFyKMMwoTW7-4JZHBqjqS2NNPOYBbWg",
    "outputsHash": "-afV95__tCPIrMvk2yGoOxcjS4DAX0moG6gURByqf6Y",
    "payloadHash": "PB4yVhQo7vosXUH9Pik2z_OyJzn_fH0ChH-WOygOKuw"
}
```

If there are no results matching the request criteria, the response body indicates the reason no results were found. 
For example:

```json
{
  "key": "k1H3DsInAPvJ0W_zPxnrpkeSNdPUT0S9U8bqDLG739w",
  "reason": "key not found"
}
```
