const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const app = express();
const bcrypt = require('bcrypt');
const passport = require('passport');
require('dotenv').config()
const session = require('./config/session.config');
require('./config/passport.config')
const morgan = require('morgan');
const User = require('./models/user.model');

app.use(bodyParser.urlencoded({ extended: false })); 

app.use(morgan('dev'));
// base de datos
require('./config/db.config')
// view engine
app.set('views' , path.join(__dirname, 'views'));
app.set('view engine', 'hbs');
require('./config/hbs.config');
app.use(express.static(path.join(__dirname, 'public'))); 

//Middelewares
app.use(session);
app.use(passport.initialize());
app.use(passport.session());

app.use((req, res, next) => { 
res.locals.path = req.path;
res.locals.sessionUser = req.user;
next();
});

/*
app.use((req, res, next) => {
  res.locals.currentUser = req.session.userId;
 
  if (req.session.userId || req.path !== '/login') {
    User.findById(req.session.userId)
    .then((user) => {
      if (user) {
      res.locals.currentUser = user;
      req.currentUser = user;
      next();
      }else {
        res.redirect('/users/login');
      }
    })
    .catch(() => {
      res.redirect('/users/login');
    });
  }else{
    res.redirect('/users/login');
  }
});
*/

const home = require('./config/routes.config'); 
app.use('/', home); module.exports = app; 

const port = Number(process.env.PORT || 3000);
app.listen(port, () => {
  console.log(`Ready! Listening on port ${port}`);
});