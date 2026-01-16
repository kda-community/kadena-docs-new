---
title: Local testing
description: "This coding project demonstrates how to use built-in functions for testing smart contracts using the Pact command-line interpreter REPL."
id: local-testing
sidebar_position: 7
---

# Local testing

The _Local testing_ coding project demonstrates how to use built-in functions for testing smart contracts using the Pact command-line interpreter REPL.
If you've explored other coding projects, you might be familiar with some of the most basic functions, such as the `begin-tx` and `commit-tx` built-in functions.
This coding project introduces a more complete set of common functions for testing smart contracts in your local development environment.
For this project, you'll use the `loans.pact` module as the sample smart contract to test.
The `loans` module defines three tables and ten functions, making it a good candidate for learning about writing test cases.

In this coding project, you'll learn about:

- Using the Pact read-evaluate-print-loop (REPL) for interactive testing.
- Using Pact REPL-only built-in functions.
- Loading and resetting environment data.
- Defining transaction blocks
- Loading and using Pact modules.
- Testing success and failure cases.

## Before you begin

Before starting this project, verify your environment meets the following basic requirements:

- You have a GitHub account and can run `git` commands.
- You have installed the Pact programming language and command-line interpreter.
- You have installed the `kadena-cli` package and have a working directory with initial configuration settings.
- You have a local development node that you can connect to that runs the `chainweb-node` program, either in a Docker container or on a physical or virtual computer.
- You should be familiar with defining modules and using keysets.

## Get the starter code

To get started:

1. Open a terminal shell on your computer.

2. Clone the `pact-coding-projects` repository by running the following command:

   ```bash
   git clone https://github.com/kadena-docs/pact-coding-projects.git
   ```

3. Change to the `06-local-testing` directory by running the following command:

   ```bash
   cd pact-coding-projects/06-local-testing
   ```

   If you list the contents of this directory, you'll see the following files:

   - `starter-testing-loans.repl` provides a starting point with the framework for building the `loans` module.
   - `project-steps` provides test cases for completing each part of the coding project.
   - `final-testing-loans.repl` provides the final version of the test cases for verifying the `loans` module.

4. Open and review the `starter-testing-loans.repl` file.

   This file outlines the tasks you need to complete for the _Local testing_ project.
   Follow the embedded instructions to work through the coding challenges on your own or use the detailed instructions and code provided in the next sections.

## Using the Pact REPL

The Pact command-line interpreter provides a read-evaluate-print-loop (REPL) terminal for interactive Pact modules.
With this terminal, you can use built-in REPL functions to load and run Pact files to test the functions defined in them.
The REPL file is responsible for reading, evaluating, printing, and looping through the Pact code and returning the results to the terminal.
By using REPL files, you can test and iterate on the smart contracts code efficiently.

To use the Pact REPL:

1. Create a REPL (`.repl)`) file that loads the Pact module (.pact) that you want to test.
2. Open a new terminal shell on your computer.
3. Start the `pact` command-line interpreter and specify the `.repl` file that loads the `.pact` that you want to test.

   The `.repl` file loads the `.pact` file.
   The interpreter executes the code in the `.pact` file, returns data to the `.repl` file which, in turn, sends the output to your terminal.

## Using built-in functions

Pact includes many built-in functions for testing module code using `.repl` files and the Pact command-line interpreter.

Most of these functions are [REPL-only functions](/pact-5/repl).
They can only be used in `.repl` files and can't be called directly in `.pact` files.
The following functions are some of the most commonly used REPL-only functions:

| Function | Purpose |
| --- | --- |
| [begin-tx](/pact-5/repl/begin-tx) | Begin a transaction. |
| [commit-tx](/pact-5/repl/commit-tx) | Commit a transaction. |
| [env-chain-data](/pact-5/repl/env-chain-data) | Define the chain information to use for transactions in your testing environment. |
| [env-data](/pact-5/repl/env-data) | Set transaction data. |
| [env-sigs](/pact-5/repl/env-sigs) | Set transaction signature keys. |
| [expect](/pact-5/repl/expect) | Evaluate expression and verify that it equals what is expected. |
| [expect-failure](/pact-5/repl/expect-failure) | Evaluate an expression and succeed only if the expression results in an error. |
| [load](/pact-5/repl/load) | Load and evaluate a file. |

