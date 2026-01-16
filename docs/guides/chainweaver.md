---
title: Develop with Chainweaver
id: chainweaver
sidebar_position: 4
description: "Install the Pact smart contract programming language and set up tooling for your development environment."
---

# Develop with Chainweaver

Chainweaver integrates the management of wallets, accounts, and keys with signing and editing features that you can use as you develop smart contracts using the Pact programming language. 
With Chainweaver, you can build, test, and iterate on your smart contracts before deploying them to your local development network, the Kadena test network, or the Kadena main network.

Chainweaver includes a built-in read-eval-print-loop (REPL) interactive interpreter that enables you to write and execute Pact code in the desktop or web-based application. 
You can also use Chainweaver to:

- Explore smart contract modules and functions.
- Define and manage authorization rules in keysets.
- Deploy smart contracts on a network.
- Update previously-deployed contracts.

If you don't already have a Chainweaver account, you should create one using either the [Chainweaver desktop application](https://github.com/kda-community/chainweaver/releases) or the [Chainweaver web application](https://chainweaver.kadena.network/). After you download and install the desktop application or open Chainweaver in a browser, you can create a wallet and accounts to interact with Kadena networks.

When you open and unlock Chainweaver, the navigation panel on the left is collapsed to only display icons by default. The navigation panel provides access to the tools for managing your accounts, keys, and development environment.

| Icon | Section | What you can do here |
| --- | --- | --- |
| ![](/./img/accounts-icon.png) | Accounts | View and manage your accounts, add account names to your watch list, transfer funds between accounts and across chains, and view transaction status. |
| ![](/./img/keys-icon.png) | Keys | Generate, view, and manage public keys associated with your secret key. |
| ![](/./img/sig-icon.png) | Signature Builder | Construct the signatures needed to sign transactions. |
| ![](/./img/contracts-icon.png) | Contracts | Access a code editor and development tools for writing, testing, and deploying Pact modules and smart contracts. |
| ![](/./img/resources-icon.png) | Resources | Explore documentation and Chainweaver resources. |
| ![](/./img/settings-icon.png) | Settings | Configure your network and account settings. |
| ![](/./img/logout-icon.png) | Log out | Log out of the current session. |

For more information about using Chainweaver as your primary interface for development tasks, see [Develop with Chainweaver](/guides/chainweaver).

## Connect to the development network

By default, Chainweaver lets you connect to the Kadena test network and the Kadena main network. However, as you start writing Pact modules, you'll want to test and deploy them on your local development network. Before you can do that, you need to configure Chainweaver to connect to the local host and port number running the development network.

To connect to the development network:

1.  Click **Settings** in the Chainweaver navigation panel.

2.  Click **Network**.

3.  In Edit Networks, type a network name, then click **Create**.

4.  Expand the new network, then add the localhost as a node for this network by typing `127.0.0.1:8080`.

    If the local computer is still running the development network Docker container, you should see the dot next to the node turn green.

5.  Click **Ok** to close the network settings.

## Navigate smart contracts

After you connect Chainweaver to the development network, you can use Chainweaver to deploy and manage the smart contracts you develop. You can access the Chainweaver development environment by clicking **Contracts** in the navigation panel.

After you click Contracts, Chainweaver displays common tasks and two working areas:

- The left side displays a sample contract in a code editor that you can use to view and edit contract code.
- The right side provides controls that enable you to navigate between contracts, view contract details, manage keys, and test operations for contracts you have deployed.

The common tasks enable you to:

- Browse to an open a file from the file system.
- Load your contract into the Pact interactive REPL where you can run Pact commands.
- Deploy the selected contract on the active blockchain network.

You'll use **Load into REPL** and **Deploy** frequently as you start writing Pact modules and deploy modules on the local development network.

## Code editor

Within the Contracts development environment, the code editor enables you to view and modify contract code using a familiar editing interface. It's similar to other code editors with support for copying and pasting text, syntax highlighting, and inline error reporting.

You can hover the cursor over lines that indicate errors to view information about the problem to help you determine how to fix it.

![Inline error](/./img/inline-error.png)

The Chainweaver code editor also supports **formal verification**. Formal verification is a process that enables you to automatically test the correctness of your code for potential errors and security vulnerabilities. With this process, you can mathematically prove that your contract has no security vulnerabilities, ensuring you can create secure code quickly and effectively.

