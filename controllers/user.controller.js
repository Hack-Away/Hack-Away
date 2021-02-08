const mongoose = require('mongoose');
const User = require('../models/user.model');
require('../config/hbs.config');
const bcrypt = require('bcrypt');
const mailer = require('../config/mailer.config');
const passport = require('passport');
const Product = require('../models/product.model')


module.exports.register = (req, res, next) => {
    res.render('users/new');
}

module.exports.doRegister = (req, res, next) => {

  function renderWithErrors(errors) {
    console.log(errors);

    res.status(400).render('users/new', {
      
      user:req.body,
      errors:errors 
    });
  };

  User.findOne({email:req.body.email, 'verified.date': { $ne: null } })
  .then(user => {
    if (user) {
      renderWithErrors({emailRegister:'Invalid email or password'})
    } else {
       return User.create(req.body)
        .then((user) => {
          currentUser = user
         
          mailer.sendValidationEmail(user.email, user.verified.token, user.name);
          res.render('users/profile/:id', { currentUser });
        })
        .catch(error => {
          if(error instanceof mongoose.Error.ValidationError){
            renderWithErrors(error.errors)
          }else {
            renderWithErrors(error)
            
          }
          
        })
    }
  
  })
  .catch(error => {
    console.log('fallo al buscar usuario');
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
    if(error){
      next(error);
    } else if (user){
      req.login(user, error => {
          if(error) next(error)
          //revisar ruta
          else res.redirect('/');
      });
    } else{
      res.render('users/login', {user: req.body, errors: validations});
    }

  })(req, res, next);
};


module.exports.logout = (req, res, next) => {
  console.log('log out')
  req.logout();
  res.redirect('/users/login');
};

 
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

module.exports.profile = (req,res,next) => {
  const {currentUser} = res.locals;
  console.log('deberia buscar usuaruio para entrar en perfil con id')
  Product.find({createdBy:currentUser._id})
   .then(products => {
     console.log('encuentra los productos del usuario y renderiza')
     res.render('users/profile', {
       currentUser: currentUser,
       products: products,
     })
   })
   .catch(error => {'error: ', console.log(error)}) }
