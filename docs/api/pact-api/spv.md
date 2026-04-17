---
title: Get simple payment verification (spv)
description: "Provides reference information for the Pact /spv endpoint."
id: spv
sidebar_position: 7
tags: ['chainweb', 'node api', 'chainweb api', 'api reference']
---

# Get simple payment verification (spv)

You can use the `/spv` endpoint to issue a blocking request to fetch a simple payment verification (spv) proof of a cross-chain transaction. 
The request must be sent to the chain where the transaction initiated.

## Request format

Use the `POST http://{baseURL}/chain/{chain}/pact/spv` endpoint to issue a blocking request to fetch a simple payment verification (spv) proof of a cross-chain transaction.

### Path parameters

| Parameter | Type | Description
| --------- | ---- | -----------
| chain&nbsp;(required) | integer&nbsp;>=&nbsp;0 | Specifies the chain identifier of the chain you want to send the request to. Valid values are 0 to 19. For example, to submit the command on the first chain (0), the request is `POST http://{baseURL}/chain/0/pact/spv`.

### Request body schema

| Parameter | Type | Description
| --------- | ---- | -----------
| `requestKey` (required) | string | Request key for the first step in a cross-chain transaction. This request key is the transaction hash generated on the source chain.
| `targetChainId` (required) | string | Target chain identifier for the second step in the cross-chain transaction.

## Response 

Requests to `POST http://{baseURL}/chain/{chain}/pact/spv` return the following response codes:

- **200 OK** indicates that the request succeeded and the response body includes the requested payment verification proof.
- **400 Bad Request** indicates that the request failed. The response returns `text/plain` content with information about why the request failed.

If the request is successful and the command is accepted, the response returns `application/json` content with the following information:

| Parameter | Type | Description
| --------- | ---- | -----------
| `spv` | string | Backend-specific data for continuing a cross-chain proof.
