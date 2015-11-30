var del = require('del');
var gulp = require('gulp');
var plugins = require('gulp-load-plugins')();
var runSequence = require('run-sequence');

/**
 * Paths
 */
var bowerFolder = 'bower_components/';
var destFolder = 'dist/';
var srcFolder = 'src/';


/**
 * Clean all destination folders
 */
gulp.task('clean', function(cb) {
  return del([
    destFolder,
  ], cb)

  return gulp.pipe(plugins.if(isMac, plugins.notify('Clean task complete')));
});

/**
 * Install Bower components
 */
gulp.task('bower', function() {
  return plugins.bower();
});

/**
 * Main site scripts
 */
gulp.task('scripts', function() {
  return gulp
    .src([
      srcFolder + '**/*.js',
      '!' + srcFolder + 'tests/**/*'
    ])
    .pipe(plugins.plumber())
    .pipe(plugins.jshint())
    .pipe(plugins.jshint.reporter('default'))
    .pipe(plugins.jscs())
    .pipe(plugins.jscs.reporter())
    .pipe(plugins.concat('angular-rest-support.js'))
    .pipe(gulp.dest(destFolder))
    .pipe(plugins.uglify())
    .pipe(plugins.rename({suffix: '.min'}))
    .pipe(gulp.dest(destFolder));
});

/**
 * Watch various files and run appropriate task
 */
gulp.task('watch', function() {
  // Watch this file
  gulp.watch('gulpfile.js', ['dev']);

  // Watch .js files
  gulp.watch(srcFolder + '**/*.js', ['scripts']);

});

/**
 * Default task. Runs all other tasks.
 */
gulp.task('default', ['clean'], function() {
  return runSequence(
    'bower',
    'scripts'
  );
});
