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
      extension_dir: null
    }
  }
};

function xpi(grunt, options) {
  var sdk_dir = path.resolve(grunt.config('mozilla-addon-sdk').download.options.dest_dir,
                             "addon-sdk");
  var ext_dir = path.resolve(options.extension_dir);
  var dist_dir = path.resolve(options.dist_dir);
  var completed = Q.defer();
  var scriptFilename = process.platform.match(/^win/) ? 'xpi.bat' : 'xpi.sh';
  var xpi_script = path.resolve(__dirname, '..', 'scripts', scriptFilename);

  var package_json = path.resolve(ext_dir, "package.json");
  var error;

  if (!grunt.file.exists(package_json)) {
    error = new Error("package.json doesn't exist");
  }

  if (error) {
    grunt.log.error(error);
    grunt.fail.warn('There was an error while generating xpi.');
    completed.reject(error);
    return completed.promise;
  }

  grunt.log.writeln("Creating dist dir '" + dist_dir + "'...");

  grunt.file.mkdir(dist_dir);

  grunt.log.writeln("Creating xpi...");

  grunt.util.spawn({
    cmd: xpi_script,
    args: [
      sdk_dir,
      ext_dir
    ],
    opts: []
  }, function (error, result, code) {
    if (error) {
      grunt.log.error(error);
      grunt.fail.warn('There was an error while generating xpi.');
      completed.reject(error);
    } else {
      var xpi_files = grunt.file.expand(options.extension_dir + "/*.xpi");

      if (xpi_files.length === 0) {
        var no_xpi_error = new Error("no xpi found");
        grunt.log.error(no_xpi_error);
        grunt.fail.warn('There was an error while generating xpi.');
        completed.reject(no_xpi_error);
        return;
      }

      if (xpi_files.length > 1) {
        grunt.log.warn('There was more than one xpi: ', xpi_files);
      }

      mv(path.resolve(xpi_files[0]),
         path.resolve(dist_dir, path.basename(xpi_files[0])),
         completed.resolve);
    }
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
      download(grunt, options).then(done);
      break;
    case "xpi":
      grunt.config.requires("mozilla-addon-sdk.xpi.options.extension_dir");
      grunt.config.requires("mozilla-addon-sdk.xpi.options.dist_dir");
      xpi(grunt, options).then(done);
      break;
    }
  });
};
