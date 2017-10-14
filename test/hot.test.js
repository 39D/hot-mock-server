'use strict';

const fs = require('fs');
const path = require('path');
const rimraf = require('rimraf');
const chai = require('chai');
const generateApp = require('../lib/app');
const should = chai.should();
const exec = require('child_process').exec; 

chai.use(require('chai-http'));
chai.use(require('chai-datetime'));

// backup data file
const dataFilePath = path.join(__dirname, './data/hot.js');
const newFileDist = path.join(__dirname, './data/new.js');
const newFileSrc = path.join(__dirname, './ext-data/new.js');
const newDirDist = path.join(__dirname, './data/a1');
const newDirFileDist = path.join(__dirname, './data/a1/new.js');
const tmpDist = path.join(__dirname, './data/a2');

let orginalFileData = fs.readFileSync(dataFilePath);
let newFileData = fs.readFileSync(newFileSrc);

describe('test app', () => {
  const testDataDir = path.join(__dirname, './data');
  let app;
  
  before((done) => {
    generateApp(testDataDir).then((testApp) => {
      app = testApp;
      done();
    });
  });

  afterEach((done) => {
    fs.unlink(newFileDist, () => {
      rimraf(newDirDist, () => {
        rimraf(tmpDist, () => {
          done();
        });
      });
    });
  });

  beforeEach((done) => {
    fs.writeFileSync(dataFilePath, orginalFileData);
    setTimeout(done, 500)
  });
  
  describe('Test hot reload', () => {
    it('should handle GET', (done) => {
      chai.request(app)
        .get('/hot')
        .end((err, res) => {
          res.should.have.status(200);
          res.body.method.should.equal('GET');
          done();
        });
    });

    it('should handle adding file', (done) => {
      fs.writeFileSync(newFileDist, newFileData);

      setTimeout(() => {
        chai.request(app)
          .post('/hot')
          .end((err, res) => {
            res.should.have.status(200);
            res.body.should.be.a('object');
            res.body.method.should.equal('POST');
            done();
          });
      }, 200);
    });

    it('should handle adding file in dir', (done) => {
      fs.mkdirSync(newDirDist);
      fs.writeFileSync(newDirFileDist, newFileData);

      setTimeout(() => {
        chai.request(app)
          .post('/hot')
          .end((err, res) => {
            res.should.have.status(200);
            res.body.should.be.a('object');
            res.body.method.should.equal('POST');
            done();
          });
      }, 200);
    });
  });
});
