var gulp        = require('gulp');
var ghPages     = require('gulp-gh-pages');
var browserSync = require('browser-sync').create();
var sass        = require('gulp-sass');
var autoprefixer = require('gulp-autoprefixer');
var execSync = require('child_process').execSync;
var fs = require('fs');
var url = fs.readFileSync('CNAME').toString().replace('\n', '')

// Static Server + watching scss/html files
gulp.task('serve', ['sass'], function() {

    browserSync.init({
        server: "./app"
    });

    gulp.watch("app/sass/*.sass", ['sass']);
    gulp.watch("app/*.html").on('change', browserSync.reload);
});

// Compile sass into CSS & auto-inject into browsers
gulp.task('sass', function() {
    return gulp.src("app/sass/*.sass")
        .pipe(sass())
        .pipe(autoprefixer({browsers: ['last 2 versions']}))
        .pipe(gulp.dest("app/css"))
        .pipe(browserSync.stream());
});

gulp.task('deploy', function() {
  return gulp.src('./app/**/*')
    .pipe(ghPages())
    .on('finish', () => {
      console.log('publishing to ' + url + '...')
      setTimeout(() => {
        var publish = execSync(`surge ./.publish ${url}`)
        console.log(publish.toString())
      }, 800)
    })
});

gulp.task('default', ['serve']);
