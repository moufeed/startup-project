var gulp = require('gulp'),
    header = require('gulp-header'),
    pkg = require('./package.json'),
    watch = require('gulp-watch'),
    sass = require('gulp-sass')
concat = require('gulp-concat'),
    rename = require('gulp-rename'),
    handlebars = require('gulp-compile-handlebars'),
    sourcemaps = require('gulp-sourcemaps'),
    autoprefixer = require('gulp-autoprefixer'),
    uglify = require('gulp-uglify');


var config = {

    header: '/*!\n* <%= pkg.name %> - v <%= pkg.version %> \n* <%= pkg.description %> \n* Author :<%= pkg.author %>\n*/\n',
    sassOptions :{
        outputStyle: 'compressed'
    },
    css: {
        src: ['./src/scss/**/*.scss'],
        dist: "./dist/assets/css",
        map: "./maps",
        prefixerOptions : {
            browsers: ['last 2 versions', '> 5%', 'Firefox ESR']
        }
    },
    js: {
        src: [
            './src/lib/jquery/dist/jquery.min.js',
            './src/lib/bootstrap/dist/bootstrap.min.js',

            // scripts
            './src/js/scripts.js'
        ],
        dist: "./dist/assets/js",
        file: "script.js"
    },

    html: {
        src: 'src/templates/*.hbs',
        watch : ['src/templates/**/*.hbs','./src/json/*.json'],
        ltrData: require('./src/json/en.json'),
        rtlData: require('./src/json/ar.json'),
        options: {
            ignorePartials: true,
            batch: ['./src/templates/partials'],
            helpers :{
                capitals: function (str) {
                    return str.toUpperCase();
                }
            }
        }
    },
}
// ----------------------------------------------------
// -------------   handlebars/html  -------------------
// ----------------------------------------------------
gulp.task('hbs:ltr', function () {
     
    return gulp.src(config.html.src)
        .pipe(handlebars(config.html.ltrData, config.html.options))
        .pipe(rename({
            extname: '.html'
        }))
        .pipe(gulp.dest('dist'));
});

gulp.task('hbs:rtl', function () {
     
    return gulp.src(config.html.src)
        .pipe(handlebars(config.html.rtlData, config.html.options))
        .pipe(rename({
            suffix: '-rtl',
            extname: '.html'
        }))
        .pipe(gulp.dest('dist'));
});


// ----------------------------------------------------
// -----------------   sass/css  ----------------------
// ----------------------------------------------------

gulp.task('style', function () {
    return gulp.src(config.css.src)
        .pipe(sourcemaps.init())
        .pipe(sass(config.sassOptions).on('error', sass.logError))
        .pipe(rename({
            suffix: '.min'
        }))
        .pipe(header(config.header, {
            pkg: pkg
        }))
        .pipe(autoprefixer(config.css.prefixerOptions))
        .pipe(sourcemaps.write(config.css.map))
        .pipe(gulp.dest(config.css.dist));
})


// ----------------------------------------------------
// -----------------   javascript/js  -----------------
// ----------------------------------------------------
gulp.task('script', function () {
    return gulp.src(config.js.src)
        .pipe(concat(config.js.file))
        .pipe(uglify({
            mangle: true
        }))
        .pipe(rename({
            suffix: '.min'
        }))
        .pipe(header(config.header, {
            pkg: pkg
        }))
        .pipe(gulp.dest(config.js.dist));
})

// ----------------------------------------------------
// -----------------   watch/files  -----------------
// ----------------------------------------------------
gulp.task('watch', function () {
    gulp.watch(config.js.src, 'script');
    gulp.watch(config.css.src, 'style');
    gulp.watch(config.html.watch, 'hbs');
})


gulp.task('hbs', ['hbs:ltr', 'hbs:rtl']);

gulp.task('default', ['script', 'style','hbs','watch']);