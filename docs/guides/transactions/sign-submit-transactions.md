---
title: Sign and submit transactions
description: "A guide to crafting blockchain calls using Traditional API, Kadena CLI, and Kadena.js"
id: howto-sign-submit-tx
---
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
import CodeBlock from '@theme/CodeBlock';

# Sign and submit transactions

There are several ways you can sign and submit transactions.
This guide provides instructions and examples for signing and submitting transactions using different tools and in different scenarios.
For example, this guide describes how to use the Pact command-line interpreter HTTP server and REST API to sign and submit transactions locally using Pact commands and how to format transactions requests so that they can be executed using `curl` commands or Postman API calls.

## Use the Pact built-in server

To use the built-in Pact server:

1. Open a terminal shell on your local computer.

2. Create a configuration file using YAML format with the following properties:
   
   ```bash
   port       - HTTP server port number.
   persistDir - Directory for persisting database files. If you omit this setting, the server runs in-memory only.
   logDir     - Directory for HTTP logs.
   pragmas    - SQLite pragma statement to use with persistent database files.
   entity     - Entity name for simulating privacy. The default is "entity".
   gasLimit   - Gas limit for each transaction. The default is zero (0).
   gasRate    - Gas price per action. The default is zero (0).
   flags      - Pact runtime execution flags.
   ```

   For example, create a `pact-config.yaml` file with properties similar to the following:

   ```yaml
   # Configuration file for the Pact HTTP server. 
   
   # HTTP server port
   port: 8081
   
   # Directory for HTTP log files
   logDir: log
   
   # Directory for persistence log files
   persistDir: log
   
   # SQLite pragmas for pact back-end
   pragmas: []
   
   # Provide verbose log output
   verbose: True
   ```

2. Start the built-in server by using the `--serve` command-line option and your configuration file with a command similar to the following:
   
   ```bash
   pact --serve pact-config.yaml
   ```

1. Create an API request for the server in a YAML file.

   For example, use a text editor to create a YAML file called `my-api-request.yaml` with the following content:
   
   ```yaml
   code: "(+ 1 2)"
   data:
     name: Stuart
     language: Pact
   keyPairs:
     - public: ba54b224d1924dd98403f5c751abdd10de6cd81b0121800bf7bdbdcfaec7388d
       secret: 8693e641ae2bbe9ea802c736f42027b03f86afe63cae315e7169c9c496c17332
   ```

2. Format the YAML version of the API request using the Pact `--apireq` command-line option to generate a valid JSON API request that you can send to any Chainweb node.
   
   For example, you can run the following command to display formatted output that's suitable for the CHainweb node `/send` endpoint:

   ```bash
   pact --apireq  my-api-request.yaml
   ```

   This command displays the formatted JSON API request as standard output:
   
   ```bash
   {"cmds":[{"hash":"T3vt3Cuh2sdDcTS8Exck96Yht55OD0B9qp_2O8hn1Z0","sigs":[{"sig":"6f8a7fd50d2807127feefe7c9df382c6538b20aa8d62c9c10051f80201af7352f172a18be5f6a43ec2ece7fc74f951e1dd36ef18975fcb76d72bcb453396dc02"}],"cmd":"{\"networkId\":null,\"payload\":{\"exec\":{\"data\":{\"name\":\"Stuart\",\"language\":\"Pact\"},\"code\":\"(+ 1 2)\"}},\"signers\":[{\"pubKey\":\"ba54b224d1924dd98403f5c751abdd10de6cd81b0121800bf7bdbdcfaec7388d\"}],\"meta\":{\"creationTime\":0,\"ttl\":0,\"gasLimit\":0,\"chainId\":\"\",\"gasPrice\":0,\"sender\":\"\"},\"nonce\":\"2024-09-06 20:04:12.679143 UTC\"}"}]}
   ```

   To format a request for the built-in server and `/local` endpoint, you can add the `--local` command-line option.
   For example:
   
   ```bash
   pact --apireq  my-api-request.yaml --local
   ```
   
   To write the formatted JSON API request to a file instead of displaying it as standard output, redirect the output with a command similar to the following:

   ```bash
   pact --apireq my-api-request.yaml --local > local-request.json
   ```

