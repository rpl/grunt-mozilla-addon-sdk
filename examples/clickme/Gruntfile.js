/*
 * grunt-mozilla-addon-sdk
 * https://github.com/rpl/grunt-mozilla-addon-sdk
 *
 * Copyright (c) 2013 Luca Greco
 * Licensed under the MPL license.
 */

'use strict';

module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    // Before generating any new files, remove any previously-created files.
    clean: {
      tests: ['tmp'],
    },

    // Configuration to be run (and then tested).
    'mozilla-addon-sdk': {
      '1_16': {
        options: {
          revision: "1.16"
        }
      }
    },

    // custom cfx xpi
    'mozilla-cfx-xpi': {
      'release': {
        options: {
          "mozilla-addon-sdk": "1_16",
          extension_dir: "./src",
          dist_dir: "tmp/dist",
          arguments: "--strip-sdk" // builds smaller xpis 
        }
      }
    },

    // custom cfx command run
    'mozilla-cfx': {
      run: {
        options: {
          "mozilla-addon-sdk": "1_16",
          extension_dir: "./src",
          command: 'run',
          // arguments: '-b /usr/local/bin/firefox-nightly -p /tmp/PROFILE_REUSED'
        }
      }
    }
  });

  // These plugins provide necessary tasks.
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-mozilla-addon-sdk');

  // Whenever the "test" task is run, first clean the "tmp" dir, then run this
  // plugin's task(s), then test the result.
  grunt.registerTask('build_xpi', ['clean', 'mozilla-addon-sdk', 'mozilla-cfx-xpi']);

  // By default, lint and run all tests.
  grunt.registerTask('run_xpi', ['mozilla-addon-sdk', 'mozilla-cfx:run']);

};
