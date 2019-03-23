var gulp = require('gulp');
var sass = require('gulp-sass');
var browserSync = require('browser-sync');
var concat = require('gulp-concat');
var uglify = require('gulp-uglifyjs');
var cssnano = require('gulp-cssnano');
var rename = require('gulp-rename');

gulp.task('sass', async function() {
    return gulp.src('source/scss/**/*.sass')
        .pipe(sass())
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

gulp.task('watch', function() {
    gulp.watch('source/scss/**/*.sass', gulp.parallel('sass'));
    gulp.watch('source/*.html', gulp.parallel('code'));
    gulp.watch(['source/js/script.js', 'source/libs/**/*.js'], gulp.parallel('scripts'));
});
gulp.task('default', gulp.parallel('css-libs', 'sass', 'libs', 'browser-sync', 'watch'));
