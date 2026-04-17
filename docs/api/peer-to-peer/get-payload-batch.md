---
title: Get multiple payloads
description:
  Provides reference information for the chainweb-node block payload endpoints.
id: get-payload-batch
sidebar_position: 7
tags: ['chainweb', 'node api', 'chainweb api', 'api reference']
---

# Get multiple payloads

You can use the `/payload/batch` endpoint to return multiple block payloads in the same request.

By default, only the raw payload data in the same form as it's stored on the chain is returned.
The raw payload data is sufficient for validating the blockchain Merkle tree and to use as input to Pact for executing the Pact transactions included in the block and for recomputing the transaction outputs.

You can also send requests to query the transaction outputs along with the payload data.

## Request format

Use `POST https://{baseURL}/chain/{chain}/payload/batch` with an array of payload hash strings and an array of block heights in a JSON object to specify the payloads you want to include in your batch request.

### Path parameters

| Parameter | Type | Description
| --------- | ---- | -----------
| chain&nbsp;(required) | integer&nbsp;>=&nbsp;0 | Specifies the chain identifier for the chain you want to get payloads from. Valid values are 0 to 19. For example, to get block payloads for the first chain (0), the request is `POST https://{baseURL}/chain/0/payload/batch`.

### Request body schema

Use an array of payload hash strings and an array of block heights in a JSON object to specify the payloads you want to include in your batch request.

| Parameter | Type | Description
| --------- | ---- | -----------
| hashes | Array&nbsp;of&nbsp;strings | Specifies the block payload hashes to include in the query request. Each block payload hash is a Base64Url-encoded string—without padding—that consists of 43 characters from the `a-zA-Z0-9_-` character set. For example: `GpaWbHkHrCjRhY8hKE0qZ1WsBBaG3Y_zkFLV2sYumQA`.
| heights | Array&nbsp;of&nbsp;integers | Specifies the block heights to include in the request.

## Responses

Requests to `POST https://{baseURL}/chain/{chain}/payload/batch` return the following response codes:

- **200 OK** indicates that the request succeeded and the response body returns some or all of the requested block payloads. The payloads are returned in any order.
- **404 Not Found** indicates that the no payloads matching the request criteria were found.

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
| transactions&nbsp;(required) | Array&nbsp;of&nbsp;strings | An array of Base64Url-encoded strings—without padding—that describe signed Pact transactions in JSON format.
| minerData (required) | string | Miner information is a Base64Url-encoded string—without padding—that consists of characters from the `a-zA-Z0-9_-` character set.This information is included as part of the payload JSON object.
| transactionsHash&nbsp;(required) | string | The transaction hash is a SHA256 hash. The hash is a Base64Url-encoded string—without padding—that consists of 43 characters from the `a-zA-Z0-9_-` character set.
| outputsHash (required) | string | The output hash is a SHA256 hash. The hash is a Base64Url-encoded string—without padding—that consists of 43 characters from the `a-zA-Z0-9_-` character set.
| payloadHash (required) | string | The block payload hash is a Base64Url-encoded string—without padding—that consists of 43 characters from the `a-zA-Z0-9_-` character set.

## Examples

You can send a request to a bootstrap node for the Kadena test network and chain id 18 with a call like this:

```Postman
POST https://us1.chainweb.com/chainweb/0.0/testnet06/chain/18/payload/batch
```

In this example, the request body includes a payload hash array for two payloads and three blook heights like this:

```json
{
    "hashes": ["KBs8f6_ZK2UKDQRpEwNcm5I5c1HHW1SfOmwzOVVU9ic","vVNA0B3LmES4gOP5iLE4e4R2eslwQvBzAmhFhuThZRs"],
    "heights" : [4460669,4460682,4460694]
}
```

If there are no payoads matching your query request, the endpoint returns an empty array.

A successful response with two payloads looks similar to the following:

