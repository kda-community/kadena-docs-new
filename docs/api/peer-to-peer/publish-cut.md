---
title: Publish the current state
description:
  Use the POST /cut endpoint to publish the cut height for a Chainweb node.
id: publish-cut
sidebar_position: 3
tags: ['chainweb', 'node api', 'chainweb api', 'api reference', 'block height cut']
---

# Publish the current state

In the Kadena network, a **cut height** represents the distributed state from a Chainweb node. 
Each cut height—much like a database snapshot or a block height—references one block header for each chain, compared with concurrent blocks on other chains.

Two blocks from two different chains are considered concurrent if either block is an adjacent parent and a direct dependency of the other or if the blocks do not depend at all on each other.

## Request format

Use `PUT https://{baseURL}/cut` to publish a cut to a Chainweb node.
The cut must contain an `origin` property that is not null. 
The receiving node will first try to obtain all missing dependencies from the node specified for the `origin` property before searching for the dependencies in the peer-to-peer network.

Use the following parameters to specify a `cut` with an `origin` property that is not null.

| Parameter | Type | Description
| --------- | ---- | -----------
| origin (required) | object | Describes a peer information object that consists of an `id` string and an `address` object for a Chainweb node. The `origin` parameter is required to use the `PUT /cut` endpoint. For more information, see the [Peer information](/api/data-models#peer-information-model) data model.
| height&nbsp;(required) | integer&nbsp;>=&nbsp;0 | Specifies the cut height to publish. The cut height is the sum of the height for all of the blocks included in the cut. You should avoid using this value because its semantics may change in the future.
| weight&nbsp;(required) | string| Specifies the cut weight. The cut weight is the sum of the weights from all of the blocks included in the cut. The weight string consists of 43 characters from the [`a-zA-Z0-9_-`] character set.
| hashes&nbsp;(required) | object | Specifies an object that maps chain identifiers 0-19 to their respective block hash and block height for the cut.
| instance | string | Specifies the network identifier for the cut.
| id | string | Specifies a cut identifier. The id string consists of 43 characters from the [`a-zA-Z0-9_-`] character set.

## Responses

Requests to `PUT https://{baseURL}/cut` return the following response codes:

- **204 No Content** indicates that the request was successful and the cut was added to the cut processing pipeline on the remote Chainweb node.
- **401 Unauthorized** indicates that the node where you are trying to publish the cut is not a peer of the node identified in the `origin` property, and therefore cannot process the cut you're attempting to publish.

### Response header

The response header parameters are the same for all successful and unsuccessful Chainweb node requests.

| Parameter | Type | Description
| --------- | ---- | -----------
| x-peer-addr	| string | Specifies the host address and port number of the client as observed by the remote Chainweb node. The host address can be a domain name or an IP address in IPv4 or IPv6 format. For example: `"10.36.1.3:42988"`.
| x-server&#8209;timestamp | integer&nbsp;>=&nbsp;0 | Specifies the clock time of the remote Chainweb node using the UNIX epoch timestamp. For example: `1618597601`.
| x&#8209;chainweb&#8209;node&#8209;version	| string | Specifies the version of the remote Chainweb node. For example: `"2.23"`.

## Examples

You can send a request to publish a cut on a node with a call to the `/cut` endpoint similar to the following:

```Postman
PUT https://sfchainweb.example.com/chainweb/0.0/testnet06/cut
```

The request body for publishing a cut contains parameters similar to the following:

```json
{
   "origin": {
      "address": {
        "hostname": "85.238.99.91",
        "port": 30004
        },
      "id": "PRLmVUcc9AH3fyfMYiWeC4nV2i1iHwc0-aM7iAO8h18"
    },
    "height": 30798466,
    "weight": "b0wYplmNiTBXCwAAAAAAAAAAAAAAAAAAAAAAAAAAAAA",
    "hashes": {
      "0": {
        "height": 1539923,
        "hash": "qEaSmWt_tDcJC9AGbgWY9x12LW5VED7hGgfyz9x_S3w"
      },
      "1": {
        "height": 1539923,
        "hash": "TJuC6nfhamfD517gspAZmqD9umR71nAgttDOi1JbBHw"
      },
      "2": {
        "height": 1539924,
        "hash": "4ineCWfnO1rneWuBMLPzqTl2HF_sZpypT_3TEzf3VLc"
      },
      "3": {
        "height": 1539924,
        "hash": "ZEOMXB2ByqzL2HfYVKIZKAnoe4wIeJ2SaltnXDir59k"
      },
      "4": {
        "height": 1539923,
        "hash": "0g0rOoSznVW2BJDBmK0Lbxz22F-sxTZUNIrUs_Q8Ye4"
      },
      "5": {
        "height": 1539923,
        "hash": "5y_TL-clnF_wELMBKyJk0Sz8RVShw_bGQETJdrMkADA"
      },
      "6": {
        "height": 1539923,
        "hash": "YkQKv6P4_C4jRM3RqKK9FWPxIneeLzlkKQS9ATAQYRk"
      },
      "7": {
        "height": 1539923,
        "hash": "j_hJ9iiH_ATyeQeeRN3auGXjbBWiFgnTU0dYPIz8cKM"
      },
      "8": {
        "height": 1539924,
        "hash": "s7c3B55VbDsS6EJ-nc9S5k2kNbPOBGI8xxF3vUg4d4Q"
      },
      "9": {
        "height": 1539922,
        "hash": "bowQf63xSY9owHKhK1yGee2Q0Fn8yL_oCLaEUn-CGoA"
      },
      "10": {
        "height": 1539924,
        "hash": "uP-pHW4QKrV9fN1mlDGwKuaiIDlJW7xYSj1nW53EHM4"
      },
      "11": {
        "height": 1539924,
        "hash": "TIhegjZ0GEC73T4m0BVuFtfLNGuS56IUWEuf93AJ5UU"
      },
      "12": {
        "height": 1539923,
        "hash": "-j1qcAS9Fs-WQmc3WEhzZ96VojxnlIA2TFpfyIv31Zs"
      },
      "13": {
        "height": 1539923,
        "hash": "S-4TqMgWGlK1k33XRlU9w0Lfwr0RvkO5Jn78Au1OglM"
      },
      "14": {
        "height": 1539923,
        "hash": "xSuULf--S4TrgYNz82deaGhnPLWrg3pXkynGeUPUGwA"
      },
      "15": {
        "height": 1539923,
        "hash": "jsc9rugvcHXDiBAuoO9_j8R_b_jchtJJ8b5596i8wVg"
      },
      "16": {
        "height": 1539923,
        "hash": "qs1aEY8kSxfUBb_JRVswv5dYINRXBjGJteC-6RC1hjc"
      },
      "17": {
        "height": 1539924,
        "hash": "xzVBXaQxzlUfUrakDgppUubQBRXGh-Uy0HBdMNwCq_Y"
      },
      "18": {
        "height": 1539924,
        "hash": "4VOHPAqwioySYRycdl5MxfscQHwtlwwCAt7AySYQT98"
      },
      "19": {
        "height": 1539923,
        "hash": "1PrRg20XyQ_2cfgGOgNK9K-cqIJ1vO8-A-RJlfN5m00"
      }
    },
    "id": "BBz7KeurYTeQ0hMGbwUbQC84cRbVcacoDQTye-3qkXI",
    "instance": "mainnet01"
}
```

If the request is successful, you'll see the **204 No Content** response returned.