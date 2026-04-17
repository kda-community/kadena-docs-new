---
title: Get general node information
description:
  Send a health check API request to check the availability of a node.
id: get-node-info
sidebar_position: 11
tags: ['chainweb', 'node api', 'chainweb api', 'api reference']
---

# Get general node information

The `/info` endpoint enables you to request general information about the state of a node, including adjacent chains and the graph history for a node.

## Request format

Use `GET http://{baseURL}/info` to return general information about the node and the Chainweb version.

## Responses

Requests to the `GET http://{baseURL}/info` endpoint return the following response code:

- **200 OK** indicates that the request succeeded and the response body returns general information about the node and the chains in the network.

### Response header

The response header parameters are the same for all successful and unsuccessful Chainweb node requests.

| Parameter | Type | Description
| --------- | ---- | -----------
| x-peer-addr | string | Specifies the host address and port number of the client as observed by the remote Chainweb node. The host address can be a domain name or an IP address in IPv4 or IPv6 format. For example: `"10.36.1.3:42988"`.
| x-server&#8209;timestamp | integer&nbsp;>=&nbsp;0 | Specifies the clock time of the remote Chainweb node using the UNIX epoch timestamp. For example: `1618597601`.
| x&#8209;chainweb&#8209;node&#8209;version	| string | Specifies the version of the remote Chainweb node. For example: `"2.23"`.

### Response schema

If the request is successful, the response returns `application/json` content with the following:

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| nodeApiVersion&nbsp;(required) | string | Specifies the Chainweb API version information for the node.|
| nodeBlockDelay&nbsp;(required) | integer&nbsp;>=&nbsp;0 | Specifies the number of seconds to delay between blocks. |
| nodeChains&nbsp;(required) | Array&nbsp;of&nbsp;strings| Specifies the chain identifiers for the chains in the network the node is part of. |
| nodeGenesisHeights&nbsp;(required) | Array&nbsp;of&nbsp;integers | Specifies the block height for the first block of each chain in the network.|
| nodeGraphHistory&nbsp;(required) | Array&nbsp;of&nbsp;integers | Specifies the block height and adjacent chains for all chain graphs indexed by the height of the first block with the respective graph. Graphs are encoded as adjacency lists.
| nodeHistoricalChains&nbsp;(required) | Array&nbsp;of&nbsp;integers | Specifies the block height and adjacent chains for all chain graphs indexed by the height of the first block for the graph. Graphs are encoded as adjacency lists.|
| nodeLatestBehaviorHeight&nbsp;(required) | integer | Specifies the latest block height for the node. |
| nodeNumberOfChains&nbsp;(required) | integer&nbsp;>=&nbsp;10 | Specifies the number of chains in the network the node is part of. |
| nodePackageVersion&nbsp;(required) | string | Specifies the release package version for the `chainweb-node` software package running on the node. |
| nodeServiceDate&nbsp;(required) | string | Specifies the next service date for updating the `chainweb-node` software package running on the node. |
| nodeVersion&nbsp;(required) | string | Specifies the network identifier for the network the node is part of. The valid values are  "test-singleton", "development", "mainnet01", and "testnet06".|

## Examples

You can send a request for general information to a node like this:

```Postman
GET http://api.chainweb.com/info
```

This request returns information similar to the following truncated excerpt:

```json
{
    "nodeApiVersion": "0.0",
    "nodeBlockDelay": 30000000,
    "nodeChains": [
        "17",
        "16",
        "19",
    ],
    "nodeGenesisHeights": [
        [
            "17",
            852054
        ],
        [
            "16",
            852054
        ],
        [
            "19",
            852054
        ],
    ],
    "nodeGraphHistory": [
        [
            852054,
            [
                [
                    17,
                    [
                        16,
                        18,
                        2
                    ]
                ],
            ],
        ],
    ],
    "nodeHistoricalChains": [
        [
            852054,
            [
                [
                    17,
                    [
                        16,
                        18,
                        2
                    ]
                ],
            ],
         ],
      ],
    "nodeLatestBehaviorHeight": 4819247,
    "nodeNumberOfChains": 20,
    "nodePackageVersion": "2.26.1",
    "nodeServiceDate": "2025-02-05T00:00:00Z",
    "nodeVersion": "mainnet01"
}
```
