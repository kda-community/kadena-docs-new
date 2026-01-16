---
title: Install on Windows
id: windows
sidebar_position: 2
description: "Install the Pact smart contract programming language on the Windows Subsystem for Linux."
---

import CodeBlock from '@theme/CodeBlock';

# Install on Windows Subsystem for Linux (WSL)

You can install Pact on Microsoft Windows if you first install and configure the Windows Subsystem for Linux (WSL) on Windows 10, or later, or on Windows Server 2019, or later.
After you install and configure the WSL, you can install Pact from the Pact Linux release archive. 

## Prerequisites

Before you can install Pact on Microsoft Windows, you must install and configure the Windows Subsystem for Linux (WSL).
For complete WSL installation instructions, see [Install WSL](https://learn.microsoft.com/en-us/windows/wsl/install) or [Install on Windows Server](https://learn.microsoft.com/en-us/windows/wsl/install-on-server).

To set up WSL:

1. Click **Start** to select **Windows PowerShell**, then click **Run as Administrator**.
2. Run the following command to enable WSL and install the Ubuntu distribution:
   
   ```powershell
   wsl --install --distribution Ubuntu
   ```

1. Restart the Windows computer to complete the WSL installation.
   
   After restarting, click Start to select the Ubuntu virtual machine and follow the instructions displayed to create a new user account and complete the setup process.

In addition to setting up WSL, if you are installing Pact 4.x, you should note that this version of Pact requires the `z3` theorem prover from Microsoft Research to support formal verification.
Starting with Pact 5, Pact no longer supports formal verification using the `z3` theorem prover.
If you are installing Pact 5, or later, you can continue to the [Installation instructions](#installation-instructions).

If you are installing Pact 4.x, you can install and verify the installation of the `z3` package on Linux by running the following commands:

```bash
sudo apt update
sudo apt install z3
z3 --version
```

If `z3` is installed properly, you should see output similar to the following:

```bash
Z3 version 4.13.3 - 64 bit
```

## Installation instructions

To install Pact on Window Subsystem for Linux (WSL):

1. Navigate to the appropriate Pact Releases page:
   
   - [Pact 4 Releases](https://github.com/kda-community/pact/releases) to download the latest stable version of Pact 4.x. 
   - [Pact 5 Releases](https://github.com/kda-community/pact-5/releases) to download the latest version of Pact 5.

2. Download the latest `pact-<version>-linux-<arch>.tar.gz` file for the Linux operating system and architecture you use.

3. Open a terminal and extract the downloaded compressed archive by running the following command:

   ```bash
   tar -xvzf pact-<version>-linux-<arch>.tar.gz
   ```

4. Navigate to the extracted directory:

   ```bash
   cd pact-<version>-linux-<arch>
   ```

5. Move the `pact` binary to a directory in your system `PATH`, or update your `PATH` variable. 
   
   For example, to move the `pact` binary from the current working directory to the `/usr/local/bin` directory and update the `PATH`:
   
   ```bash
   sudo mv pact /usr/local/bin
   export PATH="/usr/local/bin:$PATH"
   ```

6. Reload the shell configuration.

   For example, reload the configuration for the `bash` shell by running the following command:

   ```bash
   source ~/.bashrc
   ```
   
   Replace `~/.bashrc` with `~/.zshrc` if you use the `zsh` shell.

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
  Z3 version 4.8.12 - 64 bit
  ```

  If necessary, install z3 by running the following commands:

  ```bash
  sudo apt update
  sudo apt install z3
  z3 --version
  ```

- Verify the `pact` binary can be located and is in a directory included in your `PATH` environment variable.
  
  First check the path to the `pact` binary by running the following command:

   ```bash
   which pact
   ```
   
   This command should display the current path to the `pact` binary.
   For example:

   ```bash
   /usr/local/bin/pact
   ```

   If the command doesn't display the path to the `pact` binary, you should try reinstalling `pact` from the prebuilt release archive or from the source code.
   If the `which pact` command displays the path to the `pact` binary, check the `PATH` environment variable to verify the path the the binary is include by running the following command:

   ```bash
   echo $PATH
   ```

   This command should display output similar to the following:
   
   ```bash
   /home/pistolas/.nix-profile/bin:/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin:/usr/games:/usr/local/games:/snap/bin
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
