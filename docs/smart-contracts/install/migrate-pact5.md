---
title: Migrating to Pact 5
id: migrating-to-pact5
sidebar_position: 4
description: "Update your development environment and smart contracts to use the Pact 5 smart contract language and command-line interpreter."
---

# Migrating to Pact 5

The Pact programming language was designed to optimize the transactional logic in smart contracts executed in a resource-constrained blockchain environment.
Pact 5 represents a comprehensive refactoring of the Pact language and command-line interpreter that offers improvements in efficiency, performance, and ergonomics.
The improvements in Pact 5 ensure lower transaction costs, faster module loading, and enhanced testing and debugging capabilities.
To take advantage of these improvements, you need to update your development environment and smart contracts to use Pact 5.
This article covers the basics of upgrading to Pact 5 and details some of the breaking changes that might require you to update and redeploy existing contracts or fix potential coding errors.

The timeline for migrating to Pact 5 looks like this:

- Chainweb nodes will be upgraded to Pact 5 with the `chainweb-node` 2.27 release on 29 January 2025.
- The Kadena main production network (`mainnet01`) will be upgraded to use Pact 5 on 10 February 2025.
- The Kadena test network (`testnet06`) will be upgraded to use Pact 5 on 6 February 2025.
- An interim test network (`testnet05`) is currently available for testing with Pact 5.
  The `testnet05` network will be decommissioned and removed from service on 7 February 2025 after the `testnet06` network is upgraded to use Pact 5.

## Preparing to migrate

Ideally, you should test any smart contracts you've written by installing Pact 5 locally before Pact 5 is released on the Kadena main production network.
If you install Pact 5 locally in your development environment, you can run all of your existing contract tests that you've defined in REPL files using the Pact 5 binary to verify that they work as expected.
For information about installing the Pact 5 binary locally, see [Installation and setup](/smart-contracts/install).

You can also test that existing smart contracts work with Pact 5 by deploying them on the Kadena `testnet05` network.
You can connect to the `testnet05` network by using the API node available at `api.testnet05.chainweb.com`.
For examples of how to deploy contracts, see the [Deploy smart contracts](/guides/contracts/howto-deploy-contracts) guide.

Pact 5 will also be deployed by default on the `development` network that you can run locally beginning with the `chainweb-node` 2.27 release. 
After `chainweb-node` 2.27 is released, you can start a local development node to build and test contracts using Pact 5 by default.

## After upgrading to Pact 5

Most smart contracts written in Pact 4, or earlier, should be compatible with Pact 5 and continue to operate as expected without any issues. 
However, some of the bugs that were found in earlier versions of Pact and corrected in the Pact 5 implementation might cause unexpected behavior in your contracts or require some type of modification to the contract code.

You can find details about new features and the types of issues you might encounter in the remainder of this document.

You don't need to redeploy any existing contracts to use Pact 5. 
However, redeploying will reduce the gas required to execute contract functions, because the newly-deployed version will use the Pact 5 on-disk format. 
Pact 5 includes a new built-in function for redeploying contracts, so you can take advantage of reduced transaction costs without modifying any contract code or module hashes.

## Semantic changes

Pact 5 includes some changes to correct previously allowed but unintended behavior. 
These changes might require you to modify your smart contract to conform to Pact 5 that enforces expected behavior.
Code examples illustrate the old behavior and how to modify your contract, if necessary.

### Duplicate capabilities cannot be installed

In Pact 4, you could install a managed capability with identical parameters multiple times and specify a different value for the managed parameter in each `install-capability` expression.
This behavior was not the way the `install-capability` was intended to be used.
Using the `install-capability` function in this way didn't introduce any security issues because you can't install a capability to override a managed parameter specified in a signature.
However, the code did result in unexpected behavior as illustrated in the following code sample:

