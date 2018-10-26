const gulp = require('gulp'),
      pug = require('gulp-pug'),
      scss = require('gulp-sass'),
      autoprefixer = require('gulp-autoprefixer'),
      cssMinify = require('gulp-csso'),
      clean = require('gulp-clean'),
      concat = require('gulp-concat'),
      copy = require('gulp-copy'),
      rename = require('gulp-rename'),
      browSync = require('browser-sync'),
      imageMin = require('gulp-imagemin'),
      argv = require('minimist')(process.argv.slice(2));

const devMove = argv.env !== 'production';
const srcDest = './src';
const devDest = './dist';
const prodDest = './docs';
const devBuild = ['clean', 'pug', 'scss', 'concat:css', 'copyFonts', 'copyImg'];
const prodBuild = ['clean', 'pug', 'scss', 'concat:css', 'minify-css', 'copyFonts', 'copyImg'];

gulp.task('serverSync', ['pug', 'scss'], () => {
    browSync.init({
        server: {
            baseDir: devDest
        }
    });

    gulp.watch(['**/*.scss'], ['scss'], { base: `${srcDest}/` });
    gulp.watch(['**/*.pug'], ['pug'], { base: `${srcDest}/` });
});

gulp.task('scss', () => {
    gulp.src('main.scss', { base: `${srcDest}` })
        .pipe(scss().on('error', scss.logError))
        .pipe(autoprefixer({
            browsers: ['last 2 versions'],
            cascade: false
        }))
        .pipe(gulp.dest(`${srcDest}/css`))
        .pipe(browserSync.stream());
});

gulp.task('pug', () => {
    gulp.src('main.pug', { base: `${srcDest}/**/` })
        .pipe(pug({ 
            pretty: devMode ? true : false,
            locals: { devMode: devMode }
        }))
        .pipe(rename((path) => { path.basename = 'index' }))
        .pipe(gulp.dest(devMode ? devDest : prodDest))
        .pipe(browserSync.stream());
});

gulp.task('concat:css', () => {
    gulp.src(['normalize.css', 'main.css'], { base: `${srcDest}/css/` })
        .pipe(concat('styles.css'))
        .pipe(gulp.dest(`${devMove ? devDest : prodDest}/css`));
});

gulp.task('watch', () => {
    gulp.watch(['**/*.pug', '**/*.scss'], ['pug', 'scss'], { base: `${srcDest}/` });
});

gulp.task('clean', () => {
    gulp.src(devMode ? devDest : prodDest)
        .pipe(clean({force: true}));
});

gulp.task('copyFonts', () => {
    gulp.src(['*.otf', '*.ttf', '*.woff'], { base: `${srcDest}/fonts` })
        .pipe(copy(devMode ? devDest : prodDest, { prefix: 1 }))
        .pipe(gulp.dest(devMode ? devDest : prodDest));
});

gulp.task('copyImg', () => {
    gulp.src(['*.jpeg', '*.jpg', '*.png', '*.svg'], { base: `${srcDest}/**/` })
        .pipe(imageMin())
        .pipe(copy(devMode ? devDest : prodDest, { prefix: 1 }))
        .pipe(gulp.dest(devMode ? devDest : prodDest));
});

gulp.task('minify-css', () => {
    gulp.src('styles.css', { base: `${srcDest}/css/` })
        .pipe(cssMinify())
        .pipe(rename({ suffix: '.min' }))
        .pipe(gulp.dest(prodDest))
});

gulp.task('build', devMode ? devBuild : prodBuild);