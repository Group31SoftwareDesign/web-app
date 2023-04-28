const assert = require('chai').assert;
const { expect } = require('chai');
const request = require('supertest');
const app = require('./server.js');
const User = require('./User');
const { calculatePricePerGallon } = app;

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

  describe('GET requests', function() {
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

    it('should return status 200 for GET /ProfileManager after navigating to /FuelPurchaseHistory', function(done) {
      authenticatedUser
        .get('/FuelPurchaseHistory')
        .then(() => {
          authenticatedUser
            .get('/ProfileManager')
            .expect(200, done);
        });
    });
  });

  describe('POST requests', function() {
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

    it('should return status 200 for POST /login with invalid email', function(done) {
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

    it('should return status 302 for POST/register with new email', function(done) {
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
      try {
        await User.deleteOne({ email: 'new.user@example.com' });
      } catch (error) {
        console.error('Error deleting user:', error);
      }

      done();
    });
});

it('should return status 302 for POST /submit-fuel-quote with valid data', function(done) {
  authenticatedUser
    .post('/get-quote')
    .send({
      gallons: 1000,
      date: '2023-05-10',
      deliveryAddress: '123 Updated Street, Apt 4B, Updated City, UT 12345'
    })
    .end((err, res) => {
      assert.equal(res.status, 200);
      authenticatedUser
        .post('/submit-fuel-quote')
        .send({
          gallons: 1000,
          date: '2023-05-10',
          deliveryAddress: '123 Updated Street, Apt 4B, Updated City, UT 12345',
          price: res.body.price,
          total: res.body.total
        })
        .end((err, res) => {
          assert.equal(res.status, 302);
          done();
        });
    });
});

it('should return status 200 for POST /ProfileManager with valid data', function(done) {
  authenticatedUser
    .post('/update-profile')
    .send({
      fullname: "Updated User",
      address1: '123 Updated Street',
      address2: 'Apt 4B',
      city: 'Updated City',
      state: 'AL',
      zipcode: '12345'
    })
    .expect(302, done);
});
});

describe('Route access and redirection', function() {
it('should redirect the user to /index if they are logged in', function(done) {
const authenticatedUser = request.agent(app);
authenticatedUser
.post('/login')
.send({
  email: 'test.user@example.com',
  password: 'testpassword',
})
.end(function(err, response) {
  authenticatedUser
    .get('/')
    .expect('Location', '/index')
    .expect(302, done);
});
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

it('should redirect the user to the index page if they are already logged in', function() {
const req = { session: { userId: '123' } };
const res = { redirect: function(url) { this.url = url; } };
const next = function() {};

app.checkLoggedIn(req, res, next);

assert.strictEqual(res.url, '/index');
});
});

describe('Register new user, log in, and access /index', function() {
let newUserEmail = 'new.user@example.com';
afterEach(async function() {
  try {
    await User.deleteOne({ email: newUserEmail });
  }
  catch (error) {
    console.error('Error deleting user:', error);
    }
    });
    it('should return status 302 for POST /register with new email and access /index with status 200', function(done) {
      request(app)
        .post('/register')
        .send({
          name: 'New User',
          email: newUserEmail,
          password: 'newpassword',
        })
        .expect(302)
        .end(function(err, res) {
          if (err) {
            return done(err);
          }
    
          const newUserAgent = request.agent(app);
    
          newUserAgent
            .post('/login')
            .send({
              email: newUserEmail,
              password: 'newpassword',
            })
            .expect(302)
            .end(function(err, res) {
              if (err) {
                return done(err);
              }
    
              newUserAgent
                .get('/index')
                .expect(302, done);
            });
        });
    });
  });
  describe('Testing calculatePricePerGallon function', () => {
    it('should return the correct price per gallon for a user not in Texas, with no purchase history, and requesting less than 1000 gallons', async () => {
      const user = new User({
        name: 'Test User',
        email: 'test@example.com',
        password: 'testpassword',
        state: 'California',
        purchaseHistory: [],
      });
  
      const gallons = 500;
      const pricePerGallon = await calculatePricePerGallon(user, gallons);
  
      // Use the formula to calculate the expected price per gallon
      const currentPricePerGallon = 1.5;
      const locationFactor = 0.04;
      const rateHistoryFactor = 0;
      const gallonsRequestedFactor = 0.03;
      const companyProfitFactor = 0.1;
      const margin = currentPricePerGallon * (locationFactor - rateHistoryFactor + gallonsRequestedFactor + companyProfitFactor);
      const expectedPricePerGallon = currentPricePerGallon + margin;
  
      expect(pricePerGallon).to.equal(expectedPricePerGallon);
    });

    it('should return the correct price per gallon for a user in Texas, with no purchase history, and requesting 500 gallons', async () => {
      const user = {
        state: 'Texas',
        purchaseHistory: []
      };
      const gallons = 500;
      
      const expectedResult = 1.5 * (0.02 - 0 + 0.03 + 0.1) + 1.5;
      const result = await calculatePricePerGallon(user, gallons);
  
      expect(result).to.equal(expectedResult);
    });
  });
});