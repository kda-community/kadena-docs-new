---
title: Identity registry
description: "Technical reference for the Kadena RWA token standard identity registration interface."
id: identity-registry
sidebar_position: 4
---

# Identity registry

The `mvp-token` contract implements the [`identity-registry-v1`](https://github.com/kda-community/RWA-token/blob/main/contracts/registry/identity-registry-v1.pact) interface.
The interface defines the core capabilities and function signatures for managing investor identities. 
The `mvp-token` contract extends the `identity-registry-v1` interface by defining additional capabilities and functions to complement the core capabilities and function signatures.

## Capabilities

The `mvp-token` contract defines the following capabilities:

| Capability | Implementation&nbsp;required | Description |
| :--------- | :---------------------- | :---------- |
| CLAIM-TOPICS-REGISTRY-SET | `identity-registry-v1` | Event emitted when the claim topics registry is set for the Identity Registry (not used in the `mvp-token` contract).|
| COUNTRY-UPDATED | `identity-registry-v1` | Event emitted when the numeric country code for an identity is updated (not used in the `mvp-token` contract).|
| IDENTITY-REGISTERED | `identity-registry-v1` | Event emitted when an identity is registered in the identity registry.|
| IDENTITY-REGISTRY-ADDED | Not required. | Event emitted when an identity registry is added (not used in the `mvp-token` contract.)
| IDENTITY-REMOVED | `identity-registry-v1` | Event emitted when an identity is removed from the identity registry.|
| IDENTITY-UPDATED | `identity-registry-v1` | Event emitted when identity information is updated (not used in the mvp-token contract).|
| RECOVERY-SUCCESS | Not required. | Event emitted when the balance from a lost wallet address is successfully recovered.|
| TRUSTED-ISSUERS-REGISTRY-SET | `identity-registry-v1` | Event emitted when the trusted issuers registry is set for the Identity Registry (not used in the `mvp-token` contract).|

## Functions

The `mvp-token` contract defines the following functions:

| Function | Implementation&nbsp;required | Description |
| :--------- | :---------------------- | :---------- |
| batch-register-identity | `identity-registry-v1` | Registers identities for multiple users. |
| contains-identity | `identity-registry-v1` | Checks if a user address is associated with an identity. |
| delete-identity | `identity-registry-v1` | Removes a user's identity from the registry. |
| enforce-contains-identity | Not required. | Validates that a user address has a registered identity.|
| investor-country | `identity-registry-v1` | Returns the numeric country code for a specified investor address (not used in the `mvp-token` contract).|
| investor-identity | `identity-registry-v1` | Returns the `kadenaID` for a specified investor address (not used in the `mvp-token` contract). |
| is-verified | `identity-registry-v1` | Checks whether an identity contract corresponding to the specified investor address has the required claims, based on the data fetched from the trusted issuers registry and the claim topics registry (not used in the `mvp-token` contract). |
| issuers-registry | `identity-registry-v1` | Returns the trusted issuers registry linked to the current identity registry (not used in the `mvp-token` contract). |
| recovery-address | Not required. | Recovers tokens from a lost wallet address into a new wallet. |
| register-identity | `identity-registry-v1` | Registers an identity contract (`kadenaID`) that corresponds to an investor's wallet address. |
| register-identity-internal | Not required.| Provides internal logic—that's called by the contract rather than an agent or owner—to register an investor identity. |
| set-claim-topics-registry | `identity-registry-v1` | Replaces the claimTopicsRegistry contract with a new claim topics registry (not used in the `mvp-token` contract). |
| set-identity-registry | Not required. | (not used in the `mvp-token` contract). |
| set-trusted-issuers-registry | `identity-registry-v1` | Replaces the trustedIssuersRegistry contract with a new contract (not used in the `mvp-token` contract). |
| topics-registry | `identity-registry-v1` | Returns the claim topics registry linked to the current identity registry (not used in the `mvp-token` contract). |
| update-country | `identity-registry-v1` | Updates the numeric country code for a specified investor address (not used in the `mvp-token` contract). |
| update-identity | `identity-registry-v1`| Updates the identity contract that corresponds to a specified investor address (not used in the `mvp-token` contract). |

## Identity registry interface

The [identity registry](https://github.com/kda-community/RWA-token/blob/main/contracts/registry/identity-registry-v1.pact) interface describes the core capabilities and function signatures for registering and managing investor identities. 
The interface also includes foundational support for identity verification and integration with claim topics and trusted issuers registries.
At a minimum, the `mvp-token` contract must implement all of the capabilities and functions included in the interface.

### Event capabilities

- CLAIM-TOPICS-REGISTRY-SET: Event for the successful execution of a `set-claim-topics-registry` transaction.
- TRUSTED-ISSUERS-REGISTRY-SET: Event for the successful execution of a `set-trusted-issuers-registry` transaction.
- IDENTITY-REGISTERED: Event for the successful execution of a `register-identity` transaction.
- IDENTITY-REMOVED: Event for the successful execution of a `delete-identity` transaction.
- IDENTITY-UPDATED: Event for the successful execution of a `update-identity` transaction.
- COUNTRY-UPDATED: Event for the successful execution of a `update-country` transaction.

### State-changing functions

- `batch-register-identity`: Allows batch registration of multiple investor identities.
- `delete-identity`: Removes an investor identity from the identity registry.
- `register-identity`: Registers an identity contract (kadenaID) that corresponds to an investor address.
- `set-claim-topics-registry`: Replaces the claimTopicsRegistry contract with a new contract.
- `set-trusted-issuers-registry`: Replaces the actual trustedIssuersRegistry contract with a new contract.
- `update-country`: Updates the numeric country code for to a specified investor address.
- `update-identity`: Updates an identity contract that corresponds to a specified investor address.

### Utility functions

- `contains-identity`: Checks whether a wallet has an identity registered.
- `is-verified`: Checks whether an identity contract that corresponds to the specified investor address has the required claims, based on the data fetched from the trusted issuers registry and the claim topics registry.
- `investor-identity`: Returns the kadenaID for a specified investor address.
-  `investor-country`: Returns the numeric country code for a specified investor address.
- `issuers-registry`: Returns the trusted issuers registry linked to the current identity registry.
- `topics-registry`: Returns the claim topics registry linked to the current identity registry.
