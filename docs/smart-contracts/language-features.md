---
title: Pact features and conventions
id: lang-features
sidebar_position: 5
description: "Learn the basics of Pact programming language features and coding conventions with an introduction to built-in functions and writing your own simple functions."
---

# Pact features and conventions

Pact has a lot in common with other programming languages, but some of its conventions and intentional restrictions are either unique or unlike other programming languages you might be familiar with.
This part of the documentation presents an overview of Pact language features and conventions you should be familiar with as you start reading and writing smart contract code.

## Command-line interpreter

In the [Quick start](/quickstart), you got a first look at writing Pact smart contract code and using the Pact command-line interpreter, also referred to as the Pact read-eval-print-loop (REPL) environment.
The Pact REPL enables you to write and execute Pact code interactively from the command-line. but its real power lies in the ability to execute code in smart contract modules—that is, `.pact` files—or in test files with the `.repl` file extension that help you test your code as you go.
With test `.repl` files, you can execute `.pact` module code and take advantage of features that are only available to use in`.repl` files run by the Pact REPL interpreter.
For example, `.repl` files can include functions to set up environment data that's required for testing, but that is otherwise difficult to replicate in a test.
In most cases, you can use the features provided by the Pact REPL in combination with an integrated development environment (IDE), like Visual Studio Code, to provide an end-to-end development environment.

## Parenthesis

Pact uses parentheses to enclose each statement in the code.
The statements enclosed by parentheses are often referred to as symbolic expressions or **S-expressions**.
Parentheses enclose all module declarations, all function declarations, and any related logic.
Often, the code requires nested parenthetical statements to resolve the logic.
For example, the outermost parentheses in the following code contain the **helloWorld** module:

```pact
(module helloWorld 'admin-keyset
  (defun hello (name)
    (format "Hello {}!" [name]))
)
```

Within the module `helloworld` declaration, the next set of parentheses contain a `hello` function declaration that includes an expression—also enclosed by parentheses—that uses the `format` built-in function.

## Comments

There are several ways that you can embed comments in Pact programs.
The most common convention is to use semicolons (;) at the start or end of a line to add comments in smart contracts.
With this notation, all comments are introduced by a single semi-colon followed by text to the end of the line.
Although there's no difference between using a single semi-colon and multiple semi-colons, it's common for code to follow a convention similar to the following for readability:

- A single semicolon (;) for short notes on a single line of code.

  ```pact
  ; First Pact module
  (module greeting GOVERNANCE
      (defcap GOVERNANCE () true)
        (defun say-hello(name:string)
          (format "Hello, {}! ~ from Kadena" [name])
        )
   )

  (say-hello "Pistolas") ; Call the hello function
  ```

- Two semicolons (;;) inside or above definitions that describe functions or other top-level forms.

  ```pact
  ;;  In this example, the module defines a table for storing greeting
  ;;  names and two functions:
  ;;
  ;;  - (say-hello-to "name")
  ;;  - (greet)
  ```

- Three semicolons (;;;) or more file-level comments or to separate larger sections of code.

  ```pact
  ;;; Accounts module demonstrates using row-level keysets, defpact steps, and escrow.
  ;;; Version: 0.2
  ;;; Author: Stuart Popejoy
  ```

Depending on where you want to add a comment, you can also enclose strings using double quotation marks (`" "`) with or without the `@doc` metadata tag.
The following is an example of a multi-line documentation string that describes the create-token function the :

```pact
@doc "Initializes a TOKEN with given policies and parameters, \
\ and executes the enforce-init function for each listed policy."
```

The `@doc` metadata tag is optional.
For example, a module definition, function definition, or table definition can include comments in strings without the `@doc` tag:

```pact
(module helloWorld 'admin-keyset
  "A smart contract to greet the world."
  (defun hello (name)
    "Do the hello-world dance"
    (format "Hello {}!" [name]))
)
...
(deftable accounts:{account}
    "Main table for accounts module.")
```

For more information about metadata, see [Pact syntax](/reference/syntax).

## Data types

Pact, like most programming languages, supports the data types that you would expect.
For example, Pact allows you define the following types of data:

