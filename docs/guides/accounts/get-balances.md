---
title: Check account balances
description: "How to check account balances for existing account using an API call to the coin contract get-balance function, Kadena command-line interface, and Kadena client library functions."
id: howto-get-balances
---
import Link from '@docusaurus/Link';
import CodeBlock from '@theme/CodeBlock';

# Check account balances

This guide provides instructions and examples for checking an account balance using an API call, Kadena CLI commands, and the Kadena client TypeScript library.
These examples illustrate how you can construct calls to the blockchain to get an account balance—an important operation if you're building a wallet, exchange, game, or other application where you need to retrieve and display account information.
If you're using Chainweaver or another wallet or frontend application, this information is typically available directly through the user interface, with the application performing an operation similar to these examples behind the scenes.

## Using a YAML request and curl

One way yu can get an account balance is by calling the `get-balance` function that's defined in the `coin` contract deployed on the Kadena public main or test network.
To make this call, you need to know the following information:

-  The account name for the account you want to look up.
-  The network identifier where you want to check the account balance.
-  The specific chain identifier for the balance you want to check.

For this example, you can create the request using the YAML execution file format, convert the request to JSON, then submit the API request using a `curl` command.

You could also submit the request using Postman or other tools than enable you to call API endpoints.

To get an account balance:

1. Open a terminal on your local computer.

2. Check that you have `curl` installed by running the following command:
   
   ```bash
   which curl
   ```

   You should see the path to the file similar to the following:
   
   ```bash
   /usr/bin/curl
   ```
   
3. Create a YAML execution request in a `get-balance.yaml` file with content similar to the following:
   
   ```yaml
   code: (coin.get-balance "k:4fe7981d36997c2a327d0d3ce961d3ae0b2d38185ac5e5cd98ad90140bc284d0")
   data: {}
   sigs:
     - public: "4fe7981d36997c2a327d0d3ce961d3ae0b2d38185ac5e5cd98ad90140bc284d0"
       caps: []

   networkId: testnet06
   publicMeta:
       chainId: "1"
       sender: "k:4fe7981d36997c2a327d0d3ce961d3ae0b2d38185ac5e5cd98ad90140bc284d0"
       gasLimit: 100000,
       gasPrice: 0.0000001,
       ttl: 7200,
   type: exec
   ```

   As you can see in this example:
   
   - The transaction request calls the `coin.get-balance` function.
   - The account name is `k:4fe7981d36997c2a327d0d3ce961d3ae0b2d38185ac5e5cd98ad90140bc284d0`.
   - The network identifier is `testnet06`.
   - The chain identifier for the account balance is chain `1`.
   
   The `gasLimit`, `gasPrice`, and `ttl` values represent reasonable settings.

4. Convert the YAML execution request to a JSON object with proper formatting using the `pact --apireq` command with a command similar to the following:
   
   ```bash
   pact --apireq get-balance.yaml --local
   ```
   
   This command displays the resulting JSON as standard output.
   For example:
   
   ```bash
   {"hash":"8bZdo6EG-WVl5CqQLcsAkYOchf_dujjdqsrsNYRQDXw","sigs":[],"cmd":"{\"networkId\":\"testnet06\",\"payload\":{\"exec\":{\"data\":{},\"code\":\"(coin.get-balance \\\"k:4fe7981d36997c2a327d0d3ce961d3ae0b2d38185ac5e5cd98ad90140bc284d0\\\")\"}},\"signers\":[],\"meta\":{\"creationTime\":1726864470,\"ttl\":7800,\"gasLimit\":100000,\"chainId\":\"1\",\"gasPrice\":1.0e-7,\"sender\":\"k:4fe7981d36997c2a327d0d3ce961d3ae0b2d38185ac5e5cd98ad90140bc284d0\"},\"nonce\":\"2024-09-20 20:34:30.276972 UTC\"}"}
   ```

   Alternatively, you can save the result from the `pact --apireq` command in a file with a command similar to the following:

      ```bash
   pact --apireq get-balance.yaml --local > get-balance.json
   ```

   Copy the output from the `pact --apireq` command to pass as the request body in the next step.

