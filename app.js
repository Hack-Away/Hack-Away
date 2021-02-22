require('dotenv').config();
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

app.use(bodyParser.urlencoded({ extended: true })); 

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


//
const home = require('./config/routes.config'); 
app.use('/', home); module.exports = app; 

const port = Number(process.env.PORT || 3000);
app.listen(port, () => {
  console.log(`Ready! Listening on port ${port}`);
});

