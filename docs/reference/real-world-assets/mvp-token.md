---
title: mvp-token
description: "Technical documentation for the Kadena RWA token standard initial minimally-viable product (MVP) contract."
id: mvp-token
sidebar_position: 2
---

# mvp-token

The [`mvp-token`](https://github.com/kda-community/RWA-token/blob/main/mvp/mvp-token.pact) contract is an example of a real-world asset (RWA) token that can be configured with custom compliance rules for `mint`, `burn`, and `transfer` operations.

This sample contract implements Kadena RWA token standard interfaces that are defined in the following modules:

- [real-world-asset-v1](https://github.com/kda-community/RWA-token/blob/main/contracts/real-world-asset/real-world-asset-v1.pact)
- [agent-role-v1](https://github.com/kda-community/RWA-token/blob/main/contracts/roles/agent-role-v1.pact)
- [identity-registry-v1](https://github.com/kda-community/RWA-token/blob/main/contracts/roles/agent-role-v1.pact)
- [compliance-compatible-v1](https://github.com/kda-community/RWA-token/blob/main/mvp/compliances/compliance-compatible-v1.pact)

The `mvp-token` contract extends the functionality defined in the Kadena `fungible-v2` interface to demonstrate customized `mint`, `burn`, `transfer`, and `forced-transfer` operations for tokens.
The contract also provides `pause` and `freeze` functions to demonstrate restricting operations for an entire contract or specific investor accounts. 
In addition to the functions for managing tokens, the `mvp-token` contract implements agent roles to enforce transaction signature requirement and an identity registry to manage investor identities and account information. 
However, the contract doesn't implement identity verification.

Because the contract implements the `compliance-compatible-v1` interface, you can add one or more compliance contracts to customize the rules for `mint`, `burn`, abd `transfer` operations.
The `mvp-token` contract provides the following sample compliance contracts to demonstrate practical use cases:

- [max-balance-compliance-v1](https://github.com/kda-community/RWA-token/blob/main/mvp/compliances/max-balance-compliance-v1.pact)
- [max-investors-compliance-v1](https://github.com/kda-community/RWA-token/blob/main/mvp/compliances/max-investors-compliance-v1.pact)
- [supply-limit-compliance-v1](https://github.com/kda-community/RWA-token/blob/main/mvp/compliances/supply-limit-compliance-v1.pact)

## Governance

The `mvp-token` contract defines two types of owners:

| Type | Defined as | Description |
| :--- | :--------- | :---------- |
| Governance | `GOV-KEYSET` | Identifies the primary module owner responsible for contract upgrades and initialization. The `GOV` capability enforces ownership using `(enforce-keyset GOV-KEYSET)` statement. |
| Operational owner | `owner-guard` | Specifies the account registered during contract initialization and granted access to specific operational functions. You can update the `owner-guard` after registration by calling the `transfer-ownership` function. The operational owner is enforced by the `(only-agent "owner")` function. For more information about this function and other predefined roles, see [Agent roles](#agent-roles).|

## Initialization

Use `init` to initialize the `mvp-token` contract with the following information:

- Token owner-guard
- Token name
- Token symbol
- Token decimal precision
- Kadena on-chain identifier for the owner identity
- Compliance module references
- Paused state

### Requirements

The **signer** for an `init` transaction must be the `GOV-KEYSET` governance capability owner with the `GOV` capability.

### Input parameters

Use the following input parameters:

| Parameter | Type | Description |
| :-------- | :--- | :---------- |
| name | string | Name of the token being initialized.|
| symbol | string | Symbol to use for the token being initialized.|
| decimals | integer | Decimal precision for the token being initialized.|
| kadenaID | string | Optional placeholder identity for the owner of the token being initialized.|
| compliance | `[module{RWA.compliance-v1}]` | Compliance rules to apply for the token being initialized. |
| paused | bool | Initial state for the token being initialized. |
| owner-guard | guard | Guard for the identity that owns the token being initialized. |

### State changes

The `init` function makes the following state changes:

- Registers token metadata in the `token` table using the values you specify for the input parameters.
- Sets the paused state to true or false based on `paused` input parameter.
- Assigns owner guard to authorize operational control for the specified `owner-guard` input parameter.
- Initializes the specified `compliance` modules with default compliance parameters.

### Events

The `init` function emits the following events:

- UPDATED-TOKEN-INFORMATION with the parameters `name`, `symbol`, `MINIMUM-PRECISION`, `VERSION`, and `kadenaID`.
- COMPLIANCE-PARAMETERS with the default compliance parameters for the compliance modules applied to the token.
- COMPLIANCE-UPDATED with the list of compliance modules.

### Error codes

The `init` function reports the following errors:

- CMPL-DUP-001 if there are duplicate compliance modules in the input parameters.

## Transaction signatures and agent roles

In the `mvp-token` contract, many of the functions that enable you to control token transfers or manage identities require the transactions where they are called to be signed by a registered **agent** or token **owner**.
Some functions also require the agent or owner signing the transaction to have been assigned a specific role and be granted specific capabilities. 

- Use [`add-agent`](#add-agent) to register and assign one or more roles to the agent.
- Use [`remove-agent`](#remove-agent) to remove a previously register agent.

### Agent roles

You can assign the following roles to an agent:

- `agent-admin` grants administrative rights to enable an agent to sign transactions that execute protected functions.
- `freezer` grants an agent permission to pause and resume token transfer operations, to freeze and unfreeze specific investor addresses, and to freeze and unfreeze a specific number of tokens for specific addresses.
- `transfer-manager` grants an agent permission to mint, burn, and forcibly transfer tokens.

You assign roles as part of the transaction data when you submit a transaction request to perform a specific operation.

### Role enforcement

Roles are enforcement by calling the following functions:

- `only-agent` ensures that the caller signs the (ONLY-AGENT "agent-role") managed capability with a registered agent guard.
  The agent address is retrieved from the data field, rather than passed as a parameter.
  Note that the `owner` role—for example, (ONLY-AGENT "owner")—can only be added when calling the `init` or `transfer-ownership` function, can only be assigned to one address, and is retrieved directly from the table.

- `only-owner-or-agent-admin` ensures that the caller signs either as an agent with role `agent-admin` or as the `owner` role.

## add-agent

Use `add-agent` to add a new agent or reactivate an existing agent that's not currently active.

### Requirements

The **signer** for an `add-agent` transaction must be an agent with the `owner` role and capability `(ONLY-AGENT "owner")`.

Before calling the function, you should verify the following information:

- The `agent` name you intend to add doesn't already exist as an active agent account.
- The `agent` account is a valid **principal account**.
- The agent `roles` you intend to assign are valid roles that are defined in the contract.

### Input parameters

Use the following input parameters:

| Parameter | Type | Description |
| :-------- | :--- | :---------- |
| agent | string | Name of the agent being added.|
| guard | string | Guard for the agent you are adding.|
| roles | `[agent-role:string]` | One or more roles assigned to the agent you are adding and retrieved from the data field in the transaction. |

### State changes 

The `add-agent` function makes the following state changes:

- Adds the new agent with the specified agent roles to the registry.
- Reactivates the agent if the agent was previously deactivated.

### Events

The `add-agent` function emits the following events:

- ONLY-AGENT with the parameter `owner`.
- AGENT-ADDED with the parameters `agent` and `guard`.
- AGENT-ROLES-UPDATED with the parameters `agent` and `roles`.

### Error codes

The `add-agent` function reports the following errors:

- ACC-PRT-001 if the agent you're attempting to add isn't a principal account.
- ROL-STS-001 if the agent name you're attempting to add already exists and is currently active.
- ROL-STS-002 if the signer for the transaction isn't a valid active agent.
- ROL-STS-003 if the signer for the transaction doesn't have the required role.

## remove-agent

Use `remove-agent` to remove a specified agent from the registry.

### Requirements

The **signer** for a `remove-agent` transaction must be an agent with the `owner` role and capability `(ONLY-AGENT "owner")`.

In addition, the agent must be a registered identity.

### Input parameters

Use the following input parameters:

| Parameter | Type | Description |
| :-------- | :--- | :---------- |
| agent | string | Name of the agent being removed.|

### State changes 

The `remove-agent` function makes the following state change:

- Removes the specified agent from the registry.

### Events

The `remove-agent` function emits the following events:

- ONLY-AGENT with the parameter `owner`.
- AGENT-REMOVED with the parameter `agent`.
- AGENT-ROLES-UPDATED with the parameters `agent` and `roles`.

### Error codes

The `remove-agent` function reports the following errors:

- ROL-STS-002 if the signer for the transaction isn't a valid active agent.
- ROL-STS-003 if the signer for the transaction doesn't have the required role.

## pause

Use `pause` to pause transfer operations of the token until resumed.

### Requirements

The **signer** for a `pause` transaction must be an agent with the `freezer` role and capability `(ONLY-AGENT "freezer")`.
In addition, the current state for the token must be unpaused (paused false).

### Input parameters

Use the following input parameters:

| Parameter | Type | Description |
| :-------- | :--- | :---------- |
| agent | string | Name of the agent with the `freezer` role and retrieved from the data field for the transaction.|

### State changes

The `pause` function makes the following state change:

- Updates the contract's internal state to mark it as paused.

### Events

The `pause` function emits the following events:

- ONLY-AGENT "freezer" to indicate that an agent with the `freezer` role has been invoked.
- PAUSED to indicate that the `pause` transaction request was executed successfully.

### Error codes

The `pause` function reports the following errors:

- PAU-001 if the token is already in a paused state.
- ROL-STS-002 if the signer for the transaction isn't a valid active agent.
- ROL-STS-003 if the signer for the transaction doesn't have the required role.

## unpause

Use `unpause` to resume token transfer operations after being paused.

### Requirements

The **signer** for a `unpause` transaction must be an agent with the `freezer` role and capability `(ONLY-AGENT "freezer")`.
In addition, the current state for the token must be paused (paused true).

### Input parameters

Use the following input parameters:

| Parameter | Type | Description |
| :-------- | :--- | :---------- |
| agent | string | Name of the agent with the `freezer` role and retrieved from the data field for the transaction.|

### State changes

The `unpause` function makes the following state change:

- Updates the contract's internal state to mark it as unpaused.

### Events

The `unpause` function emits the following events:

- ONLY-AGENT "freezer" to indicate that an agent with the `freezer` role has been invoked.
- UNPAUSED to indicate that the `unpause` transaction request was executed successfully.

### Error codes

The `unpause` function reports the following errors:

- PAU-002 if the token is not in a paused state.
- ROL-STS-002 if the signer for the transaction isn't a valid active agent.
- ROL-STS-003 if the signer for the transaction doesn't have the required role.

## set-address-frozen

Use `set-address-freeze` to freeze or unfreeze a specific address, restricting or restoring its ability to interact with the token contract.

### Requirements

The **signer** for a `set-address-freeze` transaction must be an agent with the `freezer` role and capability `(ONLY-AGENT "freezer")`.
In addition:

- The current state for the address must unfrozen if using this function to freeze the specified address (freeze true).
- The current state for the address must frozen if using this function to unfreeze the specified address (freeze false).

### Input parameters

Use the following input parameters:

| Parameter | Type | Description |
| :-------- | :--- | :---------- |
| agent | string | Name of the agent with the `freezer` role and retrieved from the data field for the transaction.|
| investor-address | string | Address of the account to freeze or unfreeze.|
| freeze | bool | State you want to set for the specified address. Set to true to freeze the address or false to unfreeze the address.|

### State changes

The `set-address-freeze` function makes the following state changes:

- Updates the contract's internal state to mark the specified address as frozen if `freeze` is set to true.
- Updates the contract's internal state to mark the specified address as unfrozen if `freeze` is set to false.

### Events

The `set-address-freeze` function emits the following events:

- ONLY-AGENT "freezer"
- ADDRESS-FROZEN with the parameters `investor-address` and the `freeze` state.

### Error codes

The `set-address-freeze` function reports the following errors:

- ACC-FRZ-002 if you attempt to freeze an account that's already frozen or unfreeze an account that isn't currently frozen.
- ROL-STS-002 if the signer for the transaction isn't a valid active agent.
- ROL-STS-003 if the signer for the transaction doesn't have the required role.

## freeze-partial-tokens

Use `freeze-partial-tokens` to freeze a specific number of tokens in a specified account.
The frozen portion of tokens can't be accessed or transferred from the account.
Any remaining tokens in the account are available to transfer.

### Requirements

The **signer** for a `freeze-partial-tokens` transaction must be an agent with the `freezer` role and capability `(ONLY-AGENT "freezer")`.
In addition:
- The token `amount` must be a positive decimal value and a valid unit amount.
- The number of tokens specified by the `amount` parameter must not exceed the account holder's available balance.

### Input parameters

Use the following input parameters:

| Parameter | Type | Description |
| :-------- | :--- | :---------- |
| agent | string | Name of the agent with the `freezer` role and retrieved from the data field for the transaction.|
| investor-address | string | Address of the account holding the tokens you want to freeze a portion of. |
| amount | decimal | Number of tokens to lock to prevent them from being transferred from the specified account. |

### State changes 

The `freeze-partial-tokens` function makes the following state change:

- Locks the specified number of tokens held in specified address account to prevent them from being transferred.

### Events

The `freeze-partial-tokens` function emits the following events:

- ONLY-AGENT "freezer" to indicate that an agent with the `freezer` role has been invoked.
- TOKENS-FROZEN with the parameters `investor-address` and `amount`.

### Error codes

The `freeze-partial-tokens` function reports the following errors:

- FRZ-AMT-002 if the number of tokens specified by the `amount` parameter exceeds the account holder's available balance.
- FRZ-AMT-004 if the number of tokens specified by the `amount` parameter isn't a positive decimal value or a valid unit amount.
- ROL-STS-002 if the signer for the transaction isn't a valid active agent.
- ROL-STS-003 if the signer for the transaction doesn't have the required role.

## unfreeze-partial-tokens

Use `unfreeze-partial-tokens` to unlock a specific portion of frozen tokens in an account.

### Requirements

The **signer** for an `unfreeze-partial-tokens` transaction must be an agent with the `freezer` role and capability `(ONLY-AGENT "freezer")`.

In addition:

- The number of tokens specified by the `amount` parameter must be a positive decimal value and a valid unit amount.
- The number of tokens specified by the `amount` parameter must be less than or equal to the account holder's frozen token balance.

### Input parameters

Use the following input parameters:

| Parameter | Type | Description |
| :-------- | :--- | :---------- |
| agent | string | Name of the agent with the `freezer` role and retrieved from the data field for the transaction.|
| investor-address | string | Address of the account holding the tokens you want to unfreeze. |
| amount | decimal | Number of tokens to unlock for the specified account. |

### State changes 

The `unfreeze-partial-tokens` function makes the following state change:

- Unlocks the specified number of tokens to allow then to be transferred from the specified address.

### Events

The `unfreeze-partial-tokens` function emits the following events:

- ONLY-AGENT "freezer" to indicate that an agent with the `freezer` role has been invoked.
- TOKENS-UNFROZEN with the parameters `investor-address` and `amount`.

### Error codes

The `unfreeze-partial-tokens` function reports the following errors:

- FRZ-AMT-003 if the number of tokens specified by the `amount` parameter isn't less than or equal to the account holder's frozen token balance.
- FRZ-AMT-004 if the number of tokens specified by the `amount` parameter isn't a positive decimal value or a valid unit amount.
- ROL-STS-002 if the signer for the transaction isn't a valid active agent.
- ROL-STS-003 if the signer for the transaction doesn't have the required role.

## mint

Use `mint` to create new tokens and assign them to a specified account, increasing the total supply.

### Requirements

The **signer** for a `mint` transaction must be an agent with the `transfer-manager` role and capability `(ONLY-AGENT "transfer-manager")`.

In addition:

- The number of tokens specified by the `amount` parameter must be a positive decimal value and a valid unit amount.
- The account specified by the `to` parameter must be a registered identity with an address that isn't frozen.
- The `mint` operation must pass all of the checks that are defined by the registered compliance rules.

### Input parameters

Use the following input parameters:

| Parameter | Type | Description |
| :-------- | :--- | :---------- |
| agent | string| Name of the agent with the `transfer-manager` role and retrieved from the data field for the transaction.|
| to | string | Address of the account to receive the tokens. |
| amount | decimal | Number of tokens to transfer to the specified account. |

### State changes

The `mint` function makes the following state changes:

- Adds the specified `amount` number of tokens to the specified receiving address.
- Increases the total token supply.
- Increments the `investor-count` if the previous balance for the receiving account was 0.0.

### Events

The `mint` function emits the following events:

- ONLY-AGENT "transfer-manager" to indicate that an agent with the `transfer-manager` role has been invoked.
- TRANSFER with the parameter values for the `to` account and `amount` minted into the account.
- RECONCILE with the parameter values for the `amount` and the updated balance for the receiving account.
- SUPPLY with the parameter values for the new total token supply.

### Error codes

The `mint` function reports the following errors:

- ACC-FRZ-001 if the receiving account address is frozen.
- IDR-001 if the receiving account address isn't a registered identity. 
- ROL-STS-002 if the signer for the transaction isn't a valid active agent.
- ROL-STS-003 if the signer for the transaction doesn't have the required role.

## burn

Use `burn` to destroy tokens from a specified account, reducing the total supply.

### Requirements

The **signer** for a `burn` transaction must be an agent with the `transfer-manager` role and have the following capabilities:

- (ONLY-AGENT "transfer-manager")
- (TRANSFER investor-address "" amount)

Before calling the function, you should verify the following information for the account specified by the `investor-address` parameter:

- The `investor-address` account is a registered identity.
- The `investor-address` account address isn't frozen.
- The `investor-address` account has an unfrozen balance that's greater than the number of tokens specified for the `amount` parameter.

In addition:

- The number of tokens specified by the `amount` parameter must be a positive decimal value and a valid unit amount.
- The `burn` operation must pass all of the checks that are defined by the registered compliance rules.

### Input parameters

Use the following input parameters:

| Parameter | Type | Description |
| :-------- | :--- | :---------- |
| agent | string| Name of the agent with the `transfer-manager` role and retrieved from the data field for the transaction.|
| investor-address | string | Address of the account with the tokens to be burned. |
| amount | decimal | Number of tokens to burn for the specified account. |

### State changes

The `burn` function makes the following state changes:

- Deducts the specified `amount` number of tokens from the specified `investor-address` account.
- Decreases the total token supply.
- Decrements the `investor-count` if the `investor-address` account balance is 0.0.

### Events

The `burn` function emits the following events:

- ONLY-AGENT "transfer-manager" to indicate that an agent with the `transfer-manager` role has been invoked.
- TRANSFER with the parameter values for the `investor-address` account and `amount` burned.
- RECONCILE with the parameter values for the `amount` and the updated balance for the `investor-address` account.
- SUPPLY with the parameter values for the new total token supply.

### Error codes

The `burn` function reports the following errors:

- ACC-FRZ-001 if the `investor-address` account is frozen.
- ACC-AMT-001 if the unfrozen balance in the `investor-address` account isn't greater than the number of tokens specified for the `amount` parameter.
- ROL-STS-002 if the signer for the transaction isn't a valid active agent.
- ROL-STS-003 if the signer for the transaction doesn't have the required role.

## transfer

Use `transfer` to transfer tokens from one account to another.

### Requirements

The **signer** for a `transfer` transaction must be the account that holds the tokens to be transferred `from` and have the (TRANSFER from to amount) capability.

Before calling the function, you should verify the following information:

- The sender `from` account address isn't frozen.
- The sender `from` account has an unfrozen balance that's greater than the number of tokens specified for the `amount` parameter.
- The receiving `to` account is a registered identity.
- The receiving `to` account address isn't frozen.

In addition:

- The number of tokens specified by the `amount` parameter must be a positive decimal value and a valid unit amount.
- The `transfer` operation must pass all of the checks that are defined by the registered compliance rules.
- The token contract must not be paused.

### Input parameters

Use the following input parameters:

| Parameter | Type | Description |
| :-------- | :--- | :---------- |
| from | string | Name of the account holding the tokens to be transferred.|
| to | string | Name of the account to receive the tokens being transferred. |
| amount | decimal | Number of tokens to transfer from the sender to the receiving account. |

### State changes

The `transfer` function makes the following state changes:

- Transfers the specified `amount` from the sender `from` account to the receiving `to` account.
- Increments the `investor-count` if the previous balance for the receiving account was 0.0.
- Decrements the `investor-count` if the `from` account balance is 0.0 after executing the `transfer` operation.

### Events

The `transfer` function emits the following events:

- TRANSFER with the parameters `from`, `to`, and `amount`.
- RECONCILE with the parameters `amount`, `from-balance-change`, and `to-balance-change`.

### Error codes

The `transfer` function reports the following errors:

- TRF-CAP-001 if the capability required to execute a transfer can't be acquired.
- TRF-PAUSE-001 if the token contract is currently paused.

## forced-transfer

Use `forced-transfer` to forcibly transfer tokens from one account to another, bypassing standard transfer restrictions.

### Requirements

The **signer** for a `forced-transfer` transaction must be an agent with the `transfer-manager` role and have the following capabilities:

- (ONLY-AGENT "transfer-manager")
- (TRANSFER investor-address from to amount)

Before calling the function, you should verify the following information:

- The sender `from` account must have an account balance that's greater than the number of tokens specified for the `amount` parameter.
- The receiving `to` account must be a registered identity.
- The number of tokens specified by the `amount` parameter must be a positive decimal value and a valid unit amount.

### Input parameters

Use the following input parameters:

| Parameter | Type | Description |
| :-------- | :--- | :---------- |
| agent | string| Name of the agent with the `transfer-manager` role and retrieved from the data field for the transaction.|
| from | string | Name of the account holding the tokens to be transferred.|
| to | string | Name of the account to receive the tokens being transferred. |
| amount | decimal | Number of tokens to transfer from the sender to the receiving account. |

### State changes

The `forced-transfer` function makes the following state changes:

- Transfers the specified `amount` from the sender `from` account to the receiving `to` account.
- Unfreezes tokens in the sender `from` account if the available unfrozen token balance isn't enough to cover the specified `amount`, but the total account balance is greater than or equal to the specified `amount`.
- Increments the `investor-count` if the previous balance for the receiving account was 0.0.
- Decrements the `investor-count` if the `from` account balance is 0.0 after executing the `forced-transfer` operation.

### Events

The `forced-transfer` function emits the following events:

- ONLY-AGENT "transfer-manager" to indicate that an agent with the `transfer-manager` role has been invoked.
- TRANSFER with the parameters `from`, `to`, and `amount`.
- TOKENS-UNFROZEN to indicate that frozen tokens were required to execute the forced-transfer operation.
- RECONCILE with the parameters `amount` and the investor balance changes.

### Error codes

The `forced-transfer` function reports the following errors:

- FRZ-AMT-003 if the total number of tokens including the currently frozen tokens is insufficient to cover the specified `amount` parameter.
- FRZ-AMT-004 if the number of tokens specified by the `amount` parameter isn't a positive decimal value or a valid unit amount.
- TRF-PAUSE-001 if the token contract is currently paused.
- ROL-STS-002 if the signer for the transaction isn't a valid active agent.
- ROL-STS-003 if the signer for the transaction doesn't have the required role.

## register-identity

Use `register-identity` to register an identity contract that corresponds to an investor's wallet address and create an investor account in the `investors` table for the identity registered in the `identities` table.

### Requirements

The **signer** for a `register-identity` transaction must be an agent with the `admin` or `owner` role and capability `(ONLY-AGENT "admin")` or `(ONLY-AGENT "owner")`.

Before calling this function, you should verify the following information:

- The investor wallet address you are attempting to register is a valid **principal account**.
- The investor identity contract you are attempting to register must not already be active.

### Input parameters

Use the following input parameters:

| Parameter | Type | Description |
| :-------- | :--- | :---------- |
| agent | string | Name of the agent with the `agent-admin` or `owner` role and retrieved from the data field for the transaction. |
| investor-address | string | Address of the account you are adding to the identity registry. |
| investor-guard | string | Guard for the identity that you are adding to the identity registry. |
| investor-identity | string | Identity is the address of the identity contract stored as the kadenaID in the `identities` table for the specified investor address and guard. |
| country | integer | Numeric country code as defined in the ISO 3166-1 standard. |

### State changes

The `register-identity` function makes the following state changes:

- Adds the investor and identity information specified to the identity registry.
- Adds a token account for the investor if the investor account doesn't currently exist.

### Events

The `register-identity` function emits the following events:

- ONLY-AGENT "owner" to indicate that an agent with the `owner` role has been invoked.
- ONLY-AGENT "admin" to indicate that an agent with the `agent-admin` role has been invoked.
- IDENTITY-REGISTERED with the parameters `investor-address`, `investor-guard`, and `investor-identity`.

### Error codes

The `register-identity` function reports the following errors:

- IDR-003 if the identity contract you're attempt to register is already active.
- ACC-PRT-001 if the investor you're attempting to register isn't a valid principal account.
- ROL-STS-002 if the signer for the transaction isn't a valid active agent.
- ROL-STS-003 if the signer for the transaction doesn't have the required role.

## delete-identity

Use `delete-identity` to remove an investor identity from the identity registry.

### Requirements

The **signer** for a `delete-identity` transaction must be an agent with the `admin` or `owner` role and capability `(ONLY-AGENT "admin")` or `(ONLY-AGENT "owner")`.

Before calling this function, you should verify the following information:

- The investor address you are attempting to delete must exist in the identity registry.
- The investor token account must have a balance of 0.0.

### Input parameters

Use the following input parameters:

| Parameter | Type | Description |
| :-------- | :--- | :---------- |
| agent | string | Name of the agent with the `agent-admin` or `owner` role and retrieved from the data field for the transaction. |
| investor-address | string | Address of the account you are removing from the identity registry. | 

### State changes

The `delete-identity` function makes the following state change:

- Update the identity information in the registry as inactive.

### Events

The `delete-identity` function emits the following events:

- ONLY-AGENT "owner" to indicate that an agent with the `owner` role has been invoked.
- ONLY-AGENT "admin" to indicate that an agent with the `agent-admin` role has been invoked.
- IDENTITY-REMOVED wit the parameter `investor-address`.

### Error codes

The `delete-identity` function reports the following errors:

- IDR-002 if the account balance for the identity is greater than 0.0.
- ROL-STS-002 if the signer for the transaction isn't a valid active agent.
- ROL-STS-003 if the signer for the transaction doesn't have the required role.

## recovery-address

Use `recovery-address` to recover tokens from a lost wallet into a new wallet.

### Requirements

The **signer** for a `recovery-address` transaction must be an agent with the `admin` or `owner` role and capability `(ONLY-AGENT "admin")` or `(ONLY-AGENT "owner")`.

Before calling this function, you should verify the following information:

- The balance associated with the specified `lost-wallet` parameter must be greater than 0.0.
- The account you specify for the `new-wallet` parameter must be a registered identity.

### Input parameters

Use the following input parameters:

| Parameter | Type | Description |
| :-------- | :--- | :---------- |
| agent | string | Name of the agent with the `agent-admin` or `owner` role and retrieved from the data field for the transaction. |
| lost-wallet | string | Address of the investor wallet you are attempting to recover. |
| new-wallet | string | Address for the new identity you have registered for the investor.|
| investor-kadenaID | string | Address of the identity contract stored as the kadenaID in the `identities` table for the specified investor. |

### State changes

The `recovery-address` function makes the following state changes:

- Transfers the balance from the specified `lost-wallet` parameter to the specified `new-wallet` parameter by executing a `forced-transfer` operation.
- Freezes the `new-wallet` account if the `lost-wallet` account was frozen.
  If the `lost-wallet` account had a portion of tokens frozen, the same number of tokens are frozen in the `new-wallet` account.
- Deletes the identity information for the `lost-wallet` account from the identity registry.

### Events

The `recovery-address` function emits the following events:

- ONLY-AGENT "admin" to indicate that an agent with the `agent-admin` role has been invoked.
- TRANSFER with the parameters `lost-wallet`, `new-wallet`, and `balance`.
- RECONCILE with the parameters `balance`, `lost-wallet-balance-change`, and `new-wallet-balance-change`.
- RECOVERY-SUCCESS with the parameters `lost-wallet`. `new-wallet`, and `investor-kadenaID`.
- ADDRESS-FROZEN with the parameter `new-wallet` and true if `lost-wallet` was frozen and `new-wallet` is not frozen.
- IDENTITY-REMOVED with the parameters `investor-address` and `kadenaID`.

### Error codes

The `recovery-address` function reports the following errors:

- FRZ-AMT-002 if the number of frozen tokens exceeds the `new-wallet` balance.
- IDR-001 if the address isn't found in the identity registry.
- IDR-002 if the account balance for the identity is greater than 0.0.
- IDR-REC-001 if the `lost-wallet` balance isn't greater than 0.0.
- ROL-STS-002 if the signer for the transaction isn't a valid active agent.
- ROL-STS-003 if the signer for the transaction doesn't have the required role.

## set-compliance

Use `set-compliance` to specify one or more compliance contracts that you want to apply to the token.

### Requirements

The **signer** for a `set-compliance` transaction must be an agent with the `owner` role and capability `(ONLY-AGENT "owner")`.

Before calling this function, you should verify the following information:

- The compliance contracts implement the `RWA.compliance-v1` interface.
- The compliance list does not contain duplicate contracts.
- The compliance list must not be the same as current compliance list.

### Input parameters

Use the following input parameter:

| Parameter | Type | Description |
| :-------- | :--- | :---------- |
| compliance | list of modules | Compliance contract module names in the form of `[module{RWA.compliance-v1}]` |

### State changes

The `set-compliance` function makes the following state change:

- Assigns the list of compliance contracts to the token.

### Events

The `set-compliance` function emits the following events:

- ONLY-OWNER "owner" to indicate that an agent with the `owner` role has been invoked.
- COMPLIANCE-UPDATED with the new list of compliance contracts applied to the token.

### Error codes

The `set-compliance` function reports the following errors:

- GEN-IMPL-002 if an update to the compliance list fails.
- ROL-STS-002 if the signer for the transaction isn't a valid active agent.
- ROL-STS-003 if the signer for the transaction doesn't have the required role.

## set-compliance-parameters

Use `set-compliance-parameters` to set the following parameter values for the compliance contract:

- max-balance-per-investor
- supply-limit
- max-investors

You can disable enforcement for any compliance rule by setting the corresponding parameter to -1.

### Requirements

The **signer** for a `recovery-address` transaction must be an agent with the `admin` or `owner` role and capability `(ONLY-AGENT "admin")` or `(ONLY-AGENT "owner")`.

Before calling this function, you should verify the following information:

- The `max-balance-per-investor` value must be greater than 0.0 or disabled with a value of -1.
- The `supply-limit` value must be greater than the current supply or disabled with a value of -1.
- The `max-investors` value must be greater than the current investor count or disabled with a value of -1.

### Input parameters

Use the following input parameter:

| Parameter | Type | Description |
| :-------- | :--- | :---------- |
| agent | string | Name of the agent with the `agent-admin` or `owner` role and retrieved from the data field for the transaction. |
| compliance-parameters | object | Compliance contract input parameters and values, for example, `{"max-balance-per-investor":1000,"supply-limit":100000, "max-investors":-1}`.|

### State changes

The `set-compliance-parameters` function makes the following state change:

- Updates the compliance parameters with the input for the contract.

### Events

The `set-compliance-parameters` function emits the following events:

- ONLY-AGENT "owner" to indicate that an agent with the `owner` role has been invoked.
- ONLY-AGENT "admin" to indicate that an agent with the `agent-admin` role has been invoked.
- COMPLIANCE-PARAMETERS with the compliance parameter values.

### Error codes

The `set-compliance-parameters` function reports the following errors:

- CMPL-MBPI-001 if the maximum balance per investor is exceeded.
- CMPL-SL-001 if the supply limit is exceeded.
- CMPL-SL-003
- CMPL-MI-001 if the maximum number of investors is exceeded.
- CMPL-MI-004
- GEN-IMPL-002 if an update to any compliance parameter value fails.
- ROL-STS-002 if the signer for the transaction isn't a valid active agent.
- ROL-STS-003 if the signer for the transaction doesn't have the required role.
