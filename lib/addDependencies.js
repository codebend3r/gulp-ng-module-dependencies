/**
 * Updated by crivas on 11/09/2015
 * Email: chester.rivas@gmail.com
 * Plugin Name: gulp-ng-module-dependencies
 */

'use strict';

var _ = require('underscore-node');
var arrayUnique = require('array-unique');

/**
 * adds dependencies
 * @param fileString
 * @param configJSON
 * @returns {object}
 */
var addDependencies = function (fileString, configJSON) {

  var depArray = [];

  _.each(configJSON.components, function (components) {

    if (!_.isUndefined(components.angularDependencies)) {
      depArray = depArray.concat(components.angularDependencies);
    }

  });

  // make array unique
  var uniqueDep = arrayUnique(depArray);

  return fileString.replace(/(?:angular\.module)(?:\(('|")(.*?)('|")\,\s*)(?:\[\s*\]\))/g, function (str) {

    var openSquareBracketIndex = str.indexOf('[');
    var closeSquareBracketIndex = str.indexOf(']');
    var part1 = str.slice(0, openSquareBracketIndex + 1);
    var part2 = '\t' + str.slice(closeSquareBracketIndex, str.length);
    var depString = '\n';

    _.each(uniqueDep, function (dep) {
      depString += '\t\t\'' + dep + '\',\n';
    });

    var finalString = part1 + depString + part2;

    return finalString;

  });

};

module.exports = addDependencies;
