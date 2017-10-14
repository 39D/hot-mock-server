'use strict';

const path = require('path');
const generateApp = require("./lib/app");

const port = 8000;
const mockAbsPath = path.resolve(process.cwd(), 'data-sample');

generateApp(mockAbsPath).then((app) => {
  app.listen(port, () => {
    console.log(`Mock server is now running at port ${port}...`);
  });
});
