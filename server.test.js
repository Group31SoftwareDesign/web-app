// const assert = require('chai').assert;
// const request = require('supertest');
// const app = require('./server.js');

// describe('Testing server routes', function() {
//   let authenticatedUser = request.agent(app);

//   before(function(done) {
//     authenticatedUser
//       .post('/login')
//       .send({
//         email: 'test.user@example.com',
//         password: 'testpassword',
//       })
//       .end(function(err, response) {
//         assert.equal(response.status, 200);
//         done();
//       });
//   });

//   it('should return status 200 for GET /login', function(done) {
//     request(app)
//       .get('/login')
//       .expect(200, done);
//   });

//   it('should return status 200 for GET /register', function(done) {
//     request(app)
//       .get('/register')
//       .expect(200, done);
//   });

//   it('should return status 200 for GET /public/css/styles.css', function(done) {
//     request(app)
//       .get('/public/css/styles.css')
//       .expect(200, done);
//   });

//   it('should return status 200 for GET /ProfileManager when logged in', function(done) {
//     authenticatedUser
//       .get('/ProfileManager')
//       .expect(200, done);
//   });

//   it('should return status 200 for GET /index when logged in', function(done) {
//     authenticatedUser
//       .get('/index')
//       .expect(200, done);
//   });

//   it('should return status 200 for GET /FuelQuoteForm when logged in', function(done) {
//     authenticatedUser
//       .get('/FuelQuoteForm')
//       .expect(200, done);
//   });

//   it('should return status 200 for GET /FuelPurchaseHistory when logged in', function(done) {
//     authenticatedUser
//       .get('/FuelPurchaseHistory')
//       .expect(200, done);
//   });

//   it('should return status 200 for POST /login with valid credentials', function(done) {
//     request(app)
//       .post('/login')
//       .send({
//         email: 'test.user@example.com',
//         password: 'testpassword',
//       })
//       .expect(200, done);
//   });

//   it('should return status 500 for POST /login with invalid credentials', function(done) {
//     request(app)
//       .post('/login')
//       .send({
//         email: 'test.user@example.com',
//         password: 'wrongpassword',
//       })
//       .expect(500, done);
//   });

//   it('should return status 500 for POST /register with existing email', function(done) {
//     request(app)
//       .post('/register')
//       .send({
//         name: 'Test User',
//         email: 'test.user@example.com',
//         password: 'testpassword',
//       })
//       .expect(500, done);
//   });

//   it('should return status 302 for POST /register with new email', function(done) {
//     request(app)
//       .post('/register')
//       .send({
//         name: 'New User',
//         email: 'new.user@example.com',
//         password: 'newpassword',
//       })
//       .expect(302, done);
//   });

// });

// // const request = require('supertest');
// // const app = require('./server');

// // describe('Login', () => {
// //   it('should log in with valid credentials', async () => {
// //     const response = await request(app)
// //       .post('/login')
// //       .send({ email: 'example@gmail.com', password: 'password123' })
// //       .expect(200);
// //     expect(response.text).toContain('index');
// //   });

// //   it('should fail to log in with invalid credentials', async () => {
// //     const response = await request(app)
// //       .post('/login')
// //       .send({ email: 'example@gmail.com', password: 'wrongpassword' })
// //       .expect(302);
// //     expect(response.text).toContain('Invalid credentials');
// //   });
// // });

// // describe('Registration', () => {
// //   it('should register a new user', async () => {
// //     const response = await request(app)
// //       .post('/register')
// //       .send({ name: 'John Doe', email: 'johndoe@gmail.com', password: 'password123' })
// //       .expect(302);
// //     expect(response.header.location).toBe('/login');
// //   });

// //   it('should fail to register a user with an existing email', async () => {
// //     const response = await request(app)
// //       .post('/register')
// //       .send({ name: 'Jane Doe', email: 'example@gmail.com', password: 'password123' })
// //       .expect(200);
// //     expect(response.text).toContain('User already exists');
// //   });
// // });

// // describe('Profile Manager', () => {
// //   it('should display profile manager page if user is logged in', async () => {
// //     const agent = request.agent(app);
// //     await agent.post('/login').send({ email: 'example@gmail.com', password: 'password123' });
// //     const response = await agent.get('/ProfileManager').expect(200);
// //     expect(response.text).toContain('Profile Manager');
// //   });

// //   it('should redirect to login page if user is not logged in', async () => {
// //     const response = await request(app).get('/ProfileManager').expect(302);
// //     expect(response.header.location).toBe('/login');
// //   });

// //   it('should update user profile', async () => {
// //     const agent = request.agent(app);
// //     await agent.post('/login').send({ email: 'example@gmail.com', password: 'password123' });
// //     const response = await agent
// //       .post('/update-profile')
// //       .send({ fullname: 'John Smith', address1: '123 Main St', city: 'New York', state: 'NY', zipcode: '10001' })
// //       .expect(302);
// //     expect(response.header.location).toBe('/index');
// //   });
// // });

// // describe('Fuel Quote', () => {
// //   it('should display fuel quote form', async () => {
// //     const response = await request(app).get('/FuelQuoteForm').expect(200);
// //     expect(response.text).toContain('Fuel Quote Form');
// //   });