## Load environment data

Most smart contracts require some information to be available in the environment so that it can be used by the functions defined in the module.
For example, keyset information must be available to authorize access to some operations.
In a `.repl` file, you can use use the built in functions **env-data** and **env-sigs** to specify keysets and keys to use for testing.
One of the unique features of using these REPL-only functions in a `.repl` file is that you can simulate keys and accounts without having to generate and use actual keys and signatures to authorize operations or sign transactions.
For example, you can use the `env-data` function to simulate the keyset named `loans-admin` like this:

```pact
(env-data {
    "loans-admin":
      { "keys": ["loan-admin-keyset"],
        "pred": "keys-all" }
      }
)
```

Similarly, you can use the `env-sigs` function simulate a signing key and capabilities.

```pact
   (env-sigs [
     { "key": "marmalade-admin"
      ,"caps": []
      }])
```

## Defining transaction blocks

In `.repl` files, you define tests within transaction blocks that start with the `begin-tx` function and end with the `commit-tx` function.
Within a transaction block that starts with the `begin-tx` function and ends with the `commit-tx` function, you can make as many calls to the Pact code as you like.
Any command sent to the blockchain is a transaction, but a _command_ can have multiple _function calls_.
For example, a single transaction block is treated as one command, but it can include the code used to define a module with `module` and create module tables with with one or more `create-table` calls.

Transaction blocks enable you to group function calls into smaller logical units, making it easier to identify errors and resolve test failures.
Although it's possible to place all of the function calls in a single transaction, in practice, it's better to break test files up to make function calls into several smaller transactions.

For example, you can make each function call a separate transaction similar to the following:

```bash
(begin-tx "Test the inventory-key function")
  (free.loans.inventory-key "loanId-3" "Pistolas")
(commit-tx)

(begin-tx "Test the create-a-loan function")
  (free.loans.create-a-loan "loanId-3" "Pistolas" "Capital Bank" 11000)
(commit-tx)

(begin-tx "Test the assign-a-loan function")
  (free.loans.assign-a-loan "txid-3" "loanId-3" "Buyer 1" 10000) ;; loanId, buyer, amount
(commit-tx)
```

Transactions can be grouped together however is most convenient for your testing.
However, you should try to maintain a logical order in your transactions for maintenance and readability.

## Load a module from a Pact file

Pact files are not run by your computer directly.
Instead, they’re loaded into the `.repl` file and run from there.
After you have defined environment data, such as the namespace and keyset for a module, you must load the `.pact` file into the `.repl` file using a **load** statement.

For example, type `load` then specify the file path as a string:

```bash
(load "loans.pact")
```

Typically, `.pact` and `.repl` file are located in the same folder, so you only need to specify the name of the `.pact` file.
However, if you place the files in different file locations, you must provide an absolute or relative path to the `.pact` file you want to load.

## Call module functions

After the `.pact` file is loaded in the `.repl` file, you are ready to start calling module functions.
Depending on how you define your transaction blocks, there are a few possible ways to call the functions.
The most common approach is to import the module with a **use** statement, then call the functions that are defined in the imported module.
For example:

```bash
(begin-tx)
   (use free.loans)
   (create-a-loan "loanId-2" "Renovation" "RiverBank" 140000)
(commit-tx)
```

For this coding project, edit the `.repl` file to call the following functions defined in the `loans` module:

| Function | Purpose |
| --- | --- |
| create-a-loan | Accepts parameters to add the appropriate information to each table |
| assign-a-loan | Assigns a loan to an entity. |
| sell-a-loan | Sell a loan and log details in the loan history table. |

After calling the functions used to create, assign, and sell a loan, add tests to read some of the data that you created.
For example, edit the `.repl` file to call the following functions defined in the `loans` module:

| Function | Purpose |
| --- | --- |
| read-loan-inventory | Reads all loans in the loan inventory table. |
| read-loans-with-status | Reads all loans with a specific status. |

## Execute the tests

