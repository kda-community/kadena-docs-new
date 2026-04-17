---
title: Develop with @kadena/client
description: "The _Get started with @kadena/client_ library provides a beginner's guide to using the @kadena/client TypeScript API for interacting with Pact smart contracts and Chainweb nodes using JavaScript or TypeScript frontend frameworks."
id: kadena-client-quickstart
sidebar_position: 9
tags: ['TypeScript', 'Kadena', 'Kadena client', 'frontend']
---

# Develop with @kadena/client

Welcome to the _Quick Start Beginners Guide_ for the Kadena client TypeScript library. 
The `@kadena/client` library is a Node package that you can install and manage using the `npm` package manager.
This library enables you to connect to and interact with the Kadena blockchain using JavaScript or TypeScript programs. 
If you're new to programming, this guide provides everything you need to know to get started.
If you're an experienced JavaScript or TypeScript developer, you can skip this guide and go directly to the [Kadena TypeScript client](/reference/kadena-client) reference information.

## What is @kadena/client?

The Kadena client library provides an _application programming interface (API)_—in the form of functions—that enable web applications that are written as JavaScript or TypeScript programs to talk to the Kadena blockchain. 
By providing support for web applications that run as JavaScript or TypeScript programs, the library helps you build interactive features that add, use, or modify information in the blockchain. 
For example, the library simplifies common tasks by abstracting the logic required to connect to the blockchain when you want to:

- Check account balances
- Create new accounts
- Transfer assets betweeen accounts
- Send transactions to execute smart contract functions
- Sign transactions with digital signatures

### About JavaScript and TypeScript

It's worth noting that `@kadena/client` is a TypeScript library.

- **JavaScript (JS)** is a programming language that runs directly in web browsers and on servers to enable interactive and dynamic user experiences.
  Unlike HTML that's used to structure content or CSS that's used to style content, JavaScript adds interactivity to web pages by supporting user interactions like mouse clicks and keyboard input, dynamic changes to page content, and asynchronous requests to servers.
- **TypeScript (TS)** is a superset of JavaScript that adds features that aren't supported in JavaScript, such as static type checking and compile-time error checking to find problems before your code runs.
  Because TypeScript is a superset of JavaScript, any valid JavaScript code is also valid TypeScript code.
  However, the additional features that TypeScript provides must be removed to compile TypeScript code as standard JavaScript.

### About TypeScript tooling

You can't execute TypeScript programs that include TypeScript syntax, such as type notation, with programs programs that don't support that syntax. 
For example, you can't use `Node.js` to execute a TypeScript program—as a file with the `.ts` extension—directly or if the file includes any TypeScript type notation.

To execute TypeScript programs, you have three options:

- Compile the TypeScript file to JavaScript using the TypeScript compiler, then execute the JavaScript file.
  For example:
  
  ```bash
  tsc kadena-sample-program.ts
  node kadena-sample-program.js
  ```

- Install and use `tsx` for fast execution without compiling the TypeScript file as a separate step. 
  For example:
  
  ```bash
  npm install --global tsx
  tsx kadena-sample-program.ts
  ```

- Install and use `ts-node` to compile and execute the TypeScript file with the TypeScript compiler.
  For example:
  
  ```bash
  npm install --global ts-node
  ts-node kadena-account-creator.ts
  ```

The programs in this guide use TypeScript syntax and use `tsx` to demonstrate executing the programs without compiling to JavaScript first.

## Before you begin

You must have a few common software development tools installed on your computer to follow the instructions in this guide.
Verify the following basic requirements:

