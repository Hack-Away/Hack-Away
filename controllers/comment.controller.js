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

    const { id } = req.params

    function renderWithErrors(errors) {
        console.log(errors)
        res.status(400).render('comments/new', {
            comment: req.body,
            errors: errors,
            product:product
        });
    };

    req.body.createdBy = res.locals.sessionUser.name
    req.body.idProduct = id
    console.log(req.body)
    Comment.create(req.body)
        .then(comment => {
            Comment.find({idProduct:id})
                .then(comments => {
                    console.log('---- encuentra los comentarios y los busca por el id----')
                    let rates = 0;
                    for (let comment of comments){
                        rates += comment.rating
                    }
                    const newRate = rates/comments.length
                    const newRateShort = newRate.toFixed(1)

                    Product.findByIdAndUpdate(id, { rating: newRateShort  })
                        .then(product => {
                            res.render(`products/detail`, { product })
                        })
                        .catch(error => {
                            console.log('---CREATE COMMENT--- error al encontrar el producto')
                            renderWithErrors(error)
                        })

                })
                .catch(error => console.errors(error))
           
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