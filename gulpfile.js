var browserSync   = require('browser-sync').create();
var gulp          = require('gulp');
var pug           = require('gulp-pug');
var sass          = require('gulp-sass');
var cssnano       = require('gulp-cssnano');
var base64        = require('gulp-base64');
var prefix        = require('gulp-autoprefixer');
var rename        = require('gulp-rename');
var resize        = require('gulp-image-resize');
var ghpage        = require("gulp-gh-pages");

var onError = function(err) {
  console.log(err);
  this.emit('end');
}

gulp.task('browser-sync', ['sass'], function() {
  browserSync.init({
    ui: false,
    ghostMode: false,
    server: "docs",
    reloadDelay: 500
  });

  gulp.watch("docs/**/*.html").on("change", browserSync.reload)
});

gulp.task('pug', function () {
  return gulp.src('src/pug/*.pug')
    .pipe(pug({
      pretty: "  "
    }))
    .on('error', onError)
    .pipe(gulp.dest('docs/'));
});

/*
gulp.task('js', function () {
  return gulp.src('src/js/*.js')
    .pipe(gulp.dest('docs/'));
});
*/

gulp.task('sass', function () {
  return gulp.src('./src/scss/style.scss')
    .pipe(sass.sync({
      outputStyle: 'expanded'
    }).on('error', sass.logError))
    .pipe(base64({
        extensions: ['svg'],
        maxImageSize: false
      }))
    .pipe(prefix({
      browsers: ['Safari 7', 'last 2 versions']
    }))
    .pipe(rename('style.css'))
    .pipe(cssnano())
    .pipe(gulp.dest('docs'))
    .pipe(browserSync.stream());
});

gulp.task('non-critical', function () {
  return gulp.src('./src/scss/non-critical.scss')
    .pipe(sass.sync({
      outputStyle: 'expanded'
    }).on('error', sass.logError))
    .pipe(prefix({
      browsers: ['Safari 7', 'last 2 versions']
    }))
    .pipe(rename('non-critical.css'))
    .pipe(cssnano())
    .pipe(gulp.dest('docs'))
    .pipe(browserSync.stream());
});

gulp.task('img', function() {
  return gulp.src(['src/img/*.png', '!src/img/*.ico'])
    .pipe(resize({width:100}))
    .pipe(gulp.dest('docs/img/'));
});

gulp.task('misc', function() {
  return gulp.src(['src/img/favicon.ico', 'manifest.json', 'keybase.txt', 'src/CNAME'])
    .pipe(gulp.dest('docs/'))
});

gulp.task('deploy', () => {
  return gulp.src(['./docs/**/*', './docs/CNAME'])
    .pipe(ghpage());
});

gulp.task('build', ['sass', 'pug', 'non-critical', 'img', 'misc']);

gulp.task('default', ['sass', 'pug', 'non-critical', 'img',  'browser-sync'], function () {
  //gulp.watch('**/*.js', ['js']);
  gulp.watch('**/*.scss', ['sass']);
  gulp.watch('**/*.scss', ['non-critical']);
  gulp.watch('**/*.png', ['img']);
  gulp.watch('**/*.pug', ['pug']);
});