- **Node.js** is a cross-platform execution environment for JavaScript code and **npm** is a package manager that helps you install and manage code libraries like the `@kadena/client` library.

  - Download [Node.js](https://nodejs.org/), version 18 or later, and choose the Long Term Support (LTS) version, if necessary.
  - Run `node --version` to verify the version of `node` you are running.
  - Run `npm --version` to verify `npm` is installed and the version of it you are running.

- **TypeScript** is progamming language you'll use to create programs that use the `@kadena/client` library.
  - Run `tsc --version` to check whether TypeScript is installed and the version of it you are running.

- **Code editor** can be a simple text editing program or an integrated development environment (IDE) such as Microsoft [Visual Studio Code](https://code.visualstudio.com/).

- **Basic terminal shell** is a program that enables you to execute commands interactively in through command-line programs.

## Prepare your first project

Now that you have had an introduction to the @kadena/client library and familiar with the tooling required to work with TypeScript programs, you're ready to create your first project by following these step-by-step instructions. 

To prepare a new project:

1. Open a terminal shell on your computer.
2. Create a new folder and change to the project directory by running the following command to create a new `my-kadena-app` project:

   ```bash
   mkdir my-kadena-app && cd my-kadena-app
   ```
   
   This command creates a new folder called "my-kadena-app" and makes that folder your current working directory.

3. Initialize the new project by running the following command:
   
   ```bash
   npm init --yes
   ```
   
   This command creates a `package.json` file in your project directory that keeps track of your project settings and dependencies.

4. Install the required libraries by running the following commands:
   
   ```bash
   npm install @kadena/client
   npm install --save-dev @kadena/pactjs-cli typescript ts-node
   ```
   
   The first command adds a `node_modules` folder to your project directory and downloads and installs `the @kadena/client` library and related development tools.
   The second command adds development dependencies for packages that support working with Pact types and TypeScript programs.

   After running these commands, your project includes the following folders in the node_modules/@kadena folder:
   
   - chainweb-node-client
   - client
   - cryptography-utils
   - pactjs
   - pactjs-cli
   - pactjs-generator

5. Initialize settings for TypeScript by running the following command:
   
   ```bash
   npx tsc --init
   ```
   
   This command creates a `tsconfig.json` TypeScript configuration file in your project.

## Prepare to interact with a smart contract

Before you start writing any code, it's important to understand how the programs will interact with the blockchain.
- The Kadena blockchain network consists of computers that run **Chainweb node** software.

- **Smart contracts** are program that run on the blockchain nodes to execute operations according to specific rules.

- **Pact** is a smart contract programming language that can be interpreted and executed by Chainweb nodes.
  The functions in the `@kadena/client` library translate TypeScript operations that a browser can understand into Pact operations that Chainweb nodes can recognize and act on.

- The **coin** Pact module is a built-in smart contract that handles ledger operations for the Kadena native cryptocurrency, KDA. 

- **Ledger operations** are functions that involve activity like creating and updating **accounts** that hold assets and **transfers** that move assets from one account to another.

All of the programs in this guide demonstrate how to use the `@kadena/client` library to call functions that are defined using the Pact programming language in the `coin` contract. 

## Example: Check an account balance

To start with something simple, like checking an account balance, you must have at least one account on the Kadena development, test, or main production network.
If you don't have an account on any Kadena network, you should start by creating one.
If you have the `@kadena/kadena-cli` package installed, you can use `kadena account add` to create an account.

For this example, the account is on the Kadena `development` network running locally and the code checks the balance on chain `3` for the account.
To execute the sample code in your own environment, you must modify the example code to reflect the account name, network identifier, and chain identifier for the account you've created. 

To create a program that checks an account balance:

1. Create a new file called `check-balance.ts` in your code editor.

2. Add the following code to the file and modify the network and chain, if necessary:

   ```javascript
   // Import the tools we need from the Kadena library.
   import { Pact, createClient} from '@kadena/client';
   
   // Create an asynchronous function that checks a Kadena account balance.
   async function checkBalance(accountName) {
     console.log(`Checking balance for account: ${accountName}`);
     
     try {
       // Step 1: Build a transaction that uses the Pact language.
       const transaction = Pact.builder
         .execution(
           // Call the "get-balance" function from the "coin" smart contract
           Pact.modules.coin['get-balance'](accountName)
         )
         // Specify the chain to check.
         .setMeta({ chainId: '3' }) 
         .createTransaction();
     
       // Step 2: Create a client on a specific chain in the Kadena development network.
       const client = createClient(
         'http://127.0.0.1:8080/chainweb/0.0/development/chain/3/pact'
       );
   
       // To connect to the Kadena test network, replace the client URL with one
       // similar to the following:
       // 'https://api.testnet.chainweb.com//chainweb/0.0/testnet06/chain/3/pact'

       // Step 3: Send the request to the blockchain.
       const result = await client.local(transaction, {
         preflight: false,
         signatureVerification: false,
       });
   
       // Step 4: Display the result
       if (result.result.status === 'success') {
         console.log(`Balance: ${result.result.data} KDA`);
         return result.result.data;
       } else {
         console.log('Error:', result.result.error);
       }
     } catch (error) {
       console.log('Something went wrong:', error.message);
     }
   }
   
   // Example usage - replace with a real Kadena account
   const exampleAccount = 'k:58705e8699678bd15bbda2cf40fa236694895db614aafc82cf1c06c014ca963c';
   checkBalance(exampleAccount);
   ```

3. Open a terminal shell and enter the following command to execute the program:
   
   ```bash
   tsx check-balance.ts
   ```

   If you've modified the network, chain, and account name, you should see output similar to the following:

   ```bash
   Checking balance for account: k:58705e8699678bd15bbda2cf40fa236694895db614aafc82cf1c06c014ca963c
   Balance: 47 KDA
   ```

### Review the sample code

Now that you've seen the `@kadena/client` library in action in a simple example, let's review the code to understand what each part of the program does.

In general, you can see that the program consists of the following keys parts:

- **Import** statement
- **Function** definition
- Constructing the **transaction**
- Creating the **client**
- Sending the transaction **request**

### What happens in each part

1. **Import** statement: `import { Pact, createClient} from '@kadena/client';`
   - Pulls in the specific functions needed from the Kadena client library.

2. **Function** definition: `async function checkBalance(accountName) { ... }`
   - Uses the `async` keyword so that the function can wait for responses from the blockchain.
   - Creates a reusable `checkBalances` function that can check any account's balance

3. **Transaction** construction: `Pact.builder.execution(...)`
   - Creates a transaction request to call the `get-balance` function in the `coin` contract.
   - Sets required information for thetransaction request, in this case, the `accountName` and the `chainID` are required.

4. **Client** creation: `createClient(...)`
   - Creates a connection to a specific Kadena network, chain, and endpoint.
   - In this example, the client URL points to the `development` Kadena network.

5. **Request** a response: `client.local(transaction, ...)`
   - Sends the balance inquiry to the blockchain through the client connection.
   - In this example, the `local` property indicates that the request is a read operation with no changes to the blockchain.

## Example: Create an account

Now let's look at a slightly more complex example that creates a new on-chain account without transferring any funds to the account.
The account must be defined on a specific network and chain, but will have a default balance of 0.0.
You'll notice that this example has several similarities to the `check-balance.ts` program, but uses a well-known test account to create the new account and takes an account public key as input to create the account.

To create a program that creates a new account:

1. Create a new file called `create-kadena-account.ts` in your code editor.

2. Add the following code to the file and modify the network and chain, if necessary:

   ```typescript
   // Import basic functions to interact with the blockchain from the Kadena client library.
   import { Pact, createClient, createSignWithKeypair, isSignedTransaction } from '@kadena/client';
   
   // Create a client to connect to the Kadena network. In this example, the client connects to
   // chain 3 in the Kadena development network.
   const client = createClient('http://127.0.0.1:8080/chainweb/0.0/development/chain/3/pact');

   // To create a client to interact with the Kadena test (testnet06) network, replace the
   // client URL with one similar to the following:
   // https://api.testnet.chainweb.com//chainweb/0.0/testnet06/chain/3/pact

   // Return an error if the required argument is missing:
   if (!process.argv[2]) {
     console.error('Specify a public key or Kadena account name.');
     process.exit(1);
   }
   
   // Use a well-known test account to create a new account.
   const FUNDING_ACCOUNT = 'sender00';
   const FUNDING_ACCOUNT_PUBLIC_KEY = '368820f80c324bbc7c2b0610688a7da43e39f91d118732671cd9c7500ff43cca';
   const FUNDING_ACCOUNT_PRIVATE_KEY = '251a920c403ae8c8f65f59142316af3c82b631fba46ddea92ee8c95035bd2898';
   
   // Function to prepend "k:" if not already present
   const formatAccount = (account: string): string => {
     return account.startsWith('k:') ? account : `k:${account}`;
   };
   
   // Function to extract the key part (after "k:")
   const accountKey = (account: string): string => {
     const formatted = formatAccount(account);
     return formatted.split(':')[1];
   };
   
   main(FUNDING_ACCOUNT, FUNDING_ACCOUNT_PUBLIC_KEY, FUNDING_ACCOUNT_PRIVATE_KEY, process.argv[2]);
   
   async function main(sender: string, senderPublicKey: string, senderPrivateKey: string, inputAccount: string) {
     const account = formatAccount(inputAccount);
   
     // Construct a transaction that creates a new account.
     try {
       const transaction = Pact.builder
         .execution(Pact.modules.coin['create-account'](account, () => '(read-keyset "ks")'))
         .addData('ks', {
           keys: [accountKey(account)],
           pred: 'keys-all',
         })
         .addSigner(senderPublicKey, (withCap) => [withCap('coin.GAS')])
         // For this example, chain '3' on the 'development' network.
         .setMeta({ chainId: '3', senderAccount: sender })
         .setNetworkId('development')
         .createTransaction();
   
       // Sign this transaction with the well-known public key.
       const signWithKeypair = createSignWithKeypair({
         publicKey: senderPublicKey,
         secretKey: senderPrivateKey,
       });
   
       const signedTx = await signWithKeypair(transaction);
       if (isSignedTransaction(signedTx)) {
         console.log(`Creating account: ${account}`);
         const transactionDescriptor = await client.submit(signedTx);
         const response = await client.listen(transactionDescriptor);
         if (response.result.status === 'failure') {
           throw response.result.error;
         } else {
           console.log('Account created successfully:', response.result);
         }
       }
     } catch (error) {
       console.error('Error creating account:', error);
       process.exit(1);
     }
   }
   ```

3. Open a terminal shell and enter a command similar to folowing to execute the program:
   
   ```bash
   tsx create-kadena-account.ts 5e46e1b7d048e0f3f4766e292cd41daca2073e240f13b069b6fc10f9bde9a0b4
   ```
   
   If you've modified the network, chain, and entered a valid public key, you should see output similar to the following:

   ```bash
   Creating account: k:5e46e1b7d048e0f3f4766e292cd41daca2073e240f13b069b6fc10f9bde9a0b4
   Account created successfully: { status: 'success', data: 'Write succeeded' }
   ```

## Example: Transfer between accounts

The previous example demonstrated how to use the @kadena/client library to create a new account without transferring any funds to the account. 
However, for the new account to be used, it must have a balance that's greater than 0.0 on at least one chain in a network.
In this example, you'll create a transaction that transfers KDA coins from one account to another. 

Note that sending the transaction to the blockchain requires a public and private keypair, wallet, or another method signing the transaction.
However, you can build the transfer transaction using on-chain account information, then use the kadena tx sign and kadena tx send commands to send the transaction to the blockchain.

To create a program that transfers assets between accounts:

1. Create a new file called `build-transfer-tx.ts` in your code editor.

2. Add the following code to the file and modify the network and chain, if necessary:

   ```typescript
   // Import basic functions to interact with the blockchain from the Kadena client library.
   import { Pact, createClient, createSignWithKeypair, isSignedTransaction } from '@kadena/client';
   
   // This function shows how to build a transfer transaction
   function buildTransferTransaction() {
     console.log('Building a KDA transfer transaction...');
     
     // Account details (these are examples - use real accounts in practice)
     const senderAccount = 'k:58705e8699678bd15bbda2cf40fa236694895db614aafc82cf1c06c014ca963c';
     const receiverAccount = 'k:2084ce886c203b38944ebc16c4ac3714f379f81bcacae6e41be2dd4edc91971b';
     const transferAmount = { decimal: '10.5' }; // Amount to transfer
     const senderPublicKey = 'y58705e8699678bd15bbda2cf40fa236694895db614aafc82cf1c06c014ca963c'; // The sender's public key
   
     // Build the transaction
     const unsignedTransaction = Pact.builder
       .execution(
         // Call the transfer function from the coin contract
         Pact.modules.coin.transfer(
           senderAccount,    // From this account
           receiverAccount,  // To this account  
           transferAmount    // This amount of KDA
         )
       )
       .addSigner(senderPublicKey, (withCapability) => [
         // Grant permission to pay for gas (transaction fees)
         withCapability('coin.GAS'),
         // Grant permission to transfer the specified amount
         withCapability('coin.TRANSFER', senderAccount, receiverAccount, transferAmount),
       ])
       .setMeta({ 
         chainId: '3',                    // Chain to use for the transfer
         senderAccount: senderAccount     // Who pays the transaction fee
       })
       .setNetworkId('development')       // Use the development Kadena network
       .createTransaction();              // Build the final transaction
   
     console.log('Transaction built successfully!');
     console.log('Transaction details:', JSON.stringify(unsignedTransaction, null, 2));
     
     return unsignedTransaction;
   }
   
   // Run the function
   buildTransferTransaction();
   ```

3. Open a terminal shell and enter a command similar to folowing to execute the program:
   
   ```bash
   tsx build-transfer-tx.ts
   ```
   
   If you've provided valid accounts, network, and chain information, you should see an unsigned transaction with output similar to the following:

   ```bash
   Building a KDA transfer transaction...
   Transaction built successfully!
   Transaction details: {
     "cmd": "{\"payload\":{\"exec\":{\"code\":\"(coin.transfer \\\"k:58705e8699678bd15bbda2cf40fa236694895db614aafc82cf1c06c014ca963c\\\" \\\"k:2084ce886c203b38944ebc16c4ac3714f379f81bcacae6e41be2dd4edc91971b\\\" 10.5)\",\"data\":{}}},\"nonce\":\"kjs:nonce:1756323794526\",\"signers\":[{\"pubKey\":\"58705e8699678bd15bbda2cf40fa236694895db614aafc82cf1c06c014ca963c\",\"scheme\":\"ED25519\",\"clist\":[{\"name\":\"coin.GAS\",\"args\":[]},{\"name\":\"coin.TRANSFER\",\"args\":[\"k:58705e8699678bd15bbda2cf40fa236694895db614aafc82cf1c06c014ca963c\",\"k:2084ce886c203b38944ebc16c4ac3714f379f81bcacae6e41be2dd4edc91971b\",{\"decimal\":\"10.5\"}]}]}],\"meta\":{\"gasLimit\":2500,\"gasPrice\":1e-8,\"sender\":\"k:58705e8699678bd15bbda2cf40fa236694895db614aafc82cf1c06c014ca963c\",\"ttl\":900,\"creationTime\":1756323794,\"chainId\":\"3\"},\"networkId\":\"development\"}",
     "hash": "49TpjRoElzfX1xxHWF6wbqOot0x0jBlE1NJJUJtiv_E",
     "sigs": [
       null
     ]
   }
   ```

3. Copy and paste the unsigned transaction JSON object into a new unsignedTx.json file.

4. Sign the transaction by running the `kadena tx sign` command and following the prompts displayed.
   
   For example, if you are signing the transaction with a Chainweaver wallet, you can use the legacy command-line option, select your Chainweaver wallet, and provide the password for the Chainweaver wallet to sign the transaction.
   
   ```bash
   kadena tx sign --tx-unsigned-transaction-files=unsignedTx.json --legacy
   ```

5. Send the signed transaction to the blockchain by running the `kadena tx send` command and following the prompts displayed.
   
   ```bash
   kadena tx send 
   ? Select a transaction file: Transaction: transaction-49TpjRoElz-signed.json
   ⠋ Sending transactions...
   
   Transaction detail for command with hash: 49TpjRoElzfX1xxHWF6wbqOot0x0jBlE1NJJUJtiv_E
   Network ID  Chain ID
   development 3       
   
   
   ✔ Completed
   Transaction: 49TpjRoElzfX1xxHWF6wbqOot0x0jBlE1NJJUJtiv_E submitted with request key: 49TpjRoElzfX1xxHWF6wbqOot0x0jBlE1NJJUJtiv_E
   ```

6. Review the results in the block explorer by using the request key.
   
   ![Successful transfer between accounts](/img/kadena-client-transfer.jpg)

## Signatures and capabilities

In the previous example, you learned that crafting a transaction is only part of the story when you want to interact with the blockchain, and this is especially true if you want to change the blockchain state, as you do when you transfer value between any two accounts.
To execute transactions that change the blockchain state, you need to **sign** the transaction with cryptographic keys. 

By signing a transaction, you authorize the operation to be executed.
Your signature is ony valid if you are an owner of the account initiating the transaction and your keys ensure that no one can impersonate you or intercept and tamper with the transactions you authorize.

### Capabilities

Pact smart contracts provide an additional layer of access control—called capabilities—that enable you to authorize specific and concrete actions, like paying the transaction fee, or limiting a transfer to a specific amount.

You authorize these specific actions by adding the capabilities that you approve of to the signature used to sign the transaction where the capabilities are called.
You saw an example of this in the `build-transfer-tx` program where you added the `coin.GAS` and `coin.TRANSFER` capabilities to the `addSigners` property.

### Transactions and gas

If you're exploring other contracts on the Kadena test or production network, you'll notice that most smart contracts include the `coin.GAS` capability or a similar capability.

Every transaction that takes place on a blockchain consumes resources, including computer time, bandwidth, memory, and storage.
To compensate for the resources consumed and the services provided by network node operators, every transaction on the blockchain requires someone to pay the transaction fee, called gas. 
Gas helps to prevent the misuse of network resources by making transactions that overburden the system more expensive to process.

The `coin.GAS` capability allows smart contract users to explicitly approve the payment of transaction fees.
It's possible to sign transactions with an unrestricted signature.
However, if any capability is explicitly added to a signature, then all required capabilities must be included in the signature list.
If a capability is missing, the transaction fails.
