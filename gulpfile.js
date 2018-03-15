var gulp = require('gulp'),
	server = require('gulp-express'),
	sass = require('gulp-sass'),
	jshint = require('gulp-jshint'),
	autoprefixer = require('gulp-autoprefixer'),
	plumber = require('gulp-plumber'),
	concat = require('gulp-concat'),
	newer = require('gulp-newer'),
	order = require("gulp-order"),

	app = require('./app');

var onError = function(err) {
	err = {
		'Name': err.name,
		'File': err.file,
		'Reason': err.reason,
		'Message': err.message
	}
	console.log(err);
	this.emit('end');
};

// Watch static css files
gulp.task('watch_css', function() {
	return gulp.src('src/css/*.css')
		.pipe(plumber({ errorHandler: onError }))
		.pipe(server.notify());
});
// Concat init css files
gulp.task('concat_css_init', function() {
	return gulp.src('src/css/init/*.css')
		.pipe(plumber({ errorHandler: onError }))
		.pipe(order([
			'normalize.css',
			'foundation.css'
		]))
		.pipe(concat('init.css'))
		.pipe(gulp.dest('public/stylesheets'))
		.pipe(server.notify());
});
// Concat plugin css files
gulp.task('concat_css_plugins', function() {
	return gulp.src('src/css/plugins/*.css')
		.pipe(plumber({ errorHandler: onError }))
		.pipe(concat('plugins.css'))
		.pipe(gulp.dest('public/stylesheets'))
		.pipe(server.notify());
});

// Compile scss into css
gulp.task('scss', function() {
	return gulp.src('src/scss/*.scss')
		.pipe(plumber({ errorHandler: onError }))
		.pipe(sass({
			style: 'expanded',
			errLogToConsole: true
		}))
		.pipe(autoprefixer({
			browsers: ['last 2 versions'],
			cascade: true
		}))
		.pipe(gulp.dest('public/stylesheets'))
		.pipe(server.notify());
});

// Check source js for errors/typos
gulp.task('hint', function() {
	return gulp.src(['src/js/build/*.js'])
		.pipe(plumber({ errorHandler: onError }))
		.pipe(jshint())
		.pipe(jshint.reporter('jshint-stylish'))
		.pipe(server.notify());
});
// Conact main js file
gulp.task('concat_js_build', function() {
	return gulp.src('src/js/build/*.js')
		.pipe(plumber({ errorHandler: onError }))
		.pipe(order([
			"init.js"
		]))
		.pipe(concat('build.js'))
		.pipe(gulp.dest('public/javascripts'))
		.pipe(server.notify());
});
// Conact plugin js files
gulp.task('concat_js_plugins', function() {
	return gulp.src('src/js/plugins/*.js')
		.pipe(plumber({ errorHandler: onError }))
		.pipe(concat('plugins.js'))
		.pipe(gulp.dest('public/javascripts'))
		.pipe(server.notify());
});
// Copy jquery file
gulp.task('jquery', function() {
	return gulp.src('src/js/jquery/*.js')
		.pipe(plumber({ errorHandler: onError }))
		.pipe(gulp.dest('public/javascripts'));
});

// Watch template files
gulp.task('watch_templates', function() {
	return gulp.src('views/**/*.jade')
		.pipe(plumber({ errorHandler: onError }))
		.pipe(server.notify());
});

gulp.task('server', function () {
	// Start the server at the beginning of the task
	server.run(['./bin/www']);

	gulp.watch('public/stylesheets/!(style)*.css',['watch_css']);
	gulp.watch('src/css/init/*.css', ['concat_css_init']);
	gulp.watch('src/css/plugins/*.css', ['concat_css_plugins']);
	gulp.watch('src/scss/**/*.scss', ['scss']);

	gulp.watch('src/js/build/*.js',['hint']);
	gulp.watch('src/js/build/*.js', ['concat_js_build']);
	gulp.watch('src/js/plugins/*.js', ['concat_js_plugins']);

	gulp.watch('views/**/*.jade', ['watch_templates']);

});

gulp.task('default', ['concat_css_init', 'concat_css_plugins', 'scss', 'hint', 'jquery', 'concat_js_build', 'concat_js_plugins', 'server'], function() {});