```json
[
  {
    "transactions": [
      "eyJoYXNoIjoiZjE0cW9vRTNxbDFUT2U0cmFyNzBlZVRScWs1MjMtQi1VeDh4MnV5MWNGSSIsInNpZ3MiOlt7InNpZyI6Ijc1OWRlOGY4OTc2NjgxMmRmNzQ4YjQxYjY4MDBmOWNhZWI4OGUwYTU5MDQzZTQxN2I4YjBiNWU1ZDVkZGEwMWNjMDhkYTg3MTM0NjRiYTdmZTVmOTE0OTU5MDY0NjQxZDc0NjVlZmZkNGNlYjBhNDk0MDBjMWQ3ZTYwYTA0YzA2In1dLCJjbWQiOiJ7XCJuZXR3b3JrSWRcIjpcIm1haW5uZXQwMVwiLFwicGF5bG9hZFwiOntcImV4ZWNcIjp7XCJkYXRhXCI6e1wia2V5c2V0XCI6e1wicHJlZFwiOlwia2V5cy1hbGxcIixcImtleXNcIjpbXCJkYmUwNWY4YWQ3OTYzMjc3YjYwZWQ3Y2E1NDhhNDRiN2I0ZDBmY2Y0OWMyMzE5YzU1YTAyZTBjM2EzZTgzNzU4XCJdfX0sXCJjb2RlXCI6XCIoZnJlZS5yYWRpbzAyLmRpcmVjdC10by1zZW5kIFxcXCJrOmMzZjA3YTBiMjYxMjQ0ODA3ZmNmYWEzMGI1YmQ3MWIwZTQzNjljN2NhNDQ0MDEwYTU5ZWRhNmE0ZDFhMmM1ZTZcXFwiIClcIn19LFwic2lnbmVyc1wiOlt7XCJwdWJLZXlcIjpcImRiZTA1ZjhhZDc5NjMyNzdiNjBlZDdjYTU0OGE0NGI3YjRkMGZjZjQ5YzIzMTljNTVhMDJlMGMzYTNlODM3NThcIn1dLFwibWV0YVwiOntcImNyZWF0aW9uVGltZVwiOjE3MjEwNzE3OTksXCJ0dGxcIjoyODgwMCxcImdhc0xpbWl0XCI6MTAwMCxcImNoYWluSWRcIjpcIjBcIixcImdhc1ByaWNlXCI6MC4wMDAwMDEsXCJzZW5kZXJcIjpcIms6ZGJlMDVmOGFkNzk2MzI3N2I2MGVkN2NhNTQ4YTQ0YjdiNGQwZmNmNDljMjMxOWM1NWEwMmUwYzNhM2U4Mzc1OFwifSxcIm5vbmNlXCI6XCJcXFwiMjAyNC0wNy0xNVQxOTozMDoxNS4wNTBaXFxcIlwifSJ9",
      ],
    "minerData": "eyJhY2NvdW50IjoiazplN2Y3MTMwZjM1OWZiMWY4Yzg3ODczYmY4NThhMGU5Y2JjM2MxMDU5ZjYyYWU3MTVlYzcyZTc2MGIwNTVlOWYzIiwicHJlZGljYXRlIjoia2V5cy1hbGwiLCJwdWJsaWMta2V5cyI6WyJlN2Y3MTMwZjM1OWZiMWY4Yzg3ODczYmY4NThhMGU5Y2JjM2MxMDU5ZjYyYWU3MTVlYzcyZTc2MGIwNTVlOWYzIl19",
    "transactionsHash": "v8H4sipeJ0nT8PTn6Gk5XQjroxT2k9MxmqWKDCzAO2I",
    "outputsHash": "fdhib91BzkURhgeRnrQyEqdupp9IxeTU3_R7mDyRB_A",
    "payloadHash": "WH4VCap-n1RuqjBDqBzekgJgaeKa8zfL50r18BJKV9E"
  },
  {
    "transactions": [
      "eyJoYXNoIjoic0YwbFA5SFZLbWJ0QXJoY0x1Q3A3ZFpzZExYY1JFc1k1NTVKMjJjZnlWZyIsInNpZ3MiOlt7InNpZyI6IjU1YTZkYTA4ZWY5YTg1MjU1ZjRmNWEyMWNjNjJiMzJhMDdhOWUxZDEyMTgzNzRiNGY4ZTkxNjg1NWIyYjM4MTRmZjE2MmNiODBhOGJkNWZiNDgwZmMxNWU4MTNmNDUwMjU1NGRmMjA3MWMyODY4ZWNjYjQ2ZDIxMmE2Yzk2ZjBlIn1dLCJjbWQiOiJ7XCJuZXR3b3JrSWRcIjpcIm1haW5uZXQwMVwiLFwicGF5bG9hZFwiOntcImV4ZWNcIjp7XCJkYXRhXCI6e1wia2V5c2V0XCI6e1wicHJlZFwiOlwia2V5cy1hbGxcIixcImtleXNcIjpbXCI0ZDRkNjRmMTA1YjgzOGJlZmUzODFkYmFiMTJjYzM5M2E2MjM0YmRhYTlhNWY1ZDk4MDNiZTNiZTZhODMwNTZlXCJdfX0sXCJjb2RlXCI6XCIoZnJlZS5yYWRpbzAyLmFkZC1yZWNlaXZlZC13aXRoLWNoYWluIFxcXCIyNGUxMjRmZmZlZjM4NDM3XFxcIiBcXFwiVTJGc2RHVmtYMTllZml1eW1LTk9aYUl3ZDJVamswRk82WEJVbWxIck5qMD07Ozs7O29WY3RwbFNYZ1NaZm0yejdQMHF4SElveHBPTFloRlFoelZpQ3AxM1gzMStDMk5jQ0M0bkhUZ3l1bXlvWTFDSHhaMjRrcFVpakgvSnQxTFdUWkJNMGpEZlNBODZDTkJtU3FGRHJjdGpoMGJWQklnK1ZhR29DaXpBS0pPaU9LQlVUYXNkTUU3L3g0SHpOaVFXTHJmZDNXdWJ3QTdiQURoZ3JvZ0Fvdlpwb0RWVT1cXFwiIFxcXCIwXFxcIiApXCJ9fSxcInNpZ25lcnNcIjpbe1wicHViS2V5XCI6XCI0ZDRkNjRmMTA1YjgzOGJlZmUzODFkYmFiMTJjYzM5M2E2MjM0YmRhYTlhNWY1ZDk4MDNiZTNiZTZhODMwNTZlXCJ9XSxcIm1ldGFcIjp7XCJjcmVhdGlvblRpbWVcIjoxNzIxMDcxOTA2LFwidHRsXCI6Mjg4MDAsXCJnYXNMaW1pdFwiOjEwMDAsXCJjaGFpbklkXCI6XCIwXCIsXCJnYXNQcmljZVwiOjAuMDAwMDAxLFwic2VuZGVyXCI6XCJrOjRkNGQ2NGYxMDViODM4YmVmZTM4MWRiYWIxMmNjMzkzYTYyMzRiZGFhOWE1ZjVkOTgwM2JlM2JlNmE4MzA1NmVcIn0sXCJub25jZVwiOlwiXFxcIjIwMjQtMDctMTVUMTk6MzI6MDEuMDczWlxcXCJcIn0ifQ",
      ],
    "minerData": "eyJhY2NvdW50IjoiazplN2Y3MTMwZjM1OWZiMWY4Yzg3ODczYmY4NThhMGU5Y2JjM2MxMDU5ZjYyYWU3MTVlYzcyZTc2MGIwNTVlOWYzIiwicHJlZGljYXRlIjoia2V5cy1hbGwiLCJwdWJsaWMta2V5cyI6WyJlN2Y3MTMwZjM1OWZiMWY4Yzg3ODczYmY4NThhMGU5Y2JjM2MxMDU5ZjYyYWU3MTVlYzcyZTc2MGIwNTVlOWYzIl19",
    "transactionsHash": "d0H-xMffO8eRtNYmIHtwc1Sw7Eg5-LP0Ht_yNvBkYRw",
    "outputsHash": "xk-xn-6VIpn38qmtWH8gdP1o2D3Jgr4bjfb6sV0hgWA",
    "payloadHash": "oVwaIAsRNWFRnO1WVdNu4cm_yrew0iijO2KiL5v5_2s"
  }
]
```

