const mongoose = require('mongoose');
const User = require('../models/user.model');
require('../config/hbs.config');

module.exports.register = (req, res, next) => {
    res.render('users/new');
}