var
    sourcemaps          = require('gulp-sourcemaps'),
    uglify              = require('gulp-uglify'),
    concat              = require('gulp-concat'),
    replace             = require('gulp-replace'),
    gulp                = require('gulp');

var debug   = false;
var config  = {
    js: {
        entries: ['src/js/**/*.js'],
        watch: ['src/js/**/*.js'],
        output: {
            path: './dist/',
            name: 'indi-route-angular.js'
        }
    },
    jsMin: {
        entries: ['build/indi-routing-angular.js'],
        output: {
            path: './dist/',
            name: 'indi-route-angular.min.js'
        }
    }
};

/**
 *
 */
gulp.task('js', function () {
    var s = gulp.src(config.js.entries)
        .pipe(replace('__MODULE_NAME__', 'indiRoute'));

    if (debug)
        s = s.pipe(sourcemaps.init());

    s = s.pipe(concat(config.js.output.name));

    if (debug)
        s = s.pipe(sourcemaps.write());

    return s.pipe(gulp.dest(config.js.output.path));
});

/**
 *
 */
gulp.task('jsMin', ['js'], function () {
    return gulp.src(config.jsMin.entries)
        .pipe(uglify())
        .pipe(concat(config.jsMin.output.name))
        .pipe(gulp.dest(config.jsMin.output.path));
});

/**
 *
 */
gulp.task("watch", ['debug'], function () {
    gulp.watch(config.js.watch, ['jsMin']);
});

/**
 *
 */
gulp.task('debug', function () {
    debug = true;
});

/**
 *
 */
gulp.task('dev', ['debug', 'jsMin', 'watch']);

/**
 *
 */
gulp.task('default', ['jsMin']);