---
title: Simulate a transaction
description:
  Provides reference information for the Pact /local endpoint.
id: local
sidebar_position: 3
tags: ['chainweb', 'node api', 'chainweb api', 'api reference']
---

# Simulate a transaction

You can use the `/local` endpoint to submit a command to simulate the execution of a transaction. 
Requests sent to the `/local` endpoint don't change the blockchain state. 
Any database writes or changes to the environment are rolled back.
You can use this type of call to perform a node-local “dirty read” for testing purposes or as a dry-run to validate a transaction. 
The request body must contain a properly-formatted Pact command. 
In response to the request, the endpoint returns the command result and hash. 

## Request format

Use the `POST http://{baseUrl}/chain/{chain}/pact/api/v1/local/` endpoint to submit a command to simulate the execution of a transaction. 

### Path parameters

| Parameter | Type | Description
| --------- | ---- | -----------
| chain&nbsp;(required) | integer&nbsp;>=&nbsp;0 | Specifies the chain identifier of the chain you want to send the request to. Valid values are 0 to 19. For example, to submit the command on the first chain (0), the request is `POST http://{baseURL}/chain/0/pact/api/v1/local`.

### Query parameters

| Parameter | Type | Description
| --------- | ---- | -----------
| `preflight`	| boolean | Trigger a fully-gassed mainnet transaction execution simulation and transaction metadata validation.
| `rewindDepth`	| integer >= 0 | Rewind transaction execution environment by a specified number of block heights.
| `signatureVerification`	| boolean | Require user signature verification when validating the transaction metadata.

### Request body schema

| Parameter | Type | Description
| --------- | ---- | -----------
| `cmd` (required) | string | Stringified JSON payload object with signed transaction data that can't be modified.
| `hash` (required) | string | An unpadded base64Url-encoded string created using the Blake2s-256 hash function for the `cmd` field value. Serves as a command request key because each transaction must be unique.
| `sigs` (required) | Array of objects | List of signatures corresponding one-to-one with the signers array in the payload.

## Responses

Requests to `POST http://{baseURL}/chain/{chain}/pact/api/v1/local` return the following response codes:

- **200 OK** indicates that the request succeeded and the response body includes either the command results or the preflight results. 

- **400 Bad Request** indicates that the request failed. The response returns `text/plain` content with information about why the command couldn't be executed. For example, the response might indicate that the command wasn't executed because the request body specified an invalid gas payer, was missing required metadata, or there were other environment issues.

If the request is successful, the response returns `application/json` content with the following information:

| Parameter | Type | Description
| --------- | ---- | -----------
| `reqKey` (required) | string | Unique identifier for the Pact transaction. The transaction hash is a base64Url-encoded string that consists of 43 characters from the [`a-zA-Z0-9_-`] character set.
| `result` (required) | object | Success (object) or Failure (object).
| `txId`	| number | Database-internal transaction tracking identifier.
| `logs` (required) | string | Backend-specific value providing an image of database logs.
| `metaData` (required) | object | Metadata included with the transaction.
| `events` | Array of objects | Array of event objects.
| `continuation`	| object | Describes the result of a `defpact` execution.
| `gas` (required) | number | Gas required to execute the transaction.

If you specify the `preflight` query parameter, the command results include the following additional parameters:

| Parameter | Type | Description
| --------- | ---- | -----------
| `preflightResult` (required) | object | The result of attempting to execute a single well-formed Pact command.
| `preflightWarnings` (required) | Array of strings | A list of warnings associated with deprecated features in upcoming Pact releases. 

## Examples

You can send a request to the Kadena test network and chain 1 by calling the `/local` endpoint like this:

```Postman
POST http://api.testnet.chainweb.com/chainweb/0.0/testnet06/chain/1/pact/api/v1/local/
```

The request body for this example looks like this:

