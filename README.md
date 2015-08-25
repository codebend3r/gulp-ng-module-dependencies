Gulp Angular Module Dependencies
====================

> Automatically defines dependencies and constants

Example

    var moduleDependencies = require('gulp-ng-module-dependencies');

    gulp.task('module-dependencies', function () {

      return gulp.src(['app.js'])
        .pipe(moduleDependencies())
        .pipe(gulp.dest('/output'))

    });
