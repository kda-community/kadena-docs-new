---
title: Deploy smart contracts
description: "A guide to deploying smart contracts using an API call, the Kadena CLI, and Kadena.js"
id: howto-deploy-contracts
---

# Deploy smart contracts

This guide provides instructions and examples for deploying a smart contract by using an API call, the Kadena CLI, or the Kadena client TypeScript library.

## Using a YAML request and curl

One way you can deploy a new smart contract is by constructing a YAML execution request, formatting the request as a JSON object, and sending the request to an API endpoint using the `curl` command.
You could also submit the request using Postman or other tools that enable you to call API endpoints directly.
However, formatting an API request manually is typically an error-prone process and inserting full contract code—even for a simple contract—into a YAML configuration file can often lead to unexpected results or errors.

In most cases, constructing a transaction to deploy a smart contract is less error-prone if you use the Kadena CLI.
The Kadena CLI uses the Kadena client library as a foundation for abstracting and simplifying interaction with the blockchain.

If you want to deploy a contract by using the `curl` command directly, the following example illustrates the steps involved.

To deploy a smart contract with a `curl` command:

1. Generate a public and secret key pair and save them to a file.
   
   ```bash
   pact --genkey > pistolas.yaml
   ```

   For this example, the following keys are used:

   ```yaml
   public: 3bdb1d3c48a1bb5f072b067e265ce5d9a5eabf5e290128be4d2623dd559ca698
   secret: 682ce35a77eece5060537632423de96b965136bd7739c5064903612c0b300608
   ```

   Use the public key to create and fund an account on at least one chain in the development, test, or main network.
   For example: 
   
   - Use `kadena account add` to add an account for the public key manually in the development network and one or more chains.
   - Use `kadena account fund` to fund the account on one or more chains.
  
2. Construct the transaction using the YAML transaction request format.
   For example, using the account values associated with the 3bdb1d3c48a1bb5f072b067e265ce5d9a5eabf5e290128be4d2623dd559ca698 public key account, the YAML file looks like this:
   
   ```yaml
   # deploy-vote.yaml - YAML configuration for deploying a smart contract
   codeFile: "simple-vote.pact"
   data:
   publicMeta:
     chainId: "3"
     sender: "pact-generated-key"
     gasLimit: 80300
     gasPrice: 0.000001
     ttl: 6000
   keyPairs:
     - public: 3bdb1d3c48a1bb5f072b067e265ce5d9a5eabf5e290128be4d2623dd559ca698
       secret: 682ce35a77eece5060537632423de96b965136bd7739c5064903612c0b300608
       caps:
         - name: "coin.GAS"
           args: []
   networkId: "development"
   type: exec
   ```

3. Convert the YAML transaction request to a valid transaction JSON object.
   
   ```bash
   pact --apireq deploy-vote.yaml > deploy-vote.json
   ```

1. Use `curl` to connect to the `/send` endpoint to deploy the contract.
   For example, you can run a command similar to the following to deploy a contract on the `development` network:

   ```bash
   curl -X POST -H "Content-Type: application/json" -d "@deploy-vote.json" http://localhost:8080/chainweb/0.0/development/chain/3/pact/api/v1/send
   ```
   
   The command returns a request key that you can use to view the transaction results in the block explorer.

## Using kadena-cli commands

With the `kadena-cli`, you can construct a transaction template to deploy smart contracts.
You can then customize the transactions to deploy the same contract on different chains or different networks.
Depending on how you create your template, you can also use it to deploy different types of contracts with interactive prompting for values or by setting command-line options.

To deploy a smart contract using `kadena-cli`:

1. Create a `deploy-contract.ktpl` template file with the template variables for deploying a contract.
   
   Note that you can embed Pact code directly in a template or data file using the `code` key.
   Alternatively, you can use the `codeFile` key to specify the path to a Pact file. 
   For example, you might create a template file similar to the following:

   ```yaml
   # deploy-contract.yaml - YAML configuration for deploying a smart contract
   codeFile: |-
     "{{contract-filename}}"
   data:
     ks: {
       keys: [58705e8699678bd15bbda2cf40fa236694895db614aafc82cf1c06c014ca963c],
       pred: "keys-all"
     }
   publicMeta:
     chainId: "{{chain-id}}"
     sender: "{{{deployer-account}}}"
     gasLimit: 80300
     gasPrice: 0.000001
     ttl: 600
   signers:
     - public: "{{deployer-public-key}}"
       caps:
         - name: "coin.GAS"
           args: []
   networkId: "{{network-id}}"
   type: exec
   ```

   For convenience, you can move the `deploy-contract.ktpl` template to the `.kadena/transaction-templates` directory, so that the template is listed when you add transactions with interactive prompting.

