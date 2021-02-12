const  mongoose = require('mongoose')
const Comment = require('../models/comment.model')
require('../config/hbs.config')
const Product = require('../models/product.model')

module.exports.new = (req, res, next) => {
    const {id} = req.params
    Product.findById(id)
        .then(product => {
            res.render('comments/new', {product})
        })
        .catch(error => {
            console.log(error)
            next()
        })
}

module.exports.createComment = (req,res,next) => {

    console.log('hey')
    const { id } = req.params

    console.log('---CREATE COMMENT--- params ', req.query)
    console.log('---CREATE COMMENT--- id ', id)
    //console.log(req.body.productId)
       

    function renderWithErrors(errors) {
        console.log(errors)
        res.status(400).render('comments/new', {
            comment: req.body,
            errors: errors,
            product:product
        });
    };

    req.body.idProduct = id
    console.log(req.body)
    Comment.create(req.body)
        .then(comment => {
            Product.findById(id)
                .then(product => {
                    console.log(product.id)
                    res.render(`products/detail` , { product })
                })
                .catch(error => {
                    console.log('---CREATE COMMENT--- error al encontrar el producto')
                    renderWithErrors(error)
                })
        })
        .catch(error => {
            if (error instanceof mongoose.Error.ValidationError){
                console.log('---CREATE COMMENT--- error al crear el comentario')
                renderWithErrors(error.errors)
            } else {
                next(error)
            }
        })
}