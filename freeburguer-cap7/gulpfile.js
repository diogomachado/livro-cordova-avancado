var css = [
    './www/assets/css/*'
];

var gulp             = require('gulp');
var uglify           = require("gulp-uglify");
var concat           = require("gulp-concat");
var cssmin           = require("gulp-cssmin");
var stripCssComments = require('gulp-strip-css-comments');
var watch            = require('gulp-watch');

gulp.task('minify-css', function(){
    gulp.src(css)
    .pipe(concat('app.min.css'))
    .pipe(stripCssComments({all: true}))
    .pipe(cssmin())
    .pipe(gulp.dest('./www/assets/css/'));
});

gulp.task('default',['minify-css']);

gulp.task('watch', function() {
    gulp.watch(css, ['minify-css']);
});