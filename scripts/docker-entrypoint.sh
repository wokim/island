#!/bin/bash
set -e

if [ "$1" = "--help" ]; then
	echo "--help"
	echo "--version"
	exit
fi

if [ "$1" = "--version" ]; then
	node ./ver.js
	exit
fi

if [ "$1" = "island" ]; then
	npm run start
fi

exec "$@"

