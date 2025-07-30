# cli2

Tic Tac Toe

[![oclif](https://img.shields.io/badge/cli-oclif-brightgreen.svg)](https://oclif.io)
[![Version](https://img.shields.io/npm/v/cli2.svg)](https://npmjs.org/package/cli2)
[![Downloads/week](https://img.shields.io/npm/dw/cli2.svg)](https://npmjs.org/package/cli2)

<!-- toc -->

- [Usage](#usage)
- [Commands](#commands)
<!-- tocstop -->

# Usage

<!-- usage -->

```sh-session
$ npm install -g cli2
$ t3 COMMAND
running command...
$ t3 (--version)
cli2/0.0.0 darwin-arm64 node-v22.17.1
$ t3 --help [COMMAND]
USAGE
  $ t3 COMMAND
...
```

<!-- usagestop -->

# Commands

<!-- commands -->

- [`t3 game`](#t3-game)
- [`t3 hello PERSON`](#t3-hello-person)
- [`t3 hello world`](#t3-hello-world)
- [`t3 help [COMMAND]`](#t3-help-command)
- [`t3 plugins`](#t3-plugins)
- [`t3 plugins add PLUGIN`](#t3-plugins-add-plugin)
- [`t3 plugins:inspect PLUGIN...`](#t3-pluginsinspect-plugin)
- [`t3 plugins install PLUGIN`](#t3-plugins-install-plugin)
- [`t3 plugins link PATH`](#t3-plugins-link-path)
- [`t3 plugins remove [PLUGIN]`](#t3-plugins-remove-plugin)
- [`t3 plugins reset`](#t3-plugins-reset)
- [`t3 plugins uninstall [PLUGIN]`](#t3-plugins-uninstall-plugin)
- [`t3 plugins unlink [PLUGIN]`](#t3-plugins-unlink-plugin)
- [`t3 plugins update`](#t3-plugins-update)

## `t3 game`

Play a game of Tic-Tac-Toe

```
USAGE
  $ t3 game [-m human-vs-human|human-vs-ai|ai-vs-ai] [-h]

FLAGS
  -h, --help           Show CLI help.
  -m, --mode=<option>  [default: human-vs-ai] Game mode
                       <options: human-vs-human|human-vs-ai|ai-vs-ai>

DESCRIPTION
  Play a game of Tic-Tac-Toe

EXAMPLES
  $ t3 game --mode human-vs-human

  $ t3 game --mode human-vs-ai

  $ t3 game --mode ai-vs-ai
```

_See code: [src/commands/game/index.ts](https://github.com/jpshack-at-palomar/all-hands-t3/blob/v0.0.0/src/commands/game/index.ts)_

## `t3 hello PERSON`

Say hello

```
USAGE
  $ t3 hello PERSON -f <value>

ARGUMENTS
  PERSON  Person to say hello to

FLAGS
  -f, --from=<value>  (required) Who is saying hello

DESCRIPTION
  Say hello

EXAMPLES
  $ t3 hello friend --from oclif
  hello friend from oclif! (./src/commands/hello/index.ts)
```

_See code: [src/commands/hello/index.ts](https://github.com/jpshack-at-palomar/all-hands-t3/blob/v0.0.0/src/commands/hello/index.ts)_

## `t3 hello world`

Say hello world

```
USAGE
  $ t3 hello world

DESCRIPTION
  Say hello world

EXAMPLES
  $ t3 hello world
  hello world! (./src/commands/hello/world.ts)
```

_See code: [src/commands/hello/world.ts](https://github.com/jpshack-at-palomar/all-hands-t3/blob/v0.0.0/src/commands/hello/world.ts)_

## `t3 help [COMMAND]`

Display help for t3.

```
USAGE
  $ t3 help [COMMAND...] [-n]

ARGUMENTS
  COMMAND...  Command to show help for.

FLAGS
  -n, --nested-commands  Include all nested commands in the output.

DESCRIPTION
  Display help for t3.
```

_See code: [@oclif/plugin-help](https://github.com/oclif/plugin-help/blob/v6.2.32/src/commands/help.ts)_

## `t3 plugins`

List installed plugins.

```
USAGE
  $ t3 plugins [--json] [--core]

FLAGS
  --core  Show core plugins.

GLOBAL FLAGS
  --json  Format output as json.

DESCRIPTION
  List installed plugins.

EXAMPLES
  $ t3 plugins
```

_See code: [@oclif/plugin-plugins](https://github.com/oclif/plugin-plugins/blob/v5.4.46/src/commands/plugins/index.ts)_

## `t3 plugins add PLUGIN`

Installs a plugin into t3.

```
USAGE
  $ t3 plugins add PLUGIN... [--json] [-f] [-h] [-s | -v]

ARGUMENTS
  PLUGIN...  Plugin to install.

FLAGS
  -f, --force    Force npm to fetch remote resources even if a local copy exists on disk.
  -h, --help     Show CLI help.
  -s, --silent   Silences npm output.
  -v, --verbose  Show verbose npm output.

GLOBAL FLAGS
  --json  Format output as json.

DESCRIPTION
  Installs a plugin into t3.

  Uses npm to install plugins.

  Installation of a user-installed plugin will override a core plugin.

  Use the T3_NPM_LOG_LEVEL environment variable to set the npm loglevel.
  Use the T3_NPM_REGISTRY environment variable to set the npm registry.

ALIASES
  $ t3 plugins add

EXAMPLES
  Install a plugin from npm registry.

    $ t3 plugins add myplugin

  Install a plugin from a github url.

    $ t3 plugins add https://github.com/someuser/someplugin

  Install a plugin from a github slug.

    $ t3 plugins add someuser/someplugin
```

## `t3 plugins:inspect PLUGIN...`

Displays installation properties of a plugin.

```
USAGE
  $ t3 plugins inspect PLUGIN...

ARGUMENTS
  PLUGIN...  [default: .] Plugin to inspect.

FLAGS
  -h, --help     Show CLI help.
  -v, --verbose

GLOBAL FLAGS
  --json  Format output as json.

DESCRIPTION
  Displays installation properties of a plugin.

EXAMPLES
  $ t3 plugins inspect myplugin
```

_See code: [@oclif/plugin-plugins](https://github.com/oclif/plugin-plugins/blob/v5.4.46/src/commands/plugins/inspect.ts)_

## `t3 plugins install PLUGIN`

Installs a plugin into t3.

```
USAGE
  $ t3 plugins install PLUGIN... [--json] [-f] [-h] [-s | -v]

ARGUMENTS
  PLUGIN...  Plugin to install.

FLAGS
  -f, --force    Force npm to fetch remote resources even if a local copy exists on disk.
  -h, --help     Show CLI help.
  -s, --silent   Silences npm output.
  -v, --verbose  Show verbose npm output.

GLOBAL FLAGS
  --json  Format output as json.

DESCRIPTION
  Installs a plugin into t3.

  Uses npm to install plugins.

  Installation of a user-installed plugin will override a core plugin.

  Use the T3_NPM_LOG_LEVEL environment variable to set the npm loglevel.
  Use the T3_NPM_REGISTRY environment variable to set the npm registry.

ALIASES
  $ t3 plugins add

EXAMPLES
  Install a plugin from npm registry.

    $ t3 plugins install myplugin

  Install a plugin from a github url.

    $ t3 plugins install https://github.com/someuser/someplugin

  Install a plugin from a github slug.

    $ t3 plugins install someuser/someplugin
```

_See code: [@oclif/plugin-plugins](https://github.com/oclif/plugin-plugins/blob/v5.4.46/src/commands/plugins/install.ts)_

## `t3 plugins link PATH`

Links a plugin into the CLI for development.

```
USAGE
  $ t3 plugins link PATH [-h] [--install] [-v]

ARGUMENTS
  PATH  [default: .] path to plugin

FLAGS
  -h, --help          Show CLI help.
  -v, --verbose
      --[no-]install  Install dependencies after linking the plugin.

DESCRIPTION
  Links a plugin into the CLI for development.

  Installation of a linked plugin will override a user-installed or core plugin.

  e.g. If you have a user-installed or core plugin that has a 'hello' command, installing a linked plugin with a 'hello'
  command will override the user-installed or core plugin implementation. This is useful for development work.


EXAMPLES
  $ t3 plugins link myplugin
```

_See code: [@oclif/plugin-plugins](https://github.com/oclif/plugin-plugins/blob/v5.4.46/src/commands/plugins/link.ts)_

## `t3 plugins remove [PLUGIN]`

Removes a plugin from the CLI.

```
USAGE
  $ t3 plugins remove [PLUGIN...] [-h] [-v]

ARGUMENTS
  PLUGIN...  plugin to uninstall

FLAGS
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Removes a plugin from the CLI.

ALIASES
  $ t3 plugins unlink
  $ t3 plugins remove

EXAMPLES
  $ t3 plugins remove myplugin
```

## `t3 plugins reset`

Remove all user-installed and linked plugins.

```
USAGE
  $ t3 plugins reset [--hard] [--reinstall]

FLAGS
  --hard       Delete node_modules and package manager related files in addition to uninstalling plugins.
  --reinstall  Reinstall all plugins after uninstalling.
```

_See code: [@oclif/plugin-plugins](https://github.com/oclif/plugin-plugins/blob/v5.4.46/src/commands/plugins/reset.ts)_

## `t3 plugins uninstall [PLUGIN]`

Removes a plugin from the CLI.

```
USAGE
  $ t3 plugins uninstall [PLUGIN...] [-h] [-v]

ARGUMENTS
  PLUGIN...  plugin to uninstall

FLAGS
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Removes a plugin from the CLI.

ALIASES
  $ t3 plugins unlink
  $ t3 plugins remove

EXAMPLES
  $ t3 plugins uninstall myplugin
```

_See code: [@oclif/plugin-plugins](https://github.com/oclif/plugin-plugins/blob/v5.4.46/src/commands/plugins/uninstall.ts)_

## `t3 plugins unlink [PLUGIN]`

Removes a plugin from the CLI.

```
USAGE
  $ t3 plugins unlink [PLUGIN...] [-h] [-v]

ARGUMENTS
  PLUGIN...  plugin to uninstall

FLAGS
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Removes a plugin from the CLI.

ALIASES
  $ t3 plugins unlink
  $ t3 plugins remove

EXAMPLES
  $ t3 plugins unlink myplugin
```

## `t3 plugins update`

Update installed plugins.

```
USAGE
  $ t3 plugins update [-h] [-v]

FLAGS
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Update installed plugins.
```

_See code: [@oclif/plugin-plugins](https://github.com/oclif/plugin-plugins/blob/v5.4.46/src/commands/plugins/update.ts)_

<!-- commandsstop -->
