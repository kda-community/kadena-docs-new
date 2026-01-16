---
title: Capabilities
description: "Capabilities are the primary means by which you can grant granular permissions to perform tasks for which you wan to control access."
id: capabilities
sidebar_position: 8
---

# Capabilities

At a high level, Pact **capabilities** are a straightforward **access control model** for smart contracts.
With capabilities, you can define specific conditions to authorize specific actions for specific users.
Capabilities provide an explicit and transparent way to protect privileged operations, enforce rules before allowing transactions to execute, and ensure smart contract users authorize actions that are performed on their behalf.

Because capabilities are a core feature in the Pact smart contract programming language and powerful in how they enable you to manage permissions and resources, it's important to understand what they are, how they work, and how to define them correctly to achieve intended results.

## Permissions, resources, and events

Before getting into the details of how capabilities are defined, you should consider that there are three distinct—but related—use cases for capabilities.
You can define capabilities to do the following: 

- Authorize access to a specific privileged operation.
- Manage updates for a specific protected resource.
- Report events from operations executed in a transaction.

In the most common use case, you define capabilities to manage permissions by enforcing one or more conditions. 
In combination with guards, these permission-driven capabilities act as gatekeepers to grant access to smart contract functions if the user or contract that controls the guard allows the operation to continue.
In general, capabilities protect privileged operations—such as coin.transfer operations—that users must authorize by signing the transaction with their keys or verify in some other way.
However, as a contract author, you can define capabilities verify other conditions—such as the account balance or how long it's been since the last transfer operation—before granting the permission requested. 
If the permission isn't granted, the code where the capability is called won't be executed.