2. Create a new unsigned transaction using the `kadena tx add` command and the `deploy-contract.ktpl` template and follow the prompts displayed to set the appropriate information.

   - For the `contract-filename` template value, specify the path to the Pact file you want to deploy. 
     The path should be relative to the `.kadena/transaction-templates` directory.
   - For the `deployer-account` template value, specify the account name of the contract owner. 
     In this example, it's the Chainweaver wallet account `k:58705e8699678bd15bbda2cf40fa236694895db614aafc82cf1c06c014ca963c`
     and the public key is `58705e8699678bd15bbda2cf40fa236694895db614aafc82cf1c06c014ca963c`.
   - For the `chain-id` and `network-id` template values, specify the chain and network where you want to deploy the contract.
     In this example, the contract is deployed on chain `3` in the `development` network.

   For example, the prompts and output for creating the transaction look similar to the following:
   ```bash
   kadena tx add
   ? Which template do you want to use: deploy-hello.ktpl
   ? File path of data to use for template .json or .yaml (optional):
   ? Template value contract-filename: deploy-hello.pact
   ? Template value chain-id: 3
   ? Template value deployer-account:
   k:58705e8699678bd15bbda2cf40fa236694895db614aafc82cf1c06c014ca963c
   ? Template value deployer-public-key:
   58705e8699678bd15bbda2cf40fa236694895db614aafc82cf1c06c014ca963c
   ? Template value network-id: development
   ? Where do you want to save the output: test-hello
   {
     "cmd": "{\"payload\":{\"exec\":{\"code\":\"(namespace 'free)\\n    (module simplemodule GOV\\n    (defcap GOV () true)\\n      (defconst TEXT:string \\\"Hello World\\\")\\n      (defun greet:string () TEXT)\\n)\\n\",\"data\":{\"ks\":{\"keys\":[\"58705e8699678bd15bbda2cf40fa236694895db614aafc82cf1c06c014ca963c\"],\"pred\":\"keys-all\"}}}},\"nonce\":\"\",\"networkId\":\"development\",\"meta\":{\"sender\":\"k:58705e8699678bd15bbda2cf40fa236694895db614aafc82cf1c06c014ca963c\",\"chainId\":\"3\",\"creationTime\":1733266205,\"gasLimit\":80300,\"gasPrice\":0.000001,\"ttl\":600},\"signers\":[{\"pubKey\":\"58705e8699678bd15bbda2cf40fa236694895db614aafc82cf1c06c014ca963c\",\"clist\":[{\"name\":\"coin.GAS\",\"args\":[]}]}]}",
     "hash": "B-j2_RSbfNixi3tAP6yl3PAGG1WU2RuGV4Wy9x4pcS8",
     "sigs": [
       null
     ]
   }
   
   transaction saved to: ./test-hello.json
   ```

3. Sign the unsigned transaction using the `kadena tx sign` command and the transaction file name generated by the `kadena tx add` command.
   
   For example, the prompts and output for the transaction look similar to the following:

   ```bash
   kadena tx sign
   ? Select an action: Sign with wallet
   ? Select a transaction file: Transaction: test-hello.json
   ? 1 wallets found containing the keys for signing this transaction, please 
   select a wallet to sign this transaction with first: Wallet: chainweaver-web
   ? Enter the wallet password: ********
   Command 1 (hash: B-j2_RSbfNixi3tAP6yl3PAGG1WU2RuGV4Wy9x4pcS8) will now be signed with the following signers:
   Public Key                                                       Capabilities
   58705e8699678bd15bbda2cf40fa236694895db614aafc82cf1c06c014ca963c coin.GAS()  
   Transaction executed code: 
   "(namespace 'free)\n    (module simplemodule GOV\n    (defcap GOV () true)\n      (defconst TEXT:string \"Hello World\")\n      (defun greet:string () TEXT)\n)\n"
   
   Transaction with hash: B-j2_RSbfNixi3tAP6yl3PAGG1WU2RuGV4Wy9x4pcS8 was successfully signed.
   Signed transaction saved to /Users/lisagunn/KADENA-DOCS-NextGen/pact-coding-projects/transaction-B-j2_RSbfN-signed.json
   ```

