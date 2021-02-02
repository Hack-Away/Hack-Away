const mongoose = require('mongoose');
const User = require('../models/user.model');
require('../config/hbs.config');
const bcrypt = require('bcrypt');

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

  User.findOne({email: req.body.email, verified:{ $ne: null} , password: req.body.password})
    .then(user => { 
      if (user){
        user.checkPassword(req.body.password)
        .then(match => {
          if(match){
            //sesion iniciada 2 opciones
            req.session.currentUserId = user.id;
            // req.session.userId = user.id; 
            res.redirect('/home');
          }else {
           // res.render('user/login', { user: req.body, errors: {password: 'Invalid password'}});
            res.render('user/login', { user: req.body, errors: { email: 'User not found or not verified'} }) 
          }
/* revisar esta parte me da error y dara error sin esta lina por la declaracion linea 68 
else {
  res.render('user/login', { user: req.body, errors: { email: 'User not found or not verified'} })
}
*/

        });
        // 
        res.render(`users/profile`, { user });
      } else {
        renderWithErrors({user: "User not find"});
      }})
    .catch(error => {
      renderWithErrors(error);
    });
  
}

/*
else {
  res.render('user/login', { user: req.body, errors: { email: 'User not found or not verified'} })
}
*/
