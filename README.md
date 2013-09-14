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
In your project's Gruntfile, add a section named `mozilla-addon-sdk` to the data object passed into `grunt.initConfig()`.

```js
grunt.initConfig({
  "mozilla-addon-sdk": {
    download: {
      options: {
        revision: "firefox26"
      },
    }
    xpi: {
      options: {
        extension_dir: "ff_extension",
        dist_dir: "tmp/dist"
      }
    },
  },
})
```

### Options

#### download.options.revision
Type: `String`
Default value: `'master'`

A string value that is used as the Mozilla Addon SDK revision to download and use to
build addon xpi.

#### xpi.options.extension_dir
Type: `String`
Default value: `null`

A string value that is used as the path which contains the addon extension to build.

#### xpi.options.dist_dir
Type: `String`
Default value: `null`

A string value that is used as the path where the generated addon xpi should be moved.

### Usage Examples

#### Download and unpack Mozilla Addon SDK:

```
$ grunt mozilla-addon-sdk:download
Running "mozilla-addon-sdk:download" (mozilla-addon-sdk) task
Downloading: https://github.com/mozilla/addon-sdk/archive/master.tar.gz

Done, without errors.
```

#### Generate addon XPI

```
$ grunt mozilla-addon-sdk:xpi
Running "mozilla-addon-sdk:xpi" (mozilla-addon-sdk) task
Creating dist dir '/home/rpl/PROJECTS/MOZILLA/grunt-mozilla-addon-sdk/tmp/dist'...
Creating xpi...

Done, without errors.
```

## Release History

- 0.1.0 - initial release (download and xpi sub-tasks)
