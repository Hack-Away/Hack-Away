const mongoose = require('mongoose');
const User = require('../models/user.model');
require('../config/hbs.config');
const bcrypt = require('bcrypt');
const mailer = require('../config/mailer.config');


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

  User.findOne({email:req.body.email, 'verified.date': { $ne: null } })
  .then(user => {
    if (user) {
      renderWithErrors({email:'Invalid email or password'})
    } else {
      
       return User.create(req.body)
        .then((user) => {
          mailer.sendValidationEmail(user.email, user.verified.token, user.name);
          res.redirect('user/profile');
          // res.render(`users/profile`, {user: req.body, errors: { email:'user not found'} });
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
  
    res.status(400).render('users/login', {
      user: req.body,
      errors: errors
    });
  };

  User.findOne({email: req.body.email})
    .then(user => { 
      

      if (user){
        
        user.checkPassword(req.body.password)
        .then(match => {
          if(match){
            
            req.session.currentUserId = user.id; 
            res.render('users/profile', { user });
          } else {
          // res.render('user/login', { user: req.body, errors: {password: 'Invalid password'}});
             
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

module.exports.activate = (req, ses, next) => {
  User.findOneAndUpdate({'verified.token': req.query.token},
   { $set: {'verified.date': new Date() } },
   { runValidators: true}, 
   )
   .then(user => {
     if(user) {
        res.redirect('user/login');
     }else {
      res.redirect('user/login');
     }
   })
   .catch(next)
};
