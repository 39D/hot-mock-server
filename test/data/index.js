'use strict';

const data = {
  "/": {
    GET: {
      "number": 1,
      "text": "hello",
      "date": new Date("2017-08-31 16:39:39"),
      "bool": true
    },
    POST: {
      "method": "POST",
    },
    PUT: {
      "method": "PUT"
    },
    PATCH: {
      "method": "PATCH"
    },
    DELETE: {
      "method": "DELETE"
    }
  },
  "/custom": {
    GET: (req, res) => {
      let { random } = req.query;
      res.send({ method: "GET", random });
    },
    POST: (req, res) => {
      let { random } = req.query;
      let { testData } = req.body;
      res.send({ method: "POST", random, testData });
    },
    PUT: (req, res) => {
      let { random } = req.query;
      let { testData } = req.body;
      res.send({ method: "PUT", random, testData });
    },
    PATCH: (req, res) => {
      let { random } = req.query;
      let { testData } = req.body;
      res.send({ method: "PATCH", random, testData });
    },
    DELETE: (req, res) => {
      let { random } = req.query;
      res.send({ method: "DELETE", random });
    },
  },
}

module.exports = data;
