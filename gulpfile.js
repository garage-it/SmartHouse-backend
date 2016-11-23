'use strict';

const gulp = require('gulp');
const gulpLoadPlugins = require('gulp-load-plugins');
const path = require('path');
const del = require('del');
const runSequence = require('run-sequence');
const format = require('util').format;
const exec = require('child_process').exec;

const plugins = gulpLoadPlugins();

const paths = {
    js: ['./src/**/*.js', '!./src/**/*.test.js'],
    dbPath: './db',
    views: './src/views/**/*'
};

gulp.task('start-mongo', (done) => {
    let command = format('start cmd /c %mongo_home%\\mongod.exe --dbpath %s', paths.dbPath);
    exec(command, done);
});

gulp.task('clean', () => del(['dist/**', '!dist', '!coverage']));

// Lint Javascript
gulp.task('lint', () =>
    gulp.src(paths.js)
    // eslint() attaches the lint output to the "eslint" property
    // of the file object so it can be used by other modules.
        .pipe(plugins.eslint())
        // eslint.format() outputs the lint results to the console.
        // Alternatively use eslint.formatEach() (see Docs).
        .pipe(plugins.eslint.format())
        // To have the process exit with an error code (1) on
        // lint error, return the stream and pipe to failAfterError last.
        .pipe(plugins.eslint.failAfterError())
);

// Compile ES6 to ES5 and copy to dist
gulp.task('babel', () =>
    gulp.src(paths.js, {base: './src'})
        .pipe(plugins.newer('dist'))
        .pipe(plugins.sourcemaps.init())
        .pipe(plugins.babel())
        .pipe(plugins.sourcemaps.write('.', {
            includeContent: false,
            sourceRoot(file) {
                return path.relative(file.path, __dirname);
            }
        }))
        .pipe(gulp.dest('dist'))
);

// Copy pug views for page controllers
gulp.task('views', () =>
    gulp.src(paths.views, {base: './src'})
        .pipe(gulp.dest('dist'))
);

// Start server with restart on file changes
gulp.task('nodemon', ['lint', 'babel'], () =>
    plugins.nodemon({
        script: path.join('dist', 'index.js'),
        ext: 'js pug',
        ignore: ['node_modules', 'dist'],
        tasks: ['lint', 'babel', 'views']
    })
);

// gulp serve for development
gulp.task('serve', () => runSequence('clean', ['nodemon', 'views']));

// default task: clean dist, compile js files and copy non-js files.
gulp.task('default', () => runSequence('clean', ['babel', 'views']));
