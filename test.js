const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('./server');
const should = chai.should();

chai.use(chaiHttp);

describe("POST /login", () => {
  it("It should authenticate login with correct email and password", (done) => {
    const user = {
      email: "test@example.com",
      password: "password",
    };
    chai
      .request(server)
      .post("/login")
      .send(user)
      .end((err, response) => {
        response.should.have.status(200);
        done();
      });
  });

  it("It should not authenticate login with incorrect email and password", (done) => {
    const user = {
      email: "zz@example.com",
      password: "test",
    };
    chai
      .request(server)
      .post("/login")
      .send(user)
      .end((err, response) => {
        response.should.have.status(302); 
        done();
      });
  });

  it("Password DOES exist", (done) => {
    const user = {
      email: "test@example.com",
      password: "password",
    };
    chai
      .request(server)
      .post("/login")
      .send(user)
      .end((err, response) => {
        response.should.have.status(200);
        done();
      });
  });

  it("Password DOES NOT exist", (done) => {
    const user = {
      email: "test@example.com",
      password: "1234",
    };
    chai
      .request(server)
      .post("/login")
      .send(user)
      .end((err, response) => {
        response.should.have.status(401);
        done();
      });
  });
});

describe('GET /login', () => {
  it('it should return the login page', (done) => {
    chai.request(server)
      .get('/login')
      .end((err, res) => {
        res.should.have.status(200);
        res.text.should.contain('<title>Login</title>');
        done();
      });
  });
});

describe('GET /register', () => {
  it('it should return the registration page', (done) => {
    chai.request(server)
      .get('/register')
      .end((err, res) => {
        res.should.have.status(200);
        res.text.should.contain('<title>Account Registration</title>');
        done();
      });
  });
});
