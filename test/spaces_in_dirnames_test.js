'use strict';

var grunt = require('grunt');
var path = require('path');

exports.mozilla_addon_sdk = {
  download: function(test) {
    test.expect(3);

    var addon_sdk_dirs = [
      path.resolve("tmp", "Mozilla Addon SDK", "addon-sdk-latest-official"),
    ];

    addon_sdk_dirs.forEach(function(addon_sdk_dir) {
      test.ok(grunt.file.exists(addon_sdk_dir), "addon-sdk should be downloaded into " + addon_sdk_dir);
      test.ok(grunt.file.isDir(addon_sdk_dir), "should be a directory");
      test.ok(grunt.file.isFile(path.resolve(addon_sdk_dir, "bin", "activate")),
              "should contains 'bin/active' file");
    });

    test.done();
  },
  xpi: function (test) {
    test.expect(1);

    var xpi_build = path.resolve("tmp", "dist spacename", "test-addon-dirname-with-spaces.xpi");
    test.ok(grunt.file.exists(xpi_build), "test-addon.xpi should be built into 'tmp/dist'");

    test.done();
  }
};
