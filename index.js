const express = require('express'); // getting express
const app = express(); // initialize express
const cors = require('cors'); // used only for local, not needed in production
const User = require('./models/user.models');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs'); 

// connect to mongoose before anything else happens!!!!!
// it will automatically create the database sso-haunted-mall
mongoose.connect('mongodb://localhost:27017/sso-haunted-mall');

// this is middle ware, passes it to next function
app.use(cors());
// this lets express know that we will be using json alot
app.use(express.json());

// creating a user 
app.post('/api/register', async (req, res) => {
    try {
      const newPassword = await bcrypt.hash(req.body.password, 10);
      await User.create({
        name: req.body.name,
        email: req.body.email,
        password: newPassword, 
      });
      res.json({status: 'ok'});  
    } catch (err) {
        console.log(err);
        res.json({status: 'error', error: '.......'});
    }
});

// login 
app.post('/api/login', async (req, res) => {
  const user = await User.findOne({
    email: req.body.email,
  });
   
  if(!user) {
      return { status: 'error', error: 'Invalid login' }
  };
  // validate password with the encrypted one
  const isPasswordValid = await bcrypt.compare(
    req.body.password, 
    user.password
  );
  if (isPasswordValid) {
      // jwt token:
      const token = jwt.sign({
        name: user.name,
        email: user.email,
      }, 'secret1234'); // need to create environment variable
      return res.json({status: 'ok', user: token});
  } else {
      return res.json(({status: 'error', user: false}));
  }
});

// Get Token, Login
app.get('/api/login', async (req, res) => {
    const token = req.headers['x-access-token'];
    try {
      const decoded = jwt.verify(token, 'secret1234');
      const email = decoded.email;
      const user = await User.findOne({email: email});
      return res.json({ status: 'ok', quote: user.quote}); // returning in json format
    } catch (error) {
      console.log(error);
      res.json({status: 'error', error: 'invalid token'});
    };
  });

// post Endpoint for quote, will be replaced later with something else, maybe character creator
app.post('/api/quote', async (req, res) => {
    const token = req.headers['x-access-token'];
    try {
      const decoded = jwt.verify(token, 'secret1234');
      const email = decoded.email;
      await User.updateOne(
        {email: email}, 
        {$set: {quote: req.body.quote} // where we are setting the quote
       });
      return res.json({ status: 'ok'});
    } catch (error) {
      console.log(error);
      res.json({status: 'error', error: 'invalid token'});
    };
  });
// left off at 46 minutes
// get Endpoint for quote, will be replaced later with something else, maybe character creator
app.get('/api/quote', async (req, res) => {
    const token = req.headers['x-access-token'];
    try {
      const decoded = jwt.verify(token, 'secret1234');
      const email = decoded.email;
      const user = await User.findOne(
        {email: email}
      );
      return res.json({ status: 'ok', quote: user.quote});
    } catch (error) {
      console.log(error);
      res.json({status: 'error', error: 'invalid token'});
    };
  });

// start the server on port
app.listen(1337, () => {
    console.log('Server started on port 1337');
});
