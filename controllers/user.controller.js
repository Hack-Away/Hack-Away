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
    console.log('localiza usuario');
    if (user) {
      console.log('reconoce usuario');
      renderWithErrors({emailRegister:'Invalid email or password'})
    } else {
      console.log('crea usuario');
       return User.create(req.body)
        .then((user) => {
          currentUser = user
          console.log('usuario creado en mongo');
          mailer.sendValidationEmail(user.email, user.verified.token, user.name);
          res.render('users/profile/:id', { currentUser });
        })
        .catch(error => {
          console.log('fallo al crear usuario');
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

/*
  passport.authenticate('local-auth', (error, user, validations) => {
    if(error){
      next(error);
    } else if (user){
      req.login(user, error => {
          if(error) next(error)
          //revisar ruta
          else res.redirect('/', { user });
      });
      req.session.currentUserId = user.id
      //revisar la ruta
      
      res.redirect('/home')

    } else{
      console.log('usercontrollo else');
      res.render('users/login', {user: req.body, errors: validations});
    }

  })(req, res, next);
}
*/
// logout
module.exports.logout = (req, res, next) => {
  //req.session = null;
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
 
  Product.find({createdBy:currentUser._id})
   .then(products => {
     res.render('users/profile', {
       currentuser: currentUser,
       products: products,
     })
   })
   .catch(error => {'error: ', console.log(error)}) }
