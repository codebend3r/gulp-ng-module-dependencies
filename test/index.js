'use strict';

var should = require('chai').should(),
  expect = require('chai').expect,
  assert = require('chai').assert,
  through = require('through2'),
  path = require('path'),
  gutil = require('gulp-util'),
  _ = require('underscore-node'),
  fs = require('fs'),
  ngDependencies = require('../index');

describe('ng-module-dependencies', function () {

  var getFile = function (filePath) {
    return new gutil.File({
      path: filePath,
      cwd: __dirname,
      base: path.dirname(filePath),
      contents: fs.readFileSync(filePath)
    });
  };

  it('should be defined', function () {

    assert.isDefined(ngDependencies, 'ngDependencies is defined');

  });

  it('should inject 1 dependency properly formatted', function (cb) {

    var stream = ngDependencies({
      configJSON: './test/fixtures/in/config1.json'
    });

    stream.on('data', function (file) {

      var changedFile = file.contents.toString('utf8');

      assert.include(changedFile, 'angularMoment', 'string includes \'angularMoment\'');

      cb();

    });

    stream.write(getFile('./test/fixtures/in/expect1.js'));

  });

  it('should inject multiple dependencies properly formatted', function (cb) {

    var stream = ngDependencies({
      configJSON: './test/fixtures/in/config2.json'
    });

    stream.on('data', function (file) {

      var changedFile = file.contents.toString('utf8');

      assert.include(changedFile, 'angularMoment', 'string includes \'angularMoment\'');

      cb();

    });

    stream.write(getFile('./test/fixtures/in/expect2.js'));

  });



});
