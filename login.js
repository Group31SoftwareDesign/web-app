const express = require('express');
const app = express();
const path = require('path');
const port = 3740;

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'client', 'login.html'));
});
app.get('/client/login.css', (req, res) => {
    res.sendFile(path.join(__dirname, 'client', 'login.css'));
  });  
app.listen(port, () => {
  console.log(`Now listening on port ${port}`);
});