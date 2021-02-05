const express = require('express');
const router = express.Router();
const productController = require('../controllers/product.controller')
const userController = require('../controllers/user.controller')
const Product = require('../models/product.model')
const secure = require('../middlewares/secure.middlewares')
//nuevo
const GOOGLE_OAUTH_SCOPES = ['http://www.googleapis.com/auth/userinfo.email', 'http://www.googleapis.com/auth/userinfo.profile'];
const passport = require('passport');

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

//no estoy seguro si la ruta aqui es la correcta
router.get('/activate',secure.isAuthenticated, userController.activate);

router.get('/users/register',secure.isAuthenticated, userController.register);
router.post('/users/register',secure.isAuthenticated, userController.doRegister);
router.get('/users/login', userController.login);
router.post('/users/login', userController.doLogin);
//router.get('/users/profile',secure.isAuthenticated, userController.profile);


router.get('/products/register',secure.isAuthenticated, productController.register);
router.post('/products/register',secure.isAuthenticated, productController.createProduct);
//nuevo
router.get('/authentication/google', passport.authenticate('google-auth', { scope: GOOGLE_OAUTH_SCOPES }));
router.get('/authentication/google/cb', userController.loginWithGoogle);

module.exports = router;