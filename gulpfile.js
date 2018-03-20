'use strict';

var gulp = require('gulp');
var less = require('gulp-less');
var plumber = require('gulp-plumber');
var postcss = require('gulp-postcss');
var autoprefixer = require('autoprefixer');
var minify = require('gulp-csso');
var rename = require('gulp-rename');
var imagemin = require('gulp-imagemin');
var server = require('browser-sync').create();
var run = require('run-sequence');
var del = require('del');
var minifyJS = require('gulp-uglify');
var concat = require('gulp-concat');

gulp.task('style', function () {
  gulp.src('src/less/style.less')
    .pipe(plumber())
    .pipe(less())
    .pipe(postcss([
      autoprefixer()
    ]))
    .pipe(gulp.dest('build/css'))
    .pipe(minify())
    .pipe(rename('style.min.css'))
    .pipe(gulp.dest('build/css'))
    .pipe(server.stream());
});

gulp.task('script', function () {
  gulp.src('src/js/*.js')
    .pipe(concat('script.js'))
    .pipe(gulp.dest('build/js'))
    .pipe(minifyJS())
    .pipe(rename('script.min.js'))
    .pipe(gulp.dest('build/js'))
    .pipe(server.stream());
});

gulp.task('html', function () {
  return gulp.src('src/*.html')
    .pipe(gulp.dest('build'))
    .pipe(server.stream());
});

gulp.task('images', function () {
  return gulp.src('src/img/**/*.{png,jpg,svg}')
    .pipe(imagemin([
      imagemin.optipng({optimizationLevel: 3}),
      imagemin.jpegtran({progressive: true}),
      imagemin.svgo()
    ]))
    .pipe(gulp.dest('build/img'));
});

gulp.task('clean', function () {
  return del('build');
});

gulp.task('copy', function () {
  return gulp.src([
    'src/fonts/**/*.{woff,woff2}',
    'src/img/**',
  ], {
    base: 'src'
  })
  .pipe(gulp.dest('build'));
});

gulp.task('serve', function () {
  server.init({
    server: 'build/',
    notify: false,
    open: true,
    cors: true,
    ui: false
  });

  gulp.watch('src/less/**/*.less', ['style']);
  gulp.watch('src/*.html', ['html']);
  gulp.watch('src/js/*.js', ['script']);
});

gulp.task('build', function (done) {
  run(
    'clean',
    'copy',
    'style',
    'script',
    'html',
    'images',
    done
  );
});
