// ------------------------------------------
//   Imports
// ------------------------------------------
var gulp    = require('gulp');
var plugins = require("gulp-load-plugins")();

// ------------------------------------------
//   Configuration
// ------------------------------------------

var settings = {
    'build': {
        'removeScriptComments': true,
        'minifyScripts': false,
        'minifyStyles': false
    },
    'assets': {
        'ico': ['./app/assets/ico/**/*'],
        'img': ['./app/assets/img/**/*'],
        'fonts': [
            './app/assets/vendor/bootstrap/dist/fonts/**/*',
            './app/assets/vendor/fontawesome/fonts/**/*'
        ]
    },
    'styles' : {
        'custom': ['./app/assets/less/custom.less'],
        'watch': ['./app/assets/less/**/*'],
        'vendor': ['./app/assets/vendor/fontawesome/less/font-awesome.less']
    },
    'scripts' : {
        'custom': ['./app/assets/js/**/*.js'],
        'vendor': [
            './app/assets/vendor/jquery/dist/jquery.js',
            './app/assets/vendor/bootstrap/dist/js/bootstrap.js',
            './app/assets/vendor/typeahead.js/dist/typeahead.bundle.min.js'
        ]
    },
    'public': {
        'css': './public/css/',
        'fonts': './public/fonts/',
        'js': './public/js/',
        'ico': './public/ico/',
        'img': './public/img/'
    },
    'output': {
        'styles': {
            'custom': 'styles-custom.css',
            'vendor': 'styles-vendor.css'
        },
        'scripts': {
            'custom': 'scripts-custom.js',
            'vendor': 'scripts-vendor.js'
        }
    }
};

// ------------------------------------------
//   Functions: Utilities
// ------------------------------------------
function compileStyles(src, destDir, destFile, minify){
    return gulp.src(src)
        .pipe(plugins.less())
        .on('error', plugins.util.log)
        .pipe(plugins.autoprefixer('last 2 version'))
        .pipe(plugins.if(minify, plugins.minifyCss()))
        .on('error', plugins.util.log)
        .pipe(plugins.concat(destFile))
        .pipe(plugins.filesize())
        .pipe(gulp.dest(destDir))
        .on('error', plugins.util.log);
}

function compileScripts(src, destDir, destFile, minify, cleanDebug) {
    return gulp.src(src)
        .pipe(plugins.concat(destFile))
        .pipe(plugins.if(cleanDebug, plugins.stripDebug()))
        .on('error', plugins.util.log)
        .pipe(plugins.if(minify, plugins.uglify()))
        .on('error', plugins.util.log)
        .pipe(plugins.filesize())
        .pipe(gulp.dest(destDir))
        .on('error', plugins.util.log);
}

function clean(src) {
    return gulp.src(src, {read: false})
        .pipe(plugins.rimraf());
}

function copy(src, dest) {
    return gulp.src(src)
        .pipe(gulp.dest(dest));
}

// ------------------------------------------
//   Tasks: Clean
// ------------------------------------------
var allCleanTasks = [
    'clean-assets-fonts',
    'clean-assets-ico',
    'clean-assets-img',
    'clean-styles-custom',
    'clean-styles-vendor',
    'clean-scripts-custom',
    'clean-scripts-vendor'];

gulp.task('clean', allCleanTasks, function() {
});

gulp.task('clean-assets-fonts', function() {
    return clean(settings.public.fonts);
});

gulp.task('clean-assets-ico', function() {
    return clean(settings.public.ico);
});

gulp.task('clean-assets-img', function() {
    return clean(settings.public.img);
});

gulp.task('clean-styles-custom', function() {
    return clean(settings.public.css + settings.output.styles.custom);
});

gulp.task('clean-styles-vendor', function() {
    return clean(settings.public.css + settings.output.styles.vendor);
});

gulp.task('clean-scripts-custom', function() {
    return clean(settings.public.js + settings.output.scripts.custom);
});

gulp.task('clean-scripts-vendor', function() {
    return clean(settings.public.js + settings.output.scripts.vendor);
});

// ------------------------------------------
//   Tasks: Assets (Static)
// ------------------------------------------
gulp.task('assets', ['assets-ico', 'assets-img', 'assets-fonts'], function() {

});

gulp.task('assets-ico', ['clean-assets-ico'], function() {
    return copy(settings.assets.ico, settings.public.ico);
});

gulp.task('assets-img', ['clean-assets-img'], function() {
    return copy(settings.assets.img, settings.public.img);
});

gulp.task('assets-fonts', ['clean-assets-fonts'], function() {
    return copy(settings.assets.fonts, settings.public.fonts);
});

// ------------------------------------------
//   Tasks: JavaScript
// ------------------------------------------
gulp.task('scripts', ['scripts-custom', 'scripts-vendor'], function() {

});

gulp.task('scripts-custom', function() {
    return compileScripts(
        settings.scripts.custom,
        settings.public.js,
        settings.output.scripts.custom,
        settings.build.minifyScripts,
        settings.build.removeScriptComments);
});

gulp.task('scripts-vendor', function() {
    return compileScripts(
        settings.scripts.vendor,
        settings.public.js,
        settings.output.scripts.vendor,
        settings.build.minifyScripts,
        settings.build.removeScriptComments);
});

// ------------------------------------------
//   Tasks: Styles
// ------------------------------------------
gulp.task('styles', ['styles-custom', 'styles-vendor'], function() {

});

gulp.task('styles-custom', ['clean-styles-custom'], function() {
    return compileStyles(
        settings.styles.custom,
        settings.public.css,
        settings.output.styles.custom,
        settings.build.minifyStyles);
});

gulp.task('styles-vendor', ['clean-styles-vendor'], function() {
    return compileStyles(
        settings.styles.vendor,
        settings.public.css,
        settings.output.styles.vendor,
        settings.build.minifyStyles);
});

// ------------------------------------------
//   Tasks: Build
// ------------------------------------------
gulp.task('build', ['assets', 'styles', 'scripts'], function() {

});

gulp.task('watch', ['build'], function() {
    gulp.watch([
        settings.assets.fonts,
        settings.assets.ico,
        settings.assets.img
    ], ['assets']);
    gulp.watch(settings.scripts.custom, ['scripts-custom']);
    gulp.watch(settings.styles.watch, ['styles-custom']);
});

// The default task (called when you run `gulp` from cli)
gulp.task('default', ['watch']);
