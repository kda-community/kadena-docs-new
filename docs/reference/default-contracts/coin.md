---
title: coin
description: "Reference information for the coin contracts deployed in the root namespace on all Kadena networks and chains." 
id: coin
---

# coin

The default [`coin`](https://github.com/kda-community/chainweb-node/blob/master/pact/coin-contract/v5/coin-v5.pact) module represents the native Kadena token contract.
The `coin` module provides the core functions, capabilities, and interfaces for managing gas operations,accounts information, and asset transfers in the Kadena blockchain account ledger.
The contract supports single chain and cross-chain transfers with functions for the following operations:

- Account creation
- Account and balance querying
- Asset transfers
- Buy and redeem gas for transactions
- Credit reconciliation for receiving accounts
- Debit reconciliation for sending accounts
- Miner payments
- Simple payment verification operations

You can access the `coin` contract and its functions in your own smart contract modules by using its fully-qualified name or by importing module functions with the `(use coin)` statement in the body of a module declaration.

The default `coin` contract provides the following functions for managing accounts and assets in the Kadena blockchain ledger.

| Function | Description |
| -------- | ----------- |
| buy-gas | |

## buy-gas

The `buy-gas` function is an internal function used in the `fund-tx` two-step (`defpact`) transaction.
The function provides the buying phase of the transaction that debits the sender account for the total gas and fee. 
At this point in the `fund-tx` transaction, a miner has been selected to perform the proof of work from the mining pool.
The `buy-gas` function validates the sender account and the gas limit (maximum gas) specified by the transaction sender.
The gas price is determined by the price of gas at the time the transaction is executed and the buy operation is executed before the code sent by the the sender is executed.

### Function signature

```pact
(defun buy-gas:string (sender:string total:decimal))
```

### Arguments

Use the following arguments when calling the `buy-gas` function.

| Argument | Type | Description |
| -------- | ---- | ----------- |
| sender | string | Specifies the account of the transaction sender.|
| total | decimal | Specifies the maximum gas limit specified by the transaction sender.|

### Examples

The following example illustrates calling the `buy-gas` function with hard-coded arguments if the GAS capability has been previously acquired:

```pact
(coin.buy-gas "k:58705e8699678bd15bbda2cf40fa236694895db614aafc82cf1c06c014ca963c" 10.5)
```

The following example illustrates the use of the `buy-gas` function as a `fund-tx` step:

```pact
  (defpact fund-tx (sender:string miner:string miner-guard:guard total:decimal)
    ...
    (step (buy-gas sender total))
    ...
  )
```
## check-reserved

The `check-reserved` function checks whether an account uses a reserved name. 
Reserved names start with a single character and a colon prefix.
The function returns the reserved name type if the account name uses a reserved name or an empty string. 
For example, if the account name uses the `c:` prefix, the `check-reserved` function returns `c` as the data type.

Reserved names use the following set of prefixes:

- k: for single key accounts
- w: for accounts with multiple keys
- u: for user guards
- c: for capability guards

### Function signature

```pact
(defun check-reserved:string (account:string))
```

### Arguments

Use the following argument to check whether an account uses a reserved name.

| Argument | Type | Description |
| -------- | ---- | ----------- |
| account | string | Specifies the key row account name to check. |

### Examples

The following example checks the account name for a single key account and returns `k` as the type:

```pact
(coin.check-reserved "k:58705e8699678bd15bbda2cf40fa236694895db614aafc82cf1c06c014ca963c")
```

The following example checks the account name for a multi-signature account and returns `w` as the type:

```pact
(coin.check-reserved "w:5HKwn7J9IqSwYU5ETqrDh7EgK43VQwMI0AQ11se7SLM:keys-any")
```

The following example checks the account name for a capability guard account and returns `c` as the type:

```pact
(coin.check-reserved "c:J1yaCWrdEbhKekMRhF5WjOgvzUayxTD24q7UWHwaa9I")
```

## coinbase

The `coinbase` function is an internal function used to create coins for any account and for paying miner rewards. 
This function can't be used outside of the `coin` contract.

### Function signature

```pact
(defun coinbase:string (account:string account-guard:guard amount:decimal))
```

### Arguments

Use the following arguments to specify miner account information.

| Argument | Type | Description |
| -------- | ---- | ----------- |
| account | string | Specifies the key row account name for a miner account.|
| account-guard | guard | Specifies the guard associated with the account.|
| amount | decimal | Specifies the amount to deposit in the specified account.|

### Examples

The following example illustrates calling the `coinbase` function with hard-coded arguments if the COINBASE capability has been previously acquired:

```pact
(coin.coinbase "sender00" (read-keyset "known-sender") 1.0)
```

The following example demonstrates creating an multi-signature account with coins in a `.repl` file:

```pact
(test-capability (COINBASE))
(env-data
 {
  "valencia-guard": {
      "keys": [
          "094d8c9abdb49029827f6c5ba14f8a240a2bc2496f17d5432bd485f750f7c66c",
          "1d5a5e10eb15355422ad66b6c12167bdbb23b1e1ef674ea032175d220b242ed4",
          "4fe7981d36997c2a327d0d3ce961d3ae0b2d38185ac5e5cd98ad90140bc284d0",
          "58705e8699678bd15bbda2cf40fa236694895db614aafc82cf1c06c014ca963c",
          "9a23bf6a61f753d3ffa45c02b33c65b9dc80b8fb63857debcfe21fdb170fcd99"
      ],
      "pred": "keys-any"
  }
 }
)
(coin.coinbase "valencia-hoa" (read-keyset "valencia-guard") 10.000000000001)
(coin.get-balance "valencia-hoa")
```

## create-account

The `create-account` function enables you to create a new account with a 0.0 balance in the `coin-table`.
However, the function doesn't create the account on a specific network or on a specific chain.
You must transfer funds to a specific network and chain to make the account usable in a specific context.
To create and fund a new account on a specific network and chain in a single transaction, use the `transfer-create` function.

### Function signature

```pact
(defun create-account:string (account:string guard:guard))
```

### Arguments

Use the following arguments to create a new account.

| Argument | Type | Description |
| -------- | ---- | ----------- |
| account | string | Specifies the name of the account of the transaction sender. For single-key accounts, the account name is typically the `k:` prefix followed by the public key for the account.|
| guard | guard | Specifies the guard to use for the account. For single-key accounts, the guard is typically a keyset. |

### Examples

The following example illustrates creating an account with the account name "test-admin-account" and a keyset definition for the guard:

```pact
(coin.create-account "test-admin-account" (read-keyset "admin"))
```

You should note that the account name becomes the key row identifier for the new account and that the key and predicate function for the keyset must be read from the environment or message data.
In most cases, single key account names consist of the `k:` prefix followed by the public key. 
For example:

```pact
(coin.create-account "k:58705e8699678bd15bbda2cf40fa236694895db614aafc82cf1c06c014ca963c" (read-keyset "admin"))
```

If you want to create an account with multiple signing keys, you must read a keyset with multiple keys.
For example, you might have a keyset like this:

```pact
{
    "valencia-guard": {
        "keys": [
            "094d8c9abdb49029827f6c5ba14f8a240a2bc2496f17d5432bd485f750f7c66c",
            "1d5a5e10eb15355422ad66b6c12167bdbb23b1e1ef674ea032175d220b242ed4",
            "4fe7981d36997c2a327d0d3ce961d3ae0b2d38185ac5e5cd98ad90140bc284d0",
            "58705e8699678bd15bbda2cf40fa236694895db614aafc82cf1c06c014ca963c",
            "9a23bf6a61f753d3ffa45c02b33c65b9dc80b8fb63857debcfe21fdb170fcd99"
        ],
        "pred": "keys-any"
    }
}
```

To create an account with a 0.0 balance for this set of keys and the `keys-any` predicate, you could call the `create-account` function like this:

```pact
(coin.create-account "valencia-hoa" (read-keyset "valencia-guard"))
```
## create-allocation-account

The `create-allocation-account` function is a legacy function that requires the GENESIS capability.
This function adds an entry to the coin allocation table and creates a corresponding empty coin contract account of the same name and guard.

## credit

The `credit` function is a protected function that requires the CREDIT capability to be in scope to credit a specified amount to a specified account balance.
You can only call the `credit` function in the context of other functions, such as the `transfer` and `redeem-gas` functions, that bring the CREDIT capability into scope.

### Function signature

```pact
(defun credit:string (account:string guard:guard amount:decimal))
```

### Arguments

Use the following arguments to credit an amount to an account balance.

| Argument | Type | Description |
| -------- | ---- | ----------- |
| account | string | Specifies the key row account name to receive the credit. |
| guard | guard | Specifies the guard defined for the account. For single-key accounts, the guard is typically a keyset. |
| amount | decimal | Specifies the amount to credit to the balance for the specified account.|

### Examples

The following example illustrates calling the `credit` function in the Pact REPL by manually granting the CREDIT capability:

```pact
(test-capability (CREDIT "k:58705e8699678bd15bbda2cf40fa236694895db614aafc82cf1c06c014ca963c"))
(coin.credit "k:58705e8699678bd15bbda2cf40fa236694895db614aafc82cf1c06c014ca963c" (read-keyset "admin") 1.0)
(coin.get-balance "k:58705e8699678bd15bbda2cf40fa236694895db614aafc82cf1c06c014ca963c")
```

## debit

The `debit` function AMOUNT from ACCOUNT balance

## details

The `details` function enables you to look up account details for a specific account.

### Function signature

```pact
(defun details:object{fungible-v2.account-details} (account:string ))
```

### Arguments

Use the following argument to look up account details.

| Argument | Type | Description |
| -------- | ---- | ----------- |
| account | string | Specifies the key row account name for the account you want to view details for. |

### Examples

The following example illustrates looking up information for a single-key account that uses the `k:` prefix:

```pact
(coin.details "k:58705e8699678bd15bbda2cf40fa236694895db614aafc82cf1c06c014ca963c")
```

The function returns the account name, balance, and guard stored in the `coin-table` for the specified account:

```pact
{"account": "k:58705e8699678bd15bbda2cf40fa236694895db614aafc82cf1c06c014ca963c","balance": 10.000000000001,"guard": KeySet {keys: [ 58705e8699678bd15bbda2cf40fa236694895db614aafc82cf1c06c014ca963c ]
,pred: keys-all}}
```

The following example illustrates looking up information for the "valencia-hoa" account:

```pact
(coin.details "valencia-hoa")
```

In this example, the account has multiple keys and returns information similar to the following:

```pact
{"account": "valencia-hoa","balance": 10.000000000001,"guard": KeySet {keys: [ 
    094d8c9a...50f7c66c, 
    1d5a5e10...0b242ed4,
    4fe7981d...0bc284d0,
    58705e86...14ca963c,
    9a23bf6a...170fcd99 ]
  ,pred: keys-any}
}
```

## enforce-reserved

The `enforce-reserved` function enforces Enforce reserved account name protocols.

## enforce-unit

The `enforce-unit` utility function enforces the minimum precision allowed for coin transactions.

### Function signature

```pact
(defun enforce-unit:bool (amount:decimal))
```

### Arguments

Use the following argument to enforce the number of decimal places allowed for precision in coin transactions.

| Argument | Type | Description |
| -------- | ---- | ----------- |
| amount | decimal | Specifies the unit precision for coin contract transactions. |

## fund-tx

The `fund-tx` two-step function defines a `defpact` to fund a transaction in two steps, with the actual transaction occurring in the middle: 

1) A buying phase, debiting the sender for total gas and fee, yielding TX_MAX_CHARGE. 
2) A settlement phase, resuming TX_MAX_CHARGE, and allocating to the coinbase account for used gas and fee, and sender account for bal- ance (unused gas, if any).

