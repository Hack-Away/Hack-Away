const mongoose  = require('mongoose');
const Product = require('../models/product.model');
require('../config/hbs.config');

module.exports.register = (req,res,next) => {
    res.render('products/new')
}

module.exports.createProduct = (req, res, next) => {

    function renderWithErrors(errors) {
        console.log(errors)
        res.status(400).render('products/new', {
            product: req.body,
            errors: errors
        });
    };

    console.log(req.body)

    Product.create(req.body)
        .then(product => {
            if (product){
                console.log('crea el producto')
                res.redirect('/')
            } else {
                console.log('no crea el producto porque no existe')
                next()
            }
        })
        .catch(error => {
           if (error instanceof mongoose.Error.ValidationError){
             renderWithErrors(error.errors)
           } else {
             next(error)
           }
        })
}