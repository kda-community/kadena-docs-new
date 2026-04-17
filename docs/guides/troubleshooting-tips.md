---
title: Troubleshooting tips
description: "Tips for troubleshooting common issues when connecting to Chainweb nodes or calling Kadena API endpoints."
id: troubleshooting
toc_min_heading_level: 2
toc_max_heading_level: 3
---

# Troubleshooting tips

If you encounter errors, warnings, or Bad Request failures when you attempt to connect to a Chainweb nodes or call Kadena API endpoints, you should check for the following common issues and potential solutions.

## Common API issues

It can be challenging to call REST API endpoints manually from the command-line because of all of the information you must include in the URL to reach a node that can respond to your request.
The following are the most common causes of potential issues when you have problems calling Kadena API endpoints.

### Network and chain identifiers
  
You should verify that you are using the correct network identifier and chain in the call.
Most API endpoints require you to specify the network identifier, such as `testnet06` or `mainnet01`, and a specific chain identifier in the request.
If you specify testnet or mainnet or the wrong chain identifier, you'll receive a Bad Request or empty response instead of the information you expect.
If you're submitting or checking the status of a transaction, be sure you've specified the correct chain identifier, and, if applicable, that there are sufficient funds to pay transaction fees on the network and chain you specify.

### Transaction formatting
  
If you are using YAML files to format your transaction requests and encounter errors, check the YAML file for formatting or field name errors. 
There are slight differences in the fields expected and how they are defined in the YAML file depending on whether you are sending a signed transaction request with a public and secret key, an unsigned transaction request with a public key, or using a transaction template and the Kadena CLI to submit the transaction.
For more information about transaction formatting, see the following topics:
  
- [Transaction format and flow](/smart-contracts/transactions)
- [Construct transactions](/guides/transactions/howto-construct-tx)
- [Sign and submit transactions](/guides/transactions/howto-sign-submit-tx)

### Gas management
  
Although default values for the gas limit and gas price might be appropriate for most situations, you should always check the settings and adjust them when necessary.
For example, if you're deploying a complex contract, you might need to set a higher gas limit or gas price to ensure your transaction is processed.

### Nonce handling
  
The nonce setting is optional in YAML request files and defaults to the transaction creation time, if not set.
However, it's a best practice to include a unique nonce to prevent duplicate transactions.

### Error handling
  
If you don't get the results you expect from an API request, you should always check the response for any additional information about the errors encountered.

### Security
  
  If an API request fails, you should check the keys you used to sign the transaction request and verify you are using the correct keys and accounts for the network and chain you connect to.
  Most Chainweb service API requests don't require a secure (HTTPS) connection.
  However, private keys are used to sign requests, so in most cases you should use a secure connection when calling API endpoints.

For more information about calling specific endpoints and their parameters, see the [API documentation](/api).

## Common Pact contract issues

In most cases, Pact error messages provide the information you need to resolve coding issues such as invalid syntax or formatting errors.
However, there a few common errors that can be more difficult to diagnose and resolve.
The following are the most common errors that you might encounter when executing functions defined in Pact contracts.

### Contract-specific errors

If you see an error message that isn't a Pact interpreter error, you should copy the message and search in the smart contract you are executing for a matching message. 
It's likely that the function definition includes an `enforce` statement that contains the message and the error indicates that you haven't met all of the conditions that the `enforce` statement defines.

### Not enough input parsing error

One of the most common Pact parsing errors you might see is a signing error that's similar to the following:

```pact
Error in $.signers[0].clist[0].name: ".": not enough input
```

This error typically indicates that you've forgotten to add the namespace of a capability that you tried to sign for. 
Even contracts that are deployed in the root namespace must include at least the module name before the capability name. 
For example, the capabilities defined in the `coin` contract require you to specify the `coin` module name before the capability name, such that to acquire the `TRANSFER` capability, you must sign for the `coin.TRANSFER` capability.

