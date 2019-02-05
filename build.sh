#!/bin/bash

# git update source
function update() {
	git stash
	git pull
	git stash pop
}

# generates document
function doc() {
	npm list jsdoc || npm install -g jsdoc
	npm list docdash || npm install docdash
	rm -rf ./doc/*
	jsdoc --configure ./jsdoc.json
}

# gradle build
function build() {
	npm list gulp || npm install gulp
	npm list gulp-strip-debug || npm install gulp-strip-debug
	npm list gulp-uglify || npm install gulp-uglify
	npm list gulp-sass || npm install gulp-sass
	npm list gulp-minify-html || npm install gulp-minify-html
	npm list gulp-zip || npm install gulp-zip
	gulp build
}

# main
case ${1} in
	update)
		update
		;;
	doc)
		doc
		;;
	build)
		build
		;;
	*)
		update
		doc
		build
		;;
esac

exit 0