| Data type | Description | Examples |
| :--------- | :----------- | :------- |
| Integer | Any whole number value—positive or negative—that doesn't include a decimal.| `1`, `2`, `-19` |
| Decimal | Any number value that includes a decimal. Decimal precision is represented as `m*10^(-e)` in which `m` is unbounded, but `e` has, at most, a value of 255. As a result, decimal values have, at most, 255 decimal places, but the total number can be unbounded with a potentially unlimited precision. | `1.0`, `23.5`, `3.14159265359` |
| String | Any text within quotes. You can represent strings using double quotes. It's also possible to prepend strings used as function names or table names with a single quotation mark (').| `“Hello”`, `"Welcome to the show"`, `'balances` |
| Boolean | Anything that is represented by true and false literals. | `true`, `false` |
| List | List literals are created inside square brackets (`[ ]`). List items can be separated with spaces or commas. If all of the items in the list have the same type, then the type is defined by the content of the list. Otherwise, the type is just defined as a “list”. | `[1,2,3]` or `[1 2 3]`  is an integer list, `[1 2 true]` is a list |
| Object | Objects are dictionaries specifying key-value pairs created inside curly braces (`{ }`). |` {“house”:”blue”, “locked”:”no”}` |

For more information about data types, see [Pact syntax](/reference/syntax).

If you aren't sure about the data type when you are working in Pact, you can check its data type by using the Pact `typeof`
built-in function.

To try it yourself:

1. Open a terminal shell on your local computer.
2. Start the Pact REPL interpreter you installed in [Install Pact](/smart-contracts/install) by running the following command:

   ```bash
   pact
   ```

3. Use the `typeof` built-in function to test different data types.

   In Pact, functions are enclosed by parenthesis, so to test a list data type, for example:

   ```pact
   (typeof [1,2,3])
   ```

   After you run the command, the `typeof` function returns that this is a list with any type of data items:

   ```pact
   "[list]"
   ```

### String operations

