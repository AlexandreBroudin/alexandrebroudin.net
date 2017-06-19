var browserSync   = require('browser-sync').create();
var gulp          = require('gulp');
var pug           = require('gulp-pug');
var sass          = require('gulp-sass');
var base64        = require('gulp-base64');
var prefix        = require('gulp-autoprefixer');
var rename        = require('gulp-rename');
var resize        = require('gulp-image-resize');
var deploy        = require("gulp-gh-pages");

var onError = function(err) {
  console.log(err);
  this.emit('end');
}

gulp.task('browser-sync', ['sass'], function() {
  browserSync.init({
    ui: false,
    ghostMode: false,
    server: "dist",
    reloadDelay: 500
  });

  gulp.watch("dist/**/*.html").on("change", browserSync.reload)
});

gulp.task('pug', function () {
  return gulp.src('src/pug/*.pug')
    .pipe(pug({
      pretty: "  "
    }))
    .on('error', onError)
    .pipe(gulp.dest('dist/'));
});

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
    .pipe(gulp.dest('dist'))
    .pipe(browserSync.stream());
});

gulp.task('img', function() {
  return gulp.src('src/img/*.png')
    .pipe(resize({width:100}))
    .pipe(gulp.dest('dist/img/'));
});

gulp.task('manifest', function() {
  return gulp.src('manifest.json')
    .pipe(gulp.dest('dist/'))
});

var options = {
    remoteUrl: "https://github.com/AlexandreBroudin/alexandrebroudin.net.git",
    branch: "gh-pages"};

gulp.task('deploy', function () {
    gulp.src("dist/**/*.*")
        .pipe(deploy(options));
});

gulp.task('build', ['pug', 'sass', 'img', 'manifest']);

gulp.task('default', ['pug', 'sass', 'browser-sync'], function () {
  gulp.watch('**/*.scss', ['sass']);
  gulp.watch('**/*.png', ['img']);
  gulp.watch('**/*.pug', ['pug']);
});