```pact
(module m g
  (defcap g () true)

  (defun cap-mgr (a:integer b:integer)
    (let*
     ((remaining (- a b)))
     (enforce (>= remaining 0) "Remaining must be non-negative")
     b
     )
  )
  (defcap MANAGED (user:string amount:integer)
    @managed amount cap-mgr
    true
    )

  (defun managed-example (user:string amount:integer)
    (with-capability
      (MANAGED user amount)
      "The capability was acquired successfully!"
      )
  )
  )

(install-capability (MANAGED "stuart" 1))
(install-capability (MANAGED "stuart" 0))
(managed-example "stuart" 1)
```

As illustrated in this example, Pact 4 allows you to install the `MANAGED` capability twice, but it selects the lexicographically smallest managed parameter. 
In this case, because `0` comes before `1`, so the `(MANAGED "stuart" 0)` capability is selected instead of the `(MANAGED "stuart" 1)` capability, leading to the following output:

```pact
pact> (load "scratch/discreps/install-cap.repl" true)
"Loading scratch/discreps/install-cap.repl..."
"Loaded module m, hash oT9RPcfHZVhmCzHX3n51FKI0DC_Uwst06fqGQZu3hKI"
"Installed capability"
"Installed capability"
scratch/discreps/install-cap.repl:8:5:Error: Remaining must be non-negative
 at scratch/discreps/install-cap.repl:8:5: (enforce (native `>=`  True if X >= Y.  Type: x:<a[integer,... "Remaining must be non-negative")
 at scratch/discreps/install-cap.repl:5:2: (cap-mgr 0 1)
 at scratch/discreps/install-cap.repl:18:4: (with-capability (m.MANAGED "stuart" 1) ["The capability was acquired successfully!"])
 at scratch/discreps/install-cap.repl:27:0: (managed-example "stuart" 1)
```

Pact 5 does not allow installing duplicate capabilities, as shown below:

```pact
pact> (load "scratch/discreps/install-cap.repl" true)
"Loading scratch/discreps/install-cap.repl..."
Loaded module m, hash gY4DlgJg2XkK6LPH1H81M5EhPohOSz9yd_sucAcRF9w
"Installed capability"
scratch/discreps/install-cap.repl:26:0: Capability already installed: (m.MANAGED "stuart" 0)
 26 | (install-capability (MANAGED "stuart" 0))
    | ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

```

In most cases, you can correct this issue by simply deleting the invocation of `install-capability` in your smart contracts because most managed capabilities are signed for, and thus implicitly installed.

### Using install-capability is only supported for managed capabilities

In Pact 4, you can use the `install-capability` function with any capability, regardless of whether it is a managed capability. 
However, the sole purpose of this function is to track the value of a managed parameter.
Using this function with a capability that isn't a managed capability has no effect. 
The following code is a minimal reproduction:

```pact
(module m g
  (defcap g () true)
  (defcap UNMANAGED () 1)
  )

(install-capability (UNMANAGED))
```

If you execute this code in Pact 4, the output doesn't report this behavior as an error:

```pact
pact> (load "scratch/discreps/unmanaged-install.repl" true)
"Loading scratch/discreps/unmanaged-install.repl..."
"Loaded module m, hash hha21FQe4BjRLJ4L5mfHLTBE18QhKFyf-hXlEF21g_Y"
"Installed capability"
```

To prevent mistakes, Pact 5 is more strict, disallowing this behavior: 

```pact
pact> (load "scratch/discreps/unmanaged-install.repl" true)
"Loading scratch/discreps/unmanaged-install.repl..."
Loaded module m, hash E4C8JfW1e6rIThBWNDw3GON0COvPQVqm3ZXOWT80iCI
scratch/discreps/unmanaged-install.repl:7:0: Install capability error: capability is not managed and cannot be installed: m.UNMANAGED
 7 | (install-capability (UNMANAGED))
   | ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
```

### Acquiring module administrator privileges for operations

Pact requires module administrator privileges to be acquired before performing the following operations:

- Upgrading a module.
- Accessing or modifying a table.
- Acquiring capabilities using the `with-capability` function.

Pact 4 automatically attempts to acquire the module administrator privileges when executing these operations. 
To prevent contracts from accidentally executing privileged actions, Pact 5 no longer automatically acquires the module administrator privileges except in the case of upgrading a module. 
To acquire module administrator privileges explicitly, you can use the new `acquire-module-admin` built-in function,
This change makes security boundaries between modules much clearer.

