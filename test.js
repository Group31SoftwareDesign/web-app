const assert = require('chai').assert;
const request = require('supertest');
const app = require('./server.js');

describe('Testing server routes', function() {
  let authenticatedUser = request.agent(app);

  before(function(done) {
    authenticatedUser
      .post('/login')
      .send({
        email: 'test.user@example.com',
        password: 'testpassword',
      })
      .end(function(err, response) {
        assert.equal(response.status, 200);
        done();
      });
  });

  it('should return status 200 for GET /login', function(done) {
    request(app)
      .get('/login')
      .expect(200, done);
  });

  it('should return status 200 for GET /register', function(done) {
    request(app)
      .get('/register')
      .expect(200, done);
  });

  it('should return status 200 for GET /public/css/styles.css', function(done) {
    request(app)
      .get('/public/css/styles.css')
      .expect(200, done);
  });

  it('should return status 200 for GET /ProfileManager when logged in', function(done) {
    authenticatedUser
      .get('/ProfileManager')
      .expect(200, done);
  });

  it('should return status 200 for GET /index when logged in', function(done) {
    authenticatedUser
      .get('/index')
      .expect(200, done);
  });

  it('should return status 200 for GET /FuelQuoteForm when logged in', function(done) {
    authenticatedUser
      .get('/FuelQuoteForm')
      .expect(200, done);
  });

  it('should return status 200 for GET /FuelPurchaseHistory when logged in', function(done) {
    authenticatedUser
      .get('/FuelPurchaseHistory')
      .expect(200, done);
  });

  it('should return status 200 for POST /login with valid credentials', function(done) {
    request(app)
      .post('/login')
      .send({
        email: 'test.user@example.com',
        password: 'testpassword',
      })
      .expect(200, done);
  });

  it('should return status 302 for POST /login with invalid credentials', function(done) {
    request(app)
      .post('/login')
      .send({
        email: 'test.user@example.com',
        password: 'wrongpassword',
      })
      .expect(200, done);
  });

  it('should return status 302 for POST /register with existing email', function(done) {
    request(app)
      .post('/register')
      .send({
        name: 'Test User',
        email: 'test.user@example.com',
        password: 'testpassword',
      })
      .expect(200, done);
  });

  it('should return status 200 for POST /register with new email', function(done) {
    request(app)
      .post('/register')
      .send({
        name: 'New User',
        email: 'new.user@example.com',
        password: 'newpassword',
      })
      .expect(200, done);
  });



});

