'use strict';

var gulp = require('gulp');
var watchify = require('watchify');
var browserify = require('browserify');
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');
var uglify = require('gulp-uglify');
var gutil = require('gulp-util');
var sourcemaps = require('gulp-sourcemaps');
var concat = require('gulp-concat');
var sass = require('gulp-sass');
var minifyCss = require('gulp-minify-css');
var rename = require('gulp-rename');
var clean = require('gulp-clean');
var assign = require('lodash.assign');

var SRC_FOLDER = './public/src';
var BUILD_FOLDER = './public/build';

var paths = {
  src: {
    img: SRC_FOLDER+'/img',
    js: SRC_FOLDER+'/js',
    lib: SRC_FOLDER+'/lib',
    templates: SRC_FOLDER+'/templates',
    stylesheets: SRC_FOLDER+'/stylesheets'
  },
  build: {
    img: BUILD_FOLDER+'/img',
    js: BUILD_FOLDER+'/js',
    lib: BUILD_FOLDER+'/lib',
    templates: BUILD_FOLDER+'/templates',
    stylesheets: BUILD_FOLDER+'/stylesheets'
  }
};

var COPYABLE_FILES = [
  SRC_FOLDER+'/index.html', 
  paths.src.img+'/**/*',
  paths.src.lib+'/**/*',
  paths.src.templates+'/**/*'
];


// add custom browserify options here
var customOpts = {
  entries: paths.src.js+'/app.js',
  debug: true
};
var opts = assign({}, watchify.args, customOpts);
var b = watchify(browserify(opts)); 


function bundle() {
  return b.bundle()
    // log errors if they happen
    .on('error', gutil.log.bind(gutil, 'Browserify Error'))
    .pipe(source('bundle.js'))
    // optional, remove if you don't need to buffer file contents
    .pipe(buffer())
    // optional, remove if you dont want sourcemaps
    .pipe(sourcemaps.init({loadMaps: true})) // loads map from browserify file
       // Add transformation tasks to the pipeline here.
    .pipe(sourcemaps.write()) // writes .map file
    .pipe(gulp.dest(paths.build.js));
}




gulp.task('clean', function(){
  return gulp.src(BUILD_FOLDER, {read: false})
    .pipe(clean());
});


gulp.task('jsDev', ['clean'], bundle); // so you can run `gulp js` to build the file
b.on('update', bundle); // on any dep update, runs the bundler
b.on('log', gutil.log); // output build logs to terminal


gulp.task('jsBuild', ['clean'], function () {
  // set up the browserify instance on a task basis
  var b = browserify({
    entries: paths.src.js+'/app.js',
    debug: true
  });

  return b.bundle()
    .pipe(source('bundle.js'))
    .pipe(buffer())
        // Add transformation tasks to the pipeline here.
        .pipe(uglify())
        .on('error', gutil.log)
    .pipe(gulp.dest(paths.build.js));
});


gulp.task('copy', ['clean'], function() {
  return gulp.src(COPYABLE_FILES, {base:SRC_FOLDER})
    .pipe(gulp.dest(BUILD_FOLDER));
});




gulp.task('sass', function() {
  return _sass();
});

gulp.task('cleanThenSass', ['clean'], function(){
  return _sass();
})

function _sass(){
  gulp.src(paths.src.stylesheets+'/ionic.app.scss')
    .pipe(sourcemaps.init())
    .pipe(sass())
    .pipe(sourcemaps.write())
    .on('error', sass.logError)
    .pipe(gulp.dest(paths.build.stylesheets))
    .pipe(rename({ extname: '.css' }));
}



gulp.task('minifyCss', ['cleanThenSass'], function(){
  return gulp.src(paths.build.stylesheets)
    .pipe(minifyCss({
      keepSpecialComments: 0
    }))
    .pipe(rename({ extname: '.min.css' }));
});

gulp.task('watch', ['clean'], function() {
  gulp.watch(COPYABLE_FILES, function(obj){
    if( obj.type === 'changed') {
      gulp.src( obj.path, { 'base': SRC_FOLDER})
      .pipe(gulp.dest(BUILD_FOLDER));
    }
  });
  gulp.watch([paths.src.stylesheets+'/**/*'], ['sass']);
});




gulp.task('default', ['clean', 'copy', 'cleanThenSass', 'minifyCss', 'jsBuild']);

gulp.task('dev', ['clean', 'copy', 'cleanThenSass', 'jsDev', 'watch']);