For example, in the following contract code, the user Bob acquires module administrator privileges by writing directly to the table `foo` and gives himself a balance of `10000000000000` using Pact 4:

```pact
; Uncomment the line when running with Pact 4
; (env-exec-config ["DisablePact44"])
(begin-tx)
(env-data {"admin":{"keys":["some-key"], "pred":"keys-all"}})
(define-keyset "admin" (read-keyset "admin"))

(module m g
  (defcap g () (enforce-guard (keyset-ref-guard "admin")))

  (defschema fooschema user:string balance:integer)
  (deftable foo:{fooschema})
  )

(create-table foo)
(commit-tx)

(begin-tx)
(env-sigs [{"key":"some-key", "caps":[]}])
; Admin is being acquired here automatically
(write m.foo "bob" {"user":"bob", "balance":10000000000000})
(commit-tx)
```

In this example, the administrator privileges are granted implicitly for the transaction that contains the `write` function, and the result that gives Bob a balance of 10000000000000 coins might be difficult to spot. 
In Pact 5, Bob must explicitly acquire the administrative rights for the module.
For example:

```pact
(acquire-module-admin m)
(write m.foo "bob" {"user":"bob", "balance":10000000000000})
```

By acquiring the administrative rights before sending the `(write m.foo "bob" {"user":"bob", "balance":10000000000000})` transaction, it's clearer that the code is performing an administrative operation. 
Note that this change doesn't affect module deployment or upgrade transactions.
Module administrator privileges are requested automatically to redeploy a module.

### Module hashing

In Pact 4, the same contract code would always yield the same module hash. 
In Pact 5, a module’s hash is computed from both the module itself and the modules it depends on, increasing reliability and integrity. 
The following REPL script illustrates this: 

```pact
(begin-tx)

(module dependency g
  (defcap g () true)
  (defun f () 1)
)

(module m g 
  (defcap g () true)
  (defun use-dependency ()
    (f)
  )
)

(commit-tx)

(begin-tx)

(module dependency g
  (defcap g () true)
  (defun f () 2)
)

(module m g 
  (defcap g () true)
  (defun use-dependency ()
    (f)
  )
)

(commit-tx)
```

The output for this code in Pact 4 looks like this:

```pact
pact> (load "module-hashing.repl" true)
"Loading scratch/discreps/module-hashing.repl..."
"Begin Tx 0"
"Loaded module dependency, hash QVQ9B6vNg3TNBrLeDH2jR7geVvFGPPHd6OOXthb6k_k"
"Loaded module m, hash tyMLK_Kg71M2QSEHEJOZn8Q3x9KV_Wj0ldpkyTTwOEE"
"Commit Tx 0"
"Begin Tx 1"
"Loaded module dependency, hash zp3ZGRtmIeLSZnFsDuhqhsqJ3zcbnQ--R5wSjWCJJXA"
"Loaded module m, hash tyMLK_Kg71M2QSEHEJOZn8Q3x9KV_Wj0ldpkyTTwOEE"
"Commit Tx 1"
```

Notice that despite the change in the hash of `dependency`, the hash for the `m`  module doesn't change. 
This is no longer the case in Pact 5. 
In Pact 5, the output for this code looks like this:

```pact
pact> (load "module-hashing.repl" true)
"Loading scratch/discreps/module-hashing.repl..."
"Begin Tx 0"
Loaded module dependency, hash YTZXSZChVLwUJkpm3_dSzidkfVB14Y8smFf7x1CfukY
Loaded module m, hash 5BpfxcjVb4usVyuLg25bk821RL_u9raD8e76U2zfS3M
"Commit Tx 0"
"Begin Tx 1"
Loaded module dependency, hash L9gxBgNRNESJIqS0wZN3xDAcuRa1IC3-yNN03mtFttQ
Loaded module m, hash D45G9PizSn59QTRyUObLesCM9IEf_xrIM5OlpgQXxQg
"Commit Tx 1"
```

