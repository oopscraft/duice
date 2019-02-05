var gulp = require('gulp');
var stripDebug = require('gulp-strip-debug');
var uglify = require('gulp-uglify');
var sass = require('gulp-sass');
var minifyHtml = require('gulp-minify-html');
var zip = require('gulp-zip');

gulp.task('build', function() {
	console.log('starts build.');
	
	// distributes javascript source
	gulp.src('src/**/*.js')
		.pipe(stripDebug())
		.pipe(uglify())
		.pipe(gulp.dest('dist'));

	// distributes css source
	gulp.src('src/**/*.css')
		.pipe(sass())
		.pipe(gulp.dest('dist'));
	
	// distributes html source
	gulp.src('src/**/*.html')
		.pipe(gulp.dest('dist'));
	
	// compress ZIP file
	gulp.src(['dist/*.js','dist/*.css','dist/*.html'])
		.pipe(zip('duice.zip'))
		.pipe(gulp.dest('dist'));
	
	console.log('complete build.');
});
