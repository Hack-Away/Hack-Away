const mongoose = require('mongoose');
const User = require('../models/user.model');
require('../config/hbs.config');

module.exports.register = (req, res, next) => {
    res.render('users/new');
}

module.exports.doRegister = (req, res, next) => {
  User.create(req.body)
    .then((user) => {
      console.log('pasa por creacion de user')
      res.render('home', {user})
    })
    .catch(error => {
      console.log('error en creacion de user', error)
    })

}