---
title: Syntax and keywords
description: This reference provide a summary of syntax conventions for the Pact smart contract programming language.
id: syntax
sidebar_position: 2
tags: ['pact', 'language reference', 'syntax']
---

# Syntax and keywords

This reference provide a summary of syntactical conventions and reserved keywords for the Pact smart contract programming language.
This section doesn't include explanatory text, use case examples, or general information about the Pact language. Therefore, this section is typically not suitable for readers who are new to programming languages or who are looking for a general introduction to using Pact.

## Text strings

Text string literals are delimited using double quotation marks:

```pact
pact> "This is a literal text string"
"This is a literal text string"
```

In programs, you can specify multiline strings by putting a backslash before and after whitespace within the quotation marks.
For example:

```pact
(defun id (a)
  "Identity function. \
  \Argument is returned."
  a)
```
Multiline strings aren't support when using the Pact command-line interpreter interactively.

## Symbols

Symbols are string literals that represent a unique item in the runtime, like a function identifier or a table name.
Internally, symbols are treated as string literals.
However, if you want to make use of symbols to distinguish identifiers from other strings, precede the string with a single quotation mark.
For example:

```bash
pact> 'accounts
"accounts"
```

Symbol notation doesn't support whitespace nor multiline strings.

## Integers

Integer literals are unbounded, and can be positive or negative.

```bash
pact> 12345
12345
pact> -922337203685477580712387461234
-922337203685477580712387461234
```

## Decimals

Decimal literals have potentially unlimited precision.

```bash
pact> 100.25
100.25
pact> -356452.234518728287461023856582382983746
-356452.234518728287461023856582382983746
```

## Booleans

Booleans are represented by `true` and `false` literals.

```bash
pact> (and true false)
false
```

## Lists

List literals are created with square brackets (`[]`).
Optionally, list items can be separated with commas.
Uniform literal lists are given a type in parsing.

```bash
pact> [1 2 3]
[1 2 3]
pact> [1,2,3]
[1 2 3]

pact> (typeof [1 2 true])
"list"
```

## Objects

Objects are dictionaries, created with curly braces (`{}`) specifying key-value pairs using a colon (`:`).
For certain applications, such as database updates, keys must be strings.

```bash
pact> { "foo": (+ 1 2), "bar": "baz" }
{"bar": "baz","foo": 3}
```

## Bindings

Bindings are dictionary-like forms, also created with curly braces, to bind database results to variables using the `:=` operator.
Bindings are used in the following functions to assign variables to named columns in a row, or values in an object:

- [with-read](/pact-5/database/with-read)
- [with-default-read](/pact-5/database/with-default-read)
- [bind](/pact-5/general/bind)
- [resume](/pact-5/general/resume)

```pact
(defun check-balance (id)
  (with-read accounts id { "balance" := bal }
    (enforce (> bal 0) (format "Account in overdraft: {}" [bal]))))
```

## Lambdas

Lambda expressions are code blocks that create anonymous functions that can be applied in a local scope, rather than at the top level of a program with the `defun` keyword.

Lambdas are supported in `let` expressions, and can be as inline arguments for built-in function applications.

```pact
; identity function
  (let ((f (lambda (x) x))) (f a))

; native example
  (let ((f (lambda (x) x))) (map (f) [1 2 3]))

; Inline native example:
  (map (lambda (x) x) [1 2 3])
```

## Type specifiers

You can specify types for functions, variables, and objects by using the colon (`:`) operator followed by one of the following type literal or a user type specification:

- `string`
- `integer`
- `decimal`
- `bool`
- `time`
- `keyset`
- `list` or `[type]` to specify the list type
- `object`, which can be further typed with a schema
- `table`, which can be further typed with a schema
- `module`, which must be further typed with required interfaces

For example:

```pact
  (defun mint:bool
    ( id:string
      account:string
      guard:guard
      amount:decimal
    )
    ...
  )
```

### Function arguments and return types

```pact
(defun prefix:string (pfx:string str:string) (+ pfx str))
```

### Let variables

```pact
(let ((a:integer 1) (b:integer 2)) (+ a b))
```

## Schema type literals

