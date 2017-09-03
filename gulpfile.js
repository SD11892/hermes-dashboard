// Gulp.js configuration
'use strict';

const productname = 'hermes-dashboard',
      version = 'v1.0.0';

const

  // source and build folders
  dir = {
    src         : './',
    build       : 'dist/'
  },

  // Gulp and plugins
  gulp          = require('gulp'),
  gutil         = require('gulp-util'),
  newer         = require('gulp-newer'),
  imagemin      = require('gulp-imagemin'),
  sass          = require('gulp-sass'),
  postcss       = require('gulp-postcss'),
  deporder      = require('gulp-deporder'),
  concat        = require('gulp-concat'),
  stripdebug    = require('gulp-strip-debug'),
  uglify        = require('gulp-uglify'),
  prettify      = require('gulp-jsbeautifier'),
  clean         = require('gulp-clean'),
  git           = require('gulp-git'), // https://www.npmjs.com/package/gulp-git
  zip           = require('gulp-zip');
;

// Browser-sync
var browsersync = false;

// Move HTML settings
const move_html = {
  src           : dir.src + '**/*.html',
  build         : dir.build
};

// copy HTML files
gulp.task('move_html', () => {
  return gulp.src(move_html.src)
    .pipe(newer(move_html.build))
    .pipe(gulp.dest(move_html.build));
});

// Move SASS folder
const move_sass = {
    src          : 'assets/_scss/**/*.scss',
    build        : dir.build + 'assets/sass/',
}

// copy Sass files
gulp.task('move_sass', () => {
  return gulp.src(move_sass.src)
    .pipe(newer(move_sass.build))
    .pipe(gulp.dest(move_sass.build));
});

// copy SASS parent
gulp.task('move_sass_parent', () => {
  return gulp.src('assets/css/*.scss')
    .pipe(newer(move_sass.build))
    .pipe(gulp.dest(move_sass.build));
});

// copy full assets
gulp.task('move_js', () => {
  return gulp.src('assets/js/**/*')
    .pipe(newer(dir.build + '/assets/js/'))
    .pipe(gulp.dest(dir.build + '/assets/js/'));
});

gulp.task('move_css', () => {
  return gulp.src('./assets/css/**/*')
    .pipe(newer(dir.build + '/assets/css/'))
    .pipe(gulp.dest(dir.build + '/assets/css/'));
});


gulp.task('move_fonts', () => {
  return gulp.src('./assets/fonts/**/*')
    .pipe(newer(dir.build + '/assets/fonts/'))
    .pipe(gulp.dest(dir.build + '/assets/fonts/'));
});


gulp.task('clean_scss', function () {
    return gulp.src(dir.build + '/assets/css/now-ui-dashboard.scss', {read: false})
        .pipe(clean());
});

// image settings
const images = {
  src         : dir.src + 'assets/img/**/*',
  build       : dir.build + 'assets/img/'
};

// image processing
gulp.task('images', () => {
  return gulp.src(images.src)
    .pipe(newer(images.build))
    .pipe(imagemin({ optimizationLevel: 8 }))
    .pipe(gulp.dest(images.build));
});

// CSS settings
var css = {
  src         : dir.src + 'scss/style.scss',
  watch       : dir.src + 'scss/**/*',
  build       : dir.build,
  sassOpts: {
    outputStyle     : 'nested',
    imagePath       : images.build,
    precision       : 3,
    errLogToConsole : true
  },
  processors: [
    require('postcss-assets')({
      loadPaths: ['images/'],
      basePath: dir.build,
      baseUrl: '/wp-content/themes/wptheme/'
    }),
    require('autoprefixer')({
      browsers: ['last 2 versions', '> 2%']
    }),
    require('css-mqpacker'),
    require('cssnano')
  ]
};

// CSS processing
gulp.task('css', ['images'], () => {
  return gulp.src(css.src)
    .pipe(sass(css.sassOpts))
    .pipe(postcss(css.processors))
    .pipe(gulp.dest(css.build))
    .pipe(browsersync ? browsersync.reload({ stream: true }) : gutil.noop());
});

// Zip files up
gulp.task('zip', function () {
 return gulp.src('dist/**/*')
  .pipe(zip(productname + '-' + version + '.zip'))
  .pipe(gulp.dest('.'));
});

// gulp.task('prettify', function() {
//   gulp.src('dist/**/*.html')
//     .pipe(prettify({indent_char: ' ', indent_size: 2}))
//     .pipe(gulp.dest('dist/'))
// });



// Move HTML settings
const live_demo = {
  src           : 'dist/**/*',
  build         : '../ct-freebies/public/' + productname + '/'
};

