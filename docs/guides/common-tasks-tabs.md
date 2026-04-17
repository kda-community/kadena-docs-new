---
title: Common task quick reference
description: "Quick reference for common tasks"
id: howto-quick-ref
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
import CodeBlock from '@theme/CodeBlock';

# Common task quick reference

This guide provides a quick reference for the most common API calls:

- Check account balances
- Transfer coins
- Deploy smart contracts

Regardless of the method you choose, each task requires you to connect to an appropriate network endpoint with a payload in the expected format.
The payload contains all of the information required to complete the task.
The difference between using the API directly or the abstraction provided by the Kadena CLI or Kadena.js libraries is simply in how you deliver the request.

## Check account balances

<Tabs>
  <TabItem value="api" label="API" default>

Call the `coin.get-balance` function with the account name string as an argument using `curl` and a JSON object.
For principal accounts, the account name starts with a prefix.
For example, the `k:` prefix for single key accounts or the `w:` prefix for accounts with multiple keys.

    ```bash
    curl -X POST "https://api.chainweb.com/chainweb/0.0/testnet06/chain/1/pact/api/v1/local" \
     -H "Content-Type: application/json" \
     -d '{
       "exec": {
         "data": {},
         "code": "(coin.get-balance \"k:<account-public-key>\")"
       },
       "meta": {
         "chainId": "1",
         "sender": "k:<account-public-key>",
         "gasLimit": 100000,
         "gasPrice": 0.0000001,
         "ttl": 7200
       }
     }'
    ```
  </TabItem>

<TabItem value="cli" label="Kadena CLI">
    
The `kadena-cli` package provides commands to perform many common operations like viewing balances.
You can also use `kadena-cli` to construct transactions using YAML request files.

    ```yaml
   kadena account details --account="k-bbccc9" --network="devnet" --chain-ids="all" 
    ```
  </TabItem>

<TabItem value="js" label="Kadena.js">
  
Use the `@kadena/client` package to create Pact transactions and client connections.

  ```javascript
  import {Pact, createClient} from '@kadena/client'

    async function getBalance(account) {
  // `Pact.builder.execution` accepts a number of `Pact.modules.<module>.<fun>` calls
    const transaction = Pact.builder
      .execution(Pact.modules.coin['get-balance'](account))
      .setMeta({ chainId: '1' })
      .createTransaction();

    // client creation is separate from the transaction builder
    const staticClient = createClient('https://api.chainweb.com/chainweb/0.0/mainnet01/chain/1/pact');

    const res = await staticClient.local(transaction, {
      preflight: false,
      signatureVerification: false,
    });

}

getBalance(account).catch(console.error);
```

</TabItem>
</Tabs>

## Transfer coins

<Tabs>
<TabItem value="api" label="API" default>

Call the `coin.transfer` function with the sender, receiver, and amount as arguments using `curl` and a JSON object.

  ```bash
    curl -X POST "https://api.chainweb.com/chainweb/0.0/testnet06/chain/1/pact/api/v1/send" \
     -H "Content-Type: application/json" \
     -d '{
       "cmds": [{
         "hash": "<transaction-hash>",
         "sigs": ["<your-signature>"],
         "cmd": "{\"networkId\":\"testnet06\",\"payload\":{\"exec\":{\"data\":{\"amount\":10.0,\"receiver\":\"k:<receiver-public-key>\"},\
         "code\":\"(coin.transfer \\\"k:<sender-public-key>\",\"clist\":
          [{\"args\":[\"k:<sender-public-key>\",\"k:<receiver-public-key>\",10.0],\"name\":
          \"coin.TRANSFER\"}]}],\"meta\":{\"creationTime\":1724384042,\"ttl\":7200,\"gasLimit\":100000,\"chainId\":\"1\",\"gasPrice\":
          1.0e-7,\"sender\":\"k:<sender-public-key>\"},\"nonce\":\"2024-08-23 03:34:02.198258 UTC\"}"
       }]
     }'
    ```
</TabItem>

<TabItem value="cli" label="Kadena CLI">

The `kadena-cli` package provides a `transfer.ktpl` template that you can use with `kadena tx` commands to transfer coins.

1. Create a `transfer-coins.yaml` template data file with the transfer information similar to the following:

   ```yaml
   account:from: 'k:99d30af3fa91d78cc06cf53a0d4eb2d7fa2a5a72944cc5451311b455a67a3c1c'
   account:to: 'k:58705e8699678bd15bbda2cf40fa236694895db614aafc82cf1c06c014ca963c'
   decimal:amount: '1.0'
   chain-id: '3'
   key:from: '99d30af3fa91d78cc06cf53a0d4eb2d7fa2a5a72944cc5451311b455a67a3c1c'
   network:networkId: 'development'
   ```     

2. Create an unsigned transaction using the `transfer.ktpl` template and the `transfer-coins.yaml` data file, and save the transaction to a file:
   
   ```bash
   kadena tx add
   ```
   
3. Sign the transaction created with a wallet or key pair:
   
   ```bash
   kadena tx sign
   ```

4. Send the signed transaction file to the blockchain:
   
   ```bash
   kadena tx send
   ```
  </TabItem>

<TabItem value="js" label="Kadena.js">

