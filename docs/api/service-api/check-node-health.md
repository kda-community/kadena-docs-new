---
title: Check node health
description:
  Send a health check API request to check the availability of a node.
id: check-node-health
sidebar_position: 11
tags: ['chainweb', 'node api', 'chainweb api', 'api reference']
---

# Check node health

The `/health-check` endpoint checks whether `chainweb-node` is running and responding to service API requests.
To check the state of consensus, you should use the `GET https://{baseURL}/cut` endpoint instead of this endpoint.

## Request format

Use `GET http://{baseURL}/health-check` to check whether `chainweb-node` is running and responding to API requests. 

## Responses

Requests to the `/health-check` endpoint return the following response code:

- **200 OK** indicates that the node is running and responding to API requests.

### Response header

The response header parameters are the same for all successful and unsuccessful Chainweb node requests.

| Parameter | Type | Description
| --------- | ---- | -----------
| x-peer-addr | string | Specifies the host address and port number of the client as observed by the remote Chainweb node. The host address can be a domain name or an IP address in IPv4 or IPv6 format. For example: `"10.36.1.3:42988"`.
| x-server&#8209;timestamp | integer&nbsp;>=&nbsp;0 | Specifies the clock time of the remote Chainweb node using the UNIX epoch timestamp. For example: `1618597601`.
| x&#8209;chainweb&#8209;node&#8209;version	| string | Specifies the version of the remote Chainweb node. For example: `"2.23"`.

### Response schema

The response returns `text/plain` content with the following information:

| Parameter | Type | Description
| --------- | ---- | -----------
| check | string | Health check OK.

## Examples

You can send a health check request to a node like this:

```Postman
GET http://api.chainweb.com/health-check
```

This request returns a plain text message like this:

```text
Health check OK.
```

## Get general node information

Use `GET http://{baseURL}/info` to return general information about the node and the Chainweb version.

### Responses

Requests to the `GET http://{baseURL}/info` endpoint return the following response code:

- **200 OK** indicates that the request succeeded and the response body returns general information about the node and the chains in the network.

#### Response header

The response header parameters are the same for all successful and unsuccessful Chainweb node requests.

| Parameter | Type | Description
| --------- | ---- | -----------
| x-peer-addr | string | Specifies the host address and port number of the client as observed by the remote Chainweb node. The host address can be a domain name or an IP address in IPv4 or IPv6 format. For example: `"10.36.1.3:42988"`.
| x-server&#8209;timestamp | integer&nbsp;>=&nbsp;0 | Specifies the clock time of the remote Chainweb node using the UNIX epoch timestamp. For example: `1618597601`.
| x&#8209;chainweb&#8209;node&#8209;version	| string | Specifies the version of the remote Chainweb node. For example: `"2.23"`.

#### Response schema

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

### Examples

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

## Blocks event stream

Use `GET http://{baseURL}/header/updates` to connect to a source of server events that emits a BlockHeader event for each new block header that is added to the chain database of the remote node.

The stream can contain blocks that might later become orphaned. 
To address this potential issue, you should buffer events on the client side for the most recent block heights to allow for a desired confirmation depth to be reached.

You should note that the server might terminate this event stream from time to time.
It is up to the client to restart event streaming with a new request.

### Responses

- **200 OK** indicates a successful requests and results in a stream of BlockHeader events. 
  Each event consists of an event property and a data property and are separated by empty lines. 

#### Response header

The response header parameters are the same for all successful and unsuccessful Chainweb node requests.

| Parameter | Type | Description
| --------- | ---- | -----------
| x-peer-addr | string | Specifies the host address and port number of the client as observed by the remote Chainweb node. The host address can be a domain name or an IP address in IPv4 or IPv6 format. For example: `"10.36.1.3:42988"`.
| x-server&#8209;timestamp | integer&nbsp;>=&nbsp;0 | Specifies the clock time of the remote Chainweb node using the UNIX epoch timestamp. For example: `1618597601`.
| x&#8209;chainweb&#8209;node&#8209;version	| string | Specifies the version of the remote Chainweb node. For example: `"2.23"`.

#### Response schema

If the request is successful, the response returns `text/event-stream` content with the following:

| Parameter | Type | Description |
| --------- | ---- | -----------
| event | string | Specifies the type of event with the event property value of "BlockHeader".
| data	| object | Specifies the data properties for the event.

### Examples

You can send a request for block header updates from the Kadena main network like this:


```Postman
GET http://api.chainweb.com/chainweb/0.0/mainnet01/header/updates
```

This request returns a stream of events with the BlockHeader event property and a data property:

<!-- ![BlockHeader event stream](/assets/docs/blockheader-event.png) -->

If you expand the data property for an event, the event includes details similar to the folloiwng:

```json
{
    "header": {
        "adjacents": {
            "12": "_RU_P5XpRIFJK7-xhClDzBIwRD3LCkNzhNTi4M05uPY",
            "14": "tzNb2_b_nWkGM9Qh3u4Pxna-NU2RYBYEuZE3cwu2m1k",
            "3": "6auRG8JDj4S4IYMF8G-d47dkwVAfX8XmOOg6isofr_M"
        },
        "chainId": 13,
        "chainwebVersion": "mainnet01",
        "creationTime": 1722966936274259,
        "epochStart": 1722966541117672,
        "featureFlags": 0,
        "hash": "mb-Tn9AyDYuP5TgqaAlBu9VgR6eSZdWgKz9qtAGbrDA",
        "height": 5016971,
        "nonce": "5486220440094445593",
        "parent": "ItXSuFMmiQ1tcbXHPD0YoVR-2oip8RAn0m20v09vsTc",
        "payloadHash": "9v4k_U0IjxES-AwUSw_0PsqVBZ65msUKgZcGZO2cbY8",
        "target": "mGwbbeZtKT0EAHYYZTgreADt6mLkayeBEQAAAAAAAAA",
        "weight": "LJy-RUh3OhJ8VwEAAAAAAAAAAAAAAAAAAAAAAAAAAAA"
    },
    "powHash": "0000000000000009d25e6c0bfe4f0c07b87af281929d275412c8be921fd9334b",
    "target": "000000000000001181276be462eaed00782b3865187600043d296de66d1b6c98",
    "txCount": 0
}
```