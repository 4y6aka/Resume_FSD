var gulp = require('gulp');
var sass = require('gulp-sass');
var browserSync = require('browser-sync');
var concat = require('gulp-concat');
var uglify = require('gulp-uglifyjs');

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
        // 'bower-components/jquery/dist/jquery.min.js',
        'bower-components/magnific-popup/dist/jquery.magnific-popup.min.js'
        ])
        .pipe(concat('libs.min.js'))
        .pipe(uglify())
        .pipe(gulp.dest('source/js'));
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

gulp.task('watch', function() {
    gulp.watch('source/scss/**/*.sass', gulp.parallel('sass'));
    gulp.watch('source/*.html', gulp.parallel('code'));
    gulp.watch(['source/js/script.js', 'source/libs/**/*.js'], gulp.parallel('scripts'));
});
gulp.task('default', gulp.parallel('sass', 'browser-sync', 'watch'));