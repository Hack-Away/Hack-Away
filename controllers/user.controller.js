const mongoose = require('mongoose');
const User = require('../models/user.model');
require('../config/hbs.config');
const bcrypt = require('bcrypt');
const mailer = require('../config/mailer.config');
const passport = require('passport');


  module.exports.register = (req, res, next) => {
    res.render('users/new');
}

module.exports.doRegister = (req, res, next) => {

  function renderWithErrors(errors) {
    console.log('usercontroller error');

    res.status(400).render('users/new', {
      user:req.body,
      errors:errors 
    });
  };

  User.findOne({email:req.body.email, 'verified.date': { $ne: null } })
  .then(user => {
    console.log('usercontroller1');
    if (user) {
      renderWithErrors({email:'Invalid email or password'})
    } else {
      console.log('usercontroller2');
       return User.create(req.body)
        .then((user) => {
          console.log('usercontroller3');
          mailer.sendValidationEmail(user.email, user.verified.token, user.name);
          res.render('users/profile', { user });
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

  passport.authenticate('local-auth', (error, user, validations) => {
    console.log('usercontrollogin');
    if(error){
      console.log('usercontrollogin1');
      next(error);
    } else if (user){
      console.log('usercontrollogin2');
      req.login(user, error => {
          if(error) next(error)
          //revisar ruta
          else res.render('users/profile', { user })

      })
      req.session.currentUserId = user.id
      //revisar la ruta
      
      res.redirect('/')

    } else{
      console.log('usercontrollo else');
      res.render('users/login', {user: req.body, errors: validations});
    }

  })(req, res, next);

// nuevo logout
  module.exports.logout = (req, res, next) => {
    req.logout();
    res.redirect('users/login')
  }

  /* 
  en teoria se puede borrar esto pero checamos 
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
 */ 
}
module.exports.activate = (req, ses, next) => {
  User.findOneAndUpdate({'verified.token': req.query.token},
   { $set: {'verified.date': new Date() } },
   { runValidators: true}, 
   )
   .then(user => {
     if(user) {
        res.redirect('users/login');
     }else {
      res.redirect('users/login');
     }
   })
   .catch(next)
};


module.exports.loginWithGoogle = (req, res, next) => {
  passport.authenticate('google-auth', (error, user, validations) => {
    if (error) {
      next(error);
    } else if (!user) {
      res.status(400).render('users/login', { user: req.body, errors: validations });
    } else {
      req.login(user, error => {
        if (error) next(error)
        else res.redirect('/')
      })
    }
  })(req, res, next);
}

/*
module.exports.loginWithGoogle = (req, ses, next) => {
  passport.authenticate('google-auth', (error, user, validations )=> {
    if(error){
      next(error);
    } else if (user){

      req.login(user, error => {
          if(error) next(error)
          //revisar ruta
          else res.redirect('/')

      })
      req.session.currentUserId = user.id
      //revisar la ruta
      
      res.redirect('/')
    } else{
      res.render('users/profile', {user: req.body, errors: validations});
    }

  })(req, res, next);

 }
 */