In the Pact 5 output, the hash for the `m` module reflects the change in the dependencies. 
This change is required for integrity, because otherwise, modules with the same hash can behave differently.

### Function names and variable identifiers

In Pact 4, it was possible to use variable identifiers with the same name as built-in functions. 
For example, in Pact 4, you can write a function like the following that uses `identity` as a variable identifier:

```pact
(defun register-identity:bool (user-address:string user-guard:guard identity:string country:integer)
   ...
)
```

However, `identity` is a reserved keyword for a built-in function.
In Pact 4, you are allowed to override or shadow the function name.
Pact 5 doesn't allow this behavior, and variables that use the same name as a built-in function resolve as the built-in function.
If you use any variable identifiers with the same name as a built-in function name, you should modify the variable identifier to use a different name if you want to redeploy the contract as a Pact 5 contract.

For a list of the reserved built-in function names, see [Function quick reference](/pact-5/func-quick-ref).
For a list of reserved keywords, see [Syntax and keywords](/reference/syntax).

### Integers returned as objects

In Pact 5, functions that return integer values return an object with `int` as the key field and a number as a string or a JSON number.
For example, you might see a return value similar to the following:

```pact
result: {status: "success", data: {int: 1}}
```

According to the Pact specification for encoding and decoding values, if you return a raw JSON number without the `int` field, the value is a double.
If a function returns an object with the `int` field and a number, the value is an integer.

In Pact 4, integer values that were returned as objects were silently converted to doubles in results.
The silent conversion of integers to doubles caused tests that were written to expect integer values to fail.

In Pact 5, values are returned as described by the Pact codec.
Integer values are always returned as objects `{int: X}` and raw JSON numbers are always interpreted as doubles.

## Changed or removed built-in functions

- `pact-version` was usable in the REPL and with the `/local` endpoint to determine the current Pact version. It was removed in Pact 5 due to time constraints.
- `enforce-pact-version` was usable in the REPL and with the `/local` endpoint to assert on the current Pact version. It was removed in Pact 5 due to time constraints.
- `list` was removed in Pact 5 after it was deprecated with a warning and increased gas costs in Pact 4. `(list 1 2 3)` is equivalent to `[1 2 3]`.
- `decrypt-cc20p1305` and `validate-keypair` have been removed in Pact 5 due to time constraints and lack of users.
- `constantly` has changed in Pact 5. It now accepts exactly two arguments, and behaves as if it were `(lambda (x y) x)`.
- `txlog` was removed in Pact 5 due to time constraints and lack of users.

## New built-in functions

The following functions are new in Pact 5.

- `do` is a new special form that you can use to sequence statements. For example:

  ```pact
  (do
    (enforce (= 1 2) "")
    (enforce (= 3 4) ""))
  ```

