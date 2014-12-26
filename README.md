# grunt-mozilla-addon-sdk

> Download and Run Mozilla Addon SDK

## Getting Started
This plugin requires Grunt `~0.4.1`

If you haven't used [Grunt](http://gruntjs.com/) before, be sure to check out the [Getting Started](http://gruntjs.com/getting-started) guide, as it explains how to create a [Gruntfile](http://gruntjs.com/sample-gruntfile) as well as install and use Grunt plugins. Once you're familiar with that process, you may install this plugin with this command:

```shell
npm install grunt-mozilla-addon-sdk --save-dev
```

Once the plugin has been installed, it may be enabled inside your Gruntfile with this line of JavaScript:

```js
grunt.loadNpmTasks('grunt-mozilla-addon-sdk');
```

## The "mozilla-addon-sdk" tasks

### Overview
In your project's Gruntfile, add a section named `mozilla-addon-sdk` to the data object passed into `grunt.initConfig()` to define a Mozilla Addon SDK to download and use, a section named `mozilla-cfx-xpi` to define the xpi building tasks and a section named `mozilla-cfx`` to define arbitrary cfx commands to run (e.g. `cfx run` to try your extension in a temporary profile and `cfx test` to run your test cases)

```js
grunt.initConfig({
  "mozilla-addon-sdk": {
    'latest': {
      options: {
        // revision: "latest", // default official revision
        dest_dir: "build_tools/"
      }
    },
    '1_14': {
      options: {
        revision: "1.14",
        dest_dir: "build_tools/"
      }
    },
    'master': {
      options: {
        revision: "master",
        github: true,
        // github_user: "mozilla" // default value
        // dest_dir: "tmp/mozilla-addon-sdk"  //  default value
      }
    }
  },
  "mozilla-cfx-xpi": {
    'stable': {
      options: {
        "mozilla-addon-sdk": "latest",
        extension_dir: "ff_extension",
        dist_dir: "tmp/dist-stable"
      }
    },
    'experimental': {
      options: {
        "mozilla-addon-sdk": "master",
        extension_dir: "ff_extension",
        dist_dir: "tmp/dist-experimental",
        strip_sdk: false // true by default
      }
    },
  },
  "mozilla-cfx": {
    'run_stable': {
      options: {
        "mozilla-addon-sdk": "1_14",
        extension_dir: "ff_extension",
        command: "run"
      }
    },
    'run_experimental': {
      options: {
        "mozilla-addon-sdk": "master",
        extension_dir: "ff_extension",
        command: "run",
        pipe_output: true
      }
    }
  }
});
```

Custom cfx command could be defined using a section named `mozilla-cfx`:

```js
grunt.initConfig({
  "mozilla-addon-sdk": {
    "1_14": {
      ...
    }
  },
  "mozilla-cfx": {
    custom_command: {
      options: {
        "mozilla-addon-sdk": "1_14",
        extension_dir: "ff_extension",
        command: "run",
        arguments: "-b /usr/bin/firefox-nightly -p /tmp/PROFILE_REUSED"
      }
    }
  }
})
```

**NOTE**: all tasks use `FIREFOX_BIN` and `FIREFOX_PROFILE` environment variables, if defined, to customize the Firefox binary and Firefox profile dir used to run or test the extension.

### mozilla-addon-sdk

"mozilla-addon-sdk" is a grunt multi-task which supports the following task options

#### revision
Type: `String`
Default value: `undefined`

A string value that is used as the Mozilla Addon SDK revision to download and use to
build addon xpi.

#### github
Type: `Bool`
Default value: `false`

A boolean value used to download a Mozilla Addon SDK from a github repo archive.

By default its value is false (addon-sdk archive downloaded from official
ftp.mozilla.org releases), set it to true if you want to use a development release
from github.

#### github_user
Type: `String`
Default value: `mozilla`

A string value used as Github User for addon-sdk github archive to downloads, it could
be used to use a different github fork of the original mozilla addon-sdk repo.

#### dest_dir
Type: `String`
Default value: `tmp/mozilla-addon-sdk`

A string value used as the path where the github repo of this addon-sdk will be cloned.

### mozilla-cfx-xpi

"mozilla-cfx-xpi" is a grunt multi-task which builds addon xpi archives using the
available addon-sdk revisions.

#### mozilla-addon-sdk
Type: `String`
Default value: `null`

A string value used to set the addon-sdk (as named in the "mozilla-addon-sdk" section) to
be used to create the xpi archive.

#### extension_dir
Type: `String`
Default value: `null`

A string value that is used as the path which contains the addon extension to build.

#### dist_dir
Type: `String`
Default value: `null`

A string value that is used as the path where the generated addon xpi should be moved.

#### strip_sdk
Type: `Bool`
Default value: `true`

A boolean value that is used to configure if addon-sdk bundled modules will be stripped from or bundled in the xpi.

NOTE:
- 'strip_sdk == true' (default) is like "cfx --strip-sdk REST_ARGS"
- 'strip_sdk == false' is like "cfx --no-strip-xpi  --force-use-bundled-sdk REST_ARGS"

#### pipe_output
Type `Bool`
Default value: `null`

A boolean value that is used to enable/disable print cfx commands output

### mozilla-cfx

"mozilla-cfx" is a grunt multi-task which run cfx command line tool on a extension
directory using the available addon-sdk revisions.

#### "mozilla-addon-sdk"
Type: `String`
Default value: `null`

A string value used to set the addon-sdk (as named in the "mozilla-addon-sdk" section) to
be used to run the defined cfx command.

#### extension_dir
Type: `String`
Default value: `null`

A string value that is used as the path which contains the addon extension to build.

#### command
Type: `String`
Default value: `null`

A string value that is used as the cfx command to run.

#### arguments
Type: `String`

A string value that is used to pass arguments to the cfx command to run.

#### pipe_output
Type `Bool`
Default value: `null`

A boolean value that is used to enable/disable print cfx commands output

### Usage Examples

#### Download and unpack Mozilla Addon SDK:

```
$ grunt mozilla-addon-sdk
Running "mozilla-addon-sdk:1_14" (mozilla-addon-sdk) task
Downloading: https://ftp.mozilla.org/pub/mozilla.org/labs/jetpack/addon-sdk-1.14.tar.gz

Running "mozilla-addon-sdk:master" (mozilla-addon-sdk) task
Downloading: https://github.com/mozilla/addon-sdk/archive/master.tar.gz

Done, without errors.
```

#### Generate addon XPI

```
$ grunt mozilla-cfx-xpi
Running "mozilla-cfx-xpi:release" (mozilla-cfx-xpi) task
Creating dist dir '/home/rpl/PROJECTS/2013/MOZILLA/DEVTOOLS-EXT/grunt-mozilla-addon-sdk/tmp/dist'...
Creating xpi...
Generated XPI: /home/rpl/PROJECTS/2013/MOZILLA/DEVTOOLS-EXT/grunt-mozilla-addon-sdk/tmp/dist/test-addon.xpi

Done, without errors.
```

## Release History

- 0.4.0 - download the latest stable released addon-sdk (by default), strip sdk from xpi by default (**strip_sdk** option), pipe commands output (**pipe_output** option)
- 0.3.2 - fix issues handling space chars in the paths
- 0.3.1 - use `FIREFOX_BIN` and `FIREFOX_PROFILE` environment variables in `cfx` helper
- 0.3.0 - support multiple addon-sdk (NOTE: config syntax changes)
- 0.2.0 - added windows support and custom cfx command using 'mozilla-cfx' grunt multi-task
- 0.1.0 - initial release (download and xpi sub-tasks)
