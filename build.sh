#!/bin/bash

# prepare
function prepare() {
	npm list gulp || npm install gulp
	npm list gulp-rename || npm install gulp-rename
	npm list gulp-strip-debug || npm install gulp-strip-debug
	npm list gulp-uglify || npm install gulp-uglify
	npm list gulp-sass || npm install gulp-sass
	npm list gulp-clean-css || npm install gulp-clean-css
	npm list gulp-zip || npm install gulp-zip
	npm list del || npm install del
	npm list jsdoc || npm install jsdoc 
	npm list jsdoc-plantuml || npm install jsdoc-plantuml	
	npm list express || npm install express
	npm list mysql || npm install mysql
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

# gulp dist 
function dist() {
	gulp min
	gulp zip
	gulp clean
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
	dist)
	 	dist	
		;;
	*)
		prepare
		update
		doc
		dist
		;;
esac

exit 0

