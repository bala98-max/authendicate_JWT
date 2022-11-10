const express = require('express');
const mongoose = require('mongoose');
const authRoutes = require('./routes/authRoutes');
var cookieParser = require('cookie-parser')


const app = express();

// middleware
app.use(express.static('public'));
app.use(express.json());
app.use(cookieParser())

// view engine
app.set('view engine', 'ejs');

// database connection
const dbURI = 'mongodb+srv://bala:bala98@cluster0.usoyvek.mongodb.net/node-auth';
mongoose.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then((result) => {
    console.log('DB Connected...!!!')
    app.listen(3000)
  })
  .catch((err) => console.log(err));

// routes
app.get('/', (req, res) => res.render('home'));
app.get('/smoothies', (req, res) => res.render('smoothies'));
// here we are using the middleware and asking to use the route
app.use(authRoutes)