5. Connect to the Pact `/local` endpoint for the appropriate network with a command similar to the following:

   ```bash
   curl -X POST "https://api.testnet.chainweb.com/chainweb/0.0/testnet06/chain/1/pact/api/v1/local" \
     -H "Content-Type: application/json" \
     -d '{"hash":"8bZdo6EG-WVl5CqQLcsAkYOchf_dujjdqsrsNYRQDXw","sigs":[],"cmd":"{\"networkId\":\"testnet06\",\"payload\":{\"exec\":{\"data\":{},\"code\":\"(coin.get-balance \\\"k:4fe7981d36997c2a327d0d3ce961d3ae0b2d38185ac5e5cd98ad90140bc284d0\\\")\"}},\"signers\":[],\"meta\":{\"creationTime\":1726864470,\"ttl\":7800,\"gasLimit\":100000,\"chainId\":\"1\",\"gasPrice\":1.0e-7,\"sender\":\"k:4fe7981d36997c2a327d0d3ce961d3ae0b2d38185ac5e5cd98ad90140bc284d0\"},\"nonce\":\"2024-09-20 20:34:30.276972 UTC\"}"}'
    ```

    The command returns output similar to the following:

    ```json
    {
      "gas":20,
      "result":{
        "status":"success",
        "data":20
        },
      "reqKey":"8bZdo6EG-WVl5CqQLcsAkYOchf_dujjdqsrsNYRQDXw","logs":"wsATyGqckuIvlm89hhd2j4t6RMkCrcwJe_oeCYr7Th8",
      "metaData":{
        "publicMeta":{
          "creationTime":1726864470,
          "ttl":7800,
          "gasLimit":100000,
          "chainId":"1",
          "gasPrice":1.0e-7,"sender":"k:4fe7981d36997c2a327d0d3ce961d3ae0b2d38185ac5e5cd98ad90140bc284d0"},
      "blockTime":1726864883870724,"prevBlockHash":"mBRDF6NQwF_bvo4vHaF-5aS384lCYx1UB2Nj1pBfaeM",
      "blockHeight":4662494},
      "continuation":null,
      "txId":null
    }
    ```

    In this example, the account `k:4fe7981d36997c2a327d0d3ce961d3ae0b2d38185ac5e5cd98ad90140bc284d0` has a balance of `20` coins on chain `1` of the Kadena `testnet06` network.

## Using kadena-cli commands

If you have installed the `kadena-cli` package in your development environment, you can use the `kadena account details` command to look up account balances on the development, test, or main network.

To get an account balance using `kadena-cli`:

1. Open a terminal on your local computer.

2. Check that you have `kadena` installed by running the following command:
   
   ```bash
    which kadena
   ```

   You should see the path to the file similar to the following:
   
   ```bash
   /usr/local/bin/kadena
   ```

   If you want to check the account balance for an account you added using the `kadena account add` command, you can use the `kadena account list` to review all of the accounts available in your development environment.
   For this example, running `kadena account list --account-alias="all"` returns the following results:
   
   ```bash
   Account Alias: pistolas-local                                                  
   Account Name k:fe4b6da332193cce4d3bd1ebdc716a0e4c3954f265c5fddd6574518827f608b7
   Fungible     coin                                                              
   Predicate    keys-all                                                          
   Public Keys  fe4b6da332193cce4d3bd1ebdc716a0e4c3954f265c5fddd6574518827f608b7  
   filepath     /Users/lisagunn/.kadena/accounts/pistolas-local.yaml              
                                                                               
   Account Alias: pistolas-testnet                                                
   Account Name k:bbccc99ec9eeed17d60159fbb88b09e30ec5e63226c34544e64e750ba424d35e
   Fungible     coin                                                              
   Predicate    keys-all                                                          
   Public Keys  bbccc99ec9eeed17d60159fbb88b09e30ec5e63226c34544e64e750ba424d35e  
   filepath     /Users/lisagunn/.kadena/accounts/pistolas-testnet.yaml 
   ```

   If you know the account name, network, and chain where you want to check the account balance, you can go directly to the next step.
   
