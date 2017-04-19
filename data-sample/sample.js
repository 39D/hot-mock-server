'use strict';

const data = {
  "/": {
    GET: {
      "message": "Hello"
    }
  },
  "/complex": {
    GET: (req, res) => {
      res.send({ random: Math.random() });
    }
  },
}

module.exports = data;