## gas-guard

The `gas-guard` function is a predicate function used to ensure that a single key keyset guard or the GAS capability is enforced for gas buying and redemption operations.

### Function signature

```pact
(defun gas-guard (guard:guard))
```

### Arguments

Use the following argument to specify a gas guard.

| Argument | Type | Description |
| -------- | ---- | ----------- |
| guard | guard | Specifies the guard of gas-related operations. |


## gas-only
Predicate for gas-only user guards.

## get-balance



## precision

## redeem-gas

The `redeem-gas` function is an internal function used in the `fund-tx` two-step (`defpact`) transaction.
The function provides the settlement phase of the transaction that determines the final transaction fee and allocates adjustments to the coinbase account for the gas used and fee, and to the sender account for the balance of any unused gas.

At this point, the sender's transaction has been executed, and the gas that was charged has been calculated. 
The miner account receives credit for the gas consumed, and the sender account receives credit for any remaining gas not used in processing the transaction up to the limit specified in the `buy-gas` operation.

## release-allocation

Release funds associated with allocation ACCOUNT into main ledger. ACCOUNT must already exist in main ledger. Allocation is deactivated after release.

## remediate
Allows for remediation transactions. This function is protected by the REMEDIATE capability

## rotate

## transfer

## transfer-create



## transfer-crosschain