```json
{"cmd":"{\"signers\":[{\"pubKey\":\"1d5a5e10eb15355422ad66b6c12167bdbb23b1e1ef674ea032175d220b242ed4\",\"clist\":[{\"name\":\"coin.TRANSFER\",\"args\":[\"k:1d5a5e10eb15355422ad66b6c12167bdbb23b1e1ef674ea032175d220b242ed4\",\"k:4fe7981d36997c2a327d0d3ce961d3ae0b2d38185ac5e5cd98ad90140bc284d0\",3]},{\"name\":\"coin.GAS\",\"args\":[]}]}],\"meta\":{\"creationTime\":1726525836,\"ttl\":32441,\"chainId\":\"1\",\"gasPrice\":1.9981e-7,\"gasLimit\":2320,\"sender\":\"k:1d5a5e10eb15355422ad66b6c12167bdbb23b1e1ef674ea032175d220b242ed4\"},\"nonce\":\"chainweaver\",\"networkId\":\"testnet06\",\"payload\":{\"exec\":{\"code\":\"(coin.transfer \\\"k:1d5a5e10eb15355422ad66b6c12167bdbb23b1e1ef674ea032175d220b242ed4\\\" \\\"k:4fe7981d36997c2a327d0d3ce961d3ae0b2d38185ac5e5cd98ad90140bc284d0\\\" 3.0)\",\"data\":null}}}","hash":"SLiinT5fAv8eCixT9qwbBHZgO4HxVB-p5rYyt_AxG94","sigs":[{"sig":"34de39e545f03116e7c8c1150e62be29874e0efd0e24ea906cb6cbd5adef28b137c01a85ac883489c7757f9335276ec360734ff74d98e195079d391a9105020d"}]}
```

The request returns command results similar to the following:

```json
{
    "gas": 509,
    "result": {
        "status": "success",
        "data": "Write succeeded"
    },
    "reqKey": "SLiinT5fAv8eCixT9qwbBHZgO4HxVB-p5rYyt_AxG94",
    "logs": "wsATyGqckuIvlm89hhd2j4t6RMkCrcwJe_oeCYr7Th8",
    "events": [
        {
            "params": [
                "k:1d5a5e10eb15355422ad66b6c12167bdbb23b1e1ef674ea032175d220b242ed4",
                "k:4fe7981d36997c2a327d0d3ce961d3ae0b2d38185ac5e5cd98ad90140bc284d0",
                3
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
        "publicMeta": {
            "creationTime": 1726525836,
            "ttl": 32441,
            "gasLimit": 2320,
            "chainId": "1",
            "gasPrice": 1.9981e-7,
            "sender": "k:1d5a5e10eb15355422ad66b6c12167bdbb23b1e1ef674ea032175d220b242ed4"
        },
        "blockTime": 1726526473352615,
        "prevBlockHash": "ubbt1utj-jVkNwAVCbqYduESQVlJwWwSipJOrRlXJJg",
        "blockHeight": 4651215
    },
    "continuation": null,
    "txId": null
}
```

You can specify the `preflight` query parameter in the API request like this:

```Postman
http://api.testnet.chainweb.com/chainweb/0.0/testnet06/chain/1/pact/api/v1/local/?preflight=true
```

The request returns preflight results similar to the following:

```json
{
    "preflightResult": {
        "gas": 734,
        "result": {
            "status": "success",
            "data": "Write succeeded"
        },
        "reqKey": "SLiinT5fAv8eCixT9qwbBHZgO4HxVB-p5rYyt_AxG94",
        "logs": "aN6GME-Oea_smnQOrTozgww0Z81WFu_u3env3k8ksEc",
        "events": [
            {
                "params": [
                    "k:1d5a5e10eb15355422ad66b6c12167bdbb23b1e1ef674ea032175d220b242ed4",
                    "NoMiner",
                    1.4666054e-4
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
                    "k:1d5a5e10eb15355422ad66b6c12167bdbb23b1e1ef674ea032175d220b242ed4",
                    "k:4fe7981d36997c2a327d0d3ce961d3ae0b2d38185ac5e5cd98ad90140bc284d0",
                    3
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
            "publicMeta": {
                "creationTime": 1726525836,
                "ttl": 32441,
                "gasLimit": 2320,
                "chainId": "1",
                "gasPrice": 1.9981e-7,
                "sender": "k:1d5a5e10eb15355422ad66b6c12167bdbb23b1e1ef674ea032175d220b242ed4"
            },
            "blockTime": 1726526253258103,
            "prevBlockHash": "jQi8HNy73w1JxjdqTkkJnFZW7_lGYo2eHEmqxKNUBsM",
            "blockHeight": 4651209
        },
        "continuation": null,
        "txId": 6476127
    },
    "preflightWarnings": []
}
```