---
title: Guard JSON representation
description: "This technical specification describes the JSON representation for different guards returned by the chain."
id: guard-json
sidebar_position: 5
---

# Guard JSON representation

In the technical specification for the guard types, the following types all correspond to JSON types:

- String
- Number
- Array[*]
- Bool
- Objects (`{"field":type}`)

## Keyset guards

The `keyset` guard is the backward-compatible `keyset` as originally defined in Pact.
This guard is also referred to as a **concrete keyset** that's defined in the environment.
Using the `keyset` type is the one instance where you can restrict a guard subtype.
For all other guards, the `guard` type obscures the implementation type to discourage you from using guard-specific control flow, which would be against best practices.
In general, you should use the `guard` type unless you have a specific need to use a keyset.

### Type definition

```json
{
    "keys": Array[String],
    "pred": String
}
```

### Examples

```json
{
  "admin-keyset": {
    "keys": [
      "58705e8699678bd15bbda2cf40fa236694895db614aafc82cf1c06c014ca963c"
    ],
    "pred": "keys-all"
  }
}
```

```pact
(define-keyset "admin-keyset" (read-keyset "admin-keyset"))
(enforce-guard (read-keyset "admin-keyset"))
```

### Principal account prefix

Each type of principal and guard uses a unique prefix, so they are easy to recognize.
If you use the `create-principal` function to a create principal account for a keyset guard, the principal account uses one of the following prefixes:

- k: for single key keysets
- w: for multiple keys keysets

## KeysetRef guard

You can install concrete keyset guards in the REPL environment by using the `define-keyset` function.
However, if you want to store a reference to a defined keyset, you must use a `string` type.
To make REPL environment keysets interoperate with concrete keysets and other guards, you can use the KeysetRef guard to indicate that a defined keyset is used instead of a concrete keyset.

### Type definition

```json
{
    "keysetref": {
        "ns": String?,
        "ksn": String
    }
}
```

### Examples

```pact
(enforce-guard (keyset-ref-guard "foo"))

(update accounts user { "guard": (keyset-ref-guard "foo") })
```

## User guard

User guards allow you to design an arbitrary predicate function to enforce the guard, given some initial data.
With user guards, you can implement any type custom predicate logic that can't be expressed by other built-in guard types.

For example, you might want to customize the guard to allow one of two different keysets to sign:

- One keyset registers the keys for the members of a board of directors.
- A second keyset registers the keys for union representatives.

You can then design a user guard to require two separate keysets to be enforced:

```pact
(defun both-sign (board union)
  (enforce-keyset board)
  (enforce-keyset union))

(defun install-both-guard ()
  (write guard-table "both"
    { "guard":
      (create-user-guard
        (both-sign (read-keyset "board) (read-keyset "union")))
    }))


(defun enforce-both-guard ()
  (enforce-guard (at "guard" (read guard-table "both"))))
```

User guards can be very flexible and powerful.
They can be stored in the database and passed around like plain data.
However, user guards are pure functions that don't allow access to a database during evaluation of the guard.

### Type definition

```json
{
    "fun": String,
    "args": Array[PactValue]
}
```

### Examples

The following example illustrates how to write a custom hash timelock guard to implement atomic swaps.

```pact

(create-hashlock-guard (secret-hash timeout signer-ks)
  (create-user-guard (enforce-hashlock secret-hash timeout signer-ks)))

(defun enforce-hashlock (secret-hash timeout signer-ks)
  (enforce-one [
    (enforce (= (hash (read-msg "secret")) secret-hash))
    (and
      (enforce-keyset signer-ks)
      (enforce (> (at "block-time" (chain-data)) timeout) "Timeout not passed"))
      ]))
```

### Principal account prefix

Each type of principal and guard uses a unique prefix, so they are easy to recognize.
If you use the `create-user-guard` function to create a principal account for a user guard, the principal account uses the following prefix:

- u: for user guards

## Capability guard

Capabilities are in-module rights that can only be enforced within the declaring module, and offer scoping and the other benefits.

Because user guards are required to be pure functions, they can't take database state into account.
If you need to access database state, you can define a guard that requires a capability to be brought into scope.
With this type of guard, you can retrieve database state when you bring the capability into scope.

### Type definition

```json
{
    "cgName": String,
    "cgArgs": Array[PactValue],
    "cgPactId": String?
}
```

For information about PactValue types, see Pact values.

## Principal account prefix

Each type of principal and guard uses a unique prefix, so they are easy to recognize.
If you use the `create-capability-guard` function to create a principal account for a capability guard, the principal account uses the following prefix:

- c: for capability guards

## Module guard (DEPRECATED)

Modules always guard access to the tables and functions that are defined within the module.
For example, when you create a table, you must specify a module name.
This requirement ensures that tables are fully encapsulated or _guarded_ by the module and that direct access to the table through [data-access functions](/pact-5/database) can only be authorized by the administrative owner of the module.
However, within module functions, table access is unconstrained.
This behavior gives you flexibility in designing data access, and ensures that the module is the main point of entry for all data-related interactions.

