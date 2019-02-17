#!/bin/bash

# prepare
function prepare() {
	npm list gulp || npm install gulp
	npm list gulp-strip-debug || npm install gulp-strip-debug
	npm list gulp-uglify || npm install gulp-uglify
	npm list gulp-sass || npm install gulp-sass
	npm list gulp-minify-html || npm install gulp-minify-html
	npm list gulp-zip || npm install gulp-zip
	npm list jsdoc || npm install jsdoc 
	npm list jsdoc-plantuml || npm install jsdoc-plantuml	
}

# git update source
function update() {
	git stash
	git pull
	git stash pop
}

# generates document
function doc() {
	rm -rf ./doc/*
	jsdoc --configure ./jsdoc.json
}

# gulp compile
function compile() {
	gulp build
}

# main
case ${1} in
	prepare)
		prepare
		;;
	update)
		update
		;;
	doc)
		doc
		;;
	compile)
		compile
		;;
	*)
		prepare
		update
		doc
		compile
		;;
esac

exit 0

