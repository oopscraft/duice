var packageInfo = require('./package.json');
var gulp = require('gulp');
var rename = require("gulp-rename");
var stripDebug = require('gulp-strip-debug');
var uglify = require('gulp-uglify');
var cleanCss = require('gulp-clean-css');
var zip = require('gulp-zip');
var del = require('del');

var version = packageInfo.version;

// minifies javascript and css
gulp.task('min', function() {
	console.log('min task start');
	var suffix = '-' + version + '.min';

	// distributes javascript source
	gulp.src('src/**/*.js')
		.pipe(gulp.dest('dist'))
		.pipe(stripDebug())
		.pipe(uglify())
		.pipe(rename({suffix:suffix}))
		.pipe(gulp.dest('dist'));
	
	// distributes css source
	gulp.src('src/**/*.css')
		.pipe(gulp.dest('dist'))
		.pipe(cleanCss())
		.pipe(rename({suffix:suffix}))
		.pipe(gulp.dest('dist'));

	console.log('min task end');
});

// compress javascript and css
gulp.task('zip', function() {
	console.log('zip task start');

	// compress ZIP file
	gulp.src(['dist/**/*.js','dist/**/*.css'])
		.pipe(zip('duice-' + version + '.zip'))
		.pipe(gulp.dest('dist'));
	
	console.log('zip task end');
});

// cleans temp file
gulp.task('clean', function() {
	console.log('clean task start');
	del.sync(['dist/**/*.js', 'dist/**/*.css']);
	console.log('clean task end');
});


