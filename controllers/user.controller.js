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

  
  console.log(req.file);

  User.findOne({email:req.body.email, 'verified.date': { $ne: null } })
  .then(user => {
    
    if (user) {
      renderWithErrors({emailRegister:'Invalid email or password'})
    } else {

       return User.create(req.body)
        .then((user) => {
          console.log('--- USER CONTROLLER --- Crea un usuario nuevo y lo registra en la base de datos')
          mailer.sendValidationEmail(user.email, user.verified.token, user.name);
          console.log('--- USER CONTROLLER --- Termina la funcion de envio de Mail de Verificacion al usuario', user.mail)
          // req.flash('data', JSON.stringify({verification: true}))
          // res.redirect('users/profile')
          res.render('users/profile', { sessionUser: user });
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
    console.log(errors);

    res.status(400).render('users/login', {

      user:req.body,
      errors:errors
    });
  };

  passport.authenticate('local-auth', (error, user, validations) => {
   
    if(error){
      next(error);
    } else if (user){
      req.login(user, error => {
        res.locals.sessionUser = user
        console.log(res.locals)
        console.log(user)
          if(error) next(error)
          
          else res.redirect('/');
      });
    } else{
      res.render('users/login', {user: req.body, errors: validations});
    }
    
   
  })(req, res, next);
  
};


module.exports.logout = (req, res, next) => {
  req.logout();
  res.locals.sessionUser = ''
  res.redirect('/');
};

 
module.exports.activate = (req, res, next) => {
  User.findOneAndUpdate({'verified.token': req.query.token},
   { $set: {'verified.date': new Date() } },
   { runValidators: true}, 
   )
   .then(user => {
     if(user) {
       console.log('el usuario se ha verificado correctamente')
       // TODO Mensaje en pantalla diciendo que el usuario se ha verificado correctamente
        res.redirect('/');
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

  
  const {id} = req.params;
  console.log(res.locals.sessionUser)

  if (res.locals.sessionUser === undefined) { 
    res.locals.sessionUser = '';
  }
  
  User.findById(id)
      .then(user => {
        if (user){
          Product.find({ createdBy: user.name })
            .then(products => {
                const productsLimit = products.slice(0, 3)
                res.render('users/profile', {
                  user: user,
                  products: productsLimit,
                  sessionUserId: res.locals.sessionUser.id
                })
            })
            .catch(error => {console.log(error)})
        } else {
          next()
        }})
      .catch(error => { console.log(error) })
}


module.exports.edit = (req,res, next) => {
  
  

    const {id } = req.params;

    User.findById(id)
        .then(user => {
          res.render('users/edit', {user})
        })
        .catch(error => console.log(error))
    
}

module.exports.doEdit = (req,res,next) => {
 
     function renderWithErrors(errors) {
 
       res.status(400).render('users/login', {
         user: req.body,
         errors: errors
       });
     };

    let { id } = req.params
   
    let newUser = req.body

    if(req.file){
      newUser.avatar= req.file.path;
    }
    //console.log('aqui',newUser);

    User.findByIdAndUpdate(id, {$set: newUser})
      .then(user => {
      
        res.redirect(`../../users/profile/${user.id}`)
      })
      .catch(error => {
        renderWithErrors(error)
      })
}

module.exports.delete = (req,res,next) => {

     function renderWithErrors(errors) {
       console.log(errors)
       res.status(400).render('/', {
         user: req.body,
         errors: errors
       });
     };

    const {id} = req.params
    

    User.findByIdAndDelete(id)
      .then(user => {
        res.locals.sessionUser = null;
        res.redirect('/')
        
      })
      .catch(error => {
        renderWithErrors(error)
      })
}

