---
title: Listen for a single transaction
description:
  Provides reference information for the Pact /listen endpoint.
id: listen
sidebar_position: 2
tags: ['chainweb', 'node api', 'chainweb api', 'api reference']
---

# Listen for a transaction result

You can use the `/listen` endpoint to submit a blocking API request to return the results for a single transaction.
The request must specify the request key that uniquely identifies the Pact transaction.
Requests to the `/listen` endpoint keep the connection to the network open waiting for a response.

## Request format

Use the `POST https://{baseURL}/chain/{chain}/pact/api/v1/listen` endpoint to submit a blocking request for the results of a single transaction.

Note that service API endpoints don't strictly require you to use secure connections (HTTPS).
However, node operators can require it and connecting over HTTPS is strongly recommended to protect data in transit and to prevent potential browser issues.

### Path parameters

| Parameter | Type | Description
| --------- | ---- | -----------
| chain&nbsp;(required) | integer&nbsp;>=&nbsp;0 | Specifies the chain identifier of the chain you want to send the request to. Valid values are 0 to 19. For example, to submit the command on the first chain (0), the request is `POST https://{baseURL}/chain/0/pact/api/v1/listen`.

### Request body schema

| Parameter | Type | Description
| --------- | ---- | -----------
| `listen` (required) | string | Unique identifier for the Pact transaction. The transaction hash is a base64Url-encoded string that consists of 43 characters from the [`a-zA-Z0-9_-`] character set.

## Responses 

Requests to `POST https://{baseURL}/chain/{chain}/pact/api/v1/listen` return the following response codes:

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

You can send a request to the Kadena test network and chain 1 by calling the `/listen` endpoint like this:

```Postman
POST https://api.testnet.chainweb.com/chainweb/0.0/testnet06/chain/1/pact/api/v1/listen
```

For this example, the request body specifies one request key to listen for:

```json
{
    "listen": "qTDh3o3Gp3rQI2XVzptSA5BwvT6w28B1RvSuHmNXtN4"
}
```

This request returns the following results:

```json
{
    "gas": 710,
    "result": {
        "status": "success",
        "data": "Write succeeded"
    },
    "reqKey": "qTDh3o3Gp3rQI2XVzptSA5BwvT6w28B1RvSuHmNXtN4",
    "logs": "9BUxMgwkYJFU7fVAEfJKLYLEqx1gXdpwd-tSZhJRh3A",
    "events": [
        {
            "params": [
                "LG-testnet",
                "k:db776793be0fcf8e76c75bdb35a36e67f298111dc6145c66693b0133192e2616",
                5.67503e-5
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
                "LG-testnet",
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
        "blockTime": 1726778344125192,
        "prevBlockHash": "zCvrrJrucuPgd9vY8cXbVn7GMjO9j-SsupGUMZ8gpoI",
        "blockHash": "TpmPSutW06KQ5_0kdrvbIAFdFZQSRlUYWnNBjt1mOGc",
        "blockHeight": 4659605
    },
    "continuation": null,
    "txId": 6485506
}
```

