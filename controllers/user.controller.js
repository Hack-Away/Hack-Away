const mongoose = require('mongoose');
const User = require('../models/user.model');
require('../config/hbs.config');

modules.exports.register = (req, res, next) => {
    res.render('users/new');
}