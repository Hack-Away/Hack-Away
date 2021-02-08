const express = require('express');
const router = express.Router();
const productController = require('../controllers/product.controller')
const userController = require('../controllers/user.controller')
const Product = require('../models/product.model')
const secure = require('../middlewares/secure.middlewares')
const GOOGLE_OAUTH_SCOPES = ['https://www.googleapis.com/auth/userinfo.email', 'https://www.googleapis.com/auth/userinfo.profile'];
const passport = require('passport');
router.get('/', (req, res, next) => {
    Product.find()
        .then(products => {
            if (products) {
                res.render('home', { products });
            } else {
                res.render('home');
            }
        })
        .catch(error => {
            console.error('no carga la lista de productos');
            res.redirect('/')
        })
});


router.get('/activate',secure.isAuthenticated, userController.activate);
router.get('/users/register', userController.register);
router.post('/users/register', userController.doRegister);
router.post('/users/login', userController.doLogin);
router.get('/users/login', userController.login);
router.get('/users/profile/:id',secure.isAuthenticated, userController.profile);
router.get('/products/register',secure.isAuthenticated, productController.register);
router.post('/products/register',secure.isAuthenticated, productController.createProduct);
router.get('/authentication/google', passport.authenticate('google-auth', { scope: GOOGLE_OAUTH_SCOPES }));
router.get('/authentication/google/cb', userController.loginWithGoogle);
router.post('/users/logout', secure.isAuthenticated, userController.logout);

module.exports = router;