// //   it('should submit fuel quote', async () => {
// //     const agent = request.agent(app);
// //     await agent.post('/login').send({ email: 'example@gmail.com', password: 'password123' });
// //     const response = await agent
// //       .post('/submit-fuel-quote')
// //       .send({ gallons: 100, deliveryAddress: '123 Main St', date: '2023-04-03', price: 3, total: 300 })
// //       .expect(302);
// //     expect(response.header.location).toBe('/FuelPurchaseHistory');
// //   });
// // });

// // describe('Fuel Purchase History', () => {
// //     it('should redirect to login page if user is not logged in', async () => {
// //         const response = await request(app).get('/FuelPurchaseHistory').expect(302);
// //         expect(response.header.location).toBe('/login');
// //       });
    
// //       it('should display fuel purchase history if user is logged in', async () => {
// //         const agent = request.agent(app);
// //         await agent.post('/login').send({ email: 'example@gmail.com', password: 'password123' });
// //         const response = await agent.get('/FuelPurchaseHistory').expect(200);
// //         expect(response.text).toContain('Fuel Purchase History');
// //       });
// //     });
    
// //     describe('Logout', () => {
// //       it('should destroy session and redirect to login page', async () => {
// //         const agent = request.agent(app);
// //         await agent.post('/login').send({ email: 'example@gmail.com', password: 'password123' });
// //         const response = await agent.get('/logout').expect(302);
// //         expect(response.header.location).toBe('/login');
// //       });
// //     });

    
const request = require('supertest');
const app = require('./server');

describe('Login', () => {
  it('should log in with valid credentials', async () => {
    const response = await request(app)
      .post('/login')
      .send({ email: 'example@gmail.com', password: 'password123' })
      .expect(200);
    expect(response.text).toContain('index');
  });

  it('should fail to log in with invalid credentials', async () => {
    const response = await request(app)
      .post('/login')
      .send({ email: 'example@gmail.com', password: 'wrongpassword' })
      .expect(302);
    expect(response.text).toContain('Invalid credentials');
  });
});

describe('Registration', () => {
  it('should register a new user', async () => {
    const response = await request(app)
      .post('/register')
      .send({ name: 'John Doe', email: 'johndoe@gmail.com', password: 'password123' })
      .expect(302);
    expect(response.header.location).toBe('/login');
  });

  it('should fail to register a user with an existing email', async () => {
    const response = await request(app)
      .post('/register')
      .send({ name: 'Jane Doe', email: 'example@gmail.com', password: 'password123' })
      .expect(200);
    expect(response.text).toContain('User already exists');
  });
});

describe('Profile Manager', () => {
  it('should display profile manager page if user is logged in', async () => {
    const agent = request.agent(app);
    await agent.post('/login').send({ email: 'example@gmail.com', password: 'password123' });
    const response = await agent.get('/ProfileManager').expect(200);
    expect(response.text).toContain('Profile Manager');
  });

  it('should redirect to login page if user is not logged in', async () => {
    const response = await request(app).get('/ProfileManager').expect(302);
    expect(response.header.location).toBe('/login');
  });

  it('should update user profile', async () => {
    const agent = request.agent(app);
    await agent.post('/login').send({ email: 'example@gmail.com', password: 'password123' });
    const response = await agent
      .post('/update-profile')
      .send({ fullname: 'John Smith', address1: '123 Main St', city: 'New York', state: 'NY', zipcode: '10001' })
      .expect(302);
    expect(response.header.location).toBe('/index');
  });
});

describe('Fuel Quote', () => {
  it('should display fuel quote form', async () => {
    const response = await request(app).get('/FuelQuoteForm').expect(200);
    expect(response.text).toContain('Fuel Quote Form');
  });

  it('should submit fuel quote', async () => {
    const agent = request.agent(app);
    await agent.post('/login').send({ email: 'example@gmail.com', password: 'password123' });
    const response = await agent
      .post('/submit-fuel-quote')
      .send({ gallons: 100, deliveryAddress: '123 Main St', date: '2023-04-03', price: 3, total: 300 })
      .expect(302);
    expect(response.header.location).toBe('/FuelPurchaseHistory');
  });
});

describe('Fuel Purchase History', () => {
    it('should redirect to login page if user is not logged in', async () => {
        const response = await request(app).get('/FuelPurchaseHistory').expect(302);
        expect(response.header.location).toBe('/login');
      });
    
      it('should display fuel purchase history if user is logged in', async () => {
        const agent = request.agent(app);
        await agent.post('/login').send({ email: 'example@gmail.com', password: 'password123' });
        const response = await agent.get('/FuelPurchaseHistory').expect(200);
        expect(response.text).toContain('Fuel Purchase History');
      });
    });
    
    describe('Logout', () => {
      it('should destroy session and redirect to login page', async () => {
        const agent = request.agent(app);
        await agent.post('/login').send({ email: 'example@gmail.com', password: 'password123' });
        const response = await agent.get('/logout').expect(302);
        expect(response.header.location).toBe('/login');
      });
    });

    