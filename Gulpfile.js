'use strict';

var gulp = require('gulp'),
    jshint = require('gulp-jshint');

var browserSync = require('browser-sync').create();
var historyApiFallback = require('connect-history-api-fallback');
var sass        = require('gulp-sass');

var inject = require('gulp-inject');
var wiredep = require('wiredep').stream;

var templateCache = require('gulp-angular-templatecache');
var gulpif = require('gulp-if');
var minifyCss = require('gulp-minify-css');
var useref = require('gulp-useref');
var uglify = require('gulp-uglify');
var uncss = require('gulp-uncss');
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




// PRODUCTION
//
gulp.task('templates', function(){
  gulp.src('./app/views/**/*.tpl.html')
    .pipe(templateCache({
      root: 'views/',
      module: 'trellojs.templates',
      standalone: true
      }))
    .pipe(gulp.dest('./app/scripts'));
  });
gulp.task('compress', function(){
  gulp.src('./app/index.html')
    .pipe(useref())
    .pipe(gulpif('*.js', uglify(
      {
        mangle: false,
        ouptut: {
          inline_script: true,
          comments: false
        },
        compress: {
      		sequences: true,
      		dead_code: true,
      		conditionals: true,
      		booleans: true,
      		unused: true,
      		if_return: true,
      		join_vars: true,
      		drop_console: true
	     }
      }
    )))
    .pipe(gulpif('*.css', minifyCss()))
    .pipe(gulp.dest('./dist'));
  });

gulp.task('copy', function(){
    gulp.src('./app/index.html')
      .pipe(useref())
      .pipe(gulp.dest('./dist'));
    gulp.src('./app/lib/fontawesome/fonts/**')
      .pipe(gulp.dest('./dist/fonts'));
  });

gulp.task('uncss',function(){
  gulp.src('./dist/css/style.min.css')
    .pipe(uncss({
      html: ['./app/index.html', './app/views/trello-login.tpl.html', './app/views/trello-new-card.tpl.html'],
      ignore: ['(.*)bootstrap-select(.*)']
      }))
    .pipe(gulp.dest('./dist/css'));
  });

gulp.task('build', ['templates', 'compress', 'copy']);


gulp.task('server-dist', function(){
  browserSync.init({
        server: { baseDir: './dist', middleware: [ historyApiFallback() ]}
    });
  });
