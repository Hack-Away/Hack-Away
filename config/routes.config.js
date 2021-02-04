const express = require('express');
const router = express.Router();
const productController = require('../controllers/product.controller')
const userController = require('../controllers/user.controller')
const Product = require('../models/product.model')

router.get('/', (req, res, next) => {
    Product.find()
        .then(products => {
            if (products){
                res.render('home', {products});
            } else {
                res.render('home');
            }
        })
        .catch(error => {
            console.error('no carga la lista de productos');
            res.redirect('/')
        })  
});

router.get('/users/register', userController.register);
router.post('/users/register', userController.doRegister);
router.get('/users/login', userController.login);
router.post('/users/login', userController.doLogin);
//router.get('/users/profile', userController.profile);

router.get('/products/register', productController.register);
router.post('/products/register', productController.createProduct);


module.exports = router;