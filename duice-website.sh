#!/bin/bash
APP_FILE=$(basename ${0})
APP_NAME=${APP_FILE%.*}

# start
function start() {
	echo "start"
	pm2 start ./app.js \
	--name $(realpath ./app.js) \
	--log ./log/${APP_NAME}.log \
	--watch ./app.js
}

# status
function status() {
	echo "status"
	pm2 list
}

# stop
function stop() {
	echo "stop"
	pm2 delete $(realpath ./app.js)
}

# log
function log() {
	tail -F ./log/${APP_NAME}.log
}

# main
case ${1} in 
	start)
		start
		;;
	status)
		status
		;;
	stop)
		stop
		;;
	log)
		log
		;;
	*)
		echo "Usage: ${0} [start|status|stop]"
		;;
esac

exit 0
