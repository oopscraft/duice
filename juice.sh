#!/bin/bash
APP_FILE=$(basename ${0})
APP_NAME=${APP_FILE%.*}
PID_FILE=${APP_NAME}.pid
touch ${PID_FILE}
PID=$(cat ${PID_FILE})

# start
function start() {
	if [ -f /proc/${PID}/status ]; then
		echo "Application is already running."
		status
		exit -1
	fi
	nohup http-server ./doc -p 10002 -c-1 > ${APP_NAME}.log &
	echo $! > ${PID_FILE}
}

# status
function status() {
	ps -f ${PID} | grep http-server | grep 10002
}

# stop
function stop() {
	if [ ! -f /proc/${PID}/status ]; then
		echo "Application is not running."
		exit -1
	fi
	kill ${PID}
}

# log
function log() {
	tail -F ./${APP_NAME}.log
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
			
