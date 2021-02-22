const User = require('../models/user.model');

module.exports.isAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
    console.log('--- SECURE --- Autenticado')
    // TODO Aqui debería chequear el rol y distribuirlo a las views?
    next();
  } else {
    console.log('--- SECURE --- No autenticado')
    res.status(401).render('users/login');
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

