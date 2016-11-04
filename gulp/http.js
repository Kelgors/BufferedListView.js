import gulp from 'gulp';
import connect from 'gulp-connect';

gulp.task('serve:website', function () {
  return connect.server({
    root: 'website',
    livereload: false,
    port: 8080
  });
});
