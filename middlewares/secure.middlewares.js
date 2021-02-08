const User = require('../models/user.model');

module.exports.isAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
    next();
  } else {
    //res.status(401).redirect('user/login');
    res.redirect('users/login');
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

