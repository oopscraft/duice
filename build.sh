#!/bin/bash

# git update source
function update() {
	git stash
	git pull
	git stash pop
}

# compile
function compile() {
	node node_modules/typescript/bin/tsc ${@:1}
}

# gulp dist 
function dist() {
	rm -rf ./dist/*
	node node_modules/gulp/bin/gulp zip
}

# main
case ${1} in
	update)
		update
		;;
	compile)
		compile ${@:2}
		;;
	dist)
	 	dist	
		;;
	*)
		update
		compile
		dist
		;;
esac

exit 0