3. Send the formatted API request to the Pact built-in HTTP server running on port 8081—as configured in the `pact-config.yaml` file for this example—by running the following command:
   
   ```bash
   pact --apireq my-api-request.yaml --local | curl --json @- http://localhost:8081/api/v1/local
   ```
   
   This command returns the transaction result with output similar to the following:

   ```bash
   {"gas":0,"result":{"status":"success","data":3},"reqKey":"q4HW4wP1FCj3RQRvhILQHaqU8tmMqHPp-nDJdw6CwK8","logs":"wsATyGqckuIvlm89hhd2j4t6RMkCrcwJe_oeCYr7Th8","metaData":null,"continuation":null,"txId":null}
   ```

   Although the `pact` command-line interpreter includes commands for generating keys, preparing unsigned transactions, and signing transactions from the command line, it's generally more straightforward to construct YAML request files and sign transactions with other tools, such as Chainweaver or the `kadena-cli` package. 

## Use a curl command directly

You can also use `curl` commands to submit transactions to Kadena development, testnet, and mainnet nodes.

To sign and submit a transaction:

1. Generate a random public and secret key pair and save them to a file.
   
   ```bash
   pact --genkey > pistolas.yaml
   ```

   For this example, the following keys are used:

   ```yaml
   public: 3bdb1d3c48a1bb5f072b067e265ce5d9a5eabf5e290128be4d2623dd559ca698
   secret: 682ce35a77eece5060537632423de96b965136bd7739c5064903612c0b300608
   ```

2. Construct the transaction using the YAML transaction request format.
   For example:
   
   ```yaml
   code: |-
     (free.vote-topics.vote "A")
   data:
     ks: {
      keys: ["3bdb1d3c48a1bb5f072b067e265ce5d9a5eabf5e290128be4d2623dd559ca698"],
      pred: "keys-all"
     }
   publicMeta:
     chainId: "3"
     sender: "pact-generated-key"
     gasLimit: 63000
     gasPrice: 0.00000001
     ttl: 900
   keyPairs:
     - public: 3bdb1d3c48a1bb5f072b067e265ce5d9a5eabf5e290128be4d2623dd559ca698
       secret: 682ce35a77eece5060537632423de96b965136bd7739c5064903612c0b300608
       caps:
         - name: "coin.GAS"
           args: []
   networkId: "development"
   type: exec
   ```

   You can also construct YAML transaction requests that only include the public key by replacing the `keyPairs` attribute with a `signers` attribute:

   ```yaml
   signers:
     - public: 3bdb1d3c48a1bb5f072b067e265ce5d9a5eabf5e290128be4d2623dd559ca698
       caps:
         - name: "coin.GAS"
           args: []
   ```

3. Convert the YAML transaction request to a valid transaction JSON object.
   
   ```bash
   pact --apireq vote-function.yaml > tx-vote-function.json
   ```

   To format an unsigned YAML transaction request that only includes the `signers` attribute and public keys, you can use the `--unsigned` command-line option.
   For example, you can run a command similar to the following:
   
   ```bash
   pact --unsigned alt-vote-function.yaml > unsigned-vote-function.yaml
   ```

   To add a signature to the unsigned transaction, you can run a command similar to the following:

   ```bash
   cat unsigned-vote-function.yaml | pact add-sig pistolas.yaml > tx-signed-pistolas.json
   ```  

1. Use `curl` to connect to the `/send` endpoint on the `development`, `testnet06` or `mainnet01` network.

   For example, the following command connects to the `/send` endpoint on the local `development` network:

   ```bash
   curl -X POST -H "Content-Type: application/json" -d "@tx-vote-function.json" http://localhost:8080/chainweb/0.0/development/chain/3/pact/api/v1/send
   ```

   If the request is properly formatted and you can connect to the endpoint, the command returns the request key for the transaction.
   For example:

   ```bash
   {"requestKeys":["nnRG5jRdEprpr_er9p1bSEWuLxOfDKekaqLfs7vGLiU"]}
   ```