3. Check the account balance with interactive prompting by running the following command:
   
   ```bash
   kadena account details
   ```
   
   Select an **account name**:

   ```bash
   ? Select an account (alias - account name): (Use arrow keys)
   ❯ Enter an account name manually:
     pistolas-local   - k:fe4b6d....27f608b7
     pistolas-testnet - k:bbccc9....a424d35e
   ```
   
   Select the **network**:

   ```bash
   ? Select a network: (Use arrow keys)
   ❯ devnet
     mainnet
     testnet
   ```
   
   Enter one or more **chain identifiers**:
   
   ```bash
   ? Enter a ChainId (0-19) (comma or hyphen separated e.g 0,1,2 or 1-5 or all):
   ```
   
   After you provide the information required, the command returns account details including the account balance for each chain identifier you specified.
   For example:

   ```bash
   Details of account "pistolas-testnet" on network "testnet06"
   Name                             ChainID Public Keys                                                      Predicate Balance
   k:bbccc99ec9ee....4e750ba424d35e 1       bbccc99ec9eeed17d60159fbb88b09e30ec5e63226c34544e64e750ba424d35e keys-all  303.97768665622
   k:bbccc99ec9ee....4e750ba424d35e 3       bbccc99ec9eeed17d60159fbb88b09e30ec5e63226c34544e64e750ba424d35e keys-all  10             
   Success with Warnings:
   
   Account "k:bbccc99ec9eeed17d60159fbb88b09e30ec5e63226c34544e64e750ba424d35e" is not available on
   following chain(s): 2 on network "testnet06"
   ```
   
   The command output also includes the command executed.
   For example:

   ```   
   Executed:
   kadena account details --account="pistolas-testnet" --network="testnet" --chain-ids="1-3" 
   ```

   If you want to check an account balance without interactive prompting, you can specify all of the required arguments in a single command.
   For example:

   ```bash
   kadena account details --account="pistolas-local" --network="devnet" --chain-ids="3" 
   ```
   
   In this case, there are no warnings, so the command simply returns the account details:

   ```bash
   Details of account "pistolas-local" on network "development"
   Name                             ChainID Public Keys                                                      Predicate Balance
   k:fe4b6da33219....74518827f608b7 3       fe4b6da332193cce4d3bd1ebdc716a0e4c3954f265c5fddd6574518827f608b7 keys-all  14     
   ```

## Using a transaction template

