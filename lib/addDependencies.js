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

    if (!_.isUndefined(components.dependencies)) {
      depArray = depArray.concat(components.dependencies);
    }

  });

  // make array unique
  var uniqueDep = arrayUnique(depArray);

  return fileString.replace(/(?:angular\.module)(?:\(('|")(.*?)('|")\,\s*)(?:\[\s*\]\))/g, function (str) {

    return str.replace(/(?:\[\s*\]\))/g, function (squareBracketsString) {

      var splitString = squareBracketsString.split('\n');

      var depString = '\n';

      _.each(uniqueDep, function (dep) {
        depString += '\t\t\'' + dep + '\',\n';
      });

      depString = depString.substr(0, depString.lastIndexOf(',')) + '\n';
      splitString[1] = depString;
      return splitString.join('');

    });

  });

};

module.exports = addDependencies;
