---
title: "Get started: Introduction to Pact"
id: get-started-intro
sidebar_position: 1
slug: get-started-intro
description: "Pact is a human-readable smart contract programming language, designed to enable correct, transactional execution on a high-performance blockchain. Start your builder's journey on Kadena by learning about the Pact smart contract programming language."
---

# Get started: An Introduction to Pact

This part of the Kadena developer documentation is focused on writing **smart contracts** and developing applications to run on a blockchain.
To get started, it's important to know what smart contracts are and the kinds of challenges that you might face in writing them.

## Smart contracts

A smart contract is a program that can automatically execute agreements—in the form of transactions—on the blockchain without any external oversight.
The contract ensures that the specific conditions, defined in the code logic to describe the terms of the agreement, are met before executing the transaction programmatically.
Smart contracts are deployed and executed on blockchain networks because the blockchain provides a decentralized, immutable, and publicly accessible record of all transactions.
This transparency and traceability ensures that the programmatic execution of the contract can be considered trustworthy and verifiable.

However, there are several unique challenges involved in writing smart contracts.
For example, it's important to ensure that smart contracts can't be accessed by unauthorized parties, that transactions can't be intercepted or manipulated, and that code execution and data storage don't overload blockchain resources.

Because a blockchain is a resource-constrained environment, it's particularly important for smart contracts to perform well even when network activity is at its peak.
For example, if the code in a smart contract isn't efficient, it can be costly to execute the contract functions.
Inefficient code can also delay transaction execution and block validation, affecting the throughput for the entire blockchain network.

If a smart contract performs unbounded operations, excessive looping, or recursion, the contract might strain or overload the computational capacity that the blockchain has access to.
In worst case scenarios, bugs in a smart contract can result in lost funds for participants or stall the progress of the blockchain.

With these challenges and risks in mind, you can see why it's important to avoid common pitfalls and write smart contracts that execute transactions efficiently and securely.

## Pact smart contracts

Pact is an open-source programming language designed specifically for writing **smart contracts** and developing applications to run on a blockchain.
Pact was built to help developers create programs that overcome the challenges associated with writing smart contracts.

Pact reflects many of the same approaches to writing smart contracts that are used in other programming languages—such as Solidity or Rust—but with a goal of making contracts less error-prone and less vulnerable to exploits and attacks. 
Pact is similar to many general purpose languages in its syntax, function declarations, module definitions, and imperative style. 
However, Pact has several features that make it a safe and performant language for blockchain applications, including the following:

- Pact supports a straight-forward database model for storing and manipulating state using database schemas and tables.
- Pact contracts can be written and deployed using composable modules, enabling you to iterate, update, and upgrade contract functionality when needed.
- Pact limits computational overhead by preventing unbound looping and recursion at the language level.
- Pact code is designed to provide transparency that can be inspected in plain text as part of the public record.
- Pact transactions can be executed in a single step or as a sequence of steps guaranteed to be executed in a specific order.

These features and constraints reduce the risks of writing faulty smart contract code, limit costly performance bottlenecks, and improve readability and reliability of programs running on the blockchain.
You'll learn about these language features and more as you progress through the _Smart contracts_ topics.

## Writing contracts in other languages 

It's possible to write contracts in other languages, as long as the transactions conform to the expected message format when submitted to a Chainweb node.
For example, it's possible to write programs using JavaScript, TypeScript, or Python to emulate Pact smart contracts.
However, Pact provides many built-in features and native functions that make smart contract development more efficient and produce more readable results without requiring external libraries to construct compatible commands.

## Navigating documentation and resources

The _Smart contracts_ documentation is for programmers and non-programmers interested in learning how to write programs using the Pact smart contract programming language. 
This part of the documentation is focused on language features and examples.

### How the documentation is organized

In addition to the language-focused topics in _Smart contracts_, Kadena developer documentation includes the following top-level sections: 

- The _How-to guides_ provide examples of the different ways you can perform common tasks.
You can use these guides as a quick reference when working with accounts, transactions, or contracts to see instructions for tasks like creating an account, submitting a transaction, or calling a contract function.

- Under _API_, you'll find reference information for the Pact, Peer-to-Peer, and Service REST API endpoints, including query parameters, request and response schemas, and call examples.

- The _Reference_ section provides reference information for the Pact programming language—including syntax, keywords, and built-in functions—and the command-line interfaces you can use to interact with Pact smart contracts and the Kadena blockchain in a development, test, or production environment.

- In _Coding projects_, you'll find companion documentation for the sample projects located in the `pact-coding-projects` repository.

- Under _Resources_, there are links to additional resources, such as the Kadena video library, contributor guidelines, and other tools and projects. 

### Documentation conventions

The following conventions are used in the Kadena documentation:

- `Fixed-width font` is used for inline sample code, program names, program output, file names, and commands that you type at the command line. 
- **Bold** type is used to highlight menus, commands, buttons, or user interface elements, and to introduce new terms.
- _Italic_ type is used for titles, to emphasize specific words, or to indicate variables for which you should substitute an appropriate value.
- Square brackets ([ ]) indicate optional arguments in command reference or list data types in the Pact language reference.
- Curly braces ({ }) indicate objects with key-value pairs in the Pact language reference.
- Vertical bars (|) separate alternative values from which you must make a selection.
- An ellipsis (...)	indicates that the preceding element can be repeated.
- The generic data type `<a>` is used if an argument represents a type-bound parameter. 
  
## Contributing to documentation or code

As a member of the Kadena community, you are invited and encouraged to contribute to Kadena technical documentation and to the Kadena project code base.
There are a lot of ways to get involved.
For example, you can contribute by:

- Submitting issues.
- Offering suggestions for improvements to existing content.
- Adding review comments to existing pull requests.
- Proposing new content.
- Creating new pull requests to fix issues yourself.
- Creating pull request for new content other community members might find useful.

We value, respect, and appreciate all contributions from the developer community and only ask that you agree to abide by our [Code of conduct](https://github.com/kadena-community/kadena.js/blob/main/code-of-conduct.md) and [Community guidelines](https://www.kadena.io/community-guidelines).

### Contribute to documentation

Kadena documentation is open source and hosted on GitHub in the [kadena-docs](https://github.com/kadena-docs/kadena-docs) repository. 
To report an issue or make a documentation request, open a [New Issue](https://github.com/kadena-docs/kadena-docs/issues/new) and add the **documentation** label to it.
If you have a GitHub account and want to suggest changes to the documentation, create a branch and open a pull request as described in Contribute to documentation.

For details about getting started as a contributor to documentation, see [How to contribute to Kadena documentation](../resources/contribute-doc). 
For recommendation regarding writing style, documentation conventions, and topic templates, see the [Writer's style guide](../resources/writing-guide).

### Contribute to the codebase

The Kadena codebase is open source and hosted on GitHub in repositories under two organizations: [kadena-io](https://github.com/kda-community) and [kadena-community](https://github.com/kadena-community).

- Repositories in [kadena-io](https://github.com/kda-community) are focused on the Kadena network infrastructure and foundational components like [chainweb-node](https://github.com/kda-community/chainweb-node) and [pact](https://github.com/kda-community/pact).

- Repositories in [kadena-community](https://github.com/kadena-community) are focused on tooling and projects to help developers build applications on the Kadena network like the TypeScript libraries in [kadena.js](https://github.com/kadena-community/kadena.js).

For details about getting started as a contributor, see [How to contribute as a developer](../resources/contribute-dev).
