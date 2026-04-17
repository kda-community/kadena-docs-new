---
title: Construct transactions
description: "How to construct transactions using transaction templates and the Kadena CLI."
id: howto-construct-tx
---

# Construct transactions

There are several ways you can construct transaction requests that you want to submit to the Kadena blockchain.
For example, you can construct transaction by:

- Manually craft API requests.
- Running Kadena CLI commands.
- Calling functions in the Kadena client library.
- Interacting with frontend tools like Chainweaver.

The Kadena CLI provides one of the most versatile ways to construct transactions by enabling you to create and use **transaction templates**. 
With transaction templates, you can create transactions for common operations and customize the values used each time the transaction is submitted.
By providing values for template variables at runtime, you can generate transactions for multiple chains, accounts, or assets that are ready to sign and submit with minimal configuration requirements. 
You can provide template values interactively, specify them as command-line options, or pass them as input from a data file.

## Default templates

The Kadena CLI provides three default templates. 
The default templates—defined in the `transfer-create.ktpl`, `transfer.ktpl`, and `safe-transfer.ktpl` files—are stored in the `.kadena/transaction-templates` directory after you configure your local development environment using the `kadena config init` command. 
These templates cover the most common transaction types, allowing for straightforward transfers of tokens between accounts.

## Command options

The basic syntax for creating a transaction from a template is:

```bash
kadena tx add [options]
```

If you run the command without any options, you are prompted to select a template and enter the information required to create the transaction interactively. 
If you want to create a transaction without interactive prompted, you can specify command-line options similar to the following:

```bash
kadena tx add --template="transfer.kptl" --template-data="data.yaml" --network-id="testnet06" --out-file="transaction.json"
```

In this example:

- The `--template="transfer.kptl"` argument is required to identify the template you want to use to construct the transaction.
- The `--template-data="data.yaml"` argument specifies the file that contains the values to use for the template variables.
- The `--network-id="testnet06"` argument specifies the network the transaction is intended for.
- The `--out-file="transaction.json"` argument specifies the file name for the generated transaction that is saved in the current working directory.

For information about the command-line options you can use with the `kadena tx add` command, type:

```bash
kadena tx add --help
```

For additional information about using the `kadena tx add` command, see [kadena tx add](/reference/cli/cli-tx#kadena-tx-add).

## Template formats, prefixes, and variables

Transaction templates use the YAML API request format for execution (`exec`) and continuation (`cont`) transaction requests.
However, templates support the use of variables for input values that can be entered interactively or from a data file.
The following example illustrates the use of **prefixes** to identify the data types and values expected for fields in a `coin.transfer` transaciton using the `transfer.kptl` template:

```yaml
code: |-
  (coin.transfer "{{{account:from}}}" "{{{account:to}}}" {{decimal:amount}})
data:
meta:
  chainId: '{{chain-id}}'
  sender: '{{{account:from}}}'
  gasLimit: 2300
  gasPrice: 0.000001
  ttl: 600
signers:
  - public: '{{key:from}}'
    caps:
      - name: 'coin.TRANSFER'
        args: ['{{{account:from}}}', '{{{account:to}}}', {{decimal:amount}}]
      - name: 'coin.GAS'
        args: []
networkId: '{{network:networkId}}'
type: exec
```

The template uses the following prefixes to identify the expected data type and format for each field:

- The `account:` prefix is used for variables that should specify a valid Kadena account name.
- The `key:` prefix is used for variables that should specify a public key. 
- The `network:` prefix is used for variables that should specify the appropriate network identifier for the transaction.
- The `decimal:` prefix is used for variables that should specify a numerical values with a decimal point.

If you create transactions interactively, the prefixes are displayed to ensure you are prompted for the appropriate information for the transaction you are constructing. 
If you provide variable input on the command-line or in a file, the prefixes are ignored and you must provide the appropriate data types and formats to create valid transactions.

If you aren't sure of the variables that a template requires, you can list the variables defined for a template by using the `--holes` command-line option.
For example, you can list the template variables for the `transfer.ktpl` template like this:

```bash
kadena tx add --template="transfer.ktpl" --holes
```

This command returns the list of variables like this:

```bash
Template variables used in this template:
account:from: ''
account:to: ''
decimal:amount: ''
chain-id: ''
key:from: ''
network:networkId: ''
```

You can create a file with input values for the template variables in YAML format similar to the following:

```yaml
account:from: 'k:99d30af3fa91d78cc06cf53a0d4eb2d7fa2a5a72944cc5451311b455a67a3c1c'
account:to: 'k:58705e8699678bd15bbda2cf40fa236694895db614aafc82cf1c06c014ca963c'
decimal:amount: '1.0'
chain-id: '3'
key:from: '99d30af3fa91d78cc06cf53a0d4eb2d7fa2a5a72944cc5451311b455a67a3c1c'
network:networkId: 'development'
```

You can then construct a transaction that uses these input values with a command similar to the following:

```bash
kadena tx add --template="transfer.ktpl" --template-data="input-values.yaml" --out-file="transfer-tx-01.json"
```

This command creates an unsigned transaction in your working directory.
After you construct the transfer transaction, you can sign it with the following command:

```bash
kadena tx sign
```

After you sign the transfer transaction, you can send the signed transaction to the blockchain with the following command:

```bash
kadena tx sign
```