var gulp = require('gulp');
var sass = require('gulp-sass');
var browserSync = require('browser-sync');
var concat = require('gulp-concat');
var uglify = require('gulp-uglifyjs');
var cssnano = require('gulp-cssnano');
var rename = require('gulp-rename');
var del = require('del');
var imagemin = require('gulp-imagemin');
var pngquant = require('imagemin-pngquant');
var cache = require('gulp-cache');
var autoprefixer = require('gulp-autoprefixer');

gulp.task('sass', async function() {
    return gulp.src('source/scss/**/*.sass')
        .pipe(sass())
        .pipe(autoprefixer(['last 15 versions','> 1%', 'ie 8', 'ie 7'], {cascade: true}))
        .pipe(gulp.dest('source/css'))
        .pipe(browserSync.reload({stream:true}))
});

gulp.task('scripts', function() {
    return gulp.src(['source/js/script.js', 'source/libs/**/*.js'])
        .pipe(browserSync.reload({stream: true}))
});

gulp.task('libs', function() {
    return gulp.src([
        'source/libs/jquery/dist/jquery.min.js',
        'source/libs/magnific-popup/dist/jquery.magnific-popup.min.js'
        ])
        .pipe(concat('libs.min.js'))
        .pipe(uglify())
        .pipe(gulp.dest('source/js'));
});

gulp.task('css-libs', function() {
    return gulp.src('source/scss/libs.sass')
        .pipe(cssnano())
        .pipe(rename({suffix: '.min'}))
        .pipe(gulp.dest('source/css'))
});


gulp.task('code', function() {
    return gulp.src('source/*.html')
        .pipe(browserSync.reload({stream: true}))
});

gulp.task('browser-sync', function() {
        browserSync({
            server: {
                baseDir: 'source'
            },
            notify: false
        });
});

gulp.task('clean', async function() {
    return del.sync('dist');
});

gulp.task('img', function() {
    return gulp.src('source/img/**/*')
        .pipe(cache(imagemin ({
            interlaced: true,
            progressive: true,
            svgoPlugins: [{removeViewBox: false}],
            use: [pngquant()]
        })))
        .pipe(gulp.dest('dist/img'));
});

gulp.task('prebuild', async function() {
    var buildCss = gulp.src([
        'source/css/main.css',
        'source/css/libs.min.css'
    ])
        .pipe(gulp.dest('dist/css'))

    var buildFonts = gulp.src('source/fonts/**/*')
        .pipe(gulp.dest('dist/fonts'))

    var buildJs = gulp.src('source/js/**/*')
        .pipe(gulp.dest('dist/js'))

    var buildHtml = gulp.src('source/*.html')
        .pipe(gulp.dest('dist'))
});

gulp.task('clear', function (callback) {
    return cache.clearAll();
})

gulp.task('watch', function() {
    gulp.watch('source/scss/**/*.sass', gulp.parallel('sass'));
    gulp.watch('source/*.html', gulp.parallel('code'));
    gulp.watch(['source/js/script.js', 'source/libs/**/*.js'], gulp.parallel('scripts'));
});
gulp.task('default', gulp.parallel('css-libs', 'sass', 'libs', 'browser-sync', 'watch'));
gulp.task('build', gulp.parallel('prebuild', 'clean', 'img', 'sass', 'libs'))