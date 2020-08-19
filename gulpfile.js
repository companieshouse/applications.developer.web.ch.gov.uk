const gulp = require('gulp');
const sass = require('gulp-sass');
const clean = require('gulp-clean');
const concat = require('gulp-concat');
const uglify = require('gulp-uglify');
const exec = require('child_process').exec;
const npath = require('path');

const srcDirJs = './app/src/js';
const srcDirCss = './app/src/scss';
const distDirJs = './app/public/js';
const distDirCss = './app/public/css';
const distDirAssets = './app/public';

// Purge all before building
gulp.task('clean', () => {
  //return gulp.src([distDirJs, distDirCss], {read: false, allowEmpty: true})
  return gulp.src([distDirJs], {read: false, allowEmpty: true})
    .pipe(clean());
});

// Build and minify all .scss files into application.css
gulp.task('sass', () => {
  return gulp
    .src([`${srcDirCss}/*.scss`])
    .pipe(concat('application.css'))
    .pipe(sass({
      errLogToConsole: true,
      outputStyle: 'compressed',
      indentedSyntax: false,
      includePaths: [
        'node_modules/govuk_frontend_toolkit/stylesheets',
        'node_modules/govuk-elements-sass/public/sass'
      ]
    })
    .on('error', sass.logError))
    .pipe(gulp.dest(distDirCss));
});

// Build and minify all .js files into application.js
gulp.task('js', () => {
  return gulp
    .src([`${srcDirJs}/*.js`])
    //.src([`${srcDirJs}/*.js`, `${srcDirJs}/lib/*.js`])
    .pipe(concat('application.js'))
    .pipe(uglify())
    .pipe(gulp.dest(distDirJs));
});


// Copy the fonts and images from the govuk-frontend package to the public directory
gulp.task('govuk-assets', () => {
  return gulp
    .src(['./node_modules/govuk-frontend/govuk/assets/**/*'])
    .pipe(gulp.dest(distDirAssets));
});

// Binding all tasks together...
//gulp.task('build', gulp.series(['clean', 'sass', 'js', 'govuk-assets']));
gulp.task('build', gulp.series(['clean', 'js', 'govuk-assets']));

// Let's do some watching
gulp.task('watch', gulp.series(() => {
  //gulp.watch([`${srcDirCss}/*.scss`], gulp.series('sass'));
  gulp.watch([`${srcDirJs}/*.js`, `${srcDirJs}/lib/*.js`], gulp.series('js'));
}));

gulp.task('serve', gulp.series('build', () => {
  exec('npm start', function (err, stdout, stderr) {
    if (err) {
      console.log(err);
    }
    console.log(stdout);
    console.log(stderr);
  });
}));

gulp.task('default', gulp.series('serve'));
