const mongoose = require('mongoose');
const User = require('../models/user.model');
require('../config/hbs.config');
const bcrypt = require('bcrypt');

  module.exports.register = (req, res, next) => {
    res.render('users/new');
}

module.exports.doRegister = (req, res, next) => {

  function renderWithErrors(errors) {
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
          renderWithErrors({password:'Password needs 8 char at least'})
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

  User.findOne({email: req.body.email},{password: req.body.password})
    .then(user => { 
      console.log(user,'cuando devuelve el usuario')
      if (user){
        console.log('empieza a comprobar contraseña')
        user.checkPassword(req.body.password)
        .then(match => {
          if(match){
            console.log('coincide la password')
            req.session.currentUserId = user.id; 
            res.render(`users/profile`, { user });
          } else {
          // res.render('user/login', { user: req.body, errors: {password: 'Invalid password'}});
             console.log('no coincide las pass')
             res.render('users/login', { user: req.body, errors: { email: 'User not found or not verified'} }) 
          }
        });
      } else {
        renderWithErrors({user: "User not found"});
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
