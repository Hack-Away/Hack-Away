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

    

    req.body.createdBy = res.locals.sessionUser._id;

    const sessionUser = res.locals.sessionUser

    Product.create(req.body)
        .then(product => {
            if (product){
                console.log('crea el producto')
                res.redirect(`../users/profile/${sessionUser.id}`)
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

module.exports.edit = (req,res,next) => {

    function renderWithErrors(errors) {
        res.status(400).render(`products/edit/${product.id}`, {
            product: req.body,
            errors: errors
        });
    };

    const {id} = req.params;
  
    Product.findOne({ _id: id})
        .then(product => {
            res.render('products/edit', {product})
        })
        .catch(error => {
            renderWithErrors(error)
        })
    
}

module.exports.doEdit = (req, res, next) => {
    
    function renderWithErrors(errors) {
        res.status(400).render('users/login', {
            user: req.body,
            errors: errors
        });
    };

    const { id } = req.params;
    const user = res.locals.currentUser;

    Product.findByIdAndUpdate(id, {$set:req.body})
        .then(product => {
            res.render(`products/detail`, {product})
        })
        .catch(error => {
            renderWithErrors(error)
        })
}

module.exports.list = (req, res, next ) => {

    function renderWithErrors(errors) {
        res.status(400).render(`products/edit/${product.id}`, {
            product: req.body,
            errors: errors
        });
    };
    
    const { id } = req.params;
   
    Product.find({createdBy:id})
        .then(products => {
            if(products){
                res.render('products/list', {products})
            } else {
                next()
            }
        })
        .catch(error => {
            renderWithErrors(error)
        })
 
}

module.exports.delete = (req, res, next) => {

    function renderWithErrors(errors) {
    
        res.status(400).render(`products/edit/${product.id}`, {
            product: req.body,
            errors: errors
        });
    };

    const {id} = req.params;
    const user = res.locals.sessionUser;

    Product.findByIdAndDelete(id)
        .then( product => {
            // TODO que redireccione a la lista de productos
            res.redirect(`../../users/profile/${user.id}`)
        })
        .catch(error => {
            renderWithErrors(error)    
        })
}

module.exports.detail = (req, res, next) => {

    function renderWithErrors(errors) {
        res.status(400).render(`products/edit/${product.id}`, {
            product: req.body,
            errors: errors
        });
    };

    const { id } = req.params
    
    if (res.locals.sessionUser === undefined){
        res.locals.sessionUser = ''
    }
    
    const sessionUser = res.locals.sessionUser;
    
    Product.findById(id)
        .then(product => {
            console.log(sessionUser)
            res.render('products/detail', {
                product:product,
                sessionUser: sessionUser
            })
        })
        .catch(error => {
            renderWithErrors(error)
        }) 
    
}