Within a module, only the module code or a transaction having module administrative privileges can write directly to a module table or upgrade the module.
Module guards aren't required to protect these in-module operations.

Instead, module guards are intended to allow a Pact module or smart contract to autonomously own or manage an asset outside of the module, for example, to own coins in an external ledger or manage assets in an internal ledger alongside other non-module owners.
If a module guard is enforced:

- The `enforce-guard` function must called from within the module.

  or

- Module governance must be granted to the current transaction.


For more information about module management, see [Governance](/smart-contracts/modules#module-governance).

### Type definition

```json
{
    "moduleName": ModuleName,
    "name": String
}
```

### Examples

The `create-module-guard` function takes a `string` argument to allow you to name the guard with text that indicates the purpose or role of the guard.

```pact
(enforce-guard (create-module-guard "module-owned-asset"))
```

## Pact guard (DEPRECATED)

Pact guards are a special guard that only pass if called in the specific `defpact` execution in which the guard was created.
Pact guards turn `defpact` executions into autonomous processes that can own assets, and is a powerful technique for trustless asset management within a multi-step operation.

### Type definition

```json
{
    "pactId": String,
    "name": String
}
```

### Examples

The following example illustrates the use of a `pact` guard for an escrow transaction modeled as a two-step `defpact` declaration.
In this example, the funds go into a account named after the `pact-id` identifier, guarded by a `pact` guard.
This means that only code in a subsequent step of that particular pact execution—that is, having the same `pact-id` as the previous—can satisfy the guard.

```pact
(defpact escrow (from to amount)
  (step (with-capability (ESCROW) (init-escrow from amount)))
  (step (with-capability (ESCROW) (complete-escrow to amount))))

(defun init-escrow (from amount)
  (require-capability (ESCROW))
  (create-account (pact-id) (create-pact-guard "escrow"))
  (transfer from (pact-id) amount))

(defun complete-escrow (to amount)
  (require-capability (ESCROW))
  (with-capability (USER_GUARD (pact-id)) ;; enforces guard on account (pact-id)
    (transfer (pact-id) to amount)))
```

## Union

```json
Union = Keyset | KeysetRef | UserGuard | CapabilityGuard | ModuleGuard | PactGuard
```

## Pact value literals

The following pseudo code provides type information for decoding Pact values returned by guards:

```json
Union PvLiteral = PvString | PvInteger | PvDecimal | PvBool

PvString = String

# You can treat an integer as a JSON number if it's between the range
# -9007199254740991 <= n && n <= 9007199254740991
# or as a string you need to decode an integer that exceeds the range:

PvInteger = {"int": (Number | String) }

# You can treat an integer as a JSON number if it's between the range
# -9007199254740991 <= n && n <= 9007199254740991
# or as a string you need to decode an integer that exceeds the range:

  The exact logic for how this happens is determined by the function, in pseudo:
    def encodeInteger (i:PactInteger) : {"int": (Number | String) } =
      let encodeInt(n:PactInteger) : Number | String =
            if -9007199254740991 <= n && n <= 9007199254740991 then encodeNumber else encodeString
      in return { "int": encodeInt(i) }

PvDecimal = Number | { "decimal":String }

# You can treat a decimal as a JSON number if it's between the range
# -9007199254740991 <= mantissa(i) && mantissa(i) <= 9007199254740991
# or as a string you need to decode an integer that exceeds the range:

  The exact logic for how this happens is determined by the function, in pseudo:
    def encodeDecimal (i:PactDecimal) : (Number | {"decimal": String }) =
      if -9007199254740991 <= mantissa(i) && mantissa(i) <= 9007199254740991 then
        return encodeNumber(i)
       else return { "decimal":encodeString(i) }

PvBool = Bool
```

## Pact value union types

The following pseudo code provides type information for decoding Pact values returned by recursive guards:

```json
Union PactValue = PvLiteral | PvList | PvGuard | PvObject | PvModRef | PvTime | PvCapToken

PvList = Array[PactValue]

PvGuard = Guard

PvObject = { f : PactValue | f in {String} }
// Fields can be any string, but their value is a pact value:

PvModRef = { "refName":String, "refSpec":Array[ModuleName])
// See # Misc type for module names

PvTime = { "time" : String } | { "timep" : String }
// There's specific formatting here depending on the UTC denom.
// See https://github.com/kda-community/pact/blob/e72d86749f5d65ac8d6e07a7652dd2ffb468607b/src/Pact/Types/Codec.hs#L150
// for further details.

PvCapToken = { "ctName":String, "ctArgs":Array[PactValue] }
// Only after pact 5:

ModuleName = { "name":String, "namespace":String? }
// Misc type
```