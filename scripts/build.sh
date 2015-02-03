#!/bin/bash

# Install packages and typings
if [ ! -d "node_modules" ]; then
  bash ./scripts/clean.sh
  npm install
  tsd update -ros
fi

# Build TypeScript
gulp ts

# Link local packages
TARGET=".."
if [ "$1" != "release" ]
then
  for f in `ls ${TARGET}`; do
    if [ -d ${TARGET}/${f} ] && [ -d "node_modules/"${f} ]; then
      echo "Link module: "${f}
      npm link ${TARGET}/${f}
    fi
  done
fi