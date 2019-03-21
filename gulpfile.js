var gulp = require('gulp');
var sass = require('gulp-sass');
gulp.task('sass', async function() {
    return gulp.src('source/scss/**/*.sass')
        .pipe(sass())
        .pipe(gulp.dest('source/css'))
});

gulp.task('watch', function() {
    gulp.watch('source/scss/**/*.sass', gulp.parallel('sass'));
});