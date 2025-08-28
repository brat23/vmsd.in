
const gulp = require('gulp');
const htmlmin = require('gulp-htmlmin');
const cleanCSS = require('gulp-clean-css');
const uglify = require('gulp-uglify');
const through2 = require('through2');
const javascriptObfuscator = require('gulp-javascript-obfuscator');
const del = require('del');

const paths = {
  src: 'E:/vmsd.in/vmsd/**/*',
  build: 'E:/vmsd.in/vmsd/build',
  html: 'E:/vmsd.in/vmsd/**/*.html',
  css: 'E:/vmsd.in/vmsd/**/*.css',
  js: 'E:/vmsd.in/vmsd/**/*.js',
  exclude: [
    '!E:/vmsd.in/vmsd/node_modules/**/*',
    '!E:/vmsd.in/vmsd/gulpfile.js',
    '!E:/vmsd.in/vmsd/package.json',
    '!E:/vmsd.in/vmsd/package-lock.json',
    '!E:/vmsd.in/vmsd/build/**/*',
  ]
};

// Google Analytics gtag snippet (replace with your actual gtag if needed)
const gtagSnippet = `<!-- Global site tag (gtag.js) - Google Analytics -->\n<script async src="https://www.googletagmanager.com/gtag/js?id=G-82687XMTH1"></script>\n<script>\n  window.dataLayer = window.dataLayer || [];\n  function gtag(){dataLayer.push(arguments);}\n  gtag('js', new Date());\n  gtag('config', 'G-82687XMTH1');\n</script>`;

// Favicon link (replace href if needed)
const faviconLink = '<link rel="icon" type="image/x-icon" href="/favicon.ico">';

function clean() {
  return del([paths.build]);
}

function html() {
  return gulp.src([paths.html, ...paths.exclude, '!E:/vmsd.in/vmsd/three-js/topics/**/*.html'], { base: 'E:/vmsd.in/vmsd/' })
    .pipe(htmlmin({
      collapseWhitespace: true,
      removeComments: true,
      minifyJS: false,
      continueOnParseError: true
    }))
    .pipe(injectGtagAndFavicon())
    .pipe(gulp.dest(paths.build));
}

function injectGtagAndFavicon() {
  return through2.obj(function(file, _, cb) {
    if (file.isBuffer()) {
      let contents = file.contents.toString();
      // Check and inject gtag
      if (!/googletagmanager\.com\/gtag\/js/.test(contents)) {
        contents = contents.replace(/<head[^>]*>/i, match => match + '\n' + gtagSnippet);
      }
      // Check and inject favicon
      if (!/<link[^>]+rel=["']icon["']/i.test(contents)) {
        contents = contents.replace(/<head[^>]*>/i, match => match + '\n' + faviconLink);
      }
      file.contents = Buffer.from(contents);
    }
    cb(null, file);
  });
}

function css() {
  return gulp.src([paths.css, ...paths.exclude], { base: 'E:/vmsd.in/vmsd/' })
    .pipe(cleanCSS())
    .pipe(gulp.dest(paths.build));
}

function js() {
  return gulp.src([paths.js, ...paths.exclude], { base: 'E:/vmsd.in/vmsd/' })
    .pipe(uglify())
    .pipe(javascriptObfuscator())
    .pipe(gulp.dest(paths.build));
}

function copy() {
  return gulp.src([
    paths.src,
    ...paths.exclude,
    '!E:/vmsd.in/vmsd/**/*.html',
    '!E:/vmsd.in/vmsd/**/*.css',
    '!E:/vmsd.in/vmsd/**/*.js'
  ], { base: 'E:/vmsd.in/vmsd/' })
    .pipe(gulp.dest(paths.build));
}

const build = gulp.series(clean, gulp.parallel(html, css, js, copy));

exports.clean = clean;
exports.html = html;
exports.css = css;
exports.js = js;
exports.copy = copy;
exports.default = build;
exports.injectGtagAndFavicon = injectGtagAndFavicon;
