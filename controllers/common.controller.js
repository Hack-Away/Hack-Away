const mongoose = require('mongoose');
require('../config/hbs.config');
const Product = require('../models/product.model')
const User = require('../models/user.model')

module.exports.home = (req, res, next) => {
    Product.find()
        .then(products => {
            if (products) {
                User.find()
                    .then(users => {
                        let productsLimit = products.slice(0, 3)
                        let usersSortList = users.slice(0, 3);
                        res.render('home', { 
                            products: productsLimit,
                            users: usersSortList
                        });
                    })
                    .catch(error => {
                        console.log(error)
                        next()
                    })
            } else {
                next()
            }
        })
        .catch(error => {
            console.error('no carga la lista de productos');
            res.redirect('/')
        })

  // res.render('home')
}

module.exports.about = (req, res,next) => {
    res.render('about')
}

module.exports.cookies = (req, res, next) => {
    res.render('cookies')
}



