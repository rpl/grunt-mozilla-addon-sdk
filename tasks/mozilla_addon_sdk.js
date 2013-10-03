/*
 * grunt-mozilla-addon-sdk
 * https://github.com/rpl/grunt-mozilla-addon-sdk
 *
 * Copyright (c) 2013 Luca Greco
 * Licensed under the MPL license.
 */

'use strict';

var path = require('path'),
    fs = require('fs'),
    request = require('request'),
    Q = require('q'),
    targz = require('tar.gz'),
    mv = require('mv');

var defaults = {
  download: {
    options: {
      revision: "master",
      base_download_url: "https://github.com/mozilla/addon-sdk/archive",
      dest_dir: "./tmp/mozilla-addon-sdk"
    }
  },
  xpi: {
    options: {
      arguments: null,
      extension_dir: null
    }
  }
};

function cfx(grunt, ext_dir, cfx_cmd, cfx_args) {
  var sdk_dir = path.resolve(grunt.config('mozilla-addon-sdk').download.options.dest_dir,
                             "addon-sdk");
  var completed = Q.defer();
  var scriptFilename = process.platform.match(/^win/) ? 'cfx.bat' : 'cfx.sh';
  var xpi_script = path.resolve(__dirname, '..', 'scripts', scriptFilename);

  var package_json = path.resolve(ext_dir, "package.json");
  var error;

  if (!grunt.file.exists(package_json)) {
    error = new Error("package.json doesn't exist");
  }

  if (error) {
    completed.reject(error);
    return completed.promise;
  }

  grunt.log.debug(["Running cfx", cfx_cmd, cfx_args].join(' '));
  
  var args = [
      sdk_dir,
      ext_dir,
      cfx_cmd
    ];
  if (cfx_args) args.push(cfx_args);
  
  grunt.util.spawn({
    cmd: xpi_script,
    opts: grunt.option("debug") ? {stdio: 'inherit'} : {},
    args: args,
  }, function (error, result, code) {
    if (error) {
      completed.reject(error);
    } else {
      completed.resolve();
    }
  });

  return completed.promise;
}

function xpi(grunt, options) {
  var ext_dir = path.resolve(options.extension_dir);
  var dist_dir = path.resolve(options.dist_dir);
  var cfx_args = options.arguments;
  var completed = Q.defer();

  grunt.log.writeln("Creating dist dir '" + dist_dir + "'...");

  grunt.file.mkdir(dist_dir);

  grunt.log.writeln("Creating xpi...");

  cfx(grunt, ext_dir, "xpi", cfx_args).
    then(function () {
      var xpi_files = grunt.file.expand(options.extension_dir + "/*.xpi");

      if (xpi_files.length === 0) {
        var no_xpi_error = new Error("no xpi found");
        completed.reject(no_xpi_error);
        return;
      }

      if (xpi_files.length > 1) {
        grunt.log.warn('There was more than one xpi: ', xpi_files);
      }

      var dist_xpi = path.resolve(dist_dir, path.basename(xpi_files[0]));
      mv(path.resolve(xpi_files[0]),
         dist_xpi,
         function () {
           grunt.log.writeln("Generated XPI:", dist_xpi);
           completed.resolve();
         });
    }).
    catch(function (error) {
      completed.reject(error);
    });

  return completed.promise;
}

function download(grunt, options) {
  var completed = Q.defer();

  if (grunt.file.exists(path.resolve(options.dest_dir, "addon-sdk"))) {
    grunt.log.writeln("Mozilla Addon SDK already downloaded");
    completed.resolve();
    return completed.promise;
  }

  grunt.file.mkdir(options.dest_dir);

  var destFilePath = path.resolve(options.dest_dir, "archive.tar.gz"),
      destFileStream = fs.createWriteStream(destFilePath),
      downloadUrl = [options.base_download_url, options.revision + ".tar.gz"].join("/"),
      downloadRequest = request(downloadUrl);

  grunt.log.writeln('Downloading: ' + downloadUrl);

  destFileStream.on('close', function() {
    new targz().extract(destFilePath, options.dest_dir, function (error) {
      grunt.file.delete(destFilePath);
      if (error) {
        grunt.log.error(error);
        grunt.fail.warn('There was an error while extracting.');
        completed.reject(error);
      } else {
        mv(path.resolve(options.dest_dir, "addon-sdk-" + options.revision),
                      path.resolve(options.dest_dir, "addon-sdk"), completed.resolve);
      }
    });
  });

  destFileStream.on('error', function(error) {
    grunt.log.error(error);
    grunt.fail.warn('Download write failed.');
    completed.reject(error);
  });

  downloadRequest.on('error', function(error) {
    grunt.log.error(error);
    grunt.fail.warn('There was an error while downloading.');
    completed.reject(error);
  });

  downloadRequest.pipe(destFileStream);

  return completed.promise;
}

module.exports = function(grunt) {
  var config = grunt.config.get();

  if (!config.hasOwnProperty('mozilla-addon-sdk')) {
    // put defaults
    grunt.config('mozilla-addon-sdk', defaults);
  } else {
    // merge defaults
    var options = {};
    grunt.util._.merge(options, defaults);
    grunt.util._.merge(options, grunt.config('mozilla-addon-sdk'));
    grunt.config('mozilla-addon-sdk', options);
  }

  // reload config
  config = grunt.config.get();

  grunt.registerMultiTask('mozilla-addon-sdk', 'Download and Run Mozilla Addon SDK', function() {
    var options = this.options();
    var done = this.async();

    switch (this.target) {
    case "download":
      download(grunt, options).
        then(done).
        catch(function (error) {
          grunt.fail.warn('There was an error running mozilla-addon-sdk:download. ' + error);
          done();
        });
      break;
    case "xpi":
      grunt.config.requires("mozilla-addon-sdk.xpi.options.extension_dir");
      grunt.config.requires("mozilla-addon-sdk.xpi.options.dist_dir");
      xpi(grunt, options).
        then(done).
        catch(function (error) {
          grunt.fail.warn('There was an error running mozilla-addon-sdk:xpi. ' + error);
          done();
        });
      break;
    }
  });

  grunt.registerMultiTask('mozilla-cfx', 'Run Mozilla Addon SDK command line tool', function() {
    var options = this.options();
    var done = this.async();

    grunt.config.requires(["mozilla-cfx",this.target,"options","extension_dir"].join('.'));
    grunt.config.requires(["mozilla-cfx",this.target,"options","command"].join('.'));

    cfx(grunt, path.resolve(options.extension_dir),
        options.command, options.arguments).
      then(done).
      catch(function (error) {
        grunt.fail.warn('There was an error running mozilla-cfx. ' + error);
        done();
      });
  });
};
