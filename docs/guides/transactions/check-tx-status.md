---
title: Check transaction status
description: "A guide to crafting blockchain calls using Traditional API, Kadena CLI, and Kadena.js"
id: howto-check-tx-status
---

# Check transaction status

You can check the status of transactions using the transaction request key and the `/poll` or `/listen` endpoints.
To check the status of single transaction and wait for a result, use the `/listen` endpoint.
To check the status for a list of transaction request keys, use the `/poll` endpoint.

## Using kadena-cli commands

If you have installed the `kadena-cli` package in your development environment, you can use the `kadena tx status` command to check the status of a transaction on the development, test, or main network.

To check transaction status using `kadena-cli`:

1. Open a terminal on your local computer.

2. Check that you have `kadena` installed by running the following command:
   
   ```bash
    which kadena
   ```

   You should see the path to the file similar to the following:
   
   ```bash
   /usr/local/bin/kadena
   ```

3. Check the transaction status with interactive prompting by running the following command:
   
   ```bash
   kadena tx status
   ```
   
   Enter the **request key**.
   Select the **network**.
   Enter the **chain identifier**.
   
   The command returns status information for the request key similar to the following:

   ```bash
   Transaction Status: success
   Chain ID            5                                                                 
   Transaction Status  success                                                           
   Transaction ID      2944                                                              
   Gas                 60662                                                             
   Block Height        2922                                                              
   Event:coin.TRANSFER pact-random-key                                                   
                       k:f89ef46927f506c70b6a58fd322450a936311dc6ac91f4ec3d8ef949608dbf1f
                       0.060662     
   ```

## Using the Kadena client library

If you're familar with TypeScript or JavaScript, you can use functions from the Kadena client library to write a script similar to the following:

```typescript
const NETWORK_ID = 'testnet06';
const CHAIN_ID = '1';
const API_HOST = `https://api.testnet.chainweb.com/chainweb/0.0/${NETWORK_ID}/chain/${CHAIN_ID}/pact`;
 
if (process.argv.length !== 3) {
  console.info(HELP);
  process.exit(1);
}
 
getTxStatus(process.argv[2]);
 
async function getTxStatus(requestKey) {
  const txResult = await Pact.fetch.listen({ listen: requestKey }, API_HOST);
  console.log(txResult);
}
```