At this point, you have a completed `.repl` file that tests code defined in the `loans` module.
The final step is to execute the tests by running the file from a terminal shell to view the output.

To execute the `.repl` file tests:

1. Open a terminal shell and navigate to the directory that contains the `loans.repl` and `loans.pact `files.

2. Start the Pact command-line interpreter:

   ```bash
   pact
   ```

1. Load the `loans.repl` file

   ```bash
   pact> (load "loans.repl")
   ```

   You should see output for the tests you defined in the `.repl` file displayed in the terminal.
   For example, you should see output similar to the following excerpt:

   ```bash
   "Loading loans.repl..."
   "Setting transaction keys"
   "Setting transaction data"
   "Begin Tx 0: Define namespace"
   "Namespace defined: free"
   "Commit Tx 0: Define namespace"
   "Begin Tx 1: Call functions that update loan tables"
   "Loading loans.pact..."
   "Namespace set to free"
   "Keyset defined"
   "Loaded module free.loans, hash Js_byz9rB57F6Ip3UqTXIzraNw0a3QiPvzs2F0dMr5c"
   "TableCreated"
   "TableCreated"
   "TableCreated"
   ...
   "Begin Tx 3: Test inventory-key function"
   "loanId-3:Pistolas"
   "Commit Tx 3: Test inventory-key function"
   "Begin Tx 4: Test create-a-loan function"
   "Write succeeded"
   "Commit Tx 4: Test create-a-loan function"
   "Begin Tx 5: Test assign-a-loan function"
   "Write succeeded"
   "Commit Tx 5: Test assign-a-loan function"
   ```

## Testing success and failure use cases

Pact also provides built-in functions to test for expected results, including code that you expect to succeed, code that you expect to fail, and code that returns an expected result from an evaluated expression.

| Function | Purpose  |
| :--- | :--- |
| [expect](/pact-5/repl/expect) | Evaluates an expression and returns a specified string is the result from the evaluation is what is expected. |
| [expect-failure](/pact-5/repl/expect-failure) | Evaluates an expression and returns a specified string only if the expression evaluated returns an error. |
| [expect-that](/pact-5/repl/expect-that) | Evaluates an expression and returns true if the expression evaluated returns the expected result or false if the expression evaluated doesn't return the expected result. |

The following example demonstrates how to use the `expect` function to evaluate whether an expression returns an expected result:

```pact
pact> (expect "Test that addition is correct" 4 (+ 2 2))
"Expect: success: Test that addition is correct"

pact> (expect "Test that addition is correct" 4 (+ 3 2))
"FAILURE: Test that addition is correct: expected 4:integer, received 5:integer"
```

The following example demonstrates how to use the `expect-failure` function to evaluate whether an expression fails as an expected result:

```pact
pact> (expect-failure "Enforce fails on false" (enforce false "Expected error"))
"Expect failure: success: Enforce fails on false"
```

The following example demonstrates how to use the `expect-that` function to evaluate whether an expression returns the expected result:

```pact
pact> (expect-that "addition result is greater than 2" (< 2) (+ 1 2))
"Expect-that: success: addition result is greater than 2"

pact> (expect-that "addition result is greater than 2" (> 2) (+ 1 2))
"FAILURE: Expect-that: Did not satisfy condition: addition result is greater than 2"
```

You can find additional examples of `.pact` and `.repl` test files in the [pact-examples](https://github.com/kda-community/pact-examples.git) repository.
Both the `expect` and `expect-failure` functions enable you to test whether the outcome of an expression is what you expect it to be.
For example, the [keysets.repl](https://github.com/kda-community/pact-examples/blob/master/atoz/01-keysets/keysets.repl) demonstrates using the `env-data` function and `expect-failure` function to test use cases that are expected to fail.

```pact
(expect-failure "real keyset should fail"
  (enforce-keyset "keyset-real"))
```
### Review

In this coding project, you learned the basics of testing by creating transaction blocks in `.repl` files.
Defining tests in `.repl `files is the most common approach to testing smart contracts locally.
From these basic building blocks, you can experiment with adding and modifying tests and function calls in `.repl` or `.pact` files to learn more.
