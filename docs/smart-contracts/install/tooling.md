---
title: Developer tooling
id: tooling
sidebar_position: 4
description: "Install additional tooling for Pact and for smart contract development."
---

import CodeBlock from '@theme/CodeBlock';

# Developer tooling

Although Pact provides the foundations for developing smart contracts for the Kadena network, there are several other tools and extensions you might want to install and configure to complement Pact and provide a more complete development environment. 
The additional tools you might want to install locally include the following:

- Pact language server
- Pact version manager
- Pact extension for Visual Studio Code
- Kadena command-line interface
- Chainweaver wallet and integrated development environment
  
There are also developer tools that are available as web-based applications that you can access through the development lifecycle.
Web-based developer tools include the following:

- Faucet
- Module explorer
- Block explorer

## Pact language server

You can install the [Pact language server](https://github.com/kda-community/pact-lsp/releases) on your local computer to support syntax highlighting and other features in the code editor.

## Pact version manager

The Pact version manager (pactup) is a community-contributed program that enables you to install and manage multiple versions of the Pact programming language and command-line interpreter.

For more information about installing and using the `pactup` version manager, see [Pact version manager](https://github.com/kadena-community/pactup).

## Pact extension for Visual Studio Code

If you use Visual Studio Code as your integrated development environment (IDE), you can install the Pact extension to streamline your smart contract development experience. Before installing the extension, verify that you have Pact and the Pact Language Server installed.

To install the Pact extension:

1. Open Visual Studio Code.
2. Select **View**, then click **Extensions**.
3. Type **pact** in the Search field.
4. Select **PactLang**, then click **Install**. If you're prompted to install additional extensions, you should install them to enable the full functionality of the Pact extension.

To configure the Pact extension settings:

1. Select **Code**, **Settings**, then click **Settings** and search for **pact**.

2. Select **Pact configuration** and configure the settings appropriate for your development environment.
3. Select **Enable coverage** to enable code coverage reporting for `.pact` and `.repl` files.

   With this option enabled, code coverage is calculated for the `.repl` file and all of the `.pact` and `.repl` files that it loads every time you save a `.repl` file.

   Covered lines are highlighted in green in your editor and uncovered lines are highlighted in red. To view a code coverage report in HTML format, right-click the `./coverage/html/index.html` file relative to the file that was run. Click **Show preview** to open the report.

   To run code coverage for all your `.repl` files at once, create an entry point `.repl` file that loads all the other `.repl` files in your project. You can then open the entry point file and save it to run all of your tests.

4. Select **Enable Lsp** to enable the Pact Language server.

   With this option enabled, syntax errors are be highlighted in `.pact` files and problems are reported in the Visual Studio Code status bar and bottom panel.

5. Select **Enable trace** to enable the output trace for Pact.

   With this option enabled, the `pact` command runs with the `--trace` option every time you save a file. The `--trace` option provides detailed line by line information about `.pact` and `.repl` file execution.

6. Set the path to the Pact executable and the Pact Language server executable.

   If you added the executables to your `PATH`, you can use `pact` and `pact-lsp` for these settings.

   ![Configure Pact settings](/./img/vscode-pact.png)

## Kadena command-line interface

The Kadena command-line interface (`kadena-cli`) is a node.js package that provides direct access to the Kadena blockchain and to commands that help you create, test, deploy, and manage applications for the Kadena network.
You can use the Kadena command-line interface to perform many common tasks interactively.
You can also use `kadena-cli` commands in scripts and automated workflows that don't allow interactive input.

To install the `kadena-cli` package:

1. Open a terminal shell on the computer where you want to install the `kadena-cli` package.

1. Verify that you have `node`, version 18 or later, and the `npm` or `pnpm` package manager installed.
   
   For example, check that you have node and npm installed by running the following commands:

   ```bash
   node --version
   npm --version
   ```
  
2. Use the `npm` or `pnpm` package manager to install `kadena-cli` globally. 
   
   For example, to install globally using npm, run following command:

   ```bash
   npm install --global @kadena/kadena-cli
   ```

3. Verify the package is installed and display usage information by typing `kadena` and pressing Return:

   ```bash
   kadena
   ```

4. Prepare a development workspace with initial settings by running the following command:
   
   ```bash
   kadena config init
   ```
   
   This command creates the `.kadena` configuration folder location in your current working directory and adds default network settings to a `networks` subfolder, then prompts you to create a wallet.
   For example:
   
   ```bash
   Created configuration directory:
   
   /Users/pistolas/.kadena
   
   Added default networks:
     
     - mainnet
     - testnet
     - devnet
     ? Would you like to create a wallet? (Use arrow keys)
     ❯ Yes
       No
   ```

   If you already have keys and an account or an existing wallet that you want to use, you can select **No** to end the interactive session.
   However, wallets are an important part of interacting with any blockchain, so you can follow the prompts displayed to create a new local wallet and account as part of your initial configuration.
   For more information about using the Kadena CLI as your primary interface for development tasks, see [Develop with kadena-cli](/guides/dev-kadena-cli).
   For command-line reference information, see [Kadena CLI](/reference/kadena-cli-ref).

## Chainweaver wallet and IDE

Chainweaver is a combination wallet and integrated development environment that enables you to manage accounts and keys, sign transactions, and edit, call, and deploy smart contracts.
Chainweaver is available as a [desktop application](https://github.com/kda-community/chainweaver/releases) or as a browser-based [web application](https://chainweaver.kadena.network/).
With Chainweaver, you can build, test, and iterate on your smart contracts before deploying them to your local development network, the Kadena test network, or the Kadena main network.

As an integrated development environment (IDE), you can also use Chainweaver to:

- Explore smart contract modules and functions, including sample applications and default contracts.
- Define and manage authorization rules using keysets.
- Connect to and deploy smart contracts on your local development network, the Kadena test network, or the Kadena main network.
- Edit, update, and execute smart contract code.

If you don't already have a Chainweaver account, you should create one using either the  After you download and install the desktop application or open Chainweaver in a browser, you can create a wallet and accounts to interact with Kadena networks.

For more information about using Chainweaver as your primary interface for development tasks, see [Develop with Chainweaver](/guides/chainweaver).
