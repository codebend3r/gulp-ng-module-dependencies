/**
 * Updated by crivas on 09/17/2015
 * Email: chester.rivas@gmail.com
 * Plugin Name: gulp-ng-module-dependencies
 */

'use strict';

var jsonfile = require('jsonfile'),
  addDependencies = require('./lib/addDependencies'),
  fs = require('fs'),
  through = require('through2'),
  gutil = require('gulp-util'),
  _ = require('underscore-node');

/**
 * gulp task to be piped in
 * @param options
 * @returns {*}
 */
var moduleDependencies = function (options) {

  options = options || {};

  var configJSON;

  if (!_.isUndefined(options.configJSON)) {
    if (typeof options.configJSON === 'string') {
      configJSON = jsonfile.readFileSync(options.configJSON);
    } else if (typeof options.configJSON === 'object') {
      configJSON = options.configJSON;
    }
  }

  /**
   * buffer each content
   * @param file
   * @param enc
   * @param callback
   */
  var bufferedContents = function (file, enc, callback) {

    if (file.isStream()) {

      this.emit('error', new gutil.PluginError('gulp-ng-module-dependencies', 'Streams are not supported!'));
      callback();

    } else if (file.isNull()) {

      callback(null, file); // Do nothing if no contents

    } else {

      var ctx = file.contents.toString('utf8'),
        modulesString = addDependencies(ctx, configJSON);

      file.contents = new Buffer(modulesString);
      callback(null, file);

    }

  };

  /**
   * returns streamed content
   */
  return through.obj(bufferedContents);

};

module.exports = moduleDependencies;
