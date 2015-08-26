Gulp Angular Module Dependencies
====================

> Will look for the angular.module setter defintion and inject dependencies based on config object.

![gulp-ng-module-dependencies build status](https://travis-ci.org/crivas/gulp-ng-module-dependencies.svg?branch=master)

Basic Example
```js

var moduleDependencies = require('gulp-ng-module-dependencies');

gulp.task('module-dependencies', function () {

  return gulp.src('app/js/**/*.js')
    .pipe(moduleDependencies({
      configJSON: './config.json'
    }))
    .pipe(gulp.dest('dist/js'))

});
```
