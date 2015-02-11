#!/bin/bash

LOG_PATH=${PWD}/../logs
DATE=`date +%Y-%m-%d-%H-%M-%S`
LOG_FILE=${PWD##*/}-log-${DATE}.log
OUT_FILE=${PWD##*/}-out-${DATE}.log
ERR_FILE=${PWD##*/}-err-${DATE}.log

WATCHER="./dist"
mkdir -p ${LOG_PATH}

forever stop ${PWD##*/} 2> /dev/null
#forever start -a -l ${LOG_PATH}/${LOG_FILE} -o ${LOG_PATH}/${OUT_FILE} -e ${LOG_PATH}/${ERR_FILE} --uid ${PWD##*/} -w -watchDirectory ${WATCHER} ./dist/app.js $(echo $@ | awk '{print substr($0, index($0, $1))}')
forever start -a -l ${LOG_PATH}/${LOG_FILE} -o ${LOG_PATH}/${OUT_FILE} -e ${LOG_PATH}/${ERR_FILE} --uid ${PWD##*/} ./dist/app.js $(echo $@ | awk '{print substr($0, index($0, $1))}')
exit 0