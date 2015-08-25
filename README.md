Gulp Module Dependencies
====================

Automatically defines dependencies and constants


    var moduleDependencies = require('gulp-module-dependencies');

    gulp.task('module-dependencies', function () {

      return gulp.src(['app.js'])
        .pipe(moduleDependencies())
        .pipe(gulp.dest('/output'))

    });
