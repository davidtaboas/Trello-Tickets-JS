'use strict';

var gulp = require('gulp'),
    jshint = require('gulp-jshint');

var browserSync = require('browser-sync').create();
var historyApiFallback = require('connect-history-api-fallback');
var sass        = require('gulp-sass');

var inject = require('gulp-inject');
var wiredep = require('wiredep').stream;

// Static Server + watching scss/html files
gulp.task('serve', function() {

    browserSync.init({
        server: { baseDir: './app', middleware: [ historyApiFallback() ]}
    });


});

// Compile sass into CSS & auto-inject into browsers
gulp.task('sass', function() {
    return gulp.src('./app/scss/**/*.scss')
        .pipe(sass())
        .pipe(gulp.dest('app/css'))
        .pipe(browserSync.stream());
});

gulp.task('jshint', function () {
  return gulp.src('./app/scripts/**/*.js')
    .pipe(jshint('.jshintrc'))
    .pipe(jshint.reporter('jshint-stylish'))
    .pipe(jshint.reporter('fail'));
});

gulp.task('inject', function () {
    var sources = gulp.src(['./app/scripts/**/*.js', './app/css/**/*.css']);
    return gulp.src('./app/index.html')
        .pipe( inject(sources, {read: false, relative: true, ignorePath: 'app'}) )
        .pipe(gulp.dest('./app'));
});

gulp.task('wiredep', function(){
  gulp.src('./app/index.html')
    .pipe(wiredep({
      directory: './app/lib'
    }))
    .pipe(gulp.dest('./app'));
});


gulp.task('watch', function(){
  gulp.watch('./app/**/*.html').on('change', browserSync.reload);
  gulp.watch(['./app/scss/**/*.scss'],['sass', 'inject']);
  gulp.watch(['./app/scripts/*.js'],['jshint', 'inject']);
  gulp.watch(['./bower.json'], ['wiredep']);


});

gulp.task('default', ['serve', 'inject','wiredep', 'watch']);
