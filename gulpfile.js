'use strict';

const gulp = require('gulp');
const babel = require('gulp-babel');

gulp.task('build:js', function () {
  return gulp.src('index.es6')
    .pipe(babel())
    .pipe(gulp.dest('.'));
});

gulp.task('watch:js', function () {
  gulp.watch('index.es6', [ 'build:js' ]);
});

gulp.task('default', [ 'watch:js' ]);