You can also create a transaction template for checking account balances.
Transaction templates are similar to YAML execution requests like the one in [Using a YAML request and curl](#using-a-yaml-request-and-curl).
However, transaction templates allow you to use variables for input values that can be set when adding and executing transactions using Kadena CLI commands.

To get an account balance using `kadena-cli` and a transaction template:

1. Open a terminal on your local computer.

2. Check that you have `kadena` installed by running the following command:
   
   ```bash
    which kadena
   ```

   You should see the path to the file similar to the following:
   
   ```bash
   /usr/local/bin/kadena
   ```

3. Create a YAML API request file to use as a transaction template with the variables required to call the `coin.get-balance` function:
   
   ```yaml
   code: |-
     (coin.get-balance "{{{account}}}")
   meta:
     chainId: '{{chain-id}}'
     sender: '{{{tx-sender}}}'
     gasLimit: 600
     gasPrice: 0.000001
     ttl: 600
   networkId: '{{network:networkId}}'
   signers:
     - public: "{{signer-key}}"
       caps: []
   type: exec 
   ```

   You can learn more about transaction templates, variables, and inputting values in Construct transactions. 
   For more information about using YAML request files for transactions, see Formatting API requests in YAML.

4. Save the file with the `.ktpl` file extension in the `.kadena/transaction-templates` folder.

   For example, save the file as `.kadena/transaction-templates/get-balance.ktpl` in your working directory.

5. Add a transaction that uses the template by running the following command:
   
   ```bash
   kadena tx add
   ```

6. Select the `get-balance.ktpl` template, then follow the prompts to enter the appropriate values for template variable.
   
   For this example, the prompts and values look like this:
   
   ```bash
   ? File path of data to use for template .json or .yaml (optional):
   ? Template value account: k:fe4b6da332193cce4d3bd1ebdc716a0e4c3954f265c5fddd6574518827f608b7
   ? Template value chain-id: 3
   ? Template value tx-sender: k:fe4b6da332193cce4d3bd1ebdc716a0e4c3954f265c5fddd6574518827f608b7
   ? Select network id for template value networkId: devnet
   ? Template value signer-key: fe4b6da332193cce4d3bd1ebdc716a0e4c3954f265c5fddd6574518827f608b7
   ? Where do you want to save the output: pistolas-balance
   ```
   
   The values you enter for the command are saved in a JSON file.
    
1. Sign the transaction by running the following command and following the prompts displayed to select the transaction:
   
   ```bash
   kadena tx sign
   ```
   
   You must select a wallet or key pair to sign the transaction and the transaction file that you want to sign.
   After you enter the information required, the command output confirms the signature with information similar to the following:

   ```bash
   Command 1 (hash: ZBu4fPOtxhGCZUxT9clO8UqtjWXzrCNCC_XNTGL6Kzw) will now be signed with the following signers:
   Public Key                                                       Capabilities
   fe4b6da332193cce4d3bd1ebdc716a0e4c3954f265c5fddd6574518827f608b7             
   Transaction executed code: 
   "(coin.get-balance \"k:fe4b6da332193cce4d3bd1ebdc716a0e4c3954f265c5fddd6574518827f608b7\")"
   
   Transaction with hash: ZBu4fPOtxhGCZUxT9clO8UqtjWXzrCNCC_XNTGL6Kzw was successfully signed.
   Signed transaction saved to /Users/lisagunn/.kadena/transaction-templates/transaction-ZBu4fPOtxh-signed.json
   
   Executed:
   kadena tx sign --tx-sign-with="wallet" --tx-unsigned-transaction-files="pistolas-balance.json" --wallet-name="pistolas-dev" 
   ```
   
   After signing the transaction, you can retrieve the account information without submitting the transaction or send the request to the blockchain for on-chain processing.

1. Get the account balance by running the following command:
   
   ```bash
   --tx-signed-transaction-files transaction-ZBu4fPOtxh-signed.json
   ```
   
   In this example, the balance for account on the development network, chain 3—returned in the `data` field—is 14.

   ```bash
   txSignedTransaction test result:                                              
   --------------------------------------------------------------------------------
     Transaction info:
        fileName: transaction-ZBu4fPOtxh-signed.json
        transactionHash: ZBu4fPOtxhGCZUxT9clO8UqtjWXzrCNCC_XNTGL6Kzw
   
   
     Response:
       Response:
          gas: 21
          result:
            status: success
            data: 14
          reqKey: ZBu4fPOtxhGCZUxT9clO8UqtjWXzrCNCC_XNTGL6Kzw
          logs: wsATyGqckuIvlm89hhd2j4t6RMkCrcwJe_oeCYr7Th8
          metaData:
            publicMeta:
              creationTime: 1728076660
              ttl: 600
              gasLimit: 600
              chainId: 3
              gasPrice: 0.000001
              sender: k:fe4b6da332193cce4d3bd1ebdc716a0e4c3954f265c5fddd6574518827f608b7
            blockTime: 1728077254903367
            prevBlockHash: MaSZcnXDBQGpnF4ZDCtuEtc1TOQRS27RWLqPf2uwmGw
            blockHeight: 938
          continuation: null
          txId: null
   
   
     Details:
        chainId: 3
        network: devnet
        networkId: development
        networkHost: http://localhost:8080
        networkExplorerUrl: http://localhost:8080/explorer/development/tx/
   
   
     Transaction Command:
        cmd: {"payload":{"exec":{"code":"(coin.get-balance \"k:fe4b6da332193cce4d3bd1ebdc716a0e4c3954f265c5fddd6574518827f608b7\")","data":{}}},"nonce":"","networkId":"development","meta":{"sender":"k:fe4b6da332193cce4d3bd1ebdc716a0e4c3954f265c5fddd6574518827f608b7","chainId":"3","creationTime":1728076660,"gasLimit":600,"gasPrice":0.000001,"ttl":600},"signers":[{"pubKey":"fe4b6da332193cce4d3bd1ebdc716a0e4c3954f265c5fddd6574518827f608b7","clist":[]}]}
        hash: ZBu4fPOtxhGCZUxT9clO8UqtjWXzrCNCC_XNTGL6Kzw
        sigs:
         [0]:
            sig: d13558e1d10ed5aa977232d5311eeafd04ec51d66e2b6515bda93000932f1f26b71ee8c5a4634996b2a434df45c64f7ba0808e42ec3f5df06d001304b7e7fc03
   --------------------------------------------------------------------------------
   
   Executed:
   kadena tx test --tx-signed-transaction-files="transaction-ZBu4fPOtxh-signed.json" --tx-transaction-network="devnet" 
   ```

## Using the Kadena client library

If you're familiar with JavaScript or TypeScript, you can use the `@kadena/client` library to write scripts for common tasks. 
The `@kadena/client` library implements a TypeScript-based API for interacting with smart contracts and Chainweb nodes. 
The library provides functions that simplify building transactions with Pact commands and connecting to blockchain nodes.

You should note that creating the client connection is separate from using the `Pact.builder` function to construct transactions.


To get an account balance using `@kadena/client` functions:

1. Open a terminal on your local computer.

2. Create a new file in your code editor and add code to call the `getBalance` function and create the client:
   
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