## Use kadena tx commands

The `kadena-cli` package enables you to construct, sign, and submit transactions using transaction templates.

1. Construct the transaction interactively using one of the default YAML request templates or create a custom YAML file.
2. Convert the YAML request template to a valid transaction JSON object by using `kadena tx add`.
3. Sign the transaction created by using `kadena tx sign`.
4. Send the request to the blockchain by using `kadena tx send`.

## Offline signing with a cold wallet

Some cold wallet signing procedures use QR codes to get transaction data on and off the cold wallet machine. 
Because QR codes can only transmit a limited amount of information, cold wallet signing commands are typically designed to work with a more
compact data format than produced when the full command is used to generate signatures.

For example, the YAML execution request file for a safe transfer might look like this:

```yaml
code: |-
  (coin.transfer-create "alice" "bob" (read-keyset "ks") 100.1)
  (coin.transfer "bob" "alice" 0.1)
data:
  ks:
    keys: [368820f80c324bbc7c2b0610688a7da43e39f91d118732671cd9c7500ff43cca]
    pred: "keys-all"
publicMeta:
  chainId: "0"
  sender: alice
  gasLimit: 1200
  gasPrice: 0.0000000001
  ttl: 7200
networkId: "mainnet01"
sigs:
  - public: 6be2f485a7af75fedb4b7f153a903f7e6000ca4aa501179c91a2450b777bd2a7
    caps:
      - name: "coin.TRANSFER"
        args: ["alice", "bob", 100.1]
      - name: "coin.GAS"
        args: []
  - public: 368820f80c324bbc7c2b0610688a7da43e39f91d118732671cd9c7500ff43cca
    caps:
      - name: "coin.TRANSFER"
        args: ["bob", "alice", 0.1]
type: exec
```

When this YAML request is converted to an unsigned transaction, the result looks similar to the following:

```json
hash: KY6RFunty4WazQiCsKsYD-ovu-_XQByfY6scTxi9gQQ
sigs:
  368820f80c324bbc7c2b0610688a7da43e39f91d118732671cd9c7500ff43cca: null
  6be2f485a7af75fedb4b7f153a903f7e6000ca4aa501179c91a2450b777bd2a7: null
cmd: '{"networkId":"mainnet01","payload":{"exec":{"data":{"ks":{"pred":"keys-all","keys":["368820f80c324bbc7c2b0610688a7da43e39f91d118732671cd9c7500ff43cca"]}},"code":"(coin.transfer-create \"alice\" \"bob\" (read-keyset \"ks\") 100.1)\n(coin.transfer \"bob\" \"alice\" 0.1)"}},"signers":[{"pubKey":"6be2f485a7af75fedb4b7f153a903f7e6000ca4aa501179c91a2450b777bd2a7","clist":[{"args":["alice","bob",100.1],"name":"coin.TRANSFER"},{"args":[],"name":"coin.GAS"}]},{"pubKey":"368820f80c324bbc7c2b0610688a7da43e39f91d118732671cd9c7500ff43cca","clist":[{"args":["bob","alice",0.1],"name":"coin.TRANSFER"}]}],"meta":{"creationTime":1580316382,"ttl":7200,"gasLimit":1200,"chainId":"0","gasPrice":1.0e-5,"sender":"alice"},"nonce":"2020-01-29 16:46:22.916695 UTC"}'
```

To get a condensed version for signing on a cold wallet, you can remove the `cmd` field manually or using a script similar to the following:

```bash
cat tx-unsigned.yaml | grep -v "^cmd:"
```

The result would look like this:

```
hash: KY6RFunty4WazQiCsKsYD-ovu-_XQByfY6scTxi9gQQ
sigs:
  368820f80c324bbc7c2b0610688a7da43e39f91d118732671cd9c7500ff43cca: null
  6be2f485a7af75fedb4b7f153a903f7e6000ca4aa501179c91a2450b777bd2a7: null
```

Keep in mind that when you sign using the condensed version, you won't be able to submit the output directly to the blockchain. 
You'll have to restore the full command to submit the transaction to the blockchain.

