# hot-mock-server

[![Build Status](https://travis-ci.org/39D/mock-server.svg?branch=master)](https://travis-ci.org/39D/mock-server)
[![codecov](https://codecov.io/gh/39D/mock-server/branch/master/graph/badge.svg)](https://codecov.io/gh/39D/mock-server)

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

## Preparation

* node >= 4.0.0
* npm >= 2.14.2

## Usage

* `npm install -g hot-mock-server`
* `hmserver -d <data dir path> -p <port>`

## Attentions

* Data directory sample: `data-sample`
* Conmmand sample: `hmserver -d "./data-sample" -p 3000`
* Please ensure there is an `index.js` file in the root of data directory

## Licence

MIT