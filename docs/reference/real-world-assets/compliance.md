---
title: Compliance management
id: compliance
description: "Technical documentation for the compliance management interface used in the Kadena real world asset token standard."
sidebar_position: 6
---

# Compliance management

The `mvp-token` contract uses the `compliance-compatible-v1` interface to apply custom compliance rules to the token supply for tokens that represent physical assets or financial instruments that have specific compliance requirements.

The sample compliance contracts define the following compliance rules:

- Total token supply limit (`supply-limit-compliance-v1`).
- Maximum balance allowed for each investor (`max-balance-compliance-v1`).
- Maximum number of investors allowed (`max-investors-compliance-v1`).

Each sample compliance contract implements the [`compliance-v1`](https://github.com/kda-community/RWA-token/blob/main/contracts/compliance/compliance-v1.pact) interface.
The interface defines the core capabilities and function signatures for binding and unbinding tokens to the contract rules and the compliance checks required for different token operations.

## Capabilities

The `mvp-token` contract defines the following capabilities:

| Capability | Implementation&nbsp;required | Description |
| :--------- | :---------------------- | :---------- |
| COMPLIANCE-UPDATED | | Tracks updates to compliance settings.|
| COMPLIANCE-PARAMETERS | | Authorizes compliance parameter changes.|
| UPDATE-SUPPLY | | Tracks token supply changes.|
| SUPPLY | | Tracks token supply changes.|

## Functions

State-Changing
set-max-balance-per-investor: Sets the maximum balance for investors.
set-supply-limit: Sets the supply limit.
set-max-investors: Sets the maximum number of investors.
set-compliance: Updates the compliance module.
set-compliance-parameters: Updates compliance parameters.
Getters
compliance: Fetches the compliance modules registered for the token.
get-compliance-parameters: Retrieves compliance parameters used in the compliance modules.
max-balance-per-investor: Retrieves the maximum allowable balance for investors.
supply-limit: Retrieves the maximum supply limit.
max-investors: Retrieves the maximum number of investors allowed.
investor-count: Retrieves the current investor count.
supply: Returns the current supply of tokens.
Utilities
update-supply: Adjusts the token supply.
add-investor-count: Increments the investor count.
remove-investor-count: Decrements the investor count.
sort-compliance: Sorts compliance list in alphabetical order
validate-compliance-parameters: Validates compliance parameters at set-compliance-parameters
enforce-unique-compliance: Validates that no duplicate compliance contracts are in the compliance list.

## Functions

The `mvp-token` contract defines the following functions:

| Function | Implementation&nbsp;required | Description |
| :--------- | :---------------------- | :---------- |

## Real world asset interface

(interface compliance-v1
  (defcap TOKEN_BOUND:string (token:string)
    @doc "Event emitted when a token is bound to the compliance contract.")

  (defcap TOKEN_UNBOUND:string (token:string)
    @doc "Event emitted when a token is unbound from the compliance contract.")

  (defun bind-token:string (token:string)
    @doc "Bind a token to the compliance contract.")

  (defun unbind-token:string (token:string)
    @doc "Unbind a token from the compliance contract.")

  (defun is-token-bound:bool (token:string)
    @doc "Return true if the token is bound to the compliance contract.")

  (defun get-token-bound:string ()
    @doc "Return the token currently bound to the compliance contract.")

  (defun can-transfer:bool (token:string from:string to:string amount:decimal)
    @doc "Check if a token transfer from one address to another is compliant with the rules.")

  (defun can-mint:bool (token:string to:string amount:decimal)
    @doc "Check if a token mint to address is compliant with the rules.")

  (defun can-burn:bool (token:string from:string amount:decimal)
    @doc "Check if a token burn from address is compliant with the rules.")

  (defun transferred:bool (token:string from:string to:string amount:decimal)
    @doc "Update the contract state to record that a transfer has occurred.")

  (defun created:bool (token:string to:string amount:decimal)
    @doc "Update the contract state to record that tokens have been created (minted).")

  (defun destroyed:bool (token:string from:string amount:decimal)
    @doc "Update the contract state to record that tokens have been destroyed (burned).")
)