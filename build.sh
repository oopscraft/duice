#!/bin/bash

# git update source
function update() {
	git stash
	git pull
	git stash pop
}

# compile
function compile() {
	node node_modules/typescript/bin/tsc
}

# generates document
function doc() {
	rm -rf ./doc/*
	node node_modules/typedoc/bin/typedoc
}

# gulp dist 
function dist() {
	rm -rf ./dist/*
	gulp min
	gulp zip
}

# main
case ${1} in
	update)
		update
		;;
	compile)
		compile
		;;
	doc)
		doc
		;;
	dist)
	 	dist	
		;;
	*)
		update
		compile
		doc
		dist
		;;
esac

exit 0

