---
title: chainweb-node command-line
description: "Command-line options and usage information for running the chainweb-node binary."
id: chainweb-cli
sidebar_position: 6
---

# chainweb-node command-line

You can configure many aspects of Chainweb node operations using configuration settings in one or more configuration files or by specifying command-line options and arguments.

Configuration settings are loaded in order first from one or more configuration file locations that you specify using `--config-file` options then from the command-line options in the order you specify them.
Configuration settings that are loaded later overwrite settings that were previously loaded.

You can specify configuration file locations by providing local file system paths or remote HTTP or HTTPS URLs. 
Remote URLs must start with either "http://" or "https://".

## Basic usage

The basic syntax for setting chainweb-node command-line options is:

```bash
chainweb-node [option] [arguments]
```

## Node information options

| Use this option | To do this |
| --------------- | ---------- |
| --config-file _filename_ | Specify the local path or the URL of a file that contains configuration settings in YAML or JSON format. If you specify more than one `--config-file` option, the files are loaded in the order that they are specified on the command line. You can specify configuration file locations by providing local file system paths or remote HTTP or HTTPS URLs. 
Remote URLs must start with either "http://" or "https://". |
| -?, -h, --help | Display usage information as standard output, then exit. |
| --info | Display a brief summary that describes the Chainweb version number and revision (commit) hash as standard output, then exit. |
| --license | Display the license agreement for the software as standard output, then exit. |
| --long-info | Display a complete list of packages and dependencies as standard output, then exit. |
| --print-config | Display the current configuration of the node as standard output. This option is an alias for the `--print-config-as=full` option. |
| --print-config-as full|minimal|diff | Choose whether to display the full configuration settings, only the settings you have explicitly set, or only the settings that are different from the default settings. |
| -v, --version | Display the Chainweb version number and revision (commit) hash as standard output, then exit. |

## General blockchain options