You can use the `@kadena/client` package to create Pact transactions and client connections.

  ```javascript

  import { Pact, createClient } from '@kadena/client';

  const transferKDA = async (from, to, amount, pubKey) => {
    const client = createClient('https://api.chainweb.com/chainweb/0.0/mainnet01/chain/1/pact');

    const transaction = Pact.builder
      .execution(`(coin.transfer "${from}" "${to}" ${amount})`)
      .addSigner(pubKey, (signFor) => [
        signFor('coin.TRANSFER', from, to, amount),
        signFor('coin.GAS'),
      ])
      .setMeta({
        chainId: '1',
        gasLimit: 2500,
        gasPrice: 0.000001,
        sender: from,
      })
      .setNetworkId('mainnet01')
      .createTransaction();

    try {
      const signedTx = await signWithChainweaver(transaction); // Pick your preferred signing method
      const preflightResult = await client.preflight(signedTx);
      console.log('Preflight result:', preflightResult);

      if (preflightResult.result.status === 'failure') {
        console.error('Preflight failed:', preflightResult.result.error.message);
        return preflightResult;
      }

      const res = await client.submit(signedTx);
      console.log('Transaction submitted:', res);
      return res;
    } catch (error) {
      console.error('Error transferring KDA:', error);
    }
  };
 transferKDA('your-from-account', 'your-to-account', 0.1).catch(console.error);
```

  </TabItem>
</Tabs>

## Deploy smart contracts

<Tabs>
  <TabItem value="api" label="API" default>

Connect to the Pact API `send` endpoint to submit a transaction that deploys a smart contract.

  ```bash
  curl -X POST "https://api.chainweb.com/chainweb/0.0/testnet06/chain/1/pact/api/v1/send" \
     -H "Content-Type: application/json" \
     -d '{
       "cmds": [{
         "hash": "<transaction-hash>",
         "sigs": ["<your-signature>"],
         "cmd": "{\"networkId\":\"testnet06\",\"payload\":{\"exec\":{\"data\":{},\"code\":\"(namespace \'free)\n(define-keyset \'free.vote-testing-keyset
         (read-keyset \'vote))\n(module vote-testing \'free.vote-testing-keyset\n  (defschema vote\n    voter:string\n    option:string)\n  (deftable votes:{vote})\n
         (defun vote (poll-id:string option:string)\n    (insert votes (format \"{}-{}\" [poll-id (at \'sender (chain-data))])\n      { \"voter\": (at \'sender (chain-data))\n
                 \"option\": option\n      }\n    )\n  )\n)\"}},\"signers\":[{\"pubKey\":\"f1e12312e4ee8c156b041c3bcc7e422e7d15cb2ddce58c6ff16742770916cfaa\",\
                 "clist\":[{\"args\":[],\"name\":\"coin.GAS\"}]}],\"meta\":{\"creationTime\":1724384042,\"ttl\":7200,\"gasLimit\":100000,\"chainId\":\"1\",\
                 "gasPrice\":1.0e-7,\"sender\":\"k:f1e12312e4ee8c156b041c3bcc7e422e7d15cb2ddce58c6ff16742770916cfaa\"},\"nonce\":\"2024-08-23 03:34:02.198258 UTC\"}"
       }]
     }'
  ```
  </TabItem>

<TabItem value="cli" label="Kadena CLI">

You can use `kadena-cli` and YAML configuration files or templates to deploy contracts with `kadena tx` commands.

1. Create a YAML configuration for deploying a smart contract.
   
   ```yaml
   # deploy-hello.yaml
   code: |-
     (namespace 'free)
       (module simplemodule GOV
        (defcap GOV () true)
        (defconst TEXT:string "Hello World")
        (defun greet:string () TEXT)
    )   
    data:
     ks: {
       keys: [DEPLOYER_PUBLIC_KEY],
       pred: "keys-all"
     }
   meta:
     chainId: "{{chain-id}}"
     sender: "DEPLOYER_ACCOUNT_NAME"
     gasLimit: 80300
     gasPrice: 0.000001
     ttl: 600
   signers:
     - public: "DEPLOYER_PUBLIC_KEY"
       caps:
         - name: "coin.GAS"
           args: []
   networkId: "{{network-id}}"
   type: exec
   ```

2. Create a new unsigned transaction:
   
   ```bash
   kadena tx add
   ```

3. Sign the unsigned transaction:

   ```bash
   kadena tx sign
   ```

4. Send the signed transaction to the network:
   
   ```bash
   kadena tx send
   ```
  </TabItem>

<TabItem value="js" label="Kadena.js">

You can use the `@kadena/client` package to create Pact transactions and client connections to deploy a contract.

```javascript
import { Pact, createClient, signWithChainweaver } from '@kadena/client';

async function deployContract(deployer, pubKey) {
     const pactClient = createClient('https://api.chainweb.com/chainweb/0.0/mainnet01/chain/0/pact');

     const tx = Pact.builder
        .execution(`
                  (namespace 'free)
                  (module simplemodule GOV
                    (defcap GOV () true)
                    (defconst TEXT:string "Hello World")
                    (defun greet:string () TEXT)
                  )`)
        .addSigner(pubKey, (signFor) => [signFor('coin.GAS')])
        .setMeta({
          chainId: '1',
          gasLimit: 80300,
          gasPrice: 0.000001,
          sender: deployer,
        })
        .setNetworkId('mainnet01')
        .createTransaction();

    try {
      const signedTx = await signWithChainweaver(transaction); // Pick your preferred signing method
      const preflightResult = await client.preflight(signedTx);
      console.log('Preflight result:', preflightResult);

      if (preflightResult.result.status === 'failure') {
        console.error('Preflight failed:', preflightResult.result.error.message);
        return preflightResult;
      }

      const res = await client.submit(signedTx);
      console.log('Contract deployed:', res);
      return res;
    } catch (error) {
      console.error('Error deploying contract:', error);
    }
};
deployContract('your-deployer-account', contractCode).catch(console.error);
```
</TabItem>
</Tabs>

