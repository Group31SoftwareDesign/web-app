const assert = require('chai').assert;
const request = require('supertest');
const app = require('./server.js');
const User = require('./User');

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
        assert.equal(response.status, 302);
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
      .expect(302, done);
  });

  it('should return status 200 for POST /login with invalid credentials', function(done) {
    request(app)
      .post('/login')
      .send({
        email: 'test.user@example.com',
        password: 'wrongpassword',
      })
      .expect(200, done);
  });
  it('should return status 200 for POST /login with invalid credentials', function(done) {
    request(app)
      .post('/login')
      .send({
        email: 'test@example.com',
        password: 'wrongpassword',
      })
      .expect(200, done);
  });

  it('should return status 200 for POST /register with existing email', function(done) {
    request(app)
      .post('/register')
      .send({
        name: 'Test User',
        email: 'test.user@example.com',
        password: 'testpassword',
      })
      .expect(200, done);
  });

  it('should return status 302 for POST /register with new email', function(done) {
    request(app)
      .post('/register')
      .send({
        name: 'New User',
        email: 'new.user@example.com',
        password: 'newpassword',
      })
      .expect(302)
      .end(async function(err, res) {
        if (err) {
          return done(err);
        }
  
        // Delete the created user from the database
        try {
          await User.deleteOne({ email: 'new.user@example.com' });
        } catch (error) {
          console.error('Error deleting user:', error);
        }
  
        done();
      });
  });
  it('should redirect the user to the index page if they are already logged in', function() {
    const req = { session: { userId: '123' } };
    const res = { redirect: function(url) { this.url = url; } };
    const next = function() {};

    app.checkLoggedIn(req, res, next);

    assert.strictEqual(res.url, '/index');
  });

  it('should return status 200 for GET /ProfileManager after navigating to /FuelPurchaseHistory', function(done) {
    authenticatedUser
      .get('/FuelPurchaseHistory')
      .then(() => {
        authenticatedUser
          .get('/ProfileManager')
          .expect(200, done);
      });
  });
  
  it('should return status 302 for POST /FuelQuoteForm with valid data', function(done) {
    authenticatedUser
      .post('/submit-fuel-quote')
      .send({
        gallonsRequested: 1000,
        deliveryDate: '2023-05-10',
        deliveryAddress: '123 Updated Street, Apt 4B, Updated City, UT 12345',
        suggestedPrice: 2.50,
      })
      .expect(302, done);
  });
  
  it('should return status 200 for GET /FuelQuoteForm after navigating to /ProfileManager', function(done) {
    authenticatedUser
      .get('/ProfileManager')
      .then(() => {
        authenticatedUser
          .get('/FuelQuoteForm')
          .expect(200, done);
      });
  });

  it('should return status 200 for POST /ProfileManager with valid data', function(done) {
    authenticatedUser
      .post('/update-profile')
      .send({
        name: 'Updated User',
        fullname: "Updated User",
        address1: '123 Updated Street',
        address2: 'Apt 4B',
        city: 'Updated City',
        state: 'AL',
        zipCode: '12345'
      })
      .expect(302, done);
  });
  it('should return status 200 for GET /logout when logged in', function(done) {
    authenticatedUser
      .get('/logout')
      .expect(302, done);
  });
  
  it('should redirect to /login after GET /logout', function(done) {
    authenticatedUser
      .get('/logout')
      .expect('Location', '/login')
      .expect(302, done);
  });
  
  it('should not have access to protected routes after GET /logout', function(done) {
    authenticatedUser
      .get('/logout')
      .end(() => {
        authenticatedUser
          .get('/ProfileManager')
          .expect(302, done);
      });
  });
  
});

