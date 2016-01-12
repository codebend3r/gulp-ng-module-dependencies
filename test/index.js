'use strict';

var chai = require('chai'),
  should = chai.should(),
  expect = chai.expect,
  assert = chai.assert,
  path = require('path'),
  gutil = require('gulp-util'),
  fs = require('fs'),
  startString = 'angular.module(\'test\', [',
  endString = ']);',
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

      expect(changedFile).to.have.string(startString);
      expect(changedFile).to.have.string(endString);
      expect(changedFile).to.not.have.string('ui.bootstrap');
      expect(changedFile).to.have.string('angularMoment');

      cb();

    });

    stream.write(getFile('./test/fixtures/in/emptyModule.js'));

  });

  it('should inject multiple dependencies properly formatted', function (cb) {

    var stream = ngDependencies({
      configJSON: './test/fixtures/in/config2.json'
    });

    stream.on('data', function (file) {

      var changedFile = file.contents.toString('utf8');

      expect(changedFile).to.have.string(startString);
      expect(changedFile).to.have.string(endString);

      expect(changedFile).to.have.string('ui.bootstrap');
      expect(changedFile).to.have.string('ui.router');
      expect(changedFile).to.have.string('tmh.dynamicLocale');
      expect(changedFile).to.have.string('angularMoment');
      expect(changedFile).to.have.string('oc.lazyLoad');
      expect(changedFile).to.have.string('ngTable');
      expect(changedFile).to.have.string('pascalprecht.translate');
      expect(changedFile).to.have.string('ngCookies');

      expect(changedFile).to.not.have.string('blah');

      cb();

    });

    stream.write(getFile('./test/fixtures/in/emptyModule.js'));

  });



});
