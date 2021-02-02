const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const app = express();
const bcrypt = require('bcrypt');
require('dotenv').config()
const session = require('./config/session.config');

app.use(bodyParser.urlencoded({ extended: false })); 

//Middelewares

app.use(session);


/* no esta protegido login
app.use((req, res, next) => {
  res.locals.currentUser = req.session.userId;
  if (req.session.userId || req.path != '/login') {
    next();
  }else {
    res.redirect('/login');
  }

})
*/

// base de datos
require('./config/db.config')


// view engine
app.set('views' , path.join(__dirname, 'views'));
app.set('view engine', 'hbs');
require('./config/hbs.config');
app.use(express.static(path.join(__dirname, 'public'))); 

app.use((req,res,next) => { res.locals.path = req.path; next(); }); 

const home = require('./config/routes.config'); 
app.use('/', home); module.exports = app; 

const port = Number(process.env.PORT || 3000);
app.listen(port, () => {
  console.log(`Ready! Listening on port ${port}`);
});