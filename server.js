if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

const express = require('express')
const app = express()
const bcrypt = require('bcrypt')
const passport = require('passport')
const flash = require('express-flash')
const session = require('express-session')
const methodOverride = require('method-override')

const initializePassport = require('./passport-config')
initializePassport(
  passport,
  email => users.find(user => user.email === email),
  id => users.find(user => user.id === id)
)

const users = []

app.set('view-engine', 'ejs')
app.use(express.urlencoded({ extended: false }))
app.use(flash())
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false
}))
app.use(passport.initialize())
app.use(passport.session())
app.use(methodOverride('_method'))
app.use(express.static(__dirname + '/public'));

app.get('/', checkAuthenticated, (req, res) => {
    // get the user's email address from the session
    const email = req.user.email

    // find the user with the matching email address
    const user = users.find(user => user.email === email)
    const purchaseHistory = user.purchaseHistory
  res.render('index.ejs', {user, purchaseHistory})
});

app.get('/public/css/styles.css', (req, res) => {
  res.sendFile(__dirname + '/public/css/styles.css');
});

app.get('/login', checkNotAuthenticated, (req, res) => {
  res.render('login.ejs')
})

app.post('/login', checkNotAuthenticated, passport.authenticate('local', {
  successRedirect: '/',
  failureRedirect: '/login',
  failureFlash: true
}))

app.get('/register', checkNotAuthenticated, (req, res) => {
  res.render('register.ejs')
})

app.get('/FuelQuoteForm', checkAuthenticated, (req, res) => {
  res.render('FuelQuoteForm.ejs')
})

app.get('/ProfileManager', checkAuthenticated, (req, res) => {
  res.render('ProfileManager.ejs')
})

app.get('/FuelPurchaseHistory', checkAuthenticated, (req, res) => {
  const email = req.user.email;
  const user = users.find(user => user.email === email);
  const purchaseHistory = user.purchaseHistory;
  res.render('FuelPurchaseHistory.ejs', { user, purchaseHistory });
});

app.post('/register', checkNotAuthenticated, async (req, res) => {
  try {
    const hashedPassword = await bcrypt.hash(req.body.password, 10)
    users.push({
      id: Date.now().toString(),
      name: req.body.name,
      email: req.body.email,
      password: hashedPassword,
      fullname: req.body.fullname,
      address1: req.body.address1,
      address2: req.body.address2,
      city: req.body.city,
      state: req.body.state,
      zipcode: req.body.zipcode,
      purchaseHistory: [
        {
          date: '',
          delivery_address: '',
          gallons: '',
          price: '',
          total: ''
        }
      ]
    })
    res.redirect('/login')
  } catch {
    res.redirect('/register')
  }
})

app.post('/submit-fuel-quote', checkAuthenticated, (req, res) => {
  // Get the user's email address from the session
  const email = req.user.email;

  // Get the submitted data from the form
  const submission = {
    date: new Date(),
    delivery_address: req.body.delivery_address,
    total: req.body.total,
    gallons: req.body.gallons,
    price: req.body.price,
  };

  // Update the user's purchase history
  updateUserPurchaseHistory(email, submission);

  // Redirect to the purchase history page
  res.redirect('/FuelPurchaseHistory');
});

app.post('/update-profile', checkAuthenticated, (req, res) => {
  // get the user's email address from the session
  const email = req.user.email

  // get the updates from the form data
  const updates = {
    fullname: req.body.fullname,
    address1: req.body.address1,
    address2: req.body.address2,
    city: req.body.city,
    state: req.body.state,
    zipcode: req.body.zipcode
  }

  // update the user's information
  updateUser(email, updates)

  // redirect to the user's profile page
  res.redirect('/')
})

function updateUser(email, updates) {
  // find the user with the matching email
  const user = users.find(user => user.email === email)

  // update the user's attributes with the new values
  if (user) {
    Object.assign(user, updates)
    
  }
}

app.delete('/logout', (req, res) => {
  console.log('logout route called');
  req.logout(() => {
    res.redirect('/login');
  });
});

function updateUserPurchaseHistory(email, submission) {
  // Find the user with the matching email
  const user = users.find(user => user.email === email);

  // Update the user's purchase history with the new submission
  if (user) {
    user.purchaseHistory.push(submission);
  }
}

function checkAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next()
  }

  res.redirect('/login')
}

function checkNotAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return res.redirect('/')
  }
  next()
}

app.listen(3000)