You can think of the capabilities that are used to manage permissions as **basic capabilities**.
For more information about defining, acquiring, and scoping basic capabilities, see [Expressing basic capabilities](#expressing-basic-capabilities)

In addition to permissions, you can use capabilities to manage values for specified resources.
Capabilities that manage resources are called **managed capabilities**. 
Managed capabilities have slightly different properties enable users or other contracts to set and update the value for a specified parameter.
As a contract author, you can define managed capabilities to allow **contract users** to manage a resource value, for example, to set a limit on the amount that can be transferred in a given transaction or to define the maximum supply of a resource.
For more information about defining and using managed capabilities, see [Managed capabilities](#managed-capabilities).

Capabilities can also emit events in transaction results.
For more information about using capabilities to emit events, see [Events](#events).

## Expressing basic capabilities

Basic capabilities enable you to manage permissions by specifying the conditions that allow access to a particular resource or contract function.
Therefore, in most cases, you define capabilities inside of the same module declaration as the functions that should use them.
Within the module declaration, you define capabilities by specifying the `defcap` reserved keyword and providing the following information:

- A capability _name_ that describes the permission to be acquired or the operation to be protected.
- Optional _parameters_ that specify input arguments, properties, or conditions for the capability.
- A _capability body_ with the predicate function that determines whether the capability is granted or rejected.  
  This predicate function is evaluated during capability acquisition.

The following example defines a basic `ALLOW_ENTRY` capability in a `registration` module:

```pact
(module registration GOVERNANCE
  (defcap GOVERNANCE () true)
  
  (defcap ALLOW_ENTRY (user-id:string)
    "Govern entry operation."
    (with-read users-table user-id
      { "guard" := guard, "active" := active }
      (enforce-guard guard)
      (enforce active "Only active users allowed entry"))
  )
)
```

In this example, the `defcap` declaration for the `ALLOW_ENTRY` capability consists of the following:

- `ALLOW_ENTRY` is the _name_ of the capability.

- `user-id` is a _parameter_ that is passed to the capability body to be evaluated.

- `with-read` is the _capability body_ that implements the predicate function.
  The capability body is evaluated when the `with-capability` function is called with a specific `user-id` parameter.
  For example, if the `user-id` is `bob`, the capability body is evaluated when `(with-capability (ALLOW_ENTRY "bob") ...)` is called.

In its simplest form, the capability body evaluates one or more conditions to determine whether the permission is granted.
If the conditions are met—without exiting or throwing an error—the capability is granted and operations continue.
In general, you should test all of the conditions you want to define in the `defcap` declaration using `enforce` statements, so that the permission won't be granted if any condition fails.

### Evaluating and granting permissions

The `defcap` declaration defines the conditions to evaluate to determine whether a permission should be granted (true) or rejected (false).
You use the `with-capability` built-in function whenever you want to check these conditions before allowing a user to perform a privileged operation.

For example, the following `entry` function calls the `with-capability` function to evaluate the `ALLOW_ENTRY` capability before executing two protected operations:

```pact
(defun entry (user-id:string)
  (with-capability (ALLOW_ENTRY user-id)
    (add-entry user-id)            ;; call a protected operation within the with-capability block
    (update-entry-status user-id)  ;; update a database within the with-capability block
  )
  (record-audit "ENTRY" user-id)   ;; call an unprotected operation outside of the with-capability block
)
```

As illustrated in this example, the capability applies to the protected operations inside of the  `with-capability` code block.
If the capability is granted, it remains in scope for all operations contained within the scope of the `with-capability` function.
In this example, the `ALLOW_ENTRY` capability remains in scope for the `add-entry` and `update-entry-status` functions.
After the code block containing the call to the `with-capability` function exits, the capability is no longer in scope.
In this example, the `ALLOW_ENTRY` capability is removed from scope before executing the `record-audit` function that's outside of the `with-capability` block.
Restricting the capability to the code contained within the `with-capability` block prevents duplicate testing of the predicate.
Capabilities that have already been acquired and that are currently in scope are not re-evaluated.

### Requiring a capability

The `with-capability` function enables smart contract users to attempt to acquire a specified capability that allows them to perform an operation within a limited scope.
The `require-capability` function requires smart contract users to have already been granted the specified capability before they can execute an operation.
The `require-capability` function doesn't evaluate the conditions to grant a capability.
If the required capability wasn't acquired in the context of another function, the function calling the `require-capability` function fails.

For example, you can require the `ALLOW_ENTRY` capability to have been acquired and currently in scope before executing the `add-entry` function like this:

```pact
(defun entry (user-id)
  (with-capability (ALLOW_ENTRY user-id)
    (add-entry user-id)            
    (update-entry-status user-id)
  )
  (record-audit "ENTRY" user-id)
)

(defun add-entry (user-id)
  (require-capability (ALLOW_ENTRY user-id)) ;; require a previously acquired capability
  ...
)
```

By requiring a capability, you can define private or restricted functions than cannot be called directly.
In this example, the `add-entry` function can only be called by code inside the module that grants the `ALLOW_ENTRY` capability and can only be called for this `user-id` in particular, restricting the function to that user.

However, it's important to note that the `require-capability` function doesn't scope to a body of code.
The position at which you insert it affects the semantics of the function call and the operations that happen first, before the capability requirement is applied.
If you insert the `require-capability` call at an inappropriate position, you might see unexpected behavior or error messages.
In general, you should insert the `require-capability` call at the beginning of a function call.

### Composing capabilities

A `defcap` declaration can also include other capabilities, for modular factoring of guard code or to compose an outer capability from smaller, inner capabilities.
For example, the following `ALLOW_ENTRY` capability declaration includes an inner capability—the DB_LOG capability—that's defined its own separate `defcap` declaration:

```pact
(defcap ALLOW_ENTRY (user-id:string)
  "Govern entry operation."
  (with-read users-table user-id
    { "guard" := guard, "active" := active }
    (enforce-guard guard)
    (enforce active "Only active users allowed entry")
    (compose-capability DB_LOG) ;; allow db logging while ALLOW_ENTRY is in scope
    )
)
(defcap DB_LOG () true)
```

Composed capabilities must be defined using `defcap` declarations in the same module as the parent capability and are only in scope when their parent capability is granted.

In many cases, you can use the `compose-capability` function to improve code logic with clear separation of concerns.
The following example illustrates separating the `transfer`, `debit`, and `credit` functions—and corresponding capabilities—so that `debit` is always called with a corresponding `credit` operation with the `TRANSFER` capability being a "no-guard" capability that simply encloses the `debit` and `credit` calls:

```pact
(defcap TRANSFER:bool (from:string to:string amount:decimal)
  (compose-capability (DEBIT from))
  (compose-capability (CREDIT to)))

(defcap DEBIT (from:string)
  (enforce-guard (at 'guard (read table from))))

(defcap CREDIT (to:string)
  (check-account-exists to))

(defun transfer (from:string to:string amount:decimal)
  (with-capability (TRANSFER from to amount)
    (debit from amount)
    (credit to amount)))

(defun debit (user amount)
  (require-capability (DEBIT user))
    (update accounts user ...))

(defun credit (user amount)
  (require-capability (CREDIT user)
    (update accounts user ...)))
```

In this example:

- The `TRANSFER` capability protects the `debit` and `credit` calls from being used independently.
- The `DEBIT` capability governs the ability to debit, enforcing the guard.
- The `CREDIT` simply creates a restricted capability for the `credit` function.

## Calling basic capabilities

To give you better insight into how to call capabilities, it's important to consider the concept of scope in Pact modules.
Potentially, there are several layers of scope that can you might need to navigate, including:

- Top-level scope
- Module scope
- Outer capability scope for composing capabilities
- Inner capability scope for composed capabilities
- Signature-based scope

You've seen an example of outer and inner capability scope in [Composing capabilities](#composing-capabilities).
However, it's equally important to know the difference between top-level scope and module scope for capabilities.

### Top-level scope

In Pact, the functions and expressions that you execute outside of a module declaration are often referred to as top-level expressions. 
Functions and expressions that are defined within a module declaration are within the scope of that module.
For example, top-level expressions can include direct calls to built-in functions like the following:

```pact
(+ 1 2)
(map (- 1) [10 20 30])
```

In addition, there are several top-level expressions that set context for a module that must be defined outside of the module declaration.
For example, you use top-level expressions to define and enter a namespace, define keysets, create tables, and read messages from transaction data.

```pact
;; Before module declaration

(define-namespace dev-namespace (read-keyset "user-account" ) (read-keyset "dev-ks-account" ))
(define-keyset "dev-namespace.dev-ks-account" (read-keyset "dev-ks-account" ))

;; Module declaration
(
    ...
)

;; After module declaration

(if (read-msg 'upgrade)
  ["upgrade"]
  [
    (create-table order-table)
  ]
)
```

### Module scope

The functions and expressions that are defined in a module declaration are included in the scope of that module.
For example, if you define the `awards` function in the `league` module declaration, the function is within the scope of the `league` module.

```pact
(module league GOVERNANCE 
  (defcap GOVERNANCE () true)
   (defun awards (tier:integer)
     (+ tier 2) 
   )
)
```

### Acquire a capability inside of a module

In most cases, capabilities are defined within the scope of a module and you can acquire the access token from within the body of any function defined in the module if you meet the conditions specified in the body of the `defcap` declaration.

```pact
(module league GOVERNANCE
  (defcap GOVERNANCE ()
    (enforce-keyset league_admin))
  (defcap LEAGUE_OPS ()
    ;; one or more conditions that must pass
  )

  (defun awards (tier:integer)
     (with-capability (LEAGUE_OPS) (+ tier 2)) ; operation succeeds if the conditions for LEAGUE_OPS are met     
  )
)
```

For example, you can acquire the `league.LEAGUE_OPS` capability by using the `with-capability` call in any function declaration or `defpact` step in the `league` module where the `LEAGUE_OPS` capability is declared.

```pact
(module league GOVERNANCE
  (defcap GOVERNANCE ()
    (enforce-keyset league_admin))
  (defcap LEAGUE_OPS ()
    ;; one or more conditions that must pass
  )

  (defun awards (tier:integer)
     (with-capability (LEAGUE_OPS) (+ tier 2)) ; operation succeeds if the conditions for LEAGUE_OPS are met     
  )
  
  (defpact transfer-portal ()
    (step (with-capability (LEAGUE_OPS) ... )) ; operation succeeds if the conditions for LEAGUE_OPS are met
    (step ...)
  )
)
```

These examples demonstrate the most common way you acquire the privileges associated with a capability is by calling the `with-capability` built-in function within a `defun` or `defpact` declaration inside of a module declaration.
If the conditions specified in the body of the capability declaration are met, permissions are granted and the operation proceeds.
The conditions you specify in the body of the capability declaration can vary, but typically enforce some type of guard or key signature.

You should also note that you can't acquire a capability inside of a capability declaration.
For example, if you try to acquire a capability in the body of a capability declaration, you'll see an error similar to the following:

```pact
"Loading league.pact..."
league.pact:13:7: with-capability form not allowed within defcap
 13 |       ((with-capability (LEAGUE_OPS) (* tier 2)))
    |        ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
```

### Acquire a capability outside of a module

You can acquire a capability in the top-level—that is, outside of the scope of a module—or within the scope of another module if, and only if, you have the administrative privileges to control the module and satisfy the conditions to acquire the capability.

The following example illustrates a module declaration for the `west-conf` module that defines a GOVERNANCE capability and an UMPIRE capability with conditions set to true to always succeed:

```pact
(module west-conf GOVERNANCE
  (defcap GOVERNANCE () true)
  (defcap UMPIRE () true)
  ...
)
```

If you deploy this module or load it into the Pact REPL, the GOVERNANCE capability grants you the administrative privileges for the transactions immediately following the deployment of the module.
For example, after you load the `west-conf` module in the Pact REPL, you can acquire the `UMPIRE` capability to perform an operation:

```pact
(with-capability (west-conf.UMPIRE) (* 3 8))
24
```

Because deploying a module grants you administrative privileges for the module, you can perform other privileged operations—like upgrading modules and creating tables—in the same deployment transaction. 
In this example, there are no conditions that must be met to acquire the `UMPIRE` capability.
If there were conditions to enforce in the body of the `defcap` declaration for the `UMPIRE` capability, those conditions would need to be satisfied to perform the requested operation.

The previous example demonstrates the principle of using module administrator privileges to bring a capability into scope.
However, this example doesn't represent a typical use-case. 
In most cases, you want to carefully control and restrict access to capabilities to prevent unintended privilege elevation. 
If access to the module administrator privileges is managed in any way—for example, owned by a specific keyset or guard or if a module is not upgradable—you must be able to acquire the module administrator rights to bring a capability into scope.

To acquire module administrator rights for testing purposes in the Pact REPL, you can use the [`env-module-admin`](/pact-5/repl/env-module-admin) and [`acquire-module-admin`](/pact-5/general/acquire-module-admin) built-in functions.

The following example demonstrates using the `acquire-module-admin` function to access module administrator rights for `module-test` to upgrade a module:

```pact
pact> (module west-conf GOVERNANCE (defcap GOVERNANCE () (enforce false "non-upgradable")))
Loaded module west-conf, hash v4XXlmt7RI-HVZvPb69lQhFbh8k-luKCtWtm4OVJVU8
pact> (begin-tx "Begin a new transaction after deployment")
"Begin Tx 0 Begin a new transaction after deployment"
pact> (use west-conf)
Loaded imports from west-conf
pact> (with-capability (GOVERNANCE) (* 3 8))
(interactive):1:51: non-upgradable
 1 |  (with-capability (GOVERNANCE) (* 3 8))
   |                                                    ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
  at(west-conf.GOVERNANCE.{v4XXlmt7RI-HVZvPb69lQhFbh8k-luKCtWtm4OVJVU8}):(interactive):0:1-0:39
pact> (acquire-module-admin west-conf)
"Module admin for module west-conf acquired"
pact> (with-capability (GOVERNANCE) (* 3 8))
24
```

To limit module administrator privileges for a capability to a specific transaction block, you can use the `env-module-admin` built-in function.

```pact
pact> (begin-tx "Get module admin privileges for a transaction")
"Begin Tx 1 Get module admin privileges for a transaction"
pact> (use west-conf)
Loaded imports from west-conf
pact> (with-capability (GOVERNANCE) (* 6 9))
(interactive):1:51: non-upgradable
 1 | (with-capability (GOVERNANCE) (* 6 9))
   |                                                    ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
pact> (env-module-admin west-conf)
"Acquired module admin for: west-conf"
pact> (with-capability (GOVERNANCE) (* 6 9))
54
```

## Managed capabilities

Most capabilities control permissions to access protected operations.
However, Pact also supports managed capabilities.
Managed capabilities provide an additional layer of security that requires all parties involved in a transaction to specify the actions they are authorizing with their signature or a guard.
By requiring a signature or guard to authorize an action, managed capabilities enable smart contract users to safely interact with otherwise untrusted code.

As a smart contract author, you specify that a capability is a managed capability by adding the `@managed` metadata tag in the `defcap` declaration body.
You can define managed capabilities to manage resources in two different ways:

- To update a specific resource dynamically through a **management function**. 
- To automatically update a resource **once** without using a management function.

Managed capabilities that use a management function can be called multiple times.
Managed capabilities that don't specify a management function can only be called once.  

### Using management functions

One of the most common use cases for managed capabilities with management functions is for transfer operations.
The following example illustrates this use case with the `TRANSFER` managed capability and the `TRANSFER_mgr` management function:

```pact
  (defcap TRANSFER:bool (sender:string receiver:string amount:decimal)
    @managed amount TRANSFER-mgr
    (enforce (!= sender receiver) "same sender and receiver")
    (enforce (> amount 0.0) "Positive amount")
    (compose-capability (DEBIT sender))
    (compose-capability (CREDIT receiver))
  )

  (defun TRANSFER-mgr:decimal (managed:decimal requested:decimal)
    (let ((newbal (- managed requested))) ;; update managed quantity for next time
      (enforce (>= newbal 0.0)            ;; check that the new balance doesn't exceed the managed quantity
        (format "TRANSFER exceeded for balance {}" [managed]))
      newbal)
  )
```

In this example, the `TRANSFER` capability allows the `sender` to approve any number of transfer operations to the `receiver` up to the _managed resource_ specified by the `@managed` keyword.
In this case, the resource is the `amount` value and the `TRANSFER_mgr` function checks and updates that resource value each time the `TRANSFER` capability is called for in the `transfer` function:

```pact
(defun transfer:string (sender:string receiver:string amount:decimal)
    (enforce (!= sender receiver) "sender cannot be the receiver of a transfer")
    (enforce (> amount 0.0) "transfer amount must be positive")

    (with-capability (TRANSFER sender receiver amount)
      (debit sender amount)
      (with-read coin-table receiver
        { "guard" := g }

        (credit receiver g amount))
    )
)
```

If transfer operations exceed the `amount` value, the `TRANSFER` capability can no longer be brought into scope.

Smart contract users set the values for the `transfer` operation and `TRANSFER` capability and approve the operation by signing for the capability when they send the transaction to the blockchain.
Typically, you allow smart contract users to set the transfer values and approve the operation through the frontend of a smart wallet or a similar application.
For example, as a smart contract author, you enable smart contract users to construct and submit transactions that set the `sender`, `receiver`, and `amount` parameters and sign for the `TRANSFER` capability when they call the `transfer` operation.
In the Pact REPL, you can emulate setting the keys in the environment data and signing the capability.
For example:

```pact
(env-data {"alice":["alice"], "bob":["bob"]})
(env-sigs [{"key":"alice", "caps":[(pistolas-coin.TRANSFER "alice" "bob" 50.0)]}])
(pistolas-coin.transfer "alice" "bob" 40.0)
```

You should note that managed capabilities always require smart contract users to explicitly approve the operation to be performed.
If a transaction includes a managed capability, all capabilities involved in the transaction require a signature. 
Unrestricted keys aren't allowed if a transaction includes a managed capability.

In most cases, managed resources represent decimal or integer values, but you can use managed capabilities and management functions to manage any type of resource.
For example, you could specify a list or an object as the resource you want to manage, then write a management function that removes names from the list or updates object properties based on some condition.
However, the `@managed` keyword only allows you to specify a single resource to be managed—that is, updated—by the management function.

### Single-use managed capabilities

Managed capabilities that specify a management function update the managed resource dynamically each time the requested capability is acquired.
If a managed capability doesn't specify a management function, the requested capability can only be called once in a transaction.
Further attempts will fail after the initial grant goes out of scope.

In the following example, the VOTE capability is automatically managed to ensure that a validated member can only vote once:

```pact
(defcap VOTE (member:string)
  @managed
  (validate-member member))
```

## Scoped signatures and verifiers

In Pact transaction messages, transaction signers can **scope** their signature to one or more specific capabilities.
By scoping signatures to specific capabilities, smart contract users can restrict guard operations based on that signature.
These explicitly-authorized actions are separate from the Pact code that's executed in the transaction.
Regardless of the code that runs during the transaction, scoped capabilities ensure that only authorized actions can be performed on the user's behalf.

Unlike managed capabilities that require a signature or a guard and a managed resource, most capabilities allow users to sign transactions using an unrestricted signing key.
Scoped capabilities provide a transparent way for transaction signers to safely call untrusted code.
For example, the `sender` of a transaction can explicitly sign for the `GAS` capability to authorize gas payments in the `coin` contract.
By scoping the signature to this capability, the account signature can't be used to access any other code that might be called by the transaction.

If a user authorizes a specific capability, the capability is attached to the signature list for the transaction.
For example, the following transaction excerpt attaches two capabilities—coin.TRANSFER and coin.GAS—to the public key "fe4b6da332193cce4d3bd1ebdc716a0e4c3954f265c5fddd6574518827f608b7" signature:

```json
{
    "signers": [
        {
            "pubKey": "fe4b6da332193cce4d3bd1ebdc716a0e4c3954f265c5fddd6574518827f608b7",
            "clist": [
            {
                "name": "coin.TRANSFER",
                "args": ["k:fe4b6da3...27f608b7" "k:4fe7981d...0bc284d0\",2]},
            {
                "name": "coin.GAS",
                "args":[]}
            ]
        }
    ]
}
```

The following example illustrates an `accounts` module with a `PAY` capability that isn't managed:

```pact
(begin-tx)
(module accounts GOVERNANCE
  (defcap GOVERNANCE ()
    (enforce false "NON-UPGRADABLE")
  )

  (defschema account
    balance:decimal
    account-guard:guard
  )
  (deftable accounts-table:{account})

  (defcap PAY (sender:string receiver:string amount:decimal)
    (enforce-guard (at 'account-guard (read accounts-table sender))))

  (defun pay (sender:string receiver:string amount:decimal)
    (with-capability (PAY sender receiver amount)
      (transfer sender receiver amount)))
  
  (defun transfer (sender:string receiver:string amount:decimal)
    (with-read accounts-table sender
      { "balance" := b}
      (with-read accounts-table receiver
        {"balance" := to-balance}
          (update accounts-table receiver {"balance":(+ to-balance amount)})
          (update accounts-table sender {"balance":(- b amount)})
      )
    )
  )
)
(create-table accounts-table)
(env-data {"alice":["alice"], "bob":["bob"]})
(write accounts-table "alice" {"balance":100.0, "account-guard":(read-keyset "alice")})
(write accounts-table "bob" {"balance":100.0, "account-guard":(read-keyset "bob")})
(commit-tx)
```

In the Pact REPL, you can attach the signature for the `alice` key to the `accounts.PAY` capability by using the `env-sigs` built-in function as follows:

```pact
(env-sigs [{"key": "alice", "caps": [(accounts.PAY "alice" "bob" 10.0)]}])
(accounts.pay "alice" "bob" 10.0) ;; works as the cap matches the signature caps
```

If you modify the scoped capability to use a different receiver or amount, the transaction returns a keyset failure.

```pact
(env-sigs [{"key": "alice", "caps": [(accounts.PAY "alice" "carol" 10.0)]}])
(accounts.pay "alice" "bob" 10.0)
```

For example:

```pact
cope-pay.repl:14:4: Keyset failure (keys-all): [alice...]
 14 |     (enforce-guard (at 'account-guard (read accounts-table sender))))
    |     ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
  at(accounts.PAY.{z5Kc3VKBgIr085VLRK2n1rMdlmIxi-NN-P7lYfA6xqg} "alice" "bob" 10.0):scope-pay.repl:16:4-17:40
  at(accounts.pay.{z5Kc3VKBgIr085VLRK2n1rMdlmIxi-NN-P7lYfA6xqg} "alice" "bob" 10.0):scope-pay.repl:40:0-40:33
```

Scoped capabilities can also be installed by [_verifier plug-ins_](https://github.com/kda-community/KIPs/pull/57).
Capabilities that are installed by verifier plug-ins are also scoped to the specific capabilities that they install.
Verifier plugins are external to Pact.
However, they are similar to signature capabilities in that they enable you to specify some type of trusted entity—for example, a signature or a generated proof—that grants the capabilities to perform some type of protected operation.
A signature capability can use the `(enforce-guard g)` function to check that the keyset guard `g` includes the signer's key.
A capability granted by a verifier plug-in can use the `(enforce-verifier 'name)` function to check that `"name"` is the name of the verifier plug-in.

## Events

In Pact, events are emitted as part of transaction execution and are included in the transaction results.
With events, you can monitor transaction results to determine if a specific operation occurred and prove the outcome using a simple payment verification proof.

Events are treated as capabilities because they share the following characteristics:

- Events, like capabilities, allow arbitrary data to be published under a topic or a name.
  With capabilities, the capability name is the topic, and the arguments are the data.
- Granting permission to acquire a managed capability is, in itself, an event recorded for transaction.
  Events complete the managed capability lifecycle, where you might install or approve a capability of some quantity on the way in, but not necessarily see what quantity was used.
  With events, the output of the acquired capability is present in the transaction results.
- Capabilities are protected such that they can only be acquired in module code, which is appropriate for events as well.

You can emit events for any basic capability by including the `@event` metadata tag in the `defcap` declaration.
For example:

```pact
(defcap BURN:decimal (qty:decimal)
  @event
  ...
)
```

If you include the `@event` metadata tag in the `defcap` declaration, the event is emitted any time that capability is successfully acquired.
Basic capabilities that aren't managed can emit events any number of times.

Managed capabilities emit events automatically without specifying the `@event` metadata tag.
The event for a managed capability is emitted once when the capability is first installed or acquired.
Events from managed capabilities include the parameters specified when the capability was installed or acquired.

You can use the [`env-events`](/pact-5/repl/env-events) built-in function to test for emitted events in `.repl` scripts.