## Get block payload with outputs

Use `GET https://{baseURL}/chain/{chain}/payload/{payloadHash}/outputs` to get payload data with output.

### Path parameters

| Parameter | Type | Description
| --------- | ---- | -----------
| chain&nbsp;(required) | integer&nbsp;>=&nbsp;0 | Specifies the chain identifier of the chain you want to send the payload request to. Valid values are 0 to 19. For example, to get block payload for the first chain (0), the request is `GET https://{baseURL}/chain/0/payload/{payloadHash}/outputs`.
| payloadHash&nbsp;(required) | string | The block payload hash is a Base64Url-encoded string—without padding—that consists of 43 characters from the `a-zA-Z0-9_-` character set. For example: `GpaWbHkHrCjRhY8hKE0qZ1WsBBaG3Y_zkFLV2sYumQA`.

### Query parameters

| Parameter | Type | Description
| --------- | ---- | -----------
| height | integer&nbsp;>=&nbsp;0 | Height of a block. For example: `height=3000000`.

### Responses

Requests to `GET https://{baseURL}/chain/{chain}/payload/{payloadhash}/outputs` return the following response codes:

- **200 OK** indicates that the request succeeded and the response body returns the payload data and output for the specified payload hash. 
- **404 Not Found** indicates that the payload hash wasn't found.

