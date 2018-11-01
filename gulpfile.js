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
      argv = require('minimist')(process.argv.slice(2)),
      uglifyJs = require('gulp-uglify');

const devMode = argv.env !== 'production';
const srcDest = './src';
const devDest = './dist';
const prodDest = './docs';
const devBuild = ['pug', 'concat:css', 'concat:js', 'copyFonts', 'copyImg'];
const prodBuild = ['pug', 'scss', 'concat:css', 'minify-css', 'concat:js', 'minify-js','copyFonts', 'copyImg'];

gulp.task('serverSync', ['build'], () => {
    browSync.init({
        server: {
            baseDir: devDest
        }
    });

    gulp.watch([`${srcDest}/**/*.scss`], ['concat:css']);
    gulp.watch([`${srcDest}/**/*.pug`], ['pug']);
    gulp.watch([`${srcDest}/**/*.js`, `${srcDest}/**/*/*.js`], ['concat:js']);
});

gulp.task('scss', () => {
    return gulp.src(`${srcDest}/main.scss`)
        .pipe(scss().on('error', scss.logError))
        .pipe(autoprefixer({
            browsers: ['last 2 versions'],
            cascade: false
        }))
        .pipe(gulp.dest(`${srcDest}/css`));
});

gulp.task('pug', ['cleanHtml'], () => {
    gulp.src(`${srcDest}/main.pug`)
        .pipe(pug({ 
            pretty: devMode ? true : false,
            locals:
            { 
                devMode: devMode,
                imgDir: './img',
                jsDir: './js'
            }
        }))
        .pipe(rename((path) => { path.basename = 'index' }))
        .pipe(gulp.dest(devMode ? devDest : prodDest))
        .pipe(browSync.stream());
});

gulp.task('concat:css', ['cleanCss', 'scss'], () => {
    gulp.src([
            `${srcDest}/css/normalize.css`,
            `${srcDest}/css/main.css`
        ])
        .pipe(concat('styles.css'))
        .pipe(gulp.dest(`${devMode ? devDest : srcDest}/css`))
        .pipe(browSync.stream());
});

gulp.task('concat:js', ['cleanJs'], () => {
    gulp.src([
            `${srcDest}/**/*.js`,
            `${srcDest}/**/*/*.js`
        ])
        .pipe(concat('scripts.js'))
        .pipe(gulp.dest(`${devMode ? devDest : srcDest}/js`))
        .pipe(browSync.stream());
});

gulp.task('watch', () => {
    gulp.watch([
            `${srcDest}/**/*.pug`,
            `${srcDest}/**/*.scss`],
        ['pug', 'scss', 'concat:css']);
});

gulp.task('cleanHtml', () => {
    return gulp.src(`${devMode ? devDest : prodDest}/*.html`)
        .pipe(clean());
});

gulp.task('cleanCss', () => {
    return gulp.src(`${devMode ? devDest : prodDest}/css`)
        .pipe(clean());
});

gulp.task('cleanJs', () => {
    return gulp.src([`${devMode ? devDest : prodDest}/js`, `${srcDest}/js`])
        .pipe(clean());
});

gulp.task('cleanImg', () => {
    return gulp.src(`${devMode ? devDest : prodDest}/img`)
        .pipe(clean());
});

gulp.task('cleanFonts', () => {
    return gulp.src(`${devMode ? devDest : prodDest}/fonts`)
        .pipe(clean());
});

gulp.task('copyFonts', ['cleanFonts'], () => {
    gulp.src([
            `${srcDest}/**/*.otf`,
            `${srcDest}/**/*.ttf`,
            `${srcDest}/**/*.woff`
        ])
        .pipe(copy(`${devMode ? devDest : prodDest}/fonts`, { prefix: 2 }))
        .pipe(gulp.dest("/fonts"));
});

gulp.task('copyImg', ['cleanImg'], () => {
    gulp.src([
            `${srcDest}/**/*.jpeg`,
            `${srcDest}/**/*.jpg`,
            `${srcDest}/**/*.png`,
            `${srcDest}/**/*.svg`
        ])
        .pipe(copy(`${devMode ? devDest : prodDest}/img`, { prefix: 1 }))
        .pipe(imageMin())
        .pipe(gulp.dest(`/img`));
});

gulp.task('minify-css', () => {
    gulp.src(`${srcDest}/css/styles.css`)
        .pipe(cssMinify())
        .pipe(rename({ suffix: '.min' }))
        .pipe(gulp.dest(`${prodDest}/css`))
});

gulp.task('minify-js', () => {
    gulp.src(`${srcDest}/js/scripts.js`)
        .pipe(uglifyJs())
        .pipe(rename({ suffix: '.min' }))
        .pipe(gulp.dest(`${prodDest}/js`))
});

gulp.task('build', devMode ? devBuild : prodBuild);