4. Send the signed transaction using the `kadena tx send` command and the signed transaction file name generated by the `kadena tx sign` command.
   
   For example, the prompts and output for the transaction look similar to the following:

   ```bash
   kadena tx send
   ? Select a transaction file: Transaction: transaction-B-j2_RSbfN-signed.json
   ⠋ Sending transactions...
   
   Transaction detail for command with hash: B-j2_RSbfNixi3tAP6yl3PAGG1WU2RuGV4Wy9x4pcS8
   Network ID  Chain ID
   development 3       
   
   
   ✔ Completed
   Transaction: B-j2_RSbfNixi3tAP6yl3PAGG1WU2RuGV4Wy9x4pcS8 submitted with request key: B-j2_RSbfNixi3tAP6yl3PAGG1WU2RuGV4Wy9x4pcS8
   ```

   After the transaction is sent to the blockchain, you can verify deployment in the block explorer by using the request key.

## Using the Kadena client library

If you prefer to work with JavaScript, you can use the `@kadena/client` library to write your own scripts to deploy contracts and perform other tasks. 
The `@kadena/client` library implements a TypeScript-based API for interacting with smart contracts and Chainweb nodes. 
The library provides functions that simplify building transactions with Pact commands and connecting to blockchain nodes.
You should note that creating the client connection is separate from using the `Pact.builder` function to construct transactions.

The following example illustrates what a script using `@kadena/client` to deploy a smart contract would look like.
This example deploys the `simplemodule` in the `free` namespace on the `testnet06` network.


```typescript
import type { ICommand } from '@kadena/client';
import { Pact, createClient } from '@kadena/client';
import { createRequestToSign } from './util/requestToSign';

const signTransaction = createRequestToSign();

async function deployContract(
  deployerAccount: string,
  pubKey: string,
  contractCode: string,
) {
  const pactClient = createClient();

  const tx = Pact.builder
    .execution(contractCode)
    .addSigner(pubKey, (signFor) => [signFor('coin.GAS')])
    .setMeta({
      chainId: '1',
      gasLimit: 80300,
      gasPrice: 0.0000001,
      senderAccount: deployerAccount,
    })
    .setNetworkId('testnet06')
    .createTransaction();

  try {
    const signedTx = (await signTransaction(tx)) as ICommand; // Pick your preferred signing method
    const preflightResult = await pactClient.preflight(signedTx);
    console.log('Preflight result:', preflightResult);

    if (preflightResult.result.status === 'failure') {
      console.error('Preflight failed:', preflightResult.result.error);
      return preflightResult;
    }

    const res = await pactClient.submit(signedTx);
    console.log('Deploy request sent', res);
    const result = await pactClient.pollOne(res);
    if (result.result.status === 'failure') {
      console.error('Deploy failed:', result.result.error);
    }
    return result;
  } catch (error) {
    console.error('Error deploying contract:', error);
  }
}
const deployerKDAAccount =
  'k:94eede9754031395401332c2032694da9dd2f7972fb039070f698a3173745a8b';
const deployerPublicKey =
  '94eede9754031395401332c2032694da9dd2f7972fb039070f698a3173745a8b';
deployContract(
  deployerKDAAccount,
  deployerPublicKey,
  `
  (namespace 'free)
  (module simplemodule GOV
    (defcap GOV () true)
    (defconst TEXT:string "Hello World")
    (defun greet:string () TEXT)
  )`,
)
  .then((result) => {
    console.log('Contract deployed:', result);
  })
  .catch(console.error);
```

The following example illustrates using a `requestToSign` helper script.

```typescript
import type { ICommand, IUnsignedCommand } from '@kadena/types';

const browserPrompt = async (command: string) => {
  await window.navigator.clipboard.writeText(command);
  return Promise.resolve(
    window.prompt(
      `Command:\n${command}\nCommand copied to the clipboard\nEnter Signature:\n)`,
    ) ?? '',
  );
};

const nodePrompt = async (command: string) => {
  const message = `Command:\n${command}\nEnter Signature:\n`;
  const readline = await import('node:readline');
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
  return new Promise<string>((resolve) => {
    rl.question(message, (answer) => {
      resolve(answer);
      rl.close();
    });
  });
};

export function createRequestToSign(
  prompt: (message: string) => Promise<string> = typeof window !== 'undefined'
    ? browserPrompt
    : nodePrompt,
) {
  return async (command: IUnsignedCommand): Promise<ICommand> => {
    const sig = await prompt(JSON.stringify(command, null, 2));
    return {
      ...command,
      sigs: [{ sig }],
    };
  };
}
```