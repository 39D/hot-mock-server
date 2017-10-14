'use strict';

const fs = require('fs');
const path = require('path');
const chai = require('chai');
const generateApp = require('../lib/app');
const should = chai.should();

chai.use(require('chai-http'));
chai.use(require('chai-datetime'));

// backup data file
const dataFilePath = path.resolve(__dirname, './data/index.js');
const anotherDataFilePath = path.resolve(__dirname, './ext-data/index.js');
let orginalFileData = fs.readFileSync(dataFilePath);
let anotherFileData = fs.readFileSync(anotherDataFilePath);

describe('test app', () => {
  const testDataDir = path.resolve(__dirname, './data');
  let app;
  
  before((done) => {
    generateApp(testDataDir).then((testApp) => {
      app = testApp;
      done();
    });
  });

  beforeEach((done) => {
    fs.writeFileSync(dataFilePath, orginalFileData);
    setTimeout(done, 200)
  });
  
  describe('GET /', () => {
    it('it should handle GET', (done) => {
      chai.request(app)
        .get('/')
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('object');
          res.body.number.should.equal(1);
          res.body.text.should.equal('hello');
          res.body.date.should.be.a('string');
          new Date(res.body.date).should.equalDate(new Date("2017-08-31 16:39:39"));
          res.body.bool.should.be.a('boolean');
          res.body.bool.should.equal(true);
          done();
        });
    });

    it('it should hot reload', (done) => {
      fs.writeFileSync(dataFilePath, anotherFileData);
      setTimeout(() => {
        chai.request(app)
          .get('/')
          .end((err, res) => {
            res.should.have.status(200);
            res.body.should.be.a('object');
            res.body.method.should.equal('GET');
            done();
          });
      }, 200)
    });
  });

  describe('POST /', () => {
    it('it should handle POST', (done) => {
      chai.request(app)
        .post('/')
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('object');
          res.body.method.should.equal('POST');
          done();
        });
    });
  });

  describe('PUT /', () => {
    it('it should handle PUT', (done) => {
      chai.request(app)
        .put('/')
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('object');
          res.body.method.should.equal('PUT');
          done();
        });
    });
  });

  describe('PATCH /', () => {
    it('it should handle PATCH', (done) => {
      chai.request(app)
        .patch('/')
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('object');
          res.body.method.should.equal('PATCH');
          done();
        });
    });
  });

  describe('DELETE /', () => {
    it('it should handle DELETE', (done) => {
      chai.request(app)
        .delete('/')
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('object');
          res.body.method.should.equal('DELETE');
          done();
        });
    });
  });

  describe('GET /custom', () => {
    it('it should handle GET', (done) => {
      let random = parseInt(Math.random() * 1000);
      chai.request(app)
        .get('/custom')
        .query({ random })
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('object');
          parseInt(res.body.random).should.equal(random);
          done();
        });
    });

    it('it should hot reload', (done) => {
      fs.writeFileSync(dataFilePath, anotherFileData);

      setTimeout(() => {
        chai.request(app)
          .get('/custom')
          .end((err, res) => {
            res.should.have.status(200);
            res.body.should.be.a('object');
            res.body.success.should.equal(true);
            done();
          });
      }, 300);
    });
  });

  describe('POST /custom', () => {
    it('it should handle POST', (done) => {
      let random = parseInt(Math.random() * 1000);
      chai.request(app)
        .post('/custom')
        .query({ random })
        .set('content-type', 'application/json')
        .send({ testData: 'testPOST' })
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('object');
          res.body.method.should.equal('POST');
          parseInt(res.body.random).should.equal(random);
          res.body.testData.should.equal('testPOST');
          done();
        });
    });
  });

  describe('PUT /custom', () => {
    it('it should handle PUT', (done) => {
      let random = parseInt(Math.random() * 1000);
      chai.request(app)
        .put('/custom')
        .query({ random })
        .set('content-type', 'application/json')
        .send({ testData: 'testPUT' })
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('object');
          res.body.method.should.equal('PUT');
          parseInt(res.body.random).should.equal(random);
          res.body.testData.should.equal('testPUT');
          done();
        });
    });
  });

  describe('PATCH /custom', () => {
    it('it should handle PATCH', (done) => {
      let random = parseInt(Math.random() * 1000);
      chai.request(app)
        .patch('/custom')
        .query({ random })
        .set('content-type', 'application/json')
        .send({ testData: 'testPATCH' })
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('object');
          res.body.method.should.equal('PATCH');
          parseInt(res.body.random).should.equal(random);
          res.body.testData.should.equal('testPATCH');
          done();
        });
    });
  });

  describe('DELETE /custom', () => {
    it('it should handle DELETE', (done) => {
      let random = parseInt(Math.random() * 1000);
      chai.request(app)
        .delete('/custom')
        .query({ random })
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('object');
          parseInt(res.body.random).should.equal(random);
          res.body.method.should.equal('DELETE');
          done();
        });
    });
  });

  describe('GET /404', () => {
    it('it should return 404', (done) => {
      chai.request(app)
        .delete('/404')
        .end((err, res) => {
          res.should.have.status(404);
          done();
        });
    });
  });
});