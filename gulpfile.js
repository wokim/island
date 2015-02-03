'use strict';

var gulp = require('gulp');
var ts = require('gulp-typescript');
var sourcemaps = require('gulp-sourcemaps');
var eventStream = require('event-stream');

var sources = ['./src/**/*(*.ts|!(*.d.ts))'];
function compileTypescript() {
  var tsResult = gulp.src(sources)
    .pipe(sourcemaps.init())
    .pipe(ts({
      target: 'ES5',
      module: 'commonjs',
      declarationFiles: true
    }));
  return eventStream.merge(
    // Merge the two output streams, so this task is finished when the IO of both operations are done.
    tsResult.dts.pipe(gulp.dest('./dist')),
    tsResult.js.pipe(sourcemaps.write()).pipe(gulp.dest('./dist'))
  );
}

function watch() {
  gulp.watch(sources, ['ts']);
}

gulp.task('ts', compileTypescript);
gulp.task('watch', watch);
