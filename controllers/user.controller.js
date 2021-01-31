const mongoose = require('mongoose');
const User = require('../models/user.model');
require('../config/hbs.config');

module.exports.register = (req, res, next) => {
    res.render('users/new');
}

module.exports.doRegister = (req, res, next) => {

  function renderWithErrors(errors) {
    console.log(errors)
    res.status(400).render('users/new', {
      user:req.body,
      errors:errors 
    });
  };

  User.findOne({email:req.body.email})
  .then(user => {
    if (user) {
      renderWithErrors({email:'Invalid email or password'})
    } else {
      User.create(req.body)
        .then((user) => {
          res.render(`users/profile`, {user});
        })
        .catch(error => {
          renderWithErrors({password: 'password does not match'})
        })
    }
  })
  .catch(error => {
    renderWithErrors(error)
  })
}

module.exports.login = (req, res, next) => {
  res.render('users/login')
}

module.exports.doLogin = (req, res, next) => {

  function renderWithErrors(errors) {
    console.log(errors)
    res.status(400).render('users/login', {
      user: req.body,
      errors: errors
    });
  };

  User.findOne({email: req.body.email, password: req.body.password})
    .then(user => { 
      if (user){
        //TODO check password if match
        res.render(`users/profile`, { user });
      } else {
        renderWithErrors({user: "User not find"});
      }})
    .catch(error => {
      renderWithErrors(error);
    });
  
}