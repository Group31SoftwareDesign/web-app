const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const path = require('path');
const User = require('./User');
const app = express();
const session = require('express-session');

mongoose.connect("mongodb+srv://amcruz8:alex1009@atlascluster.yhr0sni.mongodb.net/?retryWrites=true&w=majority")

app.use(session({
  secret: 'your-session-secret',
  resave: false,
  saveUninitialized: false,

}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

function checkLoggedIn(req, res, next) {
  if (req.session.userId) {
    return res.redirect('/index');
  }
  next();
}

function checkNotLoggedIn(req, res, next) {
  if (!req.session.userId) {
    return res.redirect('/login');
  }
  next();
}

async function hasRegisteredState(req,res, next) {
  const user = await User.findById(req.session.userId);
  if (!user.state) {
    return res.redirect('/ProfileManager');
  }
  next();
}

app.get('/', (req, res) => {
  res.redirect('/index');
});

app.get('/login',checkLoggedIn, (req, res) => {
  res.render('login', { messages: {} });
});

app.get('/public/css/styles.css', (req, res) => {
  res.sendFile(__dirname + '/public/css/styles.css');
});

app.get('/register',checkLoggedIn,(req, res) => {
  res.render('register');
});

app.get('/logout', checkNotLoggedIn,(req, res) => {
  req.session.destroy(err => {
    res.redirect('/login');
  });
});

app.get('/ProfileManager',checkNotLoggedIn, async (req, res) => {
    const user = await User.findById(req.session.userId);

    res.render('profilemanager', { user });
});

app.get('/index',checkNotLoggedIn, hasRegisteredState ,async (req, res) => {

    const user = await User.findById(req.session.userId);
    res.render('index', { messages: {}, user: { fullname: user.name, email: user.email, password: user.password, address1: user.address1, address2: user.address2, city: user.city, state: user.state, zipcode: user.zipcode } });
});

app.get('/FuelQuoteForm',checkNotLoggedIn, hasRegisteredState,(req, res) => {
  res.render('fuelquoteform');
});

app.get('/FuelPurchaseHistory', checkNotLoggedIn, hasRegisteredState,async (req, res) => {
    const user = await User.findById(req.session.userId);
    res.render('fuelPurchasehistory', { user });
});

async function calculatePricePerGallon(user, gallons) {
  const currentPricePerGallon = 1.5;
  const locationFactor = user.state === 'Texas' ? 0.02 : 0.04;
  const rateHistoryFactor = user.purchaseHistory.length > 0 ? 0.01 : 0;
  const gallonsRequestedFactor = gallons > 1000 ? 0.02 : 0.03;
  const companyProfitFactor = 0.1;
  const margin = currentPricePerGallon * (locationFactor - rateHistoryFactor + gallonsRequestedFactor + companyProfitFactor);
  return currentPricePerGallon + margin;
}
app.post('/submit-fuel-quote', async (req, res) => {
  const { gallons, deliveryAddress, date } = req.body;
  const user = await User.findById(req.session.userId);
  const suggestedPricePerGallon = await calculatePricePerGallon(user, gallons);
  const totalAmountDue = gallons * suggestedPricePerGallon;

  const fuelQuote = {
    gallons: gallons,
    deliveryAddress: deliveryAddress,
    deliveryDate: date,
    pricePerGallon: suggestedPricePerGallon.toFixed(3),
    totalAmount: totalAmountDue.toFixed(2)
  };

  user.purchaseHistory.push(fuelQuote);

  await user.save();
  res.redirect('/FuelPurchaseHistory');
});

app.post('/get-quote', async (req, res) => {
  const { gallons, deliveryAddress, date } = req.body;
  const user = await User.findById(req.session.userId);

  const suggestedPricePerGallon = await calculatePricePerGallon(user, gallons);
  const totalAmountDue = gallons * suggestedPricePerGallon;

  res.json({
    price: suggestedPricePerGallon,
    total: totalAmountDue
  });
});

app.post('/login', async (req, res) => {
      const { email, password } = req.body;
      const user = await User.findOne({ email });
      if (!user) {
        return res.render('login', { messages: { error: 'Invalid credentials' } });
      }
      const validPassword = await bcrypt.compare(password, user.password);
      if (!validPassword) {
        return res.render('login', { messages: { error: 'Invalid credentials' } });
      }
      req.session.userId = user._id;
      res.redirect('/login');
  });
  
app.post('/register', async (req, res) => {
    const { name, email, password } = req.body;
    const user = await User.findOne({ email });
    if (user) {
      return res.render('register', { messages: { error: 'User already exists' } });
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const newUser = new User({
        name,
        email,
        password: hashedPassword
      });

    await newUser.save();
    res.redirect('/login');
});

app.post('/update-profile', async (req, res) => {
    const { fullname, address1, address2, city, state, zipcode } = req.body;
    const user = await User.findById(req.session.userId);

    user.name = fullname;
    user.address1 = address1;
    user.address2 = address2;
    user.city = city;
    user.state = state;
    user.zipcode = zipcode;

    await user.save();

    res.redirect('/index');
  });

const server = app.listen(3000, () => {
  console.log('Server started on port 3000');
});

module.exports = app;
module.exports.checkLoggedIn = checkLoggedIn;
module.exports.calculatePricePerGallon = calculatePricePerGallon;