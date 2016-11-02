# island v1.0.0

A package suite for building microservice.

This is a branch for preparing release 1.0 - check the [milestone](https://github.com/spearhead-ea/island/milestone/1)


[![Build Status](https://api.travis-ci.org/spearhead-ea/island.svg?branch=release-1.0)](https://travis-ci.org/spearhead-ea/island)
[![NPM version](https://badge.fury.io/js/island.svg)](http://badge.fury.io/js/island)
[![Dependency Status](https://david-dm.org/spearhead-ea/island/status.svg)](https://david-dm.org/spearhead-ea/island)
[![Coverage Status](https://coveralls.io/repos/github/spearhead-ea/island/badge.svg?branch=release-1.0)](https://coveralls.io/github/spearhead-ea/island?branch=release-1.0)
[![Test Coverage](https://codeclimate.com/github/spearhead-ea/island/badges/coverage.svg)](https://codeclimate.com/github/spearhead-ea/island/coverage)
[![Code Climate](https://codeclimate.com/github/spearhead-ea/island/badges/gpa.svg)](https://codeclimate.com/github/spearhead-ea/island)
[![Issue Count](https://codeclimate.com/github/spearhead-ea/island/badges/issue_count.svg)](https://codeclimate.com/github/spearhead-ea/island)

## Changes in v1.0.0

- `Loggers` is no longer a part of `island` -> [island-loggers](https://github.com/spearhead-ea/island-loggers) (#14)
- `@endpoint` decorator now provides 4 more methods (#28)
  - `@endpoint('GET /test')` still works
  - `@endpoint.get('/test')` - You can omit the GET method
  - `@endpoint.post('/test')` - You can omit the POST method
  - `@endpoint.put('/test')` - You can omit the PUT method
  - `@endpoint.del('/test')` - You can omit the DEL method


### Breaking Changes



## Table of Contents
- [Build](#build)

### Build
    npm run build