- `acquire-module-admin` is a new function that you can use to explicitly acquire module administrator privileges as described in [Acquiring module administrator privileges for operations](#acquiring-module-administrator-privileges-for-operations).

- `static-redeploy` is a new function that you can use to redeploy existing modules into their Pact 5 format, making them cheaper and faster to load, without changing the contract code or updating the contract dependencies.
   Note that the use of this function is not a privileged operation. 
   Anyone can do it to any module, and the module hash remains the same.

## Request and result interface

In general, Pact 4 and Pact 5 command requests and command results can be parsed successfully by the Pact 5 parser as follows:

- Existing Pact 4 command requests can be parsed as Pact 5 commands, and Pact 5 command requests can be parsed as Pact 4 commands.

- Pact 4 command results can be parsed as Pact 5 command results.

- Successful Pact 5 command results can be parsed as Pact 4 command results. 

- Pact 5 command results with errors are not valid Pact 4 command results because the error format has changed. 
  Errors in Pact 5 include both a textual description of the error, and a hexadecimal error code to distinguish the exact error case. 
  The `pact` executable in Pact 5 can explain these error codes using the `--explain-error-code` option, but they can lack some more specific information from the textual error message. 
  For example:

  ```bash
  > pact --explain-error-code 0x0000000000000000
  Encountered failure in: PELexerError, caused by: LexicalError
  ```

## Gas changes

Because the Pact interpreter has been structurally changed, Pact 5 has different gas costs than Pact 4.
Pact 5 also uses more precise methods to determine the gas costs for certain built-in functions. 

In practice, most functions require less gas when executed with Pact 5.
However, the only way to be sure your transactions don't exceed gas limits is to test them using Pact 5, either by running smart contracts on `testnet05`, or by executing functions locally in a Pact 5 REPL.

In addition to lower gas costs, Pact 5 is stricter in checking the signature used to buy gas.
In Pact 4, you could successfully sign for the `coin.GAS` capability even if you included extra arguments, such as `(coin.GAS "")` or `(coin.GAS 1)`. 
In Pact 5, you can only sign for the `coin.GAS` capability with `(coin.GAS)`.

## Formal verification

The Pact 4 formal verification system is tightly coupled to the internal implementation of Pact 4. 
Because Pact 5 is a complete re-implementation of the Pact language and command-line interpreter, Pact 5 doesn't support the Pact 4 formal verification system.
A new formal verification system compatible with Pact 5 isn't available at this time.
However, plans for improving or simplifying formal verification for Pact 5 contracts have been discussed and remain under consideration.

## Parser fixes

In Pact 4, parser bugs allowed some syntactically invalid code to be parsed. 
Executing this invalid code often caused unexpected behavior. 
This section describes the most common syntactic errors that were found on-chain that are now disallowed by Pact 5, and how to fix them.

### Let-expressions binding multiple expressions to the same variable

`(let ((x 1 (enforce false "boom"))) x)`

This is syntactically incorrect, as each let-bound variable can only bind one expression. 
In Pact 4, this code is parsed successfully, with the result that `(enforce false "boom")` is never evaluated.

### Invalid object types

`(defun f (a:object:{some-schema}) ...)` 

The correct syntax for object types is `object{schema}` where `schema` is a user-defined schema, not `object:{schema}`. 
In Pact 4, this will lead to errors at runtime when invoking `f`.

### Binding lists missing commas

In the following module, the expression `(with-read my-table "k" { "a" := a b := b} 1)` is missing a comma between the bindings of the `a` and `b` variables:

```pact
(module m g 
  (defcap g () true) 
  (defschema s a:integer) 
  (deftable my-table:{s}) 
  (defun f () (with-read my-table "k" { "a" := a b := b} a))
  )
```

To fix this issue, add the comma to the expression.
For example: 

```pact
{ "a" := a, "b' := b }
```

### Schemas are no longer allowed in terms

In Pact, a schema is essentially a type definition for an object type. 
The schema type itself is not a value. 
The following example is thus invalid:

```markdown
(module m g
  (defcap g () true)

  (defschema location city:string)

  (deftable locations:{location})

  (defun get-city(entry:string)
    (at "city" (read location entry))
    )
  )
```

In this example, the user intended to read the location at `entry` from the table `locations`, but instead wrote `location`, which is the schema. 
It’s not uncommon for a user to name a schema in a similar fashion as the table that holds object of that schema. 
In Pact 4, this code can be deployed, and leads to a hard-to-debug issue with a strange error message. 
In Pact 5, this code cannot be deployed at all.

Running the above code with Pact 4 results in the following output:

```pact
pact> (load "scratch/discreps/schemas-in-term.repl" true)
"Loading scratch/discreps/schemas-in-term.repl..."
"Loaded module m, hash 2SkSSD_LJqjZUSVxaqyXP7BYhP7Zl-D93awJPQeDHOM"
```

In Pact 5, the code output looks like this:

```pact
pact>(load "scratch/discreps/schemas-in-term.repl" true)
"Loading scratch/discreps/schemas-in-term.repl..."
scratch/discreps/schemas-in-term.repl:9:21: Invalid definition in term variable position: location
 9 |     (at "city" (read location entry))
   |                      ^^^^^^^^
```