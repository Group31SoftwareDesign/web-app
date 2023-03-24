const express = require('express');
const app = express(); //holds the express code and wth which you will be interacting with the most. 
const port = 8000;
//app.get takes 2 arguments path and any callback functions. 

app.get('/', function (req, res) {
    res.sendFile('FuelPurchaseHistory.html', {root: __dirname});
  });

  app.listen(port, () => {
    console.log(`Now listening on port ${port}`);
}); 