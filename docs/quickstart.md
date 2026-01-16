---
title: Quick start
description: "Learn how to set up a development environment and write a simple smart contract for the Kadena network." slug: quickstart
---

import Link from '@docusaurus/Link';
import CodeBlock from '@theme/CodeBlock';

# Quick start for Kadena developers

Welcome to the Kadena development _Quick start_ guide.
Follow these simplified instructions to set up your development environment with a local blockchain and developer tools, then write your first contract using the Pact smart contract programming language.

## Before you begin

Before you begin, verify your computer meets the following basic requirements and has the following tools installed:

* Access to the internet, an interactive terminal shell, and a web browser.

* [Git](https://git-scm.com/downloads) version control program.
  You can verify that `git` is installed by running `git --version` on your computer.

* [Node.js](https://nodejs.org/en/download), version 18 or higher.
  You can verify that `node.js` is installed by running `node --version` on your computer.

* [npm](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm), the command-line interface for the node package manager.
    You can verify that `npm` is installed by running `npm --version` on your computer.

* [Docker](https://docs.docker.com/get-started/get-docker/), version x or higher.
  You can verify that `docker` is installed by running `docker --version` on your computer.

If you have everything you need, you can set up your development environment and deploy your first contract with a few basic steps.

## Install Pact

The Pact smart contract programming language is specifically designed for writing [smart contracts](/resources/glossary) to run safely and efficiently on the Kadena blockchain network.
Follow the appropriate instructions for your operating system to install Pact.

- [Install Pact on Linux](/smart-contracts/install/linux)
- [Install Pact on macOS](/smart-contracts/install/macos)
- [Install Pact on Microsoft Windows Services for Linux (WSL)](/smart-contracts/install/windows)

For more information about installing Pact, see [Installation and setup](/smart-contracts/install).

## Set up a local network

The Kadena development network allows you to run a standalone local blockchain node to simulate network operations and to test your smart contracts locally before deploying to a test or production network.

To set up the local network, open a terminal shell on your computer then run the following commands to get the development network Docker image and start the network in a Docker container:

```bash
git clone https://github.com/kda-community/devnet
cd devnet
npm install
docker run --rm --interactive --tty --publish 8080:8080 --volume kadena_devnet:/data --name devnet kadena/devnet
```

For more information about starting the Kadena development network in a Docker container, see [Set up the local network](/smart-contracts/install/local-dev-node).

## Install the Kadena command-line interface

The Kadena command-line interface (`kadena-cli`) provides direct access to the Kadena blockchain and commands to create, test, deploy, and manage applications for the Kadena network.
You can use the Kadena command-line interface interactively or in scripts and automated workflows.

To install and configure the `kadena-cli` program, open a terminal shell on your computer then run the following commands:

```bash
npm install --global @kadena/kadena-cli
kadena config init
```

The `kadena config init` command creates the `.kadena` configuration folder location in your current working directory and adds default network settings to a `networks` subfolder, then prompts you to create a wallet.
Wallets are an important part of interacting with any blockchain, so you can create one now as part of your initial configuration steps.
Follow the prompts displayed to continue setting up your local development environment with a development wallet and an account.

For more information about getting started with `kadena-cli` commands, see [Develop with kadena-cli](/guides/dev-kadena-cli).
For command-line reference information, see [kadena-cli command reference](/reference/kadena-cli-ref/).

## Write your first smart contract

You can now write and execute a simple `greeting` smart contract using the Pact smart contract programming language and the Pact interactive interpreter.

1. Open a terminal shell on your computer.
2. Start the Pact interpreter that you installed in the first step by running the following command:

   ```bash
   pact
   ```

3. Copy and paste the following simple `greeting` module code, then press return:

   ```pact
   (module greeting GOVERNANCE
      (defcap GOVERNANCE () true)
        (defun say-hello(name:string)
          (format "Hello, {}! ~ from Kadena" [name])
        )
   )
   ```

   You should see the module loaded with output similar to the following:

   ```pact
   "Loaded module greeting, hash f1yyXqj5HstOni1QdZmuagUJXbu72VmYiwXua7Vp4-0"
   ```

4. Call the `say-hello` function with a string similar to the following:

   ```pact
   (say-hello "Pistolas")
   ```

   The function returns a greeting similar to the following:

   ```pact
   "Hello, Pistolas! ~ from Kadena"
   ```

   If you want to deploy this contract on the local development network, copy the module code to a file with the `.pact` file extension—for example, create a `greeting.pact` file—then create a transaction to deploy the module as described in [Deploy smart contracts](/guides/contracts/howto-deploy-contracts).

   You can exit the Pact interpreter by pressing control-d on the keyboard.

## Next steps

Congratulations!
In this _Quick start_, you learned the basics of how to set up a development environment with the Pact programming language, a local development network, and the Kadena developer command-line interface.
You also got a first look at how to write and execute a simple Pact contract in the interactive interpreter.
You can learn more about these topics in [Smart contracts](/smart-contract-dev) documentation.

Here are some suggested next steps:

- Start learning the Pact programming language with [Get started: Introduction to Pact](/smart-contracts/get-started-intro).

- Explore hands-on coding projects in [Coding projects](/coding-projects/coding-projects).

- Learn how to interact with the blockchain and deployed contracts using [Kadena API](/api) calls and [How-to guides](/guides).

- Join the [Kadena Discord community](https://discord.gg/kadena) for support and discussions.