In most cases, you use double quotation marks (" ") around strings to support whitespace or multi-line strings.
However, you can also represent strings by prepending the string with a single quotation mark (').

Typically, you use a single quotation mark to identify strings that are used as function names or table names.
You can't identify a string with a single quotation mark if the string includes whitespace or requires multiple lines, but this can be a helpful way to identify certain type of strings more succinctly.

For more information about using a single quotation mark for function or table names, see [symbols](/reference/syntax).

To work with strings:

1. Open a terminal shell on your local computer.
2. Start the Pact REPL interpreter you installed in [Install Pact](/smart-contracts/install) by running the following command:

   ```bash
   pact
   ```

3. Use double quotation marks to identify a string.

   ```pact
   pact> "Where the wild things are"
   "Where the wild things are"
   ```

4. Use a single quotation mark to identify a string.

   ```pact
   pact> 'hello
   "hello"
   ```

5. Concatenate two strings using the built-in `add` function.

   ```pact
   pact> (+ 'Hello " darkness my old friend")
   "Hello darkness my old friend"
   ```

### List and object operations

Pact allows you to express lists using square brackets and objects using curly braces.
Pact objects are similar to JavaScript objects defined using key-value pairs.

To create lists and objects:

1. Open a terminal shell on your local computer.
2. Start the Pact REPL interpreter you installed in [Install Pact](/smart-contracts/install) by running the following command:

   ```bash
   pact
   ```

3. Use double quotation marks to identify strings in a list using square brackets.

   ```pact
   pact> ["Alice" "Dinesh" "Lee"]
   ["Alice" "Dinesh" "Lee"]
   ```

4. Use double quotation marks to identify strings in an object that describes a cat named Scratchy who’s 6 years old.

   ```pact
   pact> { "type": "cat", "name": "Scratchy", "age": 6 }
   {"type": "cat", "name": "Scratchy", "age": 6}
   ```

5. Make a list that that contains two objects that describe a cat named Scratchy and a dog named Fluffy.

   ```pact
   pact> [ { "type": "cat", "name": "Scratchy", "age": 6 } { "type": "dog", "name": "Fluffy", "age": 3 } ]
   [{"type": "cat","name": "Scratchy","age": 6}
   {"type": "dog","name": "Fluffy","age": 3}]
   ```

## Time formats

Pact supports many different time properties and formats.
The following example illustrates using a `format-time` built-in function to format the time specified using the `time` built-in function:

```bash title=" "
pact> (format-time "%Y-%m-%d %H:%M:%S%N" (time "2024-07-23T13:30:45Z"))
"2024-07-23 13:30:45+00:00"
```

The `time` function constructs a time object from a UTC value using the ISO8601 format (%Y-%m-%dT%H:%M:%SZ).
The `format-time` built-in functions takes a `format` argument and a `time` argument to produce the specified time in the specified format.
The following table provides a summary of time formats used in the previous example:

| Format | Purpose |
| --- | --- |
| %Y | Year, no padding. |
| %m | Month of the year, zero-padded to two characters, "01"–"12" |
| %d | Day of the month, zero-padded to two characters, "01"–"31" |
| %H | Hour of the day using a 24-hour clock, zero-padded to two characters, "00"–"23" |
| %M | Minute of of the hour, zero0-padded to two characters, "00"–"59" |
| %S | Second of the minute, zero-padded to two characters, "00"–"60" |
| %N | ISO 8601 style numeric time zone (for example, "-06:00" or "+01:00")|

There are many other formatting options than included in the previous example.
For example, you can replace the numeric representing the month of the year with the short or long name for the month.

```pact
pact> (format-time "%Y-%b-%d" (time "2024-07-24T13:30:45Z"))
"2024-Jul-24"
```
For more information about all of the formats supported, see [Time formats](/pact-5/time/time-functions).

## Operators

Pact provides operator functions to perform common arithmetic, comparison, and logical operations.
The most common of these operator functions are listed in this section.
For a complete list with more information about each function, including function signatures and examples, see [Operators](/pact-5/operators).

### Arithmetic operators

- [+](/pact-5/operators/add): Addition
- [-](/pact-5/operators/sub): Subtraction
- [*](/pact-5/operators/mult): Multiplication
- [/](/pact-5/operators/div): Division
- [^](/pact-5/operators/exp): Exponentiation

### Comparison operators

- [=](/pact-5/operators/eq): Equality
- [!=](/pact-5/operators/neq): Inequality
- [`<`](/pact-5/operators/lt): Less than
- [`<=`](/pact-5/operators/leq): Less than or equal to
- [`>`](/pact-5/operators/gt): Greater than
- [`>=`](/pact-5/operators/geq): Greater than or equal to

### Logical operators

- [and](/pact-5/operators/and): Logical AND
- [or](/pact-5/operators/or): Logical OR
- [not](/pact-5/operators/not): Logical NOT

### Bitwise operators

- [&](/pact-5/operators/bitwise-and): Bitwise AND
- [|](/pact-5/operators/bitwise-or): Bitwise OR
- [~](/pact-5/operators/bitwise-reverse): Bitwise NOT
- [xor](/pact-5/operators/xor): Bitwise XOR
- [shift](/pact-5/operators/shift): Bitwise shift

### Math-related operators

- [mod](/pact-5/operators/mod): Modulus
- [abs](/pact-5/operators/abs): Absolute value
- [round](/pact-5/general/round): Rounding
- [ceiling](/pact-5/operators/ceiling): Ceiling
- [floor](/pact-5/operators/floor): Floor

## Functions

Functions are an important part of any programming language, whether you are working with built-in libraries or writing your own functions.
In addition to the operator functions, Pact provides many other built-in functions to handle different types of tasks.
The functions are grouped into the following categories:

- [Capabilities](/pact-5/capabilities)
- [Database](/pact-5/database)
- [General](/pact-5/general)
- [Guards](/pact-5/guards)
- [Keysets](/pact-5/keysets)
- [Operators](/pact-5/operators)
- [Repl](/pact-5/repl)
- [Time](/pact-5/time/time-functions)

Click a category to see a complete list of the functions in that category.
Within each category, you can click individual function names to see more information, including function signatures and examples.
You can also view information about built-in functions using the Pact command-line interpreter and interactive REPL.

## Defpacts

One of the key features of the Pact programming language is support for multi-step transactions using coroutines—called **defpacts**—that can start, stop, continue, or rollback the execution of specific operations in a transaction.

With defpacts, you can define the steps to be executed by different parties as sequential operations on the blockchain.
For example, defpacts are used for cross-chain transfers where a burn operation takes place on the first chain and a mint operation takes place on the second chain.
Because defpacts enable you to orchestrate a series of transactions in a strict sequence, they have two primary use cases:

- For public two-party transactions—similar to an escrow process—with rules for the operations that are required to be performed by each participant to complete the transaction.
- For private, confidential transactions that can be serialized and executed in a sequence and recorded in a private log and, predominately, involving the exchange of encrypted messages outside of the blockchain state. Note that **private multi-step transactions** aren't supported in Pact-5 or later.

With defpacts, you can enable each participant to run only a subset of functions—for example, as a buyer who can make an offer or a seller who can start a sale—while preserving the integrity of the transaction as a whole.
For more information about defining and using defpacts, see the syntax description for the [`defpact`](/reference/syntax#defpact) reserved keyword.
For a more detailed example of using `defpact` in a smart contract, see the Marmalade [`ledger`](https://github.com/kda-community/marmalade/blob/main/pact/ledger/ledger.pact) contract.