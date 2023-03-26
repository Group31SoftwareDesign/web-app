// const express = require('express');
// const bodyParser = require('body-parser');
// const app = express();

// const port = 3000;

// // hardcoded user for testing purposes
// const hardcodedUser = {
//   username: 'testuser',
//   password: 'testpassword'
// };



// app.use(bodyParser.urlencoded({ extended: true }));

// app.get('/', (req, res) => {
//   res.sendFile(__dirname + '/index.html');
// });

// app.post('/login', (req, res) => {
//   const { username, password } = req.body;
//   if (username === hardcodedUser.username && password === hardcodedUser.password) {
//     res.redirect('/profile.html');


//     } else {
//         res.send('Invalid username or password');
//     }

// });

// app.get('/profile.html', function(req, res) {
//     res.sendFile(__dirname + '/profile.html');
// });

// app.listen(port, () => {
//   console.log(`Server listening at http://localhost:${port}`);
// });
