#!/bin/bash

mkdir -p logs
DATE=`date +%Y-%m-%d-%H-%M-%S`
TARGET="../externals"
MODULES=()
# get external libraries
for f in $(ls ${TARGET} 2> /dev/null); do
  if [ -d ${TARGET}/${f} ] && [ -f ${TARGET}/${f}/package.json ]; then
    pushd ${TARGET}/${f} > /dev/null
    MODULES+=(${f})
    popd > /dev/null
  fi
done

clean() {
  rm -rf node_modules
  #rm -rf dist
  rm -rf typings
  rm npm-debug.log* 2> /dev/null
}

build() {
  # Install packages and typings
  if [ ! -d "node_modules" ]; then
    npm install
  fi

  # Update definition files (*.d.ts)
  tsd update -ros

  # Make symbolic link
  if [ "$1" != "--production" ] && [ "$NODE_ENV" != "production" ]; then
    pushd node_modules > /dev/null
    for m in ${MODULES[*]}; do
      if [ -d ${m} ]; then
        pushd ${m} > /dev/null
          #rm -rf ./src
          #rm -rf ./dist
          #ln -s "src" $(pwd)/../../../externals/${m}/src
          #ln -s "dist" $(pwd)/../../../externals/${m}/dist
        popd > /dev/null
      fi
    done
    popd > /dev/null
  fi

  # Build TypeScript
  gulp ts
}

deploy() {
  # clean
  clean

  # Install npm dependencies.
  npm install
  tsd update -ros
  gulp ts

  # Reinstall npm dependencies as production
  rm -rf ./node_modules
  npm install --production

  NAME=${PWD##*/}-${DATE}.tar
  tar cvfz ${NAME} ./dist ./node_modules
  mkdir -p builds && mv ${NAME} ./builds/
}

start() {
  WATCHER="./dist"
  for m in ${MODULES[*]}; do
    WATCHER+=",./node_modules/"${m}"/dist"
  done
  if [ "$#" -gt 1 ]; then
    supervisor -w ${WATCHER} -- ./dist/app.js $(echo $@ | awk '{print substr($0, index($0, $2))}')
  else
    supervisor -w ${WATCHER} ./dist/app.js
  fi
}

case "$1" in
  clean)
    LOG_FILE="./logs/clean-"${DATE}".log"
    clean 2>&1 | tee -a ${LOG_FILE}
    ;;
  build)
    LOG_FILE="./logs/build-"${DATE}".log"
    build 2>&1 | tee -a ${LOG_FILE}
    ;;
  deploy)
    LOG_FILE="./logs/deploy-"${DATE}".log"
    deploy 2>&1 | tee -a ${LOG_FILE}
    ;;
  start)
    LOG_FILE="./logs/start-"${DATE}".log"
    start "$@" 2>&1 | tee -a ${LOG_FILE}
    ;;
  debug)
    node debug dist/app.js
    ;;
  *)
    echo -e "*** WARNING: Do not use this script directly ***"
    echo -e "Usage: npm run [options]"
    echo -e ""
    echo -e "Options:"
    echo -e ""
    echo -e "--production\tset \$NODE_ENV to production"
    echo -e "  clean\t\tclean package"
    echo -e "  build\t\tbuild package"
    echo -e "  deploy\tdeploy package"
    echo -e "  start\t\tstart package"
    exit 1
esac
exit 0