## validate-account

The `validate-account` utility function enforce that an account name uses the Latin-1 character set and conforms to the coin contract minimum and maximum length requirements.

### Function signature

```pact
(defun validate-account (account:string))
```

### Arguments

Use the following argument to validate an account name.

| Argument | Type | Description |
| -------- | ---- | ----------- |
| account | string | Specifies the account name to validate.|

## Capabilities

The default `coin` module defines the following capabilities:

| Capability | Description |
| ---------- | ----------- |
| COINBASE | Guards miner rewards. |
| CREDIT | Manages account crediting operations. |
| DEBIT | Manages account debiting operations.|
| GAS | Guards the gas buy and redeem operations. |
| GENESIS | Constrains genesis transactions. |
| GOVERNANCE | Module governance capability that prevents the coin contract from being upgraded. |
| RELEASE_ALLOCATION | Event that records an allocation release for signature scoping. |
| REMEDIATE | Manages remediation transactions. |
| ROTATE | Autonomously managed capability that enables guard rotation.|
| TRANSFER | Managed capability that controls the resources transferred from a sender to a receiver on the same chain through the `TRANSFER-mgr` management function.|
| TRANSFER_XCHAIN | Managed capability that controls the resources transferred from a sender to a receiver on different chain through the `TRANSFER_XCHAIN-mgr` management function.|
| TRANSFER_XCHAIN_RECD | Event that records the details of a cross-chain transfer.|

## Constants

The default `coin` module defines the following constant variable values:

| Constant | Value | Description |
| -------- | ----- | ----------- |
| COIN_CHARSET | Latin-1 (ISO 8859-1) | The default coin contract character set. |
| MINIMUM_PRECISION | 12 | Minimum allowed precision for coin transactions.|
| MINIMUM_ACCOUNT_LENGTH | 3 | Minimum number of characters required for an account name for it to be a valid coin account name.|
| MAXIMUM_ACCOUNT_LENGTH | 256| Maximum number of characters allowed for an account name for it to be a valid coin account name.|
| VALID_CHAIN_IDS | (map (int-to-str 10) (enumerate 0 19)) | List of all valid Chainweb chain identifiers.|