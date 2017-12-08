'use strict';

const path = require('path');
const generateApp = require("./lib/app");

const port = 8000;
const mockAbsPath = path.resolve(process.cwd(), 'data-sample');
const mockWatchPath = path.resolve(process.cwd(), 'watch-sample');

generateApp(mockAbsPath, mockWatchPath).then((app) => {
  app.listen(port, () => {
    console.log(`Mock server is now running at port ${port}...`);
  });
});
