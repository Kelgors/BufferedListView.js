'use strict';

const gulp = require('gulp');
const babel = require('gulp-babel');
const replace = require('gulp-replace');
const uglify = require('gulp-uglifyjs');
const concat = require('gulp-concat');

const moduleTypes = [ 'amd', 'systemjs', 'commonjs' ];
const sourceFiles = [ 'bower_components/pool.js/src/Pool.js', 'src/*.js'];

const defaultConfig = {
  moduleIds: false
};

const modulesBabelConfig = mergeObjectDeeply({
  moduleIds: true,
  plugins: [ "transform-runtime" ]
});

function mergeObjectDeeply(a, b) {
  a = Object.assign({}, a);
  for (const key in b) {
    if (!(key in a) || !a[key]) {
      a[key] = b[key];
    } else if (Array.isArray(a[key]) && Array.isArray(b[key])) {
      a[key]= a[key].concat(b[key]);
    } else if (a[key] && b[key] && a[key].constructor === Object && b[key].constructor === Object) {
      mergeObjectDeeply(a[key], b[key]);
    } else if (key in b) {
      a[key] = b[key];
    }
  }
  return a;
}

const buildJsTasks = [ 'build:js:globals', 'build:js:globals:min' ];

moduleTypes.forEach((type) => {
  const config = mergeObjectDeeply(modulesBabelConfig, { plugins: [ `transform-es2015-modules-${type}` ] });
  gulp.task(`build:js:${type}`, () => {
    return gulp.src(sourceFiles)
      .pipe(babel(config))
      .pipe(concat(`index.${type}.js`))
      .pipe(gulp.dest('dist'));
  });

  gulp.task(`build:js:${type}:min`, function () {
    return gulp.src(sourceFiles)
      .pipe(babel(config))
      .pipe(concat(`index.${type}.min.js`))
      .pipe(uglify())
      .pipe(gulp.dest('dist'));
  });
  buildJsTasks.push(`build:js:${type}`);
  buildJsTasks.push(`build:js:${type}:min`);
});


gulp.task('build:js:globals', function () {
  return gulp.src(sourceFiles)
    .pipe(replace(/import [\{\[]?.*[\}\]]? from .*;\n/g, ''))
    .pipe(replace(/export (default )?/g, ''))
    .pipe(concat(`index.js`))
    .pipe(babel(defaultConfig))
    .pipe(gulp.dest('dist'));
});

gulp.task('build:js:globals:min', () => {
  return gulp.src(sourceFiles)
    .pipe(replace(/import [\{\[]?.*[\}\]]? from .*;\n/g, ''))
    .pipe(replace(/export (default )?/g, ''))
    .pipe(concat(`index.js`))
    .pipe(babel(defaultConfig))
    .pipe(uglify())
    .pipe(concat(`index.min.js`))
    .pipe(gulp.dest('dist'));
});

gulp.task('build:js', buildJsTasks);

gulp.task('watch:js', function () {
  gulp.watch('src/*.js', [ 'build:js:globals' ]);
});

gulp.task('default', [ 'watch:js' ]);