gulp.task('move_live_demo', () => {
  return gulp.src(live_demo.src)
    .pipe(newer(live_demo.build))
    .pipe(gulp.dest(live_demo.build));
});

gulp.task('prettify-html', function() {
  gulp.src(['./**/*.html'])
    .pipe(prettify({
        "html": {
            "allowed_file_extensions": ["htm", "html", "xhtml", "shtml", "xml", "svg"],
            "brace_style": "collapse", // [collapse|expand|end-expand|none] Put braces on the same line as control statements (default), or put braces on own line (Allman / ANSI style), or just put end braces on own line, or attempt to keep them where they are
            "end_with_newline": false, // End output with newline
            "indent_char": " ", // Indentation character
            "indent_handlebars": false, // e.g. {{#foo}}, {{/foo}}
            "indent_inner_html": false, // Indent <head> and <body> sections
            "indent_scripts": "normal", // [keep|separate|normal]
            "indent_size": 4, // Indentation size
            "max_preserve_newlines": 0, // Maximum number of line breaks to be preserved in one chunk (0 disables)
            "preserve_newlines": true, // Whether existing line breaks before elements should be preserved (only works before elements, not inside tags or for text)
            "unformatted": ["sub", "sup", "em", "strong", "i", "u", "strike", "big", "pre"], // List of tags that should not be reformatted
            "wrap_line_length": 0 // Lines should wrap at next opportunity after this number of characters (0 disables)
        }
    }))
    .pipe(gulp.dest('dist/'));
});

gulp.task('prettify-css', function() {
  gulp.src(['./assets/css/**/*.css'])
    .pipe(prettify({
        "css": {
            "allowed_file_extensions": ["css", "scss", "sass", "less"],
            "end_with_newline": false, // End output with newline
            "indent_char": " ", // Indentation character
            "indent_size": 4, // Indentation size
            "newline_between_rules": true, // Add a new line after every css rule
            "selector_separator": " ",
            "selector_separator_newline": true // Separate selectors with newline or not (e.g. "a,\nbr" or "a, br")
        }
    }))
    .pipe(gulp.dest('dist/assets/css/'));
});

gulp.task('prettify-js', function() {
  gulp.src(['./assets/js/**/*.js'])
    .pipe(prettify({
        "js": {
            "allowed_file_extensions": ["js", "json", "jshintrc", "jsbeautifyrc"],
            "brace_style": "collapse", // [collapse|expand|end-expand|none] Put braces on the same line as control statements (default), or put braces on own line (Allman / ANSI style), or just put end braces on own line, or attempt to keep them where they are
            "break_chained_methods": false, // Break chained method calls across subsequent lines
            "e4x": false, // Pass E4X xml literals through untouched
            "end_with_newline": false, // End output with newline
            "indent_char": " ", // Indentation character
            "indent_level": 0, // Initial indentation level
            "indent_size": 4, // Indentation size
            "indent_with_tabs": false, // Indent with tabs, overrides `indent_size` and `indent_char`
            "jslint_happy": false, // If true, then jslint-stricter mode is enforced
            "keep_array_indentation": false, // Preserve array indentation
            "keep_function_indentation": false, // Preserve function indentation
            "max_preserve_newlines": 0, // Maximum number of line breaks to be preserved in one chunk (0 disables)
            "preserve_newlines": true, // Whether existing line breaks should be preserved
            "space_after_anon_function": false, // Should the space before an anonymous function's parens be added, "function()" vs "function ()"
            "space_before_conditional": true, // Should the space before conditional statement be added, "if(true)" vs "if (true)"
            "space_in_empty_paren": false, // Add padding spaces within empty paren, "f()" vs "f( )"
            "space_in_paren": false, // Add padding spaces within paren, ie. f( a, b )
            "unescape_strings": false, // Should printable characters in strings encoded in \xNN notation be unescaped, "example" vs "\x65\x78\x61\x6d\x70\x6c\x65"
            "wrap_line_length": 0 // Lines should wrap at next opportunity after this number of characters (0 disables)
        }
    }))
    .pipe(gulp.dest('dist/assets/js'));
});


gulp.task('prettify',['prettify-html','prettify-css','prettify-js'], () => {
    gutil.log('Finished prettify');
});


// run all tasks
gulp.task('build', ['prettify','move_html', 'move_css','move_js','move_sass_parent','move_sass', 'images', 'move_fonts']);

// run all tasks
// gulp.task('live_demo', ['move_html', 'move_css','move_js','move_sass_parent','move_sass', 'images', 'move_fonts','clean_scss']);
