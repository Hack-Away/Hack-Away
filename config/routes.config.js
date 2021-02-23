const express = require('express');
const router = express.Router();
const productController = require('../controllers/product.controller')
const userController = require('../controllers/user.controller')
const Product = require('../models/product.model')
const secure = require('../middlewares/secure.middlewares')
const orderController = require('../controllers/order.controller')
const GOOGLE_OAUTH_SCOPES = ['https://www.googleapis.com/auth/userinfo.email', 'https://www.googleapis.com/auth/userinfo.profile'];
const passport = require('passport');
const commonController = require('../controllers/common.controller')
const commentController = require('../controllers/comment.controller')
const storage = require('./storage.config');

// RUTAS COMUNES

router.get('/', commonController.home)
router.get('/about', commonController.about)
router.get('/cookies', commonController.cookies)

// RUTAS AUTENTIFICACIÓN

router.get('/activate', userController.activate);
router.get('/authentication/google', passport.authenticate('google-auth', { scope: GOOGLE_OAUTH_SCOPES }));
router.get('/authentication/google/cb', userController.loginWithGoogle);

//RUTAS USERS

router.get('/users/register', userController.register);
router.post('/users/register', userController.doRegister);
router.get('/users/login', userController.login);
router.post('/users/login', userController.doLogin);
router.get('/users/profile/:id', userController.profile);
router.get('/users/logout', secure.isAuthenticated, userController.logout);
router.get('/users/edit/:id', secure.isAuthenticated, userController.edit)
router.post('/users/edit/:id', secure.isAuthenticated, storage.single('image'),userController.doEdit)
router.get('/users/delete/:id', secure.isAuthenticated, userController.delete)
router.get('/users/oldOrders/:id', secure.isAuthenticated, userController.orders)

//RUTAS PRODUCTS

router.get('/products/register', secure.isAuthenticated, productController.register);
router.post('/products/register', secure.isAuthenticated,storage.single('image'), productController.createProduct);
router.get('/products/edit/:id', secure.isAuthenticated, productController.edit)
router.post('/products/edit/:id', secure.isAuthenticated, productController.doEdit)
router.get('/products/list/:id', productController.list)
router.get('/products/delete/:id', secure.isAuthenticated, productController.delete)
router.get('/products/detail/:id', productController.detail)
router.get('/products/filter', productController.filter)

//RUTAS ORDER

router.get('/order/list', secure.isAuthenticated, orderController.list)
router.get('/order/add/:id', secure.isAuthenticated, orderController.addToOrder)
router.get('/order/update/add/:id', secure.isAuthenticated, orderController.addProduct)
router.get('/order/update/rest/:id', secure.isAuthenticated, orderController.restProduct)
router.get('/order/update/delete/:id', secure.isAuthenticated, orderController.deleteProduct)
router.get('/order/delete/:id', secure.isAuthenticated, orderController.deleteOrder)
router.get('/order/confirm/:id', secure.isAuthenticated, orderController.confirmOrder)
router.post('/order/confirm/:id', secure.isAuthenticated, orderController.sendOrder)
router.get('/order/rebuy/:id', secure.isAuthenticated, orderController.rebuy)

//RUTAS COMMENTS
router.get('/comments/new/:id', secure.isAuthenticated, commentController.new)
router.post('/comments/new/:id', secure.isAuthenticated, commentController.createComment)

module.exports = router;
