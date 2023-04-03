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
  .then(() => console.log("connected"))
  .catch((e) => console.error(e));
app.use(session({
  secret: 'your-session-secret',
  resave: false,
  saveUninitialized: false,
  cookie: { maxAge: 60 * 60 * 1000 } // 1 hour
}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.get('/login', (req, res) => {
  res.render('login', { messages: {} });
});


app.post('/login', async (req, res) => {
    try {
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
      res.render('index', { messages: {}, user: { fullname: user.name, email: user.email, password: user.password } });
      
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Internal server error' });
    }
  });

app.get('/public/css/styles.css', (req, res) => {
    res.sendFile(__dirname + '/public/css/styles.css');
  });

app.get('/register', (req, res) => {
  res.render('register');
});

app.get('/logout', (req, res) => {
    if (req.session) {
      req.session.destroy(err => {
        if (err) {
          console.error(err);
          res.status(500).json({ message: 'Internal server error' });
        } else {
          res.redirect('/login');
        }
      });
    } else {
      res.redirect('/login');
    }
  });
  
app.post('/register', async (req, res) => {
  try {
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
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal server error' });
  }
});

app.get('/ProfileManager', async (req, res) => {
    try {
      if (!req.session.userId) {
        return res.redirect('/login');
      }
  
      const user = await User.findById(req.session.userId);
  
      if (!user) {
        return res.redirect('/login');
      }
  
      res.render('profilemanager', { user });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Internal server error' });
    }
  });

app.post('/update-profile', async (req, res) => {
    try {
      if (!req.session.userId) {
        return res.redirect('/login');
      }
  
      const { fullname, address1, address2, city, state, zipcode } = req.body;
      const user = await User.findById(req.session.userId);
  
      if (!user) {
        return res.redirect('/login');
      }
  
      user.name = fullname;
      user.address1 = address1;
      user.address2 = address2;
      user.city = city;
      user.state = state;
      user.zipcode = zipcode;
  
      await user.save();
  
      res.redirect('/index');
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Internal server error' });
    }
  });

  app.get('/index', async (req, res) => {
    try {
      if (!req.session.userId) {
        return res.redirect('/login');
      }
  
      const user = await User.findById(req.session.userId);
  
      if (!user) {
        return res.redirect('/login');
      }
  
      res.render('index', { messages: {}, user: { fullname: user.name, email: user.email, password: user.password, address1: user.address1, address2: user.address2, city: user.city, state: user.state, zipcode: user.zipcode } });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Internal server error' });
    }
  });

  app.get('/FuelQuoteForm', (req, res) => {
    res.render('fuelquoteform');
  });

  app.get('/FuelPurchaseHistory', async (req, res) => {
    try {
      if (!req.session.userId) {
        return res.redirect('/login');
      }
  
      const user = await User.findById(req.session.userId);
  
      if (!user) {
        return res.redirect('/login');
      }
  
      res.render('fuelPurchasehistory', { user, purchaseHistory: user.purchaseHistory });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Internal server error' });
    }
  });
  

  app.post('/submit-fuel-quote', async (req, res) => {
    try {
      const { gallons, deliveryAddress, date, price, total } = req.body;
  

  
      const fuelQuote = {
        gallons: String,
        deliveryAddress: String,
        deliveryDate: new Date(date),
        pricePerGallon: String,
        totalAmount: String
      };
  
      await User.updateOne(
        { _id: req.session.userId },
        { $push: { purchaseHistory: fuelQuote } }
      );
  
      res.redirect('/FuelPurchaseHistory');
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Internal server error' });
    }
  });
  
app.listen(3000, () => {
  console.log('Server started on port 3000');
});
