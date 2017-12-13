'use strict';

const fs         = require('fs');
const path       = require('path');
const caller     = require('caller');
const chalk      = require('chalk');
const chokidar   = require('chokidar');
const express    = require('express');
const bodyParser = require('body-parser');
const fileUpload = require('express-fileupload');
const morgan     = require('morgan');
const cors       = require('cors');

const mockCache = {};

function activeWatcher(dataPath, watchPath) {
  const mockPath = dataPath;
  const mockFiles = path.join(mockPath, '**/*.js');
  const extraWatchPath = path.join(mockPath, watchPath);

  function log(s) {
    console.log(chalk.gray('[HMS] ') + s);
  };

  function getRelativePath(absPath) {
    const r = new RegExp(`^${mockPath}/`);
    return String(absPath).replace(r, '');
  };

  function processDirRemoved(absPath) {
    log(chalk.magenta('UnlinkDir ') + getRelativePath(absPath));
    const relativePath = getRelativePath(absPath);
    Object.keys(mockCache).filter((k) => (k.indexOf(`${relativePath}/`) === 0)).forEach((k) => {
      delete mockCache[k];
    });
    log(chalk.cyan('Mock data updated...'));
  }

  return new Promise((resolve, reject) => {
    chokidar.watch([mockFiles, watchPath])
      .on('add', (path) => {
        log(chalk.green('Add ') + getRelativePath(path));
      })
      .on('change', (path) => {
        log(chalk.yellow('Change ') + getRelativePath(path));
      })
      .on('unlink', (path) => {
        log(chalk.magenta('Unlink ') + getRelativePath(path));
      })
      .on('ready', () => {
        log(chalk.cyan('Watch ') + mockFiles);
        resolve();
      })
      .on('error', (err) => {
        log(chalk.red('Error ') + err.message);
        reject(err);
      })
      .on('all', (event, path) => {
        if (['add', 'change', 'unlink'].indexOf(event) >= 0) {
          const relativePath = getRelativePath(path);
          delete require.cache[path];
          if (event === 'unlink') {
            delete mockCache[relativePath];
          } else {
            mockCache[relativePath] = require(path);
          }
          log(chalk.cyan('Mock data updated...'));
        } else if (event === 'unlinkDir') {
          processDirRemoved(path);
        }
      })
      .on('raw', (event, path, details) => {
        if (event === 'moved' && details.type === 'directory') {
          processDirRemoved(path);
        }
      });
  });
}

module.exports = function (dataPath, watchPath) {

  return activeWatcher(dataPath, watchPath).then(() => {
    const app = express();

    app.use(bodyParser.json());
    app.use(fileUpload());
    app.use(bodyParser.urlencoded({ extended: false }));
    app.use(cors({ origin: true, credentials: true }));
    app.use(morgan('dev'));
    app.disable('x-powered-by');
  
    app.all('*', function(req, res) {
      const mock = Object.keys(mockCache).reduce((prev, fileName) => {
        const curMock = mockCache[fileName];
        Object.keys(curMock).forEach((url) => {
          if (!(url in prev)) {
            prev[url] = {};
          }
          Object.assign(prev[url], curMock[url]);
        });
        return prev;
      }, {});

      const method = req.method;
      const pathName = req.path;
  
      if(mock[pathName] && mock[pathName][method]) {
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
  });
};
