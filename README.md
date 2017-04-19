# hot-mock-server

[![Build Status](https://travis-ci.org/39D/hot-mock-server.svg?branch=master)](https://travis-ci.org/39D/hot-mock-server)
[![codecov](https://codecov.io/gh/39D/hot-mock-server/branch/master/graph/badge.svg)](https://codecov.io/gh/39D/hot-mock-server)

A HTTP Server for Mock Data.

## Features

* Hot reload when change data files
* Support request with JSON format body
* Response with static data
* Manual handle request and response
* CORS (allow all CORS request)

## Dependencies

* [express](https://github.com/expressjs/express): http server framework
* [cors](https://github.com/expressjs/cors): support cors
* [morgan](https://github.com/expressjs/morgan): print access log
* [body-parser](https://github.com/expressjs/body-parser): parse json body
* [caller](totherik/caller): figure out the caller, to generate module path
* [commander](https://github.com/tj/commander.js): generate command-line interface

## Preparations

* node >= 6.0.0
* npm >= 3.8.6

## Usage

* `npm install -g hot-mock-server` (maybe need root authorization)
* `hmserver -d <data dir path> -p <port>`

## Attentions

* Data directory sample: `data-sample`
* Conmmand sample: `hmserver -d "./data-sample" -p 3000`
* Please ensure there is an `index.js` file in the root of data directory

## Licence

MIT