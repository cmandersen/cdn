/* =========================
===        CONFIG        ===
========================= */
var CDN_NAME = 'cmandersen';
var CDN_URL = 'cnd.cmandersen.net';

/* =========================
===       REQUIRES       ===
========================= */
var gulp = require('gulp');
var concat = require('gulp-concat');
var uglify = require('gulp-uglifyjs');
var less = require('gulp-less');
var minify = require('gulp-minify-css');
var sourcemaps = require('gulp-sourcemaps');
var git = require('gulp-git');
var copy = require('gulp-copy');
var shell = require('gulp-shell');
var runSequence = require('gulp-run-sequence');

/* =========================
===        PATHS         ===
========================= */
var src = {
    js: [
        'base/underscore/*.js',
        'base/jquery/*.js',
        'base/bootstrap/js/*'
    ],
    less: [
        'base/bootstrap/less/bootstrap.less',
        'base/fontawesome/less/font-awesome.less'
    ]
};

var dest = {
    js: 'js/',

    css: 'css/'
};

var gitRepos = {
    base: 'repos',
    bootstrap: 'repos/bootstrap',
    jquery: 'repos/jquery',
    fontawesome: 'repos/Font-Awesome',
    underscore: 'repos/underscore'
};

var gitFiles = {
    underscore: 'repos/underscore/underscore.js',
    jquery: 'repos/jquery/dist/jquery.js',
    bootstrapJS: 'repos/bootstrap/dist/js/bootstrap.js',
    bootstrapLess: 'repos/bootstrap/less/**/*.less',
    bootstrapFonts: 'repos/bootstrap/fonts/**/*',
    fontawesomeLess: 'repos/Font-Awesome/less/**/*.less',
    fontawesomeFont: 'repos/Font-Awesome/fonts/**/*'
};

/* =========================
===   FILE GENERATORS    ===
========================= */
gulp.task('jsMin', function() {
    return gulp.src(src.js)
        .pipe(uglify(CDN_NAME + '.min.js', {
            outSourceMap: true,
            basePath: '/base',
            sourceRoot: CDN_URL + '/resources/base'
        }))
        .pipe(gulp.dest(dest.js));
});

gulp.task('js', function() {
    return gulp.src(src.js)
        .pipe(concat(CDN_NAME + '.js'))
        .pipe(gulp.dest(dest.js));
});

gulp.task('cssMin', function() {
    return gulp.src(src.less)
        .pipe(sourcemaps.init())
        .pipe(less())
        .pipe(concat(CDN_NAME + '.min.css'))
        .pipe(sourcemaps.write('/'))
        .pipe(minify())
        .pipe(gulp.dest(dest.css));
});

gulp.task('css', function() {
    return gulp.src(src.less)
        .pipe(less())
        .pipe(concat(CDN_NAME + '.css'))
        .pipe(gulp.dest(dest.css));
});

/* =========================
===       GIT RESET      ===
========================= */
gulp.task('jqueryReset', function(cb) {
    return git.reset('HEAD', {
        cwd: gitRepos.jquery,
        args:'--hard'
    }, function (err) {
        if(err) {
            console.log(err)
        }

        cb();
    });
});

/* =========================
===    GIT CLONE/PULL    ===
========================= */
gulp.task('jquery', function(cb) {
    return git.clone('https://github.com/jquery/jquery.git', {
        cwd: gitRepos.base
    }, function(err) {
        if(err) {
            git.pull('origin', 'master', {
                cwd: gitRepos.jquery
            }, function(err) {
                if(err) {
                    console.log(err)
                }

                cb();
            });
        } else {
            cb();
        }
    });
});

gulp.task('bootstrap', function(cb) {
    return git.clone('https://github.com/twbs/bootstrap.git', {
        cwd: gitRepos.base
    }, function(err) {
        if(err) {
            git.pull('origin', 'master', {
                cwd: gitRepos.bootstrap
            }, function(err) {
                if(err) {
                    console.log(err)
                }

                cb();
            });
        } else {
            cb();
        }
    });
});

gulp.task('fontawesome', function(cb) {
    return git.clone('https://github.com/FortAwesome/Font-Awesome.git', {
        cwd: gitRepos.base
    }, function(err) {
        if(err) {
            git.pull('origin', 'master', {
                cwd: gitRepos.fontawesome
            }, function(err) {
                if(err) {
                    console.log(err)
                }

                cb();
            });
        } else {
            cb();
        }
    });
});

gulp.task('underscore', function(cb) {
    return git.clone('https://github.com/jashkenas/underscore.git', {
        cwd: gitRepos.base
    }, function(err) {
        if(err) {
            git.pull('origin', 'master', {
                cwd: gitRepos.underscore
            }, function(err) {
                if(err) {
                    console.log(err)
                }

                cb();
            });
        } else {
            cb();
        }
    });
});

gulp.task('git', ['jquery', 'underscore', 'bootstrap', 'fontawesome']);

/* ===========================
=== COPY FOR TRANSPARENCY  ===
=========================== */
gulp.task('copyUnderscore', function() {
    return gulp.src(gitFiles.underscore)
        .pipe(copy('base/underscore', {
            prefix: 2
        }));
});

gulp.task('copyJquery', function() {
    return gulp.src(gitFiles.jquery)
        .pipe(copy('base/jquery', {
            prefix: 3
        }));
});

gulp.task('copyBootstrapJS', function() {
    return gulp.src(gitFiles.bootstrapJS)
        .pipe(copy('base/bootstrap/js', {
            prefix: 4
        }));
});

gulp.task('copyBootstrapLess', function() {
    return gulp.src(gitFiles.bootstrapLess)
        .pipe(copy('base/bootstrap/less', {
            prefix: 3
        }));
});

gulp.task('copyBootstrapFonts', function() {
    return gulp.src(gitFiles.bootstrapFonts)
        .pipe(copy('fonts', {
            prefix: 3
        }));
});

gulp.task('copyBootstrap', ['copyBootstrapJS', 'copyBootstrapLess', 'copyBootstrapFonts']);

gulp.task('copyFontawesomeLess', function() {
    return gulp.src(gitFiles.fontawesomeLess)
        .pipe(copy('base/fontawesome/less', {
            prefix: 3
        }));
});

gulp.task('copyFontawesomeFonts', function() {
    return gulp.src(gitFiles.fontawesomeFont)
        .pipe(copy('fonts', {
            prefix: 3
        }));
});

gulp.task('copyFontawesome', ['copyFontawesomeLess', 'copyFontawesomeFonts']);

/* ==========================
=== GENERATE JQUERY BUILD ===
========================== */
gulp.task('buildJquery', shell.task([
    'npm run build'
], {
    cwd: 'repos/jquery'
}));

gulp.task('default', function(cb) {
    return runSequence('jqueryReset', 'git', 'buildJquery', ['copyJquery', 'copyUnderscore', 'copyBootstrap', 'copyFontawesome'], ['js', 'jsMin', 'css', 'cssMin'], cb);
});