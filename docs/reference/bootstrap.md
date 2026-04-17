---
title: Chainweb bootstrap nodes
id: bootstrap
description: "Kadena test and production networks rely on bootstrap nodes to establish peer-to-peer communication."
sidebar_position: 16
---

# Chainweb bootstrap nodes

When you start `chainweb-node` on a computer, the `chainweb-node` program attempts to connect to one or more bootstrap nodes to discover other nodes in the peer-to-peer network.
For the connection to succeed, at least one of the bootstrap nodes must be trusted.

You can configure Chainweb to connect to specific bootstrap nodes by using the `--known-peer-info` command-line option or specifying the peer information in a Chainweb configuration file.
You can also configure Chainweb to ignore the built-in bootstrap nodes by using the `--enable-ignore-bootstrap-nodes` command-line option or by setting the `ignoreBootstrapNodes` configuration option.

If you're a node operator and would like to have your Chainweb node included as a bootstrap node, keep in mind the following requirements:

- Bootstrap nodes must have a public DNS name and a corresponding TLS certificate that is issued by a widely-accepted Certificate Authority.
  At a minimum, the certificate must be accepted by the OpenSSL library.

- Bootstrap node operators are expected to guarantee reasonable uptime and long-term availability of the nodes.

- Bootstrap node operators are expected to monitor node and network health, maintain node operations, and perform timely software updates.

To become a bootstrap node operator:

1. Fork the [chainweb-node](https://github.com/kda-community/chainweb-node) repository.
2. Add your node information to the [chainweb-node/src/P2P/BootstrapNodes](https://github.com/kda-community/chainweb-node/blob/master/src/P2P/BootstrapNodes.hs) module.
3. Create a pull request to have your change reviewed and approved.

## Testnet bootstrap nodes

Currently, Kadena `testnet06` has the following bootstrap nodes running on port 443:

- us1.testnet.chainweb.com
- us2.testnet.chainweb.com
- eu1.testnet.chainweb.com
- eu2.testnet.chainweb.com
- ap1.testnet.chainweb.com
- ap2.testnet.chainweb.com

## Mainnet bootstrap nodes

Currently, Kadena `mainnet01` has the following bootstrap nodes running on port 443:

- us-e1.chainweb.com
- us-e2.chainweb.com
- us-e3.chainweb.com
- us-w1.chainweb.com
- us-w2.chainweb.com
- us-w3.chainweb.com
- jp1.chainweb.com
- jp2.chainweb.com
- jp3.chainweb.com
- fr1.chainweb.com
- fr2.chainweb.com
- fr3.chainweb.com