| Use this option | To do this |
| --------------- | ---------- |
| -v, --chainweb-version _networkId_ | Specify the Chainweb network identifier for the node. Valid values are `development`, `testnet04`, `testnet05`, and `mainnet01`. The default is `mainnet01`. |
|--database-directory _path_ | Specify the path to the `chainweb-node` database root folder. |
| --header-stream | Enable the endpoint for streaming block updates. For information about streaming block updates, see [Stream block header event updates](/api/service-api/api-update-event-stream). |
| --no-header-stream | Unset the `--header-stream` option and disable streaming block updates. |
| --enable-tx-reintro | Enable transactions from losing forks of the chain to be resubmitted. |
| --disable-tx-reintro | Unset the `--enable-tx-reintro` option and prevent transactions from losing forks to be resubmitted. |
| --enable-reset-chain-databases | Reset chain databases when the node starts. |
| --disable-reset-chain-databases | Disable resetting of chain databases when the node starts. |
| --reorg-limit _max_ | Specify the maximum allowed reorganization depth. For more information, see [Recovering from deep forks](https://github.com/kda-community/chainweb-node/blob/master/docs/RecoveringFromDeepForks.md).|
| --pre-insert-check-timeout _microseconds_ | Specify the maximum number of microseconds allowed for the transactions validation in the PreInsertCheck command.|
| --allowReadsInLocal | Enable direct database reads of smart contract tables in local queries.|
| --no-allowReadsInLocal | Disable direct database reads of smart contract tables in local queries.|
  
## Development mode options

| Use this option | To do this |
| --------------- | ---------- |
|--fork-upper-bound _upperBound_ | Specify the latest fork for the node to enable (development mode only). |
| --block-delay _delay_ | Specify the block delay in seconds per block (development mode only). |
| --disable-pow | Disable the proof-of-work check (development mode only). |

## Peer-to-peer options

| Use this option | To do this |
| --------------- | ---------- |
| --p2p-hostname _hostname_ | Set the hostname or IP address for the local peer to enable peer-to-peer communication. |
| --p2p-port _portNumber_ | Set the port number for the local peer to enable peer-to-peer communication. |
| --p2p-interface _interface_ | Set the interface for the peer-to-peer REST API endpoints to bind to. For more information, see the HostPreference documentation. |
| --p2p-certificate-chain _certificate_ | Specify the PEM-encoded X509 certificate or certificate chain used by the local peer for peer-to-peer communication. |
| --p2p-certificate-chain-file _file_ | Specify a file with the PEM-encoded certificate chain. Providing the `certificate-chain` as a text string takes precedence over using a file for peer-to-peer communication. |
| --p2p-key _key_ | Specify the PEM-encoded X509 certificate key used by the local peer for peer-to-peer communication. The default is `null`. |
| --p2p-certificate-key-file _file_ | Specify a file with the PEM-encoded certificate key. A textually provided certificate `key` has precedence over using a file for peer-to-peer communication. |
| --p2p-max-session-count _count_ | Specify the maximum number of sessions that can be active at any time. |
| --p2p-max-peer-count _count_ | Specify the maximum number of entries allowed in the peer database. |
| --p2p-session-timeout _seconds_ | Specify the maximum number of seconds to allow for a session to try to connect before timing out the connection. |
| --known-peer-info [ _peerId@_ ]_hostaddress_ | Specify the peer information that is added to the list of known peers. You can specify this option multiple times on the command-line. |
| --enable-ignore-bootstrap-nodes | Specify that you want to ignore the hard-coded bootstrap nodes for the network. |
| --disable-ignore-bootstrap-nodes | Unsets the option to ignore bootstrap nodes to restore communication with the hard-coded bootstrap nodes for the network. |
| --enable-private | Specify that you want this node to be private and only communicate only with its initially configured known peer nodes. |
| --disable-private | Unsets the make the node private to enable the node to communicate with other nodes in the network. |
| --bootstrap-reachability [0,1] | Specify the number of bootstrap nodes that must be reachable when the node starts up as a fraction of the bootstrap nodes available. The default value of 0.5 indicates that half of the bootstrap nodes must be reachable for the node to connect to the network. |

## Memory pool options

| Use this option | To do this |
| --------------- | ---------- |
| --enable-mempool-p2p | Enables the memory pool peer-to-peer network for the local node. |
| --disable-mempool-p2p | Unsets the --enable-mempool-p2p option to disable the memory pool peer-to-peer network for the local node. |
| --mempool-p2p-max-session-count _count_ | Specify the maximum number of memory pool peer-to-peer sessions that are active at any time. |
| --mempool-p2p-session-timeout _seconds_ | Specify the maximum number of seconds to allow for a memory pool peer-to-peer session to try to connect before timing out the connection. |
| --mempool-p2p-poll-interval _seconds_ | Specify the poll interval for synchronizing memory pool sessions. |

## Gas options

| Use this option | To do this |
| --------------- | ---------- |
| --block-gas-limit _max_ | Specify the upper bound for the sum of all transaction fees allowed in a block. The total fees for all transaction must
not exceed the value you set for the _max_ argument.|
| --log-gas | Logs the gas fees consumed by Pact commands.
| --no-log-gas | Disables the `--log-gas` option to stopping logging the gas consumed by Pact commands.
| --min-gas-price _price_ | Specify the minimum gas price allowed for an individual transaction in a block. The gas fee for any individual transaction in a block cannot be below the value you set for the _price_ argument. |

## Pact options

| Use this option | To do this 
| --------------- | ---------- 
| --pact-queue-size _max_ | Specify the maximum size of the Pact internal queue. |
| --full-historic-pact-state | Keep the full historic Pact state n the database. You should only only set this option for custodial or archive nodes. |
| --no-full-historic-pact-state | Reset the `--full-historic-pact-state` option from true to false. |
| --module-cache-limit _bytes_ | Set the maximum size of the per-chain `checkpointer` module cache in bytes.|
| --enable-local-timeout _seconds_ | Enable timeout support for `/local` endpoint calls.|

## Cut options

| Use this option | To do this |
| --------------- | ---------- |
| --fast-forward-block-height-limit _height_| Set the limit for fast-forwarding block height (null means no limit). If you set the `--only-sync-pact` option, chain synchronization uses this block height. If you haven't set the `--only-sync-pact` option, this option is ignored.|
| --cut-fetch-timeout _microseconds_ | Set a timeout for fetching cuts in microseconds.|
| --initial-block-height-limit _height_| Reset the initial cut to this block height (null means no limit).|
| --prune-chain-database none|headers|headers-checked|full | Specify a database pruning strategy to run when the node starts. You can specify the _strategy_ are `none`, `headers`, `headers-checked`, or `full`. Note that database pruning can take several hours. |

## Service API options

| Use this option | To do this 
| --------------- | ---------- 
| --service-port _port_ | Specify the port number for exposing the service API.|
| --service-interface _interface_ |  Set the interface for the service REST API endpoints to bind to. For more information, see the HostPreference documentation.|
| --service-payload-batch-limit _max_| Set the upper limit for the number of payload batches that can be returned in response to a service API request. Note that increasing this upper limit can make payload requests a potential attack vector for Denial of Service (DoD) attacks.|

## Mining options

| Use this option | To do this |
| --------------- | ---------- |
| --enable-mining-coordination | Enable the mining coordination API for the node.

| --disable-mining-coordination | Reset the `--enable-mining-coordination` option from true to false to disables the mining coordination API for the node. |
| --mining-public-key _key_ | Set the public key for a miner account in hexadecimal encoding. Account names typically use the prefix `k:` followed by the account public key. You can specify this option multiple times. |
| --mining-request-limit _max_ | Specify the maximum number of mining work requests that can be made within a 5 minute period.|
| --mining-update-stream-limit _max_ | Specify the maximum number of concurrent update streams that the node can support. |
| --mining-update-stream-timeout _seconds_ | Set the maximum number of seconds to keep an update stream open. |
| --mining-payload-refresh-delay _seconds_ | Specify the frequency with which the mining payload is refreshed. |
| --enable-node-mining | Enable in-node mining. Only use this option for internal network testing.|
| --disable-node-mining | Unset the `--enable-node-mining` option.|
| --node-mining-public-key _key_ | Set the public key for a miner account in hexadecimal encoding. Account names typically use the prefix `k:` followed by the account public key. You can specify this option multiple times.|
 
## Synchronization and replay options

| Use this option | To do this |
| --------------- | ---------- |
| --only-sync-pact | Synchronize the Pact databases to the latest cut, then terminate the node process.|
| --no-only-sync-pact | Unset the `--only-sync-pact` option. |
| --read-only-replay | Replay the block history non-destructively.|
| --no-read-only-replay | Unset the `--read-only-replay` option.|
| --sync-pact-chains JSON list of chain ids | Specify a list of chain identifiers to synchronize in JSON format. If the list is empty or this option is unset, all chains are synchronized.|

## Backup options

| Use this option | To do this |
| --------------- | ---------- |
| --enable-backup-api | Enable the backup API.|
| --disable-backup-api | Disable the backup API.|
| --backup-directory _directory_ | Specify the directory where database backups are located when you use the `/make-backup` endpoint to start backup jobs.|                     

## Logging options

| Use this option | To do this |
| --------------- | ---------- |
| --log-level quiet|error|warn|info|debug | Set the logging level threshold for log messages.|
| --log-policy block|raise|discard | Select an option for how to deal with a congested logging pipeline.|
| --exception-limit _max_ | Set the maximum number of backend failures before the node should raise an exception.|
| --exception-wait _seconds_ | Set the time to wait in seconds after an backend failure has occurred.|
| --exit-timeout _seconds_ | Set the timeout for flushing the log message queue on exit.|
| -c, --color _color_ | Specify whether to use ANSI terminal colors in the log output.|
| --log-format _format_ | Specify the format to use for writing logs to the specified log output location. The log format can be `text` or `json`.|
| --log-handle _location_| Specify where the logs are written. Valid location are `stdout`, `stderr`, `file:filename`, or `es:[apikey]:URL`. |
| --enable-telemetry-logger | Enable the telemetry logger.|
| --disable-telemetry-logger | Disable the telemetry logger.|
| -c, --telemetry-color _color_ | Specify whether to use ANSI terminal colors in the output.|
| --telemetry-log-format _format_ | Specify the format to use for writing telemetry logs to the specified log output location. The log format can be `text` or `json`.|
| --telemetry-log-handle _location_| Specify where the logs are written. Valid location are `stdout`, `stderr`, `file\:filename`, or `es\:[apikey]:URL`. |
| --cluster-id _label_ | Specify a label to add to all log messages from this node.
| --log-filter-rule KEY\:VALUE\:LOGLEVEL[\:RATE]| Define a log filter rule. Log messages that match the filter rule are discarded if they don't meet the log level threshold you specify.|
| --log-filter-default LOGLEVEL:RATE | Define a default log filter. This filter is applied to all messages that don't match any other log filter rule.|
| --queue-size _max_ | Set the maximum size of the internal logger queue.|
