var gulp    = require('gulp'),
    gutil   = require('gutil'),
    less    = require('gulp-less'),
    concat  = require('gulp-concat'),
    uglify  = require('gulp-uglifyjs'),
    cssnano     = require('gulp-cssnano'),
    rename = require('gulp-rename'),
    del     = require('del');

gulp.task('clean', function() {
    return del.sync('dist'); // Удаляем папку assets перед сборкой
    });

gulp.task('scripts', function() {
    return gulp.src([
        'src/js/*.js',
        ])
        .pipe(concat('input-tips.js'))
        .pipe(gulp.dest('dist'))
        .pipe(rename({suffix: '.min'}))
        .pipe(uglify({
            outSourceMap: true
            }))
        .pipe(gulp.dest('dist'));
    });

gulp.task('less', function() {
    return gulp.src(['src/less/*.less'])
        .pipe(concat('input-tips.css'))
        .pipe(less().on('error', gutil.log))
        .pipe(gulp.dest('dist'))
        .pipe(cssnano()) // Сжимаем
        .pipe(rename({suffix: '.min'}))
        .pipe(gulp.dest('dist'));
});

gulp.task('watch', function(){

    gulp.watch(['src/js/**'], function() {
        setTimeout(function () {
            gulp.start('scripts');
            }, 1000);
        });

    gulp.watch(['src/less/**'], function() {
        setTimeout(function () {
            gulp.start('less');
        }, 1000);
    });

    });


gulp.task('default', ['clean', 'scripts', 'less', 'watch']);