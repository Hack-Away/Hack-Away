const Product = require('../models/product');
const User = require('../models/user.model')
const mongoose = require('mongoose');
const productsData = require('../data/products.json');
const userData = require('../data/users.json');

require('../config/db.config')

Product.create(productData);
User.create(userData);



