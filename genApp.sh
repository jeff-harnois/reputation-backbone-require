#!/bin/sh

if [ "$1" == "" ]; then
  grunt --config grunt.config.js
  for file in Modules/configs/*.js; do
    grunt --config $file
  done
else
  grunt "$1" --config grunt.config.js
  for file in Modules/configs/*.js; do
    grunt "$1" --config $file
  done
fi