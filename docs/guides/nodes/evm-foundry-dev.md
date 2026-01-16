---
title: Developing for Chainweb EVM with Foundry
description: "Develop smart contract applications using the Foundry toolchain to run on multiple Chainweb EVM-compatible chains."
id: evm-foundry-dev
sidebar_position: 2
tags: [evm, foundry, Solidity, chainweb, network, node operator]
---

# Chainweb EVM Foundry integration

The [foundry-chainweb](https://github.com/kda-community/foundry-chainweb) package provides utilities to help you use the Foundry smart contract development toolchain to develop, test, and deploy projects on the Kadena Chainweb EVM blockchain.
These utilities extend the Foundry toolchain to support the Kadena multi-chain network, where transactions can be processed by multiple, parallel, EVM-compatible chains.

For information about installing the Foundry smart contract development toolchain and getting started with Solidity smart contract development, see the [Foundry](https://getfoundry.sh/introduction/overview) documentation.

## Before you begin

Verify that your development environment meets the following basic requirements:

- You have the Foundry toolchain—with the `forge`, `cast`, `anvil`, and `chisel` binaries—installed locally or running in a Docker container.
- You have Git installed for managing your project.
- You have cloned the [kadena-evm-sandbox](https://github.com/kda-community/kadena-evm-sandbox) so that you have access to public and private keys for test accounts with default allocations.

If you want to deploy projects on the Kadena Chainweb EVM test network, you must have an EVM-compatible wallet and the private key for an account holding testnet KDA funds.
For more information about deploying projects on the Chainweb EVM test network, see [Kadena Chainweb EVM deployment](/guides/nodes/howto-evm).

## Quick start

If you have the Foundry toolchain installed, you can clone the [foundry-chainweb](https://github.com/kda-community/foundry-chainweb) repository, navigate to the `/examples/Counter` folder, and begin experimenting with building, testing, and running scripts without first creating and configuring your own project.

To explore the sample `Counter` project:

1. Clone the `foundry-chainweb` repository:
   
   ```bash
   https://github.com/kda-community/foundry-chainweb.git && cd foundry-chainweb
   ```
  
2. Change to the `examples/Counter` directory:
   
   ```bash
   cd examples/Counter
   ```

3. Build the sample `Counter` project:
   
   ```bash
   forge build
   ```
   
   You should see that the sample project compiles successfully:

   ```bash
   [⠊] Compiling...
   [⠒] Compiling 1 files with Solc 0.8.30
   [⠑] Solc 0.8.30 finished in 568.10ms
   Compiler run successful!
   ```

4. Test the sample `Counter` project:
   
   ```bash
   forge test
   ```

   You should see that the tests for the sample project are successful:

   ```bash
   [⠊] Compiling...
   No files changed, compilation skipped
   
   Ran 2 tests for test/Counter.t.sol:CounterTest
   [PASS] test_IncrementMultiChain() (gas: 433714)
   [PASS] test_SetNumberMultiChain() (gas: 430552)
   Suite result: ok. 2 passed; 0 failed; 0 skipped; finished in 1.72s (4.07ms CPU time)
   ```

5. Review the sample project configuration files and contracts for an overview of changes before configuring your own projects:
   
   - foundry-chainweb/examples/Counter/chainweb.config.json
   - foundry-chainweb//examples/Counter/foundry.toml
   - foundry-chainweb/examples/Counter/script/Counter.s.sol
   - foundry-chainweb/examples/Counter/script/CounterCreate2.s.sol
   - foundry-chainweb/examples/Counter/src/Counter.sol
   - foundry-chainweb/examples/Counter/test/Counter.t.sol

## Install foundry-chainweb

To configure your development environment to use Foundry with Chainweb EVM:

1. Create a new project directory with template files by running a command similar to the following:
   
   ```bash
   forge init myKadenaCounter && cd myKadenaCounter
   ```

   If you already have a Foundry project, navigate to the root directory for that project.

2. Install the `foundry-chainweb` package by running the following command:

   ```bash
   forge install kadena-io/foundry-chainweb
   ```

3. Create a `remappings.txt` file in the root of your project.

4. Add the following to the `remappings.txt` file to override the default dependency mapping:

   ```text
   kadena-io/foundry-chainweb/=lib/foundry-chainweb/src/
   ```

5. Open the `foundry.toml` configuration file for your project and enable the Foreign Function Interface (FFI) support by setting the `ffi` option to `true` in your profile.
   
   For example:

   ```toml
   [profile.default]
   ffi = true
   ```

   The FFI feature allows Solidity tests and scripts to execute external commands or interact with the file system.

6. Enable `read` access to the `chainweb.config.json` file by adding the `fs_permissions` option to the `foundry.toml` file:

   ```toml
   fs_permissions = [{ access = "read", path = "./chainweb.config.json" }]
   ```

   By default, projects have no file system permissions, and can't read or write to any file system files or directories.
   The `fs_permissions` option enables you to configure specific file system permissions for specific files or directories.
   In this case, you're only allowing the project to read the `chainweb.config.json` file.
   You'll use the `chainweb.config.json` file to configure the settings to use for different network environments.

## Configure environment settings

A sample `chainweb.config.json` configuration file is installed by default in the `lib/foundry-chainweb` directory when you add `foundry-chainweb` to your project.
You can copy the sample  `chainweb.config.json` file to the root directory for your project or create a new `chainweb.config.json` file in the root directory.

You can use the `chainweb.config.json` file to configure different Chainweb EVM network settings to deploy and run contracts on multiple Chainweb EVM chains.
For example, you can modify the configuration file to define the number of EVM-compatible chains and the chain identifiers to use for different target networks, including `anvil`, a local Chainweb EVM node, the Chainweb EVM testnet, and Kadena mainnet.

The following sample `chainweb.config.json` file configures three deployment targets, the `anvil` target, the `evm-local` target, and the `evm-testnet` target, each with multiple EVM-compatible chains and with different Ethereum base chain identifiers:

```json
{
  "anvil": {
    "numberOfChains": 3,
    "chainwebChainIdOffset": 20,
    "chainIdOffset": 62600
  },
  "evm-local": {
        "numberOfChains": 2,
        "chainwebChainIdOffset": 20,
        "chainIdOffset": 1789,
        "externalHostUrl": "http://localhost:1848/chainweb/0.0/evm-development"
  },
  "evm-testnet": {
    "numberOfChains": 5,
    "chainwebChainIdOffset": 20,
    "chainIdOffset": 5920,
    "externalHostUrl": "https://evm-testnet.chainweb.com/chainweb/0.0/evm-testnet"
  }
}
```

As you see in this example, you can set the following configuration parameters in the `chainweb.config.json` file:

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| `numberOfChains` | `number` | Number of Chainweb EVM chains to initialize and fork in the target environment. |
| `chainwebChainIdOffset` | `number` | Index to start mapping Chainweb EVM chain identifiers to prevent collisions between Chainweb Pact and EVM chains. The Chainweb chain identifiers 0 through 19 are reserved for Pact chains. |
| `chainIdOffset` | `number` | Base Ethereum chain identifier to use as the starting point for Chainweb EVM chain identifiers. For example, if you set the base `chainIdOffset` to 1000, `numberOfChains` to three, and the `chainwebChainIdOffset` index to zero, the resulting chain identifiers would be 1000, 1001, and 1002. |
| `externalHostUrl` | `string` | Base URL for external Chainweb network access. |

You should note that the `chainid` used in Chainweb EVM tests and scripts for Foundry projects is the blockchain network identifier and is computed using the `chainIdOffset` defined in the project `chainweb.config.json` file.
This chain identifier is used as the base and incremented for each chain where a test or script runs.

The Chainweb chain identifier—for example, chains 20, 21, 22, 23, and 24 in the `evm-testnet` configuration—is computed using the `chainwebChainIdOffset` defined in the project `chainweb.config.json` file as a base and incremented for each chain where a test or script runs.


**Important**: The  `chainweb.config.json` configuration file is only used when running scripts with `ChainwebScript`. 
When running tests with `ChainwebTest`, the configuration parameters are passed directly to the constructor and the configuration file is ignored.

After you configure the settings for different deployment targets, you are ready to update the tests and scripts for your project to run on multiple chains.

## Add a custom setup function

To add custom setup logic to tests or scripts, you should use the optional `userSetUp` method instead of the default Foundry `setUp` method. 

For example:

```bash
contract CounterTest is ChainwebTest(2, 0) {
    function userSetUp() public override {
        // Custom set up logic can be added here if needed
        console.log("Setting up your test here");
    }
}
```
## Add multi-chain tests

To write tests that run on Chainweb EVM and support the multi-chain network, you should import the `ChainwebTest` contract that's defined in the `lib/foundry-chainweb/src/Chainweb.sol` file instead of using the default Foundry `Test` base contract.

The `ChainwebTest` code extends the Foundry `Test` contract by adding a `chainweb` property that provides two additional methods—the `getChainIds` and `switchChain` methods—to support the multi-chain network.

- `chainweb.getChainIds` returns a list of available Chainweb chain identifiers.
- `chainweb.switchChain` switches from the current active chain to a specified chain identifier in the Chainweb network.

For more information about these methods and other functions defined in the `Chainweb.sol` contract, see [Foundry Chainweb EVM - Chainweb.sol](/reference/evm-integration/foundry-chainweb-ref). 

### Input parameters

The `ChainwebTest` constructor takes the following parameters to set up multi-chain testing:

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| `numberOfChains` | `uint24` | Number of chains to initialize and fork. |
| `chainwebChainIdOffset` | `uint24` | Index to start mapping Chainweb EVM chain identifiers to prevent collisions between Chainweb Pact and EVM chains.|

### Adding multi-chain tests

The following example demonstrates using `ChainwebTest` with the `switchChain` method to test the `setNumber` and `increment` functions from the `Counter` contract on two chains:

```Solidity
// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import {console} from "forge-std/Test.sol";
import {Counter} from "../src/Counter.sol";
import {ChainwebTest} from "kadena-io/foundry-chainweb/Chainweb.sol";

// numberOfChains is 2 and chainwebChainIdOffset index is 0
contract CounterTest is ChainwebTest(2, 0) {
    function test_SetNumberMultiChain() public {
        uint256[] memory chainIds = chainweb.getChainIds();
        console.log("Chains in the chainweb:", chainIds.length);
        for (uint256 i = 0; i < chainIds.length; i++) {
            console.log("i:", i);
            chainweb.switchChain(chainIds[i]);
            Counter counter = new Counter();
            console.log("Running script on chain:", block.chainid);
            console.log("Counter deployed at:", address(counter));
            counter.setNumber(1);
            assertEq(counter.number(), 1);
        }
    }

    function test_IncrementMultiChain() public {
        uint256[] memory chainIds = chainweb.getChainIds();
        console.log("Chains in the chainweb:", chainIds.length);
        for (uint256 i = 0; i < chainIds.length; i++) {
            console.log("i:", i);
            chainweb.switchChain(chainIds[i]);
            Counter counter = new Counter();
            console.log("Running script on chain:", block.chainid);
            console.log("Counter deployed at:", address(counter));
            counter.setNumber(1);
            counter.increment();
            assertEq(counter.number(), 2);
        }
    }
}
```

### Executing multi-chain tests

You can execute the tests defined for your contract by running the `forge test` command.
For example, you can run the following command to display test results with additional details about test execution:

```bash
forge test -vv
```

In this example, tests run on two chains and the offset index is zero.
With the level two logging option, the command displays information about the tests executed similar to the following:

```bash
[⠊] Compiling...
[⠒] Compiling 23 files with Solc 0.8.30
[⠑] Solc 0.8.30 finished in 519.96ms
Compiler run successful!

Ran 2 tests for test/Counter.t.sol:CounterTest
[PASS] test_IncrementMultiChain() (gas: 357127)
Logs:
  Setting up Chainweb for tests...
  TEST: Setting main RPC node for 2 chains
  Deploying chainId precompile for chainId: 0  at address: 0x9b02c3e2dF42533e0FD166798B5A616f59DBd2cc
  Switching to chain: 0
  Switched to chain: 0
  Actually stored: 0
  Deploying chainId precompile for chainId: 1  at address: 0x9b02c3e2dF42533e0FD166798B5A616f59DBd2cc
  Switching to chain: 1
  Switched to chain: 0
  Actually stored: 1
  Switching to chain: 0
  Switched to chain: 0
  Chains in the chainweb: 2
  i: 0
  Switching to chain: 0
  Switched to chain: 0
  Running script on chain: 31337
  Counter deployed at: 0x5615dEB798BB3E4dFa0139dFa1b3D433Cc23b72f
  i: 1
  Switching to chain: 1
  Switched to chain: 1
  Running script on chain: 31338
  Counter deployed at: 0x2e234DAe75C793f67A35089C9d99245E1C58470b

[PASS] test_SetNumberMultiChain() (gas: 355387)
Logs:
  Setting up Chainweb for tests...
  TEST: Setting main RPC node for 2 chains
  Deploying chainId precompile for chainId: 0  at address: 0x9b02c3e2dF42533e0FD166798B5A616f59DBd2cc
  Switching to chain: 0
  Switched to chain: 0
  Actually stored: 0
  Deploying chainId precompile for chainId: 1  at address: 0x9b02c3e2dF42533e0FD166798B5A616f59DBd2cc
  Switching to chain: 1
  Switched to chain: 0
  Actually stored: 1
  Switching to chain: 0
  Switched to chain: 0
  Chains in the chainweb: 2
  i: 0
  Switching to chain: 0
  Switched to chain: 0
  Running script on chain: 31337
  Counter deployed at: 0x5615dEB798BB3E4dFa0139dFa1b3D433Cc23b72f
  i: 1
  Switching to chain: 1
  Switched to chain: 1
  Running script on chain: 31338
  Counter deployed at: 0x2e234DAe75C793f67A35089C9d99245E1C58470b

Suite result: ok. 2 passed; 0 failed; 0 skipped; finished in 758.11ms (3.57ms CPU time)

Ran 1 test suite in 768.88ms (758.11ms CPU time): 2 tests passed, 0 failed, 0 skipped (2 total tests)
```

## Write multi-chain scripts

To write scripts that run on Chainweb EVM and support the multi-chain network, you should import the `ChainwebScript` contract that's defined in the `lib/foundry-chainweb/src/Chainweb.sol` file instead of using the default Foundry `Script` contract. 
Like `ChainwebTest`, the `ChainwebScript` code extends the default Foundry `Script` contract by adding a `chainweb` property that provides two additional methods—the `getChainIds` and `switchChain` methods—to support the multi-chain network.

- `chainweb.getChainIds` returns a list of available Chainweb chain identifiers.
- `chainweb.switchChain` switches from the current active chain to a specified chain identifier in the Chainweb network.

For more information about these methods and other functions defined in the `Chainweb.sol` contract, see [Foundry Chainweb EVM - Chainweb.sol](/reference/evm-integration/foundry-chainweb-ref). 

### Writing a multi-chain deployment script

The following example demonstrates using `ChainwebScript` with the `getChainIds` and `switchChain` methods to deploy the `Counter` contract on multiple chains:

```Solidity
// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import {Script, console} from "forge-std/Script.sol";
import {Counter} from "../src/Counter.sol";
import {ChainwebScript} from "kadena-io/foundry-chainweb/Chainweb.sol";

contract CounterScript is ChainwebScript {
    function run() public {
        uint256[] memory chainIds = chainweb.getChainIds();

        // loop over chains and deploy the contract
        for (uint256 i = 0; i < chainIds.length; i++) {
            chainweb.switchChain(chainIds[i]);
            uint256 activeChainId = chainweb.getActiveChainId();
            console.log("Active Chainweb chain ID:", activeChainId);
            require(activeChainId == chainIds[i], "Active Chainweb chain ID does not match expected chain ID");

            vm.startBroadcast();
            Counter counter1 = new Counter();
            counter1.setNumber(1);
            vm.stopBroadcast();
        }
    }
}
```

### Reading configuration settings

The script automatically reads configuration settings from the `chainweb.config.json` file and uses the `CHAINWEB` environment variable, if specified, to determine which configuration settings to apply.
If you don't specify the `CHAINWEB` environment variable, the script uses the `anvil` environment by default.

For example, you can deploy the `Counter` contract with the default configuration that uses the `anvil` node environment and the private key for a test account by running the `Counter.s.sol` script like this:

```bash
forge script --multi script/Counter.s.sol:CounterScript \
  --private-key 0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80 \
  --broadcast
```

```bash
[⠊] Compiling...
[⠒] Compiling 1 files with Solc 0.8.30
[⠑] Solc 0.8.30 finished in 498.98ms
Compiler run successful!
Warning: Multi chain deployment is still under development. Use with caution.
Script ran successfully.
Gas used: 554347

== Logs ==
  Setting up Chainweb for scripts...
  SCRIPT: Setting main RPC node for 3 chains
  Forking http://127.0.0.1:15686
  Forking http://127.0.0.1:4667
  Forking http://127.0.0.1:32834
  Switching to chain: 20
  Switched to chain: 20
  Switching to chain: 20
  Switched to chain: 20
  Active Chainweb chain ID: 20
  Switching to chain: 21
  Switched to chain: 21
  Active Chainweb chain ID: 21
  Switching to chain: 22
  Switched to chain: 22
  Active Chainweb chain ID: 22

## Setting up 3 EVMs.

==========================

Chain 62602

Estimated gas price: 2.000000001 gwei

Estimated total gas used for script: 264211

Estimated amount required: 0.000528422000264211 ETH

==========================

==========================

Chain 62600

Estimated gas price: 2.000000001 gwei

Estimated total gas used for script: 264211

Estimated amount required: 0.000528422000264211 ETH

==========================

==========================

Chain 62601

Estimated gas price: 2.000000001 gwei

Estimated total gas used for script: 264211

Estimated amount required: 0.000528422000264211 ETH

==========================

##### 62600
✅  [Success] Hash: 0x69a7fe2ef2f94b3f712a3fe57029284079e9ecf9dd4a1b2902911675ba0710df
Contract Address: 0x5FbDB2315678afecb367f032d93F642f64180aa3
Block: 1
Paid: 0.000156813000156813 ETH (156813 gas * 1.000000001 gwei)


##### 62600
✅  [Success] Hash: 0x3b6e4deed1bdae3daf55a9bf1fe618049ff6141479a37f0b43de0d9209b78ae1
Block: 2
Paid: 0.000038291100884096 ETH (43696 gas * 0.876306776 gwei)


##### 62601
✅  [Success] Hash: 0xe42061b95d948bc6fe04ae2eed17f5adcb9814b78806d07e07baef9fff6f9284
Contract Address: 0x5FbDB2315678afecb367f032d93F642f64180aa3
Block: 1
Paid: 0.000156813000156813 ETH (156813 gas * 1.000000001 gwei)


##### 62601
✅  [Success] Hash: 0xdad0643eb985923056c17fd1ca3ffca119557acf918692d4ffb0ef2d9fdbe6ec
Block: 2
Paid: 0.000038291100884096 ETH (43696 gas * 0.876306776 gwei)


##### 62602
✅  [Success] Hash: 0xffadef8eaa3ba206e1878bb481691f121bd362b42509a4b6c30229b2c553c9cc
Contract Address: 0x5FbDB2315678afecb367f032d93F642f64180aa3
Block: 1
Paid: 0.000156813000156813 ETH (156813 gas * 1.000000001 gwei)


##### 62602
✅  [Success] Hash: 0x688439a4a551a573a1ea706bc1bed424f879e5143f5672de2ea29a12863b1cfb
Block: 2
Paid: 0.000038291100884096 ETH (43696 gas * 0.876306776 gwei)

✅ Sequence #1 on 62600 | Total Paid: 0.000195104101040909 ETH (200509 gas * avg 0.938153388 gwei)

✅ Sequence #2 on 62601 | Total Paid: 0.000195104101040909 ETH (200509 gas * avg 0.938153388 gwei)

✅ Sequence #3 on 62602 | Total Paid: 0.000195104101040909 ETH (200509 gas * avg 0.938153388 gwei)
                                                                                

==========================

ONCHAIN EXECUTION COMPLETE & SUCCESSFUL.

Transactions saved to: /Users/pistolas/myKadenaCounter/broadcast/multi/Counter.s.sol-latest/run.json

Sensitive details saved to: /Users/pistolas/myKadenaCounter/cache/multi/Counter.s.sol-latest/run.json
```

You can run the deployment script using the `evm-local` configuration from the `chainweb.config.json` file as the target environment by running a command similar to the following:

```bash
CHAINWEB=evm-local forge script --multi script/Counter.s.sol:CounterScript \
  --private-key 0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80 \
  --broadcast --legacy
```

## Sample configuration and deployment

The following sample `chainweb.config.json` file demonstrates the configuration settings for the default `anvil` local environment, a custom `evm-local` local development environment, and the Chainweb EVM `evm-testnet` network.

```json
{
    "anvil": {
        "numberOfChains": 3,
        "chainwebChainIdOffset": 20,
        "chainIdOffset": 62600
    },
    "evm-local": {
        "numberOfChains": 2,
        "chainwebChainIdOffset": 20,
        "chainIdOffset": 1789,
        "externalHostUrl": "http://localhost:1848/chainweb/0.0/evm-development"
    },
    "evm-testnet": {
        "numberOfChains": 5,
        "chainwebChainIdOffset": 20,
        "chainIdOffset": 5920,
        "externalHostUrl": "https://evm-testnet.chainweb.com/chainweb/0.0/evm-testnet"
    }
}
```

To deploy the Counter contract using the `evm-local` configuration settings and the private key for one of the predefined development wallet accounts:

```bash
CHAINWEB=evm-local forge script --multi script/Counter.s.sol:CounterScript \
  --private-key 0x67a8e3847c417e5c8989af0c161aea6a601bcd8f4f5fd7dbad89d7e74bf28dbc \                  
  --broadcast --legacy
```

This deployment script deploys the contract on two Chainweb EVM chains with output similar to the following:

```bash
[⠊] Compiling...
No files changed, compilation skipped
Warning: Multi chain deployment is still under development. Use with caution.
Script ran successfully.
Gas used: 382845

== Logs ==
  Setting up Chainweb for scripts...
  SCRIPT: Setting main RPC node for 2 chains
  Using custom RPC URL: http://localhost:1848/chainweb/0.0/evm-development/chain/20/evm/rpc
  Using custom RPC URL: http://localhost:1848/chainweb/0.0/evm-development/chain/21/evm/rpc
  Switching to chain: 20
  Switched to chain: 20
  Switching to chain: 20
  Switched to chain: 20
  Active Chainweb chain ID: 20
  Switching to chain: 21
  Switched to chain: 21
  Active Chainweb chain ID: 21

## Setting up 2 EVMs.

==========================

Chain 1790

Estimated gas price: 1.000000007 gwei

Estimated total gas used for script: 264211

Estimated amount required: 0.000264211001849477 ETH

==========================

==========================

Chain 1789

Estimated gas price: 1.000000007 gwei

Estimated total gas used for script: 264211

Estimated amount required: 0.000264211001849477 ETH

==========================

##### 1789
✅  [Success] Hash: 0x81b13a99253bc4b0554675c9421d1e40ea4765a1f603e02fd3284cd7ebcf2292
Block: 3521
Paid: 0.000043696000305872 ETH (43696 gas * 1.000000007 gwei)


##### 1789
✅  [Success] Hash: 0x9176eee2c9d556b9a575fe6de32c0636e982a4dc9b4d2e4e4c155714f3d6d60b
Contract Address: 0xfab4C60CF33e03d4F35c7d3E0aBF33e0e4E6E6d6
Block: 3521
Paid: 0.000156813001097691 ETH (156813 gas * 1.000000007 gwei)


##### 1790
✅  [Success] Hash: 0x668a2be6866b89559f01e5b764b1fe1832b08ddba50d5c47cb282218a2c1ea58
Block: 3522
Paid: 0.000043696000305872 ETH (43696 gas * 1.000000007 gwei)


##### 1790
✅  [Success] Hash: 0x2e6022c1189995acead47a1870c79562a86bc31bdb76563c3de4556687601f82
Contract Address: 0xfab4C60CF33e03d4F35c7d3E0aBF33e0e4E6E6d6
Block: 3522
Paid: 0.000156813001097691 ETH (156813 gas * 1.000000007 gwei)

✅ Sequence #1 on 1789 | Total Paid: 0.000200509001403563 ETH (200509 gas * avg 1.000000007 gwei)

✅ Sequence #2 on 1790 | Total Paid: 0.000200509001403563 ETH (200509 gas * avg 1.000000007 gwei)
                                                                                

==========================

ONCHAIN EXECUTION COMPLETE & SUCCESSFUL.

Transactions saved to: /Users/pistolas/myKadenaCounter/broadcast/multi/Counter.s.sol-latest/run.json

Sensitive details saved to: /Users/pistolas/myKadenaCounter/cache/multi/Counter.s.sol-latest/run.json
```

In the sample output for deploying the contract on multiple chains, you'll notice that the Foundry chain identifiers are computed using the default value from the `chainIdOffset` property in `chainweb.config.json` file as a base value and incremented for each Chainweb EVM chain.
As a result of the computation, Chainweb EVM chain 20 (index 0) maps to the base chain identifier 62600 for the `anvil` network, `1789` for the `evm-local` network, or 5920 for the `evm-testnet` network.
In this example with only two EVM chains, CChainweb EVM chain 20 (index 0) is mapped to the `chainIdOffset` 1789 (base)and Chainweb EVM chain 21 (index 1) is incremented to the chain identifier 1790.

You should note that Chainweb chain identifiers 0 through 19 are reserved for chains that support Pact, so Kadena public networks use the `chainwebChainIdOffset` to set the starting point for Chainweb EVM chain identifiers.
For example, the Chainweb EVM testnet consists of five chains with the chain identifiers 20, 21, 22, 23, and 24. 
This starting point value is configured in the `chainweb.config.json` file for each project and for each deployment target. 
In the sample `chainweb.config.json` file, the `anvil` deployment target is also configured to use 20 as the starting point for Chainweb EVM chain identifiers.
However, if you spin up internal `anvil` instances for testing, you'll see Chainweb chain identifiers starting with 0. 

The `chainIdOffset` in the `chainweb.config.json` file is the starting point for the **Ethereum network chain identifier**, similar to 1 for the Ethereum mainnet. 
For Chainweb EVM testnet chains, the starting value for the Ethereum network chain identifier is 5920.
The network chain identifier for the Chainweb EVM testnet chain 20 is 5920. 
Chainweb EVM testnet chain 21 has network chain identifier 5921, and so on.

## Verify multi-chain contracts

You can verify contracts that run on Chainweb EVM by running the standard `forge verify-contract` command. 
The following example demonstrates verifying a contract like `Counter.sol` that has no constructor arguments:

```bash
forge verify-contract \
  --chain 5920 \
  --num-of-optimizations 200 \
  --watch \
  --verifier blockscout \
  --verifier-url https://chain-20.evm-testnet-blockscout.chainweb.com/api/ \
  --verifier-api-version v2 \
  --compiler-version v0.8.28 \
  0x3ee2edc5b2967093bf9b3058cf9803bee7595baf \
  src/Counter.sol:Counter
```

If your contract has constructor arguments, you can pass them using the `--constructor-args` option.
For example:

```bash
--constructor-args $(cast abi-encode "constructor(string,string,uint256,uint256)" "ForgeUSD" "FUSD" 18 1000000000000000000000)
```

You can run the following command to see all of the `verify-contract` command-line options:

```bash
forge verify-contract --help
```

For contracts that run on multiple Chainweb EVM chains, you must run the `verify-contract` command on each chain.
However, the `verify-contract` command doesn't support verification if a contract with the same bytecode has been previously verified. 
If you attempt to verify a contract with the same bytecode as a contract that has been previously verified, verification will fail with a message similar to the following:

```shell
[address] is already verified. Skipping verification.
```

To test contract verification on multiple chains, you must change the bytecode, redeploy, then run the `verify-contract` command on the redeployed contract.

You can change the bytecode by adding a constant at the top of the contract like this:

```solidity
uint256 public constant DUMMY = 1;
```

Increase the value used for the constant in each contract you deploy to verify contracts that are deployed on multiple chains.
Contract verification is not possible against anvil instances, because there is no block explorer for anvil.

## How nonces are maintained in multi-fork scenarios

The account you use when you execute tests with `forge test` or run scripts with `forge script` commands affects how the transaction nonce is maintained in different scenarios.

### forge test with msg.sender

Because the default `msg.sender` account is a persisted account that's available across all forks, you can run `forge test` using the default `msg.sender` account to ensure transactions have a nonce that's maintained globally across all forks.

If you want to test a contract using isolated nonces that are maintained separately for each fork, you can use the `vm.startPrank` or `vm.startBroadcast` function to set a specific account instead of using the default `msg.sender` account. 
The nonce for that account is then maintained per fork.

### forge script with msg.sender

Because the default `msg.sender` account is a persisted account that's available across all forks, you can run `forge script` using the default `msg.sender` account to ensure transactions have a nonce that's maintained globally across all forks.

If you specify the `msg.sender` account by setting the `--sender` or `--private-key` command-line option, the nonce is maintained per fork.

You can also use the `vm.startBroadcast` function to explicitly set the sender for the next call. 
The nonce for that sender is maintained per fork.

## Deterministic deployment

The `/examples/Counter` folder in the [foundry-chainweb](https://github.com/kda-community/foundry-chainweb) repository includes a sample script that demonstrates how to deploy a contract that has the same address on every chain.

The `CounterCreate2.s.sol` script demonstrates deterministic deployment across all Chainweb EVM chains using the CREATE2 opcode.
The CREATE2 opcode ensures that the same contract is deployed using a predetermined address that is exactly the same on every chain, making cross-chain interactions predictable and easier to manage.

To simulate the deployment using the sample script:

1. Open a terminal shell on your computer.
     
2. Change to the `examples/Counter` directory:
   
   ```shell
   cd examples/Counter
   ```

3. Run a command similar to the following:

   ```shell
   forge script script/CounterCreate2.s.sol:CounterCreate2Script \
     --private-key 0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80
   ```
   
   In this example, the script uses the `anvil` deployment target and simulates deployment on three chains.
   
   ```shell
   [⠊] Compiling...
   [⠑] Compiling 2 files with Solc 0.8.30
   [⠘] Solc 0.8.30 finished in 604.25ms
   Compiler run successful!
   Warning: Multi chain deployment is still under development. Use with caution.
   Script ran successfully.
   Gas used: 590474
   
   == Logs ==
     Setting up Chainweb for scripts...
     SCRIPT: Setting main RPC node for 3 chains
     Forking http://127.0.0.1:7980
     Forking http://127.0.0.1:3379
     Forking http://127.0.0.1:13248
     Switching to chain: 20
     Switched to chain: 20
     Counter will be deployed to address: 0xe6E97678A7A22143854b5fd5AD3352897Ae29d45
     Using salt: 0x186cb6b14ba03f51eb142c757b395ea189ebb4c3a3357c14b361942227b305b2
     ----------------------------------------
     Switching to chain: 20
     Switched to chain: 20
     Deploying to chain: 20
     Deployed Counter at: 0xe6E97678A7A22143854b5fd5AD3352897Ae29d45
     Switching to chain: 21
     Switched to chain: 21
     Deploying to chain: 21
     Deployed Counter at: 0xe6E97678A7A22143854b5fd5AD3352897Ae29d45
     Switching to chain: 22
     Switched to chain: 22
     Deploying to chain: 22
     Deployed Counter at: 0xe6E97678A7A22143854b5fd5AD3352897Ae29d45
     ----------------------------------------
     Deployment Summary:
     All Counter contracts deployed to the SAME address: 0xe6E97678A7A22143854b5fd5AD3352897Ae29d45
   
   ## Setting up 3 EVMs.
   
   ==========================
   
   Chain 62600
   
   Estimated gas price: 2.000000001 gwei
   
   Estimated total gas used for script: 217681
   
   Estimated amount required: 0.000435362000217681 ETH
   
   ==========================
   
   ==========================
   
   Chain 62601
   
   Estimated gas price: 2.000000001 gwei
   
   Estimated total gas used for script: 217681
   
   Estimated amount required: 0.000435362000217681 ETH
   
   ==========================
   
   ==========================
   
   Chain 62602
   
   Estimated gas price: 2.000000001 gwei
   
   Estimated total gas used for script: 217681
   
   Estimated amount required: 0.000435362000217681 ETH
   
   ==========================
   
   SIMULATION COMPLETE. To broadcast these transactions, add --broadcast and wallet configuration(s) to the previous command. See forge script --help for more.
   
   Transactions saved to: /Users/pistolas/myKadenaCounter/broadcast/multi/dry-run/CounterCreate2.s.sol-latest/run.json
   
   Sensitive details saved to: /Users/pistolas/myKadenaCounter/cache/multi/dry-run/CounterCreate2.s.sol-latest/run.json
   ```

To deploy the Counter contract using the sample deployment script, add the `--broadcast` command-line option.

For example:

```shell
forge script script/CounterCreate2.s.sol:CounterCreate2Script \
  --private-key 0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80 \
  --broadcast
```

The sample script demonstrates the following deployment steps:

- Predicts the deployment address using the account salt and contract bytecode.
- Deploys the `Counter` contract to all configured Chainweb EVM chains.
- Verifies that each deployment matches the predicted address.
- Displays a summary that shows all contracts were deployed to the same address.
  
# Known issues

If you run the `forge test` command with the `--gas-report` command-line option in the root directory of the `foundry-chainweb` repo, the `test_Nonce` test case fails. 
This failure occurs because Foundry does not isolate the forks with separate nonces when the `--gas-report` option is used.
The nonces are global instead of per fork when you use the `--gas-report` command-line option.

In addition, the `test_setupChainsForScript` test case might fail when running the `forge test` command with the `--gas-report` command-line option.
This failure occurs because the contract state on the forks is not isolated. 
For example, when the chainId precompile is deployed, its state variable is set to 0 for the first chain. 
The state variable is then set to 1 for the second chain. 
However, the state in the contract on the first chain fork is **overwritten** to 1 instead of writing that state to a separate fork. 
The behavior can be observed by logging activity, but the root cause of the behavior isn't known at this time. 
You can attempt to work around this behavior by using the `vm.revokePersistent` cheat code in the `deployChainWebChainIdContract` function to isolate contract addresses are when using the `--gas-report` command-line option. 
However, the work around doesn't guarantee that the `test_setupChainsForScript` test case will succeed in all cases. 
