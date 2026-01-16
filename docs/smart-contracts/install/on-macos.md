---
title: Install on macOS
id: macos
sidebar_position: 2
description: "Install the Pact smart contract programming language on macOS computers."
---

import CodeBlock from '@theme/CodeBlock';

# Install on macOS

You can install Pact on macOS by using the Homebrew package manager or by downloading and installing the appropriate binary for the local system architecture. 

## Prerequisites

If you want to install Pact on macOS using the Homebrew package manager (recommended), you should verify that you have Homebrew installed by running the following command:

```bash
brew --version
```

This command should display output similar to the following:

```bash
Homebrew 4.3.23
```

If you don't have Homebrew installed, see [Homebrew](https://brew.sh/) for installation instructions and additional information about using the package manager.

In addition to Homebrew, if you are installing Pact 4.x, you should note that this version of Pact requires the `z3` theorem prover from Microsoft Research to support formal verification.
Starting with Pact 5, Pact no longer supports formal verification using the `z3` theorem prover.

If you are installing Pact 5, or later, you can continue to the [Installation instructions](#installation-instructions).
If you are installing Pact 4.x, you can install and verify the installation of the `z3` package on Linux by running the following commands:

```bash
brew install z3
z3 --version
```

If `z3` is installed properly, you should see output similar to the following:

```bash
Z3 version 4.13.3 - 64 bit
```

## Installation instructions

To install Pact on macOS using Homebrew:

1. Open a terminal shell on your local computer.

2. Update the `brew` package manager by running the following command:

   ```zsh
   brew update
   ```

2. Install the `pact` binary and related dependencies by running the following command:

   ```zsh
   brew install kadena-io/pact/pact
   ```

7. Verify the installation by checking the Pact version:

   ```bash
   pact --version
   ```

8. View usage information for the pact interactive interpreter by running the following command:
   
   ```bash
   pact --help
   ```

   For more information about the command-line options, see [Pact command-line interpreter](/reference/pact-cli).
   For an introduction to Pact programming and language features, see [Pact features and conventions](/smart-contracts/lang-features).

To install Pact on macOS from a compressed archive:

1. Navigate to the appropriate Pact Releases page:
   
   - [Pact 4 Releases](https://github.com/kda-community/pact/releases) to download the latest stable version of Pact 4.x. 
   - [Pact 5 Releases](https://github.com/kda-community/pact-5/releases) to download the latest version of Pact 5.

2. Download the latest `pact-<version>-macos-<arch>.tar.gz` file for the macOS operating system and architecture you use.

3. Double-click the downloaded file to extract the contents.

4. Use the Finder to navigate to the `pact` binary in the extracted directory, select the binary, right-click, then click **Open**.

5. Click **Open** to override system setting settings:

## Troubleshooting

If you encounter issues, check the following:

- Check the Pact version and, if Pact, version 4.x, is installed, verify that you have `z3` installed.

  ```bash
  pact --version
  ```
  
  This command should display output similar to the following:

  ```bash
  pact version 4.13
  ```

  If the Pact version is 4.x, check for the z3 package by running the following command:

  ```bash
  z3 --version
  ```

  If `z3` is installed correctly, the command should display output similar to the following:
  
  ```bash
  Z3 version 4.13.0 - 64 bit
  ```

  If necessary, install `z3` by running the following command:

  ```bash
  brew install z3
  ```

- Verify the `pact` binary can be located and is in a directory included in your `PATH` environment variable.
  
  First check the path to the `pact` binary by running the following command:

   ```bash
   which pact
   ```
   
   This command should display the current path to the `pact` binary.
   For example:

   ```bash
   /opt/homebrew/bin/pact
   ```

   If the command doesn't display the path to the `pact` binary, you should try reinstalling `pact` using `brew`, from the prebuilt release archive, or from the source code.
   If the `which pact` command displays the path to the `pact` binary, check the `PATH` environment variable to verify the path the the binary is include by running the following command:

   ```bash
   echo $PATH
   ```

   This command should display output similar to the following:
   
   ```bash
   //Users/pistolas/Library/pnpm:/opt/homebrew/bin:/opt/homebrew/bin:/Library/Frameworks/Python.framework/Versions/3.12/bin:/opt/homebrew/bin:/opt/homebrew/sbin:/usr/local/bin:/System/Cryptexes/App/usr/bin:/usr/bin:/bin:/usr/sbin:/sbin:/var/run/com.apple.security.cryptexd/codex.system/bootstrap/usr/local/bin:/var/run/com.apple.security.cryptexd/codex.system/bootstrap/usr/bin:/var/run/com.apple.security.cryptexd/codex.system/bootstrap/usr/appleinternal/bin
   ```
   
   The `$PATH` output should include the directory where the `pact` binary is located.
   If the PATH environment variable doesn't include the directory, open your shell profile—for example, the `~/.bashrc` or `~/.zshrc` file—in a text editor.
   Add the following line at the end of the file:

   ```bash
   export PATH="/path/to/pact-directory:$PATH"
   ```

   Save the shell profile file and exit.

   Open a new terminal or reload the shell profile to complete the update.

- Check [Pact GitHub Issues](https://github.com/kda-community/pact/issues) for known issues or to report a problem with installing Pact.

