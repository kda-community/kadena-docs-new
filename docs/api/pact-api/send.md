---
title: Send commands to be executed
description:
  Provides reference information for the Pact /send endpoint.
id: send
sidebar_position: 6
tags: ['chainweb', 'node api', 'chainweb api', 'api reference']
---

# Send commands to be executed

You can use the `/send` endpoint to submit one or more unencrypted Pact commands to the blockchain for execution.

## Request format

Use the `POST http://{baseUrl}/chain/{chain}/pact/api/v1/send` endpoint to submit one or more public unencrypted Pact commands to the blockchain for execution.

### Path parameters

| Parameter | Type | Description
| --------- | ---- | -----------
| chain&nbsp;(required) | integer&nbsp;>=&nbsp;0 | Specifies the chain identifier of the chain you want to send the request to. Valid values are 0 to 19. For example, to submit the command on the first chain (0), the request is `POST http://{baseURL}/chain/0/pact/api/v1/send`.

### Request body schema

Content type: application/json

| Parameter | Type | Description
| --------- | ---- | -----------
| `cmds` (required) | Array of objects | Specifies an array of individual Pact command objects.

## Responses

Requests to `POST http://{baseURL}/chain/{chain}/pact/api/v1/send` return the following response codes:

- **200 OK** indicates that the request succeeded and the response body includes the request keys for each command successfully submitted.
- **400 Bad Request** indicates that the request failed. The response returns `text/plain` content with information about why the command couldn't be submitted for execution. For example, the response might indicate that the command wasn't executed because the request body specified an invalid gas payer, was missing required metadata, or there were other environment issues.

If the request is successful, the response returns `application/json` content with the following information:

| Parameter | Type | Description
| --------- | ---- | -----------
| `requestKeys` (required) | Array of strings | Each request key is a base64Url-encoded string that consists of 43 characters from the [`a-zA-Z0-9_-`] character set. You can use these request keys with the `poll` or `listen` endpoints to retrieve transaction results.

## Examples

You can send a request to the Kadena test network and chain 1 by calling the `/send` endpoint like this:

```Postman
POST http://api.testnet.chainweb.com/chainweb/0.0/testnet06/chain/1/pact/api/v1/send
```

The request body for this example looks like this:

```json
{
    "cmds": [
        {
          "cmd":"{\"signers\":[{\"pubKey\":\"58705e8699678bd15bbda2cf40fa236694895db614aafc82cf1c06c014ca963c\",\"clist\":[{\"name\":\"coin.TRANSFER\",\"args\":[\"k:58705e8699678bd15bbda2cf40fa236694895db614aafc82cf1c06c014ca963c\",\"k:4fe7981d36997c2a327d0d3ce961d3ae0b2d38185ac5e5cd98ad90140bc284d0\",2]},{\"name\":\"coin.GAS\",\"args\":[]}]}],\"meta\":{\"creationTime\":1726775463,\"ttl\":35628,\"chainId\":\"1\",\"gasPrice\":7.993e-8,\"gasLimit\":2320,\"sender\":\"k:58705e8699678bd15bbda2cf40fa236694895db614aafc82cf1c06c014ca963c\"},\"nonce\":\"chainweaver\",\"networkId\":\"testnet06\",\"payload\":{\"exec\":{\"code\":\"(coin.transfer \\\"k:58705e8699678bd15bbda2cf40fa236694895db614aafc82cf1c06c014ca963c\\\" \\\"k:4fe7981d36997c2a327d0d3ce961d3ae0b2d38185ac5e5cd98ad90140bc284d0\\\" 2.0)\",\"data\":null}}}","hash":"vnelRuUfVvSGOu7Lczv1MluELMICdPrBaevJzKOj-oo","sigs":[
            {"sig":"cf0c345d06c251a34082ac95d06e34e9e96593799f18e743c8094de063c297bfbab5ec40a074e9ba257a32692cb6e7edf055f5abe8861c3b51150117736c5d0c"}
          ]
        }
    ]
}
```

This API request returns the request key for the transaction:

```json
{
    "requestKeys": [
        "vnelRuUfVvSGOu7Lczv1MluELMICdPrBaevJzKOj-oo"
    ]
}
```

You can use the request key returned to poll or listen for the transaction results.
