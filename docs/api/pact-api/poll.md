---
title: Poll for transaction results
description:
  Provides reference information for the Pact /poll endpoint.
id: poll
sidebar_position: 4
tags: ['chainweb', 'node api', 'chainweb api', 'api reference']
---

# Poll for transaction results

You can use the `/poll` endpoint to check for one or more command results by request key.

## Request format 

Use the `POST http://{baseURL}/chain/{chain}/pact/api/v1/poll` endpoint to check for one or more command results by request key.

### Path parameters

| Parameter | Type | Description
| --------- | ---- | -----------
| chain&nbsp;(required) | integer&nbsp;>=&nbsp;0 | Specifies the chain identifier of the chain you want to send the request to. Valid values are 0 to 19. For example, to submit the command on the first chain (0), the request is `POST http://{baseURL}/chain/0/pact/api/v1/poll`.

### Query parameters

| Parameter | Type | Description
| --------- | ---- | -----------
| `confirmationDepth`	| integer >= 0 | Configures how many blocks should be mined before the requested transaction results should be considered to be confirmed.

### Request body schema

| Parameter | Type | Description
| --------- | ---- | -----------
| `requestKeys` (required) | Array of strings | Each request key is a base64Url-encoded string that consists of 43 characters from the [`a-zA-Z0-9_-`] character set. 

## Responses

Requests to `POST http://{baseURL}/chain/{chain}/pact/api/v1/poll` return the following response codes:

- **200 OK** indicates that the request succeeded and the response body includes the transaction results.
- **400 Bad Request** indicates that the request failed. The response returns `text/plain` content with information about why the request failed. For example, the response might indicate that the command wasn't executed because the request body specified an invalid gas payer, was missing required metadata, or there were other environment issues.

If the request is successful, the response returns `application/json` content with the following information for one or more of the request keys included in the request.

| Parameter | Type | Description
| --------- | ---- | -----------
| `gas` (required) | number | Gas consumed by the transaction.
| `result` (required) | object | Success (object) or Failure (object).
| `reqKey` (required) | string | Unique identifier for the Pact transaction. The transaction hash is a base64Url-encoded string that consists of 43 characters from the [`a-zA-Z0-9_-`] character set.
| `logs` (required) | string | Backend-specific value providing image of database logs.
| `events` | Array of object | Array of event objects.
| `metaData` (required) | object | Metadata included with the transaction.
| `continuation` | object | Describes the result of a `defpact` execution.
| `txId` | number | Database-internal transaction tracking identifier.

## Examples

You can send a request to the Kadena test network and chain 1 by calling the `/poll` endpoint like this:

```Postman
POST http://api.testnet.chainweb.com/chainweb/0.0/testnet06/chain/1/pact/api/v1/poll?confirmationDepth=6
```

For this example, the request body specifies one request key:

```json
{
    "requestKeys": [
        "vnelRuUfVvSGOu7Lczv1MluELMICdPrBaevJzKOj-oo"
    ]
}   
```

This request returns the following results:

```json
{
    "vnelRuUfVvSGOu7Lczv1MluELMICdPrBaevJzKOj-oo": {
        "gas": 734,
        "result": {
            "status": "success",
            "data": "Write succeeded"
        },
        "reqKey": "vnelRuUfVvSGOu7Lczv1MluELMICdPrBaevJzKOj-oo",
        "logs": "TtlN_14Khzk6GhEx6JeeQsyPgeJ9ksGtFiA8-_DxGiA",
        "events": [
            {
                "params": [
                    "k:58705e8699678bd15bbda2cf40fa236694895db614aafc82cf1c06c014ca963c",
                    "k:db776793be0fcf8e76c75bdb35a36e67f298111dc6145c66693b0133192e2616",
                    5.866862e-5
                ],
                "name": "TRANSFER",
                "module": {
                    "namespace": null,
                    "name": "coin"
                },
                "moduleHash": "klFkrLfpyLW-M3xjVPSdqXEMgxPPJibRt_D6qiBws6s"
            },
            {
                "params": [
                    "k:58705e8699678bd15bbda2cf40fa236694895db614aafc82cf1c06c014ca963c",
                    "k:4fe7981d36997c2a327d0d3ce961d3ae0b2d38185ac5e5cd98ad90140bc284d0",
                    2
                ],
                "name": "TRANSFER",
                "module": {
                    "namespace": null,
                    "name": "coin"
                },
                "moduleHash": "klFkrLfpyLW-M3xjVPSdqXEMgxPPJibRt_D6qiBws6s"
            }
        ],
        "metaData": {
            "blockTime": 1726775907743891,
            "prevBlockHash": "svYRszu1KyeVIWNZOdPNoVBrU6w6-ETm_xXwx4YiHmk",
            "blockHash": "RgFXHrn4NESENpvwG1zWqJu_UloVLg6FAsdDK-oev-I",
            "blockHeight": 4659524
        },
        "continuation": null,
        "txId": 6485407
    }
}
```