A schema defined with [defschema](/reference/syntax#defschema) is referenced by a name enclosed in curly braces (`{}`).


```pact
  (defschema token-schema
    id:string
    uri:string
    precision:integer
    supply:decimal
    policies:[module{kip.token-policy-v2}]
  )

  (defschema version
    version:integer
  )

  (deftable tokens:{token-schema})
  (deftable versions:{version})
```

Tables and objects can only take a schema type literal.

```pact
(deftable accounts:{account})

(defun get-order:{order} (id) (read orders id))
```

## Module type literals

[Module references](/smart-contracts/modules#module-references) are specified by the interfaces they demand as a comma-delimited list.

```pact
module:{fungible-v2,user.votable}
```

## Dereference operator

The dereference operator `::` allows a member of an interface specified in the type of a [module reference](/smart-contracts/modules#module-references) to be invoked at runtime.

```pact
(interface baz
  (defun quux:bool (a:integer b:string))
  (defconst ONE 1)
  )
...
(defun foo (bar:module{baz})
  (bar::quux 1 "hi") ;; invokes 'quux' on whatever module is passed in
  bar::ONE             ;; directly references interface const
)
```

## bless

Use the `bless` keyword to identify a previous version of a module—identified by its `hash` value—that you want to continue to support.

For more information about using the `bless` keyword in a module declaration, see [Dependency management](/smart-contracts/modules#module-versioning-and-dependencies).

### Basic syntax

To support a previous version of a module, use the following syntax model:

```pact
(bless HASH)
```

### Examples

The following example illustrates supporting two previous versions of the `provider` module:

```pact
(module provider 'keyset
  (bless "ZHD9IZg-ro1wbx7dXi3Fr-CVmA-Pt71Ov9M1UNhzAkY")
  (bless "bctSHEz4N5Y1XQaic6eOoBmjty88HMMGfAdQLPuIGMw")
  ...
)
```

## cond

Use the `cond` keyword to produce a series of `if-elseif-else` expressions to evaluate one after another.
For example, if the first condition evaluated passes, then branch-1 is executed.
If the first condition isn't met, the second condition is evaluated and if that condition passes, then branch-2 is executed.
The `else-branch` is only evaluated if all other conditions fail.

The `cond` special form allows you to evaluate a series of `if` expressions in a more concise manner.

Syntactically, the `cond` form accepts a sequence of conditions:

```pact
(cond
   (a b)
   (c d)
   (e f)
   g)
```

When the conditions are evaluated, the statements are expanded to a series of `if` statements:

```pact
(if a b (if c d (if e f g)))
```

### Basic syntax

To evaluate a series of conditions, use the following syntax model:

```pact
(cond (condition-1 branch-1) [(condition-2 branch-2) [...]] else-branch)
```

### Examples

The following example demonstrates how to use `cond` to evaluate multiple branching conditional expressions. 

```pact
(module medals GOV
    (defcap GOV () true)
    (defun award:string (score:integer)
      (cond ((< score 10) "Bronze")
            ((< score 20) "Silver")
            ((< score 30) "Gold")
            "Platinum"))
)
```

If you load this module, you can call the `award` function to see the conditions evaluated:

```pact
pact> (m.award 100)
"Platinum"

pact> (m.award 23)
"Gold"

pact> (m.award 3)
"Bronze"
```

## defcap

Use the `defcap` keyword to signal the start of a capability definition followed by the capability name, required or optional arguments, optional documentation, and the capability body composed of one or more expressions.
A `defcap` code block defines a capability token you want to store in the environment to grant some type of permission or privilege. The body of the code block can consist of one or more expressions.

The body of the capability definition is only called with the `with-capability` and `compose-capability` functions when the token—parameterized by its arguments—isn't found in the environment.
When the code is executed, the arguments are in scope.

### Basic syntax

To define a capability token that grants a permission or a privilege, use the following syntax model:

```pact
(defcap name arguments [doc] capability-body ...)
```

### Examples

The following example illustrates defining the `USER_GUARD` capability:

```pact
(defcap USER_GUARD (user)
  "Enforce user account guard
  (with-read accounts user
    { "guard": guard }
    (enforce-guard guard)))
```

The following example illustrates defining the `DEBIT` capability:

```pact
(defcap DEBIT (id:string sender:string)
    (enforce-guard (account-guard id sender))
)
```

## defconst

Use the `defconst` keyword to define a constant name with the specified value and optional documentation or metadata. The value is evaluated when the module is loaded and held in memory for the duration of module execution.

### Basic syntax

To define a constant value, use the following syntax model:

```pact
(defconst name value [doc-or-metadata])
```

### Examples

The following examples illustrate defining constants with optional documentation:

```pact
(defconst COLOR_RED "#FF0000" "Red in hex")
(defconst COLOR_GRN "#00FF00" "Green in hex")
(defconst PI 3.14159265 "Pi to 8 decimals")
```

The following example illustrates defining the constant `PENNY` with an explicit type:

```pact
(defconst PENNY:decimal 0.1)
```

## defun

Use the `defun` keyword to signal the start of a function definition followed by the function name, required or optional arguments, optional documentation or metadata, and the function body composed of one or more expressions.
Arguments are in scope for the function body.

### Basic syntax

To define a function, use the following syntax model:

```pact
(defun name [arguments] [doc-or-metadata] function-body ...)
```

### Examples

The following examples illustrate defining an `add3` function and a `scale3` function:

```pact
(defun add3 (a b c) (+ a (+ b c)))

(defun scale3 (a b c s)
  "multiply sum of A B C times s"
  (* s (add3 a b c)))
```

## defpact

Use the `defpact` keyword to define a multi-step transaction with the specified `name` as a pact.
The computation for a pact is composed from a sequence of steps that must be executed in a specific order and occur in distinct transactions.
The `defpact` syntax is identical to the [defun](/reference/syntax#defun keyword except that the `defpact` body must be comprised of [steps](/reference/syntax#step) to be executed in strict sequential order.

### Basic syntax

To define a pact, use the following syntax model:

```pact
(defpact name [arguments] [doc-or-metadata] steps ...)
```

### Examples

```pact
(defpact payment (payer payer-entity payee
                  payee-entity amount)
  (step-with-rollback payer-entity
    (debit payer amount)
    (credit payer amount))
  (step payee-entity
    (credit payee amount)))
```

You can nest `defpact` calls.
However, the following restrictions apply:

- The number of steps in the child `defpact` must match the number of steps of the parent `defpact`.
- If a parent `defpact` step has the rollback field, so must the child.
- If a parent step rolls back, so do child steps.
- You must call the `continue` function with the same continuation arguments as the `defpact` originally dispatched to support multiple nested `defpact` calls to the same function but with different arguments.

The following example shows a well-formed `defpact` with an equal number of steps, nested rollbacks, and `continue` calls:

```pact
(defpact payment (payer payee amount)
  (step-with-rollback
    (debit payer amount)
    (credit payer amount))
  (step payee-entity
    (credit payee amount)))

...
(defpact split-payment (payer payee1 payee2 amount ratio)
  (step-with-rollback
    (let
      ((payment1 (payment payer payee1 (* amount ratio)))
      (payment2 (payment payer payee2 (* amount (- 1 ratio))))
      )
      "step 0 complete"
    )
    (let
      ((payment1 (continue (payment payer payee1 (* amount ratio))))
       (payment2 (continue (payment payer payee2 (* amount (- 1 ratio)))))
      )
      "step 0 rolled back"
    )
  )
  (step
    (let
      ((payment1 (continue (payment payer payee1 (* amount ratio))))
       (payment2 (continue (payment payer payee2 (* amount (- 1 ratio)))))
      )
      "step 1 complete"
    )
  )
)
```

## defschema

Use the `defschema` keyword to define a _schema_ of table `fields` with the specified `name`.
Each field in the schema takes the form of `fieldname[:fieldtype]`.

### Basic syntax

To define a schema, use the following syntax model:

```pact
(defschema name [doc-or-metadata] fields ...)
```

### Examples

The following example illustrates defining the `accounts` schema and an `accounts` table:

```pact
(defschema accounts
  "Schema for accounts table"
  balance:decimal
  amount:decimal
  ccy:string
  data)
```

## deftable

Use the `deftable` keyword to define a database _table_ with the specified `name`.
The name you specify is used in database functions to identify the table you want to work with.
Note the table must still be created with [create-table](/pact-5/database/create-table) function.

### Basic syntax

To define a table, use the following syntax model:

```pact
(deftable name[:schema] [doc-or-metadata])
```

### Examples

The following example illustrates defining a schema and an `accounts` table:

```pact
  (defschema account
    "Row type for accounts table."
     balance:decimal
     amount:decimal
     ccy:string
     rowguard:guard
     date:time
     data:object
     )

  (deftable accounts:{account}
    "Main table for accounts module.")
```

## do

Use the `do` keyword to evaluate a sequence of expressions and return the last one as the result.

### Basic syntax

To evaluate a sequence of expressions and return the last result, use the following syntax model:

```pact
(do (my-expression1) (my-expression2) (my-return-expression))
```

### Examples

```pact
pact> (do (print "hello world!") (+ 1 2) (+ 121 299))
"hello world!"
420
```

Notice how the return value is the last addition of `(+ 121 299)`.
The `do` keyword evaluates every expression supplied, so if any expression errors along the way, the subsequent expressions will never be evaluated.
For example:

```pact
pact> (do (enforce false "boom") (+ 1 2))
(interactive):1:4: boom
 1 | (do (enforce false "boom") (+ 1 2))
   |     ^^^^^^^^^^^^^^^^^^^^^^
```

## error

Use the `error` keyword to throw a recoverable error for a specified string expression.
This special form enables you to throw an error with a string return value that can be caught with a `try` expression.
The `error` form is particularly useful for typechecking expressions where an `(enforce false)` expression would not suffice because the return type for an `(enforce false)` expression is always boolean value.
With the `error` special form, you can force an error that satisfies any type signature. 
The `error` special form is also useful when you only want to implement specific parts of an interface.
For example, assume you have an interface defined as follows:

```pact
(interface implement-me
  (defun foo:integer ())
  (defun bar:decimal ())
)
```

If you only want to implement the `foo` function in your module, you can use the `error` special form like this:

```
(module implementor GOV
  (defcap GOV:unit () (error “non-upgradable”)
  (implements implement-me)
  (defun foo:integer () 123)
  (defun bar:decimal () (error “I do not want to implement this”)))
)
```

The `error` special form is essentially ⊥-elimination for Pact and is supported in Pact 5.3, and later.
 
### Basic syntax

To throw an error for the specified string `expression`, use the following syntax model:

```pact
(error expression)
```

### Examples

The following example illustrates using the `error` special form to force errors in a `.repl` file:

```pact
(begin-tx)
  (interface foo
    (defun f:integer (x:integer))
  )

  (module uses-error g
    (defcap g:bool () (error "not upgradable"))

    (defun f:integer (x:integer)
      (error "not-callable"))
    )
  
    (expect-failure "uses-error typechecks" "not-callable" (uses-error.f 1))
(commit-tx)

(begin-tx)
  (expect-failure "uses-error cannot acquire admin" "not upgradable" (acquire-module-admin uses-error))
(commit-tx)
```

You can execute the `error` test cases by running the following command:

```sh
pact error-special-form.repl --trace
```

The tests produce the following output:

```sh
error-special-form.repl:0:0-0:10:Trace: "Begin Tx 0"
error-special-form.repl:1:2-3:3:Trace: Loaded interface foo, hash oYo76TzdQMOX1LiyHOYqJRxBsVq4iq7PPXIUEoMj-Kg
error-special-form.repl:5:2-10:5:Trace: Loaded module uses-error, hash flArwZWZKnv3fGIF5JcnRv2AiQ8vz92n0LZ18Y_cQuU
error-special-form.repl:12:4-12:76:Trace: "Expect failure: Success: uses-error typechecks"
error-special-form.repl:13:0-13:11:Trace: "Commit Tx 0"
error-special-form.repl:15:0-15:10:Trace: "Begin Tx 1"
error-special-form.repl:16:2-16:103:Trace: "Expect failure: Success: uses-error cannot acquire admin"
error-special-form.repl:17:0-17:11:Trace: "Commit Tx 1"
Load successful
```

## implements

Use the `implements` keyword to specify that a module _implements_ the specified `interface`.
This keyword requires the module to implement all of the functions, defpacts, and capabilities that are specified in the interface with identical signatures, including the same argument names and declared types.

A module that implements an interface can be used as a [module reference](/smart-contracts/modules#module-references) for the specified interfaces.

<!--Note that [models](/reference/property-checking) declared for the implemented interface and its members will be appended to whatever models are declared within the implementing module. -->

### Basic syntax

To implement an interface in a module, use the following syntax model:

```pact
(implements interface)
```

## interface

Use the `interface` keyword to define and install an interface with the specified `name` and optional documentation or metadata.

The `body` of the interface is composed of definitions that will be scoped in the module.
Valid expressions in a module include the following:

- [defun](/reference/syntax#defun)
- [defconst](/reference/syntax#defconst)
- [defschema](/reference/syntax#defschema)
- [defpact](/reference/syntax#defpact)
- [defcap](/reference/syntax#defcap)
- [use](/reference/syntax#use)
<!--- [models](/reference/property-checking)-->

### Basic syntax

To define an interface, use the following syntax model:

```pact
(interface name [doc-or-metadata] body ...)
```

### Examples

The following example illustrates defining the `coin-sig` interface with documentation:

```pact
(interface coin-sig
  "'coin-sig' represents the Kadena Coin Contract interface. This contract     \
  \provides both the general interface for a Kadena's token, supplying a   \
  \transfer function, coinbase, account creation and balance query."
  (defun create-account:string (account:string guard:guard)
    @doc "Create an account for ACCOUNT, with GUARD controlling access to the  \
    \account."
    @model [ (property (not (= account ""))) ]
    )
  (defun transfer:string (sender:string receiver:string amount:decimal)
    @doc "Transfer AMOUNT between accounts SENDER and RECEIVER on the same    \
    \chain. This fails if either SENDER or RECEIVER does not exist.           \
    \Create-on-transfer can be done using the 'transfer-and-create' function."
    @model [ (property (> amount 0.0))
             (property (not (= sender receiver)))
           ]
    )
  (defun account-balance:decimal (account:string)
    @doc "Check an account's balance"
    @model [ (property (not (= account ""))) ]
    )
)
```

## let

Use the `let` keyword to bind variables in pairs to over the scope of the code body.
In Pact 4, `let` declarations didn't allow variables within bind-pairs to refer to previously-declared variables in the same declaration.
In Pact 4, you could use the `let*` form to enable variables to reference previously-declared variables in the same `let` declaration.
In Pact 5, the  `let*` keyword is deprecated and you can replace all `let*` declarations with `let` declarations.

### Basic syntax

To bind a variable to a value, use the following syntax model:

```pact
(let (bind-pair [bind-pair [...]]) body)
```

### Examples

The following example illustrates binding variables to values in a `let` declaration:

```pact
pact > (let ((x 2) (y 5)) (* x y))
10
```

The following example illustrates referencing a previously-declared variable in the same `let` declaration in Pact 5:

```pact
(let ((x 2) (y (* x 10)))
(+ x y))
22
```

## let\*

Use the `let*` keyword to bind variables in pairs over the scope of the code `body`.
In Pact 4, this form of the keyword enables variables to reference previously-declared variables in the same `let` declaration.
In Pact 5, this form is deprecated and you can replace all let* declarations with `let` declarations.

### Basic syntax

To bind a variable to a value, use the following syntax model:

```pact
(let* (bind-pair [bind-pair [...]]) body)
```

### Examples

The following example illustrates referencing a previously-declared variable in the same `let*` declaration:

```pact
(let* ((x 2) (y (* x 10)))
(+ x y))
22
```

## Metadata prefix (@)

As several examples demonstrate in this section, you can often embed optional documentation strings in code blocks that use reserved keywords like `defun` and `deftable` like this:

```pact
(defun average (a b)
  "take the average of a and b"
  (/ (+ a b) 2))
```

You can also add metadata by using the `@`-prefix.
Supported metadata fields include:

- `@doc` to provide a documentation string.
- `@event` to emit an event.
- `@managed` to manage specific data associated with a capability.
- `@model` to specify a property that can be checked for correctness in format verification.

```pact
(defun average (a b)
  @doc   "take the average of a and b"
  (/ (+ a b) 2))
```

Embedded documentation strings like `"Row type for accounts table."` are just a short form of `@doc` metadata.

## module

Use the `module` keyword to define and install a module with the specified `name` that is governed by the specified `keyset-or-governance`, with optional documentation or metadata.

If the `keyset-or-governance` is a string, the string represents a keyset that has been installed with the `define-keyset` function that will be checked whenever module administrative privileges are required.
If `keyset-or-governance` is an unqualified [atom](/reference/syntax#atoms), it represents a `defcap` capability that will be acquired if module administrative privileges are requested.

The body of a module is composed of definitions are scoped to the module.
A module can include the following types of declarations:

- [defun](/reference/syntax#defun)
- [defpact](/reference/syntax#defpact)
- [defcap](/reference/syntax#defcap)
- [deftable](/reference/syntax#deftable)
- [defschema](/reference/syntax#defschema)
- [defconst](/reference/syntax#defconst)
- [implements](/reference/syntax#implements)
- [use](/reference/syntax#use)
- [bless](/reference/syntax#bless)

### Basic syntax

To define a module, use the following syntax model:

```pact
(module name keyset-or-governance [doc-or-metadata] body...)
```

### Examples

The following example illustrates a defining the `accounts` module with a keyset and two functions:

```pact
(module accounts 'accounts-admin
  "Module for interacting with accounts"

  (defun create-account (id bal)
   "Create account ID with initial balance BAL"
   (insert accounts id { "balance": bal }))

  (defun transfer (from to amount)
   "Transfer AMOUNT from FROM to TO"
   (with-read accounts from { "balance": fbal }
    (enforce (<= amount fbal) "Insufficient funds")
     (with-read accounts to { "balance": tbal }
      (update accounts from { "balance": (- fbal amount) })
      (update accounts to { "balance": (+ tbal amount) }))))
)
```

## pure

Use the `pure` keyword to evaluate a specified `expression` in read-only mode. 
With this special form, the `expression` being evaluated cannot write to the database.

For example, the following code defines a function that calls a function in a downstream module to get account details:

```pact
  (defun details(account:string)
    @doc "Call the downstream module dependency to get account info"
    (my-dependency.get-account-details account)
  )
```

If this `my-dependency.get-account-details` function includes code that modifies its own database or calls back into the calling module, the function call could make the `details` function vulnerable to unexpected behavior or a reentry attack. 
However, if you modify the `details` function to use the `pure` special form, you can ensure that the `my-dependency.get-account-details account` call can't modify the Pact database:

```pact
  (defun details(account:string)
    @doc "Call the downstream module dependency to get account info"
    (pure (my-dependency.get-account-details account))
  )
```
With this code, the call to the downstream module expression—enclosed in (pure ..) statement—can't update any data in the calling module. 
If the downstream module function attempts to perform an operation that's not allowed, the operation will fail with a transaction-ending error.

### Basic syntax

To evaluate a specified `expression` without allowing database writes, use the following syntax model:

```pact
(pure expression)
```

### Examples

The following example demonstrates that the `pure` special form can be used to evaluate an expression, but can't be used to write to a database table:

```pact
(begin-tx)
(module read-only-test g
  (defcap g () true)

  (defschema sc a:integer b:string)
  (deftable tbl:{sc})

  (defcap ENFORCE_ME (a:integer) true)

  (defun write-entry (key:string a:integer b:string)
    (write tbl key {"a":a, "b":b})
  )

  (defun read-entry (key:string)
    (read tbl key)
  )

  (defun write-then-read (key:string a:integer b:string)
    (write-entry key a b)
    (read-entry key)
  )

  (defun errors-on-write (key:string a:integer b:string)
    (pure (write-then-read key a b))
    )
  )

(typecheck "read-only-test")

(create-table tbl)

(expect "Writes and reads work" {"a":1, "b":"v"} (write-then-read "key" 1 "v") )
(expect-failure "Writes do not work in read-only mode" (errors-on-write "key" 1 "v"))
(expect "Only reads work in read-only mode" {"a":1, "b":"v"} (pure (read-entry "key")))

(commit-tx)
```

You can execute the `pure` test cases by running `pact pure-special-form.repl --trace` to produce the following output:

```sh
pure-special-form.repl:0:0-0:10:Trace: "Begin Tx 0"
pure-special-form.repl:1:0-25:3:Trace: Loaded module read-only-test, hash 32oanTfcea9Wp4Haq5yj0Wk_rcGxzNbuHXOUkmJnVNE
pure-special-form.repl:27:0-27:28:Trace: Typechecking successful for module read-only-test
pure-special-form.repl:29:0-29:18:Trace: "TableCreated"
pure-special-form.repl:31:0-31:80:Trace: "Expect: success Writes and reads work"
pure-special-form.repl:32:0-32:85:Trace: "Expect failure: Success: Writes do not work in read-only mode"
pure-special-form.repl:33:0-33:87:Trace: "Expect: success Only reads work in read-only mode"
pure-special-form.repl:34:0-34:11:Trace: "Commit Tx 0"
Load successful
```

## step

Use the `step` keyword to define a step within a [defpact](/reference/syntax#defpact), such that any prior steps will be executed in prior transactions, and later steps in later transactions.
You can include an `entity` argument to indicate that a specific step is intended for confidential transactions. With this argument, only the specified `entity` would execute the step, and other participants would skip the execution of the step.

### Basic syntax

To define a step in a `defpact`, use the following syntax model:

```pact
(step expression)
(step entity expression)
```

### Examples

The following example illustrates a `defpact` for depositing funds with two `step` transactions:

```pact
  (defpact deposit(sender:string receiver:string guard:guard amount:decimal)
    @doc "Deposit KDA from L1 to L2"

    (step
      (with-capability (LOCK_DEPOSIT sender)
        (let ((deposit-details:object{deposit-schema}
            { 'receiver : receiver
            , 'amount   : amount
            , 'guard    : guard
            }
          ))
          (lock-deposit sender amount)
          (enforce (validate-principal guard receiver) "Guard must be a principal")
          (yield deposit-details "crossnet:L2.2")
        )
      )
    )

    (step
      (resume
        { 'receiver := receiver
        , 'amount   := amount
        , 'guard    := guard
        }
        (claim-deposit receiver guard amount)
      )
    )
  )
```

## step-with-rollback

Use the `step-with-rollback` keyword to define a step within a [defpact](/reference/syntax#defpact) similar to using the step keyword except that you specify a `rollback-expression`.
If you include an `entity` argument, the `rollback-expression` is only be executed upon failure of a subsequent step, as part of a reverse-sequence "rollback cascade" going back from the step that failed to the first step.
Without the `entity` argument, the `rollback-expression` acts as a cancel function that is be explicitly executed by a participant.

### Basic syntax

To define a step in a `defpact`, use the following syntax model:

```pact
(step-with-rollback expression rollback-expression)
(step-with-rollback entity expression rollback-expression)
```

### Examples

The following example illustrates a `defpact` for offering a token for sale with one `step-with-rollback`:

```pact
  (defpact sale:string
    ( id:string
      seller:string
      amount:decimal
      timeout:integer
    )
    (step-with-rollback
      ;; Step 0: offer
      (let ((token-info (get-token-info id)))
        (with-capability (OFFER-CALL id seller amount timeout (pact-id))
          (marmalade-v2.policy-manager.enforce-offer token-info seller amount timeout (pact-id)))
        (with-capability (SALE id seller amount timeout (pact-id))
          (offer id seller amount))
        (pact-id)
      )
      ;; Step 0, rollback: withdraw
      (let ((token-info (get-token-info id)))
        (with-capability (WITHDRAW-CALL id seller amount timeout (pact-id))
          (marmalade-v2.policy-manager.enforce-withdraw token-info seller amount timeout (pact-id)))
        (with-capability (WITHDRAW id seller amount timeout (pact-id))
          (withdraw id seller amount))
        (pact-id)
      )
    )
    (step
      ;; Step 1: buy
      (let ( (buyer:string (read-msg "buyer"))
              (buyer-guard:guard (read-msg "buyer-guard")) )
          (with-capability (BUY-CALL id seller buyer amount (pact-id))
            (marmalade-v2.policy-manager.enforce-buy (get-token-info id) seller buyer buyer-guard amount (pact-id))
          )
          (with-capability (BUY id seller buyer amount (pact-id))
            (buy id seller buyer buyer-guard amount)
          )
          (pact-id)
    ))
  )
```

## use

Use the `use` keyword to import the specified `module` into a namespace.
This keyword is only valid at the top-level of a contract or within a module declaration.
The specified `module` can be a string, symbol, or bare atom.

You specify the `hash` argument to validate that the imported module's hash matches specified `hash` and fail if the hashes are not the same.
You can use the [describe-module](/pact-5/database/describe-module) function to query for the hash of a loaded module on the chain.

You can also specify an optional list of `imports` consisting of function, constant, and schema names to import from the specified `module`.
If you explicitly define the function, constant, and schema names to import, only the listed items are available for you to use in the module body.
If you don't specify an import list, then every name in the imported module is brought into scope.
If two modules are defined in the same transaction, all names are in scope for both modules, and the import behavior defaults to the entire module.

### Basic syntax

To import a specified module, use the following syntax models:

```pact
(use module)
(use module hash)
(use module imports)
(use module hash imports)
```

### Examples

The following example illustrates importing all of the definitions from the `accounts` module and using the `transfer` function:

```pact
(use accounts)
(transfer "123" "456" 5 (time "2016-07-22T11:26:35Z"))
"Write succeeded"
```

The following example illustrates importing all of the definitions from a specific version of `accounts` module with the hash `"ToV3sYFMghd7AN1TFKdWk_w00HjUepVlqKL79ckHG_s"` and using the `transfer` function:

```pact
(use accounts "ToV3sYFMghd7AN1TFKdWk_w00HjUepVlqKL79ckHG_s")
(transfer "123" "456" 5 (time "2016-07-22T11:26:35Z"))
"Write succeeded"
```

The following example illustrates importing only the `transfer` and `example-fun` definitions from the `accounts` module and using the `transfer` function:

```pact
(use accounts [ transfer example-fun ])
(transfer "123" "456" 5 (time "2016-07-22T11:26:35Z"))
"Write succeeded"
```

The following example illustrates importing only the `transfer` and `example-fun` definitions from a specific version of `accounts` module with the hash `"ToV3sYFMghd7AN1TFKdWk_w00HjUepVlqKL79ckHG_s"` and using the `transfer` function:

```pact
(use accounts "ToV3sYFMghd7AN1TFKdWk_w00HjUepVlqKL79ckHG_s" [ transfer example-fun ])
(transfer "123" "456" 5 (time "2016-07-22T11:26:35Z"))
"Write succeeded"
```

## Expressions

Expressions can be literals, atoms, s-expressions, or references.

### Atoms

Atoms are non-reserved barewords that start with a letter or allowed symbol, and contain letters, digits, and allowed symbols.
Allowed symbols are `%#+-_&$@<>=?*!|/`.
Atoms must resolve to a variable bound by one of the following:

- [defun](/reference/syntax#defun) definition.
- [defpact](/reference/syntax#defpact) definition.
- [bindings](/reference/syntax#bindings) form.
- [lambda](/reference/syntax#lambdas) form.
- Symbols imported into the namespace with [use](/reference/syntax#use).

### S-expressions

S-expressions are formed with parentheses, with the first atom determining if the expression is a special form with a reserved keyword or a function application.
If the expression is a function application, the first atom must refer to a definition.

An application with less than the required arguments is in some contexts a valid _partial application_ of the function.
However, this is only supported in a limited number of Pact functions, such the `map`, `fold`, and `filter` functions.
With these functions, the list item can be appended to the application arguments to serially execute the function.

```pact
(map (+ 2) [1 2 3])
(fold (+) "" ["Concatenate" " " "me"])
```

Using a partial application with most functions results in a runtime error.

### References

References are multiple atoms joined by a dot `.` that directly resolve to definitions found in other modules.

```pact
pact > accounts.transfer
"(defun accounts.transfer (src,dest,amount,date) \"transfer AMOUNT from
SRC to DEST\")"
pact> transfer
Eval failure:
transfer<EOF>: Cannot resolve transfer
pact> (use 'accounts)
"Using \"accounts\""
pact> transfer
"(defun accounts.transfer (src,dest,amount,date) \"transfer AMOUNT from
SRC to DEST\")"
```

References are preferred over `use` for transactions because references resolve faster.
However, when defining a module, `use` is preferred for legibility.
