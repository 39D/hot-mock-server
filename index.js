'use strict';

const path = require('path');
const generateApp = require("./lib/app");

const app = generateApp(path);
const port = 8000;

app.listen(port, () => {
  console.log(`Mock server is now running at port ${port}...`);
});