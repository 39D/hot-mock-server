'use strict';

const path       = require('path');
const caller     = require('caller');
const express    = require('express');
const bodyParser = require('body-parser');
const morgan     = require('morgan');
const cors       = require('cors');

global.requireModule = function (modulePath) {
  modulePath = path.resolve(path.dirname(caller()), modulePath);
  let mod = require(modulePath);
  delete require.cache[require.resolve(modulePath)];
  return mod;
}

module.exports = function (dataPath) {
  let app = express();

  app.use(cors({
      origin: true,
      credentials: true
  }));
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: false }));
  app.use(morgan('dev'));
  app.disable('x-powered-by');

  app.all('*', function(req, res) {
    let mock = requireModule(dataPath);
    let method = req.method;
    let pathName = req.path;

    if(mock && mock[pathName] && mock[pathName][method]) {
      let configItem = mock[pathName][method];
      if(typeof(configItem) === 'function') {
        configItem(req, res);
      } else {
        res.send(configItem);
      }
    } else {
      res.status(404).end();
    }
  });
  
  return app;
};
