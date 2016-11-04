import gulp from 'gulp';
import './gulp/build';
import './gulp/http';

gulp.task('default', [ 'build' ]);
