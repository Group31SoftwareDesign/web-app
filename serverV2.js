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
const mongoose = require('mongoose')
const initializePassport = require('./passport-config')
const User = require("./User")
mongoose.connect("mongodb+srv://amcruz8:alex1009@atlascluster.yhr0sni.mongodb.net/?retryWrites=true&w=majority")
  .then(() => console.log("connected"))
  .catch((e) => console.error(e));
initializePassport(
  passport,
  email => users.find(user => user.email === email),
  id => users.find(user => user.id === id)
)

// const user1 = new User({
//   email: "a@a",
//   name:"Kyle"
// })
// user1.save().then(()=> console.log("User saved"))
// console.log(user1)
const users = []


// video start
/*
run()
async function run(){
  try{
    //finds user based on id
    // const user1 = await User.findById("6429136c4e7e819c1726a050")

    //finds user based on attribute
    // const user1 = await User.find({email: "a@a"})

    //creates and updates user
    // const user1 = await User.create({
    //   email: "a@a",
    //   name:"Kyle",
    //   password: "a",
    //   hobbies: ["Weight lifting", "Bowling"],
    //   address:{
    //     street: "Main St."
    //   },
    //   age:4
    // })
    // user1.name = "Sally"
    // await user1.save()
    console.log(user1)
  }catch(e){
    console.log(e.message)
  }
}
*/






module.exports = app;
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


app.post('/login', checkNotAuthenticated, passport.authenticate('local', {
  successRedirect: '/',
  failureRedirect: '/login',
  failureFlash: true
}))

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
    res.status(302).redirect('/login')
  } catch {
    res.redirect('/register')
  }
})

app.post('/submit-fuel-quote', checkAuthenticated, (req, res) => {
  const email = req.user.email;

  const submission = {
    date: new Date(),
    delivery_address: req.user.delivery_address,
    total: req.user.total,
    gallons: req.body.gallons,
    price: req.body.price,
  };

  updateUserPurchaseHistory(email, submission);

  res.redirect('/FuelPurchaseHistory');
});

app.post('/update-profile', checkAuthenticated, (req, res) => {
  const email = req.user.email

  const updates = {
    fullname: req.body.fullname,
    address1: req.body.address1,
    address2: req.body.address2,
    city: req.body.city,
    state: req.body.state,
    zipcode: req.body.zipcode
  }

  updateUser(email, updates)

  res.redirect('/')
})

app.delete('/logout', (req, res) => {
  console.log('logout route called');
  req.logout(() => {
    res.redirect('/login');
  });
});


function updateUser(email, updates) {
  const user = users.find(user => user.email === email)

  if (user) {
    Object.assign(user, updates)
    
  }
}

function updateUserPurchaseHistory(email, submission) {
  const user = users.find(user => user.email === email);

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

if (!module.parent) {
  app.listen(3000);
}