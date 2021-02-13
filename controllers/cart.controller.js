const mongoose = require('mongoose');
const Product = require('../models/product.model');
require('../config/hbs.config');

module.exports.remove = (req, res, next) => {
    const {id} = req.params;
    const order = [];
    const totalItems = order.length;
}


module.exports.add = (req, res, next) => {
    const {id} = req.params;
    console.log(req.params, req.body, req.query );
    let order = [];
    console.log('cart controller', id);
    
    Product.findById(id)
        .then(product => {
            order.push(product);
            let totalPrice = 0;
            console.log(order);
            for (let product of order) {
            totalPrice += product.price;
        }
            const totalItems = order.length;
            console.log('aqui');
            res.render('cart/list', {  
              order:order,
              totalItems:totalItems,
              totalPrice:totalPrice
        })
    })
    .catch(error => console.log(error))
}
