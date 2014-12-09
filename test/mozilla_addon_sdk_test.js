'use strict';

var grunt = require('grunt');
var path = require('path');

/*
  ======== A Handy Little Nodeunit Reference ========
  https://github.com/caolan/nodeunit

  Test methods:
    test.expect(numAssertions)
    test.done()
  Test assertions:
    test.ok(value, [message])
    test.equal(actual, expected, [message])
    test.notEqual(actual, expected, [message])
    test.deepEqual(actual, expected, [message])
    test.notDeepEqual(actual, expected, [message])
    test.strictEqual(actual, expected, [message])
    test.notStrictEqual(actual, expected, [message])
    test.throws(block, [error], [message])
    test.doesNotThrow(block, [error], [message])
    test.ifError(value)
*/

exports.mozilla_addon_sdk = {
  setUp: function(done) {
    // setup here if necessary
    done();
  },
  download: function(test) {
    test.expect(6);

    var addon_sdk_dirs = [
      path.resolve("tmp", "mozilla-addon-sdk", "addon-sdk-latest-official"),
      path.resolve("tmp", "mozilla-addon-sdk", "addon-sdk-master-github-mozilla")
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

    var xpi_build = path.resolve("tmp", "dist", "test-addon.xpi");
    test.ok(grunt.file.exists(xpi_build), "test-addon.xpi should be built into 'tmp/dist'");

    test.done();
  },
  custom_cmd: function(test) {
    test.expect(1);

    var test_result_file = path.resolve("tmp", "test_run.txt");
    test.ok(grunt.file.exists(test_result_file), "grunt mozilla-cfx:custom_cmd should run addon unit tests");
    test.done();
  }
};
