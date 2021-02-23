const mongoose  = require('mongoose');
const Product = require('../models/product.model');
const User = require('../models/user.model')
require('../config/hbs.config');
const qs = require('qs')
const Comment = require('../models/comment.model')

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

    
   const product = req.body;
    product.createdBy = res.locals.sessionUser.name;

    if(req.file){
        product.avatarProd= req.file.path;
    }

    const sessionUser = res.locals.sessionUser

    console.log(req.file);
    
    Product.create(product)
        .then(product => {
            if (product){

                res.redirect(`../users/profile/${sessionUser.id}`)
            } else {
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

    User.findById(id)
        .then(user => {
            console.log(user)
            Product.find({createdBy:user.name})
                .then(products => {
                    if (products) {
                    res.render('products/list', {products, user})
                } else {
                    next()
                }
                })
                .catch(error => {
                    console.log(error)
                    next()
                })
        })
        .catch(error => console.log(error))
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
            Comment.find({idProduct: id})
                .then(comments => {
                    res.render('products/detail', {
                        product: product,
                        comments:comments,
                        sessionUser: sessionUser
                    })
                })
                .catch(error => {
                    console.errors(error)
                    next()
                })
        })
        .catch(error => {
            renderWithErrors(error)
        }) 
}

module.exports.filter = (req, res, next) => {

    const {filter = {}, sort = {}} = qs.parse(qs.stringify(req.query), {allowDots:true})
    
    if (filter.name) filter.name = new RegExp(filter.name, 'i')
    else delete filter.name

    let sortBy = {}

    console.log(sort)

    if (sort.type === 'best') {
        sortBy = {
            rating: sort.type === 'best' ? -1 : 1
        }}

    if (sort.type === 'cheaper') {
        sortBy = {
            price: sort.type === 'cheaper' ? 1 : -1
        }
    }

    Product.find(filter)
            .sort(sortBy)
            .then(products => {
                res.render('products/filter', { products })
            })
            .catch(error => { 
                console.log(error)
                next() 
            })
}