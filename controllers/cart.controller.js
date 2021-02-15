const mongoose = require('mongoose');
const Product = require('../models/product.model');
require('../config/hbs.config');
const Cart = require('../models/cart.model');

module.exports.remove = (req, res, next) => {
    const {id} = req.params;
    const order = [];
    const totalItems = order.length;
}


module.exports.add = (req, res, next) => {
    const {id} = req.params;
    
    let order = [];
    
    
    Product.findById(id)
        .then(product => {
            product.qty = 1;
            product.total = product.qty * product.price
            order.push(product);
            let totalPrice = 0;
          
            for (let product of order) {
                totalPrice += product.price;
            }
            const totalItems = order.length;
         
            res.render('cart/list', {  
              order:order,
              totalItems:totalItems,
              totalPrice:totalPrice
        })
    })
    .catch(error => console.log(error))
}

module.exports.create = (req, res, next) => {
            
            let {order} = req.body 
            let product= {
                    price : req.body.price,
                    qty : req.body.qty,
                    name: req.body.name
                }   
            
            order = {
                productList: [],
                createdBy: req.body.createdBy
                
            }
            order.productList.push(product);
            console.log(order.productList)
            let products = order.productList
            Cart.create(order)
                .then(order => {
                    res.render('cart/order', {order: products});
                })
                .catch(error => {
                    console.log('Error al crear contenido de cesta',error);
                    next(error)
                })
        
       
   
}