For more information about how formal verification helps you develop safer smart contracts, see [Pact Formal Verification: Making Blockchain Smart Contracts Safer.](https://medium.com/kadena-io/pact-formal-verification-for-blockchain-smart-contracts-done-right-889058bd8c3f)

## Contract navigation and developer tools

The right side of the Contracts development environment provides many useful features and tools for developing smart contracts. For example, there are features to help you set up your environment, run commands in the interactive REPL, read messages, and explore other modules that exist on the network.

### Env

Select **Env** to view and fix errors or manage authorization data in keysets. If the error and warning detected can be fixed automatically, you'll see the Fix option.

![Environment errors](/./img/fix-error.png)

In this example, the error is a missing keyset and you can click **Fix** to automatically create the keyset and add it to the Data section.

![New admin-keyset](/./img/admin-keyset.png)

If you delete the keyset created for you, you can use the Data section to create a keyset by typing a keyset name, then clicking **Create**. By default, keysets require all of the keys associated with an account to sign transactions, so you'll see **keys-all** selected for the new keyset.
You can also create keysets manually using the JSON format by clicking **Raw**, then defining the keyset **name**, **keys**, and **pred** values. You can see the JSON format for keysets you have created by clicking **Result**.

![Keyset in JSON format](/./img/result.png)

The `pred` field specifies a `predicate` function to use for the keyset. The `predicate` function returns a boolean value evaluating to true or false. In this case, the predicate option evaluated is **keys-all** and it returns true if all of the keys listed in the keyset—in this example, only one key—sign the transaction.

### REPL

A great way to get started with Pact is by writing some simple code for yourself. The REPL enables you to run Pact commands directly in the browser. Select **REPL** to open the Pact interactive interpreter, then try running the following commands to start learning Pact syntax conventions.

**Numbers**

Pact uses **prefix notation** for math operators. With prefix notation, the operator precedes the values it’s operating on. For example, you can add two numbers with the following command:

```pact title=" "
(+ 2 2)
4
```

To subtract two numbers:

```pact title=" "
pact>(- 4 9)
-5
```

To multiply two numbers:

```pact
pact>(* 3 4)
12
```

**Strings**

You can concatenate strings using a plus (+) as a prefix. For example, you can concatenate the strings "Hello" and "REPL" with the following command:

```pact title=" "
pact > (+ "Hello" " REPL")
“Hello REPL”
```

**Lists**

You can specify lists using square brackets (`[ ]`) with or without commas. For example, you can specify the elements in a list without using commas:

```pact
pact> [1 2 3]
[1 2 3]
```

To specify the elements in a list using commas:

```pact
pact>["blue","yellow","green"]
["blue" "yellow" "green"]
```

**Objects**

You can create objects using curly braces (`{ }`) with key-value pairs separated by a colon (`:`). For example:

```pact
pact> { "foo": (+ 1 2), "bar": "baz" }
{ "foo": 3, "bar": "baz" }
```

You can view more commands to try in [Syntax and keywords](/reference/syntax) and [Pact functions](/pact-5/func-quick-ref).

**Run commands in the code editor**

You can also run commands in the **code editor**. To run commands in the code editor, delete existing code from the code editor type a command, then click **Load into REPL**.

### Messages

Code editors often provide messages to help you identify errors and log outputs. These messages are useful for debugging programs and fixing potential issues with your contract. Select **Messages** to view messages from the code editor in Chainweaver.

### Module Explorer

Select **Module Explorer** to open and view sample smart contracts, search for and view deployed contracts, and call functions from any contract that exists on the active network.

![Module explorer](/./img/module-explorer.png)

Under **Examples**, you can click **Open** next to an example contract name to load the contract into the code editor. You can modify the code in the editor and reload the original contract code at any time, if needed. Click **View** to explore the Pact modules in a contract.

For example, if you select the **Simple Payment** contract, then click **View** for the **payments** modules, you'll see the functions and capabilities defined in the **payments** module.

![Simple payment functions and capabilities](/./img/example-functions.png)

Under **Deployed Contracts**, you san search for any contract that has been deployed to the network using the Module Explorer by name, by chain, or by navigating the pages using the arrow buttons.

After you select a deployed contract, you can click **View** to see details about what's defined in the contract, including implemented interfaces, functions, capabilities, and pact included in the contract. You can click **Open** to see the full contract code in the code editor.

You can also call individual functions from within the Module Explorer. You'll learn more about navigating modules and calling functions in [coding projects](/coding-projects/coding-projects).
