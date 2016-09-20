'use strict';

var gulp = require('gulp');
var jasmine = require('gulp-jasmine');

var sources = ['./src/**/*.ts'];

function executeTypescriptCompiler(options) {
  options = options || {};
  options.project = options.project || process.cwd();
  var command = makeTscCommandString(options);
  return function (done) {
    require('child_process').exec(command, function (err, stdout, stderr) {
      var outString = stdout.toString();
      if (outString) console.log('\n', outString);
      if (options.taskAlwaysSucceed) {
        return done();
      }
      done(err);
    });
  };
}

function makeTscCommandString(options) {
  return 'tsc ' +
    Object.keys(options)
      .filter(function (key) {
        return key !== 'taskAlwaysSucceed';
      })
      .map(function (key) {
        return '--' + key + ' ' + (options[key] || '');
      })
      .join(' ');
}

function watch() {
  gulp.watch(sources, {interval: 2000}, ['buildIgnoreError']);
}

function clean(done) {
  var del = require('del');
  del(['./dist', './node_modules'], done);
}

function registerJasmineTasks() {
  var files = require('glob').sync('./dist/spec/*.js');
  files.forEach(function (name) {
    // ./dist/spec/abc.spec.js => abc.spec
    var taskName = name.match(/^.*\/(.*)\.js$/)[1];
    jasmineTask(taskName);
  });
}

function jasmineTask(name) {
  var buildAndTest = 'run-' + name;
  gulp.task(name, [buildAndTest], function () {
    gulp.watch(sources, [buildAndTest]);
  });
  gulp.task(buildAndTest, ['build'], function () {
    gulp.src('./dist/spec/' + name + '.js')
      .pipe(jasmine());
  });
}

gulp.task('build', executeTypescriptCompiler());
gulp.task('buildIgnoreError', executeTypescriptCompiler({noEmitOnError: '', taskAlwaysSucceed: true}));
gulp.task('watch', watch);
gulp.task('clean', clean);
registerJasmineTasks();