For most contracts, you must sign for capabilities using a registered namespace, like `free` or `user` or a principal namespace like `n_eef68e581f767dd66c4d4c39ed922be944ede505`, and the module name before the capability name.
For example, if you define the `VOTER_REG` capability in a `vote-mgr` module and deploy the module in the `free` namespace, you would sign for the `free.vote-mrg.VOTER_REG` capability.

### Error: Keyset failure ...

If you see a keyset failure, you should check for the following issues:

- Check whether you have signed the transaction using the required keyset.
- Check that you've met the conditions that are specified inb the keyset predicate.
  For example, if a keyset requires more that one key to sign the message, be sure you have signed with the required number of keys.
- Check that you have signed for all required capabilities.
  For example, if you have signed to a acquire a capability, check whether the function requires you to sign for additional capabilities by reviewing the `with-capability` statements to be sure that all capabilities are in scope.

### Capability not in scope

If you attempt to access an account or row that is guarded by a capability defined outside of the scope of a function, executing the function might fail because the capability is not in scope. 
In this case, you might need to execute a different function that brings the capability into scope for the function you intended to execute.

## Common Chainweb node issues

The most common issues you might encounter if you're a node operator or attempting to connect to a remote node are problems with peer synchronization, network interruptions, or node unavailability.

The following are the most common causes of potential issues when you have problems connecting to Chainweb nodes.

### Out of date binaries
  
Peer synchronization failures are often caused by nodes with out of date binaries or dependencies.
For example, if a node attempts to synchronize with an outdate version of the `librocksdb` library, peer synchronization will fail. 
To address this issue, you should make that any node you control is up to date with the most recent official release of the `chainweb-node` binary.

### Timeout exceptions
  
If a synchronizing node fails to provide timely feedback to the network, other nodes will receive a timeout exception warning. 
Generally, the warning can be ignored and nodes can synch to alternative nodes. 
These exceptions can be fixed by issuing a `ConnectionTimeout` statement.

### Something went wrong exceptions
  
A "Something went wrong" error signals an internal server error due to misconfiguration. 
If you see this error, you should regenerate your current configuration file and post a message on the Kadena Discord server [#infrastructure](https://discord.com/channels/502858632178958377/1051827506279370802) channel to make sure your node is configured correctly.
  
To regenerate the configuration:
  
```bash
./chainweb-node --print-config > config.yaml
```

### Network communication issues
  
Every Chainweb node maintains a list of peers. 
You can connect to the `/cut/peer` endpoint on any node to discover its list of peers. 
For example, to see a list of peers for a bootstrap node, you can run a command similar to the following:
  
```bash
curl -sk "https://us-e2.chainweb.com/chainweb/0.0/mainnet01/cut/peer" | python -m json.tool | grep hostname
```

The command returns information about peer nodes similar to the following:

```bash
    "hostname": "46.38.245.213",
    "hostname": "fr1.chainweb.com",
    "hostname": "95.214.55.90",
    "hostname": "api.kda.kaddex.xyz",
    "hostname": "us-w3.chainweb.com",
    "hostname": "195.201.194.100",
    "hostname": "89.58.13.15",
    "hostname": "37.221.196.102",
    "hostname": "3.75.157.154",
    "hostname": "node.kadena.fun",
    "hostname": "cw.hyperioncn.net",
    "hostname": "195.201.194.100",
    "hostname": "fr2.chainweb.com",
    "hostname": "212.25.52.40",
```

### Network configuration issues
  
If you do not have incoming and outgoing ports configured correctly on your router, network traffic might be blocked, preventing access to the node, or the node might be offline.
To see is a node is accessible, you can try pinging the node with a command similar to the following:
  
```bash
ping -c 3 <node ip>
```
  
You can also try sending a request to the /health-check endpoint for a node:
  
```bash
curl -k https://<node-ip>:443/health-check
```
  
A healthy node should return the following:
  
```bash
Health check OK.
```
  
If a node is down, try connecting to a different node.