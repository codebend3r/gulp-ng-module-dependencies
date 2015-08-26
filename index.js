/**
 * Updated by crivas on 08/26/2015
 * Email: chester.rivas@gmail.com
 * Plugin Name: gulp-ng-module-dependencies
 */

'use strict';

var jsonfile = require('jsonfile'),
  arrayUnique = require('array-unique'),
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
   * adds dependencies
   * @param object
   * @returns {object}
   */
  var addDependencies = function (object) {

    var depArray = [];

    _.each(configJSON.components, function (components) {

      depArray = depArray.concat(components.dependencies);

    });

    // make array unique
    var uniqueDep = arrayUnique(depArray);

    return object.replace(/(?:angular\.module)(?:\(('|")(.*?)('|")\,\s*)(?:\[\s*\]\))/g, function (str) {

      return str.replace(/(?:\[\s*\]\))/g, function (squareBracketsString) {

        var splitString = squareBracketsString.split('\n');

        var depString = '\n';

        _.each(uniqueDep, function (dep) {
          depString += '\t\t\'' + dep + '\',\n';
        });

        depString = depString.substr(0, depString.lastIndexOf(',')) + '\n';
        splitString[1] = depString;
        var joinedFile = splitString.join('');
        return joinedFile;

      });

    });

  };

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
        modulesString = addDependencies(ctx);

      gutil.log('module setter:', modulesString);

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