#### Response header

The response header parameters are the same for all successful and unsuccessful Chainweb node requests.

| Parameter | Type | Description
| --------- | ---- | -----------
| x-peer-addr	| string | Specifies the host address and port number of the client as observed by the remote Chainweb node. The host address can be a domain name or an IP address in IPv4 or IPv6 format. For example: `"10.36.1.3:42988"`.
| x-server&#8209;timestamp | integer&nbsp;>=&nbsp;0 | Specifies the clock time of the remote Chainweb node using the UNIX epoch timestamp. For example: `1618597601`.
| x&#8209;chainweb&#8209;node&#8209;version	| string | Specifies the version of the remote Chainweb node. For example: `"2.23"`.

#### Successful response schema

If the request is successful, the response returns `application/json` content with the following:

| Parameter | Type | Description
| --------- | ---- | -----------
| transactions&nbsp;(required) | Array&nbsp;of&nbsp;strings | An array of Base64Url-encoded strings—without padding—that describe signed Pact transactions in JSON format.
| minerData (required) | string | Miner information is a Base64Url-encoded string—without padding—that consists of characters from the `a-zA-Z0-9_-` character set.This information is included as part of the payload JSON object.
| transactionsHash&nbsp;(required) | string | The transaction hash is a SHA256 hash. The hash is a Base64Url-encoded string—without padding—that consists of 43 characters from the `a-zA-Z0-9_-` character set.
| outputsHash (required) | string | The output hash is a SHA256 hash. The hash is a Base64Url-encoded string—without padding—that consists of 43 characters from the `a-zA-Z0-9_-` character set.
| payloadHash (required) | string | The block payload hash is a Base64Url-encoded string—without padding—that consists of 43 characters from the `a-zA-Z0-9_-` character set.
| coinbase (required) | string | Coinbase output is a Base64Url-encoded string—without padding—that consists of characters from the `a-zA-Z0-9_-` character set. This information is included as part of the payload output JSON object.

#### Not found response schema

If there are no results matching the request criteria, the response returns the following:

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| key | string | Specifies the base64Url-encoded block hash without padding. The block hash consists of 43 characters from the `a-zA-Z0-9_-` character set. |
| reason | string | Provides a placeholder for specifying the reason that no block hashes were found. |

### Examples

You can send a request to a bootstrap node for the Kadena main network and chain id 4 with a call like this:

```Postman
GET https://us-e1.chainweb.com/chainweb/0.0/mainnet01/chain/4/payload/jafDpAgMCYnAqh-hweSjA6sWCAp-ADSDzIcUKyRwkq8/outputs
```

