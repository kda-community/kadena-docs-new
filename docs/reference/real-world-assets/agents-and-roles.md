---
title: Agents and roles
description: "Technical documentation for the Kadena RWA token standard initial minimally-viable product (MVP) contract."
id: agents-and-roles
sidebar_position: 3
---

# Agents and roles

The `mvp-token` contract implements the [`agent-role-v1`](https://github.com/kda-community/RWA-token/blob/main/contracts/roles/agent-role-v1.pact) interface.
The interface defines the core capabilities and function signatures for adding and managing agents that have permission to perform protected contract operations. 
The `mvp-token` contract extends the `agent-role-v1` interface by defining additional capabilities and functions to complement the core capabilities and function signatures.

## Capabilities

The `mvp-token` contract defines the following capabilities:

| Capability | Implementation&nbsp;required | Description |
| :--------- | :---------------------- | :---------- |
| AGENT-ADDED | `agent-role-v1` | Event emitted when you add a new agent. |
| AGENT-REMOVED | `agent-role-v1` | Event emitted when you use remove an agent. |
| AGENT&#8209;ROLES&#8209;UPDATED | Not required. | Event emitted when you update the roles assigned to an agent. |
| ONLY-AGENT | `agent-role-v1` | Managed capability to restrict access to specific functions based on the agent role. |
| ONLY-OWNER | `agent-role-v1` | Managed capability to restrict access to specific functions tha can only executed by the contract owner (not used in the `mvp-token` contract). |
| OWNERSHIP&#8209;TRANSFERRED | `agent-role-v1` | Event emitted when you transfer ownership of the contract to a new guard. |

## Functions

The `mvp-token` contract defines the following functions:

| Function | Implementation&nbsp;required | Description |
| :--------- | :---------------------- | :---------- |
| add-agent | `agent-role-v1` | Adds a new agent to the contract. |
| enforce-agent | Not required. | Enforces that an address is an agent. |
| get-agent-roles | Not required. | Retrieves the roles assigned to an agent. |
| get-owner-guard | Not required. | Retrieves the guard for the owner. |
| is-agent | `agent-role-v1` | Returns a boolean if an address is an agent. |
| only-agent | `agent-role-v1` | Ensures access is limited to agents. |
| only-owner | `agent-role-v1` | Ensures access is limited to agents (not used in the `mvp-token` contract). |
| only-owner-or-agent-admin | Not required. | Ensures access is limited to owners or agents with the `admin` role. |
| remove-agent | `agent-role-v1` | Removes an agent from the contract. |
| transfer-ownership | `agent-role-v1` | Transfers ownership of the contract. |
| update-agent-roles | Not required. | Updates the roles for an agent. |
| verify-agent-roles | Not required. | Verifies the roles assigned to an agent. |

## Agent role interface

The [agent-role](https://github.com/kda-community/RWA-token/blob/main/contracts/roles/agent-role-v1.pact) interface describes the core capabilities and function signatures for managing agents and roles.
At a minimum, the `mvp-token` contract must implement all of the capabilities and functions included in the interface.

### Event capabilities

- AGENT-ADDED: Event for the successful execution of an `add-agent` transaction.
- AGENT-REMOVED: Event for the successful execution of a `remove-agent` transaction.
- OWNERSHIP-TRANSFERRED: Event for the successful execution of a `transfer-ownership` transaction.

### Managed capabilities

- ONLY-OWNER: Validates whether an address has the owner role before allowing the address to be used to execute a transaction.
- ONLY-AGENT: Validates whether an address has the agent role before allowing the address to be used to execute a transaction.

### State-changing functions

- `add-agent`: Adds a new agent and guard to the contract.
- `remove-agent`: Removes an agent from the contract.
- `transfer-ownership`: Transfers ownership of the contract to a new guard.

### Utility functions

- `is-agent`: Checks whether an address is an agent and returns a boolean indicating the result of he check.
- `only-agent`: Checks whether an address has acquired the ONLY-AGENT capability to grant access to functions that can only be executed by valid agents.
- `only-owner`: Checks whether an address has acquired the ONLY-OWNER capability to grant access to functions that can only be executed by the operational owner.
