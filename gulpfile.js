'use strict';

const gulp = require('gulp');
const concat = require('gulp-concat');
const babel = require('gulp-babel');

gulp.task('build:js', function () {
  return gulp.src([ 'bower_components/pool.js/src/Pool.js', 'src/*.js'])
    .pipe(babel())
    .pipe(concat('index.js'))
    .pipe(gulp.dest('dist'));
});

gulp.task('watch:js', function () {
  gulp.watch('src/*.js', [ 'build:js' ]);
});

gulp.task('default', [ 'watch:js' ]);
