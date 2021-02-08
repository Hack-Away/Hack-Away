const mongoose = require('mongoose');
const Product = require('../models/product.model');
require('../config/hbs.config');

module.exports.cart = (req,res,next) => {
    res.render('cart/list')
}