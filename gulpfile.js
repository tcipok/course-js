
'use strict'







const gulp         = require('gulp');
const sass         = require('gulp-sass');
const browserSync  = require('browser-sync').create();
const concat       = require('gulp-concat');
const autoprefixer = require('gulp-autoprefixer');
const uglify       = require('gulp-uglify');
const cssnano      = require('gulp-cssnano');
const rename       = require("gulp-rename");
const sourcemaps   = require("gulp-sourcemaps");
const plumber      = require('gulp-plumber');
const notify       = require("gulp-notify");
const fileinclude  = require('gulp-file-include');
const babel        = require('gulp-babel');
const include      = require('gulp-include');
const imagemin     = require('gulp-imagemin');
const quant     = require('imagemin-pngquant');
const del          = require('del');


function html () {
return gulp.src('./app/index.html')
.pipe(plumber({errorHandler: notify.onError("Error: <%= error.message %>")}))
.pipe(fileinclude({
  prefix: '@@',
  basepath: '@file'
}))
.pipe(gulp.dest('dist/'));
}


function php () {
  return gulp.src('./app/index.php')
  .pipe(gulp.dest('dist/'))
  .pipe(browserSync.stream());
  }


function styles () {
  return gulp.src('app/sass/**/*.scss')
  .pipe(plumber({errorHandler: notify.onError("Error: <%= error.message %>")}))
  .pipe(sourcemaps.init())
  .pipe(sass().on('error',sass.logError))
  .pipe(autoprefixer({
    browsers: ['last 12 versions'],
    cascade: false
    }))
  .pipe(cssnano())
  .pipe(rename({
    dirname: "",
    basename: "main",
    prefix: "",
    suffix: ".min",
    extname: ".css"
  }))
  .pipe(sourcemaps.write())
  .pipe(gulp.dest('dist/css'))
  .pipe(browserSync.stream());
}

function css () {
  return gulp.src(cssFiles)
  .pipe(concat('main.css'))
  .pipe(gulp.dest('dist/css'))
}

function scripts () {
return gulp.src(jsFiles)
.pipe(plumber({errorHandler: notify.onError("Error: <%= error.message %>")}))
.pipe(sourcemaps.init({loadMaps: true}))
.pipe(babel())
.pipe(include({
  extensions: 'js',
  hardFail: true
}))
.pipe(concat('main.js'))
.pipe(uglify())
.pipe(sourcemaps.write('.'))
.pipe(gulp.dest('dist/js/'))
.pipe(browserSync.stream());
}

function fonts () {
  return gulp.src('app/fonts/**/*')
  .pipe(gulp.dest('dist/fonts/'))
}

function img () {
  return gulp.src('app/img/**/*')
  .pipe(imagemin({
    interlaced: true,
    progressive: true,
    svgoPlugins: [{removeViewBox:false}],
    une: [quant()]
  }))
  .pipe(gulp.dest('dist/img/'))
}

function libs() {
  return gulp.src('app/libs/**/*')
  .pipe(gulp.dest('dist/libs/'))
}

function clean () {
  return del(['dist/*'])
}



const cssFiles = [
  'app/css/lib.css',
  'app/css/main.css'
]

const jsFiles = [
  'app/js/lib.js',
  'app/js/main.js'
]

const htmlFiles = [
  './app/index.html',
  'app/html/**/*.html'
]

const phpFiles = [
  './app/index.php',
  'app/php/**/*.php'
]




gulp.task('css', css);
gulp.task('php', php);
gulp.task('js', scripts);
gulp.task('sass', styles);
gulp.task('del', clean);
gulp.task('html', html);
gulp.task('fonts', fonts);
gulp.task('img', img);
gulp.task('libs', libs);
gulp.task('watch', watch);
gulp.task('build', gulp.series(clean, gulp.parallel(html,php,styles,scripts,fonts,libs,img,css)));
gulp.task('default', gulp.series('build','watch', gulp.parallel(html,php,styles,scripts,fonts,libs,img,css)));

function watch () {
  browserSync.init({
    server:{
      baseDir: './dist/' //FOR HTML FILES
    },
  //  proxy: 'php-start',  // FOR PHP FILES
    notify: false
  });
  gulp.watch(htmlFiles, html).on('change',browserSync.reload);
  gulp.watch(phpFiles, php).on('change',browserSync.reload);
  gulp.watch('app/sass/**/*', styles).on('change',browserSync.reload);
  gulp.watch('app/js/**/*', scripts).on('change',browserSync.reload);
  gulp.watch('app/libs/**/*', libs);
  gulp.watch('app/fonts/**/*', fonts);
  gulp.watch('app/img/**/*', img);
}















