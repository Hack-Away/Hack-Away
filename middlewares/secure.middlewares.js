module.exports.isAuthenticated = (req, res, next) => {
 
  if (req.isAuthenticated()) {
    console.log('user auteticathed');
      next();
  }else{
        console.log('no autenticado');
        res.render('users/new');
       }
}

/*
const createError = require('http-errors');

module.exports.isAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
    next();
  } else {
    res.status(401).redirect('/login');
  }
};

module.exports.checkRole = (role) => {
  return (req, res, next) => {
    if (req.user.role === role) {
      next();
    } else {
      next(createError(403, 'You must not be here'));
    }
  }
}
*/