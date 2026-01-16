---
title: Installation and setup
id: install
sidebar_position: 2
description: "Install the Pact smart contract programming language and set up tooling for your development environment."
---

import CodeBlock from '@theme/CodeBlock';

# Installation and setup

Setting up a fully-functioning development environment often requires more than the minimal steps covered in the [Quick start](../quickstart) guide.
This section provides more detailed information about installation, tooling, and configuration options so you can create a complete development environment that best meets your needs.

At a high level, you complete the following steps to configure a development environment for writing smart contracts that execute transactions on the Kadena blockchain network:

- **Install Pact**: Pact is the core smart contract programming language for Kadena. By installing the appropriate version of Pact for your operating system, you'll be able to write, test, and deploy your smart contracts from your working environment.

- **Install tooling**: Installing additional tooling is optional. However, many toolchain extensions—like the Pact language server plugin (LSP) and the community-contributed `pactup` package manager—provide essential quality-of-life enhancements that improve the developer experience. You should also consider adding access to common blockchain applications—like faucets, wallets, and block explorers—to ensure you have an end-to-end development environment.

- **Set up a local node**: A properly configured blockchain node is a crucial part of your development environment for testing and debugging of projects during development and simulating public deployment in an isolated network environment.

## Before you begin

To prepare for installation, you should verify your development environment meets the following basic requirements:

- You have an internet connection and a web browser installed on your local computer.
- You have an integrated development environment (IDE) or code editor such as [Visual Studio Code](https://code.visualstudio.com/download).
- You have access to an interactive terminal shell as part of the IDE or code editor you use.

## Pact versions

You can choose to download and install either the latest, stable version of Pact, version 4.x, or the Pact core revision, version 5 (beta) for Linux or macOS computers.

- Pact 4.13 is the latest stable release of the Pact smart contract language and interactive interpreter for macOS.
- Starting with Pact 5, the Pact core—including the command-line interpreter, built-in functions, and related components—have undergone a major transformation. 
  This reinvention of the Pact language retains functional parity with previous Pact releases, but with significant changes that enhance the scalability, maintainability, and performance of the language.
  With the release of Pact 5, the Pact core is also positioned for more sustainable growth of Pact features within the Kadena ecosystem. 
  By offering more modular and maintainable internal structures, Pact 5 can now better support community participation and enhancements to the language and components that rely on it.
  For more information about Pact 5, see the following resources:

  - [Migrating to Pact 5](/smart-contracts/install/migrating-to-pact5)
  - [Pact 5 repository](https://github.com/kda-community/pact-5)
  - [Pact 5 Beta: Improving Developer, Miner, and User Experience](https://www.kadena.io/perspectives/pact-5-beta)

## Installation options

You can download and install the Pact programming language and interactive interpreter locally on your local computer from prebuilt platform-specific binaries or build Pact directly from its source code. 
You can also run Pact in a browser without installing it as a component in the development network Docker image.

The installation instructions in this section describe how to install Pact locally using prebuilt binaries for each operating system platform.

To build Pact binaries directly from source, see the instructions in the appropriate repository:

- [Pact 5](https://github.com/kda-community/pact-5)
- [Pact 4.x](https://github.com/kda-community/pact?tab=readme-ov-file#building-from-source)

<!--
To build Pact binaries directly from source, download the source code from [Pact Releases](https://github.com/kda-community/pact/releases), then use Homebrew, Cabal from the Haskell toolchain, or the Nix package manager to build Pact. 
For more information about the dependencies and tools for building from the source code, see [Building from source](https://github.com/kda-community/pact?tab=readme-ov-file#building-from-source).
-->