This request returns a response body that looks like this:

```json
{
    "transactions": [
        [
            "eyJoYXNoIjoiQXFtNTRlRWNmMkQtVGJQR3FYLURIYWFkdUF0VXp5dEVqVzhLaDJ6bWlRSSIsInNpZ3MiOlt7InNpZyI6IjY5MzYwYTlhZjZmOTVkMmQ4NjhiNDA4NmQ0ZTU1NjQ3NzRhOGU5NWY0ZDZmMGM0ZGI2MmE4YTgwMmI5YWNkODczOTRmNjNkN2FiMTFkNjA2NWU1MjEzYmYwMGRkNmVhYjliMWI0MzUwODU1MTFmYmRkNmE1ZDcxMzI1YjhmZTBiIn1dLCJjbWQiOiJ7XCJwYXlsb2FkXCI6e1wiZXhlY1wiOntcImNvZGVcIjpcIihuX2JmYjc2ZWFiMzdiZjhjODQzNTlkNjU1MmExZDk2YTMwOWUwMzBiNzEuZGlhLW9yYWNsZS5zZXQtbXVsdGlwbGUtdmFsdWVzIFtcXFwiR05PL1VTRFxcXCJdIFsodGltZSBcXFwiMjAyNC0wNy0xOFQxNTozMDo0N1pcXFwiKV0gWzI1Ny41NV0pXCIsXCJkYXRhXCI6e319fSxcIm5vbmNlXCI6XCJranM6bm9uY2U6MTcyMTMxNjY0NzM0N1wiLFwic2lnbmVyc1wiOlt7XCJwdWJLZXlcIjpcIjhmOTE5NzRkMDU0M2Q4YzEzMmJjNDc5NmE2NGQ4M2VhZjgwOGE2YzNmY2QyZWYyZDY2YWNhYTU5M2U4YjQ0ZTZcIixcInNjaGVtZVwiOlwiRUQyNTUxOVwifV0sXCJtZXRhXCI6e1wiZ2FzTGltaXRcIjoyNTAwLFwiZ2FzUHJpY2VcIjoxZS04LFwic2VuZGVyXCI6XCJrOjhmOTE5NzRkMDU0M2Q4YzEzMmJjNDc5NmE2NGQ4M2VhZjgwOGE2YzNmY2QyZWYyZDY2YWNhYTU5M2U4YjQ0ZTZcIixcInR0bFwiOjI4ODAwLFwiY3JlYXRpb25UaW1lXCI6MTcyMTMxNjY0NyxcImNoYWluSWRcIjpcIjRcIn0sXCJuZXR3b3JrSWRcIjpcIm1haW5uZXQwMVwifSJ9",
            "eyJnYXMiOjQzNSwicmVzdWx0Ijp7InN0YXR1cyI6InN1Y2Nlc3MiLCJkYXRhIjpbdHJ1ZV19LCJyZXFLZXkiOiJBcW01NGVFY2YyRC1UYlBHcVgtREhhYWR1QXRVenl0RWpXOEtoMnptaVFJIiwibG9ncyI6Ik1zenliLXRBZ3dOOEtWeGg5a3FZWTMyVkZlbGx2ZzBsT2lBV3NGWUR3dFkiLCJldmVudHMiOlt7InBhcmFtcyI6WyJrOjhmOTE5NzRkMDU0M2Q4YzEzMmJjNDc5NmE2NGQ4M2VhZjgwOGE2YzNmY2QyZWYyZDY2YWNhYTU5M2U4YjQ0ZTYiLCJrOjI1MWVmYjA2ZjNiNzk4ZGJlN2JiM2Y1OGY1MzViNjdiMGE5ZWQyZGE5YWE0ZTIzNjdiZTRhYmMwN2NjOTI3ZmEiLDQuMzVlLTZdLCJuYW1lIjoiVFJBTlNGRVIiLCJtb2R1bGUiOnsibmFtZXNwYWNlIjpudWxsLCJuYW1lIjoiY29pbiJ9LCJtb2R1bGVIYXNoIjoia2xGa3JMZnB5TFctTTN4alZQU2RxWEVNZ3hQUEppYlJ0X0Q2cWlCd3M2cyJ9LHsicGFyYW1zIjpbIkdOTy9VU0QiLHsidGltZSI6IjIwMjQtMDctMThUMTU6MzA6NDdaIn0sMjU3LjU1XSwibmFtZSI6IlVQREFURSIsIm1vZHVsZSI6eyJuYW1lc3BhY2UiOiJuX2JmYjc2ZWFiMzdiZjhjODQzNTlkNjU1MmExZDk2YTMwOWUwMzBiNzEiLCJuYW1lIjoiZGlhLW9yYWNsZSJ9LCJtb2R1bGVIYXNoIjoiN1FWOTlvcGVDMHRZSTE4NHdzOWJNdDRvcnk0bF9qX0F1WXMtTEpUMmJWNCJ9XSwibWV0YURhdGEiOm51bGwsImNvbnRpbnVhdGlvbiI6bnVsbCwidHhJZCI6NTUyMzQ4Mn0"
        ]
    ],
    "minerData": "eyJhY2NvdW50IjoiazoyNTFlZmIwNmYzYjc5OGRiZTdiYjNmNThmNTM1YjY3YjBhOWVkMmRhOWFhNGUyMzY3YmU0YWJjMDdjYzkyN2ZhIiwicHJlZGljYXRlIjoia2V5cy1hbGwiLCJwdWJsaWMta2V5cyI6WyIyNTFlZmIwNmYzYjc5OGRiZTdiYjNmNThmNTM1YjY3YjBhOWVkMmRhOWFhNGUyMzY3YmU0YWJjMDdjYzkyN2ZhIl19",
    "transactionsHash": "lyjQiTyx8SqozBYkbOxQ5BFBMiK8x7-TA7Ce--fkjNw",
    "outputsHash": "4hSo0VAUzsuROnt0WfX8vytqQ8lQq3xrvt9EHJA_NhI",
    "payloadHash": "jafDpAgMCYnAqh-hweSjA6sWCAp-ADSDzIcUKyRwkq8",
    "coinbase": "eyJnYXMiOjAsInJlc3VsdCI6eyJzdGF0dXMiOiJzdWNjZXNzIiwiZGF0YSI6IldyaXRlIHN1Y2NlZWRlZCJ9LCJyZXFLZXkiOiJJalZ5Wmt4cVEwOUlVbE4wU1RNNE0wbEZVVE5OVlhkemFIcHFSVmxpTjFKaE4zUlhiMnhvVVROU05HOGkiLCJsb2dzIjoieGhlOEREb0VqUEtpQU1GOUs3NXVZalBiTDkzeWlFY3Y0OHZBQnZvaGpZWSIsImV2ZW50cyI6W3sicGFyYW1zIjpbIiIsIms6MjUxZWZiMDZmM2I3OThkYmU3YmIzZjU4ZjUzNWI2N2IwYTllZDJkYTlhYTRlMjM2N2JlNGFiYzA3Y2M5MjdmYSIsMC45ODAxOTFdLCJuYW1lIjoiVFJBTlNGRVIiLCJtb2R1bGUiOnsibmFtZXNwYWNlIjpudWxsLCJuYW1lIjoiY29pbiJ9LCJtb2R1bGVIYXNoIjoia2xGa3JMZnB5TFctTTN4alZQU2RxWEVNZ3hQUEppYlJ0X0Q2cWlCd3M2cyJ9XSwibWV0YURhdGEiOm51bGwsImNvbnRpbnVhdGlvbiI6bnVsbCwidHhJZCI6NTUyMzQ4MH0"
}
```

If there are no results matching the request criteria, the response body indicates the reason no results were found. 
For example:

```json
{
    "key": "i3lwc38zLkSrHDn5wj_LMFfA4VdofhTZ3crqZZ-5WJs",
    "reason": "key not found"
}
```

