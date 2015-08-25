/**
 * Updated by crivas on 08/25/2015
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

  var uteJSON;

  if (!_.isUndefined(options.uteJSON)) {
    if (typeof options.uteJSON === 'string') {
      uteJSON = jsonfile.readFileSync(options.uteJSON);
    } else if (typeof options.uteJSON === 'object') {
      uteJSON = options.uteJSON;
    }
  }

  /**
   * adds dependencies
   * @param object
   * @returns {object}
   */
  var addDependencies = function (object) {

    var depArray = [];

    _.each(uteJSON.components, function(components) {

      depArray = depArray.concat(components.dependencies);

    });

    // make array unique
    var uniqueDep = arrayUnique(depArray);

    return object.replace(/(?:angular\.module)(?:\(('|")(.*?)('|")\,\s\[\n+\]\))/g, function (str) {

      return str.replace(/\[\n+\]/g, function(depInnerString) {

        var splitString = depInnerString.split('\n');

        var depString = '\n';

        _.each(uniqueDep, function(dep) {
          depString += '\t\'' + dep + '\'\n';
        });

        splitString[1] = depString;

        var joinedFile = splitString.join('');
        gutil.log('> dependencies', gutil.colors.cyan(joinedFile));
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

      this.emit('error', new gutil.PluginError('gulp-module-dependencies', 'Streams are not supported!'));
      callback();

    } else if (file.isNull()) {

      callback(null, file); // Do nothing if no contents

    } else {

      var ctx = file.contents.toString('utf8'),
        modulesString = addDependencies(ctx);

      console.log('> modulesString', modulesString);
      console.log('> modulesString JSON', JSON.stringify(modulesString));        

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
